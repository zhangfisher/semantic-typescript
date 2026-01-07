import { Collector } from "./collector";
import { from } from "./factory";
import { isCollector, isFunction, isIterable, isObject, isString } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
export class Collectable {
    Collectable = CollectableSymbol;
    constructor() {
    }
    anyMatch(predicate) {
        return this.collect(() => {
            return false;
        }, (element) => {
            return predicate(element);
        }, (result, element) => {
            return result || predicate(element);
        }, (result) => {
            return result;
        });
    }
    allMatch(predicate) {
        return this.collect(() => {
            return true;
        }, (element) => {
            return !predicate(element);
        }, (result, element) => {
            return result && predicate(element);
        }, (result) => {
            return result;
        });
    }
    collect(argument1, argument2, argument3, argument4) {
        let source = this.source();
        if (isCollector(argument1)) {
            let collector = argument1;
            return collector.collect(source);
        }
        if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1;
            let accumulator = argument2;
            let finisher = argument3;
            let collector = Collector.full(identity, accumulator, finisher);
            return collector.collect(source);
        }
        if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
            let identity = argument1;
            let interrupt = argument2;
            let accumulator = argument3;
            let finisher = argument4;
            let collector = Collector.shortable(identity, interrupt, accumulator, finisher);
            return collector.collect(source);
        }
        throw new TypeError("Invalid arguments.");
    }
    count() {
        return this.collect(() => {
            return 0n;
        }, (count) => {
            return count + 1n;
        }, (count) => {
            return count;
        });
    }
    isEmpty() {
        return this.count() === 0n;
    }
    findAny() {
        return this.collect(() => {
            return Optional.ofNullable();
        }, () => {
            return true;
        }, (result, element) => {
            return result.isPresent() && Math.random() > 0.5 ? result : Optional.of(element);
        }, (result) => {
            return result;
        });
    }
    findFirst() {
        return this.collect(() => {
            return Optional.ofNullable();
        }, () => {
            return true;
        }, (result, element) => {
            return result.isPresent() ? result : Optional.of(element);
        }, (result) => {
            return result;
        });
    }
    findLast() {
        return this.collect(() => {
            return Optional.ofNullable();
        }, () => {
            return true;
        }, (result, element) => {
            return result.isPresent() ? result : Optional.of(element);
        }, (result) => {
            return result;
        });
    }
    forEach(action) {
        if (isFunction(action)) {
            this.collect(() => {
                return 0n;
            }, (count, element) => {
                action(element, count);
                return count + 1n;
            }, (count) => {
                return count;
            });
        }
    }
    group(classifier) {
        if (isFunction(classifier)) {
            return this.collect(() => {
                return new Map();
            }, (map, element) => {
                let key = classifier(element);
                let raw = map.get(key);
                let array = validate(raw) ? raw : [];
                array.push(element);
                map.set(key, array);
                return map;
            }, (map) => {
                return map;
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    groupBy(keyExtractor, valueExtractor) {
        return this.collect(() => {
            return new Map();
        }, (map, element) => {
            let key = keyExtractor(element);
            let value = valueExtractor(element);
            let group = (validate(map.get(key)) ? map.get(key) : []);
            group.push(value);
            map.set(key, group);
            return map;
        }, (map) => {
            return map;
        });
    }
    join(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            return this.collect(() => {
                return "[";
            }, (text, element) => {
                return text + element + ",";
            }, (text) => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let delimiter = argument1;
            return this.collect(() => {
                return "[";
            }, (text, element) => {
                return text + element + delimiter;
            }, (text) => {
                return text.substring(0, text.length - 1) + "]";
            });
        }
        if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix = argument1;
            let accumulator = argument2;
            let suffix = argument3;
            return this.collect(() => {
                return prefix;
            }, (text, element, index) => {
                return text + accumulator(text, element, index);
            }, (text) => {
                return text + suffix;
            });
        }
        if (isString(argument1) && isString(argument2) && isString(argument3)) {
            let prefix = argument1;
            let delimiter = argument2;
            let suffix = argument3;
            return this.collect(() => {
                return prefix;
            }, (text, element) => {
                return text + element + delimiter;
            }, (text) => {
                return text + suffix;
            });
        }
        throw new TypeError("Invalid arguments.");
    }
    log(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let text = this.join();
            console.log(text);
        }
        else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1;
            let text = this.join("[", accumulator, "]");
            console.log(text);
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    nonMatch(predicate) {
        return this.collect(() => {
            return true;
        }, (element) => {
            return predicate(element);
        }, (result, element) => {
            return result || predicate(element);
        }, (result) => {
            return result;
        });
    }
    partition(count) {
        let limited = count > 1n ? count : 1n;
        return this.collect(() => {
            return [];
        }, (array, element) => {
            let index = limited % BigInt(array.length);
            if (index === 0n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result) => {
            return result;
        });
    }
    partitionBy(classifier) {
        return this.collect(() => {
            return [];
        }, (array, element) => {
            let index = classifier(element);
            while (index > BigInt(array.length) - 1n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result) => {
            return result;
        });
    }
    reduce(argument1, argument2, argument3) {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1;
            return this.collect(() => Optional.ofNullable(), (result, element, index) => {
                if (result.isEmpty()) {
                    return Optional.of(element);
                }
                else {
                    let current = result.get();
                    return Optional.of(accumulator(current, element, index));
                }
            }, (result) => result);
        }
        else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            let identity = argument1;
            let accumulator = argument2;
            return this.collect(() => identity, (result, element, index) => {
                return accumulator(result, element, index);
            }, (result) => result);
        }
        else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1;
            let accumulator = argument2;
            let finisher = argument3;
            return this.collect(() => identity, (result, element, index) => {
                return accumulator(result, element, index);
            }, (result) => finisher(result, result));
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    semantic() {
        let source = this.source();
        if (isIterable(source)) {
            return from(source);
        }
        else if (isFunction(source)) {
            return new Semantic(source);
        }
        else {
            throw new TypeError("Invalid source.");
        }
    }
    toArray() {
        return this.collect(() => {
            return [];
        }, (array, element) => {
            array.push(element);
            return array;
        }, (result) => {
            return result;
        });
    }
    toMap(keyExtractor, valueExtractor) {
        return this.collect(() => {
            return new Map();
        }, (map, element) => {
            let key = keyExtractor(element);
            let value = valueExtractor(element);
            map.set(key, value);
            return map;
        }, (map) => {
            return map;
        });
    }
    toSet() {
        return this.collect(() => {
            return new Set();
        }, (set, element) => {
            set.add(element);
            return set;
        }, (result) => {
            return result;
        });
    }
    write(stream, accumulator) {
        if (isObject(stream) && invalidate(accumulator)) {
            let optional = this.collect(() => {
                return Optional.ofNonNull(stream);
            }, (result, element) => {
                try {
                    return result.map((stream) => {
                        let writer = stream.getWriter();
                        writer.write(String(element));
                        return stream;
                    });
                }
                catch (reason) {
                    return Optional.empty();
                }
            }, (a) => {
                return a;
            });
            return new Promise((resolve, reject) => {
                optional.ifPresent(resolve, reject);
            });
        }
        else if (isObject(stream) && isFunction(accumulator)) {
            let optional = this.collect(() => {
                return Optional.ofNonNull(stream);
            }, (result, element, index) => {
                try {
                    return result.map((stream) => {
                        let writer = stream.getWriter();
                        writer.write(accumulator(element, index));
                        return stream;
                    });
                }
                catch (reason) {
                    return Optional.empty();
                }
            }, (a) => {
                return a;
            });
            return new Promise((resolve, reject) => {
                optional.ifPresent(resolve, reject);
            });
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
}
;
export class UnorderedCollectable extends Collectable {
    UnorderedCollectable = UnorderedCollectableSymbol;
    generator;
    constructor(generator) {
        super();
        this.generator = generator;
    }
    source() {
        return this.generator;
    }
}
;
export class OrderedCollectable extends Collectable {
    OrderedCollectable = OrderedCollectableSymbol;
    ordered = [];
    constructor(argument1, argument2) {
        super();
        let buffer = [];
        if (isIterable(argument1)) {
            let iterable = argument1;
            let index = 0n;
            for (let element of iterable) {
                buffer.push({
                    index: index,
                    value: element
                });
                index++;
            }
        }
        else if (isFunction(argument1)) {
            let generator = argument1;
            generator((element, index) => {
                buffer.push({
                    index: index,
                    value: element
                });
            }, () => false);
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
        if (isFunction(argument2)) {
            let comparator = argument2;
            this.ordered = this.ordered.sort((a, b) => comparator(a.value, b.value)).map((indexed, index) => {
                return {
                    index: BigInt(index),
                    value: indexed.value
                };
            });
        }
        else {
            this.ordered = this.ordered.sort((a, b) => {
                return useCompare(a.value, b.value);
            }).map((indexed, index) => {
                return {
                    index: BigInt(index),
                    value: indexed.value
                };
            });
        }
        buffer.map((indexed, _index, array) => {
            let length = BigInt(array.length);
            return {
                index: ((indexed.index % length) + length) % length,
                value: indexed.value
            };
        }).sort((a, b) => {
            return useCompare(a.index, b.index);
        }).forEach((indexed) => {
            this.ordered.push(indexed);
        });
    }
    source() {
        this.ordered.forEach((indexed) => {
            console.log(indexed.index, indexed.value);
        });
        return this.ordered.map((indexed) => indexed.value);
    }
}
;
export class WindowCollectable extends OrderedCollectable {
    WindowCollectable = WindowCollectableSymbol;
    constructor(parameter, comparator) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
        else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
    }
    slide(size, step = 1n) {
        if (size > 0n && step > 0n) {
            let source = this.toArray();
            let windows = [];
            let windowStartIndex = 0n;
            while (windowStartIndex < BigInt(source.length)) {
                let windowEnd = windowStartIndex + size;
                let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                if (window.length > 0) {
                    windows.push(window);
                }
                windowStartIndex += step;
            }
            return from(windows).map((window) => from(window));
        }
        throw new RangeError("Invalid arguments.");
    }
    tumble(size) {
        return this.slide(size, size);
    }
}
;
