export type Invalid<T> = T extends null | undefined ? T : never;
export type Valid<T> = T extends null | undefined ? never : T;
export type MaybeInvalid<T> = T | null | undefined;

export let validate: <T>(t: MaybeInvalid<T>) => t is T = <T>(t: T | null | undefined): t is T => {
    return t !== null && t !== (void 0);
};

export let invalidate: <T>(t: MaybeInvalid<T>) => t is (null | undefined) = <T>(t: T | null | undefined): t is (null | undefined) => {
    return t === null || t === undefined;
};

export let isBoolean: (t: unknown) => t is boolean = (t: unknown): t is boolean => {
    return typeof t === "boolean";
};
export let isString: (t: unknown) => t is string = (t: unknown): t is string => {
    return typeof t === "string";
};
export let isNumber: (t: unknown) => t is number = (t: unknown): t is number => {
    return typeof t === "number";
};
export let isFunction: (t: unknown) => t is Function = (t: unknown): t is Function => {
    return typeof t === "function";
};
export let isObject: (t: unknown) => t is object = (t: unknown): t is object => {
    return typeof t === "object" && t !== null;
};
export let isSymbol: (t: unknown) => t is symbol = (t: unknown): t is symbol => {
    return typeof t === "symbol";
};
export let isBigint: (t: unknown) => t is bigint = (t: unknown): t is bigint => {
    return typeof t === "bigint";
};
export let isIterable: (t: unknown) => t is Iterable<unknown> = (t: unknown): t is Iterable<unknown> => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.iterator));
    }
    return false;
};

export let useCompare: <T>(t1: T, t2: T) => number = <T>(t1: T, t2: T): number => {
    if (typeof t1 === typeof t2) {
        switch (typeof t1) {
            case "string":
                return t1.localeCompare(t2 as string);
            case "number":
                return t1 - (t2 as number);
            case "bigint":
                return Number(t1 - (t2 as bigint));
            case "boolean":
                return t1 ? 1 : -1;
            case "symbol":
                return t1.toString().localeCompare((t2 as symbol).toString());
            case "function":
                throw new TypeError("Cannot compare functions.");
            case "undefined":
                return 0;
            case "object":
                let a = Object.prototype.valueOf.call(t1);
                let b = Object.prototype.valueOf.call(t2);
                if (a === b) {
                    return 0;
                }
                if (a < b) {
                    return -1;
                }
                return 1;
            default:
                throw new TypeError("Invalid type.");
        }
    }
    throw new TypeError("Cannot compare values of different types.");
};
export let useRandom: <T = number | bigint>(index: T) => T = <T = number | bigint>(index: T): T => {
    if (isNumber(index)) {
        let x = Number(index);
        let phi = (1 + Math.sqrt(5)) / 2;
        let vanDerCorput = (base: number, n: number) => {
            let result = 0;
            let f = 1 / base;
            let i = n;
            while (i > 0) {
                result += (i % base) * f;
                i = Math.floor(i / base);
                f = f / base;
            }
            return result;
        };
        let h = vanDerCorput(2, x) + vanDerCorput(3, x);
        let golden = (x * phi) % 1;
        let lcg = (1103515245 * x + 12345) % 2147483648;
        let mixed = (h * 0.5 + golden * 0.3 + lcg / 2147483648 * 0.2);
        return (mixed * 1000000) as unknown as T;
    }
    if (isBigint(index)) {
        let x = BigInt(index);
        let two = 2n;
        let three = 3n;
        let scale = 1000000n;
        let vanDerCorput = (base: bigint, n: bigint): bigint => {
            let result = 0n;
            let f = 1n;
            let i = n;
            let basePower = 1n;
            while (i > 0n) {
                result += (i % base) * f;
                i = i / base;
                f = f * scale / basePower;
                basePower = basePower * base;
            }
            return result;
        };
        let h1 = vanDerCorput(two, x);
        let h2 = vanDerCorput(three, x);
        let combined = (h1 + h2) % (scale * 10n);
        let random = (combined * 123456789n) % scale;
        return random as unknown as T;
    }
    throw new TypeError("Invalid input type");
};

export let OptionalSymbol = Symbol.for("Optional");
export let SemanticSymbol = Symbol.for("Semantic");
export let CollectorsSymbol = Symbol.for("Collector");
export let CollectableSymbol = Symbol.for("Collectable");
export let OrderedCollectableSymbol = Symbol.for("OrderedCollectable");
export let UnorderedCollectableSymbol = Symbol.for("UnorderedCollectable");
export let StatisticsSymbol = Symbol.for("Statistics");

export let isOptional: (t: unknown) => t is Optional<unknown> = (t: unknown): t is Optional<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Optional") === OptionalSymbol;
    }
    return false;
};
export let isSemantic: (t: unknown) => t is Semantic<unknown> = (t: unknown): t is Semantic<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Semantic") === SemanticSymbol;
    }
    return false;
};
export let isCollector: (t: unknown) => t is Collector<unknown, unknown, unknown> = (t: unknown): t is Collector<unknown, unknown, unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Collector") === CollectorsSymbol;
    }
    return false;
};
export let isCollectable: (t: unknown) => t is Collectable<unknown> = (t: unknown): t is Collectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Collectable") === CollectableSymbol;
    }
    return false;
};
export let isOrderedCollectable: (t: unknown) => t is OrderedCollectable<unknown> = (t: unknown): t is OrderedCollectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "OrderedCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isUnorderedCollectable: (t: unknown) => t is UnorderedCollectable<unknown> = (t: unknown): t is UnorderedCollectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "UnorderedCollectable") === UnorderedCollectableSymbol;
    }
    return false;
};
export let isStatistics: (t: unknown) => t is Statistics<unknown, number | bigint> = (t: unknown): t is Statistics<unknown, number | bigint> => {
    if (isObject(t)) {
        return Reflect.get(t, "Statistics") === StatisticsSymbol;
    }
    return false;
};

export interface Runnable {
    (): void;
};
export interface Supplier<R> {
    (): R;
}
export interface Functional<T, R> {
    (t: T): R;
};
export interface Predicate<T> {
    (t: T): boolean;
};
export interface BiFunctional<T, U, R> {
    (t: T, u: U): R;
};
export interface BiPredicate<T, U> {
    (t: T, u: U): boolean;
};
export interface Comparator<T> {
    (t1: T, t2: T): number;
}
export interface TriFunctional<T, U, V, R> {
    (t: T, u: U, v: V): R;
};
export interface Consumer<T> {
    (t: T): void;
};
export interface BiConsumer<T, U> {
    (t: T, u: U): void;
};
export interface TriConsumer<T, U, V> {
    (t: T, u: U, v: V): void;
};

export interface Generator<T> {
    (accept: BiConsumer<T, bigint>, interrupt: Predicate<T>): void;
};


class Optional<T> {

    protected value: MaybeInvalid<T>;

    protected readonly Optional: Symbol = OptionalSymbol;

    protected constructor(value: MaybeInvalid<T>) {
        this.value = value;
    }

    filter(predicate: Predicate<T>): Optional<T> {
        if (this.isPresent() && predicate(this.value as T)) {
            return new Optional<T>(this.value as T);
        }
        return new Optional<T>((void 0));
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

    ifPresent(action: Consumer<T>): void {
        if (this.isPresent()) {
            action(this.value as T);
        }
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
};

export let empty = <E>(): Semantic<E> => {
    return new Semantic<E>(() => { });
}

export let fill = <E>(element: E | Supplier<E>, count: bigint): Semantic<E> => {
    if (validate(element) && count > 0n) {
        return new Semantic<E>((accept, interrupt) => {
            for (let i = 0n; i < count; i++) {
                let item: E = isFunction(element) ? element() : element;
                if (interrupt(item)) {
                    break;
                }
                accept(item, i);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
}

export let from = <E>(iterable: Iterable<E>): Semantic<E> => {
    if (isIterable(iterable)) {
        return new Semantic<E>((accept, interrupt) => {
            let index: bigint = 0n;
            for (let element of iterable) {
                if (interrupt(element)) {
                    break;
                }
                accept(element, index);
                index++;
            }
        });
    }
    throw new TypeError("Invalid arguments");
}

export let range: <N extends number | bigint>(start: N, end: N, step: N) => Semantic<N> = <N extends number | bigint>(start: N, end: N, step: N = (typeof start === 'bigint' ? 1n : 1) as N): Semantic<N> => {
    if ((isNumber(step) && step === 0) || (isBigint(step) && step === 0n)) {
        throw new TypeError("Step cannot be zero.");
    }
    if (isNumber(start) && isNumber(end) && isNumber(step)) {
        let minimum: number = start, maximum: number = end, limit: number = step;
        let condition: Predicate<number> = limit > 0 ? (i: number) => i < maximum : (i: number) => i > maximum;
        return new Semantic<N>((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value: N = i as N;
                if (interrupt(value)) {
                    break;
                }
                accept(value, BigInt(i));
            }
        }) as Semantic<N>;
    } else if (isBigint(start) && isBigint(end) && isBigint(step)) {
        let minimum: bigint = start, maximum: bigint = end, limit: bigint = step;
        let condition: Predicate<bigint> = limit > 0n ? (i: bigint) => i < maximum : (i: bigint) => i > maximum;
        return new Semantic<N>((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value: N = i as N;
                if (interrupt(value)) {
                    break;
                }
                accept(value, i);
            }
        }) as Semantic<N>;
    }
    throw new TypeError("Invalid arguments.");
};

export function iterate<E>(generator: Generator<E>): Semantic<E> {
    return new Semantic(generator);
}

export class Semantic<E> {

    protected generator: Generator<E>;

    protected readonly Semantic: Symbol = SemanticSymbol;

    constructor(generator: Generator<E>) {
        this.generator = generator;
    }

    concat(other: Semantic<E>): Semantic<E>;
    concat(other: Iterable<E>): Semantic<E>;
    concat(other: Semantic<E> | Iterable<E>): Semantic<E> {
        if (isSemantic(other)) {
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
        if (isIterable(other)) {
            return new Semantic<E>((accept, interrupt) => {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint) => {
                    accept(element, index);
                    count++;
                }, interrupt);
                for (let element of other) {
                    accept(element, count);
                    count++;
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    distinct(): Semantic<E>;
    distinct(comparator: Comparator<E>): Semantic<E>;
    distinct(comparator?: Comparator<E>): Semantic<E> {
        if (validate(comparator)) {
            return new Semantic<E>((accept, interrupt) => {
                let array: Array<E> = [];
                this.generator((element: E, index: bigint) => {
                    if (!array.some((e: E) => comparator(e, element))) {
                        array.push(element);
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        return new Semantic<E>((accept, interrupt) => {
            let set: Set<E> = new Set<E>();
            this.generator((element: E, index: bigint) => {
                if (!set.has(element)) {
                    set.add(element);
                    accept(element, index);
                }
            }, interrupt);
        });
    }

    dropWhile(predicate: Predicate<E>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept, interrupt): void => {
                let dropping: boolean = true;
                this.generator((element: E, index: bigint): void => {
                    if (dropping) {
                        if (!predicate(element)) {
                            dropping = false;
                            accept(element, index);
                        }
                        return;
                    }
                    accept(element, index);
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    filter(predicate: Predicate<E>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    if (predicate(element)) {
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    flat(mapper: Functional<E, Iterable<E> | Semantic<E>>): Semantic<E> {
        if (isFunction(mapper)) {
            return new Semantic<E>((accept, interrupt): void => {
                let count: bigint = 0n;
                let stop: boolean = false;
                this.generator((element: E, index: bigint): void => {
                    let result: Semantic<E> | Iterable<E> = mapper(element);
                    if (isIterable(result)) {
                        let subIndex: bigint = 0n;
                        for (let subElement of result) {
                            accept(subElement, count + subIndex + index);
                            stop = stop || interrupt(subElement);
                            count++;
                        }
                    } else if (isSemantic(result)) {
                        result.generator((subElement: E, subIndex: bigint): void => {
                            accept(subElement, count + subIndex + index);
                            stop = stop || interrupt(subElement);
                            count++;
                        }, (element: E): boolean => interrupt(element) || stop);
                    }
                }, (element: E): boolean => interrupt(element) || stop);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    flatMap<R>(mapper: Functional<E, Iterable<R> | Semantic<R>>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept, interrupt): void => {
                let count: bigint = 0n;
                let stop: boolean = false;
                this.generator((element: E): void => {
                    let result: Semantic<R> | Iterable<R> = mapper(element);
                    if (isIterable(result)) {
                        for (let subElement of result) {
                            accept(subElement, count);
                            stop = stop || interrupt(subElement);
                            count++;
                        }
                    } else if (isSemantic(result)) {
                        result.generator((subElement: R): void => {
                            accept(subElement, count);
                            stop = stop || interrupt(subElement);
                            count++;
                        }, (element: R): boolean => interrupt(element) || stop);
                    }
                }, (): boolean => stop);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    limit(n: number): Semantic<E>;
    limit(n: bigint): Semantic<E>;
    limit(n: bigint | number): Semantic<E> {
        if (isNumber(n)) {
            let limit: bigint = BigInt(n);
            return new Semantic<E>((accept, interrupt): void => {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint): void => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element: E): boolean => interrupt(element) || count >= limit);
            });
        }
        if (isBigint(n)) {
            let limit: bigint = n;
            return new Semantic<E>((accept, interrupt): void => {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint): void => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element: E): boolean => interrupt(element) || count >= limit);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    map<R>(mapper: Functional<E, R>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept, interrupt): void => {
                let stop: boolean = false;
                this.generator((element: E, index: bigint): void => {
                    let resolved: R = mapper(element);
                    accept(resolved, index);
                    stop = stop || interrupt(resolved);
                }, (): boolean => stop);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    peek(consumer: BiConsumer<E, bigint>): Semantic<E> {
        if (isFunction(consumer)) {
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index);
                    consumer(element, index);
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(redirector)) {
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, redirector(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
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
    shuffle(mapper?: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(mapper)) {
            return new Semantic<E>((accept, interrupt): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, mapper(element, index));
                }, interrupt);
            });
        }
        return new Semantic<E>((accept, interrupt): void => {
            this.generator((element: E, index: bigint): void => {
                accept(element, useRandom(index));
            }, interrupt);
        });
    }

    skip(n: number): Semantic<E>;
    skip(n: bigint): Semantic<E>;
    skip(n: number | bigint): Semantic<E> {
        if (isNumber(n)) {
            return new Semantic<E>((accept, interrupt): void => {
                let count: bigint = 0n;
                let limit: bigint = BigInt(n);
                this.generator((element: E, index: bigint): void => {
                    if (count < limit) {
                        count++;
                    } else {
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        if (isBigint(n)) {
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
        throw new TypeError("Invalid arguments.");
    }

    sorted(): OrderedCollectable<E>;
    sorted(comparator: Comparator<E>): OrderedCollectable<E>;
    sorted(comparator?: Comparator<E>): OrderedCollectable<E> {
        if (isFunction(comparator)) {
            return new OrderedCollectable<E>(this.generator, comparator);
        }
        return new OrderedCollectable<E>(this.generator);
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

    public toNumericStatistics(): Statistics<E, number>{
        return new NumericStatistics(this.generator);
    }
    public toBigintStatistics(): Statistics<E, bigint>{
        return new BigIntStatistics(this.generator);
    }

    public toUnoredered(): UnorderedCollectable<E> {
        return new UnorderedCollectable(this.generator);
    }

    public toWindow(): WindowCollectable<E> {
        return new WindowCollectable(this.generator);
    }

    public translate(offset: bigint): Semantic<E>;
    public translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>;
    public translate(...args: any[]): Semantic<E> {
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
};


export class Collector<E, A, R> {

    protected identity: Supplier<A>;

    protected interruptor: Predicate<E>;

    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;

    protected finisher: Functional<A, R>;

    protected readonly Collector: symbol = CollectableSymbol;

    public constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    public constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    public constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interruptor = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        } else {
            throw new TypeError("Invalid arguments");
        }
    }

    public collect(generator: Generator<E>): R;
    public collect(iterable: Iterable<E>): R;
    public collect(parameter: Generator<E> | Iterable<E>): R {
        let accumulator: A = this.identity();
        let count: bigint = 0n;
        if (isFunction(parameter)) {
            parameter((element: E, index: bigint): void => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, this.interruptor);
        } else if (isIterable(parameter)) {
            let iterable: Iterable<E> = parameter;
            for (let element of iterable) {
                accumulator = this.accumulator(accumulator, element, count);
                count++;
            }
        }
        return this.finisher(accumulator);
    }

    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector(identity, () => false, accumulator, finisher);
    }

    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector<E, A, R>(identity, interruptor, accumulator, finisher);
    }
};

export abstract class Collectable<E> {

    public constructor() {

    }

    public anyMatch(predicate: Predicate<E>): boolean {
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

    public allMatch(predicate: Predicate<E>): boolean {
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

    public collect<A, R>(collector: Collector<E, A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identityOrCollector: Supplier<A> | Collector<E, A, R>, accumulatorOrInterruptor?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Predicate<E>, accumulatorOrFinisher?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Functional<A, R>, finisher?: Functional<A, R>): R {
        let source: Generator<E> | Iterable<E> = this.source();
        if (isFunction(source) || isIterable(source)) {
            if (isCollector(identityOrCollector)) {
                return (identityOrCollector as Collector<E, A, R>).collect(source as Generator<E>);
            }
            if (isFunction(identityOrCollector) && isFunction(accumulatorOrInterruptor) && isFunction(accumulatorOrFinisher)) {
                if (isFunction(finisher)) {
                    return Collector.shortable(identityOrCollector as Supplier<A>, accumulatorOrInterruptor as Predicate<E>, accumulatorOrFinisher as unknown as TriFunctional<A, E, bigint, A>, finisher as Functional<A, R>).collect(this.source);
                }
                return Collector.full(identityOrCollector as Supplier<A>, accumulatorOrInterruptor as TriFunctional<A, E, bigint, A>, accumulatorOrFinisher as Functional<A, R>).collect(source as Generator<E>);
            }
        }
        throw new TypeError("Invalid arguments.");
    }

    public count(): bigint {
        return this.collect<bigint, bigint>((): bigint => {
            return 0n;
        }, (count: bigint): bigint => {
            return count + 1n;
        }, (count: bigint): bigint => {
            return count;
        });
    }

    public isEmpty(): boolean {
        return this.count() === 0n;
    }

    public findAny(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() && Math.random() > 0.5 ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public findFirst(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public findLast(): Optional<E> {
        return this.collect<Optional<E>, Optional<E>>(
            (): Optional<E> => {
                return Optional.ofNullable<E>();
            }, (): boolean => {
                return true;
            }, (result: Optional<E>, element: E): Optional<E> => {
                return result.isPresent() ? result : Optional.of(element);
            }, (result: Optional<E>): Optional<E> => {
                return result;
            });
    }

    public forEach(action: BiConsumer<E, bigint>): void {
        if (isFunction(action)) {
            this.collect<bigint, bigint>((): bigint => {
                return 0n;
            }, (count: bigint, element: E): bigint => {
                action(element, count);
                return count + 1n;
            }, (count: bigint): bigint => {
                return count;
            });
        }
    }

    public group<K>(classifier: Functional<E, K>): Map<K, Array<E>> {
        if (isFunction(classifier)) {
            return this.collect<Map<K, Array<E>>, Map<K, Array<E>>>((): Map<K, Array<E>> => {
                return new Map<K, Array<E>>();
            }, (map: Map<K, Array<E>>, element: E): Map<K, Array<E>> => {
                let key: K = classifier(element);
                let raw: MaybeInvalid<Array<E>> = map.get(key);
                let array: Array<E> = validate(raw) ? raw : [];
                array.push(element);
                map.set(key, array);
                return map;
            }, (map: Map<K, Array<E>>): Map<K, Array<E>> => {
                return map;
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
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

    public join(): string;
    public join(delimiter: string): string;
    public join(prefix: string, delimiter: string, suffix: string): string;
    public join(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): string;
    public join(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string;
    public join(argument1?: string, argument2?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): string {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + element + ",";
            }, (text: string): string => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let delimiter: string = argument1;
            return this.collect<string, string>((): string => {
                return "[";
            }, (text: string, element: E): string => {
                return text + element + delimiter;
            }, (text: string): string => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>;
            let suffix: string = argument3;
            return this.collect<string, string>((): string => {
                return prefix;
            }, (text: string, element: E, index: bigint): string => {
                return text + accumulator(text, element, index);
            }, (text: string): string => {
                return text + suffix;
            });
        }
        if (isString(argument1) && isString(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let delimiter: string = argument2;
            let suffix: string = argument3;
            return this.collect<string, string>((): string => {
                return prefix;
            }, (text: string, element: E): string => {
                return text + element + delimiter;
            }, (text: string): string => {
                return text + suffix;
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public log(): void;
    public log(accumulator: BiFunctional<string, E, string>): void;
    public log(accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>): void;
    public log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public log(argument1?: string | BiConsumer<string, E> | TriConsumer<string, E, bigint>, argument2?: BiConsumer<string, E> | TriConsumer<string, E, bigint>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let text: string = this.join();
            console.log(text);
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>;
            let text: string = this.join("[", accumulator, "]");
            console.log(text);
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public nonMatch(predicate: Predicate<E>): boolean {
        return this.collect<boolean, boolean>((): boolean => {
            return true;
        }, (element: E): boolean => {
            return predicate(element);
        }, (result: boolean, element: E) => {
            return result || predicate(element);
        }, (result: boolean): boolean => {
            return result;
        });
    }

    public partition(count: bigint): Array<Array<E>> {
        let limited = count > 1n ? count : 1n;
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            let index: bigint = limited % BigInt(array.length);
            if (index === 0n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    public partitionBy(classifier: Functional<E, bigint>): Array<Array<E>> {
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

    public reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    public reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    public reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    public reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    public reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: BiFunctional<R, R, R>): R;
    public reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: BiFunctional<R, R, R>): R;
    reduce<R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: BiFunctional<R, R, R>): R | E | Optional<E> {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
            return this.collect<Optional<E>, Optional<E>>((): Optional<E> => Optional.ofNullable<E>(),
                (result: Optional<E>, element: E, index: bigint): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        return Optional.of(accumulator(current, element, index));
                    }
                },
                (result: Optional<E>): Optional<E> => result
            );
        } else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            let identity = argument1 as E;
            let accumulator = argument2 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
            return this.collect<E, E>(() => identity,
                (result: E, element: E, index: bigint): E => {
                    return accumulator(result, element, index);
                },
                (result: E): E => result
            );
        } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1 as R;
            let accumulator = argument2 as BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>;
            let finisher = argument3 as BiFunctional<R, R, R>;
            return this.collect<R, R>(() => identity,
                (result: R, element: E, index: bigint): R => {
                    return accumulator(result, element, index);
                },
                (result: R): R => finisher(result, result)
            );
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public semantic(): Semantic<E> {
        let source: Generator<E> | Iterable<E> = this.source();
        if (isIterable(source)) {
            return from(source);
        } else if (isFunction(source)) {
            return new Semantic(source);
        } else {
            throw new TypeError("Invalid source.");
        }
    }

    protected abstract source(): Generator<E> | Iterable<E>;

    public toArray(): Array<E> {
        return this.collect<Array<E>, Array<E>>((): Array<E> => {
            return [];
        }, (array: Array<E>, element: E): Array<E> => {
            array.push(element);
            return array;
        }, (result: Array<E>): Array<E> => {
            return result;
        });
    }

    public toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
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

    public toSet(): Set<E> {
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

export class UnorderedCollectable<E> extends Collectable<E> {

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>) {
        super();
        this.generator = generator;
    }

    public source(): Generator<E> {
        return this.generator;
    }
}

type Indexed<K, V> = {
    index: K;
    value: V;
}
export class OrderedCollectable<E> extends Collectable<E> {

    protected ordered: Array<Indexed<bigint, E>> = [];

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(argument1: Iterable<E> | Generator<E>, argument2?: Comparator<E>) {
        super();
        if (isIterable(argument1)) {
            let iterable: Iterable<E> = argument1;
            let index: bigint = 0n;
            for (let element of iterable) {
                this.ordered.push({ index: index, value: element });
                index++;
            }
        } else if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            generator((element: E, index: bigint): void => {
                this.ordered.push({ index: index, value: element });
            }, (): boolean => false);

        } else {
            throw new TypeError("Invalid arguments.");
        }
        if (isFunction(argument2)) {
            let comparator: Comparator<E> = argument2;
            this.ordered = this.ordered.sort((a, b) => comparator(a.value, b.value)).map((indexed: Indexed<bigint, E>, index: number) => {
                return {
                    index: BigInt(index),
                    value: indexed.value
                };
            });
        } else {
            this.ordered = this.ordered.sort((a: Indexed<bigint, E>, b: Indexed<bigint, E>): number => {
                return useCompare(a.value, b.value);
            }).map((indexed: Indexed<bigint, E>, index: number) => {
                return {
                    index: BigInt(index),
                    value: indexed.value
                };
            });
        }
    }

    public override source(): Generator<E> | Iterable<E> {
        this.ordered.forEach((indexed: Indexed<bigint, E>) => {
            console.log(indexed.index, indexed.value);
        });
        return this.ordered.map((indexed: Indexed<bigint, E>) => indexed.value);
    }
}

export class WindowCollectable<E> extends OrderedCollectable<E> {

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            let source: Array<E> = this.toArray();
            let windows: Array<Array<E>> = [];
            let windowStartIndex: bigint = 0n;
            while (windowStartIndex < BigInt(source.length)) {
                let windowEnd = windowStartIndex + size;
                let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                if (window.length > 0) {
                    windows.push(window);
                }
                windowStartIndex += step;
            }
            return from(windows).map((window: Array<E>) => from(window));
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        return this.slide(size, size);
    }
};

export abstract class Statistics<E, D extends number | bigint> extends OrderedCollectable<E> {

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public count(): bigint {
        return BigInt(this.ordered.length);
    }

    public maximum(): Optional<E>;
    public maximum(comparator: Comparator<E>): Optional<E>;
    public maximum(argument1?: Comparator<E>): Optional<E> {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (useCompare(current, element) > 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            } else {
                return Optional.ofNullable<E>();
            }
        } else {
            let comparator: Comparator<E> = argument1;
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (comparator(current, element) > 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            }
        }
        return Optional.ofNullable<E>();
    }

    public minimum(): Optional<E>;
    public minimum(comparator: Comparator<E>): Optional<E>;
    public minimum(argument1?: Comparator<E>): Optional<E> {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (useCompare(current, element) < 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            } else {
                return Optional.ofNullable<E>();
            }
        } else {
            let comparator: Comparator<E> = argument1;
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (comparator(current, element) < 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            }
            return Optional.ofNullable<E>();
        }
    }

    public abstract range(): D;
    public abstract range(mapper: Functional<E, D>): D;

    public abstract variance(): D;
    public abstract variance(mapper: Functional<E, D>): D;

    public abstract standardDeviation(): D;
    public abstract standardDeviation(mapper: Functional<E, D>): D;

    public abstract mean(): D;
    public abstract mean(mapper: Functional<E, D>): D;

    public abstract median(): D;
    public abstract median(mapper: Functional<E, D>): D;

    public abstract mode(): D;
    public abstract mode(mapper: Functional<E, D>): D;

    public abstract frequency(): Map<D, bigint>;
    public abstract frequency(mapper: Functional<E, D>): Map<D, bigint>;

    public abstract summate(): D;
    public abstract summate(mapper: Functional<E, D>): D;

    public abstract quantile(quantile: number): D;
    public abstract quantile(quantile: number, mapper: Functional<E, D>): D;

    public abstract interquartileRange(): D;
    public abstract interquartileRange(mapper: Functional<E, D>): D;

    public abstract skewness(): D;
    public abstract skewness(mapper: Functional<E, D>): D;

    public abstract kurtosis(): D;
    public abstract kurtosis(mapper: Functional<E, D>): D;
};

export class NumericStatistics<E> extends Statistics<E, number> {

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public range(): number;
    public range(mapper: Functional<E, number>): number;
    public range(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let minimum: E = this.ordered[0].value;
            let maximum: E = this.ordered[0].value;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].value;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return useCompare(maximum, minimum);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let minimum: number = mapper(this.ordered[0].value);
            let maximum: number = mapper(this.ordered[0].value);
            for (let i = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                if (current < minimum) {
                    minimum = current;
                }
                if (current > maximum) {
                    maximum = current;
                }
            }
            return maximum - minimum;
        }
        throw new TypeError("Invalid arguments.");
    }

    public variance(): number;
    public variance(mapper: Functional<E, number>): number;
    public variance(argument1?: Functional<E, number>): number {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let summate: number = this.summate();
            return (summate / Number(this.count())) - (mean * mean);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / Number(this.count())) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }

    public standardDeviation(): number;
    public standardDeviation(mapper: Functional<E, number>): number;
    public standardDeviation(argument1?: Functional<E, number>): number {
        if (invalidate(argument1)) {
            return Math.sqrt(this.variance());
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let variance = this.variance(mapper);
            return Math.sqrt(variance);
        }
        throw new TypeError("Invalid arguments.");
    }

    public mean(): number;
    public mean(mapper: Functional<E, number>): number;
    public mean(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate: number = this.summate();
            return summate / Number(this.count());
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let summate = this.summate(mapper);
            return summate / Number(this.count());
        }
        throw new TypeError("Invalid arguments.");
    }

    public median(): number;
    public median(mapper: Functional<E, number>): number;
    public median(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let middle: number = Math.floor(count / 2);
            let median: number = Number(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + Number(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median: number = mapper(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + mapper(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }

    public mode(): number;
    public mode(mapper: Functional<E, number>): number;
    public mode(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let frequency: Map<number, bigint> = this.frequency();
            let mode: number = 0;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let frequency = this.frequency(mapper);
            let mode: number = 0;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        throw new TypeError("Invalid arguments.");
    }

    public frequency(): Map<number, bigint>;
    public frequency(mapper: Functional<E, number>): Map<number, bigint>;
    public frequency(argument1?: Functional<E, number>): Map<number, bigint> {
        if (this.isEmpty()) {
            return new Map<number, bigint>();
        }
        if (invalidate(argument1)) {
            let frequency: Map<number, bigint> = new Map<number, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let frequency: Map<number, bigint> = new Map<number, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }

    public summate(): number;
    public summate(mapper: Functional<E, number>): number;
    public summate(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate: number = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                summate += current;
            }
            return summate;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let summate: number = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }

    public quantile(quantile: number): number;
    public quantile(quantile: number, mapper: Functional<E, number>): number;
    public quantile(quantile: number, argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: number = Number(this.ordered[index].value);
            return value;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.ordered[index].value);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }

    public interquartileRange(): number;
    public interquartileRange(mapper: Functional<E, number>): number;
    public interquartileRange(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let lower: number = this.quantile(0.25);
            let upper: number = this.quantile(0.75);
            return upper - lower;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }

    public skewness(): number;
    public skewness(mapper: Functional<E, number>): number;
    public skewness(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let standardDeviation: number = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data: Array<E> = this.toArray();
            let summate: number = 0;
            for (let value of data) {
                let z = (value as unknown as number - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        }
        throw new TypeError("Invalid arguments.");
    }

    public kurtosis(): number;
    public kurtosis(mapper: Functional<E, number>): number;
    public kurtosis(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let standardDeviation: number = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data: Array<E> = this.toArray();
            let summate: number = 0;
            for (let value of data) {
                let z = (value as unknown as number - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        }
        throw new TypeError("Invalid arguments.");
    }
};

export class BigIntStatistics<E> extends Statistics<E, bigint> {

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public range(): bigint;
    public range(mapper: Functional<E, bigint>): bigint;
    public range(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let minimum: E = this.ordered[0].value;
            let maximum: E = this.ordered[0].value;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].value;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return BigInt(useCompare(maximum, minimum));
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let minimum: bigint = mapper(this.ordered[0].value);
            let maximum: bigint = mapper(this.ordered[0].value);
            for (let i: number = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                if (current < minimum) {
                    minimum = current;
                }
                if (current > maximum) {
                    maximum = current;
                }
            }
            return maximum - minimum;
        }
        throw new TypeError("Invalid arguments.");
    }

    public variance(): bigint;
    public variance(mapper: Functional<E, bigint>): bigint;
    public variance(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let summate: bigint = this.summate();
            return (summate / this.count()) - (mean * mean);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let mean: bigint = this.mean(mapper);
            let summate: bigint = this.summate(mapper);
            return (summate / this.count()) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }

    public standardDeviation(): bigint;
    public standardDeviation(mapper: Functional<E, bigint>): bigint;
    public standardDeviation(argument1?: Functional<E, bigint>): bigint {
        if (invalidate(argument1)) {
            return BigInt(Math.sqrt(Number(this.variance())));
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let variance: bigint = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        throw new TypeError("Invalid arguments.");
    }

    public mean(): bigint;
    public mean(mapper: Functional<E, bigint>): bigint;
    public mean(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate: bigint = this.summate();
            return summate / this.count();
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let summate: bigint = this.summate(mapper);
            return summate / this.count();
        }
        throw new TypeError("Invalid arguments.");
    }

    public median(): bigint;
    public median(mapper: Functional<E, bigint>): bigint;
    public median(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let middle: number = Math.floor(count / 2);
            let median: bigint = BigInt(Number(this.ordered[middle].value));
            if (count % 2 === 0) {
                median = (median + BigInt(Number(this.ordered[middle - 1].value))) / 2n;
                return median;
            }
            return median;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let count: bigint = this.count();
            let middle: bigint = count / 2n;
            let median: bigint = mapper(this.ordered[Number(middle)].value);
            if (count % 2n === 0n) {
                median = (median + mapper(this.ordered[Number(middle - 1n)].value)) / 2n;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }

    public mode(): bigint;
    public mode(mapper: Functional<E, bigint>): bigint;
    public mode(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let frequency: Map<bigint, bigint> = this.frequency();
            let mode: bigint = 0n;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let frequency = this.frequency(mapper);
            let mode: bigint = 0n;
            let maxFrequency: bigint = 0n;
            for (let [value, frequence] of frequency) {
                if (frequence > maxFrequency) {
                    mode = value;
                    maxFrequency = frequence;
                }
            }
            return mode;
        }
        throw new TypeError("Invalid arguments.");
    }

    public frequency(): Map<bigint, bigint>;
    public frequency(mapper: Functional<E, bigint>): Map<bigint, bigint>;
    public frequency(argument1?: Functional<E, bigint>): Map<bigint, bigint> {
        if (this.isEmpty()) {
            return new Map<bigint, bigint>();
        }
        if (invalidate(argument1)) {
            let frequency: Map<bigint, bigint> = new Map<bigint, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let frequency: Map<bigint, bigint> = new Map<bigint, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }

    public summate(): bigint;
    public summate(mapper: Functional<E, bigint>): bigint;
    public summate(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate: bigint = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                summate += current;
            }
            return summate;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let summate: bigint = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }

    public quantile(quantile: number): bigint;
    public quantile(quantile: number, mapper: Functional<E, bigint>): bigint;
    public quantile(quantile: unknown, mapper?: unknown): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(mapper)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = BigInt(Number(this.ordered[index].value));
            return value;
        } else if (isFunction(mapper)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = mapper(this.ordered[index].value);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }

    public interquartileRange(): bigint;
    public interquartileRange(mapper: Functional<E, bigint>): bigint;
    public interquartileRange(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let lower: bigint = this.quantile(0.25);
            let upper: bigint = this.quantile(0.75);
            return upper - lower;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let lower: bigint = this.quantile(0.25, mapper);
            let upper: bigint = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }

    public skewness(): bigint;
    public skewness(mapper: Functional<E, bigint>): bigint;
    public skewness(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let standardDeviation: bigint = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data: Array<E> = this.toArray();
            let summate: bigint = 0n;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let mean: bigint = this.mean(mapper);
            let standardDeviation: bigint = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        }
        throw new TypeError("Invalid arguments.");
    }

    public kurtosis(): bigint;
    public kurtosis(mapper: Functional<E, bigint>): bigint;
    public kurtosis(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let standardDeviation: bigint = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data: Array<E> = this.toArray();
            let summate: bigint = 0n;
            let count: number = data.length;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let mean: bigint = this.mean(mapper);
            let standardDeviation: bigint = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            let count: number = data.length;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        }
        throw new TypeError("Invalid arguments.");
    }
};
