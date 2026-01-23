import { Semantic } from "./semantic";
import type { BiFunctional, BiPredicate, Functional, Predicate, Supplier, TriFunctional, Generator } from "./utility";
export declare let animationFrame: Functional<number, Semantic<number>> & BiFunctional<number, number, Semantic<number>>;
interface Attribute<T> {
    key: keyof T;
    value: T[keyof T];
}
export declare let attribute: <T extends object>(target: T) => Semantic<Attribute<T>>;
export declare let blob: Functional<Blob, Semantic<Uint8Array>> & BiFunctional<Blob, bigint, Semantic<Uint8Array>>;
export declare let empty: <E>() => Semantic<E>;
export declare let fill: (<E>(element: E, count: bigint) => Semantic<E>) & (<E>(supplier: Supplier<E>, count: bigint) => Semantic<E>);
export declare let from: <E>(iterable: Iterable<E>) => Semantic<E>;
export declare let generate: (<E>(supplier: Supplier<E>, interrupt: Predicate<E>) => Semantic<E>) & (<E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>) => Semantic<E>);
export declare let interval: Functional<number, Semantic<number>> & BiFunctional<number, number, Semantic<number>>;
export declare let iterate: <E>(generator: Generator<E>) => Semantic<E>;
export declare let promise: (<T>(promise: Promise<T>) => Semantic<T>);
export declare let range: BiFunctional<number, number, Semantic<number>> & TriFunctional<number, number, number, Semantic<number>>;
export declare let websocket: Functional<WebSocket, Semantic<MessageEvent | CloseEvent | Event>>;
export {};
