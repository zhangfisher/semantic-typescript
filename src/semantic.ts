import { Collectable, OrderedCollectable, UnorderedCollectable, WindowCollectable } from "./collectable";
import { isBigInt, isCollectable, isFunction, isIterable, isNumber, isSemantic } from "./guard";
import { useCompare, useRandom } from "./hook";
import { BigIntStatistics, NumericStatistics } from "./statistics";
import { SemanticSymbol } from "./symbol";
import { validate, type Predicate } from "./utility";
import type { Generator, Functional, BiFunctional, Consumer, BiConsumer, Comparator, BiPredicate, } from "./utility";

export class Semantic<E> {

    protected generator: Generator<E>;

    protected readonly Semantic: Symbol = SemanticSymbol;

    constructor(generator: Generator<E>) {
        this.generator = generator;
    }

    public concat(other: Semantic<E>): Semantic<E>;
    public concat(other: Iterable<E>): Semantic<E>;
    public concat(other: Semantic<E> | Iterable<E>): Semantic<E> {
        if (isSemantic(other)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint) => {
                    accept(element, index);
                    count++;
                }, interrupt);
                let otherGenerator: Generator<E> = Reflect.has(other, "generator")? Reflect.get(other, "generator") : (): void => {};
                otherGenerator((element: E, index: bigint) => {
                    accept(element, index + count);
                }, interrupt);
            });
        }
        if (isIterable(other)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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

    public distinct(): Semantic<E>;
    public distinct(comparator: Comparator<E>): Semantic<E>;
    public distinct(comparator?: Comparator<E>): Semantic<E> {
        if (validate(comparator)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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

    public dropWhile(predicate: Predicate<E>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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

    public filter(predicate: Predicate<E>): Semantic<E> {
        if (isFunction(predicate)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    if (predicate(element)) {
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public flat(mapper: Functional<E, Iterable<E> | Semantic<E>>): Semantic<E> {
        if (isFunction(mapper)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                let count: bigint = 0n;
                let stop: boolean = false;
                this.generator((element: E): void => {
                    let result: Semantic<E> | Iterable<E> = mapper(element);
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
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public flatMap<R>(mapper: Functional<E, Iterable<R> | Semantic<R>>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept: Consumer<R> | BiConsumer<R, bigint>, interrupt: Predicate<R> | BiPredicate<R, bigint>): void => {
                let count: bigint = 0n;
                let stop: boolean = false;
                this.generator((element: E): void => {
                    let result: Semantic<R> | Iterable<R> = mapper(element);
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
                let count: bigint = 0n;
                this.generator((element: E, index: bigint): void => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element: E): boolean => interrupt(element, count) || count >= limit);
            });
        }
        if (isBigInt(n)) {
            let limit: bigint = n;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                let count: bigint = 0n;
                this.generator((element: E, index: bigint): void => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element: E): boolean => interrupt(element, count) || count >= limit);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public map<R>(mapper: Functional<E, R>): Semantic<R> {
        if (isFunction(mapper)) {
            return new Semantic<R>((accept: Consumer<R> | BiConsumer<R, bigint>, interrupt: Predicate<R> | BiPredicate<R, bigint>): void => {
                let stop: boolean = false;
                this.generator((element: E, index: bigint): void => {
                    let resolved: R = mapper(element);
                    accept(resolved, index);
                    stop = stop || interrupt(resolved, index);
                }, (): boolean => stop);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public peek(consumer: Consumer<E>): Semantic<E>;
    public peek(consumer: BiConsumer<E, bigint>): Semantic<E>;
    public peek(consumer: Consumer<E> | BiConsumer<E, bigint>): Semantic<E> {
        if (isFunction(consumer)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index);
                    consumer(element, index);
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(redirector)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, redirector(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }

    public reverse(): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            this.generator((element: E, index: bigint): void => {
                accept(element, -index);
            }, interrupt);
        });
    }

    public shuffle(): Semantic<E>;
    public shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>;
    public shuffle(mapper?: BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isFunction(mapper)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, mapper(element, index));
                }, interrupt);
            });
        }
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            this.generator((element: E, index: bigint): void => {
                accept(element, useRandom(index));
            }, interrupt);
        });
    }

    public skip(n: number): Semantic<E>;
    public skip(n: bigint): Semantic<E>;
    public skip(n: number | bigint): Semantic<E> {
        if (isNumber(n)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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
        if (isBigInt(n)) {
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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

    public sorted(): OrderedCollectable<E>;
    public sorted(comparator: Comparator<E>): OrderedCollectable<E>;
    public sorted(comparator?: Comparator<E>): OrderedCollectable<E> {
        if (isFunction(comparator)) {
            return new OrderedCollectable<E>(this.generator, comparator);
        }
        return new OrderedCollectable<E>(this.generator, (a: E, b: E): number => useCompare(a, b));
    }

    public sub(start: bigint, end: bigint): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
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

    public takeWhile(predicate: Predicate<E>): Semantic<E> {
        return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
            this.generator((element: E, index: bigint) => {
                if (!predicate(element)) {
                    interrupt(element, index);
                    return;
                }
                accept(element, index);
            }, interrupt);
        });
    }

    public toCollectable(): Collectable<E>;
    public toCollectable<C extends Collectable<E>>(mapper: Functional<Generator<E>, C>): C;
    public toCollectable<C extends Collectable<E>>(mapper?: Functional<Generator<E>, C>): Collectable<E> | C {
        if(isFunction(mapper)){
            let collectable: C = mapper(this.generator);
            if(isCollectable(collectable)){
                return collectable;
            }
        }
        return new UnorderedCollectable(this.generator);
    }

    public toBigintStatistics(): BigIntStatistics<E> {
        return new BigIntStatistics(this.generator);
    }

    public toNumericStatistics(): NumericStatistics<E> {
        return new NumericStatistics(this.generator);
    }

    public toOrdered(): OrderedCollectable<E> {
        return new OrderedCollectable(this.generator);
    }

    public toUnordered(): UnorderedCollectable<E> {
        return new UnorderedCollectable(this.generator);
    }

    public toWindow(): WindowCollectable<E> {
        return new WindowCollectable(this.generator);
    }

    public translate(offset: number): Semantic<E>;
    public translate(offset: bigint): Semantic<E>;
    public translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>;
    public translate(argument1: number | bigint | BiFunctional<E, bigint, bigint>): Semantic<E> {
        if (isNumber(argument1)) {
            let offset: number = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index + BigInt(offset));
                }, interrupt);
            });
        } else if (isBigInt(argument1)) {
            let offset: bigint = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index + offset);
                }, interrupt);
            });
        } else if (isFunction(argument1)) {
            let translator: BiFunctional<E, bigint, bigint> = argument1;
            return new Semantic<E>((accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                this.generator((element: E, index: bigint): void => {
                    accept(element, index + translator(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
};

export interface UseTransform{
    <E, R>(generator: Generator<E>, mapper: Functional<E, R>): Generator<R>;
    <E, R>(generator: Generator<E>, mapper: BiFunctional<E, bigint, R>): Generator<R>;
};
export let useTransform: UseTransform = <E, R>(generator: Generator<E>, mapper: Functional<E, R> | BiFunctional<E, bigint, R>): Generator<R> => {
    return (accept: Consumer<R> | BiConsumer<R, bigint>, interrupt: Predicate<R> | BiPredicate<R, bigint>): void => {
        generator((element: E, index: bigint): void => {
            let resolved: R = mapper(element, index);
            accept(resolved, index);
        }, (element: E, index: bigint): boolean => {
            return interrupt(mapper(element, index), index);
        });
    };
};