 type MaybeInvalid<T> = T | null | undefined;

const validate: <T>(t: MaybeInvalid<T>) => t is T = <T>(t: T | null | undefined): t is T => {
    return t !== null && t !== (void 0);
};

 const invalidate: <T>(t: MaybeInvalid<T>) => t is (null | undefined) = <T>(t: T | null | undefined): t is (null | undefined) => {
    return t === null || t === undefined;
};

 const isBoolean: <T>(t: unknown) => t is boolean = <T>(t: unknown): t is boolean => {
    return typeof t === "boolean";
};
 const isString: <T>(t: unknown) => t is string = <T>(t: unknown): t is string => {
    return typeof t === "string";
};
 const isNumber: <T>(t: unknown) => t is number = <T>(t: unknown): t is number => {
    return typeof t === "number";
};
 const isFunction: <T>(t: unknown) => t is Function = <T>(t: unknown): t is Function => {
    return typeof t === "function";
};
 const isObject: <T>(t: unknown) => t is object = <T>(t: unknown): t is object => {
    return typeof t === "object" && t !== null;
};
 const isSymbol: <T>(t: unknown) => t is symbol = <T>(t: unknown): t is symbol => {
    return typeof t === "symbol";
};
 const isBigint: <T>(t: unknown) => t is bigint = <T>(t: unknown): t is bigint => {
    return typeof t === "bigint";
};
 const isIterable: <T>(t: unknown) => t is Iterable<unknown> = <T>(t: unknown): t is Iterable<unknown> => {
    if (isObject(t)) {
        return typeof Reflect.get(t, Symbol.iterator) === "function";
    }
    return false;
}

 interface Runnable {
    (): void;
};
 interface Supplier<R> {
    (): R;
}
 interface Functional<T, R> {
    (t: T): R;
};
 interface Predicate<T> {
    (t: T): boolean;
};
 interface BiFunctional<T, U, R> {
    (t: T, u: U): R;
};
 interface BiPredicate<T, U> {
    (t: T, u: U): boolean;
};
 interface Comparator<T> {
    (t1: T, t2: T): number;
}
 interface TriFunctional<T, U, V, R> {
    (t: T, u: U, v: V): R;
};
 interface Consumer<T> {
    (t: T): void;
};
 interface BiConsumer<T, U> {
    (t: T, u: U): void;
};
 interface TriConsumer<T, U, V> {
    (t: T, u: U, v: V): void;
};

 interface Generator<T> {
    (accept: BiConsumer<T, bigint>, interrupt: Predicate<T>): void;
}

class Optional<T>{

    protected value: MaybeInvalid<T>;

    protected constructor(value: MaybeInvalid<T>) {
        this.value = value;
    }

    get(): T {
        if (this.isPresent()) {
            return this.value as T;
        }
        throw new TypeError("Optional is empty");
    }

    getOrDefault(defaultValue: T): T {
        if (this.isPresent()) {
            return this.value as T;
        }
        if (validate(defaultValue)) {
            return defaultValue;
        }
        throw new TypeError("Default value is not valid");
    }

    isEmpty(): boolean {
        return invalidate(this.value);
    }

    isPresent(): boolean {
        return validate(this.value);
    }

    map<R>(mapper: Functional<T, R>): Optional<R> {
        if (this.isPresent()) {
            return new Optional<R>(mapper(this.value as T));
        }
        return new Optional<R>(null);
    }

    static of<T>(value: MaybeInvalid<T>) {
        return Optional.ofNullable<T>(value);
    }

    static ofNullable<T>(value: MaybeInvalid<T> = (void 0)) {
        return new Optional<T>(value);
    }

    static ofNonNull<T>(value: T) {
        if (validate(value)) {
            return new Optional<T>(value);
        }
        throw new TypeError("Value is not valid");
    }
}

 const empty = <E>(): Semantic<E> => {
    return new Semantic<E>((accept, interrupt) => { });
}

 const fill = <E>(element: E | Supplier<E>, count: bigint): Semantic<E> => {
    return new Semantic<E>((accept, interrupt) => {
        for (let i = 0n; i < count; i++) {
            let item: E = isFunction(element) ? element() : element;
            accept(item, i);
            if (interrupt(item)) {
                break;
            }
        }
    });
}

 const from = <E>(iterable: Iterable<E>): Semantic<E> => {
    if (isIterable(iterable)) {
        return new Semantic<E>((accept, interrupt) => {
            let index: bigint = 0n;
            for (let element of iterable) {
                accept(element, index);
                if (interrupt(element)) {
                    break;
                }
                index++;
            }
        });
    }
    throw new TypeError("Invalid arguments");
}

 const range = (start: number | bigint, end: number | bigint, step: number | bigint = 1): Semantic<number> | Semantic<bigint> => {
    if (isNumber(start) && isNumber(end)) {
        const limited = Number(step);
        return new Semantic<number>((accept, interrupt) => {
            for (let i: number = Number(start); i < Number(end); i += limited) {
                accept(i, BigInt(i));
                if (interrupt(i)) {
                    break;
                }
            }
        });
    } else if (isBigint(start) && isBigint(end)) {
        const limited = BigInt(step);
        return new Semantic<bigint>((accept, interrupt) => {
            for (let i: bigint = BigInt(start); i < BigInt(end); i += limited) {
                accept(i, i);
                if (interrupt(i)) {
                    break;
                }
            }
        });
    }
    throw new TypeError("Invalid arguments");
}

 function iterate<E>(generator: Generator<E>): Semantic<E> {
    return new Semantic(generator);
}

 class Semantic<E>{

    protected generator: Generator<E>;

    constructor(generator: Generator<E>, concurrent: bigint = 1n) {
        this.generator = generator;
    }

    concat(other: Semantic<E>): Semantic<E> {
        return new Semantic<E>((accept, interrupt) => {
            let count: bigint = 0n;
            this.generator((element: E, index: bigint) => {
                accept(element, index);
                count++;
            }, interrupt);
            other.generator((element: E, index: bigint) => {
                accept(element, index + count);
            }, interrupt);
        });
    }

    distinct(): Semantic<E>;
    distinct(comparator: Comparator<E>): Semantic<E>;
    distinct(...args: any[]): Semantic<E> {
        let map: Map<number, Supplier<Semantic<E>>> = new Map<number, Supplier<Semantic<E>>>();
        map.set(0, (): Semantic<E> => {
            let seen: Set<E> = new Set<E>();
            return new Semantic<E>((accept, interrupt) => {
                this.generator((element: E, index: bigint): void => {
                    if (!seen.has(element)) {
                        seen.add(element);
                        accept(element, index);
                    }
                }, interrupt);
            });
        });
        map.set(1, (): Semantic<E> => {
            let seen: Array<E> = [];
            let comparator: Comparator<E> = args[0];
            return new Semantic<E>((accept, interrupt) => {
                this.generator((element: E, index: bigint): void => {
                    let targetIndex: number = seen.findIndex((value: E) => comparator(value, element) === 0);
                    if (targetIndex === -1) {
                        seen.push(element);
                        accept(element, index);
                    }
                }, interrupt);

            });
        });
        let handler = map.get(args.length);
        if (handler) {
            handler();
        }
        throw new TypeError("Invalid arguments.");
    }

    dropWhile(predicate: Predicate<E>): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            this.generator((element: E, index: bigint): void => {
                if (!predicate(element)) {
                    accept(element, index);
                }
            }, predicate);
        });
    }

    filter(predicate: Predicate<E>): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            this.generator((element: E, index: bigint): void => {
                if (predicate(element)) {
                    accept(element, index);
                }
            }, interrupt);
        });
    }

    flat(mapper: Functional<E, Iterable<E> | Semantic<E>>): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            let count: bigint = 0n;
            let stop: boolean = false;
            this.generator((element: E, index: bigint): void => {
                let result: Semantic<E> | Iterable<E> = mapper(element);
                if (isIterable(result)) {
                    let subIndex: bigint = 0n;
                    for (let subElement of result) {
                        accept(subElement, count + subIndex);
                        stop = stop || interrupt(subElement);
                        count++;
                    }
                } else if (isFunction(Reflect.get(result, "generator"))) {
                    let generator: Generator<E> = Reflect.get(result, "generator");
                    generator((subElement: E, subIndex: bigint): void => {
                        accept(subElement, count + subIndex);
                        stop = stop || interrupt(subElement);
                        count++;
                    }, interrupt);
                }
            }, (element: E): boolean => stop);
        });
    }

    flatMap<R>(mapper: Functional<E, Iterable<R> | Semantic<R>>): Semantic<R> {
        return new Semantic<R>((accept, interrupt): void => {
            let count: bigint = 0n;
            let stop: boolean = false;
            this.generator((element: E, index: bigint): void => {
                let result: Semantic<R> | Iterable<R> = mapper(element);
                if (isIterable(result)) {
                    let subIndex: bigint = 0n;
                    for (let subElement of result) {
                        accept(subElement, count + subIndex);
                        stop = stop || interrupt(subElement);
                        subIndex++;
                    }
                    count += subIndex;
                } else if (isFunction(Reflect.get(result, "generator"))) {
                    let generator: Generator<R> = Reflect.get(result, "generator");
                    generator((subElement: R, subIndex: bigint): void => {
                        accept(subElement, count + subIndex);
                        stop = stop || interrupt(subElement);
                        count += subIndex;
                    }, interrupt);
                }
            }, (element: E): boolean => stop);
        });
    }

    limit(n: bigint): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            let count: bigint = 0n;
            this.generator((element: E, index: bigint): void => {
                if (count < n) {
                    accept(element, index);
                    count++;
                }
            }, (element: E): boolean => count >= n);
        });
    }

    map<R>(mapper: Functional<E, R>): Semantic<R> {
        return new Semantic<R>((accept, interrupt): void => {
            let stop: boolean = false;
            this.generator((element: E, index: bigint): void => {
                let resolved: R = mapper(element);
                accept(resolved, index);
                stop = stop || interrupt(resolved);
            }, (element: E): boolean => stop);
        });
    }

    peek(consumer: BiConsumer<E, bigint>): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            let count: bigint = 0n;
            this.generator((element: E, index: bigint): void => {
                accept(element, index);
                consumer(element, index);
            }, interrupt);
        });
    }

    redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            this.generator((element: E, index: bigint): void => {
                accept(element, redirector(element, index));
            }, interrupt);
        });
    }

    reverse(): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            this.generator((element: E, index: bigint): void => {
                accept(element, -index);
            }, interrupt);
        });
    }

    shuffle(): Semantic<E>;
    shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>;
    shuffle(...args: any[]): Semantic<E> {
        let map: Map<number, Supplier<Semantic<E>>> = new Map<number, Supplier<Semantic<E>>>();
        map.set(0, (): Semantic<E> => {
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, BigInt(Math.ceil(Number(index) * Math.random())));
                }, interrupt)
            });
        });
        map.set(1, (): Semantic<E> => {
            let mapper: BiFunctional<E, bigint, bigint> = args[0];
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, mapper(element, index));
                }, interrupt);
            });
        });
        let handler = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments.");
    }

    skip(n: bigint): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            let count: bigint = 0n;
            this.generator((element: E, index: bigint): void => {
                if (count < n) {
                    count++;
                } else {
                    accept(element, index);
                }
            }, interrupt);
        });
    }

    sorted(): OrderedCollectable<E>;
    sorted(comparator: Comparator<E>): OrderedCollectable<E>;
    sorted(...args: any[]): OrderedCollectable<E> {
        let array: Array<{ index: bigint, element: E }> = [];
        this.generator((element: E, index: bigint): void => {
            array.push({
                index: index,
                element: element
            })
        }, (element: E): boolean => false);
        array = array.sort((a, b) => {
            return Number(a.index - b.index);
        });
        return new OrderedCollectable<E>((accept, interrupt): void => {
            for (let i = 0n; i < array.length; i++) {
                let item: { index: bigint, element: E } = array[Number(i)];
                accept(item.element, item.index);
                if (interrupt(item.element)) {
                    break;
                }
            }
        });
    }

    sub(start: bigint, end: bigint): Semantic<E> {
        return new Semantic<E>((accept, interrupt): void => {
            let count: bigint = 0n;
            this.generator((element: E, index: bigint): void => {
                if (count < end) {
                    count++;
                    if (count >= start) {
                        accept(element, index);
                    }
                }

            }, interrupt);
        });
    }

    takeWhile(predicate: Predicate<E>): Semantic<E> {
        return new Semantic<E>((accept, interrupt) => {
            this.generator((element: E, index: bigint) => {
                if (!predicate(element)) {
                    interrupt(element);
                    return;
                }
                accept(element, index);
            }, interrupt);
        });
    }

    toOrdered(): OrderedCollectable<E> {
        return new OrderedCollectable(this.generator);
    }

    toStatistics(): Statistics<E, number>;
    toStatistics<D>(mapper?: Functional<E, D>): Statistics<E, D>;
    toStatistics(...args: any[]): Statistics<E, any> {
        let map: Map<number, Supplier<Statistics<E, any>>> = new Map<number, Supplier<Statistics<E, any>>>();
        map.set(0, (): Statistics<E, number> => {
            return new Statistics<E, number>(this.generator);
        });
        map.set(1, (): Statistics<E, number> => {
            return new Statistics<E, number>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index);
                }, interrupt);
            });
        });
        let handler: MaybeInvalid<Supplier<Statistics<E, any>>> = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments.");
    }

    toUnoredered(): UnorderedCollectable<E> {
        return new UnorderedCollectable(this.generator);
    }

    toWindow(): WindowCollectable<E> {
        return new WindowCollectable(this.generator);
    }

    translate(offset: bigint): Semantic<E>;
    translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>;
    translate(...args: any[]): Semantic<E> {
        let parameter: bigint | BiFunctional<E, bigint, bigint> = args[0];
        if (isBigint(parameter)) {
            let offset: bigint = parameter;
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index + offset);
                }, interrupt);
            });
        } else if (isFunction(parameter)) {
            let translator: BiFunctional<E, bigint, bigint> = parameter;
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index + translator(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
}
 class Collector<E, A, R>{
    protected identity: Supplier<A>;
    protected interruptor: Predicate<E>;
    protected accumulator: BiFunctional<A, E, A>;
    protected finisher: Functional<A, R>;
    constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interruptor = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        } else {
            throw new TypeError("Invalid arguments");
        }
    }
    static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, combiner: BiFunctional<A, A, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector(identity, () => false, accumulator, finisher);
    }
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, combiner: BiFunctional<A, A, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector<E, A, R>(identity, interruptor, accumulator, finisher);
    }
}
interface Collect<E, A, R> {
    (identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    (identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    (collector: Collector<E, A, R>): R;
};
 class Collectable<E>{

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>) {
        if (isFunction(generator)) {
            this.generator = generator;
        } else {
            throw new TypeError("Invalid arguments");
        }
    }

    anyMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return false;
        }, (element: E): boolean => {
            return predicate(element);
        }, (result: boolean, element: E): boolean => {
            return result || predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    allMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return true;
        }, (element: E): boolean => {
            return !predicate(element);
        }, (result: boolean, element: E): boolean => {
            return result && predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(collector: Collector<E, A, R>): R;
    collect<A, R>(...args: any[]): R {
        let map: Map<number, Supplier<R>> = new Map<number, Supplier<R>>();
        map.set(1, (): R => {
            const collector: Collector<E, A, R> = args[0];
            return this.collect(Reflect.get(collector, "identity"), Reflect.get(collector, "interruptor"), Reflect.get(collector, "accumulator"), Reflect.get(collector, "finisher"));
        });
        map.set(3, (): R => {
            let supplier: Supplier<A> = args[0];
            let accumulator: BiFunctional<A, E, A> = args[1];
            let finisher: Functional<A, R> = args[2];
            let a: A = supplier();
            this.generator((element: E, index: bigint) => {
                a = accumulator(a, element);
            }, (element: E): boolean => false);
            return finisher(a);
        });
        map.set(4, (): R => {
            let supplier: Supplier<A> = args[0];
            let interruptor: Predicate<E> = args[1];
            let accumulator: BiFunctional<A, E, A> = args[2];
            let finisher: Functional<A, R> = args[3];
            let a = supplier();
            this.generator((element: E, index: bigint) => {
                a = accumulator(a, element);
            }, interruptor);
            return finisher(a);
        });
        let handler: MaybeInvalid<Supplier<R>> = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments");
    }

    count(): bigint {
        return this.collect<bigint, bigint>((): bigint => {
            return 0n;
        }, (count: bigint, element: E): bigint => {
            return count + 1n;
        }, (count: bigint): bigint => {
            return count;
        });
    }

    findFirst(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (element): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    findAny(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (element): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() && Math.random() > 0.5 ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    forEach(action: BiConsumer<E, bigint>): void {
        this.collect<bigint, bigint>((): bigint => {
            return 0n;
        }, (count: bigint, element: E): bigint => {
            action(element, count);
            return count + 1n;
        }, (count: bigint): bigint => {
            return count;
        });
    }

    group<K>(classifier: Functional<E, K>): Map<K, Array<E>> {
        return this.collect<Map<K, Array<E>>, Map<K, Array<E>>>((): Map<K, Array<E>> => {
            return new Map<K, Array<E>>();
        }, (map: Map<K, Array<E>>, element: E): Map<K, Array<E>> => {
            const key: K = classifier(element);
            const raw: MaybeInvalid<Array<E>> = map.get(key);
            const array: Array<E> = validate(raw) ? raw : [];
            array.push(element);
            map.set(key, array);
            return map;
        }, (map: Map<K, Array<E>>): Map<K, Array<E>> => {
            return map;
        });
    }

    groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
        return this.collect<Map<K, V>, Map<K, V>>((): Map<K, V> => {
            return new Map<K, V>();
        }, (map: Map<K, V>, element: E): Map<K, V> => {
            let key: K = keyExtractor(element);
            let value: V = valueExtractor(element);
            map.set(key, value);
            return map;
        }, (map: Map<K, V>): Map<K, V> => {
            return map;
        });
    }

    join(): string;
    join(delimiter: string): string;
    join(prefix: string, delimeter: string, suffix: string): string;
    join(...args: any[]): string {
        let map: Map<number, Supplier<string>> = new Map<number, Supplier<string>>();
        map.set(0, () => {
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + (element as any) + ", ";
            }, (text: string): string => {
                return text.substring(0, text.length - 2) + "]";
            });
        });
        map.set(1, (): string => {
            const delimiter: string = args[0];
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + (element as any) + delimiter;
            }, (text: string): string => {
                return text.substring(0, text.length - delimiter.length) + "]";
            });
        });
        map.set(3, (): string => {
            const prefix: string = args[0];
            const delimiter: string = args[1];
            const suffix: string = args[2];
            return this.collect<string, string>((): string => {
                return prefix;
            }, (text: string, element: E): string => {
                return text + (element as any) + delimiter;
            }, (text: string): string => {
                return text.substring(0, text.length - delimiter.length) + suffix;
            });
        })
        let handler: MaybeInvalid<Supplier<string>> = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments");
    }

    log(): void;
    log(accumulator: BiConsumer<string, E>): void;
    log(prefix: string, accumulator: BiConsumer<string, E>, suffix: string): void
    log(...args: any[]): void {
        let map: Map<number, Runnable> = new Map<number, Runnable>();
        map.set(0, (): void => {
            console.log(this.join());
        });
        map.set(1, (): void => {
            console.log(this.join(args[0]))
        });
        map.set(3, (): void => {
            console.log(this.join(args[0], args[1], args[2]));
        });
        let handler: MaybeInvalid<Runnable> = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments");
    }

    nonMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return true;
        }, (element: E): boolean => {
            return predicate(element);
        }, (result: boolean, element: E) => {
            return predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    partition(count: bigint): Array<Array<E>> {
        let limited = count > 1n ? count : 1n;
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            const index: bigint = limited % BigInt(array.length);
            if (index === 0n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    partitionBy(classifier: Functional<E, bigint>): Array<Array<E>> {
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            let index: bigint = classifier(element);
            while (index > BigInt(array.length) - 1n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, combiner: BiFunctional<R, R, R>): R;
    reduce<R>(...args: any[]): R {
        let map: Map<number, Supplier<R>> = new Map<number, Supplier<R>>();
        map.set(1, (): R => {
            const accumulator: BiFunctional<E, E, E> = args[0];

            return this.collect<Optional<E>, Optional<E>>(
                (): Optional<E> => Optional.ofNullable<E>(),
                (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        const current: E = result.get();
                        return Optional.of(accumulator(current, element));
                    }
                },
                (result: Optional<E>): Optional<E> => result
            ) as unknown as R;
        });
        map.set(2, (): R => {
            const identity: E = args[0];
            const accumulator: BiFunctional<E, E, E> = args[1];

            let result: E = identity;
            let hasElements: boolean = false;

            this.generator((element: E, index: bigint) => {
                if (!hasElements) {
                    result = element;
                    hasElements = true;
                } else {
                    result = accumulator(result, element);
                }
            }, (element: E): boolean => false);
            if (!hasElements) {
                return identity as unknown as R;
            }

            return result as unknown as R;
        });
        map.set(3, (): R => {
            const identity: R = args[0];
            const accumulator: BiFunctional<R, E, R> = args[1];
            let result: R = identity;
            let hasElements: boolean = false;

            this.generator((element: E, index: bigint) => {
                if (!hasElements) {
                    result = accumulator(result, element);
                    hasElements = true;
                } else {
                    result = accumulator(result, element);
                }
            }, (element: E): boolean => false);

            return result;
        });

        let handler: MaybeInvalid<Supplier<R>> = map.get(args.length);
        if (handler) {
            return handler();
        }
        throw new TypeError("Invalid arguments for reduce");
    }

    semantic(): Semantic<E> {
        return new Semantic<E>(this.generator);
    }

    toArray(): Array<E> {
        return this.collect<Array<E>, Array<E>>((): Array<E> => {
            return [];
        }, (array: Array<E>, element: E): Array<E> => {
            array.push(element);
            return array;
        }, (result: Array<E>): Array<E> => {
            return result;
        });
    }

    toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
        return this.collect<Map<K, V>, Map<K, V>>((): Map<K, V> => {
            return new Map<K, V>();
        }, (map: Map<K, V>, element: E): Map<K, V> => {
            const key: K = keyExtractor(element);
            const value: V = valueExtractor(element);
            map.set(key, value);
            return map;
        }, (map: Map<K, V>): Map<K, V> => {
            return map;
        });
    }

    toSet(): Set<E> {
        return this.collect<Set<E>, Set<E>>((): Set<E> => {
            return new Set<E>();
        }, (set: Set<E>, element: E): Set<E> => {
            set.add(element);
            return set;
        }, (result: Set<E>): Set<E> => {
            return result;
        });
    }
}
 class UnorderedCollectable<E> extends Collectable<E>{

    public constructor(generator: Generator<E>) {
        super(generator);
    }
}
 class OrderedCollectable<E> extends Collectable<E>{

    protected source: Array<{ index: bigint, element: E }>;

    constructor(generator: Generator<E>) {
        super(generator);
        let source: Array<{ index: bigint, element: E }> = [];
        generator((element: E, index: bigint) => {
            source.push({
                index: index,
                element: element
            });
        }, (element: E) => false);
        this.source = source.sort((a, b) => Number(a.index - b.index));
    }


}

 class WindowCollectable<E> extends OrderedCollectable<E>{ }

class Statistics<E, D> extends OrderedCollectable<E> {

    private frequencyCache: Map<D, bigint> = new Map();

    constructor(generator: Generator<E>) {
        super(generator);
    }

    count(): bigint {
        return super.count();
    }

    maximum(comparator: Comparator<E>): Optional<E> {
        return Optional.ofNullable();
    }

    minimum(comparator: Comparator<E>): Optional<E> {
        return Optional.ofNullable();
    }

    range(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    variance(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    standardDeviation(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    mean(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    median(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    mode(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    frequency(mapper: Functional<E, D>): Map<D, bigint> {
        return new Map();
    }

    sum(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    quartiles(mapper: Functional<E, D>): D[] {
        return [];
    }

    interquartileRange(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    skewness(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    kurtosis(mapper: Functional<E, D>): D {
        return 0 as D;
    }

    isEmpty(): boolean {
        return true;
    }

    clear(): void { }
}
