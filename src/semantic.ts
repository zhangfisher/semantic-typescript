import { Collectable, OrderedCollectable, UnorderedCollectable } from "./collectable";
import { isBigInt, isCollectable, isFunction, isIterable, isNumber, isSemantic } from "./guard";
import { useHash } from "./hash";
import { useCompare } from "./hook";
import { BigIntStatistics, NumericStatistics } from "./statistics";
import { SemanticSymbol } from "./symbol";
import { validate, type Predicate } from "./utility";
import type { Generator, Functional, BiFunctional, Consumer, BiConsumer, Comparator, BiPredicate, } from "./utility";
import { WindowCollectable } from "./window";

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
        Object.freeze(this);
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
            throw new Error("Uncaught error on toUnordered.");
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
Object.freeze(Semantic);
Object.freeze(Semantic.prototype);
Object.freeze(Object.getPrototypeOf(Semantic));