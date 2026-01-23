import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise } from "./guard";
import { useCompare, useTraverse } from "./hook";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
import type { BiFunctional, BiPredicate, Functional, Predicate, Supplier, TriFunctional, Generator, Consumer, BiConsumer, DeepPropertyKey, DeepPropertyValue } from "./utility";

export let animationFrame: Functional<number, Semantic<number>> & BiFunctional<number, number, Semantic<number>> = (period: number, delay: number = 0): Semantic<number> => {
    if (period <= 0 || !Number.isFinite(period) || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Period must be positive finite number and delay must be non-negative finite number.");
    }
    return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
        let start = performance.now();
        let index: bigint = 0n;
        let animate: Consumer<number> = (): void => {
            if (performance.now() - start >= delay) {
                requestAnimationFrame(animate);
            } else if (performance.now() - start < period) {
                requestAnimationFrame(animate);
            } else {
                if (interrupt(start, index)) {
                    return;
                }
                accept(performance.now(), index);
            }
        };
    });
};

interface Attribute<T> {
    key: keyof T;
    value: T[keyof T];
};
export let attribute: <T extends object>(target: T) => Semantic<Attribute<T>> = <T extends object>(target: T): Semantic<Attribute<T>> => {
    if (isObject(target)) {
        return new Semantic<Attribute<T>>((accept: Consumer<Attribute<T>> | BiConsumer<Attribute<T>, bigint>, interrupt: Predicate<Attribute<T>> | BiPredicate<Attribute<T>, bigint>): void => {
            let index: bigint = 0n;
            useTraverse(target, (key: DeepPropertyKey<T>, value: DeepPropertyValue<T>): boolean => {
                let attribute: Attribute<T> = {
                    key: key as keyof T,
                    value: value as T[keyof T]
                } as Attribute<T>;
                if (interrupt(attribute, index)) {
                    return false;
                }
                accept(attribute, index);
                index++;
                return true;
            });
        });
    }
    throw new TypeError("Target must be an object.");
};

export let blob: Functional<Blob, Semantic<Uint8Array>> & BiFunctional<Blob, bigint, Semantic<Uint8Array>> = (blob: Blob, chunk: bigint = 64n * 1024n): Semantic<Uint8Array> => {
    let size: number = Number(chunk);
    if (size <= 0 || !Number.isSafeInteger(size)) {
        throw new RangeError("Chunk size must be a safe positive integer.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic<Uint8Array>((accept: Consumer<Uint8Array> | BiConsumer<Uint8Array, bigint>, interrupt: Predicate<Uint8Array> | BiPredicate<Uint8Array, bigint>) => {
        let index: bigint = 0n;
        let stoppable: boolean = false;
        let stream: ReadableStream<Uint8Array> = blob.stream();
        let reader: ReadableStreamDefaultReader<Uint8Array> = stream.getReader();
        let buffer: Uint8Array = new Uint8Array(size);
        let offset: number = 0;

        (async () => {
            try {
                while (!stoppable) {
                    let { done, value } = await reader.read();
                    if (done) {
                        if (offset > 0) {
                            let element: Uint8Array = buffer.subarray(0, offset);
                            if (interrupt(element, index)) {
                                stoppable = true;
                            } else {
                                accept(element, index);
                                index++;
                            }
                        }
                        break;
                    }
                    let chunkData: Uint8Array = value as Uint8Array;
                    let position: number = 0;
                    while (position < chunkData.length && !stoppable) {
                        let space: number = size - offset;
                        let toCopy: number = Math.min(space, chunkData.length - position);
                        buffer.set(chunkData.subarray(position, position + toCopy), offset);
                        offset += toCopy;
                        position += toCopy;

                        if (offset === size) {
                            if (interrupt(buffer, index)) {
                                stoppable = true;
                            } else {
                                accept(buffer, index);
                                index++;
                            }
                            offset = 0;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (stoppable) {
                    await reader.cancel();
                }
                reader.releaseLock();
            }
        })();
    });
};

export let empty: <E>() => Semantic<E> = <E>(): Semantic<E> => {
    return new Semantic<E>(() => { });
};

export let fill: (<E>(element: E, count: bigint) => Semantic<E>) & (<E>(supplier: Supplier<E>, count: bigint) => Semantic<E>) = <E>(element: E | Supplier<E>, count: bigint): Semantic<E> => {
    if (validate(element) && count > 0n) {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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
        return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
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

export let promise: (<T>(promise: Promise<T>) => Semantic<T>) = <T>(promise: Promise<T>): Semantic<T> => {
    if (isPromise(promise)) {
        return new Semantic<T>((accept: Consumer<T> | BiConsumer<T, bigint>, interrupt: Predicate<T> | BiPredicate<T, bigint>) => {
            promise.then((value: T) => {
                if (interrupt(value, 0n)) {
                    return;
                }
                accept(value, 0n);
            }).catch((error: any) => {
                console.error(error);
            });
        });
    } else {
        throw new TypeError("Invalid arguments.");
    }
};

export let range: BiFunctional<number, number, Semantic<number>> & TriFunctional<number, number, number, Semantic<number>> = (start: number, end: number, step: number = 1): Semantic<number> => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step as number, 0) === 0) || (isBigInt(step) && useCompare(step as bigint, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let minimum: number = start, maximum: number = end, limit: number = Number(step);
        let condition: Predicate<number> = limit > 0 ? (i: number) => i < maximum : (i: number) => i > maximum;
        return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>) => {
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
    return new Semantic<MessageEvent | CloseEvent | Event>((accept: Consumer<MessageEvent | CloseEvent | Event> | BiConsumer<MessageEvent | CloseEvent | Event, bigint>, interrupt: Predicate<MessageEvent | CloseEvent | Event> | BiPredicate<MessageEvent | CloseEvent | Event, bigint>) => {
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