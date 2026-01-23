import type { Collectable } from "./collectable";
import { isBigInt, isBoolean, isCollectable, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { Optional } from "./optional";
import type { Semantic } from "./semantic";
import { CollectableSymbol } from "./symbol";
import { type BiFunctional, type BiPredicate, type Functional, type Predicate, type Supplier, type TriFunctional, type Generator, type TriPredicate, validate, type Consumer, type BiConsumer, invalidate } from "./utility";

export class Collector<E, A, R> {

    protected identity: Supplier<A>;

    protected interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;

    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;

    protected finisher: Functional<A, R>;

    protected readonly Collector: symbol = CollectableSymbol;

    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        } else {
            throw new TypeError("Invalid arguments");
        }
    }

    public collect(generator: Generator<E>): R;
    public collect(iterable: Iterable<E>): R;
    public collect(semantic: Semantic<E>): R;
    public collect(collectable: Collectable<E>): R;
    public collect(start: number, end: number): R;
    public collect(start: bigint, end: bigint): R;
    public collect(argument1: Generator<E> | Iterable<E> | Semantic<E> | Collectable<E> | number | bigint, argument2?: number | bigint): R {
        let accumulator: A = this.identity();
        let count: bigint = 0n;
        if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            generator((element: E, index: bigint): void => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, (element: E, index: bigint): boolean => this.interrupt(element, index, accumulator));
        } else if (isIterable(argument1)) {
            let iterable: Iterable<E> = argument1;
            let index: bigint = 0n;
            for (let element of iterable) {
                if (this.interrupt(element, index, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, element, count);
                count++;
                index++;
            }
        } else if (isSemantic(argument1)) {
            let semantic: Semantic<E> = argument1 as Semantic<E>;
            let generator: Generator<E> = Reflect.get(semantic, "generator");
            if (isFunction(generator)) {
                generator((element: E, index: bigint): void => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element: E, index: bigint): boolean => this.interrupt(element, index, accumulator));
            } else {
                throw new TypeError("Invalid arguments");
            }
        } else if (isCollectable(argument1)) {
            let collectable: Collectable<E> = argument1 as Collectable<E>;
            let source: Generator<E> | Iterable<E> = collectable.source();
            if (isIterable(source)) {
                let iterable: Iterable<E> = source;
                let index: bigint = 0n;
                for (let element of iterable) {
                    if (this.interrupt(element, index, accumulator)) {
                        break;
                    }
                    accumulator = this.accumulator(accumulator, element, count);
                    count++;
                    index++;
                }
            }else if (isFunction(source)) {
                let generator: Generator<E> = source;
                generator((element: E, index: bigint): void => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element: E, index: bigint): boolean => this.interrupt(element, index, accumulator));
            }
        } else if (isNumber(argument1) && isNumber(argument2)) {
            let start: number = argument1 < argument2 ? argument1 : argument2;
            let end: number = argument1 > argument2 ? argument1 : argument2;
            for (let i: number = start; i < end; i++) {
                if (this.interrupt(i as E, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i as E, count);
                count++;
            }
        } else if (isBigInt(argument1) && isBigInt(argument2)) {
            let start: bigint = argument1 < argument2 ? argument1 : argument2;
            let end: bigint = argument1 > argument2 ? argument1 : argument2;
            for (let i: bigint = start; i < end; i++) {
                if (this.interrupt(i as E, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i as E, count);
                count++;
            }
        }
        return this.finisher(accumulator);
    }

    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector(identity, () => false, accumulator, finisher);
    }

    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector<E, A, R>(identity, interruptor, accumulator, finisher);
    }
};

export let useAnyMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean> = <E>(predicate: Predicate<E>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => false,
            (_element: E, _index: bigint, accumulator: boolean): boolean => isBoolean(accumulator) && accumulator,
            (accumulator: boolean, element: E): boolean => accumulator || predicate(element),
            (accumulator: boolean): boolean => accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

export let useAllMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean> = <E>(predicate: Predicate<E>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => true,
            (_element: E, _index: bigint, accumulator: boolean): boolean => isBoolean(accumulator) && !accumulator,
            (accumulator: boolean, element: E): boolean => accumulator && predicate(element),
            (accumulator: boolean): boolean => accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

interface UseCollect {
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
};
export let useCollect: UseCollect = <E, A, R>(argument1: Supplier<A> | Collector<E, A, R>, argument2?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>, argument3?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Functional<A, R>, argument4?: Functional<A, R>): Collector<E, A, R> => {
    if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
        let identity: Supplier<A> = argument1 as Supplier<A>;
        let interrupt: Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A> = argument2 as Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A>;
        let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument3 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
        let finisher: Functional<A, R> = argument4 as Functional<A, R>;
        return Collector.shortable(identity, interrupt, accumulator, finisher);
    }
    if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
        let identity: Supplier<A> = argument1 as Supplier<A>;
        let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument2 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
        let finisher: Functional<A, R> = argument3 as Functional<A, R>;
        return Collector.full(identity, accumulator, finisher);
    }
    throw new TypeError("Identity, accumulator, and finisher must be functions.");
};

export let useCount: <E = unknown>() => Collector<E, bigint, bigint> = <E = unknown>(): Collector<E, bigint, bigint> => {
    return Collector.full(
        (): bigint => 0n,
        (count: bigint): bigint => count + 1n,
        (count: bigint): bigint => count
    );
};

export interface UseError {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
};

export let useError: UseLog = <E = unknown>(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): Collector<E, string, string> => {
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full<E, string, string>(
            (): string => "[",
            (accumulator: string, element: E): string => {
                if (isString(accumulator) && isString(element)) {
                    return accumulator + element + ",";
                }
                return String(accumulator) + String(element) + ",";
            },
            (text: string): string => {
                let result: string = text.substring(0, text.length - 1) + "]";
                console.error(result);
                return result;
            }
        );
    } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        return Collector.full<E, string, string>(
            (): string => "[",
            accumulator,
            (text: string): string => {
                let result: string = text.substring(0, text.length - 1) + "]";
                console.error(result);
                return result;
            }
        );
    } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix: string = argument1;
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        let suffix: string = argument3;
        return Collector.full<E, string, string>(
            (): string => prefix,
            accumulator,
            (text: string): string => {
                let result: string = text + suffix;
                console.error(result);
                return result;
            }
        );
    } else {
        throw new TypeError("Invalid arguments.");
    }
};

export let useFindFirst: <E>() => Collector<E, Optional<E>, Optional<E>> = <E>(): Collector<E, Optional<E>, Optional<E>> => {
    return Collector.shortable(
        (): Optional<E> => Optional.empty(),
        (_element: E, _index: bigint, accumulator: Optional<E>): boolean => validate(accumulator) && accumulator.isPresent(),
        (accumulator: Optional<E>, element: E): Optional<E> => {
            if (validate(accumulator) && accumulator.isPresent()) {
                return accumulator;
            }
            return Optional.ofNullable(element);
        },
        (accumulator: Optional<E>): Optional<E> => accumulator
    );
};

export let useFindAny: <E>() => Collector<E, Optional<E>, Optional<E>> = <E>(): Collector<E, Optional<E>, Optional<E>> => {
    return Collector.shortable(
        (): Optional<E> => Optional.empty(),
        (_element: E, _index: bigint, accumulator: Optional<E>): boolean => validate(accumulator) && accumulator.isPresent(),
        (accumulator: Optional<E>, element: E): Optional<E> => {
            if (validate(accumulator) && accumulator.isPresent() && Math.random() < 0.5) {
                return accumulator;
            }
            return Optional.ofNullable(element);
        },
        (accumulator: Optional<E>): Optional<E> => accumulator
    );
};

export let useFindLast: <E>() => Collector<E, Optional<E>, Optional<E>> = <E>(): Collector<E, Optional<E>, Optional<E>> => {
    return Collector.full(
        (): Optional<E> => Optional.empty(),
        (accumulator: Optional<E>, element: E): Optional<E> => {
            if (validate(accumulator) && accumulator.isPresent()) {
                return Optional.ofNullable(element);
            }
            return accumulator;
        },
        (accumulator: Optional<E>): Optional<E> => accumulator
    );
};

export interface UseForEach {
    <E>(action: Consumer<E>): Collector<E, bigint, bigint>;
    <E>(action: BiConsumer<E, bigint>): Collector<E, bigint, bigint>;
};
export let useForEach: UseForEach = <E>(action: Consumer<E> | BiConsumer<E, bigint>): Collector<E, bigint, bigint> => {
    if (isFunction(action)) {
        return Collector.full(
            (): bigint => 0n,
            (accumulator: bigint, element: E, index: bigint): bigint => {
                action(element, index);
                return accumulator + 1n;
            },
            (accumulator: bigint): bigint => accumulator
        );
    }
    throw new TypeError("Action must be a function.");
};

export let useNoneMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean> = <E>(predicate: Predicate<E>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => true,
            (_element: E, _index: bigint, accumulator: boolean): boolean => !accumulator,
            (accumulator: boolean, element: E): boolean => accumulator && !predicate(element),
            (accumulator: boolean): boolean => !accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

export let useGroup: <E, K>(classifier: Functional<E, K>) => Collector<E, Map<K, E[]>, Map<K, E[]>> = <E, K>(classifier: Functional<E, K>): Collector<E, Map<K, E[]>, Map<K, E[]>> => {
    if (isFunction(classifier)) {
        return Collector.full(
            (): Map<K, E[]> => new Map<K, E[]>(),
            (accumulator: Map<K, E[]>, element: E): Map<K, E[]> => {
                let key: K = classifier(element);
                let group: E[] = accumulator.get(key) || [];
                group.push(element);
                accumulator.set(key, group);
                return accumulator;
            },
            (accumulator: Map<K, E[]>): Map<K, E[]> => accumulator
        );
    }
    throw new TypeError("Classifier must be a function.");
};

export let useGroupBy: <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>) => Collector<E, Map<K, V[]>, Map<K, V[]>> = <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V[]>, Map<K, V[]>> => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(
            (): Map<K, V[]> => new Map<K, V[]>(),
            (accumulator: Map<K, V[]>, element: E): Map<K, V[]> => {
                let key: K = keyExtractor(element);
                let group: V[] = accumulator.get(key) || [];
                group.push(valueExtractor(element));
                accumulator.set(key, group);
                return accumulator;
            },
            (accumulator: Map<K, V[]>): Map<K, V[]> => accumulator
        );
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};

export interface UseJoin {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(delimiter: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, delimiter: string, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>
};
export let useJoin: UseJoin = <E = unknown>(argument1?: string, argument2?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): Collector<E, string, string> => {
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full<E, string, string>(
            (): string => "[",
            (text: string, element: E): string => text + element + ",",
            (text: string): string => text.substring(0, text.length - 1) + "]"
        );
    }
    if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let delimiter: string = argument1;
        return Collector.full<E, string, string>(
            (): string => "[",
            (text: string, element: E): string => text + element + delimiter,
            (text: string): string => text.substring(0, text.length - delimiter.length) + "]"
        );
    }
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix: string = argument1;
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        let suffix: string = argument3;
        return Collector.full<E, string, string>(
            (): string => prefix,
            accumulator,
            (text: string): string => text + suffix
        );
    }
    if (isString(argument1) && isString(argument2) && isString(argument3)) {
        let prefix: string = argument1;
        let delimiter: string = argument2;
        let suffix: string = argument3;
        return Collector.full<E, string, string>(
            (): string => prefix,
            (text: string, element: E): string => text + element + delimiter,
            (text: string): string => text + suffix
        );
    }
    throw new TypeError("Invalid arguments.");
};

export interface UseLog {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
};

export let useLog: UseLog = <E = unknown>(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): Collector<E, string, string> => {
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full<E, string, string>(
            (): string => "[",
            (accumulator: string, element: E): string => {
                if (isString(accumulator) && isString(element)) {
                    return accumulator + element + ",";
                }
                return String(accumulator) + String(element) + ",";
            },
            (text: string): string => {
                let result: string = text.substring(0, text.length - 1) + "]";
                console.log(result);
                return result;
            }
        );
    } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        return Collector.full<E, string, string>(
            (): string => "[",
            accumulator,
            (text: string): string => {
                let result: string = text.substring(0, text.length - 1) + "]";
                console.log(result);
                return result;
            }
        );
    } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix: string = argument1;
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        let suffix: string = argument3;
        return Collector.full<E, string, string>(
            (): string => prefix,
            accumulator,
            (text: string): string => {
                let result: string = text + suffix;
                console.log(result);
                return result;
            }
        );
    } else {
        throw new TypeError("Invalid arguments.");
    }
};

export let usePartition: <E>(count: bigint) => Collector<E, Array<Array<E>>, Array<Array<E>>> = <E>(count: bigint): Collector<E, Array<Array<E>>, Array<Array<E>>> => {
    if (isBigInt(count)) {
        let limited = count > 1n ? count : 1n;
        return Collector.full(
            (): Array<Array<E>> => {
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
    throw new TypeError("Count must be a BigInt.");
};

export let usePartitionBy: <E>(classifier: Functional<E, bigint>) => Collector<E, Array<E[]>, Array<E[]>> = <E>(classifier: Functional<E, bigint>): Collector<E, Array<E[]>, Array<E[]>> => {
    if (isFunction(classifier)) {
        return Collector.full(
            (): Array<Array<E>> => {
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
    throw new TypeError("Classifier must be a function.");
};

export interface UseReduce {
    <E>(accumulator: BiFunctional<E, E, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(accumulator: TriFunctional<E, E, bigint, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(identity: E, accumulator: BiFunctional<E, E, E>): Collector<E, E, E>;
    <E>(identity: E, accumulator: TriFunctional<E, E, bigint, E>): Collector<E, E, E>;
    <E, R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): Collector<E, R, R>;
    <E, R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): Collector<E, R, R>;
};

export let useReduce: UseReduce = <E, R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: Functional<R, R>): Collector<E, Optional<E>, Optional<E>> | Collector<E, E, E> | Collector<E, R, R> => {
    if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator: BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E> = argument1 as BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E>;
        return Collector.full<E, Optional<E>, Optional<E>>(
            (): Optional<E> => Optional.ofNullable<E>(),
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
        let accumulator: BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E> = argument2 as BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E>;
        return Collector.full<E, E, E>(() => identity, accumulator, (result: E): E => result);
    } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
        let identity = argument1 as R;
        let accumulator: BiFunctional<R, E, R> & TriFunctional<R, E, bigint, R> = argument2 as BiFunctional<R, E, R> & TriFunctional<R, E, bigint, R>;
        let finisher = argument3 as Functional<R, R>;
        return Collector.full<E, R, R>(() => identity, accumulator, finisher);
    } else {
        throw new TypeError("Invalid arguments.");
    }
};

export let useToArray: <E>() => Collector<E, E[], E[]> = <E>(): Collector<E, E[], E[]> => {
    return Collector.full<E, E[], E[]>(
        (): E[] => [],
        (array: E[], element: E): E[] => {
            array.push(element);
            return array;
        },
        (array: E[]): E[] => array
    );
};

export let useToMap: <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>) => Collector<E, Map<K, V>, Map<K, V>> = <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V>, Map<K, V>> => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full<E, Map<K, V>, Map<K, V>>(
            (): Map<K, V> => new Map<K, V>(),
            (map: Map<K, V>, element: E): Map<K, V> => {
                let key: K = keyExtractor(element);
                let value: V = valueExtractor(element);
                map.set(key, value);
                return map;
            },
            (map: Map<K, V>): Map<K, V> => map
        );
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};

export let useToSet: <E>() => Collector<E, Set<E>, Set<E>> = <E>(): Collector<E, Set<E>, Set<E>> => {
    return Collector.full<E, Set<E>, Set<E>>(
        (): Set<E> => new Set<E>(),
        (set: Set<E>, element: E): Set<E> => {
            set.add(element);
            return set;
        },
        (set: Set<E>): Set<E> => set
    );
};

export interface UseWrite {
    <E, S = string>(stream: WritableStream<S>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
};

export let useWrite: UseWrite = <E, S = string>(argument1: WritableStream<S>, argument2?: BiFunctional<WritableStream<S>, E, WritableStream<S>> | TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>> => {
    if (isObject(argument1)) {
        if (isFunction(argument2)) {
            let stream: WritableStream<S> = argument1 as WritableStream<S>;
            let accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>> = argument2 as BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>;
            return Collector.full<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>(
                (): Promise<WritableStream<S>> => Promise.resolve(stream),
                (promise: Promise<WritableStream<S>>, element: E, index: bigint): Promise<WritableStream<S>> => {
                    return new Promise<WritableStream<S>>((resolve, reject) => {
                        promise.then((stream: WritableStream<S>): void => {
                            try {
                                resolve(accumulator(stream, element, index));
                            } catch (error) {
                                reject(error);
                            }
                        }).catch(reject);
                    });
                },
                (promise: Promise<WritableStream<S>>): Promise<WritableStream<S>> => promise);
        } else {
            let stream: WritableStream<S> = argument1 as WritableStream<S>;
            return Collector.full<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>(
                (): Promise<WritableStream<S>> => Promise.resolve(stream),
                (promise: Promise<WritableStream<S>>, element: E): Promise<WritableStream<S>> => {
                    return new Promise<WritableStream<S>>((resolve, reject) => {
                        promise.then((stream: WritableStream<S>): void => {
                            try {
                                let writer: WritableStreamDefaultWriter<S> = stream.getWriter();
                                writer.write(String(element) as S);
                                resolve(stream);
                            } catch (error) {
                                reject(error);
                            }
                        }).catch(reject);
                    });
                },
                (promise: Promise<WritableStream<S>>): Promise<WritableStream<S>> => promise);
        }
    }
    throw new TypeError("Invalid arguments.");
};

export type NumericAverageInformation = {
    summate: number;
    count: number;
};
export interface UseNumericAverage {
    (): Collector<number, NumericAverageInformation, number>;
    <E>(mapper: Functional<E, number>): Collector<E, NumericAverageInformation, number>;
};
export let useNumericAverage: UseNumericAverage = <E = number>(mapper?: Functional<E, number>): Collector<number, NumericAverageInformation, number> | Collector<E, NumericAverageInformation, number> => {
    if (isFunction(mapper)) {
        return Collector.full<E, NumericAverageInformation, number>(
            (): NumericAverageInformation => {
                return {
                    summate: 0,
                    count: 0
                };
            },
            (information: NumericAverageInformation, element: E): NumericAverageInformation => {
                let value: number = mapper(element);
                information.summate += value;
                information.count++;
                return information;
            },
            (information: NumericAverageInformation): number => {
                return information.summate / information.count;
            }
        );
    }
    return Collector.full<number, NumericAverageInformation, number>(
        (): NumericAverageInformation => {
            return {
                summate: 0,
                count: 0
            };
        },
        (information: NumericAverageInformation, element: number): NumericAverageInformation => {
            information.summate += element;
            information.count++;
            return information;
        },
        (information: NumericAverageInformation): number => {
            return information.summate / information.count;
        }
    );
};

export type BigIntAverageInformation = {
    summate: bigint;
    count: bigint;
};
export interface UseBigIntAverage {
    (): Collector<bigint, BigIntAverageInformation, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntAverageInformation, bigint>;
};
export let useBigIntAverage: UseBigIntAverage = <E = bigint>(mapper?: Functional<E, bigint>): Collector<bigint, BigIntAverageInformation, bigint> | Collector<E, BigIntAverageInformation, bigint> => {
    if (isFunction(mapper)) {
        return Collector.full<E, BigIntAverageInformation, bigint>(
            (): BigIntAverageInformation => {
                return {
                    summate: 0n,
                    count: 0n
                };
            },
            (information: BigIntAverageInformation, element: E): BigIntAverageInformation => {
                let value: bigint = mapper(element);
                information.summate += value;
                information.count++;
                return information;
            },
            (information: BigIntAverageInformation): bigint => {
                return information.summate / information.count;
            }
        );
    }
    return Collector.full<bigint, BigIntAverageInformation, bigint>(
        (): BigIntAverageInformation => {
            return {
                summate: 0n,
                count: 0n
            };
        },
        (information: BigIntAverageInformation, element: bigint): BigIntAverageInformation => {
            information.summate += element;
            information.count++;
            return information;
        },
        (information: BigIntAverageInformation): bigint => {
            return information.summate / information.count;
        }
    );
};

export let useFrequency: <E>() => Collector<E, Map<E, bigint>, Map<E, bigint>> = <E>(): Collector<E, Map<E, bigint>, Map<E, bigint>> => {
    return Collector.full<E, Map<E, bigint>, Map<E, bigint>>(
        (): Map<E, bigint> => new Map<E, bigint>(),
        (map: Map<E, bigint>, element: E): Map<E, bigint> => {
            let count: bigint = map.get(element) || 0n;
            map.set(element, count + 1n);
            return map;
        },
        (map: Map<E, bigint>): Map<E, bigint> => map
    );
};

export interface UseNumericSummate {
    (): Collector<number, number, number>;
    <E>(mapper: Functional<E, number>): Collector<E, number, number>;
};
export let useSummate: UseNumericSummate = <E = number>(mapper?: Functional<E, number>): Collector<number, number, number> | Collector<E, number, number> => {
    if (isFunction(mapper)) {
        return Collector.full<E, number, number>(
            (): number => 0,
            (summate: number, element: E): number => {
                let value: number = mapper(element);
                return summate + value;
            },
            (summate: number): number => summate
        );
    }
    return Collector.full<number, number, number>(
        (): number => 0,
        (summate: number, element: number): number => {
            return summate + element;
        },
        (summate: number): number => summate
    );
};
