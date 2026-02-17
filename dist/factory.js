import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise } from "./guard";
import { useCompare, useTraverse } from "./hook";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
export let animationFrame = (period, delay = 0) => {
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
            throw new Error("Uncaught error as creating animation frame semantic.");
        }
    });
};
;
export let attribute = (target) => {
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
                throw new Error("Uncaught error as creating attribute semantic.");
            }
        });
    }
    throw new TypeError("Target must be an object.");
};
export let blob = (blob, chunk = 64n * 1024n) => {
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
            throw new Error("Uncaught error as creating blob semantic.");
        }
    });
};
export let empty = () => {
    return new Semantic(() => { });
};
export let fill = (element, count) => {
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
                throw new Error("Uncaught error as creating fill semantic.");
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let from = (iterable) => {
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
                throw new Error("Uncaught error as creating from semantic.");
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
export let generate = (supplier, interrupt) => {
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
                throw new Error("Uncaught error as creating generate semantic.");
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
export let interval = (period, delay = 0) => {
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
                throw new Error("Uncaught error as creating interval semantic.");
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let iterate = (generator) => {
    if (isFunction(generator)) {
        try {
            return new Semantic(generator);
        }
        catch (error) {
            throw new Error("Uncaught error as creating iterate semantic.");
        }
    }
    throw new TypeError("Invalid arguments.");
};
export let promise = (promise) => {
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
                throw new Error("Uncaught error as creating promise semantic.");
            }
        });
    }
    else {
        throw new TypeError("Invalid arguments.");
    }
};
export let range = (start, end, step = 1) => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step, 0) === 0) || (isBigInt(step) && useCompare(step, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let minimum = start, maximum = end, limit = Number(step);
        let condition = limit > 0 ? (i) => i < maximum : (i) => i > maximum;
        return new Semantic((accept, interrupt) => {
            try {
                for (let i = minimum; condition(i); i += limit) {
                    let value = i;
                    if (interrupt(value, BigInt(i))) {
                        break;
                    }
                    accept(value, BigInt(i));
                }
            }
            catch (error) {
                throw new Error("Uncaught error as creating range semantic.");
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let websocket = (websocket) => {
    if (invalidate(websocket)) {
        throw new TypeError("WebSocket is invalid.");
    }
    return new Semantic((accept, interrupt) => {
        try {
            let index = 0n;
            let stop = false;
            websocket.addEventListener("open", (event) => {
                if (stop || interrupt(event, index)) {
                    stop = true;
                }
                else {
                    accept(event, index);
                    index++;
                }
            });
            websocket.addEventListener("message", (event) => {
                if (stop || interrupt(event, index)) {
                    stop = true;
                }
                else {
                    accept(event, index);
                    index++;
                }
            });
            websocket.addEventListener("error", (event) => {
                if (stop || interrupt(event, index)) {
                    stop = true;
                }
                else {
                    accept(event, index);
                    index++;
                }
            });
            websocket.addEventListener("close", (event) => {
                if (stop || interrupt(event, index)) {
                    stop = true;
                }
                else {
                    accept(event, index);
                    index++;
                }
            });
        }
        catch (error) {
            throw new Error("Uncaught error as creating websocket semantic.");
        }
    });
};
