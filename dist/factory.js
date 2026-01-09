import { isBigInt, isFunction, isIterable, isNumber } from "./guard";
import { useCompare } from "./hook";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
export let blob = (blob, chunk = 64n * 1024n) => {
    let size = Number(chunk);
    if (size <= 0 || !Number.isSafeInteger(size)) {
        throw new RangeError("Chunk size must be a safe positive integer.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic((accept, interrupt) => {
        let index = 0n;
        let stoppable = false;
        let stream = blob.stream();
        let reader = stream.getReader();
        let buffer = new Uint8Array(size);
        let offset = 0;
        (async () => {
            try {
                while (!stoppable) {
                    const { done, value } = await reader.read();
                    if (done) {
                        if (offset > 0) {
                            const element = buffer.subarray(0, offset);
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
                        const space = size - offset;
                        const toCopy = Math.min(space, chunkData.length - position);
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
                // Handle error
            }
            finally {
                if (stoppable) {
                    await reader.cancel();
                }
                reader.releaseLock();
            }
        })();
    });
};
export let empty = () => {
    return new Semantic(() => { });
};
export let event = (element, events) => {
    if (validate(element) && isIterable(events)) {
        return new Semantic((accept, interrupt) => {
            let index = 0n;
            let stop = false;
            for (let name of events) {
                if (!stop) {
                    element.addEventListener(name, (event) => {
                        if (interrupt(event, index)) {
                            stop = true;
                        }
                        accept(event, index);
                        index++;
                    });
                }
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let fill = (element, count) => {
    if (validate(element) && count > 0n) {
        return new Semantic((accept, interrupt) => {
            for (let i = 0n; i < count; i++) {
                let item = isFunction(element) ? element() : element;
                if (interrupt(item, i)) {
                    break;
                }
                accept(item, i);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let from = (iterable) => {
    if (isIterable(iterable)) {
        return new Semantic((accept, interrupt) => {
            let index = 0n;
            for (let element of iterable) {
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
                index++;
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
export let generate = (supplier, interrupt) => {
    if (isFunction(supplier) && isFunction(interrupt)) {
        return new Semantic((accept, interrupt) => {
            let index = 0n;
            while (true) {
                let element = supplier();
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
                index++;
            }
        });
    }
    throw new TypeError("Invalid arguments");
};
export let interval = (period, delay = 0) => {
    if (period > 0 && delay >= 0) {
        return new Semantic((accept, interrupt) => {
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
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let iterate = (generator) => {
    if (isFunction(generator)) {
        return new Semantic(generator);
    }
    throw new TypeError("Invalid arguments.");
};
export let range = (start, end, step = 1) => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step, 0) === 0) || (isBigInt(step) && useCompare(step, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let minimum = start, maximum = end, limit = Number(step);
        let condition = limit > 0 ? (i) => i < maximum : (i) => i > maximum;
        return new Semantic((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value = i;
                if (interrupt(value, BigInt(i))) {
                    break;
                }
                accept(value, BigInt(i));
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
    });
};
