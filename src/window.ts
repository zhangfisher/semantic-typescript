import { OrderedCollectable } from "./collectable";
import { useToAsyncGeneratorFunction, useToGeneratorFunction, type Collector } from "./collector";
import { from } from "./factory";
import { useCompare } from "./hook";
import type { Semantic } from "./semantic";
import { WindowCollectableSymbol } from "./symbol";
import type { Comparator, Generator } from "./utility";

export class WindowCollectable<E> extends OrderedCollectable<E> {

    protected readonly WindowCollectable: symbol = WindowCollectableSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator: Comparator<E> = useCompare) {
        super(parameter, comparator);
        Object.defineProperties(this, {
            "WindowCollectable": {
                value: WindowCollectableSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
        Object.freeze(this);
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.Generator<E, void, undefined>> = useToGeneratorFunction();
            yield* collector.collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>> = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            try {
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
            } catch (error) {
                throw new Error("Invalid arguments.");
            }
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        try {
            return this.slide(size, size);
        } catch (error) {
            throw new Error("Invalid arguments.");
        }
    }
};
Object.freeze(WindowCollectable);
Object.freeze(WindowCollectable.prototype);
Object.freeze(Object.getPrototypeOf(WindowCollectable));