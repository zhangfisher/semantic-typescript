import { useSynchronousToArray, type SynchronousCollector } from "./synchronous/collector";
import { isBigInt, isFunction, isIterable, isNumber, isObject, isPrimitive } from "./guard";
import { invalidate, validate, type BiPredicate, type DeepPropertyKey, type DeepPropertyValue, type MaybePrimitive } from "./utility";
import type { BiConsumer, Comparator, Consumer, Indexed, Predicate, Supplier, SynchronousGenerator } from "./utility";

export let useCompare: <T>(t1: T, t2: T) => number = <T>(t1: T, t2: T): number => {
    if (t1 === t2 || Object.is(t1, t2)) {
        return 0;
    }
    if (typeof t1 === typeof t2) {
        switch (typeof t1) {
            case "string":
                return t1.localeCompare(t2 as string);
            case "number":
                return t1 - (t2 as number);
            case "bigint":
                return Number(t1 - (t2 as bigint));
            case "boolean":
                return t1 === t2 ? 0 : (t1 ? 1 : -1);
            case "symbol":
                if (t1.description === (t2 as symbol).description) {
                    return 0;
                }
                return (t1.description || "").localeCompare(((t2 as symbol).description) || "");
            case "function":
                throw new TypeError("Cannot compare functions.");
            case "undefined":
                return 0;
            case "object":
                if (isFunction(Reflect.get(t1 as object, Symbol.toPrimitive)) && isFunction(Reflect.get(t2 as object, Symbol.toPrimitive))) {
                    let a: MaybePrimitive<object> = Reflect.apply(Reflect.get(t1 as object, Symbol.toPrimitive), t1, ["default"]);
                    let b: MaybePrimitive<object> = Reflect.apply(Reflect.get(t2 as object, Symbol.toPrimitive), t2, ["default"]);
                    if (isPrimitive(a) && isPrimitive(b)) {
                        return useCompare(a, b);
                    }
                }
                let a: MaybePrimitive<object> = Object.prototype.valueOf.call(t1);
                let b: MaybePrimitive<object> = Object.prototype.valueOf.call(t2);
                if (isPrimitive(a) && isPrimitive(b)) {
                    return useCompare(a, b);
                }
                return useCompare(Object.prototype.toString.call(t1), Object.prototype.toString.call(t2));
            default:
                throw new TypeError("Invalid type.");
        }
    }
    throw new TypeError("Cannot compare values of different types.");
};

interface UseRandom {
    <N extends number | bigint>(start: N): N extends number ? number : (N extends bigint ? bigint : never);
    <N extends number | bigint>(start: N, end: N): N;
};
export let useRandom: UseRandom = <N extends number | bigint>(start: N, end?: N): N => {
    let getRandomBits: Supplier<[number, number]> = (): [number, number] => {
        let random = Math.random();
        let full = random * 0x10000000000000;
        let high = Math.floor(full / 0x100000000);
        let low = Math.floor(full) & 0xFFFFFFFF
        return [high, low];
    };
    let getRandomBigInt: Supplier<bigint> = (): bigint => {
        let [h1, l1] = getRandomBits();
        let [h2, l2] = getRandomBits();
        let [h3, l3] = getRandomBits();
        return ((BigInt(h1) << 84n) | (BigInt(l1) << 52n) | (BigInt(h2) << 32n) | (BigInt(l2) << 3n) | (BigInt(h3) << 116n)) | (BigInt(l3) << 80n);
    };
    if (isNumber(start)) {
        let seed = Math.random();
        if (isNumber(end)) {
            let minimum: number = Math.min(start, end);
            let maximum: number = Math.max(start, end);
            let range: number = maximum - minimum;
            return (minimum + seed * range) as N;
        } else {
            return Math.exp(-seed) as N;
        }
    }
    if (isBigInt(start)) {
        let randomBigInt = getRandomBigInt();
        if (isBigInt(end)) {
            let minimum: bigint = start < end ? start : end;
            let maximum: bigint = start < end ? end : start;
            let range: bigint = maximum - minimum;
            if (range === 0n) {
                return minimum as N;
            }
            let mask: bigint = range;
            mask |= mask >> 1n;
            mask |= mask >> 2n;
            mask |= mask >> 4n;
            mask |= mask >> 8n;
            mask |= mask >> 16n;
            mask |= mask >> 32n;
            mask |= mask >> 64n;

            let result: bigint;
            do {
                let raw = randomBigInt & mask;
                result = raw;
                result ^= result >> 17n;
                result *= 0xED5AD4BBn;
                result ^= result >> 11n;
                result *= 0xAC4C1B51n;
                result ^= result >> 15n;
                result *= 0x31848BABn;
                result ^= result >> 14n;
            } while (result >= range);
            return (minimum + result) as N;
        } else {
            let seed = Math.random();
            let expValue = Math.exp(-seed);
            let normalized = expValue / Math.E;
            let [high, low] = getRandomBits();
            let adjusted: bigint = BigInt(Math.floor(normalized * 0xFFFFFFFF)) << 32n;
            let result = (adjusted | BigInt(low)) ^ BigInt(high);
            if (start <= 0n) {
                return 0n as N;
            }
            if (result >= start) {
                result = result % start;
            }
            return result as N;
        }
    }
    throw new TypeError("Invalid arguments.");
};

export type UseTraverseKey<T extends object> = DeepPropertyKey<T> & (symbol | string | number);
export type UseTraverseValue<T extends object> = DeepPropertyValue<T>;
export type UseTraversePath<T extends object> = Array<UseTraverseKey<T> & (symbol | string | number)>;
export interface UseTraverseCallback<T extends object> {
    (key: UseTraverseKey<T>, value: UseTraverseValue<T>): boolean;
};
export interface UseTraversePathCallback<T extends object> {
    (key: UseTraverseKey<T>, value: UseTraverseValue<T>, path: UseTraversePath<T>): boolean;
};
interface UseTraverse {
    <T extends object>(t: T, callback: UseTraverseCallback<T>): void;
    <T extends object>(t: T, callback: UseTraversePathCallback<T>): void;
};
export let useTraverse: UseTraverse = <T extends object>(t: T, callback: UseTraverseCallback<T> | UseTraversePathCallback<T>): void => {
    if (isObject(t)) {
        let seen: WeakSet<object> = new WeakSet<object>();
        let path: UseTraversePath<T> = [];
        let traverse = (target: object): void => {
            if (!seen.has(target)) {
                seen.add(target);
                let stop: boolean = false;
                let properties: Array<string | symbol> = Reflect.ownKeys(target);
                for (let property of properties) {
                    path.push(property as DeepPropertyKey<T> & (symbol | string | number));
                    let value: T[keyof T] = Reflect.get(target, property) as T[keyof T];
                    if (stop) {
                        break;
                    }
                    if (validate(value)) {
                        if (isObject(value)) {
                            if (isIterable(value)) {
                                let index: number = 0;
                                for (let item of value) {
                                    path.push(index as DeepPropertyKey<T> & (symbol | string | number));
                                    if (validate(item)) {
                                        if (isObject(item)) {
                                            traverse(item);
                                        } else {
                                            if (!callback(index as UseTraverseKey<T>, item as UseTraverseValue<T>, path)) {
                                                stop = true;
                                                break;
                                            }
                                        }
                                    }
                                    index++;
                                }
                            } else {
                                traverse(value);
                            }
                        } else {
                            if (!callback(property as UseTraverseKey<T>, value as UseTraverseValue<T>, path)) {
                                stop = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        traverse(t);
    }
};

export let useGenerator: <E>(iterable: Iterable<E>) => SynchronousGenerator<E> = <E>(iterable: Iterable<E>): SynchronousGenerator<E> => {
    if (isIterable(iterable)) {
        return (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            let index: bigint = 0n;
            for (let element of iterable) {
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
            }
        };
    }
    return (): void => { };
};

interface UseArrange {
    <E>(source: Iterable<E>): SynchronousGenerator<E>;
    <E>(source: Iterable<E>, comparator: Comparator<E>): SynchronousGenerator<E>;
    <E>(source: SynchronousGenerator<E>): SynchronousGenerator<E>;
    <E>(source: SynchronousGenerator<E>, comparator: Comparator<E>): SynchronousGenerator<E>;
};

export let useArrange: UseArrange = <E>(source: Iterable<E> | SynchronousGenerator<E>, comparator?: Comparator<E>): SynchronousGenerator<E> => {
    if (isIterable(source)) {
        let buffer: Array<E> = [...source];
        if (validate(comparator) && isFunction(comparator)) {
            return useGenerator(buffer.sort(comparator));
        } else {
            return useGenerator(buffer.map((element: E, index: number): Indexed<E> => {
                return {
                    element: element,
                    index: BigInt(((index % buffer.length) + buffer.length) % buffer.length)
                };
            }).sort((a: Indexed<E>, b: Indexed<E>): number => {
                return Number(a.index - b.index);
            }).map((indexed: Indexed<E>): E => {
                return indexed.element;
            }));
        }
    } else if (isFunction(source)) {
        let collector: SynchronousCollector<E, Array<E>, Array<E>> = useSynchronousToArray();
        let buffer: Array<E> = collector.collect(source);
        if (validate(comparator) && isFunction(comparator)) {
            return useGenerator(buffer.sort(comparator));
        } else {
            return useGenerator(buffer.map((element: E, index: number): Indexed<E> => {
                return {
                    element: element,
                    index: BigInt(((index % buffer.length) + buffer.length) % buffer.length)
                };
            }).sort((a: Indexed<E>, b: Indexed<E>): number => {
                return Number(a.index - b.index);
            }).map((indexed: Indexed<E>): E => {
                return indexed.element;
            }));
        }
    }
    return useGenerator([]);
};

export let useToNumber: <T = unknown>(target: T) => number = <T>(target: T): number => {
    switch (typeof target) {
        case "number":
            return isNumber(target) ? target : 0;
        case "boolean":
            return target ? 1 : 0;
        case "string":
            let result: number = Number(target);
            return isNumber(result) ? result : 0;
        case "bigint":
            return Number(target);
        case "object":
            if (invalidate(target)) {
                return 0;
            }
            if (Reflect.has(target, Symbol.toPrimitive)) {
                let resolved: number = Reflect.apply(Reflect.get(target as object, Symbol.toPrimitive), target, ["default"]);
                return isNumber(resolved) ? resolved : 0;
            }
            return 0;
        default:
            return 0;
    }
};

export let useToBigInt: <T = unknown>(target: T) => bigint = <T>(target: T): bigint => {
    switch (typeof target) {
        case "number":
            return isNumber(target) ? BigInt(target) : 0n;
        case "boolean":
            return target ? 1n : 0n;
        case "string":
            let regex = /^[-+]?\d+$/;
            return regex.test(target) ? BigInt(target) : 0n;
        case "bigint":
            return target;
        case "object":
            if (invalidate(target)) {
                return 0n;
            }
            if (Reflect.has(target, Symbol.toPrimitive)) {
                let resolved: bigint = Reflect.apply(Reflect.get(target as object, Symbol.toPrimitive), target, ["default"]);
                return isBigInt(resolved) ? resolved : 0n;
            }
            return 0n;
        default:
            return 0n;
    }
};