import { type BiConsumer, type BiFunctional, type Comparator, type MaybeInvalid, type MaybeUndefined, type Supplier, type TriConsumer } from "./utility";
export interface Entry<K, V> {
    key: K;
    value: V;
}
export interface SemanticMap<K, V> extends globalThis.Map<K, V> {
    clear(): void;
    compute(key: K, remapping: BiFunctional<K, MaybeInvalid<V>, MaybeInvalid<V>>): MaybeInvalid<V>;
    computeIfAbsent(key: K, remapping: Supplier<V>): V;
    computeIfPresent(key: K, remapping: BiFunctional<K, V, MaybeInvalid<V>>): MaybeInvalid<V>;
    delete(key: K): boolean;
    entries(): MapIterator<[K, V]>;
    forEach(consumer: BiConsumer<V, K>): void;
    forEach(consumer: TriConsumer<V, K, Map<K, V>>): void;
    get(key: K): MaybeUndefined<V>;
    get(key: K, defaultValue: V): V;
    has(key: K): boolean;
    replace(key: K, value: V): MaybeInvalid<V>;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replaceAll(operator: BiFunctional<K, V, MaybeInvalid<V>>): void;
    set(key: K, value: V): this;
    size: number;
    values(): IterableIterator<V>;
}
export declare abstract class AbstractSemanticMap<K, V> implements SemanticMap<K, V> {
    protected internal: bigint;
    size: number;
    protected readonly SemanticMap: symbol;
    constructor();
    abstract clear(): void;
    compute(key: K, remapping: BiFunctional<K, MaybeInvalid<V>, MaybeInvalid<V>>): MaybeInvalid<V>;
    computeIfAbsent(key: K, remapping: Supplier<V>): V;
    computeIfPresent(key: K, remapping: BiFunctional<K, V, MaybeInvalid<V>>): MaybeInvalid<V>;
    abstract delete(key: K): boolean;
    abstract entries(): MapIterator<[K, V]>;
    forEach(consumer: BiConsumer<V, K>): void;
    forEach(consumer: TriConsumer<V, K, Map<K, V>>): void;
    abstract get(key: K): MaybeUndefined<V>;
    abstract get(key: K, defaultValue: V): V;
    abstract keys(): MapIterator<K>;
    has(key: K): boolean;
    replace(key: K, value: V): MaybeInvalid<V>;
    replace(key: K, oldValue: V, newValue: V): boolean;
    replaceAll(operator: BiFunctional<K, V, MaybeInvalid<V>>): void;
    abstract set(key: K, value: V): this;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    [Symbol.toStringTag]: string;
    abstract values(): IterableIterator<V>;
}
export declare class HashMap<K, V> extends AbstractSemanticMap<K, V> {
    protected buckets: Map<bigint, Array<Entry<K, V>>>;
    protected threashold: number;
    protected comparator: Comparator<K>;
    protected capacity: number;
    protected readonly HashMap: symbol;
    constructor();
    constructor(comparator: Comparator<K>);
    constructor(threashold: number, initialCapacity: number);
    constructor(comparator: Comparator<K>, threashold: number, capacity: number);
    clear(): void;
    delete(key: K): boolean;
    entries(): MapIterator<[K, V]>;
    has(key: K): boolean;
    protected hash(key: K): bigint;
    protected findEntry(key: K, hash: bigint): MaybeInvalid<Entry<K, V>>;
    get(key: K): MaybeUndefined<V>;
    get(key: K, defaultValue: V): V;
    keys(): MapIterator<K>;
    protected rehash(): void;
    set(key: K, value: V): this;
    values(): IterableIterator<V>;
}
