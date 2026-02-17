import { Collectable, OrderedCollectable, UnorderedCollectable } from "./collectable";
import { isBigInt, isCollectable, isFunction, isIterable, isNumber, isSemantic } from "./guard";
import { useCompare, useRandom } from "./hook";
import { BigIntStatistics, NumericStatistics } from "./statistics";
import { SemanticSymbol } from "./symbol";
import { validate } from "./utility";
import { WindowCollectable } from "./window";
export class Semantic {
    generator;
    Semantic = SemanticSymbol;
    constructor(generator) {
        this.generator = generator;
    }
    concat(other) {
        if (isSemantic(other)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    this.generator((element, index) => {
                        accept(element, index);
                        count++;
                    }, interrupt);
                    let otherGenerator = Reflect.has(other, "generator") ? Reflect.get(other, "generator") : () => { };
                    otherGenerator((element, index) => {
                        accept(element, index + count);
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on concatenation.");
                }
            });
        }
        if (isIterable(other)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    this.generator((element, index) => {
                        accept(element, index);
                        count++;
                    }, interrupt);
                    for (let element of other) {
                        accept(element, count);
                        count++;
                    }
                }
                catch (error) {
                    throw new Error("Uncaught error on concatenation.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    distinct(comparator) {
        if (validate(comparator)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let array = [];
                    this.generator((element, index) => {
                        if (!array.some((e) => comparator(e, element))) {
                            array.push(element);
                            accept(element, index);
                        }
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on distinct.");
                }
            });
        }
        return new Semantic((accept, interrupt) => {
            try {
                let set = new Set();
                this.generator((element, index) => {
                    if (!set.has(element)) {
                        set.add(element);
                        accept(element, index);
                    }
                }, interrupt);
            }
            catch (error) {
                throw new Error("Uncaught error on distinct.");
            }
        });
    }
    dropWhile(predicate) {
        if (isFunction(predicate)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let dropping = true;
                    this.generator((element, index) => {
                        if (dropping) {
                            if (!predicate(element)) {
                                dropping = false;
                                accept(element, index);
                            }
                            return;
                        }
                        accept(element, index);
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on dropWhile.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    filter(predicate) {
        if (isFunction(predicate)) {
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        if (predicate(element)) {
                            accept(element, index);
                        }
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on filter.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    flat(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    let stop = false;
                    this.generator((element) => {
                        let result = mapper(element);
                        if (isIterable(result)) {
                            for (let subElement of result) {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }
                        }
                        else if (isSemantic(result)) {
                            result.generator((subElement) => {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }, (element) => interrupt(element, count) || stop);
                        }
                    }, (element) => interrupt(element, count) || stop);
                }
                catch (error) {
                    throw new Error("Uncaught error on flat.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    flatMap(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    let stop = false;
                    this.generator((element) => {
                        let result = mapper(element);
                        if (isIterable(result)) {
                            for (let subElement of result) {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }
                        }
                        else if (isSemantic(result)) {
                            result.generator((subElement) => {
                                accept(subElement, count);
                                stop = stop || interrupt(subElement, count);
                                count++;
                            }, (element) => interrupt(element, count) || stop);
                        }
                    }, () => stop);
                }
                catch (error) {
                    throw new Error("Uncaught error on flatMap.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    limit(n) {
        if (isNumber(n)) {
            let limit = BigInt(n);
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    this.generator((element, index) => {
                        if (count < limit) {
                            accept(element, index);
                            count++;
                        }
                    }, (element) => interrupt(element, count) || count >= limit);
                }
                catch (error) {
                    throw new Error("Uncaught error on limit.");
                }
            });
        }
        if (isBigInt(n)) {
            let limit = n;
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    this.generator((element, index) => {
                        if (count < limit) {
                            accept(element, index);
                            count++;
                        }
                    }, (element) => interrupt(element, count) || count >= limit);
                }
                catch (error) {
                    throw new Error("Uncaught error on limit.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    map(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let stop = false;
                    this.generator((element, index) => {
                        let resolved = mapper(element);
                        accept(resolved, index);
                        stop = stop || interrupt(resolved, index);
                    }, () => stop);
                }
                catch (error) {
                    throw new Error("Uncaught error on map.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    peek(consumer) {
        if (isFunction(consumer)) {
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        accept(element, index);
                        consumer(element, index);
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on peek.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    redirect(redirector) {
        if (isFunction(redirector)) {
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        accept(element, redirector(element, index));
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on redirect.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    reverse() {
        return new Semantic((accept, interrupt) => {
            try {
                this.generator((element, index) => {
                    accept(element, -index);
                }, interrupt);
            }
            catch (error) {
                throw new Error("Uncaught error on reverse.");
            }
        });
    }
    shuffle(mapper) {
        if (isFunction(mapper)) {
            try {
                return new Semantic((accept, interrupt) => {
                    this.generator((element, index) => {
                        accept(element, mapper(element, index));
                    }, interrupt);
                });
            }
            catch (error) {
                throw new Error("Uncaught error on shuffle.");
            }
        }
        return new Semantic((accept, interrupt) => {
            try {
                this.generator((element, index) => {
                    accept(element, useRandom(index));
                }, interrupt);
            }
            catch (error) {
                throw new Error("Uncaught error on shuffle.");
            }
        });
    }
    skip(n) {
        if (isNumber(n)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    let limit = BigInt(n);
                    this.generator((element, index) => {
                        if (count < limit) {
                            count++;
                        }
                        else {
                            accept(element, index);
                        }
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on skip.");
                }
            });
        }
        if (isBigInt(n)) {
            return new Semantic((accept, interrupt) => {
                try {
                    let count = 0n;
                    this.generator((element, index) => {
                        if (count < n) {
                            count++;
                        }
                        else {
                            accept(element, index);
                        }
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on skip.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    sorted(comparator) {
        if (isFunction(comparator)) {
            try {
                return new OrderedCollectable(this.generator, comparator);
            }
            catch (error) {
                throw new Error("Uncaught error on sorted.");
            }
        }
        try {
            return new OrderedCollectable(this.generator, (a, b) => useCompare(a, b));
        }
        catch (error) {
            throw new Error("Uncaught error on sorted.");
        }
    }
    sub(start, end) {
        return new Semantic((accept, interrupt) => {
            try {
                let count = 0n;
                this.generator((element, index) => {
                    if (count < end) {
                        count++;
                        if (count >= start) {
                            accept(element, index);
                        }
                    }
                }, interrupt);
            }
            catch (error) {
                throw new Error("Uncaught error on sub.");
            }
        });
    }
    takeWhile(predicate) {
        return new Semantic((accept, interrupt) => {
            try {
                this.generator((element, index) => {
                    if (!predicate(element)) {
                        interrupt(element, index);
                        return;
                    }
                    accept(element, index);
                }, interrupt);
            }
            catch (error) {
                throw new Error("Uncaught error on takeWhile.");
            }
        });
    }
    toCollectable(mapper) {
        if (isFunction(mapper)) {
            try {
                let collectable = mapper(this.generator);
                if (isCollectable(collectable)) {
                    return collectable;
                }
            }
            catch (error) {
                throw new Error("Uncaught error on toCollectable.");
            }
        }
        try {
            return new UnorderedCollectable(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toCollectable.");
        }
    }
    toBigintStatistics() {
        try {
            return new BigIntStatistics(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toBigintStatistics.");
        }
    }
    toNumericStatistics() {
        try {
            return new NumericStatistics(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toNumericStatistics.");
        }
    }
    toOrdered() {
        try {
            return new OrderedCollectable(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toOrdered.");
        }
    }
    toUnordered() {
        try {
            return new UnorderedCollectable(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toUnordered.");
        }
    }
    toWindow() {
        try {
            return new WindowCollectable(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toWindow.");
        }
    }
    translate(argument1) {
        if (isNumber(argument1)) {
            let offset = argument1;
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        accept(element, index + BigInt(offset));
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        }
        else if (isBigInt(argument1)) {
            let offset = argument1;
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        accept(element, index + offset);
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        }
        else if (isFunction(argument1)) {
            let translator = argument1;
            return new Semantic((accept, interrupt) => {
                try {
                    this.generator((element, index) => {
                        accept(element, index + translator(element, index));
                    }, interrupt);
                }
                catch (error) {
                    throw new Error("Uncaught error on translate.");
                }
            });
        }
        throw new TypeError("Invalid arguments.");
    }
}
;
