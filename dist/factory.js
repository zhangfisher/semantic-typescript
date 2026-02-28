import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise, isAsyncIterable, isString, isHTMLElemet } from "./guard";
import { useCompare, useToBigInt, useToNumber, useTraverse } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
;
export let useAnimationFrame = (period, delay = 0) => {
    if (period <= 0 || !Number.isFinite(period) || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Period must be positive finite number and delay must be non-negative finite number.");
    }
    return new Semantic((accept, interrupt) => {
        try {
            let start = performance.now();
            let index = 0n;
            let animate = () => {
                if (performance.now() - start >= delay) {
                    requestAnimationFrame(animate);
                }
                else if (performance.now() - start < period) {
                    requestAnimationFrame(animate);
                }
                else {
                    if (interrupt(start, index)) {
                        return;
                    }
                    accept(performance.now(), index);
                }
            };
        }
        catch (error) {
            console.error(error);
        }
    });
};
;
export let useAttribute = (target) => {
    if (isObject(target)) {
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                useTraverse(target, (key, value) => {
                    let attribute = {
                        key: key,
                        value: value
                    };
                    if (interrupt(attribute, index)) {
                        return false;
                    }
                    accept(attribute, index);
                    index++;
                    return true;
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Target must be an object.");
};
;
export let useBlob = (blob, chunk = 64n * 1024n) => {
    let size = Number(chunk);
    if (size <= 0 || !Number.isSafeInteger(size)) {
        throw new RangeError("Chunk size must be a safe positive integer.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic((accept, interrupt) => {
        try {
            let index = 0n;
            let stoppable = false;
            let stream = blob.stream();
            let reader = stream.getReader();
            let buffer = new Uint8Array(size);
            let offset = 0;
            (async () => {
                try {
                    while (!stoppable) {
                        let { done, value } = await reader.read();
                        if (done) {
                            if (offset > 0) {
                                let element = buffer.subarray(0, offset);
                                if (interrupt(element, index)) {
                                    stoppable = true;
                                }
                                else {
                                    accept(element, index);
                                    index++;
                                }
                            }
                            break;
                        }
                        let chunkData = value;
                        let position = 0;
                        while (position < chunkData.length && !stoppable) {
                            let space = size - offset;
                            let toCopy = Math.min(space, chunkData.length - position);
                            buffer.set(chunkData.subarray(position, position + toCopy), offset);
                            offset += toCopy;
                            position += toCopy;
                            if (offset === size) {
                                if (interrupt(buffer, index)) {
                                    stoppable = true;
                                }
                                else {
                                    accept(buffer, index);
                                    index++;
                                }
                                offset = 0;
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
                finally {
                    if (stoppable) {
                        await reader.cancel();
                    }
                    reader.releaseLock();
                }
            })();
        }
        catch (error) {
            console.error(error);
        }
    });
};
;
export let useDocument = (argument) => {
    if (isString(argument)) {
        let key = argument;
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                let listener = (event) => {
                    if (interrupt(event, index)) {
                        window.document.addEventListener(key, listener);
                    }
                    else {
                        accept(event, index);
                        index++;
                    }
                };
                window.document.addEventListener(key, listener);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    if (isIterable(argument)) {
        let keys = new Set(argument);
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let key of keys) {
                    if (isString(key)) {
                        let listener = (event) => {
                            if (interrupt(event, index)) {
                                window.document.addEventListener(key, listener);
                            }
                            else {
                                accept(event, index);
                                index++;
                            }
                        };
                        window.document.addEventListener(key, listener);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Argument must be a string or an iterable of strings.");
};
;
export let useHTMLElement = (argument1, argument2) => {
    if (isString(argument1)) {
        let selector = argument1;
        if (isString(argument2)) {
            let key = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    let elements = window.document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (validate(element)) {
                            let listener = (event) => {
                                if (interrupt(event, index)) {
                                    element.removeEventListener(key, listener);
                                }
                                else {
                                    accept(event, index);
                                    index++;
                                }
                            };
                            element.addEventListener(key, listener);
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys = new Set(argument2);
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    let elements = window.document.querySelectorAll(selector);
                    for (let element of elements) {
                        for (let key of keys) {
                            if (isString(key)) {
                                let listener = (event) => {
                                    if (interrupt(event, index)) {
                                        element.removeEventListener(key, listener);
                                    }
                                    else {
                                        accept(event, index);
                                        index++;
                                    }
                                };
                                element.addEventListener(key, listener);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
    }
    if (isIterable(argument1)) {
        let elementsOrSelectors = argument1;
        if (isString(argument2)) {
            let key = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isString(elementOrSelector)) {
                            let element = window.document.querySelector(elementOrSelector);
                            if (validate(element)) {
                                let listener = (event) => {
                                    if (interrupt(event, index)) {
                                        element.removeEventListener(key, listener);
                                    }
                                    else {
                                        accept(event, index);
                                        index++;
                                    }
                                };
                                element.addEventListener(key, listener);
                            }
                        }
                        else if (isHTMLElemet(elementOrSelector)) {
                            let element = elementOrSelector;
                            let listener = (event) => {
                                if (interrupt(event, index)) {
                                    element.removeEventListener(key, listener);
                                }
                                else {
                                    accept(event, index);
                                    index++;
                                }
                            };
                            element.addEventListener(key, listener);
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isString(elementOrSelector)) {
                            let element = window.document.querySelector(elementOrSelector);
                            if (validate(element)) {
                                for (let key of keys) {
                                    if (isString(key)) {
                                        let listener = (event) => {
                                            if (interrupt(event, index)) {
                                                element.removeEventListener(key, listener);
                                            }
                                            else {
                                                accept(event, index);
                                                index++;
                                            }
                                        };
                                        element.addEventListener(key, listener);
                                    }
                                }
                            }
                        }
                        else if (isHTMLElemet(elementOrSelector)) {
                            let element = elementOrSelector;
                            for (let key of keys) {
                                if (isString(key)) {
                                    let listener = (event) => {
                                        if (interrupt(event, index)) {
                                            element.removeEventListener(key, listener);
                                        }
                                        else {
                                            accept(event, index);
                                            index++;
                                        }
                                    };
                                    element.addEventListener(key, listener);
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
    }
    if (isHTMLElemet(argument1)) {
        let element = argument1;
        if (isString(argument2)) {
            let key = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    let listener = (event) => {
                        if (interrupt(event, index)) {
                            element.removeEventListener(key, listener);
                        }
                        else {
                            accept(event, index);
                            index++;
                        }
                    };
                    element.addEventListener(key, listener);
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let index = 0n;
                    for (let key of keys) {
                        if (isString(key)) {
                            let listener = (event) => {
                                if (interrupt(event, index)) {
                                    element.removeEventListener(key, listener);
                                }
                                else {
                                    accept(event, index);
                                    index++;
                                }
                            };
                            element.addEventListener(key, listener);
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let useEmpty = () => {
    return new Semantic(() => { });
};
;
export let useFill = (element, count) => {
    if (validate(element) && count > 0n) {
        return new Semantic((accept, interrupt) => {
            try {
                for (let i = 0n; i < count; i++) {
                    let item = isFunction(element) ? element() : element;
                    if (interrupt(item, i)) {
                        break;
                    }
                    accept(item, i);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useFrom = (iterable) => {
    if (isIterable(iterable)) {
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let element of iterable) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    else if (isAsyncIterable(iterable)) {
        return new Semantic(async (accept, interrupt) => {
            try {
                let index = 0n;
                for await (let element of iterable) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
;
export let useGenerate = (supplier, interrupt) => {
    if (isFunction(supplier) && isFunction(interrupt)) {
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                while (true) {
                    let element = supplier();
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
;
export let useInterval = (period, delay = 0) => {
    if (period > 0 && delay >= 0) {
        return new Semantic((accept, interrupt) => {
            try {
                if (delay > 0) {
                    setTimeout(() => {
                        let count = 0;
                        let index = 0n;
                        let timer = setInterval(() => {
                            if (interrupt(count, index)) {
                                clearInterval(timer);
                            }
                            accept(count, BigInt(index));
                            index++;
                            count += period;
                        }, period);
                    }, delay);
                }
                else {
                    let count = 0;
                    let index = 0n;
                    let timer = setInterval(() => {
                        if (interrupt(count, index)) {
                            clearInterval(timer);
                        }
                        accept(count, BigInt(index));
                        index++;
                        count += period;
                    }, period);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let useIterate = (generator) => {
    if (isFunction(generator)) {
        try {
            return new Semantic(generator);
        }
        catch (error) {
            console.error(error);
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let usePromise = (promise) => {
    if (isPromise(promise)) {
        return new Semantic((accept, interrupt) => {
            try {
                promise.then((value) => {
                    if (interrupt(value, 0n)) {
                        return;
                    }
                    accept(value, 0n);
                }).catch((error) => {
                    console.error(error);
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    else {
        throw new TypeError("Invalid arguments.");
    }
};
;
export let useOf = (...target) => {
    if (Array.isArray(target)) {
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let element of target) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useRange = (start, end, step = (isNumber(start) && isNumber(end) ? 1 : 1n)) => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step, 0) === 0) || (isBigInt(step) && useCompare(step, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let trusted = useToNumber(step);
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let i = start; i < end; i += trusted) {
                    if (interrupt(i, index)) {
                        break;
                    }
                    accept(i, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    else if (isBigInt(start) && isBigInt(end)) {
        let trusted = useToBigInt(step);
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let i = start; i < end; i += trusted) {
                    if (interrupt(i, index)) {
                        break;
                    }
                    accept(i, index);
                    index++;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useWebSocket = (argument1, argument2) => {
    if (isObject(argument1) && isFunction(Reflect.get(argument1, "addEventListener"))) {
        let websocket = argument1;
        if (isString(argument2)) {
            let key = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    let listener = (event) => {
                        if (interrupt(event, 0n)) {
                            websocket.removeEventListener(key, listener);
                        }
                        else {
                            accept(event, 0n);
                        }
                    };
                    websocket.addEventListener(key, listener);
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        else if (isIterable(argument2)) {
            let keys = argument2;
            return new Semantic((accept, interrupt) => {
                try {
                    for (let key of keys) {
                        if (isString(key)) {
                            let listener = (event) => {
                                if (interrupt(event, 0n)) {
                                    websocket.removeEventListener(key, listener);
                                }
                                else {
                                    accept(event, 0n);
                                }
                            };
                            websocket.addEventListener(key, listener);
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        let keys = ["open", "message", "close", "error"];
        return new Semantic((accept, interrupt) => {
            try {
                for (let key of keys) {
                    let listener = (event) => {
                        if (interrupt(event, 0n)) {
                            websocket.removeEventListener(key, listener);
                        }
                        else {
                            accept(event, 0n);
                        }
                    };
                    websocket.addEventListener(key, listener);
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useWindow = (argument1) => {
    if (isString(argument1)) {
        let key = argument1;
        return new Semantic((accept, interrupt) => {
            try {
                let listener = (event) => {
                    if (interrupt(event, 0n)) {
                        window.removeEventListener(key, listener);
                    }
                    else {
                        console.log(event.type, event);
                        accept(event, 0n);
                    }
                };
                window.addEventListener(key, listener);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    else if (isIterable(argument1)) {
        let keys = new Set(argument1);
        return new Semantic((accept, interrupt) => {
            try {
                let index = 0n;
                for (let key of keys) {
                    if (isString(key)) {
                        let listener = function (event) {
                            if (interrupt(event, index)) {
                                console.log("Terminal", performance.now());
                                window.removeEventListener(key, listener);
                            }
                            else {
                                console.log("accept", performance.now());
                                accept(event, index);
                            }
                        };
                        index++;
                        window.addEventListener(key, listener);
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let useNullable = (target) => Optional.ofNullable(target);
export let useNonNull = (target) => Optional.ofNonNull(target);
