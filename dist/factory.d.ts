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
type KeyOfEventMap<T extends Window | Document | HTMLElement> = T extends Window ? keyof WindowEventMap : (T extends Document ? keyof DocumentEventMap : (T extends HTMLElement ? keyof HTMLElementEventMap : never));
type ValueOfEventMap<T extends Window | Document | HTMLElement, K extends KeyOfEventMap<T>> = T extends Window ? (K extends keyof WindowEventMap ? WindowEventMap[K] : never) : (T extends Document ? (K extends keyof DocumentEventMap ? DocumentEventMap[K] : never) : (T extends HTMLElement ? (K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : never) : never));
interface EventFunction {
    <E extends Window, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: K): Semantic<V>;
    <E extends Window, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: Iterable<K>): Semantic<V>;
    <E extends Document, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: K): Semantic<V>;
    <E extends Document, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: Iterable<K>): Semantic<V>;
    <E extends Document, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: Iterable<K>): Semantic<V>;
    <E extends HTMLElement, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: K): Semantic<V>;
    <E extends HTMLElement, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: E, key: Iterable<K>): Semantic<V>;
    <E extends HTMLElement, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: Iterable<E>, key: K): Semantic<V>;
    <E extends HTMLElement, K extends KeyOfEventMap<E>, V = ValueOfEventMap<E, K>>(target: Iterable<E>, key: Iterable<K>): Semantic<V>;
}
export declare let event: EventFunction;
export declare let fill: (<E>(element: E, count: bigint) => Semantic<E>) & (<E>(supplier: Supplier<E>, count: bigint) => Semantic<E>);
export interface From {
    <E>(iterable: Iterable<E>): Semantic<E>;
    <E>(iterable: AsyncIterable<E>): Semantic<E>;
}
export declare let from: From;
export declare let generate: (<E>(supplier: Supplier<E>, interrupt: Predicate<E>) => Semantic<E>) & (<E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>) => Semantic<E>);
export declare let interval: Functional<number, Semantic<number>> & BiFunctional<number, number, Semantic<number>>;
export declare let iterate: <E>(generator: Generator<E>) => Semantic<E>;
export declare let promise: (<T>(promise: Promise<T>) => Semantic<T>);
export declare let range: BiFunctional<number, number, Semantic<number>> & TriFunctional<number, number, number, Semantic<number>>;
export declare let websocket: Functional<WebSocket, Semantic<MessageEvent | CloseEvent | Event>>;
export {};
