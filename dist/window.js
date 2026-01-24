import { OrderedCollectable } from "./collectable";
import { from } from "./factory";
import { isFunction, isIterable } from "./guard";
import { WindowCollectableSymbol } from "./symbol";
export class WindowCollectable extends OrderedCollectable {
    WindowCollectable = WindowCollectableSymbol;
    constructor(parameter, comparator) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
        else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
    }
    slide(size, step = 1n) {
        if (size > 0n && step > 0n) {
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
        throw new RangeError("Invalid arguments.");
    }
    tumble(size) {
        return this.slide(size, size);
    }
}
;
