import { Optional } from "./optional";
import { Semantic } from "./semantic";
import type { BiPredicate, Predicate, Supplier, Generator, MaybeInvalid } from "./utility";
interface UseAnimationFrame {
    (period: number): Semantic<number>;
    (period: number, delay: number): Semantic<number>;
}
export declare let useAnimationFrame: UseAnimationFrame;
interface Attribute<T> {
    key: keyof T;
    value: T[keyof T];
}
export declare let useAttribute: <T extends object>(target: T) => Semantic<Attribute<T>>;
interface UseBlob {
    (blob: Blob): Semantic<Uint8Array>;
    (blob: Blob, chunk: bigint): Semantic<Uint8Array>;
}
export declare let useBlob: UseBlob;
interface UseDocument {
    <K extends keyof DocumentEventMap>(key: K): Semantic<DocumentEventMap[K extends keyof DocumentEventMap ? K : never]>;
    <K extends keyof DocumentEventMap>(key: Iterable<K>): Semantic<DocumentEventMap[K extends keyof DocumentEventMap ? K : never]>;
}
export declare let useDocument: UseDocument;
interface UseHTMLElement {
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(element: E, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(element: E, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(elements: Iterable<E>, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(elements: Iterable<E>, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selector: S, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selector: S, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selectors: Iterable<S>, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selectors: Iterable<S>, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
}
export declare let useHTMLElement: UseHTMLElement;
export declare let useEmpty: <E>() => Semantic<E>;
interface UseFill {
    <E>(element: E, count: bigint): Semantic<E>;
    <E>(supplier: Supplier<E>, count: bigint): Semantic<E>;
}
export declare let useFill: UseFill;
export interface UseFrom {
    <E>(iterable: Iterable<E>): Semantic<E>;
    <E>(iterable: AsyncIterable<E>): Semantic<E>;
}
export declare let useFrom: UseFrom;
interface UseGenerate {
    <E>(supplier: Supplier<E>, interrupt: Predicate<E>): Semantic<E>;
    <E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): Semantic<E>;
}
export declare let useGenerate: UseGenerate;
interface UseInterval {
    (period: number): Semantic<number>;
    (period: number, delay: number): Semantic<number>;
}
export declare let useInterval: UseInterval;
export declare let useIterate: <E>(generator: Generator<E>) => Semantic<E>;
export declare let usePromise: (<T>(promise: Promise<T>) => Semantic<T>);
interface UseOf {
    <E>(target: E): Semantic<E>;
    <E>(target: Iterable<E>): Semantic<E>;
}
export declare let useOf: UseOf;
interface UseRange {
    <N extends number | bigint>(start: N, end: N): Semantic<N extends number ? number : (N extends bigint ? bigint : never)>;
    <N extends number | bigint>(start: N, end: N, step: N): Semantic<N extends number ? number : (N extends bigint ? bigint : never)>;
}
export declare let useRange: UseRange;
interface UseWebSocket {
    (websocket: WebSocket): Semantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    <K extends keyof WebSocketEventMap>(websocket: WebSocket, key: K): Semantic<WebSocketEventMap[K extends keyof WebSocketEventMap ? K : never]>;
    <K extends keyof WebSocketEventMap>(websocket: WebSocket, keys: Iterable<K>): Semantic<WebSocketEventMap[K extends keyof WebSocketEventMap ? K : never]>;
}
export declare let useWebSocket: UseWebSocket;
interface UseWindow {
    <K extends keyof WindowEventMap>(key: K): Semantic<WindowEventMap[K extends keyof WindowEventMap ? K : never]>;
    <K extends keyof WindowEventMap>(key: Iterable<K>): Semantic<WindowEventMap[K extends keyof WindowEventMap ? K : never]>;
}
export declare let useWindow: UseWindow;
export declare let useNullable: <T>(target: MaybeInvalid<T>) => Optional<T>;
export declare let useNonNull: <T>(target: T) => Optional<T>;
export {};
