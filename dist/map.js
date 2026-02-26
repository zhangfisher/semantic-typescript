import { isFunction, isNumber } from "./guard";
import { useHash } from "./hash";
import { useCompare } from "./hook";
import { SemanticMapSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
;
;
export class AbstractSemanticMap {
    internal = 0n;
    size = 0;
    SemanticMap = SemanticMapSymbol;
    constructor() {
        Object.defineProperty(this, "SemanticMap", {
            value: SemanticMapSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }
    compute(key, remapping) {
        let value = this.get(key);
        return remapping(key, value);
    }
    computeIfAbsent(key, remapping) {
        let value = this.get(key);
        if (invalidate(value)) {
            return remapping();
        }
        return value;
    }
    computeIfPresent(key, remapping) {
        let value = this.get(key);
        if (validate(value)) {
            return remapping(key, value);
        }
        return value;
    }
    forEach(consumer) {
        for (let entry of this.entries()) {
            consumer(entry[1], entry[0], this);
        }
    }
    has(key) {
        return this.get(key) !== undefined;
    }
    replace(argument1, argument2, argument3) {
        if (validate(argument1) && validate(argument2) && validate(argument3)) {
            let key = argument1;
            let oldValue = argument2;
            let newValue = argument3;
            if (this.get(key) === oldValue) {
                this.set(key, newValue);
                return true;
            }
            return this.get(key);
        }
        if (validate(argument1) && validate(argument2) && invalidate(argument3)) {
            let key = argument1;
            let value = argument2;
            if (this.get(key) === value) {
                this.delete(key);
                return true;
            }
            return this.get(key);
        }
    }
    replaceAll(operator) {
        for (let entry of this.entries()) {
            let key = entry[0];
            let value = entry[1];
            let newValue = operator(key, value);
            if (validate(newValue)) {
                this.set(key, newValue);
            }
            else {
                this.delete(key);
            }
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    [Symbol.toStringTag] = "SemanticMap";
}
;
Object.freeze(AbstractSemanticMap);
Object.freeze(AbstractSemanticMap.prototype);
Object.freeze(Object.getPrototypeOf(AbstractSemanticMap));
export class HashMap extends AbstractSemanticMap {
    buckets = new Map();
    threashold;
    comparator;
    capacity;
    HashMap = SemanticMapSymbol;
    constructor(argument1, argument2, argument3) {
        super();
        if (isFunction(argument1) && isNumber(argument2) && isNumber(argument3)) {
            this.comparator = argument1;
            this.threashold = argument2;
            this.capacity = argument3;
        }
        else if (isFunction(argument1) && isNumber(argument2) && invalidate(argument3)) {
            this.comparator = argument1;
            this.threashold = argument2;
            this.capacity = 16;
        }
        else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            this.comparator = argument1;
            this.threashold = 0.75;
            this.capacity = 16;
        }
        else {
            this.comparator = useCompare;
            this.threashold = 0.75;
            this.capacity = 16;
        }
        this.buckets = new Map();
        Object.defineProperty(this, "size", {
            get: () => this.internal,
            set: (value) => this.internal = isNumber(value) ? BigInt(value) : 0n,
            enumerable: true,
            configurable: false
        });
        Object.defineProperty(this, "HashMap", {
            value: SemanticMapSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }
    clear() {
        this.buckets.clear();
        this.size = 0;
    }
    delete(key) {
        let hashCode = this.hash(key);
        let bucket = this.buckets.get(hashCode) || [];
        if (bucket.length > 0) {
            for (let index = 0; index < bucket.length; index++) {
                let entry = bucket[index];
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
    *entries() {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield [entry.key, entry.value];
            }
        }
    }
    has(key) {
        let hashCode = this.hash(key);
        return validate(this.findEntry(key, hashCode));
    }
    hash(key) {
        return useHash(key);
    }
    ;
    findEntry(key, hash) {
        let candidates = (this.buckets.get(hash) || []);
        for (let candidate of candidates) {
            if (this.comparator(candidate.key, key) === 0) {
                return candidate;
            }
        }
        return (void 0);
    }
    get(argument1, argument2) {
        if (validate(argument1) && validate(argument2)) {
            let key = argument1;
            let defaultValue = argument2;
            let hashCode = this.hash(key);
            let entry = this.findEntry(key, hashCode);
            if (validate(entry)) {
                return entry.value;
            }
            return defaultValue;
        }
        let key = argument1;
        let hashCode = this.hash(key);
        let entry = this.findEntry(key, hashCode);
        if (validate(entry)) {
            return entry.value;
        }
        return (void 0);
    }
    *keys() {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield entry.key;
            }
        }
    }
    rehash() {
        let oldBuckets = this.buckets;
        this.buckets = new Map();
        this.size = 0;
        for (let bucket of oldBuckets.values()) {
            for (let entry of bucket) {
                let hashCode = this.hash(entry.key);
                let bucket = this.buckets.get(hashCode) || [];
                bucket.push(entry);
                this.size++;
            }
        }
    }
    set(key, value) {
        let hashCode = this.hash(key);
        let bucket = this.buckets.get(hashCode) || [];
        let found = this.findEntry(key, hashCode);
        if (validate(found)) {
            found.value = value;
        }
        else {
            bucket.push({
                key: key,
                value: value
            });
            this.size++;
            if (this.size > this.capacity * this.threashold) {
                this.rehash();
            }
        }
        return this;
    }
    *values() {
        for (let bucket of this.buckets.values()) {
            for (let entry of bucket) {
                yield entry.value;
            }
        }
    }
}
;
Object.freeze(HashMap);
Object.freeze(HashMap.prototype);
Object.freeze(Object.getPrototypeOf(HashMap));
