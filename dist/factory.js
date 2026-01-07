import { isBigInt, isFunction, isIterable, isNumber } from "./guard";
import { useCompare } from "./hook";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
export let blob = (blob, chunk = 64n * 1024n) => {
    let size = Number(chunk);
    if (size <= 0) {
        throw new RangeError("Chunk size must be positive.");
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
        let read = async (reader) => {
            if (stoppable) {
                return reader.cancel().finally(() => reader.releaseLock());
            }
            return reader.read().then((result) => {
                if (result.done) {
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
                    reader.releaseLock();
                    return;
                }
                let chunkData = result.value;
                let length = chunkData.length;
                let remaining = size - offset;
                if (length > remaining) {
                    buffer.set(chunkData.subarray(0, remaining), offset);
                    if (interrupt(buffer, index)) {
                        stoppable = true;
                    }
                    else {
                        accept(buffer, index);
                        index++;
                    }
                    offset = 0;
                    const leftover = chunkData.subarray(remaining);
                    if (leftover.length > 0) {
                        buffer.set(leftover, offset);
                        offset += leftover.length;
                        if (offset === size) {
                            if (interrupt(buffer, index)) {
                                stoppable = true;
                            }
                            else {
                                accept(buffer, index);
                                index++;
                                offset = 0;
                            }
                        }
                    }
                }
                else {
                    buffer.set(chunkData, offset);
                    offset += length;
                    if (offset === size) {
                        if (interrupt(buffer, index)) {
                            stoppable = true;
                        }
                        else {
                            accept(buffer, index);
                            index++;
                            offset = 0;
                        }
                    }
                }
                if (!stoppable) {
                    return read(reader);
                }
                else {
                    return reader.cancel().finally(() => reader.releaseLock());
                }
            }).catch((error) => {
                reader.releaseLock();
                throw error;
            });
        };
        read(reader).catch(() => {
            reader.releaseLock();
        });
    });
};
export let empty = () => {
    return new Semantic(() => { });
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
