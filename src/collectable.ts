import { Collector } from "./collector";
import { from } from "./factory";
import { isCollector, isFunction, isIterable, isObject, isString } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
import type { BiConsumer, BiFunctional, Comparator, Consumer, Functional, Predicate, Supplier, TriConsumer, TriFunctional, MaybeInvalid, Generator, BiPredicate, TriPredicate } from "./utility";

export abstract class Collectable<E> {

    protected readonly Collectable: symbol = CollectableSymbol;

    public constructor() {

    }

    public anyMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return false;
        }, (element: E): boolean => {
            return predicate(element);
        }, (result: boolean, element: E): boolean => {
            return result || predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    public allMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return true;
        }, (element: E): boolean => {
            return !predicate(element);
        }, (result: boolean, element: E): boolean => {
            return result && predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    public collect<A, R>(collector: Collector<E, A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(argument1: Supplier<A> | Collector<E, A, R>, argument2?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>, argument3?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Functional<A, R>, argument4?: Functional<A, R>): R {
        let source: Generator<E> | Iterable<E> = this.source();
        if(isCollector(argument1)){
            let collector: Collector<E, A, R> = argument1 as Collector<E, A, R>;
            return collector.collect(source as Generator<E>);
        }
        if(isFunction(argument1) && isFunction(argument2) && isFunction(argument3)){
            let identity: Supplier<A> = argument1 as Supplier<A>;
            let accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> = argument2 as BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;
            let finisher: Functional<A, R> = argument3 as Functional<A, R>;
            let collector: Collector<E, A, R> = Collector.full(identity, accumulator, finisher);
            return collector.collect(source as Generator<E>);
        }
        if(isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)){
            let identity: Supplier<A> = argument1 as Supplier<A>;
            let interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A> = argument2 as Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;
            let accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> = argument3 as BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;
            let finisher: Functional<A, R> = argument4 as Functional<A, R>;
            let collector: Collector<E, A, R> = Collector.shortable(identity, interrupt, accumulator, finisher);
            return collector.collect(source as Generator<E>);
        }
        throw new TypeError("Invalid arguments.");
    }

    public count(): bigint {
        return this.collect<bigint, bigint>((): bigint => {
            return 0n;
        }, (count: bigint): bigint => {
            return count + 1n;
        }, (count: bigint): bigint => {
            return count;
        });
    }

    public isEmpty(): boolean {
        return this.count() === 0n;
    }

    public findAny(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() && Math.random() > 0.5 ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public findFirst(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public findLast(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public forEach(action: Consumer<E>): void
    public forEach(action: BiConsumer<E, bigint>): void
    public forEach(action: Consumer<E> | BiConsumer<E, bigint>): void {
        if (isFunction(action)) {
            this.collect<bigint, bigint>((): bigint => {
                return 0n;
            }, (count: bigint, element: E): bigint => {
                action(element, count);
                return count + 1n;
            }, (count: bigint): bigint => {
                return count;
            });
        }
    }

    public group<K>(classifier: Functional<E, K>): Map<K, Array<E>> {
        if (isFunction(classifier)) {
            return this.collect<Map<K, Array<E>>, Map<K, Array<E>>>((): Map<K, Array<E>> => {
                return new Map<K, Array<E>>();
            }, (map: Map<K, Array<E>>, element: E): Map<K, Array<E>> => {
                let key: K = classifier(element);
                let raw: MaybeInvalid<Array<E>> = map.get(key);
                let array: Array<E> = validate(raw) ? raw : [];
                array.push(element);
                map.set(key, array);
                return map;
            }, (map: Map<K, Array<E>>): Map<K, Array<E>> => {
                return map;
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>> {
        return this.collect<Map<K, Array<V>>, Map<K, Array<V>>>((): Map<K, Array<V>> => {
            return new Map<K, Array<V>>();
        }, (map: Map<K, Array<V>>, element: E): Map<K, Array<V>> => {
            let key: K = keyExtractor(element);
            let value: V = valueExtractor(element);
            let group: Array<V> = (validate(map.get(key)) ? map.get(key) : []) as Array<V>;
            group.push(value);
            map.set(key, group);
            return map;
        }, (map: Map<K, Array<V>>): Map<K, Array<V>> => {
            return map;
        });
    }

    public join(): string;
    public join(delimiter: string): string;
    public join(prefix: string, delimiter: string, suffix: string): string;
    public join(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): string;
    public join(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string;
    public join(argument1?: string, argument2?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): string {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + element + ",";
            }, (text: string): string => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let delimiter: string = argument1;
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + element + delimiter;
            }, (text: string): string => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>;
            let suffix: string = argument3;
            return this.collect<string, string>((): string => {
                return prefix;
            }, (text: string, element: E, index: bigint): string => {
                return text + accumulator(text, element, index);
            }, (text: string): string => {
                return text + suffix;
            });
        }
        if (isString(argument1) && isString(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let delimiter: string = argument2;
            let suffix: string = argument3;
            return this.collect<string, string>((): string => {
                return prefix;
            }, (text: string, element: E): string => {
                return text + element + delimiter;
            }, (text: string): string => {
                return text + suffix;
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public log(): void;
    public log(accumulator: BiFunctional<string, E, string>): void;
    public log(accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>): void;
    public log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public log(argument1?: string | BiConsumer<string, E> | TriConsumer<string, E, bigint>, argument2?: BiConsumer<string, E> | TriConsumer<string, E, bigint>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let text: string = this.join();
            console.log(text);
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>;
            let text: string = this.join("[", accumulator, "]");
            console.log(text);
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public nonMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return true;
        }, (element: E): boolean => {
            return predicate(element);
        }, (result: boolean, element: E) => {
            return result || predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    public partition(count: bigint): Array<Array<E>> {
        let limited = count > 1n ? count : 1n;
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            let index: bigint = limited % BigInt(array.length);
            if (index === 0n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    public partitionBy(classifier: Functional<E, bigint>): Array<Array<E>> {
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            let index: bigint = classifier(element);
            while (index > BigInt(array.length) - 1n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    public reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    public reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    public reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    public reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    public reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: BiFunctional<R, R, R>): R;
    public reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: BiFunctional<R, R, R>): R;
    reduce<R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: BiFunctional<R, R, R>): R | E | Optional<E> {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
            return this.collect<Optional<E>, Optional<E>>((): Optional<E> => Optional.ofNullable<E>(),
                (result: Optional<E>, element: E, index: bigint): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        return Optional.of(accumulator(current, element, index));
                    }
                },
                (result: Optional<E>): Optional<E> => result
            );
        } else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            let identity = argument1 as E;
            let accumulator = argument2 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
            return this.collect<E, E>(() => identity,
                (result: E, element: E, index: bigint): E => {
                    return accumulator(result, element, index);
                },
                (result: E): E => result
            );
        } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1 as R;
            let accumulator = argument2 as BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>;
            let finisher = argument3 as BiFunctional<R, R, R>;
            return this.collect<R, R>(() => identity,
                (result: R, element: E, index: bigint): R => {
                    return accumulator(result, element, index);
                },
                (result: R): R => finisher(result, result)
            );
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public semantic(): Semantic<E> {
        let source: Generator<E> | Iterable<E> = this.source();
        if (isIterable(source)) {
            return from(source);
        } else if (isFunction(source)) {
            return new Semantic(source);
        } else {
            throw new TypeError("Invalid source.");
        }
    }

    protected abstract source(): Generator<E> | Iterable<E>;

    public toArray(): Array<E> {
        return this.collect<Array<E>, Array<E>>((): Array<E> => {
            return [];
        }, (array: Array<E>, element: E): Array<E> => {
            array.push(element);
            return array;
        }, (result: Array<E>): Array<E> => {
            return result;
        });
    }

    public toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
        return this.collect<Map<K, V>, Map<K, V>>((): Map<K, V> => {
            return new Map<K, V>();
        }, (map: Map<K, V>, element: E): Map<K, V> => {
            let key: K = keyExtractor(element);
            let value: V = valueExtractor(element);
            map.set(key, value);
            return map;
        }, (map: Map<K, V>): Map<K, V> => {
            return map;
        });
    }

    public toSet(): Set<E> {
        return this.collect<Set<E>, Set<E>>((): Set<E> => {
            return new Set<E>();
        }, (set: Set<E>, element: E): Set<E> => {
            set.add(element);
            return set;
        }, (result: Set<E>): Set<E> => {
            return result;
        });
    }

    public write(stream: WritableStream<string>): Promise<WritableStream<string>>;
    public write(stream: WritableStream<string>, accumulator: BiFunctional<E, bigint, string>): Promise<WritableStream<string>>;
    public write(stream: WritableStream<Uint8Array>, accumulator: BiFunctional<E, bigint, Uint8Array>): Promise<WritableStream<Uint8Array>>;
    public write(stream: WritableStream<string | Uint8Array | string>, accumulator?: BiFunctional<E, bigint, Uint8Array | string>): Promise<WritableStream<string>> | Promise<WritableStream<Uint8Array | string>> {
        if (isObject(stream) && invalidate(accumulator)) {
            let optional: Optional<WritableStream<string>> = this.collect<Optional<WritableStream<string>>, Optional<WritableStream<string>>>((): Optional<WritableStream<string>> => {
                return Optional.ofNonNull<WritableStream<string>>(stream);
            }, (result: Optional<WritableStream<string>>, element: E): Optional<WritableStream<string>> => {
                try {
                    return result.map((stream: WritableStream<string>): WritableStream<string> => {
                        let writer: WritableStreamDefaultWriter<string> = stream.getWriter();
                        writer.write(String(element));
                        return stream;
                    });
                } catch (reason) {
                    return Optional.empty();
                }
            }, (a: Optional<WritableStream<string>>): Optional<WritableStream<string>> => {
                return a;
            });
            return new Promise<WritableStream<string>>((resolve, reject) => {
                optional.ifPresent(resolve, reject);
            });
        } else if (isObject(stream) && isFunction(accumulator)) {
            let optional: Optional<WritableStream<Uint8Array | string>> = this.collect<Optional<WritableStream<Uint8Array | string>>, Optional<WritableStream<Uint8Array | string>>>((): Optional<WritableStream<Uint8Array | string>> => {
                return Optional.ofNonNull<WritableStream<Uint8Array | string>>(stream);
            }, (result: Optional<WritableStream<Uint8Array | string>>, element: E, index: bigint): Optional<WritableStream<Uint8Array | string>> => {
                try {
                    return result.map((stream: WritableStream<Uint8Array | string>): WritableStream<Uint8Array | string> => {
                        let writer: WritableStreamDefaultWriter<Uint8Array | string> = stream.getWriter();
                        writer.write(accumulator(element, index));
                        return stream;
                    });
                } catch (reason) {
                    return Optional.empty();
                }
            }, (a: Optional<WritableStream<Uint8Array | string>>): Optional<WritableStream<Uint8Array | string>> => {
                return a;
            });
            return new Promise<WritableStream<Uint8Array | string>>((resolve, reject) => {
                optional.ifPresent(resolve, reject);
            });
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }
};

export class UnorderedCollectable<E> extends Collectable<E> {

    protected readonly UnorderedCollectable: symbol = UnorderedCollectableSymbol;

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>) {
        super();
        this.generator = generator;
    }

    public source(): Generator<E> {
        return this.generator;
    }
};

type Indexed<K, V> = {
    index: K;
    value: V;
}
export class OrderedCollectable<E> extends Collectable<E> {

    protected readonly OrderedCollectable: symbol = OrderedCollectableSymbol;

    protected ordered: Array<Indexed<bigint, E>> = [];

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(argument1: Iterable<E> | Generator<E>, argument2?: Comparator<E>) {
        super();
        let buffer: Array<Indexed<bigint, E>> = [];
        if (isIterable(argument1)) {
            let iterable: Iterable<E> = argument1;
            let index: bigint = 0n;
            for (let element of iterable) {
                buffer.push({
                    index: index,
                    value: element
                });
                index++;
            }
        } else if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            generator((element: E, index: bigint): void => {
                buffer.push({
                    index: index,
                    value: element
                });
            }, (): boolean => false);

        } else {
            throw new TypeError("Invalid arguments.");
        }
        buffer.map((indexed: Indexed<bigint, E>, _index: number, array: Array<Indexed<bigint, E>>): Indexed<bigint, E> => {
            let length: bigint = BigInt(array.length);
            return {
                index: ((indexed.index % length) + length) % length,
                value: indexed.value
            }
        }).sort((a: Indexed<bigint, E>, b: Indexed<bigint, E>): number => {
            if(isFunction(argument2)){
                let comparator: Comparator<E> = argument2;
                return comparator(a.value, b.value);
            }else{
                return useCompare(a.index, b.index);
            }
        }).forEach((indexed: Indexed<bigint, E>) => {
            this.ordered.push(indexed);
        });
    }

    public override source(): Generator<E> | Iterable<E> {
        return this.ordered.map((indexed: Indexed<bigint, E>) => indexed.value);
    }
};

export class WindowCollectable<E> extends OrderedCollectable<E> {

    protected readonly WindowCollectable: symbol = WindowCollectableSymbol;

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            let source: Array<E> = this.toArray();
            let windows: Array<Array<E>> = [];
            let windowStartIndex: bigint = 0n;
            while (windowStartIndex < BigInt(source.length)) {
                let windowEnd = windowStartIndex + size;
                let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                if (window.length > 0) {
                    windows.push(window);
                }
                windowStartIndex += step;
            }
            return from(windows).map((window: Array<E>) => from(window));
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        return this.slide(size, size);
    }
};