import { type BiPredicate, type DeepPropertyKey, type DeepPropertyValue } from "./utility";
import type { Comparator, Generator } from "./utility";
export declare let useCompare: <T>(t1: T, t2: T) => number;
export declare let useRandom: <T = number | bigint>(index: T) => T;
export declare let useTraverse: <T extends object>(t: T, callback: BiPredicate<DeepPropertyKey<T>, DeepPropertyValue<T>>) => void;
export declare let useGenerator: <E>(iterable: Iterable<E>) => Generator<E>;
interface UseArrange {
    <E>(source: Iterable<E>): Generator<E>;
    <E>(source: Iterable<E>, comparator: Comparator<E>): Generator<E>;
    <E>(source: Generator<E>): Generator<E>;
    <E>(source: Generator<E>, comparator: Comparator<E>): Generator<E>;
}
export declare let useArrange: UseArrange;
export declare let useToNumber: <T = unknown>(target: T) => number;
export declare let useToBigInt: <T = unknown>(target: T) => bigint;
export {};
