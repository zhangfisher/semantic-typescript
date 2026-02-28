import {
    useAnyMatch, useAllMatch, Collector, useCollect, useCount, useError, useFindAny,
    useFindAt, useFindFirst, useFindLast, useFindMaximum, useFindMinimum, useForEach, useGroup,
    useGroupBy, useJoin, useLog, useNoneMatch, usePartition, usePartitionBy, useReduce, useToArray,
    useToMap, useToSet, useWrite, useFrequency, useNumericAverage, useNumericVariance,
    useNumericStandardDeviation, useNumericMedian, useNumericMode, useNumericSummate, useBigIntAverage,
    useBigIntVariance, useBigIntMedian, useBigIntMode, useBigIntSummate
} from "./collector";
import { isBigInt, isCollectable, isCollector, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { useHash } from "./hash";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import type { Optional } from "./optional";
import {
    AsyncCollectableSymbol,
    BigIntStatisticsSymbol, CollectableSymbol, NumericStatisticsSymbol, OrderedCollectableSymbol,
    SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol
} from "./symbol";
import { invalidate, validate, type Predicate } from "./utility";
import type { Generator, Functional, BiFunctional, Consumer, BiConsumer, Comparator, BiPredicate, Indexed, Supplier, TriFunctional, TriPredicate, } from "./utility";

export class Semantic<E> {

    protected generator: Generator<E>;

    protected readonly Semantic: Symbol = SemanticSymbol;

    constructor(generator: Generator<E>) {
        this.generator = generator;
        Object.defineProperties(this, {
            "Semantic": {
                value: SemanticSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            },
            "generator": {
                value: generator,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }

    public concat(other: Semantic<E>): Semantic<E>;
    public concat(other: Iterable<E>): Semantic<E>;
    public concat(other: Semantic<E> | Iterable<E>): Semantic<E> {
        if (isSemantic(other)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    this.generator((element: E, index: bigint) => {
                        accept(element, index);
                        count++;
                    }, interrupt);
                    let otherGenerator: Generator<E> = Reflect.has(other, "generator") ? Reflect.get(other, "generator") : (): void => { };
                    otherGenerator((element: E, index: bigint) => {
                        accept(element, index + count);
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on concatenation.");
                }
            });
        }
        if (isIterable(other)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    this.generator((element: E, index: bigint) => {
                        accept(element, index);
                        count++;
                    }, interrupt);
                    for (let element of other) {
                        accept(element, count);
                        count++;
                    }
                } catch (error) {
                    throw new Error("Uncaught error on concatenation.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public distinct(): Semantic<E>;
    public distinct<K>(keyExtractor: Functional<E, K>): Semantic<E>;
    public distinct<K>(keyExtractor: BiFunctional<E, bigint, K>): Semantic<E>;
    public distinct<K = E>(argument1?: Functional<E, K> | BiFunctional<E, bigint, K>): Semantic<E> {
        let keyExtractor: Functional<E, K> | BiFunctional<E, bigint, K> = validate(argument1) ? argument1 : (element: E): K => element as unknown as K;
        return new Semantic<E>((accept, interrupt) => {
            try {
                let set: Set<K> = new Set<K>();
                this.generator((element: E, index: bigint) => {
                    let key: K = keyExtractor(element, index);
                    if (!set.has(key)) {
                        set.add(key);
                        accept(element, index);
                    }
                }, interrupt);
            } catch (error) {
                throw new Error("Uncaught error on distinct.");
            }
        });
    }

    public dropWhile(predicate: Predicate<E>): Semantic<E>;
    public dropWhile(predicate: BiPredicate<E, bigint>): Semantic<E>;
    public dropWhile(predicate: Predicate<E> | BiPredicate<E, bigint>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let dropping: boolean = true;
                    this.generator((element: E, index: bigint): void => {
                        if (dropping) {
                            if (!predicate(element, index)) {
                                dropping = false;
                                accept(element, index);
                            }
                            return;
                        }
                        accept(element, index);
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on dropWhile.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public filter(predicate: Predicate<E>): Semantic<E>;
    public filter(predicate: BiPredicate<E, bigint>): Semantic<E>;
    public filter(predicate: Predicate<E> | BiPredicate<E, bigint>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        if (predicate(element, index)) {
                            accept(element, index);
                        }
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on filter.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public flat(mapper: Functional<E, Iterable<E>>): Semantic<E>;
    public flat(mapper: BiFunctional<E, bigint, Iterable<E>>): Semantic<E>;
    public flat(mapper: Functional<E, Semantic<E>>): Semantic<E>;
    public flat(mapper: BiFunctional<E, bigint, Semantic<E>>): Semantic<E>;
    public flat(mapper: Functional<E, Iterable<E>> | BiFunctional<E, bigint, Iterable<E>> | Functional<E, Semantic<E>> | BiFunctional<E, bigint, Semantic<E>>): Semantic<E> {
        if (isFunction(mapper)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    let stop: boolean = false;
                    this.generator((element: E, index: bigint): void => {
                        let result: Semantic<E> | Iterable<E> = mapper(element, index);
                        if (isIterable(result)) {
                            for (let subElement of result) {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }
                        } else if (isSemantic(result)) {
                            result.generator((subElement: E): void => {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }, (element: E): boolean => interrupt(element, count) || stop);
                        }
                    }, (element: E): boolean => interrupt(element, count) || stop);
                } catch (error) {
                    throw new Error("Uncaught error on flat.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public flatMap<R>(mapper: Functional<E, Iterable<R>>): Semantic<R>;
    public flatMap<R>(mapper: BiFunctional<E, bigint, Iterable<R>>): Semantic<R>;
    public flatMap<R>(mapper: Functional<E, Semantic<R>>): Semantic<R>;
    public flatMap<R>(mapper: BiFunctional<E, bigint, Semantic<R>>): Semantic<R>;
    public flatMap<R>(mapper: Functional<E, Iterable<R> | Semantic<R>> | BiFunctional<E, bigint, Iterable<R> | Semantic<R>>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept: Consumer<R> | BiConsumer<R, bigint>, interrupt: Predicate<R> | BiPredicate<R, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    let stop: boolean = false;
                    this.generator((element: E, index: bigint): void => {
                        let result: Semantic<R> | Iterable<R> = mapper(element, index);
                        if (isIterable(result)) {
                            for (let subElement of result) {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }
                        } else if (isSemantic(result)) {
                            result.generator((subElement: R): void => {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }, (element: R): boolean => interrupt(element, count) || stop);
                        }
                    }, (): boolean => stop);
                } catch (error) {
                    throw new Error("Uncaught error on flatMap.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public limit(n: number): Semantic<E>;
    public limit(n: bigint): Semantic<E>;
    public limit(n: bigint | number): Semantic<E> {
        if (isNumber(n)) {
            let limit: bigint = BigInt(n);
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    this.generator((element: E, index: bigint): void => {
                        if (count < limit) {
                            accept(element, index);
                            count++;
                        }
                    }, (element: E): boolean => interrupt(element, count) || count >= limit);
                } catch (error) {
                    throw new Error("Uncaught error on limit.");
                }
            });
        }
        if (isBigInt(n)) {
            let limit: bigint = n;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    this.generator((element: E, index: bigint): void => {
                        if (count < limit) {
                            accept(element, index);
                            count++;
                        }
                    }, (element: E): boolean => interrupt(element, count) || count >= limit);
                } catch (error) {
                    throw new Error("Uncaught error on limit.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public map<R>(mapper: Functional<E, R>): Semantic<R>;
    public map<R>(mapper: BiFunctional<E, bigint, R>): Semantic<R>;
    public map<R>(mapper: Functional<E, R> | BiFunctional<E, bigint, R>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept: Consumer<R> | BiConsumer<R, bigint>, interrupt: Predicate<R> | BiPredicate<R, bigint>): void => {
                try {
                    let stop: boolean = false;
                    this.generator((element: E, index: bigint): void => {
                        let resolved: R = mapper(element, index);
                        accept(resolved, index);
                        stop = stop || interrupt(resolved, index);
                    }, (): boolean => stop);
                } catch (error) {
                    throw new Error("Uncaught error on map.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public peek(consumer: Consumer<E>): Semantic<E>;
    public peek(consumer: BiConsumer<E, bigint>): Semantic<E>;
    public peek(consumer: Consumer<E> | BiConsumer<E, bigint>): Semantic<E> {
        if (isFunction(consumer)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, index);
                        consumer(element, index);
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on peek.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(redirector)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, redirector(element, index));
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on redirect.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public reverse(): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            try {
                this.generator((element: E, index: bigint): void => {
                    accept(element, -index);
                }, interrupt);
            } catch (error) {
                throw new Error("Uncaught error on reverse.");
            }
        });
    }

    public shuffle(): Semantic<E>;
    public shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>;
    public shuffle(mapper?: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(mapper)) {
            try {
                return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, mapper(element, index));
                    }, interrupt);
                });
            } catch (error) {
                throw new Error("Uncaught error on shuffle.");
            }
        }
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            try {
                this.generator((element: E, index: bigint): void => {
                    accept(element, useHash(element, index));
                }, interrupt);
            } catch (error) {
                throw new Error("Uncaught error on shuffle.");
            }
        });
    }

    public skip(n: number): Semantic<E>;
    public skip(n: bigint): Semantic<E>;
    public skip(n: number | bigint): Semantic<E> {
        if (isNumber(n)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    let limit: bigint = BigInt(n);
                    this.generator((element: E, index: bigint): void => {
                        if (count < limit) {
                            count++;
                        } else {
                            accept(element, index);
                        }
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on skip.");
                }
            });
        }
        if (isBigInt(n)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    let count: bigint = 0n;
                    this.generator((element: E, index: bigint): void => {
                        if (count < n) {
                            count++;
                        } else {
                            accept(element, index);
                        }
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on skip.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public sorted(): OrderedCollectable<E>;
    public sorted(comparator: Comparator<E>): OrderedCollectable<E>;
    public sorted(comparator?: Comparator<E>): OrderedCollectable<E> {
        if (isFunction(comparator)) {
            try {
                return new OrderedCollectable<E>(this.generator, comparator);
            } catch (error) {
                throw new Error("Uncaught error on sorted.");
            }
        }
        try {
            return new OrderedCollectable<E>(this.generator, (a: E, b: E): number => useCompare(a, b));
        } catch (error) {
            throw new Error("Uncaught error on sorted.");
        }
    }

    public sub(start: bigint, end: bigint): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            try {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint): void => {
                    if (count < end) {
                        count++;
                        if (count >= start) {
                            accept(element, index);
                        }
                    }

                }, interrupt);
            } catch (error) {
                throw new Error("Uncaught error on sub.");
            }
        });
    }

    public takeWhile(predicate: Predicate<E>): Semantic<E>;
    public takeWhile(predicate: BiPredicate<E, bigint>): Semantic<E>;
    public takeWhile(predicate: Predicate<E> | BiPredicate<E, bigint>): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            try {
                this.generator((element: E, index: bigint) => {
                    if (!predicate(element, index)) {
                        interrupt(element, index);
                        return;
                    }
                    accept(element, index);
                }, interrupt);
            } catch (error) {
                throw new Error("Uncaught error on takeWhile.");
            }
        });
    }

    public toCollectable(): Collectable<E>;
    public toCollectable<C extends Collectable<E>>(mapper: Functional<Generator<E>, C>): C;
    public toCollectable<C extends Collectable<E>>(mapper?: Functional<Generator<E>, C>): Collectable<E> | C {
        if (isFunction(mapper)) {
            try {
                let collectable: C = mapper(this.generator);
                if (isCollectable(collectable)) {
                    return collectable;
                }
            } catch (error) {
                throw new Error("Uncaught error on toCollectable.");
            }
        }
        try {
            return new UnorderedCollectable(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on toCollectable.");
        }
    }

    public toBigintStatistics(): BigIntStatistics<E> {
        try {
            return new BigIntStatistics(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on toBigintStatistics.");
        }
    }

    public toEvent(): EventCollectable<E>{
        try{
            return new EventCollectable(this.generator);
        }catch(error){
            throw new Error("Uncaught error on toEvent.");
        }
    }

    public toNumericStatistics(): NumericStatistics<E> {
        try {
            return new NumericStatistics(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on toNumericStatistics.");
        }
    }

    public toOrdered(): OrderedCollectable<E> {
        try {
            return new OrderedCollectable(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on toOrdered.");
        }
    }

    public toUnordered(): UnorderedCollectable<E> {
        try {
            return new UnorderedCollectable(this.generator);
        } catch (error) {
            throw new Error(String(error));
        }
    }

    public toWindow(): WindowCollectable<E> {
        try {
            return new WindowCollectable(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on toWindow.");
        }
    }

    public translate(offset: number): Semantic<E>;
    public translate(offset: bigint): Semantic<E>;
    public translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>;
    public translate(argument1: number | bigint | BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isNumber(argument1)) {
            let offset: number = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, index + BigInt(offset));
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        } else if (isBigInt(argument1)) {
            let offset: bigint = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, index + offset);
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        } else if (isFunction(argument1)) {
            let translator: BiFunctional<E, bigint, bigint> = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                try {
                    this.generator((element: E, index: bigint): void => {
                        accept(element, index + translator(element, index));
                    }, interrupt);
                } catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
};


export abstract class Collectable<E> implements Iterable<E>, AsyncIterable<E> {

    protected readonly Collectable: symbol = CollectableSymbol;

    public constructor() {
        Object.defineProperty(this, "Collectable", {
            value: CollectableSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }

    public abstract [Symbol.iterator](): globalThis.Generator<E, void, undefined>;

    public abstract [Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined>;

    public anyMatch(predicate: Predicate<E>): boolean {
        if (isFunction(predicate)) {
            try {
                return useAnyMatch(predicate).collect(this);
            } catch (error) {
                throw new Error("Uncaught error on anyMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }

    public allMatch(predicate: Predicate<E>): boolean {
        return useAllMatch(predicate).collect(this);
    }

    public collect<A, R>(collector: Collector<E, A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(argument1: Supplier<A> | Collector<E, A, R>, argument2?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>, argument3?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Functional<A, R>, argument4?: Functional<A, R>): R {
        try {
            if (isCollector(argument1)) {
                let collector: Collector<E, A, R> = argument1 as Collector<E, A, R>;
                return collector.collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
                let identity: Supplier<A> = argument1 as Supplier<A>;
                let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument2 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
                let finisher: Functional<A, R> = argument3 as Functional<A, R>;
                return useCollect(identity, accumulator, finisher).collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
                let identity: Supplier<A> = argument1 as Supplier<A>;
                let interrupt: Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A> = argument2 as Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A>;
                let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument3 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
                let finisher: Functional<A, R> = argument4 as Functional<A, R>;
                return useCollect(identity, interrupt, accumulator, finisher).collect(this);
            }
        } catch (error) {
            throw new Error("Uncaught error on collect.");
        }
        throw new TypeError("Invalid arguments.");
    }

    public count(): bigint {
        return useCount<E>().collect(this.source());
    }

    public error(): void;
    public error(accumulator: BiFunctional<string, E, string>): void;
    public error(accumulator: TriFunctional<string, E, bigint, string>): void;
    public error(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public error(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public error(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                useError<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                useError<E>(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                useError<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public isEmpty(): boolean {
        return this.count() === 0n;
    }

    public findAny(): Optional<E> {
        try {
            return useFindAny<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findAny.");
        }
    }

    public findAt(index: number): Optional<E>;
    public findAt(index: bigint): Optional<E>;
    public findAt(index: number | bigint): Optional<E> {
        if (isBigInt(index)) {
            try {
                return useFindAt<E>(index).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on findAt.");
            }
        } else if (isNumber(index)) {
            try {
                return useFindAt<E>(index).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on findAt.");
            }
        }
        throw new TypeError("Index must be a bigint.");
    }

    public findFirst(): Optional<E> {
        try {
            return useFindFirst<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findFirst.");
        }
    }

    public findLast(): Optional<E> {
        try {
            return useFindLast<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findLast.");
        }
    }

    public findMaximum(): Optional<E>;
    public findMaximum(comparator: Comparator<E>): Optional<E>;
    public findMaximum(argument1?: Comparator<E>): Optional<E> {
        try {
            let comparator: Comparator<E> = isFunction(argument1) ? argument1 : useCompare;
            return useFindMaximum(comparator).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findMaximum.");
        }
    }

    public findMinimum(): Optional<E>;
    public findMinimum(comparator: Comparator<E>): Optional<E>;
    public findMinimum(argument1?: Comparator<E>): Optional<E> {
        try {
            let comparator: Comparator<E> = isFunction(argument1) ? argument1 : useCompare;
            return useFindMinimum(comparator).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findMinimum.");
        }
    }

    public forEach(action: Consumer<E>): void
    public forEach(action: BiConsumer<E, bigint>): void
    public forEach(action: Consumer<E> | BiConsumer<E, bigint>): void {
        if (isFunction(action)) {
            try {
                useForEach(action).collect(this);
            } catch (error) {
                throw new Error("Uncaught error on forEach.");
            }
        } else {
            throw new TypeError("Action must be a function.");
        }
    }

    public group<K>(classifier: Functional<E, K>): Map<K, Array<E>>;
    public group<K>(classifier: BiFunctional<E, bigint, K>): Map<K, Array<E>>
    public group<K>(classifier: Functional<E, K> | BiFunctional<E, bigint, K>): Map<K, Array<E>> {
        if (isFunction(classifier)) {
            try {
                return useGroup(classifier).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on group.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }

    public groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>>;
    public groupBy<K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, K>): Map<K, Array<V>>
    public groupBy<K, V>(keyExtractor: Functional<E, K> | BiFunctional<E, bigint, K>, valueExtractor: Functional<E, V> | BiFunctional<E, bigint, V>): Map<K, Array<V>> {
        if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
            try {
                return useGroupBy(keyExtractor, valueExtractor).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on groupBy.");
            }
        }
        throw new TypeError("Key and value extractors must be functions.");
    }

    public join(): string;
    public join(delimiter: string): string;
    public join(prefix: string, delimiter: string, suffix: string): string;
    public join(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): string;
    public join(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string;
    public join(argument1?: string, argument2?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): string {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                return useJoin<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let delimiter: string = argument1;
                return useJoin<E>(delimiter).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                return useJoin<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && isString(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let delimiter: string = argument2;
                let suffix: string = argument3;
                return useJoin<E>(prefix, delimiter, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }

    public log(): void;
    public log(accumulator: BiFunctional<string, E, string>): void;
    public log(accumulator: TriFunctional<string, E, bigint, string>): void;
    public log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public log(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                useLog<E>(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                useLog<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        } else {
            try {
                useLog<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        }
    }

    public nonMatch(predicate: Predicate<E>): boolean;
    public nonMatch(predicate: BiPredicate<E, bigint>): boolean
    public nonMatch(predicate: Predicate<E> | BiPredicate<E, bigint>): boolean {
        if (isFunction(predicate)) {
            try {
                return useNoneMatch(predicate).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on nonMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }

    public partition(count: bigint): Array<Array<E>> {
        if (isBigInt(count)) {
            try {
                return usePartition<E>(count).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on partition.");
            }
        }
        throw new TypeError("Count must be a BigInt.");
    }

    public partitionBy(classifier: Functional<E, bigint>): Array<Array<E>>;
    public partitionBy(classifier: BiFunctional<E, bigint, bigint>): Array<Array<E>>
    public partitionBy(classifier: Functional<E, bigint> | BiFunctional<E, bigint, bigint>): Array<Array<E>> {
        if (isFunction(classifier)) {
            try {
                let collector: Collector<E, Array<E[]>, Array<E[]>> = usePartitionBy(classifier);
                return collector.collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on partitionBy.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }

    public reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    public reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    public reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    public reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    public reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): R;
    public reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): R;
    public reduce<R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: Functional<R, R>): R | E | Optional<E> {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator = argument1 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
                return useReduce(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            try {
                let identity = argument1 as E;
                let accumulator = argument2 as BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E>;
                return useReduce(identity, accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            try {
                let identity = argument1 as R;
                let accumulator = argument2 as BiFunctional<R, E, R> & TriFunctional<R, E, bigint, R>;
                let finisher = argument3 as Functional<R, R>;
                return useReduce(identity, accumulator, finisher).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public semantic(): Semantic<E> {
        let source: Generator<E> = this.source();
        if (isFunction(source)) {
            try {
                return new Semantic(source);
            } catch (error) {
                throw new Error("Uncaught error on semantic.");
            }
        } else {
            throw new TypeError("Invalid source.");
        }
    }

    public abstract source(): Generator<E>;

    public toArray(): Array<E> {
        try {
            return useToArray<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toArray.");
        }
    }

    public toMap<K, E>(keyExtractor: Functional<E, K>): Map<K, E>;
    public toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>;
    public toMap<K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Map<K, V>;
    public toMap<K, V = E>(keyExtractor: Functional<E, K> | BiFunctional<E, bigint, K>, valueExtractor: Functional<E, V> | BiFunctional<E, bigint, V> = (element: E): V => element as unknown as V): Map<K, V> {
        try {
            return useToMap<E, K, V>(keyExtractor, valueExtractor).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toMap.");
        }
    }

    public toSet(): Set<E> {
        try {
            return useToSet<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toSet.");
        }
    }

    public write<S = string>(stream: WritableStream<S>): Promise<WritableStream<S>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Promise<WritableStream<S>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>>;
    public write<S = string>(argument1: WritableStream<S>, argument2?: BiFunctional<WritableStream<S>, E, WritableStream<S>> | TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>> {
        if (isObject(argument1)) {
            try {
                let stream: WritableStream<S> = argument1 as WritableStream<S>;
                if (isFunction(argument2)) {
                    let accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>> = argument2 as BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>;
                    return useWrite(stream, accumulator).collect(this.source());
                } else {
                    return useWrite(stream).collect(this.source());
                }
            } catch (error) {
                throw new Error("Uncaught error on write.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }
};

export class EventCollectable<E> extends Collectable<E> {

    protected readonly AsyncCollectable: symbol = AsyncCollectableSymbol;

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>);
    public constructor(argument1: Generator<E>) {
        super();
        if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            this.generator = generator;
            Object.defineProperty(this, "AsyncCollectable", {
                value: AsyncCollectableSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }

    public override source(): Generator<E> {
        return this.generator;
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, Array<E>> = useToArray();
            yield* collector.collect(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, Array<E>> = useToArray();
            yield* collector.collect(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
}

export class UnorderedCollectable<E> extends Collectable<E> {

    protected readonly UnorderedCollectable: symbol = UnorderedCollectableSymbol;

    protected buffer: Map<bigint, E> = new Map<bigint, E>();

    public constructor(generator: Generator<E>);
    public constructor(argument1: Generator<E>) {
        super();
        if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            generator((element: E, index: bigint): void => {
                this.buffer.set(index, element);
            }, (): boolean => false);
            Object.defineProperties(this, {
                "UnorderedCollectable": {
                    value: UnorderedCollectableSymbol,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            });
        } else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }

    public override source(): Generator<E> {
        return (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            for (let [index, element] of this.buffer) {
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
            }
        };
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let [_index, element] of this.buffer) {
                yield element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let [_index, element] of this.buffer) {
                yield element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

};

export class OrderedCollectable<E> extends Collectable<E> {

    protected readonly OrderedCollectable: symbol = OrderedCollectableSymbol;

    protected buffer: Array<Indexed<E>>;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(argument1: Generator<E>, argument2?: Comparator<E>) {
        super();
        if (isFunction(argument1)) {
            try {
                if (isFunction(argument2)) {
                    let collector: Collector<E, Array<E>, Array<E>> = useToArray();
                    this.buffer = collector.collect(argument1).sort(argument2).map((element: E, index: number) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    });
                } else {
                    let collector: Collector<E, Array<E>, Array<E>> = useToArray();
                    this.buffer = collector.collect(argument1).map((element: E, index: number) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    }).sort((a: Indexed<E>, b: Indexed<E>): number => {
                        return Number(a.index - b.index);
                    });
                }
                Object.defineProperties(this, {
                    "OrderedCollectable": {
                        value: OrderedCollectableSymbol,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    },
                    "buffer": {
                        value: this.buffer,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    }
                });
            } catch (error) {
                throw new Error("Uncaught error on creating buffer.");
            }
        } else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public override source(): Generator<E> {
        try {
            return (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                for (let indexed of this.buffer) {
                    if (interrupt(indexed.element, indexed.index)) {
                        break;
                    }
                    accept(indexed.element, indexed.index);
                }
            };
        } catch (error) {
            throw new Error("Uncaught error on creating source.");
        }
    }

    public isEmpty(): boolean {
        return this.buffer.length === 0;
    }
};

export abstract class Statistics<E, D extends number | bigint> extends OrderedCollectable<E> {

    protected readonly Statistics: symbol = StatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "Statistics": {
                value: StatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public count(): bigint {
        return BigInt(this.buffer.length);
    }

    public abstract average(): D;
    public abstract average(mapper: Functional<E, D>): D;

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

    public frequency(): Map<E, bigint> {
        return useFrequency<E>().collect(this.source());
    }

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

    protected readonly NumericStatistics: symbol = NumericStatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "NumericStatistics": {
                value: NumericStatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public average(): number;
    public average(mapper: Functional<E, number>): number;
    public average(mapper?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (isFunction(mapper)) {
                return useNumericAverage(mapper).collect(this.source());
            }
            return useNumericAverage().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }

    public range(): number;
    public range(mapper: Functional<E, number>): number;
    public range(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (this.count() === 1n) {
                return 0;
            }
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let count: number = this.buffer.length;
            let minimum: E = this.buffer[0].element;
            let maximum: E = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        } catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }

    public variance(): number;
    public variance(mapper: Functional<E, number>): number;
    public variance(argument1?: Functional<E, number>): number {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericVariance(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }

    public standardDeviation(): number;
    public standardDeviation(mapper: Functional<E, number>): number;
    public standardDeviation(argument1?: Functional<E, number>): number {
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericStandardDeviation(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }

    public mean(): number;
    public mean(mapper: Functional<E, number>): number;
    public mean(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }

    public median(): number;
    public median(mapper: Functional<E, number>): number;
    public median(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMedian(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }

    public mode(): number;
    public mode(mapper: Functional<E, number>): number;
    public mode(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMode(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }

    public summate(): number;
    public summate(mapper: Functional<E, number>): number;
    public summate(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericSummate(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on summate.");
        }
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
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        } catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }

    public interquartileRange(): number;
    public interquartileRange(mapper: Functional<E, number>): number;
    public interquartileRange(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        } catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }

    public skewness(): number;
    public skewness(mapper: Functional<E, number>): number;
    public skewness(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
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
        } catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }

    public kurtosis(): number;
    public kurtosis(mapper: Functional<E, number>): number;
    public kurtosis(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
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
        } catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
};

export class BigIntStatistics<E> extends Statistics<E, bigint> {

    protected readonly BigIntStatistics: symbol = BigIntStatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "BigIntStatistics": {
                value: BigIntStatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public average(): bigint;
    public average(mapper: Functional<E, bigint>): bigint;
    public average(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }

    public range(): bigint;
    public range(mapper: Functional<E, bigint>): bigint;
    public range(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let count: number = this.buffer.length;
            let minimum: E = this.buffer[0].element;
            let maximum: E = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        } catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }

    public variance(): bigint;
    public variance(mapper: Functional<E, bigint>): bigint;
    public variance(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntVariance(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }

    public standardDeviation(): bigint;
    public standardDeviation(mapper: Functional<E, bigint>): bigint;
    public standardDeviation(argument1?: Functional<E, bigint>): bigint {
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        } catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }

    public mean(): bigint;
    public mean(mapper: Functional<E, bigint>): bigint;
    public mean(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }

    public median(): bigint;
    public median(mapper: Functional<E, bigint>): bigint;
    public median(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMedian(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }

    public mode(): bigint;
    public mode(mapper: Functional<E, bigint>): bigint;
    public mode(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMode(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }

    public summate(): bigint;
    public summate(mapper: Functional<E, bigint>): bigint;
    public summate(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntSummate(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }

    public quantile(quantile: number): bigint;
    public quantile(quantile: number, mapper: Functional<E, bigint>): bigint;
    public quantile(quantile: number, argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = mapper(this.buffer[index].element);
            return value;
        } catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }

    public interquartileRange(): bigint;
    public interquartileRange(mapper: Functional<E, bigint>): bigint;
    public interquartileRange(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let lower: bigint = this.quantile(0.25, mapper);
            let upper: bigint = this.quantile(0.75, mapper);
            return upper - lower;
        } catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }

    public skewness(): bigint;
    public skewness(mapper: Functional<E, bigint>): bigint;
    public skewness(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
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
        } catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }

    public kurtosis(): bigint;
    public kurtosis(mapper: Functional<E, bigint>): bigint;
    public kurtosis(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
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
        } catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
};

export class WindowCollectable<E> extends OrderedCollectable<E> {

    protected readonly WindowCollectable: symbol = WindowCollectableSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator: Comparator<E> = useCompare) {
        super(parameter, comparator);
        Object.defineProperties(this, {
            "WindowCollectable": {
                value: WindowCollectableSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            return new Semantic<Semantic<E>>((accepet: Consumer<Semantic<E>> | BiConsumer<Semantic<E>, bigint>, interrupt: Predicate<Semantic<E>> | BiPredicate<Semantic<E>, bigint>): void => {
                try {
                    let index: bigint = 0n;
                    for (let start: bigint = 0n; start < BigInt(this.buffer.length); start += step) {
                        let end: bigint = start + size;
                        let inner: Semantic<E> = new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                            for (let index: bigint = start; index < end && index < BigInt(this.buffer.length); index++) {
                                let indexed: Indexed<E> = this.buffer[Number(index)];
                                if (invalidate(indexed)) {
                                    continue;
                                }
                                if (interrupt(indexed.element, index)) {
                                    break;
                                }
                                accept(indexed.element, index);
                            }
                        });
                        if (interrupt(inner, index)) {
                            break;
                        }
                        accepet(inner, index);
                        index++;
                    }
                } catch (error) {
                    throw new Error("Uncaught error on slide.");
                }
            });
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        if (isBigInt(size) && size > 0n) {
            try {
                return this.slide(size, size);
            } catch (error) {
                throw new Error("Uncaught error on tumble.");
            }
        }
        throw new RangeError("Invalid arguments.");
    }
};