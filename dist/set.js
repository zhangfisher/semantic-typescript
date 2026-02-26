import { HashMap } from "./map";
export class HashSet {
    map = new HashMap();
    size = 0;
    constructor() {
        Object.defineProperty(this, "size", {
            get: () => this.map.size,
            set: (value) => {
                this.map.size = value;
            },
            enumerable: true,
            configurable: true
        });
    }
    add(value) {
        this.map.set(value, true);
        return this;
    }
    clear() {
        this.map.clear();
    }
    delete(value) {
        return this.map.delete(value);
    }
    *entries() {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield [key, key];
            }
        }
    }
    forEach(consumer) {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                consumer(key, key);
            }
        }
    }
    has(value) {
        return this.map.has(value);
    }
    *keys() {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield key;
            }
        }
    }
    *values() {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield key;
            }
        }
    }
    [Symbol.iterator]() {
        return this.values();
    }
    [Symbol.toStringTag] = "HashSet";
}
;
Object.freeze(HashSet);
Object.freeze(HashSet.prototype);
Object.freeze(Object.getPrototypeOf(HashSet));
