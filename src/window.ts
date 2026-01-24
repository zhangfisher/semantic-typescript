import { OrderedCollectable } from "./collectable";
import { from } from "./factory";
import { isFunction, isIterable } from "./guard";
import type { Semantic } from "./semantic";
import { WindowCollectableSymbol } from "./symbol";
import type { Comparator } from "./utility";

export class WindowCollectable<E> extends OrderedCollectable<E> {

    protected readonly WindowCollectable: symbol = WindowCollectableSymbol;

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            let source: Array<E> = this.toArray();
            let windows: Array<Array<E>> = [];
            let windowStartIndex: bigint = 0n;
            while (windowStartIndex < BigInt(source.length)) {
                let windowEnd = windowStartIndex + size;
                let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                if (window.length > 0) {
                    windows.push(window);
                }
                windowStartIndex += step;
            }
            return from(windows).map((window: Array<E>) => from(window));
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        return this.slide(size, size);
    }
};