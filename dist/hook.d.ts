import { type DeepPropertyKey, type DeepPropertyValue } from "./utility";
import type { Comparator, SynchronousGenerator } from "./utility";
export declare let useCompare: <T>(t1: T, t2: T) => number;
interface UseRandom {
    <N extends number | bigint>(start: N): N extends number ? number : (N extends bigint ? bigint : never);
    <N extends number | bigint>(start: N, end: N): N;
}
export declare let useRandom: UseRandom;
export type UseTraverseKey<T extends object> = DeepPropertyKey<T> & (symbol | string | number);
export type UseTraverseValue<T extends object> = DeepPropertyValue<T>;
export type UseTraversePath<T extends object> = Array<UseTraverseKey<T> & (symbol | string | number)>;
export interface UseTraverseCallback<T extends object> {
    (key: UseTraverseKey<T>, value: UseTraverseValue<T>): boolean;
}
export interface UseTraversePathCallback<T extends object> {
    (key: UseTraverseKey<T>, value: UseTraverseValue<T>, path: UseTraversePath<T>): boolean;
}
interface UseTraverse {
    <T extends object>(t: T, callback: UseTraverseCallback<T>): void;
    <T extends object>(t: T, callback: UseTraversePathCallback<T>): void;
}
export declare let useTraverse: UseTraverse;
export declare let useGenerator: <E>(iterable: Iterable<E>) => SynchronousGenerator<E>;
interface UseArrange {
    <E>(source: Iterable<E>): SynchronousGenerator<E>;
    <E>(source: Iterable<E>, comparator: Comparator<E>): SynchronousGenerator<E>;
    <E>(source: SynchronousGenerator<E>): SynchronousGenerator<E>;
    <E>(source: SynchronousGenerator<E>, comparator: Comparator<E>): SynchronousGenerator<E>;
}
export declare let useArrange: UseArrange;
export declare let useToNumber: <T = unknown>(target: T) => number;
export declare let useToBigInt: <T = unknown>(target: T) => bigint;
export {};
