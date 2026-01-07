import { isBigInt, isFunction, isIterable, isNumber } from "./guard";
import { useCompare } from "./hook";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
import type { BiFunctional, BiPredicate, Functional, Predicate, Supplier, TriFunctional, Generator } from "./utility";

export let blob: Functional<Blob, Semantic<Uint8Array>> & BiFunctional<Blob, bigint, Semantic<Uint8Array>> = (blob: Blob, chunk: bigint = 64n * 1024n): Semantic<Uint8Array> => {
    let size: number = Number(chunk);
    if (size <= 0) {
        throw new RangeError("Chunk size must be positive.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic<Uint8Array>((accept, interrupt) => {
        let index: bigint = 0n;
        let stoppable: boolean = false;
        let stream: ReadableStream<Uint8Array<ArrayBuffer>> = blob.stream();
        let reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>> = stream.getReader();
        let buffer: Uint8Array = new Uint8Array(size);
        let offset: number = 0;
        let read: Functional<ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>, Promise<void>> = async (reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>): Promise<void> => {
            if (stoppable) {
                return reader.cancel().finally((): void => reader.releaseLock());
            }
            return reader.read().then((result: ReadableStreamReadResult<Uint8Array<ArrayBuffer>>) => {
                if (result.done) {
                    if (offset > 0) {
                        const element: Uint8Array = buffer.subarray(0, offset);
                        if (interrupt(element, index)) {
                            stoppable = true;
                        } else {
                            accept(element, index);
                            index++;
                        }
                    }
                    reader.releaseLock();
                    return;
                }

                let chunkData: Uint8Array = result.value;
                let length: number = chunkData.length;
                let remaining: number = size - offset;
                if (length > remaining) {
                    buffer.set(chunkData.subarray(0, remaining), offset);

                    if (interrupt(buffer, index)) {
                        stoppable = true;
                    } else {
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
                            } else {
                                accept(buffer, index);
                                index++;
                                offset = 0;
                            }
                        }
                    }
                } else {
                    buffer.set(chunkData, offset);
                    offset += length;
                    if (offset === size) {
                        if (interrupt(buffer, index)) {
                            stoppable = true;
                        } else {
                            accept(buffer, index);
                            index++;
                            offset = 0;
                        }
                    }
                }
                if (!stoppable) {
                    return read(reader);
                } else {
                    return reader.cancel().finally(() => reader.releaseLock());
                }
            }).catch((error: any) => {
                reader.releaseLock();
                throw error;
            });
        };
        read(reader).catch((): void => {
            reader.releaseLock();
        });
    });
};

export let empty: <E>() => Semantic<E> = <E>(): Semantic<E> => {
    return new Semantic<E>(() => { });
};

export let fill: (<E>(element: E, count: bigint) => Semantic<E>) & (<E>(supplier: Supplier<E>, count: bigint) => Semantic<E>) = <E>(element: E | Supplier<E>, count: bigint): Semantic<E> => {
    if (validate(element) && count > 0n) {
        return new Semantic<E>((accept, interrupt) => {
            for (let i = 0n; i < count; i++) {
                let item: E = isFunction(element) ? element() : element;
                if (interrupt(item, i)) {
                    break;
                }
                accept(item, i);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

export let from: <E>(iterable: Iterable<E>) => Semantic<E> = <E>(iterable: Iterable<E>): Semantic<E> => {
    if (isIterable(iterable)) {
        return new Semantic<E>((accept, interrupt) => {
            let index: bigint = 0n;
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

export let generate: (<E>(supplier: Supplier<E>, interrupt: Predicate<E>) => Semantic<E>) & (<E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>) => Semantic<E>) = <E>(supplier: Supplier<E>, interrupt: Predicate<E> | BiPredicate<E, bigint>): Semantic<E> => {
    if (isFunction(supplier) && isFunction(interrupt)) {
        return new Semantic<E>((accept, interrupt): void => {
            let index: bigint = 0n;
            while (true) {
                let element: E = supplier();
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

export let interval: Functional<number, Semantic<number>> & BiFunctional<number, number, Semantic<number>> = (period: number, delay: number = 0): Semantic<number> => {
    if (period > 0 && delay >= 0) {
        return new Semantic<number>((accept, interrupt): void => {
            if (delay > 0) {
                setTimeout((): void => {
                    let count: number = 0;
                    let index: bigint = 0n;
                    let timer: number = setInterval((): void => {
                        if (interrupt(count, index)) {
                            clearInterval(timer);
                        }
                        accept(count, BigInt(index));
                        index++;
                        count += period;
                    }, period);
                }, delay);
            } else {
                let count: number = 0;
                let index: bigint = 0n;
                let timer: number = setInterval((): void => {
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

export let iterate: <E>(generator: Generator<E>) => Semantic<E> = <E>(generator: Generator<E>): Semantic<E> => {
    if (isFunction(generator)) {
        return new Semantic(generator);
    }
    throw new TypeError("Invalid arguments.");
};

export let range: BiFunctional<number, number, Semantic<number>> & TriFunctional<number, number, number, Semantic<number>> = (start: number, end: number, step: number = 1): Semantic<number> => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step as number, 0) === 0) || (isBigInt(step) && useCompare(step as bigint, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let minimum: number = start, maximum: number = end, limit: number = Number(step);
        let condition: Predicate<number> = limit > 0 ? (i: number) => i < maximum : (i: number) => i > maximum;
        return new Semantic<number>((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value: number = i;
                if (interrupt(value, BigInt(i))) {
                    break;
                }
                accept(value, BigInt(i));
            }
        }) as Semantic<number>;
    }
    throw new TypeError("Invalid arguments.");
};

export let websocket: Functional<WebSocket, Semantic<MessageEvent | CloseEvent | Event>> = (websocket: WebSocket): Semantic<MessageEvent | CloseEvent | Event> => {
    if (invalidate(websocket)) {
        throw new TypeError("WebSocket is invalid.");
    }
    return new Semantic<MessageEvent | CloseEvent | Event>((accept, interrupt) => {
        let index: bigint = 0n;
        let stop: boolean = false;
        websocket.addEventListener("open", (event: Event): void => {
            if (stop || interrupt(event, index)) {
                stop = true;
            } else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("message", (event: MessageEvent): void => {
            if (stop || interrupt(event, index)) {
                stop = true;
            } else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("error", (event: Event): void => {
            if (stop || interrupt(event, index)) {
                stop = true;
            } else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("close", (event: CloseEvent): void => {
            if (stop || interrupt(event, index)) {
                stop = true;
            } else {
                accept(event, index);
                index++;
            }
        });
    });
};