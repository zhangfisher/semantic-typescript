import { OrderedCollectable } from "./collectable";
import { useToAsyncGeneratorFunction, useToGeneratorFunction } from "./collector";
import { from } from "./factory";
import { useCompare } from "./hook";
import { WindowCollectableSymbol } from "./symbol";
export class WindowCollectable extends OrderedCollectable {
    WindowCollectable = WindowCollectableSymbol;
    constructor(parameter, comparator = useCompare) {
        super(parameter, comparator);
    }
    *[Symbol.iterator]() {
        try {
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    slide(size, step = 1n) {
        if (size > 0n && step > 0n) {
            try {
                let source = this.toArray();
                let windows = [];
                let windowStartIndex = 0n;
                while (windowStartIndex < BigInt(source.length)) {
                    let windowEnd = windowStartIndex + size;
                    let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                    if (window.length > 0) {
                        windows.push(window);
                    }
                    windowStartIndex += step;
                }
                return from(windows).map((window) => from(window));
            }
            catch (error) {
                throw new Error("Invalid arguments.");
            }
        }
        throw new RangeError("Invalid arguments.");
    }
    tumble(size) {
        try {
            return this.slide(size, size);
        }
        catch (error) {
            throw new Error("Invalid arguments.");
        }
    }
}
;
