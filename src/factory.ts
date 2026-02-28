import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise, isAsyncIterable, isString, isHTMLElemet } from "./guard";
import { useCompare, useToBigInt, useToNumber, useTraverse } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { invalidate, validate } from "./utility";
import type { BiPredicate, Predicate, Supplier, Generator, Consumer, BiConsumer, DeepPropertyKey, DeepPropertyValue, MaybeInvalid } from "./utility";

interface UseAnimationFrame {
    (period: number): Semantic<number>;
    (period: number, delay: number): Semantic<number>;
};
export let useAnimationFrame: UseAnimationFrame = (period: number, delay: number = 0): Semantic<number> => {
    if (period <= 0 || !Number.isFinite(period) || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Period must be positive finite number and delay must be non-negative finite number.");
    }
    return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
        try {
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
        } catch (error) {
            console.error(error);
        }
    });
};

interface Attribute<T> {
    key: keyof T;
    value: T[keyof T];
};
export let useAttribute: <T extends object>(target: T) => Semantic<Attribute<T>> = <T extends object>(target: T): Semantic<Attribute<T>> => {
    if (isObject(target)) {
        return new Semantic<Attribute<T>>((accept: Consumer<Attribute<T>> | BiConsumer<Attribute<T>, bigint>, interrupt: Predicate<Attribute<T>> | BiPredicate<Attribute<T>, bigint>): void => {
            try {
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
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Target must be an object.");
};

interface UseBlob {
    (blob: Blob): Semantic<Uint8Array>;
    (blob: Blob, chunk: bigint): Semantic<Uint8Array>;
};
export let useBlob: UseBlob = (blob: Blob, chunk: bigint = 64n * 1024n): Semantic<Uint8Array> => {
    let size: number = Number(chunk);
    if (size <= 0 || !Number.isSafeInteger(size)) {
        throw new RangeError("Chunk size must be a safe positive integer.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic<Uint8Array>((accept: Consumer<Uint8Array> | BiConsumer<Uint8Array, bigint>, interrupt: Predicate<Uint8Array> | BiPredicate<Uint8Array, bigint>) => {
        try {
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
        } catch (error) {
            console.error(error);
        }
    });
};

interface UseDocument {
    <K extends keyof DocumentEventMap>(key: K): Semantic<DocumentEventMap[K extends keyof DocumentEventMap ? K : never]>;
    <K extends keyof DocumentEventMap>(key: Iterable<K>): Semantic<DocumentEventMap[K extends keyof DocumentEventMap ? K : never]>;
};

export let useDocument: UseDocument = <K extends keyof DocumentEventMap>(argument: K | Iterable<K>): Semantic<DocumentEventMap[K]> => {
    if (isString(argument)) {
        let key: K = argument as K & keyof DocumentEventMap;
        return new Semantic<DocumentEventMap[K]>((accept: Consumer<DocumentEventMap[K]> | BiConsumer<DocumentEventMap[K], bigint>, interrupt: Predicate<DocumentEventMap[K]> | BiPredicate<DocumentEventMap[K], bigint>): void => {
            try {
                let index: bigint = 0n;
                let listener: (event: Event) => void = (event: Event): void => {
                    if (interrupt(event as DocumentEventMap[K], index)) {
                        window.document.addEventListener(key, listener);
                    } else {
                        accept(event as DocumentEventMap[K], index);
                        index++;
                    }
                };
                window.document.addEventListener(key, listener);
            } catch (error) {
                console.error(error);
            }
        });
    }
    if (isIterable(argument)) {
        let keys: Iterable<unknown> = new Set(argument);
        return new Semantic<DocumentEventMap[K]>((accept: Consumer<DocumentEventMap[K]> | BiConsumer<DocumentEventMap[K], bigint>, interrupt: Predicate<DocumentEventMap[K]> | BiPredicate<DocumentEventMap[K], bigint>): void => {
            try {
                let index: bigint = 0n;
                for (let key of keys) {
                    if (isString(key)) {
                        let listener: (event: Event) => void = (event: Event): void => {
                            if (interrupt(event as DocumentEventMap[K], index)) {
                                window.document.addEventListener(key, listener);
                            } else {
                                accept(event as DocumentEventMap[K], index);
                                index++;
                            }
                        };
                        window.document.addEventListener(key, listener);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Argument must be a string or an iterable of strings.");
};

interface UseHTMLElement {
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(element: E, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(element: E, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(elements: Iterable<E>, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap>(elements: Iterable<E>, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selector: S, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selector: S, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selectors: Iterable<S>, key: K): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap>(selectors: Iterable<S>, keys: Iterable<K>): Semantic<HTMLElementEventMap[K extends keyof HTMLElementEventMap ? K : never]>;
};

export let useHTMLElement: UseHTMLElement = <S extends keyof HTMLElementTagNameMap, E extends HTMLElement, K extends keyof HTMLElementEventMap>(argument1: S | E | Iterable<E> | Iterable<S>, argument2: K | Iterable<K>): Semantic<HTMLElementEventMap[K]> => {
    if (isString(argument1)) {
        let selector: S = argument1 as S;
        if (isString(argument2)) {
            let key: K = argument2 as K;
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    let elements: NodeListOf<HTMLElementTagNameMap[S]> = window.document.querySelectorAll(selector as S);
                    for (let element of elements) {
                        if (validate(element)) {
                            let listener: (event: Event) => void = (event: Event): void => {
                                if (interrupt(event as HTMLElementEventMap[K], index)) {
                                    element.removeEventListener(key, listener);
                                } else {
                                    accept(event as HTMLElementEventMap[K], index);
                                    index++;
                                }
                            }
                            element.addEventListener(key, listener);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys: Iterable<unknown> = new Set(argument2);
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    let elements: NodeListOf<HTMLElementTagNameMap[S]> = window.document.querySelectorAll(selector as S);
                    for (let element of elements) {
                        for (let key of keys) {
                            if (isString(key)) {
                                let listener: (event: Event) => void = (event: Event): void => {
                                    if (interrupt(event as HTMLElementEventMap[K], index)) {
                                        element.removeEventListener(key, listener);
                                    } else {
                                        accept(event as HTMLElementEventMap[K], index);
                                        index++;
                                    }
                                }
                                element.addEventListener(key, listener);
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }
    if (isIterable(argument1)) {
        let elementsOrSelectors: Iterable<unknown> = argument1;
        if (isString(argument2)) {
            let key: K = argument2 as K;
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isString(elementOrSelector)) {
                            let element: MaybeInvalid<HTMLElementTagNameMap[S]> = window.document.querySelector(elementOrSelector as S);
                            if (validate(element)) {
                                let listener: (event: Event) => void = (event: Event): void => {
                                    if (interrupt(event as HTMLElementEventMap[K], index)) {
                                        element.removeEventListener(key, listener);
                                    } else {
                                        accept(event as HTMLElementEventMap[K], index);
                                        index++;
                                    }
                                }
                                element.addEventListener(key, listener);
                            }
                        } else if (isHTMLElemet(elementOrSelector)) {
                            let element: HTMLElement = elementOrSelector as HTMLElement;
                            let listener: (event: Event) => void = (event: Event): void => {
                                if (interrupt(event as HTMLElementEventMap[K], index)) {
                                    element.removeEventListener(key, listener);
                                } else {
                                    accept(event as HTMLElementEventMap[K], index);
                                    index++;
                                }
                            }
                            element.addEventListener(key, listener);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys: Iterable<unknown> = argument2;
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isString(elementOrSelector)) {
                            let element: MaybeInvalid<HTMLElementTagNameMap[S]> = window.document.querySelector(elementOrSelector as S);
                            if (validate(element)) {
                                for (let key of keys) {
                                    if (isString(key)) {
                                        let listener: (event: Event) => void = (event: Event): void => {
                                            if (interrupt(event as HTMLElementEventMap[K], index)) {
                                                element.removeEventListener(key, listener);
                                            } else {
                                                accept(event as HTMLElementEventMap[K], index);
                                                index++;
                                            }
                                        }
                                        element.addEventListener(key, listener);
                                    }
                                }
                            }
                        } else if (isHTMLElemet(elementOrSelector)) {
                            let element: HTMLElement = elementOrSelector as HTMLElement;
                            for (let key of keys) {
                                if (isString(key)) {
                                    let listener: (event: Event) => void = (event: Event): void => {
                                        if (interrupt(event as HTMLElementEventMap[K], index)) {
                                            element.removeEventListener(key, listener);
                                        } else {
                                            accept(event as HTMLElementEventMap[K], index);
                                            index++;
                                        }
                                    }
                                    element.addEventListener(key, listener);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }
    if (isHTMLElemet(argument1)) {
        let element: E = argument1 as E;
        if (isString(argument2)) {
            let key: K = argument2 as K;
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    let listener: (event: Event) => void = (event: Event): void => {
                        if (interrupt(event as HTMLElementEventMap[K], index)) {
                            element.removeEventListener(key, listener);
                        } else {
                            accept(event as HTMLElementEventMap[K], index);
                            index++;
                        }
                    }
                    element.addEventListener(key, listener);
                } catch (error) {
                    console.error(error);
                }
            });
        }
        if (isIterable(argument2)) {
            let keys: Iterable<unknown> = argument2;
            return new Semantic<HTMLElementEventMap[K]>((accept: Consumer<HTMLElementEventMap[K]> | BiConsumer<HTMLElementEventMap[K], bigint>, interrupt: Predicate<HTMLElementEventMap[K]> | BiPredicate<HTMLElementEventMap[K], bigint>): void => {
                try {
                    let index: bigint = 0n;
                    for (let key of keys) {
                        if (isString(key)) {
                            let listener: (event: Event) => void = (event: Event): void => {
                                if (interrupt(event as HTMLElementEventMap[K], index)) {
                                    element.removeEventListener(key, listener);
                                } else {
                                    accept(event as HTMLElementEventMap[K], index);
                                    index++;
                                }
                            }
                            element.addEventListener(key, listener);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
    }
    throw new TypeError("Invalid arguments.");
};

export let useEmpty: <E>() => Semantic<E> = <E>(): Semantic<E> => {
    return new Semantic<E>(() => { });
};

interface UseFill {
    <E>(element: E, count: bigint): Semantic<E>;
    <E>(supplier: Supplier<E>, count: bigint): Semantic<E>;
};
export let useFill: UseFill = <E>(element: E | Supplier<E>, count: bigint): Semantic<E> => {
    if (validate(element) && count > 0n) {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
            try {
                for (let i = 0n; i < count; i++) {
                    let item: E = isFunction(element) ? element() : element;
                    if (interrupt(item, i)) {
                        break;
                    }
                    accept(item, i);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

export interface UseFrom {
    <E>(iterable: Iterable<E>): Semantic<E>;
    <E>(iterable: AsyncIterable<E>): Semantic<E>;
};
export let useFrom: UseFrom = <E>(iterable: Iterable<E> | AsyncIterable<E>): Semantic<E> => {
    if (isIterable(iterable)) {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
            try {
                let index: bigint = 0n;
                for (let element of iterable) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        });
    } else if (isAsyncIterable(iterable)) {
        return new Semantic<E>(async (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
            try {
                let index: bigint = 0n;
                for await (let element of iterable) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments");
};

interface UseGenerate {
    <E>(supplier: Supplier<E>, interrupt: Predicate<E>): Semantic<E>;
    <E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): Semantic<E>;
};
export let useGenerate: UseGenerate = <E>(supplier: Supplier<E>, interrupt: Predicate<E> | BiPredicate<E, bigint>): Semantic<E> => {
    if (isFunction(supplier) && isFunction(interrupt)) {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            try {
                let index: bigint = 0n;
                while (true) {
                    let element: E = supplier();
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments");
};

interface UseInterval {
    (period: number): Semantic<number>;
    (period: number, delay: number): Semantic<number>;
};
export let useInterval: UseInterval = (period: number, delay: number = 0): Semantic<number> => {
    if (period > 0 && delay >= 0) {
        return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
            try {
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
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

export let useIterate: <E>(generator: Generator<E>) => Semantic<E> = <E>(generator: Generator<E>): Semantic<E> => {
    if (isFunction(generator)) {
        try {
            return new Semantic(generator);
        } catch (error) {
            console.error(error);
        }
    }
    throw new TypeError("Invalid arguments.");
};

export let usePromise: (<T>(promise: Promise<T>) => Semantic<T>) = <T>(promise: Promise<T>): Semantic<T> => {
    if (isPromise(promise)) {
        return new Semantic<T>((accept: Consumer<T> | BiConsumer<T, bigint>, interrupt: Predicate<T> | BiPredicate<T, bigint>) => {
            try {
                promise.then((value: T) => {
                    if (interrupt(value, 0n)) {
                        return;
                    }
                    accept(value, 0n);
                }).catch((error: any) => {
                    console.error(error);
                });
            } catch (error) {
                console.error(error);
            }
        });
    } else {
        throw new TypeError("Invalid arguments.");
    }
};

interface UseOf {
    <E>(target: E): Semantic<E>;
    <E>(target: Iterable<E>): Semantic<E>;
};

export let useOf: UseOf = <E>(...target: Array<E>): Semantic<E> => {
    if (Array.isArray(target)) {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
            try {
                let index: bigint = 0n;
                for (let element of target) {
                    if (interrupt(element, index)) {
                        break;
                    }
                    accept(element, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

interface UseRange {
    <N extends number | bigint>(start: N, end: N): Semantic<N extends number ? number : (N extends bigint ? bigint : never)>;
    <N extends number | bigint>(start: N, end: N, step: N): Semantic<N extends number ? number : (N extends bigint ? bigint : never)>;
};
export let useRange: UseRange = <N extends number | bigint>(start: N, end: N, step: N = (isNumber(start) && isNumber(end) ? 1 : 1n) as N): Semantic<N> => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step as number, 0) === 0) || (isBigInt(step) && useCompare(step as bigint, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let trusted: number = useToNumber(step);
        return new Semantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
            try {
                let index: bigint = 0n;
                for (let i: number = start; i < end; i += trusted) {
                    if (interrupt(i, index)) {
                        break;
                    }
                    accept(i, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        }) as unknown as Semantic<N>;
    } else if (isBigInt(start) && isBigInt(end)) {
        let trusted: bigint = useToBigInt(step);
        return new Semantic<bigint>((accept: Consumer<bigint> | BiConsumer<bigint, bigint>, interrupt: Predicate<bigint> | BiPredicate<bigint, bigint>): void => {
            try {
                let index: bigint = 0n;
                for (let i: bigint = start; i < end; i += trusted) {
                    if (interrupt(i, index)) {
                        break;
                    }
                    accept(i, index);
                    index++;
                }
            } catch (error) {
                console.error(error);
            }
        }) as unknown as Semantic<N>;
    }
    throw new TypeError("Invalid arguments.");
};

interface UseWebSocket {
    (websocket: WebSocket): Semantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    <K extends keyof WebSocketEventMap>(websocket: WebSocket, key: K): Semantic<WebSocketEventMap[K extends keyof WebSocketEventMap ? K : never]>;
    <K extends keyof WebSocketEventMap>(websocket: WebSocket, keys: Iterable<K>): Semantic<WebSocketEventMap[K extends keyof WebSocketEventMap ? K : never]>;
};
export let useWebSocket: UseWebSocket = <K extends keyof WebSocketEventMap>(argument1: WebSocket, argument2?: K | Iterable<K>): Semantic<WebSocketEventMap[keyof WebSocketEventMap]> | Semantic<WebSocketEventMap[K]> => {
    if (isObject(argument1) && isFunction(Reflect.get(argument1, "addEventListener"))) {
        let websocket: WebSocket = argument1;
        if (isString(argument2)) {
            let key: K = argument2 as K;
            return new Semantic<WebSocketEventMap[K]>((accept: Consumer<WebSocketEventMap[K]> | BiConsumer<WebSocketEventMap[K], bigint>, interrupt: Predicate<WebSocketEventMap[K]> | BiPredicate<WebSocketEventMap[K], bigint>): void => {
                try {
                    let listener: (event: WebSocketEventMap[K]) => void = (event: WebSocketEventMap[K]): void => {
                        if (interrupt(event, 0n)) {
                            websocket.removeEventListener(key, listener);
                        } else {
                            accept(event, 0n);
                        }
                    };
                    websocket.addEventListener(key, listener);
                } catch (error) {
                    console.error(error);
                }
            });
        } else if (isIterable(argument2)) {
            let keys: Iterable<unknown> = argument2;
            return new Semantic<WebSocketEventMap[K]>((accept: Consumer<WebSocketEventMap[K]> | BiConsumer<WebSocketEventMap[K], bigint>, interrupt: Predicate<WebSocketEventMap[K]> | BiPredicate<WebSocketEventMap[K], bigint>): void => {
                try {
                    for (let key of keys) {
                        if (isString(key)) {
                            let listener: (event: WebSocketEventMap[K]) => void = (event: WebSocketEventMap[K]): void => {
                                if (interrupt(event, 0n)) {
                                    websocket.removeEventListener(key as K, listener);
                                } else {
                                    accept(event, 0n);
                                }
                            };
                            websocket.addEventListener(key as K, listener);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
        let keys: Array<keyof WebSocketEventMap> = ["open", "message", "close", "error"];
        return new Semantic<WebSocketEventMap[keyof WebSocketEventMap]>((accept: Consumer<WebSocketEventMap[keyof WebSocketEventMap]> | BiConsumer<WebSocketEventMap[keyof WebSocketEventMap], bigint>, interrupt: Predicate<WebSocketEventMap[keyof WebSocketEventMap]> | BiPredicate<WebSocketEventMap[keyof WebSocketEventMap], bigint>): void => {
            try {
                for (let key of keys) {
                    let listener: (event: WebSocketEventMap[keyof WebSocketEventMap]) => void = (event: WebSocketEventMap[keyof WebSocketEventMap]): void => {
                        if (interrupt(event, 0n)) {
                            websocket.removeEventListener(key, listener);
                        } else {
                            accept(event, 0n);
                        }
                    };
                    websocket.addEventListener(key, listener);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

interface UseWindow {
    <K extends keyof WindowEventMap>(key: K): Semantic<WindowEventMap[K extends keyof WindowEventMap ? K : never]>;
    <K extends keyof WindowEventMap>(key: Iterable<K>): Semantic<WindowEventMap[K extends keyof WindowEventMap ? K : never]>;
};

export let useWindow: UseWindow = <K extends keyof WindowEventMap>(argument1: K | Iterable<K>): Semantic<WindowEventMap[K]> => {
    if (isString(argument1)) {
        let key: K = argument1 as K;
        return new Semantic<WindowEventMap[K]>((accept: Consumer<WindowEventMap[K]> | BiConsumer<WindowEventMap[K], bigint>, interrupt: Predicate<WindowEventMap[K]> | BiPredicate<WindowEventMap[K], bigint>): void => {
            try {
                let listener: (event: WindowEventMap[K]) => void = (event: WindowEventMap[K]): void => {
                    if (interrupt(event, 0n)) {
                        window.removeEventListener(key, listener);
                    } else {
                        console.log(event.type, event);
                        accept(event, 0n);
                    }
                };
                window.addEventListener(key, listener);
            } catch (error) {
                console.error(error);
            }
        });
    } else if (isIterable(argument1)) {
        let keys: Set<unknown> = new Set(argument1);
        return new Semantic<WindowEventMap[K]>((accept: Consumer<WindowEventMap[K]> | BiConsumer<WindowEventMap[K], bigint>, interrupt: Predicate<WindowEventMap[K]> | BiPredicate<WindowEventMap[K], bigint>): void => {
            try {
                let index: bigint = 0n;
                for (let key of keys) {
                    if (isString(key)) {
                        let listener: (event: WindowEventMap[K]) => void = function (event: WindowEventMap[K]) {
                            if (interrupt(event, index)) {
                                console.log("Terminal", performance.now());
                                window.removeEventListener(key as K, listener);
                            } else {
                                console.log("accept", performance.now());
                                accept(event, index);
                            }
                        };
                        index++;
                        window.addEventListener(key as K, listener);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};

export let useNullable: <T>(target: MaybeInvalid<T>) => Optional<T> = <T>(target: MaybeInvalid<T>): Optional<T> => Optional.ofNullable(target);

export let useNonNull: <T>(target: T) => Optional<T> = <T>(target: T): Optional<T> => Optional.ofNonNull(target);