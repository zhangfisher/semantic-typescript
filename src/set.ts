import { HashMap } from "./map";
import type { BiConsumer, Consumer, TriConsumer } from "./utility";

export class HashSet<E> implements Set<E>{

    protected map: HashMap<E, boolean> = new HashMap<E, boolean>();

    public size: number = 0;

    public constructor(){
        Object.defineProperty(this, "size", {
            get: () => this.map.size,
            set: (value: number) => {
                this.map.size = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.freeze(this);
    }

    public add(value: E): this {
        this.map.set(value, true);
        return this;
    }

    public clear(): void {
        this.map.clear();
    }

    public delete(value: E): boolean {
        return this.map.delete(value);
    }

    public *entries(): SetIterator<[E, E]> {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield [key, key];
            }
        }
    }

    public forEach(consumer: Consumer<E>): void;
    public forEach(consumer: BiConsumer<E, E>): void;
    public forEach(consumer: TriConsumer<E, E, Set<E>>): void;
    public forEach(consumer: Consumer<E> | BiConsumer<E, E>): void{
        for (let [key, value] of this.map.entries()) {
            if (value) {
                consumer(key, key);
            }
        }
    }

    public has(value: E): boolean {
        return this.map.has(value);
    }

    public *keys(): IterableIterator<E> {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield key;
            }
        }
    }

    public *values(): IterableIterator<E> {
        for (let [key, value] of this.map.entries()) {
            if (value) {
                yield key;
            }
        }
    }

    [Symbol.iterator](): IterableIterator<E> {
        return this.values();
    }

    [Symbol.toStringTag]: string = "HashSet";
};
Object.freeze(HashSet);
Object.freeze(HashSet.prototype);
Object.freeze(Object.getPrototypeOf(HashSet));