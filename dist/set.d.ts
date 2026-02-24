import { HashMap } from "./map";
import type { BiConsumer, Consumer, TriConsumer } from "./utility";
export declare class HashSet<E> implements Set<E> {
    protected map: HashMap<E, boolean>;
    size: number;
    constructor();
    add(value: E): this;
    clear(): void;
    delete(value: E): boolean;
    entries(): SetIterator<[E, E]>;
    forEach(consumer: Consumer<E>): void;
    forEach(consumer: BiConsumer<E, E>): void;
    forEach(consumer: TriConsumer<E, E, Set<E>>): void;
    has(value: E): boolean;
    keys(): IterableIterator<E>;
    values(): IterableIterator<E>;
    [Symbol.iterator](): IterableIterator<E>;
    [Symbol.toStringTag]: string;
}
