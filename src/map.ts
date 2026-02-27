import { isFunction, isNumber } from "./guard";
import { useHash } from "./hash";
import { useCompare } from "./hook";
import { SemanticMapSymbol } from "./symbol";
import { invalidate, validate, type BiConsumer, type BiFunctional, type Comparator, type MaybeInvalid, type MaybeUndefined, type Supplier, type TriConsumer } from "./utility";

export interface Entry<K, V> {
    key: K;
    value: V;
};

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
};

export abstract class AbstractSemanticMap<K, V> implements SemanticMap<K, V> {

    protected internal: bigint = 0n;

    public size: number = 0;

    protected readonly SemanticMap: symbol = SemanticMapSymbol;

    public constructor() {
        Object.defineProperty(this, "SemanticMap", {
            value: SemanticMapSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
        Object.freeze(this);
    }

    public abstract clear(): void;

    public compute(key: K, remapping: BiFunctional<K, MaybeInvalid<V>, MaybeInvalid<V>>): MaybeInvalid<V> {
        let value: MaybeInvalid<V> = this.get(key);
        return remapping(key, value);
    }

    public computeIfAbsent(key: K, remapping: Supplier<V>): V {
        let value: MaybeInvalid<V> = this.get(key);
        if (invalidate(value)) {
            return remapping();
        }
        return value;
    }

    public computeIfPresent(key: K, remapping: BiFunctional<K, V, MaybeInvalid<V>>): MaybeInvalid<V> {
        let value: MaybeInvalid<V> = this.get(key);
        if (validate(value)) {
            return remapping(key, value);
        }
        return value;
    }

    public abstract delete(key: K): boolean;

    public abstract entries(): MapIterator<[K, V]>;

    public forEach(consumer: BiConsumer<V, K>): void;
    public forEach(consumer: TriConsumer<V, K, Map<K, V>>): void;
    public forEach(consumer: BiConsumer<V, K> | TriConsumer<V, K, Map<K, V>>): void {
        for (let entry of this.entries()) {
            consumer(entry[1], entry[0], this as unknown as globalThis.Map<K, V>);
        }
    }

    public abstract get(key: K): MaybeUndefined<V>;
    public abstract get(key: K, defaultValue: V): V;

    public abstract keys(): MapIterator<K>;

    public has(key: K): boolean {
        return this.get(key) !== undefined;
    }

    public replace(key: K, value: V): MaybeInvalid<V>;
    public replace(key: K, oldValue: V, newValue: V): boolean;
    public replace(argument1: K, argument2: V, argument3?: V): boolean | MaybeInvalid<V> {
        if (validate(argument1) && validate(argument2) && validate(argument3)) {
            let key: K = argument1;
            let oldValue: V = argument2;
            let newValue: V = argument3;
            if (this.get(key) === oldValue) {
                this.set(key, newValue);
                return true;
            }
            return this.get(key);
        }
        if (validate(argument1) && validate(argument2) && invalidate(argument3)) {
            let key: K = argument1;
            let value: V = argument2;
            if (this.get(key) === value) {
                this.delete(key);
                return true;
            }
            return this.get(key);
        }
    }

    public replaceAll(operator: BiFunctional<K, V, MaybeInvalid<V>>): void {
        for (let entry of this.entries()) {
            let key: K = entry[0];
            let value: V = entry[1];
            let newValue: MaybeInvalid<V> = operator(key, value);
            if (validate(newValue)) {
                this.set(key, newValue);
            } else {
                this.delete(key);
            }
        }
    }

    public abstract set(key: K, value: V): this;

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    [Symbol.toStringTag]: string = "SemanticMap";

    public abstract values(): IterableIterator<V>;
};
Object.freeze(AbstractSemanticMap);
Object.freeze(AbstractSemanticMap.prototype);
Object.freeze(Object.getPrototypeOf(AbstractSemanticMap));

export class HashMap<K, V> extends AbstractSemanticMap<K, V> {

    protected buckets: Map<bigint, Array<Entry<K, V>>> = new Map<bigint, Array<Entry<K, V>>>();
    protected threashold: number;
    protected comparator: Comparator<K>;
    protected capacity: number;

    protected readonly HashMap: symbol = SemanticMapSymbol;

    public constructor();
    public constructor(comparator: Comparator<K>);
    public constructor(threashold: number, initialCapacity: number);
    public constructor(comparator: Comparator<K>, threashold: number, capacity: number);
    public constructor(argument1?: Comparator<K> | number, argument2?: number, argument3?: number) {
        super();
        if (isFunction(argument1) && isNumber(argument2) && isNumber(argument3)) {
            this.comparator = argument1;
            this.threashold = argument2;
            this.capacity = argument3;
        } else if (isFunction(argument1) && isNumber(argument2) && invalidate(argument3)) {
            this.comparator = argument1;
            this.threashold = argument2;
            this.capacity = 16;
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            this.comparator = argument1;
            this.threashold = 0.75;
            this.capacity = 16;
        } else {
            this.comparator = useCompare;
            this.threashold = 0.75;
            this.capacity = 16;
        }
        this.buckets = new Map<bigint, Array<Entry<K, V>>>();
        Object.defineProperty(this, "size", {
            get: () => this.internal,
            set: (value: number) => this.internal = isNumber(value) ? BigInt(value) : 0n,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "HashMap", {
            value: SemanticMapSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
        Object.freeze(this);
    }

    public override clear(): void {
        this.buckets.clear();
        this.size = 0;
    }

    public override delete(key: K): boolean {
        let hashCode: bigint = this.hash(key);
        let bucket: Array<Entry<K, V>> = this.buckets.get(hashCode) || [];
        if (bucket.length > 0) {
            for (let index: number = 0; index < bucket.length; index++) {
                let entry: Entry<K, V> = bucket[index];
                if (this.comparator(entry.key, key) === 0) {
                    bucket.splice(index, 1);
                    this.size--;
                    if (bucket.length === 0) {
                        this.buckets.delete(hashCode);
                    }
                    return true;
                }
            }
        }
        this.buckets.delete(hashCode);
        return false;
    }

    public override *entries(): MapIterator<[K, V]> {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield [entry.key, entry.value];
            }
        }
    }

    public override has(key: K): boolean {
        let hashCode: bigint = this.hash(key);
        return validate(this.findEntry(key, hashCode));
    }

    protected hash(key: K): bigint {
        return useHash(key);
    };

    protected findEntry(key: K, hash: bigint): MaybeInvalid<Entry<K, V>> {
        let candidates = (this.buckets.get(hash) || []);
        for (let candidate of candidates) {
            if (this.comparator(candidate.key, key) === 0) {
                return candidate;
            }
        }
        return (void 0);
    }

    public override get(key: K): MaybeUndefined<V>;
    public override get(key: K, defaultValue: V): V;
    public override get(argument1: K, argument2?: V): MaybeUndefined<V> {
        if (validate(argument1) && validate(argument2)) {
            let key: K = argument1;
            let defaultValue: V = argument2;
            let hashCode: bigint = this.hash(key);
            let entry: MaybeInvalid<Entry<K, V>> = this.findEntry(key, hashCode);
            if (validate(entry)) {
                return entry.value;
            }
            return defaultValue;
        }
        let key: K = argument1;
        let hashCode: bigint = this.hash(key);
        let entry: MaybeInvalid<Entry<K, V>> = this.findEntry(key, hashCode);
        if (validate(entry)) {
            return entry.value;
        }
        return (void 0);
    }

    public override *keys(): MapIterator<K> {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield entry.key;
            }
        }
    }

    protected rehash(): void {
        let oldBuckets: Map<bigint, Array<Entry<K, V>>> = this.buckets;
        this.buckets = new Map<bigint, Array<Entry<K, V>>>();
        this.size = 0;
        for (let bucket of oldBuckets.values()) {
            for (let entry of bucket) {
                let hashCode: bigint = this.hash(entry.key);
                let bucket: Array<Entry<K, V>> = this.buckets.get(hashCode) || [];
                bucket.push(entry);
                this.size++;
            }
        }
    }
    
    public override set(key: K, value: V): this {
        let hashCode: bigint = this.hash(key);
        let bucket: Array<Entry<K, V>> = this.buckets.get(hashCode) || [];
        let found: MaybeInvalid<Entry<K, V>> = this.findEntry(key, hashCode);
        if (validate(found)) {
            found.value = value;
        }else{
            bucket.push({
                key: key,
                value: value
            });
            this.size++;
            if(this.size > this.capacity * this.threashold){
                this.rehash();
            }
        }
        return this;
    }

    public override *values(): IterableIterator<V> {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield entry.value;
            }
        }
    }
};
Object.freeze(HashMap);
Object.freeze(HashMap.prototype);
Object.freeze(Object.getPrototypeOf(HashMap));

export class TreeMap<K, V>{
    key: K = (void 0)!;
    value: V = (void 0)!;
}