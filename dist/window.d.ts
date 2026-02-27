import { OrderedCollectable } from "./collectable";
import type { Semantic } from "./semantic";
import type { Comparator, Generator } from "./utility";
export declare class WindowCollectable<E> extends OrderedCollectable<E> {
    protected readonly WindowCollectable: symbol;
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    [Symbol.iterator](): globalThis.Generator<E, void, undefined>;
    [Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined>;
    slide(size: bigint, step?: bigint): Semantic<Semantic<E>>;
    tumble(size: bigint): Semantic<Semantic<E>>;
}
