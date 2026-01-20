import { type BiConsumer, type DeepPropertyKey, type DeepPropertyValue } from "./utility";
export declare let useCompare: <T>(t1: T, t2: T) => number;
export declare let useRandom: <T = number | bigint>(index: T) => T;
export declare let useTraverse: <T extends object>(t: T, callback: BiConsumer<DeepPropertyKey<T>, DeepPropertyValue<T>>) => void;
