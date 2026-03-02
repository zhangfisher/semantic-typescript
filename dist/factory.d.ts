import { AsynchronousSemantic } from "./asynchronous/semantic";
import { Optional } from "./optional";
import { SynchronousSemantic } from "./synchronous/semantic";
import type { BiPredicate, Predicate, Supplier, MaybeInvalid, SynchronousGenerator } from "./utility";
interface UseAnimationFrame {
    (period: number): SynchronousSemantic<number>;
    (period: number, delay: number): SynchronousSemantic<number>;
}
export declare let useAnimationFrame: UseAnimationFrame;
interface Attribute<T> {
    key: keyof T;
    value: T[keyof T];
}
export declare let useAttribute: <T extends object>(target: T) => SynchronousSemantic<Attribute<T>>;
interface UseBlob {
    (blob: Blob): SynchronousSemantic<Uint8Array>;
    (blob: Blob, chunk: bigint): SynchronousSemantic<Uint8Array>;
}
export declare let useBlob: UseBlob;
interface UseDocument {
    <K extends keyof DocumentEventMap, V extends DocumentEventMap[K]>(key: K): AsynchronousSemantic<V>;
    <K extends keyof DocumentEventMap, V extends DocumentEventMap[K]>(key: Iterable<K>): AsynchronousSemantic<V>;
}
export declare let useDocument: UseDocument;
interface UseHTMLElementOptions {
    throttle?: number;
    debounce?: number;
}
interface UseHTMLElement {
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, key: K): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, keys: Iterable<K>): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, key: K): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, key: K): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, key: K): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, keys: Iterable<K>): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, key: K): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, key: K): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
}
export declare let useHTMLElement: UseHTMLElement;
export declare let useEmpty: <E>() => SynchronousSemantic<E>;
interface UseFill {
    <E>(element: E, count: bigint): SynchronousSemantic<E>;
    <E>(supplier: Supplier<E>, count: bigint): SynchronousSemantic<E>;
}
export declare let useFill: UseFill;
export interface UseFrom {
    <E>(iterable: Iterable<E>): SynchronousSemantic<E>;
    <E>(iterable: AsyncIterable<E>): SynchronousSemantic<E>;
}
export declare let useFrom: UseFrom;
interface UseGenerate {
    <E>(supplier: Supplier<E>, interrupt: Predicate<E>): SynchronousSemantic<E>;
    <E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): SynchronousSemantic<E>;
}
export declare let useGenerate: UseGenerate;
interface UseInterval {
    (period: number): SynchronousSemantic<number>;
    (period: number, delay: number): SynchronousSemantic<number>;
}
export declare let useInterval: UseInterval;
export declare let useIterate: <E>(generator: SynchronousGenerator<E>) => SynchronousSemantic<E>;
export declare let usePromise: (<T>(promise: Promise<T>) => SynchronousSemantic<T>);
interface UseOf {
    <E>(target: E): SynchronousSemantic<E>;
    <E>(target: Iterable<E>): SynchronousSemantic<E>;
}
export declare let useOf: UseOf;
interface UseRange {
    <N extends number | bigint>(start: N, end: N): SynchronousSemantic<N extends number ? number : (N extends bigint ? bigint : never)>;
    <N extends number | bigint>(start: N, end: N, step: N): SynchronousSemantic<N extends number ? number : (N extends bigint ? bigint : never)>;
}
export declare let useRange: UseRange;
interface UseWebSocketOptions {
    throttle?: number;
    debounce?: number;
}
interface UseWebSocket {
    (websocket: WebSocket): AsynchronousSemantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    (websocket: WebSocket, options: UseWebSocketOptions): AsynchronousSemantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, key: K): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, key: K, options: UseWebSocketOptions): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, keys: Iterable<K>, options: UseWebSocketOptions): AsynchronousSemantic<V>;
}
export declare let useWebSocket: UseWebSocket;
interface UseWindowOptions {
    throttle?: number;
    debounce?: number;
}
interface UseWindow {
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(key: K): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(key: K, options: UseWindowOptions): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(keys: Iterable<K>, options: UseWindowOptions): AsynchronousSemantic<V>;
}
export declare let useWindow: UseWindow;
export declare let useNullable: <T>(target: MaybeInvalid<T>) => Optional<T>;
export declare let useNonNull: <T>(target: T) => Optional<T>;
export {};
