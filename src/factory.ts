import { AsynchronousSemantic } from "./asynchronous/semantic";
import { isBigInt, isFunction, isIterable, isNumber, isObject, isPromise, isAsyncIterable, isString, isHTMLElemet } from "./guard";
import { useCompare, useToBigInt, useToNumber, useTraverse } from "./hook";
import { Optional } from "./optional";
import { SynchronousSemantic } from "./synchronous/semantic";
import { invalidate, validate } from "./utility";
import type { BiPredicate, Predicate, Supplier, Consumer, BiConsumer, DeepPropertyKey, DeepPropertyValue, MaybeInvalid, SynchronousGenerator, Runnable } from "./utility";

interface UseAnimationFrame {
    (period: number): SynchronousSemantic<number>;
    (period: number, delay: number): SynchronousSemantic<number>;
};
export let useAnimationFrame: UseAnimationFrame = (period: number, delay: number = 0): SynchronousSemantic<number> => {
    if (period <= 0 || !Number.isFinite(period) || delay < 0 || !Number.isFinite(delay)) {
        throw new TypeError("Period must be positive finite number and delay must be non-negative finite number.");
    }
    return new SynchronousSemantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
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
export let useAttribute: <T extends object>(target: T) => SynchronousSemantic<Attribute<T>> = <T extends object>(target: T): SynchronousSemantic<Attribute<T>> => {
    if (isObject(target)) {
        return new SynchronousSemantic<Attribute<T>>((accept: Consumer<Attribute<T>> | BiConsumer<Attribute<T>, bigint>, interrupt: Predicate<Attribute<T>> | BiPredicate<Attribute<T>, bigint>): void => {
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
    (blob: Blob): SynchronousSemantic<Uint8Array>;
    (blob: Blob, chunk: bigint): SynchronousSemantic<Uint8Array>;
};
export let useBlob: UseBlob = (blob: Blob, chunk: bigint = 64n * 1024n): SynchronousSemantic<Uint8Array> => {
    let size: number = Number(chunk);
    if (size <= 0 || !Number.isSafeInteger(size)) {
        throw new RangeError("Chunk size must be a safe positive integer.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new SynchronousSemantic<Uint8Array>((accept: Consumer<Uint8Array> | BiConsumer<Uint8Array, bigint>, interrupt: Predicate<Uint8Array> | BiPredicate<Uint8Array, bigint>) => {
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

interface UseDocumentOptions {
    throttle?: number;
    debounce?: number;
};

interface UseDocument {
    <K extends keyof DocumentEventMap, V extends DocumentEventMap[K]>(key: K): AsynchronousSemantic<V>;
    <K extends keyof DocumentEventMap, V extends DocumentEventMap[K]>(key: Iterable<K>): AsynchronousSemantic<V>;
};

export let useDocument: UseDocument = <K extends keyof DocumentEventMap, V extends DocumentEventMap[K]>(argument1: K | Iterable<K>, argument2: UseDocumentOptions = {}): AsynchronousSemantic<V> => {
    let options: UseWindowOptions = argument2;
    let debounce: number = isObject(options) && isNumber(options.debounce) ? options.debounce : 0;
    let throttle: number = isObject(options) && isNumber(options.throttle) ? options.throttle : 0;
    if (isString(argument1)) {
        let key: K = argument1 as K;
        return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
            let timeOut: ReturnType<typeof setTimeout> | null = null;
            let lastEmitTime: number = 0;
            let index: bigint = 0n;
            let until: Promise<void> = new Promise<void>(resolve => {
                let listener: Consumer<V> = (event: V) => {
                    if (debounce > 0) {
                        if (timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout((): void => {
                            if (interrupt(event, index)) {
                                window.document.removeEventListener(key, listener as EventListener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                        }, debounce);
                        return;
                    }
                    if (throttle > 0) {
                        let now: number = performance.now();
                        if (now - lastEmitTime < throttle) {
                            return;
                        }
                        lastEmitTime = now;
                        if (interrupt(event, index)) {
                            window.document.removeEventListener(key, listener as EventListener);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                        return;
                    }
                    if (interrupt(event, index)) {
                        window.document.removeEventListener(key, listener as EventListener);
                        resolve();
                        accept(event, -1n);
                        return;
                    }
                    accept(event, index);
                    index++;
                };
                window.document.addEventListener(key, listener as EventListener);
            });
            await until;
        });
    }
    if (isIterable(argument1)) {
        let keys: Set<K> = new Set(...argument1) as Set<K>;
        return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
            let lastEmitTime: number = 0;
            let timeOut: ReturnType<typeof setTimeout> | null = null;
            let index: bigint = 0n;
            let activeCount: number = keys.size;
            let until: Promise<void> = new Promise<void>(resolve => {
                for (let key of keys) {
                    if (!isString(key)) continue;
                    let listener = (event: V) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout((): void => handleEvent(event, key), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmitTime < throttle) return;
                            lastEmitTime = now;
                        }

                        handleEvent(event, key);
                    };
                    let handleEvent: BiConsumer<V, K> = (event: V, currentKey: K) => {
                        if (interrupt(event, index)) {
                            window.document.removeEventListener(currentKey, listener as EventListener);
                            if (--activeCount === 0) {
                                resolve();
                            }
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    window.document.addEventListener(key, listener as EventListener);
                }
            });
            await until;
        });
    }

    throw new TypeError("Invalid arguments.");
};

interface UseHTMLElementOptions {
    throttle?: number;
    debounce?: number;
};

interface UseHTMLElement {
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, key: K): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, keys: Iterable<K>): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(element: E, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, key: K): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(elements: Iterable<E>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, key: K): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, key: K): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: string, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, keys: Iterable<K>): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selector: S, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, key: K): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, key: K): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, key: K, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<string>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;

    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, keys: Iterable<K>): AsynchronousSemantic<V>;
    <S extends keyof HTMLElementTagNameMap, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(selectors: Iterable<S>, keys: Iterable<K>, options: UseHTMLElementOptions): AsynchronousSemantic<V>;
}

export let useHTMLElement: UseHTMLElement = <S extends keyof HTMLElementTagNameMap, E extends HTMLElement, K extends keyof HTMLElementEventMap, V extends HTMLElementEventMap[K]>(argument1: S | string | E | Iterable<E> | Iterable<S>, argument2: K | Iterable<K>, argument3: UseHTMLElementOptions = {}): AsynchronousSemantic<V> => {
    let throttle: number = isObject(argument3) && isNumber((argument3 as any).throttle) ? (argument3 as any).throttle : 0;
    let debounce: number = isObject(argument3) && isNumber((argument3 as any).debounce) ? (argument3 as any).debounce : 0;
    if (debounce > 0 && throttle > 0) {
        throw new TypeError("throttle and debounce cannot be used together");
    }
    if (debounce < 0 || throttle < 0) {
        throw new TypeError("throttle/debounce must be non-negative");
    }
    if (isHTMLElemet(argument1)) {
        let element: E = argument1 as E;
        if (isString(argument2)) {
            let key = argument2 as K;
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let timeOut: ReturnType<typeof setTimeout> | null = null;
                let lastEmit = 0;
                let index = 0n;

                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    let listener: Consumer<V> = (event: V) => {
                        if (debounce > 0) {
                            if (timeOut) clearTimeout(timeOut);
                            timeOut = setTimeout((): void => handle(event), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmit < throttle) return;
                            lastEmit = now;
                        }
                        handle(event);
                    };
                    let handle: Consumer<V> = (event: V) => {
                        if (interrupt(event, index)) {
                            element.removeEventListener(key, listener as EventListener);
                            if (timeOut) clearTimeout(timeOut);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                    };

                    element.addEventListener(key, listener as EventListener);
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys = [...new Set(argument2)] as K[];
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let active: number = keys.length;
                let index: bigint = 0n;
                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    for (let key of keys) {
                        let listener: Consumer<V> = (event: V) => {
                            if (interrupt(event, index)) {
                                element.removeEventListener(key, listener as EventListener);
                                if (--active === 0) {
                                    resolve();
                                }
                                return;
                            }
                            accept(event, index);
                            index++;
                        };
                        element.addEventListener(key, listener as EventListener);
                    }
                });
                await until;
            });
        }
    }
    if (isString(argument1)) {
        let selector = argument1 as S;
        let elements: Array<E> = [...(document.querySelectorAll(selector as string) as NodeListOf<E>)];
        if (isString(argument2)) {
            let key = argument2 as K;
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let active: number = elements.length;
                let index: bigint = 0n;
                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    for (let element of elements) {
                        if (validate(element)) {
                            let listener: Consumer<V> = (event: V) => {
                                if (interrupt(event, index)) {
                                    element.removeEventListener(key, listener as EventListener);
                                    if (--active === 0) {
                                        resolve();
                                    }
                                    return;
                                }
                                accept(event, index);
                                index++;
                            };
                            element.addEventListener(key, listener as EventListener);
                        }
                    }
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys: Set<K> = new Set(argument2);
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let active: number = elements.length * keys.size;
                let index: bigint = 0n;
                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    for (let element of elements) {
                        for (let key of keys) {
                            if (validate(element) && isString(key)) {
                                let listener: Consumer<V> = (event: V) => {
                                    if (interrupt(event, index)) {
                                        element.removeEventListener(key, listener as EventListener);
                                        if (--active === 0) {
                                            resolve();
                                        }
                                        return;
                                    }
                                    accept(event, index);
                                    index++;
                                };
                                element.addEventListener(key, listener as EventListener);
                            }
                        }
                    }
                });
                await until;
            });
        }
    }
    if (isIterable(argument1)) {
        let elementsOrSelectors: Set<E | S> = new Set<E | S>(argument1 as Iterable<E | S>);
        if (isString(argument2)) {
            let key = argument2 as K;
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let active = elementsOrSelectors.size;
                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (validate(elementOrSelector)) {
                            if (isHTMLElemet(elementOrSelector)) {
                                let element: E = elementOrSelector as E;
                                let listener: Consumer<V> = (event: V) => {
                                    if (interrupt(event, 0n)) {
                                        element.removeEventListener(key, listener as EventListener);
                                        if (--active === 0) {
                                            resolve();
                                        }
                                        return;
                                    }
                                    accept(event, 0n);
                                };
                                element.addEventListener(key, listener as EventListener);
                            } else if (isString(elementOrSelector)) {
                                let selector = elementOrSelector as S;
                                let elements: Array<E> = [...(document.querySelectorAll(selector as string) as NodeListOf<E>)].filter((item: unknown) => isHTMLElemet(item));
                                for (let element of elements) {
                                    if (validate(element)) {
                                        let listener: Consumer<V> = (event: V) => {
                                            if (interrupt(event, 0n)) {
                                                element.removeEventListener(key, listener as EventListener);
                                                if (--active === 0) {
                                                    resolve();
                                                }
                                                return;
                                            }
                                            accept(event, 0n);
                                        };
                                        element.addEventListener(key, listener as EventListener);
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
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>) => {
                let active = elementsOrSelectors.size * keys.size;
                let until: Promise<void> = new Promise<void>((resolve: Runnable): void => {
                    for (let elementOrSelector of elementsOrSelectors) {
                        if (isHTMLElemet(elementOrSelector)) {
                            let element: E = elementOrSelector as E;
                            for (let key of keys) {
                                if (isString(key)) {
                                    let listener: Consumer<V> = (event: V) => {
                                        if (interrupt(event, 0n)) {
                                            element.removeEventListener(key, listener as EventListener);
                                            if (--active === 0) {
                                                resolve();
                                            }
                                            return;
                                        }
                                        accept(event, 0n);
                                    };
                                    element.addEventListener(key, listener as EventListener);
                                }
                            }
                        } else if (isString(elementOrSelector)) {
                            let selector: S = elementOrSelector as S;
                            let elements: Array<E> = [...(document.querySelectorAll(selector as string) as NodeListOf<E>)].filter((item: unknown) => isHTMLElemet(item));
                            for (let element of elements) {
                                for (let key of keys) {
                                    let listener: Consumer<V> = (event: V) => {
                                        if (interrupt(event, 0n)) {
                                            element.removeEventListener(key, listener as EventListener);
                                            if (--active === 0) {
                                                resolve();
                                            }
                                            return;
                                        }
                                        accept(event, 0n);
                                    };
                                    element.addEventListener(key, listener as EventListener);
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

export let useEmpty: <E>() => SynchronousSemantic<E> = <E>(): SynchronousSemantic<E> => {
    return new SynchronousSemantic<E>(() => { });
};

interface UseFill {
    <E>(element: E, count: bigint): SynchronousSemantic<E>;
    <E>(supplier: Supplier<E>, count: bigint): SynchronousSemantic<E>;
};
export let useFill: UseFill = <E>(element: E | Supplier<E>, count: bigint): SynchronousSemantic<E> => {
    if (validate(element) && count > 0n) {
        return new SynchronousSemantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
    <E>(iterable: Iterable<E>): SynchronousSemantic<E>;
    <E>(iterable: AsyncIterable<E>): SynchronousSemantic<E>;
};
export let useFrom: UseFrom = <E>(iterable: Iterable<E> | AsyncIterable<E>): SynchronousSemantic<E> => {
    if (isIterable(iterable)) {
        return new SynchronousSemantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
        return new SynchronousSemantic<E>(async (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
    <E>(supplier: Supplier<E>, interrupt: Predicate<E>): SynchronousSemantic<E>;
    <E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): SynchronousSemantic<E>;
};
export let useGenerate: UseGenerate = <E>(supplier: Supplier<E>, interrupt: Predicate<E> | BiPredicate<E, bigint>): SynchronousSemantic<E> => {
    if (isFunction(supplier) && isFunction(interrupt)) {
        return new SynchronousSemantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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
    (period: number): SynchronousSemantic<number>;
    (period: number, delay: number): SynchronousSemantic<number>;
};
export let useInterval: UseInterval = (period: number, delay: number = 0): SynchronousSemantic<number> => {
    if (period > 0 && delay >= 0) {
        return new SynchronousSemantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
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

export let useIterate: <E>(generator: SynchronousGenerator<E>) => SynchronousSemantic<E> = <E>(generator: SynchronousGenerator<E>): SynchronousSemantic<E> => {
    if (isFunction(generator)) {
        try {
            return new SynchronousSemantic(generator);
        } catch (error) {
            console.error(error);
        }
    }
    throw new TypeError("Invalid arguments.");
};

export let usePromise: (<T>(promise: Promise<T>) => SynchronousSemantic<T>) = <T>(promise: Promise<T>): SynchronousSemantic<T> => {
    if (isPromise(promise)) {
        return new SynchronousSemantic<T>((accept: Consumer<T> | BiConsumer<T, bigint>, interrupt: Predicate<T> | BiPredicate<T, bigint>) => {
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
    <E>(target: E): SynchronousSemantic<E>;
    <E>(target: Iterable<E>): SynchronousSemantic<E>;
};

export let useOf: UseOf = <E>(...target: Array<E>): SynchronousSemantic<E> => {
    if (Array.isArray(target)) {
        return new SynchronousSemantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>) => {
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
    <N extends number | bigint>(start: N, end: N): SynchronousSemantic<N extends number ? number : (N extends bigint ? bigint : never)>;
    <N extends number | bigint>(start: N, end: N, step: N): SynchronousSemantic<N extends number ? number : (N extends bigint ? bigint : never)>;
};
export let useRange: UseRange = <N extends number | bigint>(start: N, end: N, step: N = (isNumber(start) && isNumber(end) ? 1 : 1n) as N): SynchronousSemantic<N> => {
    if ((!isNumber(step) && !isBigInt(step)) || (isNumber(step) && useCompare(step as number, 0) === 0) || (isBigInt(step) && useCompare(step as bigint, 0n) === 0)) {
        throw new TypeError("Step must be numeric and cannot be zero.");
    }
    if (isNumber(start) && isNumber(end)) {
        let trusted: number = useToNumber(step);
        return new SynchronousSemantic<number>((accept: Consumer<number> | BiConsumer<number, bigint>, interrupt: Predicate<number> | BiPredicate<number, bigint>): void => {
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
        }) as unknown as SynchronousSemantic<N>;
    } else if (isBigInt(start) && isBigInt(end)) {
        let trusted: bigint = useToBigInt(step);
        return new SynchronousSemantic<bigint>((accept: Consumer<bigint> | BiConsumer<bigint, bigint>, interrupt: Predicate<bigint> | BiPredicate<bigint, bigint>): void => {
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
        }) as unknown as SynchronousSemantic<N>;
    }
    throw new TypeError("Invalid arguments.");
};

interface UseWebSocketOptions {
    throttle?: number;
    debounce?: number;
};
interface UseWebSocket {
    (websocket: WebSocket): AsynchronousSemantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    (websocket: WebSocket, options: UseWebSocketOptions): AsynchronousSemantic<WebSocketEventMap[keyof WebSocketEventMap]>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, key: K): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, key: K, options: UseWebSocketOptions): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(websocket: WebSocket, keys: Iterable<K>, options: UseWebSocketOptions): AsynchronousSemantic<V>;
};
export let useWebSocket: UseWebSocket = <K extends keyof WebSocketEventMap, V extends WebSocketEventMap[K]>(argument1: WebSocket, argument2?: K | Iterable<K> | UseWebSocketOptions, argument3?: UseWebSocketOptions): AsynchronousSemantic<V> => {
    let debounce: number = 0;
    let throttle: number = 0;
    if (isObject(argument2)) {
        debounce = Reflect.has(argument2, "debounce") ? Reflect.get(argument2, "debounce") : 0;
        throttle = Reflect.has(argument2, "throttle") ? Reflect.get(argument2, "throttle") : 0;
    } else {
        debounce = validate(argument3) && isNumber(argument3.debounce) ? argument3.debounce : 0;
        throttle = validate(argument3) && isNumber(argument3.throttle) ? argument3.throttle : 0;
    }
    if (validate(argument1)) {
        let websocket: WebSocket = argument1;
        if (isString(argument2)) {
            let key: K = argument1 as unknown as K;
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>): Promise<void> => {
                let timeOut: ReturnType<typeof setTimeout> | null = null;
                let lastEmitTime: number = 0;
                let index: bigint = 0n;
                let until: Promise<void> = new Promise<void>(resolve => {
                    let listener: Consumer<V> = (event: V) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout((): void => {
                                if (interrupt(event, index)) {
                                    websocket.removeEventListener(key, listener as EventListener);
                                    resolve();
                                    return;
                                }
                                accept(event, index);
                                index++;
                            }, debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now: number = performance.now();
                            if (now - lastEmitTime < throttle) {
                                return;
                            }
                            lastEmitTime = now;
                            if (interrupt(event, index)) {
                                websocket.removeEventListener(key, listener as EventListener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                            return;
                        }
                        if (interrupt(event, index)) {
                            websocket.removeEventListener(key, listener as EventListener);
                            resolve();
                            accept(event, -1n);
                            return;
                        }
                        accept(event, index);
                        index++;
                    };
                    websocket.addEventListener(key, listener as EventListener);
                });
                await until;
            });
        }
        if (isIterable(argument2)) {
            let keys: Set<K> = new Set(...(argument1 as unknown as Iterable<K>)) as Set<K>;
            return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>): Promise<void> => {
                let lastEmitTime: number = 0;
                let timeOut: ReturnType<typeof setTimeout> | null = null;
                let index: bigint = 0n;
                let activeCount: number = keys.size;
                let until: Promise<void> = new Promise<void>(resolve => {
                    for (let key of keys) {
                        if (!isString(key)) continue;
                        let listener: Consumer<V> = (event: V) => {
                            if (debounce > 0) {
                                if (timeOut) {
                                    clearTimeout(timeOut);
                                }
                                timeOut = setTimeout((): void => handleEvent(event, key), debounce);
                                return;
                            }
                            if (throttle > 0) {
                                let now = performance.now();
                                if (now - lastEmitTime < throttle) return;
                                lastEmitTime = now;
                            }
                            handleEvent(event, key);
                        };
                        let handleEvent: BiConsumer<V, K> = (event: V, currentKey: K) => {
                            if (interrupt(event, index)) {
                                websocket.removeEventListener(currentKey, listener as EventListener);
                                if (--activeCount === 0) {
                                    resolve();
                                }
                                return;
                            }
                            accept(event, index);
                            index++;
                        };
                        websocket.addEventListener(key, listener as EventListener);
                    }
                });
                await until;
            });
        }
    }

    throw new TypeError("Invalid arguments.");
};

interface UseWindowOptions {
    throttle?: number;
    debounce?: number;
}

interface UseWindow {
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(key: K): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(key: K, options: UseWindowOptions): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(keys: Iterable<K>): AsynchronousSemantic<V>;
    <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(keys: Iterable<K>, options: UseWindowOptions): AsynchronousSemantic<V>;
}

export let useWindow: UseWindow = <K extends keyof WindowEventMap, V extends WindowEventMap[K]>(argument1: K | Iterable<K>, argument2: UseWindowOptions = {}): AsynchronousSemantic<V> => {
    let options: UseWindowOptions = argument2;
    let debounce: number = isObject(options) && isNumber(options.debounce) ? options.debounce : 0;
    let throttle: number = isObject(options) && isNumber(options.throttle) ? options.throttle : 0;
    if (isString(argument1)) {
        let key: K = argument1 as K;
        return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>): Promise<void> => {
            let timeOut: ReturnType<typeof setTimeout> | null = null;
            let lastEmitTime: number = 0;
            let index: bigint = 0n;
            let until: Promise<void> = new Promise<void>(resolve => {
                let listener: Consumer<V> = (event: V) => {
                    if (debounce > 0) {
                        if (timeOut) {
                            clearTimeout(timeOut);
                        }
                        timeOut = setTimeout((): void => {
                            if (interrupt(event, index)) {
                                window.removeEventListener(key, listener as EventListener);
                                resolve();
                                return;
                            }
                            accept(event, index);
                            index++;
                        }, debounce);
                        return;
                    }
                    if (throttle > 0) {
                        let now: number = performance.now();
                        if (now - lastEmitTime < throttle) {
                            return;
                        }
                        lastEmitTime = now;
                        if (interrupt(event, index)) {
                            window.removeEventListener(key, listener as EventListener);
                            resolve();
                            return;
                        }
                        accept(event, index);
                        index++;
                        return;
                    }
                    if (interrupt(event, index)) {
                        window.removeEventListener(key, listener as EventListener);
                        resolve();
                        accept(event, -1n);
                        return;
                    }
                    accept(event, index);
                    index++;
                };
                window.addEventListener(key, listener as EventListener);
            });
            await until;
        });
    }
    if (isIterable(argument1)) {
        let keys: Set<K> = new Set(...argument1) as Set<K>;
        return new AsynchronousSemantic<V>(async (accept: Consumer<V> | BiConsumer<V, bigint>, interrupt: Predicate<V> | BiPredicate<V, bigint>): Promise<void> => {
            let lastEmitTime: number = 0;
            let timeOut: ReturnType<typeof setTimeout> | null = null;
            let index: bigint = 0n;
            let activeCount: number = keys.size;
            let until: Promise<void> = new Promise<void>(resolve => {
                for (let key of keys) {
                    if (!isString(key)) continue;
                    let listener = (event: V) => {
                        if (debounce > 0) {
                            if (timeOut) {
                                clearTimeout(timeOut);
                            }
                            timeOut = setTimeout((): void => handleEvent(event, key), debounce);
                            return;
                        }
                        if (throttle > 0) {
                            let now = performance.now();
                            if (now - lastEmitTime < throttle) return;
                            lastEmitTime = now;
                        }
                        handleEvent(event, key);
                    };
                    let handleEvent: BiConsumer<V, K> = (event: V, currentKey: K) => {
                        if (interrupt(event, index)) {
                            window.removeEventListener(currentKey, listener as EventListener);
                            if (--activeCount === 0) {
                                resolve();
                            }
                            return;
                        }
                        accept(event, index);
                        index++;
                    };

                    window.addEventListener(key, listener as EventListener);
                }
            });
            await until;
        });
    }

    throw new TypeError("Invalid arguments.");
};

export let useNullable: <T>(target: MaybeInvalid<T>) => Optional<T> = <T>(target: MaybeInvalid<T>): Optional<T> => Optional.ofNullable(target);

export let useNonNull: <T>(target: T) => Optional<T> = <T>(target: T): Optional<T> => Optional.ofNonNull(target);