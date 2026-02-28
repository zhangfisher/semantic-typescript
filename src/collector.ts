import { Collectable } from "./semantic";
import { isBigInt, isBoolean, isCollectable, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import { Optional } from "./optional";
import type { Semantic } from "./semantic";
import { CollectableSymbol } from "./symbol";
import { type BiFunctional, type BiPredicate, type Functional, type Predicate, type Supplier, type TriFunctional, type Generator, type TriPredicate, validate, type Consumer, type BiConsumer, invalidate, type Comparator } from "./utility";

export class Collector<E, A, R> {

    protected identity: Supplier<A>;

    protected interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;

    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;

    protected finisher: Functional<A, R>;

    protected readonly Collector: symbol = CollectableSymbol;

    protected constructor(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>) {
        if (isFunction(identity) && isFunction(interrupt) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interrupt;
            this.accumulator = accumulator;
            this.finisher = finisher;
            Object.defineProperties(this, {
                "identity": {
                    value: identity,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "interrupt": {
                    value: interrupt,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "accumulator": {
                    value: accumulator,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "finisher": {
                    value: finisher,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "Collector": {
                    value: CollectableSymbol,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            });
            Object.freeze(this);
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
            let source: Generator<E> = collectable.source();
            if (isFunction(source)) {
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

    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>
    public static shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector<E, A, R>(identity, interrupt, accumulator, finisher);
    }
};

interface UseAnyMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
};
export let useAnyMatch: UseAnyMatch = <E>(predicate: Predicate<E> | BiPredicate<E, bigint>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => false,
            (_element: E, _index: bigint, accumulator: boolean): boolean => isBoolean(accumulator) && accumulator,
            (accumulator: boolean, element: E, index: bigint): boolean => accumulator || predicate(element, index),
            (accumulator: boolean): boolean => accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

interface UseAllMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
};
export let useAllMatch: UseAllMatch = <E>(predicate: Predicate<E> | BiPredicate<E, bigint>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => true,
            (_element: E, _index: bigint, accumulator: boolean): boolean => isBoolean(accumulator) && !accumulator,
            (accumulator: boolean, element: E, index: bigint): boolean => accumulator && predicate(element, index),
            (accumulator: boolean): boolean => accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

interface UseCollect {
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
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

interface UseError {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
};
export let useError: UseError = <E = unknown>(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): Collector<E, string, string> => {
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
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
    } else if (isFunction(argument1)) {
        let prefix: string = "[";
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        let suffix: string = "]";
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
        return Collector.full<E, string, string>(
            (): string => "[",
            (accumulator: string, element: E): string => {
                if (isString(accumulator) && isString(element)) {
                    return accumulator + element + ",";
                }
                return String(accumulator) + String(element) + ",";
            },
            (text: string): string => {
                let result: string = text.substring(0, Math.max(1, text.length - 1)) + "]";
                console.error(result);
                return result;
            }
        );
    }
};

interface UseFindAt {
    <E>(index: number): Collector<E, Array<E>, Optional<E>>;
    <E>(index: bigint): Collector<E, Array<E>, Optional<E>>;
};
export let useFindAt: UseFindAt = <E>(index: number | bigint): Collector<E, Array<E>, Optional<E>> => {
    let target: bigint = useToBigInt(index);
    if (target < 0n) {
        return Collector.full(
            (): Array<E> => [],
            (accumulator: Array<E>, element: E): Array<E> => {
                accumulator.push(element);
                return accumulator;
            },
            (accumulator: Array<E>): Optional<E> => {
                if (accumulator.length === 0) {
                    return Optional.empty();
                }
                let limited: bigint = (((BigInt(accumulator.length)) % target) + target) % target;
                return Optional.ofNullable(accumulator[Number(limited)]);
            }
        );
    }
    return Collector.shortable(
        (): Array<E> => [],
        (_element: E, _index: bigint, accumulator: Array<E>): boolean => BigInt(accumulator.length) - 1n === target,
        (accumulator: Array<E>, element: E): Array<E> => {
            accumulator.push(element);
            return accumulator;
        },
        (accumulator: Array<E>): Optional<E> => {
            if (accumulator.length === 0) {
                return Optional.empty();
            }
            return Optional.ofNullable(accumulator[Number(target)]);
        }
    );
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

interface UseFindMaximum {
    <E>(): Collector<E, Optional<E>, Optional<E>>;
    <E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>;
}
export let useFindMaximum: UseFindMaximum = <E>(comparator: Comparator<E> = useCompare<E>): Collector<E, Optional<E>, Optional<E>> => {
    return Collector.full(
        (): Optional<E> => Optional.ofNullable(),
        (accumulator: Optional<E>, element: E): Optional<E> => {
            if (accumulator.isPresent()) {
                return comparator(accumulator.get(), element) > 0 ? accumulator : Optional.ofNullable(element);
            }
            return Optional.ofNullable(element);
        },
        (result: Optional<E>): Optional<E> => result
    );
};

interface UseFindMinimum {
    <E>(): Collector<E, Optional<E>, Optional<E>>;
    <E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>;
}
export let useFindMinimum: UseFindMinimum = <E>(comparator: Comparator<E> = useCompare<E>): Collector<E, Optional<E>, Optional<E>> => {
    return Collector.full(
        (): Optional<E> => Optional.ofNullable(),
        (accumulator: Optional<E>, element: E): Optional<E> => {
            if (accumulator.isPresent()) {
                return comparator(accumulator.get(), element) < 0 ? accumulator : Optional.ofNullable(element);
            }
            return Optional.ofNullable(element);
        },
        (result: Optional<E>): Optional<E> => result
    );
};

interface UseForEach {
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

interface UseNonMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
};
export let useNoneMatch: UseNonMatch = <E>(predicate: Predicate<E> | BiPredicate<E, bigint>): Collector<E, boolean, boolean> => {
    if (isFunction(predicate)) {
        return Collector.shortable(
            (): boolean => true,
            (_element: E, _index: bigint, accumulator: boolean): boolean => !accumulator,
            (accumulator: boolean, element: E, index: bigint): boolean => accumulator && !predicate(element, index),
            (accumulator: boolean): boolean => !accumulator
        );
    }
    throw new TypeError("Predicate must be a function.");
};

interface UseGroup {
    <E, K>(classifier: Functional<E, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>;
    <E, K>(classifier: BiFunctional<E, bigint, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>;
};
export let useGroup: UseGroup = <E, K>(classifier: Functional<E, K> | BiFunctional<E, bigint, K>): Collector<E, Map<K, E[]>, Map<K, E[]>> => {
    if (isFunction(classifier)) {
        return Collector.full(
            (): Map<K, E[]> => new Map<K, E[]>(),
            (accumulator: Map<K, E[]>, element: E, index: bigint): Map<K, E[]> => {
                let key: K = classifier(element, index);
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

interface UseGroupBy {
    <E, K>(keyExtractor: Functional<E, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>;
    <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V[]>, Map<K, V[]>>;
    <E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Collector<E, Map<K, V[]>, Map<K, V[]>>;
}
export let useGroupBy: UseGroupBy = <E, K, V = E>(keyExtractor: Functional<E, K> | BiFunctional<E, bigint, K>, valueExtractor: Functional<E, V> | BiFunctional<E, bigint, V> = (element: E) => element as unknown as V): Collector<E, Map<K, V[]>, Map<K, V[]>> => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(
            (): Map<K, V[]> => new Map<K, V[]>(),
            (accumulator: Map<K, V[]>, element: E, index: bigint): Map<K, V[]> => {
                let key: K = keyExtractor(element, index);
                let group: V[] = accumulator.get(key) || [];
                group.push(valueExtractor(element, index));
                accumulator.set(key, group);
                return accumulator;
            },
            (accumulator: Map<K, V[]>): Map<K, V[]> => accumulator
        );
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};

interface UseJoin {
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

interface UseLog {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
};

export let useLog: UseLog = <E = unknown>(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): Collector<E, string, string> => {
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
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
    } else if (isFunction(argument1)) {
        let prefix: string = "[";
        let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
        let suffix: string = "]";
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
        return Collector.full<E, string, string>(
            (): string => "[",
            (accumulator: string, element: E): string => {
                console.log(element)
                if (isString(accumulator) && isString(element)) {
                    return accumulator + element + ",";
                }
                return String(accumulator) + String(element) + ",";
            },
            (text: string): string => {
                let result: string = text.substring(0, Math.max(1, text.length - 1)) + "]";
                console.log(result);
                return result;
            }
        );
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

interface UsePartitionBy {
    <E>(classifier: Functional<E, bigint>): Collector<E, Array<E[]>, Array<E[]>>;
    <E>(classifier: BiFunctional<E, bigint, bigint>): Collector<E, Array<E[]>, Array<E[]>>;
};
export let usePartitionBy: UsePartitionBy = <E>(classifier: Functional<E, bigint> | BiFunctional<E, bigint, bigint>): Collector<E, Array<E[]>, Array<E[]>> => {
    if (isFunction(classifier)) {
        return Collector.full(
            (): Array<Array<E>> => {
                return [];
            }, (array: Array<Array<E>>, element: E, index: bigint): Array<Array<E>> => {
                let resolved: bigint = classifier(element, index);
                while (resolved > BigInt(array.length) - 1n) {
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

interface UseReduce {
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

interface UseToMap {
    <E, K>(keyExtractor: Functional<E, K>): Collector<E, Map<K, E>, Map<K, E>>;
    <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V>, Map<K, V>>;
    <E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Collector<E, Map<K, V>, Map<K, V>>;
};
export let useToMap: UseToMap = <E, K, V>(keyExtractor: Functional<E, K> | BiFunctional<E, bigint, K>, valueExtractor: Functional<E, V> | BiFunctional<E, bigint, V> = (element: E): V => element as unknown as V): Collector<E, Map<K, V>, Map<K, V>> => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full<E, Map<K, V>, Map<K, V>>(
            (): Map<K, V> => new Map<K, V>(),
            (map: Map<K, V>, element: E, index: bigint): Map<K, V> => {
                let key: K = keyExtractor(element, index);
                let value: V = valueExtractor(element, index);
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

interface UseWrite {
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

interface UseNumericSummate {
    <E>(): Collector<E, number, number>;
    <E>(mapper: Functional<E, number>): Collector<E, number, number>;
};
export let useNumericSummate: UseNumericSummate = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, number, number> | Collector<E, number, number> => {
    return Collector.full(
        (): number => 0,
        (accumulator: number, element: number | E): number => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            return accumulator + (isNumber(resolved) ? resolved : 0);
        },
        (result: number): number => result
    ) as Collector<number, number, number> | Collector<E, number, number>;
};

interface UseBigIntSummate {
    <E>(): Collector<E, bigint, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, bigint, bigint>;
};
export let useBigIntSummate: UseBigIntSummate = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, bigint, bigint> | Collector<E, bigint, bigint> => {
    return Collector.full(
        (): bigint => 0n,
        (accumulator: bigint, element: bigint | E): bigint => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            return accumulator + (isBigInt(resolved) ? resolved : 0n);
        },
        (result: bigint): bigint => result
    ) as Collector<bigint, bigint, bigint> | Collector<E, bigint, bigint>;
};

interface UseNumericAverage {
    <E>(): Collector<E, NumericAverageAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, NumericAverageAccumulator, number>;
};
interface NumericAverageAccumulator {
    summate: number;
    count: number;
};
export let useNumericAverage: UseNumericAverage = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, NumericAverageAccumulator, number> | Collector<E, NumericAverageAccumulator, number> => {
    return Collector.full(
        (): NumericAverageAccumulator => {
            return {
                summate: 0,
                count: 0
            };
        },
        (accumulator: NumericAverageAccumulator, element: number | E): NumericAverageAccumulator => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
                count: accumulator.count + 1
            };
        },
        (result: NumericAverageAccumulator): number => {
            if (result.count === 0) {
                return 0;
            }
            return result.summate / result.count;
        }
    ) as Collector<number, NumericAverageAccumulator, number> | Collector<E, NumericAverageAccumulator, number>;
};

interface UseBigIntAverage {
    <E>(): Collector<E, BigIntAverageAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntAverageAccumulator, bigint>;
};
interface BigIntAverageAccumulator {
    summate: bigint;
    count: bigint;
};
export let useBigIntAverage: UseBigIntAverage = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, BigIntAverageAccumulator, bigint> | Collector<E, BigIntAverageAccumulator, bigint> => {
    return Collector.full(
        (): BigIntAverageAccumulator => {
            return {
                summate: 0n,
                count: 0n
            };
        },
        (accumulator: BigIntAverageAccumulator, element: bigint | E): BigIntAverageAccumulator => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
                count: accumulator.count + 1n
            };
        },
        (result: BigIntAverageAccumulator): bigint => {
            if (result.count === 0n) {
                return 0n;
            }
            return result.summate / result.count;
        }
    ) as Collector<bigint, BigIntAverageAccumulator, bigint> | Collector<E, BigIntAverageAccumulator, bigint>;
};

export let useFrequency: <E>() => Collector<E, Map<E, bigint>, Map<E, bigint>> = <E>(): Collector<E, Map<E, bigint>, Map<E, bigint>> => {
    return Collector.full(
        (): Map<E, bigint> => new Map<E, bigint>(),
        (map: Map<E, bigint>, element: E): Map<E, bigint> => {
            let count: bigint = map.get(element) || 0n;
            map.set(element, count + 1n);
            return map;
        },
        (map: Map<E, bigint>): Map<E, bigint> => map
    );
};

interface UseNumericMode {
    <E>(): Collector<E, Map<number, bigint>, number>;
    <E>(mapper: Functional<E, number>): Collector<E, Map<number, bigint>, number>;
};
export let useNumericMode: UseNumericMode = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, Map<number, bigint>, number> | Collector<E, Map<number, bigint>, number> => {
    return Collector.full(
        (): Map<number, bigint> => new Map<number, bigint>(),
        (map: Map<number, bigint>, element: number | E): Map<number, bigint> => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            let count: bigint = map.get(resolved) || 0n;
            map.set(resolved, count + 1n);
            return map;
        },
        (map: Map<number, bigint>): number => {
            let maxCount: bigint = 0n;
            let mode: number = 0;
            for (let [key, value] of map) {
                if (value > maxCount) {
                    maxCount = value;
                    mode = key;
                }
            }
            return mode;
        }
    ) as Collector<number, Map<number, bigint>, number> | Collector<E, Map<number, bigint>, number>;
};

interface UseBigIntMode {
    <E>(): Collector<E, Map<bigint, bigint>, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, Map<bigint, bigint>, bigint>;
};
export let useBigIntMode: UseBigIntMode = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, Map<bigint, bigint>, bigint> | Collector<E, Map<bigint, bigint>, bigint> => {
    return Collector.full(
        (): Map<bigint, bigint> => new Map<bigint, bigint>(),
        (map: Map<bigint, bigint>, element: bigint | E): Map<bigint, bigint> => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            let count: bigint = map.get(resolved) || 0n;
            map.set(resolved, count + 1n);
            return map;
        },
        (map: Map<bigint, bigint>): bigint => {
            let maxCount: bigint = 0n;
            let mode: bigint = 0n;
            for (let [key, value] of map) {
                if (value > maxCount) {
                    maxCount = value;
                    mode = key;
                }
            }
            return mode;
        }
    ) as Collector<bigint, Map<bigint, bigint>, bigint> | Collector<E, Map<bigint, bigint>, bigint>;
};

interface UseNumericVariance {
    <E>(): Collector<E, VarianceAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, VarianceAccumulator, number>;
};
interface VarianceAccumulator {
    summate: number;
    summateOfSquares: number;
    count: number;
};
export let useNumericVariance: UseNumericVariance = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, VarianceAccumulator, number> | Collector<E, VarianceAccumulator, number> => {
    return Collector.full(
        (): VarianceAccumulator => {
            return {
                summate: 0,
                summateOfSquares: 0,
                count: 0
            };
        },
        (accumulator: VarianceAccumulator, element: number | E): VarianceAccumulator => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
                summateOfSquares: accumulator.summateOfSquares + (isNumber(resolved) ? Math.pow(resolved, 2) : 0),
                count: accumulator.count + 1
            };
        },
        (result: VarianceAccumulator): number => {
            if (result.count < 2) {
                return 0;
            }
            let mean: number = result.summate / result.count;
            let variance: number = (result.summateOfSquares / result.count) - Math.pow(mean, 2);
            return variance;
        }
    ) as Collector<number, VarianceAccumulator, number> | Collector<E, VarianceAccumulator, number>;
};

interface UseBigIntVariance {
    <E>(): Collector<E, BigIntVarianceAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntVarianceAccumulator, bigint>;
};
interface BigIntVarianceAccumulator {
    summate: bigint;
    summateOfSquares: bigint;
    count: bigint;
};
export let useBigIntVariance: UseBigIntVariance = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, BigIntVarianceAccumulator, bigint> | Collector<E, BigIntVarianceAccumulator, bigint> => {
    return Collector.full(
        (): BigIntVarianceAccumulator => {
            return {
                summate: 0n,
                summateOfSquares: 0n,
                count: 0n
            };
        },
        (accumulator: BigIntVarianceAccumulator, element: bigint | E): BigIntVarianceAccumulator => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
                summateOfSquares: accumulator.summateOfSquares + (isBigInt(resolved) ? resolved * resolved : 0n),
                count: accumulator.count + 1n
            };
        },
        (result: BigIntVarianceAccumulator): bigint => {
            if (result.count < 2n) {
                return 0n;
            }
            let mean: bigint = result.summate / result.count;
            let variance: bigint = (result.summateOfSquares / result.count) - (mean * mean);
            return variance;
        }
    ) as Collector<bigint, BigIntVarianceAccumulator, bigint> | Collector<E, BigIntVarianceAccumulator, bigint>;
};

interface UseNumericStandardDeviation {
    <E>(): Collector<E, StandardDeviationAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, StandardDeviationAccumulator, number>;
};
interface StandardDeviationAccumulator {
    summate: number;
    summateOfSquares: number;
    count: number;
};
export let useNumericStandardDeviation: UseNumericStandardDeviation = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, StandardDeviationAccumulator, number> | Collector<E, StandardDeviationAccumulator, number> => {
    return Collector.full(
        (): StandardDeviationAccumulator => {
            return {
                summate: 0,
                summateOfSquares: 0,
                count: 0
            };
        },
        (accumulator: StandardDeviationAccumulator, element: number | E): StandardDeviationAccumulator => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
                summateOfSquares: accumulator.summateOfSquares + (isNumber(resolved) ? Math.pow(resolved, 2) : 0),
                count: accumulator.count + 1
            };
        },
        (result: StandardDeviationAccumulator): number => {
            if (result.count < 2) {
                return 0;
            }
            let mean: number = result.summate / result.count;
            let variance: number = (result.summateOfSquares / result.count) - Math.pow(mean, 2);
            let standardDeviation: number = Math.sqrt(variance);
            return standardDeviation;
        }
    ) as Collector<number, StandardDeviationAccumulator, number> | Collector<E, StandardDeviationAccumulator, number>;
};

interface UseBigIntStandardDeviation {
    <E>(): Collector<E, BigIntStandardDeviationAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntStandardDeviationAccumulator, bigint>;
};
interface BigIntStandardDeviationAccumulator {
    summate: bigint;
    summateOfSquares: bigint;
    count: bigint;
};
export let useBigIntStandardDeviation: UseBigIntStandardDeviation = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, BigIntStandardDeviationAccumulator, bigint> | Collector<E, BigIntStandardDeviationAccumulator, bigint> => {
    return Collector.full(
        (): BigIntStandardDeviationAccumulator => {
            return {
                summate: 0n,
                summateOfSquares: 0n,
                count: 0n
            };
        },
        (accumulator: BigIntStandardDeviationAccumulator, element: bigint | E): BigIntStandardDeviationAccumulator => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            return {
                summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
                summateOfSquares: accumulator.summateOfSquares + (isBigInt(resolved) ? resolved * resolved : 0n),
                count: accumulator.count + 1n
            };
        },
        (result: BigIntStandardDeviationAccumulator): bigint => {
            if (result.count < 2n) {
                return 0n;
            }
            let mean: bigint = result.summate / result.count;
            let variance: bigint = (result.summateOfSquares / result.count) - (mean * mean);
            let standardDeviation: bigint = BigInt(Math.sqrt(Number(variance)));
            return standardDeviation;
        }
    ) as Collector<bigint, BigIntStandardDeviationAccumulator, bigint> | Collector<E, BigIntStandardDeviationAccumulator, bigint>;
};

interface UseNumericMedian {
    <E>(): Collector<E, number[], number>;
    <E>(mapper: Functional<E, number>): Collector<E, number[], number>;
};
export let useNumericMedian: UseNumericMedian = <E>(mapper: Functional<E, number> = useToNumber): Collector<number, number[], number> | Collector<E, number[], number> => {
    return Collector.full(
        (): number[] => [],
        (array: number[], element: number | E): number[] => {
            let resolved: number = isNumber(element) ? element : mapper(element);
            array.push(resolved);
            array.sort((a: number, b: number): number => a - b);
            return array;
        },
        (array: number[]): number => {
            let length: number = array.length;
            if (length % 2 === 0) {
                let mid: number = length / 2;
                return (array[mid - 1] + array[mid]) / 2;
            } else {
                let mid: number = Math.floor(length / 2);
                return array[mid];
            }
        }
    ) as Collector<number, number[], number> | Collector<E, number[], number>;
};

interface UseBigIntMedian {
    <E>(): Collector<E, bigint[], bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, bigint[], bigint>;
};
export let useBigIntMedian: UseBigIntMedian = <E>(mapper: Functional<E, bigint> = useToBigInt): Collector<bigint, bigint[], bigint> | Collector<E, bigint[], bigint> => {
    return Collector.full(
        (): bigint[] => [],
        (array: bigint[], element: bigint | E): bigint[] => {
            let resolved: bigint = isBigInt(element) ? element : mapper(element);
            array.push(resolved);
            array.sort((a: bigint, b: bigint): number => Number(a - b));
            return array;
        },
        (array: bigint[]): bigint => {
            let length: number = array.length;
            if (length % 2 === 0) {
                let mid: number = length / 2;
                return (array[Number(mid - 1)] + array[mid]) / 2n;
            } else {
                let mid: number = Math.floor(length / 2);
                return array[mid];
            }
        }
    ) as Collector<bigint, bigint[], bigint> | Collector<E, bigint[], bigint>;
};

export let useToGeneratorFunction: <E>() => Collector<E, Array<E>, globalThis.Generator<E, void, undefined>> = <E>(): Collector<E, Array<E>, globalThis.Generator<E, void, undefined>> => {
    return Collector.full(
        (): Array<E> => [],
        (array: Array<E>, element: E): Array<E> => {
            array.push(element);
            return array;
        },
        (array: Array<E>): globalThis.Generator<E, void, undefined> => {
            return (function* () {
                for (let element of array) {
                    yield element;
                }
            })();
        }
    );
};

export let useToAsyncGeneratorFunction: <E>() => Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>> = <E>(): Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>> => {
    return Collector.full(
        (): Array<E> => [],
        (array: Array<E>, element: E): Array<E> => {
            array.push(element);
            return array;
        },
        (array: Array<E>): globalThis.AsyncGenerator<E, void, undefined> => {
            return (async function* () {
                for (let element of array) {
                    yield element;
                }
            })();
        }
    );
};