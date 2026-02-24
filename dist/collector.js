import { isBigInt, isBoolean, isCollectable, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import { HashMap } from "./map";
import { Optional } from "./optional";
import { HashSet } from "./set";
import { CollectableSymbol } from "./symbol";
import { validate, invalidate } from "./utility";
export class Collector {
    identity;
    interrupt;
    accumulator;
    finisher;
    Collector = CollectableSymbol;
    constructor(identity, interrupt, accumulator, finisher) {
        if (isFunction(identity) && isFunction(interrupt) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interrupt;
            this.accumulator = accumulator;
            this.finisher = finisher;
            Object.defineProperties(this, {
                "identity": {
                    value: identity,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "interrupt": {
                    value: interrupt,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "accumulator": {
                    value: accumulator,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "finisher": {
                    value: finisher,
                    writable: false,
                    enumerable: true,
                    configurable: false
                },
                "Collector": {
                    value: CollectableSymbol,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            });
            Object.freeze(this);
        }
        else {
            throw new TypeError("Invalid arguments");
        }
    }
    collect(argument1, argument2) {
        let accumulator = this.identity();
        let count = 0n;
        if (isFunction(argument1)) {
            let generator = argument1;
            generator((element, index) => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, (element, index) => this.interrupt(element, index, accumulator));
        }
        else if (isIterable(argument1)) {
            let iterable = argument1;
            let index = 0n;
            for (let element of iterable) {
                if (this.interrupt(element, index, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, element, count);
                count++;
                index++;
            }
        }
        else if (isSemantic(argument1)) {
            let semantic = argument1;
            let generator = Reflect.get(semantic, "generator");
            if (isFunction(generator)) {
                generator((element, index) => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element, index) => this.interrupt(element, index, accumulator));
            }
            else {
                throw new TypeError("Invalid arguments");
            }
        }
        else if (isCollectable(argument1)) {
            let collectable = argument1;
            let source = collectable.source();
            if (isFunction(source)) {
                let generator = source;
                generator((element, index) => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element, index) => this.interrupt(element, index, accumulator));
            }
        }
        else if (isNumber(argument1) && isNumber(argument2)) {
            let start = argument1 < argument2 ? argument1 : argument2;
            let end = argument1 > argument2 ? argument1 : argument2;
            for (let i = start; i < end; i++) {
                if (this.interrupt(i, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i, count);
                count++;
            }
        }
        else if (isBigInt(argument1) && isBigInt(argument2)) {
            let start = argument1 < argument2 ? argument1 : argument2;
            let end = argument1 > argument2 ? argument1 : argument2;
            for (let i = start; i < end; i++) {
                if (this.interrupt(i, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i, count);
                count++;
            }
        }
        return this.finisher(accumulator);
    }
    static full(identity, accumulator, finisher) {
        return new Collector(identity, () => false, accumulator, finisher);
    }
    static shortable(identity, interrupt, accumulator, finisher) {
        return new Collector(identity, interrupt, accumulator, finisher);
    }
}
;
;
export let useAnyMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => false, (_element, _index, accumulator) => isBoolean(accumulator) && accumulator, (accumulator, element, index) => accumulator || predicate(element, index), (accumulator) => accumulator);
    }
    throw new TypeError("Predicate must be a function.");
};
;
export let useAllMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => true, (_element, _index, accumulator) => isBoolean(accumulator) && !accumulator, (accumulator, element, index) => accumulator && predicate(element, index), (accumulator) => accumulator);
    }
    throw new TypeError("Predicate must be a function.");
};
;
export let useCollect = (argument1, argument2, argument3, argument4) => {
    if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
        let identity = argument1;
        let interrupt = argument2;
        let accumulator = argument3;
        let finisher = argument4;
        return Collector.shortable(identity, interrupt, accumulator, finisher);
    }
    if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
        let identity = argument1;
        let accumulator = argument2;
        let finisher = argument3;
        return Collector.full(identity, accumulator, finisher);
    }
    throw new TypeError("Identity, accumulator, and finisher must be functions.");
};
export let useCount = () => {
    return Collector.full(() => 0n, (count) => count + 1n, (count) => count);
};
;
export let useError = (argument1, argument2, argument3) => {
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix = argument1;
        let accumulator = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.error(result);
            return result;
        });
    }
    else if (isFunction(argument1)) {
        let prefix = "[";
        let accumulator = argument2;
        let suffix = "]";
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.error(result);
            return result;
        });
    }
    else {
        return Collector.full(() => "[", (accumulator, element) => {
            if (isString(accumulator) && isString(element)) {
                return accumulator + element + ",";
            }
            return String(accumulator) + String(element) + ",";
        }, (text) => {
            let result = text.substring(0, Math.max(1, text.length - 1)) + "]";
            console.error(result);
            return result;
        });
    }
};
;
export let useFindAt = (index) => {
    let target = useToBigInt(index);
    if (target < 0n) {
        return Collector.full(() => [], (accumulator, element) => {
            accumulator.push(element);
            return accumulator;
        }, (accumulator) => {
            if (accumulator.length === 0) {
                return Optional.empty();
            }
            let limited = (((BigInt(accumulator.length)) % target) + target) % target;
            return Optional.ofNullable(accumulator[Number(limited)]);
        });
    }
    return Collector.shortable(() => [], (_element, _index, accumulator) => BigInt(accumulator.length) - 1n === target, (accumulator, element) => {
        accumulator.push(element);
        return accumulator;
    }, (accumulator) => {
        if (accumulator.length === 0) {
            return Optional.empty();
        }
        return Optional.ofNullable(accumulator[Number(target)]);
    });
};
export let useFindFirst = () => {
    return Collector.shortable(() => Optional.empty(), (_element, _index, accumulator) => validate(accumulator) && accumulator.isPresent(), (accumulator, element) => {
        if (validate(accumulator) && accumulator.isPresent()) {
            return accumulator;
        }
        return Optional.ofNullable(element);
    }, (accumulator) => accumulator);
};
export let useFindAny = () => {
    return Collector.shortable(() => Optional.empty(), (_element, _index, accumulator) => validate(accumulator) && accumulator.isPresent(), (accumulator, element) => {
        if (validate(accumulator) && accumulator.isPresent() && Math.random() < 0.5) {
            return accumulator;
        }
        return Optional.ofNullable(element);
    }, (accumulator) => accumulator);
};
export let useFindLast = () => {
    return Collector.full(() => Optional.empty(), (accumulator, element) => {
        if (validate(accumulator) && accumulator.isPresent()) {
            return Optional.ofNullable(element);
        }
        return accumulator;
    }, (accumulator) => accumulator);
};
export let useFindMaximum = (comparator = (useCompare)) => {
    return Collector.full(() => Optional.ofNullable(), (accumulator, element) => {
        if (accumulator.isPresent()) {
            return comparator(accumulator.get(), element) > 0 ? accumulator : Optional.ofNullable(element);
        }
        return Optional.ofNullable(element);
    }, (result) => result);
};
export let useFindMinimum = (comparator = (useCompare)) => {
    return Collector.full(() => Optional.ofNullable(), (accumulator, element) => {
        if (accumulator.isPresent()) {
            return comparator(accumulator.get(), element) < 0 ? accumulator : Optional.ofNullable(element);
        }
        return Optional.ofNullable(element);
    }, (result) => result);
};
;
export let useForEach = (action) => {
    if (isFunction(action)) {
        return Collector.full(() => 0n, (accumulator, element, index) => {
            action(element, index);
            return accumulator + 1n;
        }, (accumulator) => accumulator);
    }
    throw new TypeError("Action must be a function.");
};
;
export let useNoneMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => true, (_element, _index, accumulator) => !accumulator, (accumulator, element, index) => accumulator && !predicate(element, index), (accumulator) => !accumulator);
    }
    throw new TypeError("Predicate must be a function.");
};
;
export let useGroup = (classifier) => {
    if (isFunction(classifier)) {
        return Collector.full(() => new Map(), (accumulator, element, index) => {
            let key = classifier(element, index);
            let group = accumulator.get(key) || [];
            group.push(element);
            accumulator.set(key, group);
            return accumulator;
        }, (accumulator) => accumulator);
    }
    throw new TypeError("Classifier must be a function.");
};
export let useGroupBy = (keyExtractor, valueExtractor) => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(() => new Map(), (accumulator, element, index) => {
            let key = keyExtractor(element, index);
            let group = accumulator.get(key) || [];
            group.push(valueExtractor(element, index));
            accumulator.set(key, group);
            return accumulator;
        }, (accumulator) => accumulator);
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};
;
export let useJoin = (argument1, argument2, argument3) => {
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full(() => "[", (text, element) => text + element + ",", (text) => text.substring(0, text.length - 1) + "]");
    }
    if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let delimiter = argument1;
        return Collector.full(() => "[", (text, element) => text + element + delimiter, (text) => text.substring(0, text.length - delimiter.length) + "]");
    }
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix = argument1;
        let accumulator = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, accumulator, (text) => text + suffix);
    }
    if (isString(argument1) && isString(argument2) && isString(argument3)) {
        let prefix = argument1;
        let delimiter = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, (text, element) => text + element + delimiter, (text) => text + suffix);
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useLog = (argument1, argument2, argument3) => {
    if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix = argument1;
        let accumulator = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.log(result);
            return result;
        });
    }
    else if (isFunction(argument1)) {
        let prefix = "[";
        let accumulator = argument2;
        let suffix = "]";
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.log(result);
            return result;
        });
    }
    else {
        return Collector.full(() => "[", (accumulator, element) => {
            console.log(element);
            if (isString(accumulator) && isString(element)) {
                return accumulator + element + ",";
            }
            return String(accumulator) + String(element) + ",";
        }, (text) => {
            let result = text.substring(0, Math.max(1, text.length - 1)) + "]";
            console.log(result);
            return result;
        });
    }
};
export let usePartition = (count) => {
    if (isBigInt(count)) {
        let limited = count > 1n ? count : 1n;
        return Collector.full(() => {
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
    throw new TypeError("Count must be a BigInt.");
};
;
export let usePartitionBy = (classifier) => {
    if (isFunction(classifier)) {
        return Collector.full(() => {
            return [];
        }, (array, element, index) => {
            let resolved = classifier(element, index);
            while (resolved > BigInt(array.length) - 1n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result) => {
            return result;
        });
    }
    throw new TypeError("Classifier must be a function.");
};
;
export let useReduce = (argument1, argument2, argument3) => {
    if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator = argument1;
        return Collector.full(() => Optional.ofNullable(), (result, element, index) => {
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
        return Collector.full(() => identity, accumulator, (result) => result);
    }
    else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
        let identity = argument1;
        let accumulator = argument2;
        let finisher = argument3;
        return Collector.full(() => identity, accumulator, finisher);
    }
    else {
        throw new TypeError("Invalid arguments.");
    }
};
export let useToArray = () => {
    return Collector.full(() => [], (array, element) => {
        array.push(element);
        return array;
    }, (array) => array);
};
;
export let useToMap = (keyExtractor, valueExtractor) => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(() => new Map(), (map, element, index) => {
            let key = keyExtractor(element, index);
            let value = valueExtractor(element, index);
            map.set(key, value);
            return map;
        }, (map) => map);
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};
;
export let useToHashMap = (keyExtractor, valueExtractor) => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(() => new HashMap(), (map, element, index) => {
            let key = keyExtractor(element, index);
            let value = valueExtractor(element, index);
            map.set(key, value);
            return map;
        }, (map) => map);
    }
    throw new TypeError("Key extractor and value extractor must be functions.");
};
export let useToSet = () => {
    return Collector.full(() => new Set(), (set, element) => {
        set.add(element);
        return set;
    }, (set) => set);
};
export let useToHashSet = () => {
    return Collector.full(() => new HashSet(), (set, element) => {
        set.add(element);
        return set;
    }, (set) => set);
};
;
export let useWrite = (argument1, argument2) => {
    if (isObject(argument1)) {
        if (isFunction(argument2)) {
            let stream = argument1;
            let accumulator = argument2;
            return Collector.full(() => Promise.resolve(stream), (promise, element, index) => {
                return new Promise((resolve, reject) => {
                    promise.then((stream) => {
                        try {
                            resolve(accumulator(stream, element, index));
                        }
                        catch (error) {
                            reject(error);
                        }
                    }).catch(reject);
                });
            }, (promise) => promise);
        }
        else {
            let stream = argument1;
            return Collector.full(() => Promise.resolve(stream), (promise, element) => {
                return new Promise((resolve, reject) => {
                    promise.then((stream) => {
                        try {
                            let writer = stream.getWriter();
                            writer.write(String(element));
                            resolve(stream);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }).catch(reject);
                });
            }, (promise) => promise);
        }
    }
    throw new TypeError("Invalid arguments.");
};
;
export let useNumericSummate = (mapper = useToNumber) => {
    return Collector.full(() => 0, (accumulator, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        return accumulator + (isNumber(resolved) ? resolved : 0);
    }, (result) => result);
};
;
export let useBigIntSummate = (mapper = useToBigInt) => {
    return Collector.full(() => 0n, (accumulator, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        return accumulator + (isBigInt(resolved) ? resolved : 0n);
    }, (result) => result);
};
;
;
export let useNumericAverage = (mapper = useToNumber) => {
    return Collector.full(() => {
        return {
            summate: 0,
            count: 0
        };
    }, (accumulator, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
            count: accumulator.count + 1
        };
    }, (result) => {
        if (result.count === 0) {
            return 0;
        }
        return result.summate / result.count;
    });
};
;
;
export let useBigIntAverage = (mapper = useToBigInt) => {
    return Collector.full(() => {
        return {
            summate: 0n,
            count: 0n
        };
    }, (accumulator, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
            count: accumulator.count + 1n
        };
    }, (result) => {
        if (result.count === 0n) {
            return 0n;
        }
        return result.summate / result.count;
    });
};
export let useFrequency = () => {
    return Collector.full(() => new Map(), (map, element) => {
        let count = map.get(element) || 0n;
        map.set(element, count + 1n);
        return map;
    }, (map) => map);
};
;
export let useNumericMode = (mapper = useToNumber) => {
    return Collector.full(() => new Map(), (map, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        let count = map.get(resolved) || 0n;
        map.set(resolved, count + 1n);
        return map;
    }, (map) => {
        let maxCount = 0n;
        let mode = 0;
        for (let [key, value] of map) {
            if (value > maxCount) {
                maxCount = value;
                mode = key;
            }
        }
        return mode;
    });
};
;
export let useBigIntMode = (mapper = useToBigInt) => {
    return Collector.full(() => new Map(), (map, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        let count = map.get(resolved) || 0n;
        map.set(resolved, count + 1n);
        return map;
    }, (map) => {
        let maxCount = 0n;
        let mode = 0n;
        for (let [key, value] of map) {
            if (value > maxCount) {
                maxCount = value;
                mode = key;
            }
        }
        return mode;
    });
};
;
;
export let useNumericVariance = (mapper = useToNumber) => {
    return Collector.full(() => {
        return {
            summate: 0,
            summateOfSquares: 0,
            count: 0
        };
    }, (accumulator, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
            summateOfSquares: accumulator.summateOfSquares + (isNumber(resolved) ? Math.pow(resolved, 2) : 0),
            count: accumulator.count + 1
        };
    }, (result) => {
        if (result.count < 2) {
            return 0;
        }
        let mean = result.summate / result.count;
        let variance = (result.summateOfSquares / result.count) - Math.pow(mean, 2);
        return variance;
    });
};
;
;
export let useBigIntVariance = (mapper = useToBigInt) => {
    return Collector.full(() => {
        return {
            summate: 0n,
            summateOfSquares: 0n,
            count: 0n
        };
    }, (accumulator, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
            summateOfSquares: accumulator.summateOfSquares + (isBigInt(resolved) ? resolved * resolved : 0n),
            count: accumulator.count + 1n
        };
    }, (result) => {
        if (result.count < 2n) {
            return 0n;
        }
        let mean = result.summate / result.count;
        let variance = (result.summateOfSquares / result.count) - (mean * mean);
        return variance;
    });
};
;
;
export let useNumericStandardDeviation = (mapper = useToNumber) => {
    return Collector.full(() => {
        return {
            summate: 0,
            summateOfSquares: 0,
            count: 0
        };
    }, (accumulator, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isNumber(resolved) ? resolved : 0),
            summateOfSquares: accumulator.summateOfSquares + (isNumber(resolved) ? Math.pow(resolved, 2) : 0),
            count: accumulator.count + 1
        };
    }, (result) => {
        if (result.count < 2) {
            return 0;
        }
        let mean = result.summate / result.count;
        let variance = (result.summateOfSquares / result.count) - Math.pow(mean, 2);
        let standardDeviation = Math.sqrt(variance);
        return standardDeviation;
    });
};
;
;
export let useBigIntStandardDeviation = (mapper = useToBigInt) => {
    return Collector.full(() => {
        return {
            summate: 0n,
            summateOfSquares: 0n,
            count: 0n
        };
    }, (accumulator, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        return {
            summate: accumulator.summate + (isBigInt(resolved) ? resolved : 0n),
            summateOfSquares: accumulator.summateOfSquares + (isBigInt(resolved) ? resolved * resolved : 0n),
            count: accumulator.count + 1n
        };
    }, (result) => {
        if (result.count < 2n) {
            return 0n;
        }
        let mean = result.summate / result.count;
        let variance = (result.summateOfSquares / result.count) - (mean * mean);
        let standardDeviation = BigInt(Math.sqrt(Number(variance)));
        return standardDeviation;
    });
};
;
export let useNumericMedian = (mapper = useToNumber) => {
    return Collector.full(() => [], (array, element) => {
        let resolved = isNumber(element) ? element : mapper(element);
        array.push(resolved);
        array.sort((a, b) => a - b);
        return array;
    }, (array) => {
        let length = array.length;
        if (length % 2 === 0) {
            let mid = length / 2;
            return (array[mid - 1] + array[mid]) / 2;
        }
        else {
            let mid = Math.floor(length / 2);
            return array[mid];
        }
    });
};
;
export let useBigIntMedian = (mapper = useToBigInt) => {
    return Collector.full(() => [], (array, element) => {
        let resolved = isBigInt(element) ? element : mapper(element);
        array.push(resolved);
        array.sort((a, b) => Number(a - b));
        return array;
    }, (array) => {
        let length = array.length;
        if (length % 2 === 0) {
            let mid = length / 2;
            return (array[Number(mid - 1)] + array[mid]) / 2n;
        }
        else {
            let mid = Math.floor(length / 2);
            return array[mid];
        }
    });
};
export let useToGeneratorFunction = () => {
    return Collector.full(() => [], (array, element) => {
        array.push(element);
        return array;
    }, (array) => {
        return (function* () {
            for (let element of array) {
                yield element;
            }
        })();
    });
};
export let useToAsyncGeneratorFunction = () => {
    return Collector.full(() => [], (array, element) => {
        array.push(element);
        return array;
    }, (array) => {
        return (async function* () {
            for (let element of array) {
                yield element;
            }
        })();
    });
};
