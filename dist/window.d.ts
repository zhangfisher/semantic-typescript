import { OrderedCollectable } from "./collectable";
import type { Semantic } from "./semantic";
import type { Comparator, Generator } from "./utility";
export declare class WindowCollectable<E> extends OrderedCollectable<E> {
    protected readonly WindowCollectable: symbol;
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    slide(size: bigint, step?: bigint): Semantic<Semantic<E>>;
    tumble(size: bigint): Semantic<Semantic<E>>;
}
