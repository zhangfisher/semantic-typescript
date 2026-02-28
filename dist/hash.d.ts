import { type Type } from "./utility";
export declare let maskOf: (type: Type) => bigint;
interface Handler<T> {
    (value: T): bigint;
}
export declare let register: <T>(type: Type, handler: Handler<T>) => void;
export declare let unregister: (type: Type) => void;
interface UseHash {
    <T = unknown>(target: T): bigint;
    (...value: Array<unknown>): bigint;
}
export declare let useHash: UseHash;
export {};
