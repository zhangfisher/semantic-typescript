import { AsynchronousSemantic } from "./asynchronous/semantic";
import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise, isAsyncIterable, isString, isHTMLElemet } from "./guard";
import { useCompare, useToBigInt, useToNumber, useTraverse } from "./hook";
import { Optional } from "./optional";
import { SynchronousSemantic } from "./synchronous/semantic";
import { invalidate, validate } from "./utility";
;
export let useAnimationFrame = (period, delay = 0) => {
    if (period <= 0 || !Number.isFinite(period) || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Period must be positive finite number and delay must be non-negative finite number.");
    }
    return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
    return new SynchronousSemantic((accept, interrupt) => {
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
;
export let useDocument = (argument1, argument2 = {}) => {
    let options = argument2;
    let debounce = isObject(options) && isNumber(options.debounce) ? options.debounce : 0;
    let throttle = isObject(options) && isNumber(options.throttle) ? options.throttle : 0;
    if (isString(argument1)) {
        let key = argument1;
        return new AsynchronousSemantic(async (accept, interrupt) => {
            let timeOut = null;
            let lastEmitTime = 0;
            let index = 0n;
            let until = new Promise(resolve => {
                let listener = (event) => {
                    if (debounce > 0) {
                        if (timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout(() => {
                            if (interrupt(event, index)) {
                                window.document.removeEventListener(key, listener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                        }, debounce);
                        return;
                    }
                    if (throttle > 0) {
                        let now = performance.now();
                        if (now - lastEmitTime < throttle) {
                            return;
                        }
                        lastEmitTime = now;
                        if (interrupt(event, index)) {
                            window.document.removeEventListener(key, listener);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                        return;
                    }
                    if (interrupt(event, index)) {
                        window.document.removeEventListener(key, listener);
                        resolve();
                        accept(event, -1n);
                        return;
                    }
                    accept(event, index);
                    index++;
                };
                window.document.addEventListener(key, listener);
            });
            await until;
        });
    }
    if (isIterable(argument1)) {
        let keys = new Set(...argument1);
        return new AsynchronousSemantic(async (accept, interrupt) => {
            let lastEmitTime = 0;
            let timeOut = null;
            let index = 0n;
            let activeCount = keys.size;
            let until = new Promise(resolve => {
                for (let key of keys) {
                    if (!isString(key))
                        continue;
                    let listener = (event) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout(() => handleEvent(event, key), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmitTime < throttle)
                                return;
                            lastEmitTime = now;
                        }
                        handleEvent(event, key);
                    };
                    let handleEvent = (event, currentKey) => {
                        if (interrupt(event, index)) {
                            window.document.removeEventListener(currentKey, listener);
                            if (--activeCount === 0) {
                                resolve();
                            }
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    window.document.addEventListener(key, listener);
                }
            });
            await until;
        });
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useHTMLElement = (argument1, argument2, argument3 = {}) => {
    let throttle = isObject(argument3) && isNumber(argument3.throttle) ? argument3.throttle : 0;
    let debounce = isObject(argument3) && isNumber(argument3.debounce) ? argument3.debounce : 0;
    if (debounce > 0 && throttle > 0) {
        throw new TypeError("throttle and debounce cannot be used together");
    }
    if (debounce < 0 || throttle < 0) {
        throw new TypeError("throttle/debounce must be non-negative");
    }
    if (isHTMLElemet(argument1)) {
        let element = argument1;
        if (isString(argument2)) {
            let key = argument2;
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let timeOut = null;
                let lastEmit = 0;
                let index = 0n;
                let until = new Promise((resolve) => {
                    let listener = (event) => {
                        if (debounce > 0) {
                            if (timeOut)
                                clearTimeout(timeOut);
                            timeOut = setTimeout(() => handle(event), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmit < throttle)
                                return;
                            lastEmit = now;
                        }
                        handle(event);
                    };
                    let handle = (event) => {
                        if (interrupt(event, index)) {
                            element.removeEventListener(key, listener);
                            if (timeOut)
                                clearTimeout(timeOut);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    element.addEventListener(key, listener);
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys = [...new Set(argument2)];
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let active = keys.length;
                let index = 0n;
                let until = new Promise((resolve) => {
                    for (let key of keys) {
                        let listener = (event) => {
                            if (interrupt(event, index)) {
                                element.removeEventListener(key, listener);
                                if (--active === 0) {
                                    resolve();
                                }
                                return;
                            }
                            accept(event, index);
                            index++;
                        };
                        element.addEventListener(key, listener);
                    }
                });
                await until;
            });
        }
    }
    if (isString(argument1)) {
        let selector = argument1;
        let elements = [...document.querySelectorAll(selector)];
        if (isString(argument2)) {
            let key = argument2;
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let active = elements.length;
                let index = 0n;
                let until = new Promise((resolve) => {
                    for (let element of elements) {
                        if (validate(element)) {
                            let listener = (event) => {
                                if (interrupt(event, index)) {
                                    element.removeEventListener(key, listener);
                                    if (--active === 0) {
                                        resolve();
                                    }
                                    return;
                                }
                                accept(event, index);
                                index++;
                            };
                            element.addEventListener(key, listener);
                        }
                    }
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys = new Set(argument2);
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let active = elements.length * keys.size;
                let index = 0n;
                let until = new Promise((resolve) => {
                    for (let element of elements) {
                        for (let key of keys) {
                            if (validate(element) && isString(key)) {
                                let listener = (event) => {
                                    if (interrupt(event, index)) {
                                        element.removeEventListener(key, listener);
                                        if (--active === 0) {
                                            resolve();
                                        }
                                        return;
                                    }
                                    accept(event, index);
                                    index++;
                                };
                                element.addEventListener(key, listener);
                            }
                        }
                    }
                });
                await until;
            });
        }
    }
    if (isIterable(argument1)) {
        let elementsOrSelectors = new Set(argument1);
        if (isString(argument2)) {
            let key = argument2;
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let active = elementsOrSelectors.size;
                let until = new Promise((resolve) => {
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (validate(elementOrSelector)) {
                            if (isHTMLElemet(elementOrSelector)) {
                                let element = elementOrSelector;
                                let listener = (event) => {
                                    if (interrupt(event, 0n)) {
                                        element.removeEventListener(key, listener);
                                        if (--active === 0) {
                                            resolve();
                                        }
                                        return;
                                    }
                                    accept(event, 0n);
                                };
                                element.addEventListener(key, listener);
                            }
                            else if (isString(elementOrSelector)) {
                                let selector = elementOrSelector;
                                let elements = [...document.querySelectorAll(selector)].filter((item) => isHTMLElemet(item));
                                for (let element of elements) {
                                    if (validate(element)) {
                                        let listener = (event) => {
                                            if (interrupt(event, 0n)) {
                                                element.removeEventListener(key, listener);
                                                if (--active === 0) {
                                                    resolve();
                                                }
                                                return;
                                            }
                                            accept(event, 0n);
                                        };
                                        element.addEventListener(key, listener);
                                    }
                                }
                            }
                        }
                    }
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys = new Set(argument2);
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let active = elementsOrSelectors.size * keys.size;
                let until = new Promise((resolve) => {
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isHTMLElemet(elementOrSelector)) {
                            let element = elementOrSelector;
                            for (let key of keys) {
                                if (isString(key)) {
                                    let listener = (event) => {
                                        if (interrupt(event, 0n)) {
                                            element.removeEventListener(key, listener);
                                            if (--active === 0) {
                                                resolve();
                                            }
                                            return;
                                        }
                                        accept(event, 0n);
                                    };
                                    element.addEventListener(key, listener);
                                }
                            }
                        }
                        else if (isString(elementOrSelector)) {
                            let selector = elementOrSelector;
                            let elements = [...document.querySelectorAll(selector)].filter((item) => isHTMLElemet(item));
                            for (let element of elements) {
                                for (let key of keys) {
                                    let listener = (event) => {
                                        if (interrupt(event, 0n)) {
                                            element.removeEventListener(key, listener);
                                            if (--active === 0) {
                                                resolve();
                                            }
                                            return;
                                        }
                                        accept(event, 0n);
                                    };
                                    element.addEventListener(key, listener);
                                }
                            }
                        }
                    }
                });
                await until;
            });
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let useEmpty = () => {
    return new SynchronousSemantic(() => { });
};
;
export let useFill = (element, count) => {
    if (validate(element) && count > 0n) {
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic(async (accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
            return new SynchronousSemantic(generator);
        }
        catch (error) {
            console.error(error);
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let usePromise = (promise) => {
    if (isPromise(promise)) {
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
        return new SynchronousSemantic((accept, interrupt) => {
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
;
export let useWebSocket = (argument1, argument2, argument3) => {
    let debounce = 0;
    let throttle = 0;
    if (isObject(argument2)) {
        debounce = Reflect.has(argument2, "debounce") ? Reflect.get(argument2, "debounce") : 0;
        throttle = Reflect.has(argument2, "throttle") ? Reflect.get(argument2, "throttle") : 0;
    }
    else {
        debounce = validate(argument3) && isNumber(argument3.debounce) ? argument3.debounce : 0;
        throttle = validate(argument3) && isNumber(argument3.throttle) ? argument3.throttle : 0;
    }
    if (validate(argument1)) {
        let websocket = argument1;
        if (isString(argument2)) {
            let key = argument1;
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let timeOut = null;
                let lastEmitTime = 0;
                let index = 0n;
                let until = new Promise(resolve => {
                    let listener = (event) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout(() => {
                                if (interrupt(event, index)) {
                                    websocket.removeEventListener(key, listener);
                                    resolve();
                                    return;
                                }
                                accept(event, index);
                                index++;
                            }, debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmitTime < throttle) {
                                return;
                            }
                            lastEmitTime = now;
                            if (interrupt(event, index)) {
                                websocket.removeEventListener(key, listener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                            return;
                        }
                        if (interrupt(event, index)) {
                            websocket.removeEventListener(key, listener);
                            resolve();
                            accept(event, -1n);
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    websocket.addEventListener(key, listener);
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys = new Set(...argument1);
            return new AsynchronousSemantic(async (accept, interrupt) => {
                let lastEmitTime = 0;
                let timeOut = null;
                let index = 0n;
                let activeCount = keys.size;
                let until = new Promise(resolve => {
                    for (let key of keys) {
                        if (!isString(key))
                            continue;
                        let listener = (event) => {
                            if (debounce > 0) {
                                if (timeOut) {
                                    clearTimeout(timeOut);
                                }
                                timeOut = setTimeout(() => handleEvent(event, key), debounce);
                                return;
                            }
                            if (throttle > 0) {
                                let now = performance.now();
                                if (now - lastEmitTime < throttle)
                                    return;
                                lastEmitTime = now;
                            }
                            handleEvent(event, key);
                        };
                        let handleEvent = (event, currentKey) => {
                            if (interrupt(event, index)) {
                                websocket.removeEventListener(currentKey, listener);
                                if (--activeCount === 0) {
                                    resolve();
                                }
                                return;
                            }
                            accept(event, index);
                            index++;
                        };
                        websocket.addEventListener(key, listener);
                    }
                });
                await until;
            });
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let useWindow = (argument1, argument2 = {}) => {
    let options = argument2;
    let debounce = isObject(options) && isNumber(options.debounce) ? options.debounce : 0;
    let throttle = isObject(options) && isNumber(options.throttle) ? options.throttle : 0;
    if (isString(argument1)) {
        let key = argument1;
        return new AsynchronousSemantic(async (accept, interrupt) => {
            let timeOut = null;
            let lastEmitTime = 0;
            let index = 0n;
            let until = new Promise(resolve => {
                let listener = (event) => {
                    if (debounce > 0) {
                        if (timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout(() => {
                            if (interrupt(event, index)) {
                                window.removeEventListener(key, listener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                        }, debounce);
                        return;
                    }
                    if (throttle > 0) {
                        let now = performance.now();
                        if (now - lastEmitTime < throttle) {
                            return;
                        }
                        lastEmitTime = now;
                        if (interrupt(event, index)) {
                            window.removeEventListener(key, listener);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                        return;
                    }
                    if (interrupt(event, index)) {
                        window.removeEventListener(key, listener);
                        resolve();
                        accept(event, -1n);
                        return;
                    }
                    accept(event, index);
                    index++;
                };
                window.addEventListener(key, listener);
            });
            await until;
        });
    }
    if (isIterable(argument1)) {
        let keys = new Set(...argument1);
        return new AsynchronousSemantic(async (accept, interrupt) => {
            let lastEmitTime = 0;
            let timeOut = null;
            let index = 0n;
            let activeCount = keys.size;
            let until = new Promise(resolve => {
                for (let key of keys) {
                    if (!isString(key))
                        continue;
                    let listener = (event) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout(() => handleEvent(event, key), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmitTime < throttle)
                                return;
                            lastEmitTime = now;
                        }
                        handleEvent(event, key);
                    };
                    let handleEvent = (event, currentKey) => {
                        if (interrupt(event, index)) {
                            window.removeEventListener(currentKey, listener);
                            if (--activeCount === 0) {
                                resolve();
                            }
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    window.addEventListener(key, listener);
                }
            });
            await until;
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let useNullable = (target) => Optional.ofNullable(target);
export let useNonNull = (target) => Optional.ofNonNull(target);
