import { Collectable, OrderedCollectable, UnorderedCollectable, WindowCollectable } from "./collectable";
import { isBigInt, isCollectable, isFunction, isIterable, isNumber, isSemantic } from "./guard";
import { useCompare, useRandom } from "./hook";
import { BigIntStatistics, NumericStatistics } from "./statistics";
import { SemanticSymbol } from "./symbol";
import { validate } from "./utility";
export class Semantic {
    generator;
    Semantic = SemanticSymbol;
    constructor(generator) {
        this.generator = generator;
    }
    concat(other) {
        if (isSemantic(other)) {
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
                    accept(element, index);
                    count++;
                }, interrupt);
                other.generator((element, index) => {
                    accept(element, index + count);
                }, interrupt);
            });
        }
        if (isIterable(other)) {
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
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
    distinct(comparator) {
        if (validate(comparator)) {
            return new Semantic((accept, interrupt) => {
                let array = [];
                this.generator((element, index) => {
                    if (!array.some((e) => comparator(e, element))) {
                        array.push(element);
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        return new Semantic((accept, interrupt) => {
            let set = new Set();
            this.generator((element, index) => {
                if (!set.has(element)) {
                    set.add(element);
                    accept(element, index);
                }
            }, interrupt);
        });
    }
    dropWhile(predicate) {
        if (isFunction(predicate)) {
            return new Semantic((accept, interrupt) => {
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
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    filter(predicate) {
        if (isFunction(predicate)) {
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    if (predicate(element)) {
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    flat(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
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
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    flatMap(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
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
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    limit(n) {
        if (isNumber(n)) {
            let limit = BigInt(n);
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element) => interrupt(element, count) || count >= limit);
            });
        }
        if (isBigInt(n)) {
            let limit = n;
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element) => interrupt(element, count) || count >= limit);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    map(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
                let stop = false;
                this.generator((element, index) => {
                    let resolved = mapper(element);
                    accept(resolved, index);
                    stop = stop || interrupt(resolved, index);
                }, () => stop);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    peek(consumer) {
        if (isFunction(consumer)) {
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, index);
                    consumer(element, index);
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    redirect(redirector) {
        if (isFunction(redirector)) {
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, redirector(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    reverse() {
        return new Semantic((accept, interrupt) => {
            this.generator((element, index) => {
                accept(element, -index);
            }, interrupt);
        });
    }
    shuffle(mapper) {
        if (isFunction(mapper)) {
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, mapper(element, index));
                }, interrupt);
            });
        }
        return new Semantic((accept, interrupt) => {
            this.generator((element, index) => {
                accept(element, useRandom(index));
            }, interrupt);
        });
    }
    skip(n) {
        if (isNumber(n)) {
            return new Semantic((accept, interrupt) => {
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
            });
        }
        if (isBigInt(n)) {
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
                    if (count < n) {
                        count++;
                    }
                    else {
                        accept(element, index);
                    }
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    sorted(comparator) {
        if (isFunction(comparator)) {
            return new OrderedCollectable(this.generator, comparator);
        }
        return new OrderedCollectable(this.generator, (a, b) => useCompare(a, b));
    }
    sub(start, end) {
        return new Semantic((accept, interrupt) => {
            let count = 0n;
            this.generator((element, index) => {
                if (count < end) {
                    count++;
                    if (count >= start) {
                        accept(element, index);
                    }
                }
            }, interrupt);
        });
    }
    takeWhile(predicate) {
        return new Semantic((accept, interrupt) => {
            this.generator((element, index) => {
                if (!predicate(element)) {
                    interrupt(element, index);
                    return;
                }
                accept(element, index);
            }, interrupt);
        });
    }
    toCollectable(mapper) {
        if (isFunction(mapper)) {
            let collectable = mapper(this.generator);
            if (isCollectable(collectable)) {
                return collectable;
            }
        }
        return new UnorderedCollectable(this.generator);
    }
    toBigintStatistics() {
        return new BigIntStatistics(this.generator);
    }
    toNumericStatistics() {
        return new NumericStatistics(this.generator);
    }
    toOrdered() {
        return new OrderedCollectable(this.generator);
    }
    toUnoredered() {
        return new UnorderedCollectable(this.generator);
    }
    toWindow() {
        return new WindowCollectable(this.generator);
    }
    translate(argument1) {
        if (isNumber(argument1)) {
            let offset = argument1;
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, index + BigInt(offset));
                }, interrupt);
            });
        }
        else if (isBigInt(argument1)) {
            let offset = argument1;
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, index + offset);
                }, interrupt);
            });
        }
        else if (isFunction(argument1)) {
            let translator = argument1;
            return new Semantic((accept, interrupt) => {
                this.generator((element, index) => {
                    accept(element, index + translator(element, index));
                }, interrupt);
            });
        }
        throw new TypeError("Invalid arguments.");
    }
}
;
