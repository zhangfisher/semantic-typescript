export type Invalid<T> = T extends null | undefined ? T : never;
export type Valid<T> = T extends null | undefined ? never : T;
export type MaybeInvalid<T> = T | null | undefined;
export declare let validate: <T>(t: MaybeInvalid<T>) => t is T;
export declare let invalidate: <T>(t: MaybeInvalid<T>) => t is (null | undefined);
export type Primitive = string | number | boolean | symbol | bigint | Function | ((...args: any[]) => any);
export type MaybePrimitive<T> = T | Primitive;
export type AsyncFunction = (...args: any[]) => Promise<unknown>;
export type DeepPropertyKey<T extends object> = {
    [K in keyof T]: T[K] extends object ? DeepPropertyKey<T[K]> : K;
};
export type DeepPropertyValue<T extends object> = {
    [K in keyof T]: T[K] extends object ? DeepPropertyValue<T[K]> : T[K];
};
export interface Runnable {
    (): void;
}
export interface Supplier<R> {
    (): R;
}
export interface Functional<T, R> {
    (t: T): R;
}
export interface Predicate<T> {
    (t: T): boolean;
}
export interface BiFunctional<T, U, R> {
    (t: T, u: U): R;
}
export interface BiPredicate<T, U> {
    (t: T, u: U): boolean;
}
export interface TriPredicate<T, U, V> {
    (t: T, u: U, v: V): boolean;
}
export interface Comparator<T> {
    (t1: T, t2: T): number;
}
export interface TriFunctional<T, U, V, R> {
    (t: T, u: U, v: V): R;
}
export interface Consumer<T> {
    (t: T): void;
}
export interface BiConsumer<T, U> {
    (t: T, u: U): void;
}
export interface TriConsumer<T, U, V> {
    (t: T, u: U, v: V): void;
}
export interface Generator<T> {
    (accept: Consumer<T>, interrupt: Predicate<T>): void;
    (accept: Consumer<T>, interrupt: BiPredicate<T, bigint>): void;
    (accept: BiConsumer<T, bigint>, interrupt: Predicate<T>): void;
    (accept: BiConsumer<T, bigint>, interrupt: BiPredicate<T, bigint>): void;
}
export interface Indexed<E> {
    element: E;
    index: bigint;
}
