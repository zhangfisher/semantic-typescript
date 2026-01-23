import { isBigInt, isBoolean, isCollectable, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { Optional } from "./optional";
import { CollectableSymbol } from "./symbol";
import { validate, invalidate } from "./utility";
export class Collector {
    identity;
    interrupt;
    accumulator;
    finisher;
    Collector = CollectableSymbol;
    constructor(identity, interruptor, accumulator, finisher) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
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
            if (isIterable(source)) {
                let iterable = source;
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
            else if (isFunction(source)) {
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
    static shortable(identity, interruptor, accumulator, finisher) {
        return new Collector(identity, interruptor, accumulator, finisher);
    }
}
;
export let useAnyMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => false, (_element, _index, accumulator) => isBoolean(accumulator) && accumulator, (accumulator, element) => accumulator || predicate(element), (accumulator) => accumulator);
    }
    throw new TypeError("Predicate must be a function.");
};
export let useAllMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => true, (_element, _index, accumulator) => isBoolean(accumulator) && !accumulator, (accumulator, element) => accumulator && predicate(element), (accumulator) => accumulator);
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
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full(() => "[", (accumulator, element) => {
            if (isString(accumulator) && isString(element)) {
                return accumulator + element + ",";
            }
            return String(accumulator) + String(element) + ",";
        }, (text) => {
            let result = text.substring(0, text.length - 1) + "]";
            console.error(result);
            return result;
        });
    }
    else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator = argument1;
        return Collector.full(() => "[", accumulator, (text) => {
            let result = text.substring(0, text.length - 1) + "]";
            console.error(result);
            return result;
        });
    }
    else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix = argument1;
        let accumulator = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.error(result);
            return result;
        });
    }
    else {
        throw new TypeError("Invalid arguments.");
    }
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
export let useNoneMatch = (predicate) => {
    if (isFunction(predicate)) {
        return Collector.shortable(() => true, (_element, _index, accumulator) => !accumulator, (accumulator, element) => accumulator && !predicate(element), (accumulator) => !accumulator);
    }
    throw new TypeError("Predicate must be a function.");
};
export let useGroup = (classifier) => {
    if (isFunction(classifier)) {
        return Collector.full(() => new Map(), (accumulator, element) => {
            let key = classifier(element);
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
        return Collector.full(() => new Map(), (accumulator, element) => {
            let key = keyExtractor(element);
            let group = accumulator.get(key) || [];
            group.push(valueExtractor(element));
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
    if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
        return Collector.full(() => "[", (accumulator, element) => {
            if (isString(accumulator) && isString(element)) {
                return accumulator + element + ",";
            }
            return String(accumulator) + String(element) + ",";
        }, (text) => {
            let result = text.substring(0, text.length - 1) + "]";
            console.log(result);
            return result;
        });
    }
    else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
        let accumulator = argument1;
        return Collector.full(() => "[", accumulator, (text) => {
            let result = text.substring(0, text.length - 1) + "]";
            console.log(result);
            return result;
        });
    }
    else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
        let prefix = argument1;
        let accumulator = argument2;
        let suffix = argument3;
        return Collector.full(() => prefix, accumulator, (text) => {
            let result = text + suffix;
            console.log(result);
            return result;
        });
    }
    else {
        throw new TypeError("Invalid arguments.");
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
export let usePartitionBy = (classifier) => {
    if (isFunction(classifier)) {
        return Collector.full(() => {
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
export let useToMap = (keyExtractor, valueExtractor) => {
    if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
        return Collector.full(() => new Map(), (map, element) => {
            let key = keyExtractor(element);
            let value = valueExtractor(element);
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
export let useNumericAverage = (mapper) => {
    if (isFunction(mapper)) {
        return Collector.full(() => {
            return {
                summate: 0,
                count: 0
            };
        }, (information, element) => {
            let value = mapper(element);
            information.summate += value;
            information.count++;
            return information;
        }, (information) => {
            return information.summate / information.count;
        });
    }
    return Collector.full(() => {
        return {
            summate: 0,
            count: 0
        };
    }, (information, element) => {
        information.summate += element;
        information.count++;
        return information;
    }, (information) => {
        return information.summate / information.count;
    });
};
;
export let useBigIntAverage = (mapper) => {
    if (isFunction(mapper)) {
        return Collector.full(() => {
            return {
                summate: 0n,
                count: 0n
            };
        }, (information, element) => {
            let value = mapper(element);
            information.summate += value;
            information.count++;
            return information;
        }, (information) => {
            return information.summate / information.count;
        });
    }
    return Collector.full(() => {
        return {
            summate: 0n,
            count: 0n
        };
    }, (information, element) => {
        information.summate += element;
        information.count++;
        return information;
    }, (information) => {
        return information.summate / information.count;
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
export let useSummate = (mapper) => {
    if (isFunction(mapper)) {
        return Collector.full(() => 0, (summate, element) => {
            let value = mapper(element);
            return summate + value;
        }, (summate) => summate);
    }
    return Collector.full(() => 0, (summate, element) => {
        return summate + element;
    }, (summate) => summate);
};
