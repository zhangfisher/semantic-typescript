export let validate = (t) => {
    return t !== null && t !== (void 0);
};
export let invalidate = (t) => {
    return t === null || t === undefined;
};
export let isBoolean = (t) => {
    return typeof t === "boolean";
};
export let isString = (t) => {
    return typeof t === "string";
};
export let isNumber = (t) => {
    return typeof t === "number";
};
export let isFunction = (t) => {
    return typeof t === "function";
};
export let isObject = (t) => {
    return typeof t === "object" && t !== null;
};
export let isSymbol = (t) => {
    return typeof t === "symbol";
};
export let isBigint = (t) => {
    return typeof t === "bigint";
};
export let isPrimitive = (t) => {
    return isBoolean(t) || isString(t) || isNumber(t) || isSymbol(t) || isBigint(t) || isFunction(t);
};
export let isIterable = (t) => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.iterator));
    }
    return false;
};
export let useCompare = (t1, t2) => {
    if (typeof t1 === typeof t2) {
        switch (typeof t1) {
            case "string":
                return t1.localeCompare(t2);
            case "number":
                return t1 - t2;
            case "bigint":
                return Number(t1 - t2);
            case "boolean":
                return t1 === t2 ? 0 : (t1 ? 1 : -1);
            case "symbol":
                return t1.toString().localeCompare(t2.toString());
            case "function":
                throw new TypeError("Cannot compare functions.");
            case "undefined":
                return 0;
            case "object":
                if (isFunction(Reflect.get(t1, Symbol.toPrimitive)) && isFunction(Reflect.get(t2, Symbol.toPrimitive))) {
                    let a = Reflect.apply(Reflect.get(t1, Symbol.toPrimitive), t1, ["default"]);
                    let b = Reflect.apply(Reflect.get(t2, Symbol.toPrimitive), t2, ["default"]);
                    if (isPrimitive(a) && isPrimitive(b)) {
                        return useCompare(a, b);
                    }
                }
                let a = Object.prototype.valueOf.call(t1);
                let b = Object.prototype.valueOf.call(t2);
                if (isPrimitive(a) && isPrimitive(b)) {
                    return useCompare(a, b);
                }
                return useCompare(Object.prototype.toString.call(t1), Object.prototype.toString.call(t2));
            default:
                throw new TypeError("Invalid type.");
        }
    }
    throw new TypeError("Cannot compare values of different types.");
};
export let useRandom = (index) => {
    if (isNumber(index)) {
        let x = Number(index);
        let phi = (1 + Math.sqrt(5)) / 2;
        let vanDerCorput = (base, n) => {
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
        return (mixed * 1000000);
    }
    if (isBigint(index)) {
        let x = BigInt(index);
        let two = 2n;
        let three = 3n;
        let scale = 1000000n;
        let vanDerCorput = (base, n) => {
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
        return random;
    }
    throw new TypeError("Invalid input type");
};
export let OptionalSymbol = Symbol.for("Optional");
export let SemanticSymbol = Symbol.for("Semantic");
export let CollectorsSymbol = Symbol.for("Collector");
export let CollectableSymbol = Symbol.for("Collectable");
export let OrderedCollectableSymbol = Symbol.for("OrderedCollectable");
export let WindowCollectableSymbol = Symbol.for("WindowCollectable");
export let StatisticsSymbol = Symbol.for("Statistics");
export let NumericStatisticsSymbol = Symbol.for("NumericStatistics");
export let BigIntStatisticsSymbol = Symbol.for("BigIntStatistics");
export let UnorderedCollectableSymbol = Symbol.for("UnorderedCollectable");
export let isOptional = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "Optional") === OptionalSymbol;
    }
    return false;
};
export let isSemantic = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "Semantic") === SemanticSymbol;
    }
    return false;
};
export let isCollector = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "Collector") === CollectorsSymbol;
    }
    return false;
};
export let isCollectable = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "Collectable") === CollectableSymbol;
    }
    return false;
};
export let isOrderedCollectable = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "OrderedCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isWindowCollectable = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "WindowCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isUnorderedCollectable = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "UnorderedCollectable") === UnorderedCollectableSymbol;
    }
    return false;
};
export let isStatistics = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "Statistics") === StatisticsSymbol;
    }
    return false;
};
export let isNumericStatistics = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "NumericStatistics") === NumericStatisticsSymbol;
    }
    return false;
};
export let isBigIntStatistics = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "BigIntStatistics") === BigIntStatisticsSymbol;
    }
    return false;
};
;
;
;
;
;
;
;
;
;
;
class Optional {
    value;
    Optional = OptionalSymbol;
    constructor(value) {
        this.value = value;
    }
    filter(predicate) {
        if (this.isPresent() && isFunction(predicate) && predicate(this.value)) {
            return new Optional(this.value);
        }
        return new Optional((void 0));
    }
    get(defaultValue) {
        if (this.isPresent()) {
            return this.value;
        }
        else {
            if (validate(defaultValue)) {
                return defaultValue;
            }
            else {
                throw new TypeError("Invalid default value and optional is empty.");
            }
        }
    }
    ifPresent(action, elseAction) {
        if (this.isPresent() && isFunction(action)) {
            action(this.value);
        }
        else if (isFunction(elseAction)) {
            elseAction();
        }
    }
    isEmpty() {
        return invalidate(this.value);
    }
    isPresent() {
        return validate(this.value);
    }
    map(mapper) {
        if (this.isPresent() && isFunction(mapper)) {
            return new Optional(mapper(this.value));
        }
        return new Optional(null);
    }
    static empty() {
        return new Optional(null);
    }
    static of(value) {
        return Optional.ofNullable(value);
    }
    static ofNullable(value = (void 0)) {
        return new Optional(value);
    }
    static ofNonNull(value) {
        if (validate(value)) {
            return new Optional(value);
        }
        throw new TypeError("Value is not valid");
    }
}
;
export let blob = (blob, chunk = 64n * 1024n) => {
    let size = Number(chunk);
    if (size <= 0) {
        throw new RangeError("Chunk size must be positive.");
    }
    if (invalidate(blob)) {
        throw new TypeError("Blob is invalid.");
    }
    return new Semantic((accept, interrupt) => {
        let stream = blob.stream();
        let reader = stream.getReader();
        let shouldStop = false;
        let currentIndex = 0n;
        let currentBuffer = new Uint8Array(size);
        let bufferPosition = 0;
        let readNext = () => {
            if (shouldStop) {
                return;
            }
            reader.read().then((readResult) => {
                if (readResult.done) {
                    if (bufferPosition > 0) {
                        let finalChunk = currentBuffer.slice(0, bufferPosition);
                        if (!interrupt(finalChunk)) {
                            accept(finalChunk, currentIndex);
                        }
                    }
                    shouldStop = true;
                    return;
                }
                let chunkData = readResult.value;
                let dataPosition = 0;
                while (dataPosition < chunkData.length && !shouldStop) {
                    let remainingSpace = size - bufferPosition;
                    let bytesToCopy = Math.min(remainingSpace, chunkData.length - dataPosition);
                    currentBuffer.set(chunkData.subarray(dataPosition, dataPosition + bytesToCopy), bufferPosition);
                    bufferPosition += bytesToCopy;
                    dataPosition += bytesToCopy;
                    if (bufferPosition === size) {
                        let completeChunk = currentBuffer.slice();
                        if (!interrupt(completeChunk)) {
                            accept(completeChunk, currentIndex);
                        }
                        currentIndex++;
                        bufferPosition = 0;
                    }
                }
                if (!shouldStop && !interrupt(chunkData)) {
                    readNext();
                }
                else {
                    shouldStop = true;
                }
            });
        };
        readNext();
    });
};
export let empty = () => {
    return new Semantic(() => { });
};
export let fill = (element, count) => {
    if (validate(element) && count > 0n) {
        return new Semantic((accept, interrupt) => {
            for (let i = 0n; i < count; i++) {
                let item = isFunction(element) ? element() : element;
                if (interrupt(item)) {
                    break;
                }
                accept(item, i);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let from = (iterable) => {
    if (isIterable(iterable)) {
        return new Semantic((accept, interrupt) => {
            let index = 0n;
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
};
export let interval = (period, delay = 0) => {
    if (period > 0 && delay >= 0) {
        return new Semantic((accept, interrupt) => {
            setTimeout(() => {
                let index = 0;
                let timer = setInterval(() => {
                    if (interrupt(index)) {
                        clearInterval(timer);
                    }
                    accept(period, BigInt(index));
                    index++;
                }, period);
            }, delay);
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let iterate = (generator) => {
    if (isFunction(generator)) {
        return new Semantic(generator);
    }
    throw new TypeError("Invalid arguments.");
};
export let range = (start, end, step = (typeof start === 'bigint' ? 1n : 1)) => {
    if ((isNumber(step) && step === 0) || (isBigint(step) && step === 0n)) {
        throw new TypeError("Step cannot be zero.");
    }
    if (isNumber(start) && isNumber(end) && isNumber(step)) {
        let minimum = start, maximum = end, limit = step;
        let condition = limit > 0 ? (i) => i < maximum : (i) => i > maximum;
        return new Semantic((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value = i;
                if (interrupt(value)) {
                    break;
                }
                accept(value, BigInt(i));
            }
        });
    }
    else if (isBigint(start) && isBigint(end) && isBigint(step)) {
        let minimum = start, maximum = end, limit = step;
        let condition = limit > 0n ? (i) => i < maximum : (i) => i > maximum;
        return new Semantic((accept, interrupt) => {
            for (let i = minimum; condition(i); i += limit) {
                let value = i;
                if (interrupt(value)) {
                    break;
                }
                accept(value, i);
            }
        });
    }
    throw new TypeError("Invalid arguments.");
};
export let websocket = (websocket) => {
    if (invalidate(websocket)) {
        throw new TypeError("WebSocket is invalid.");
    }
    return new Semantic((accept, interrupt) => {
        let index = 0n;
        let stop = false;
        websocket.addEventListener("open", (event) => {
            if (stop || interrupt(event)) {
                stop = true;
            }
            else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("message", (event) => {
            if (stop || interrupt(event)) {
                stop = true;
            }
            else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("error", (event) => {
            if (stop || interrupt(event)) {
                stop = true;
            }
            else {
                accept(event, index);
                index++;
            }
        });
        websocket.addEventListener("close", (event) => {
            if (stop || interrupt(event)) {
                stop = true;
            }
            else {
                accept(event, index);
                index++;
            }
        });
    });
};
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
                this.generator((element, index) => {
                    let result = mapper(element);
                    if (isIterable(result)) {
                        let subIndex = 0n;
                        for (let subElement of result) {
                            accept(subElement, count + subIndex + index);
                            stop = stop || interrupt(subElement);
                            count++;
                        }
                    }
                    else if (isSemantic(result)) {
                        result.generator((subElement, subIndex) => {
                            accept(subElement, count + subIndex + index);
                            stop = stop || interrupt(subElement);
                            count++;
                        }, (element) => interrupt(element) || stop);
                    }
                }, (element) => interrupt(element) || stop);
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
                            stop = stop || interrupt(subElement);
                            count++;
                        }
                    }
                    else if (isSemantic(result)) {
                        result.generator((subElement) => {
                            accept(subElement, count);
                            stop = stop || interrupt(subElement);
                            count++;
                        }, (element) => interrupt(element) || stop);
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
                }, (element) => interrupt(element) || count >= limit);
            });
        }
        if (isBigint(n)) {
            let limit = n;
            return new Semantic((accept, interrupt) => {
                let count = 0n;
                this.generator((element, index) => {
                    if (count < limit) {
                        accept(element, index);
                        count++;
                    }
                }, (element) => interrupt(element) || count >= limit);
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
                    stop = stop || interrupt(resolved);
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
        if (isBigint(n)) {
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
        return new OrderedCollectable(this.generator);
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
                    interrupt(element);
                    return;
                }
                accept(element, index);
            }, interrupt);
        });
    }
    toOrdered() {
        return new OrderedCollectable(this.generator);
    }
    toNumericStatistics() {
        return new NumericStatistics(this.generator);
    }
    toBigintStatistics() {
        return new BigIntStatistics(this.generator);
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
        else if (isBigint(argument1)) {
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
export class Collector {
    identity;
    interruptor;
    accumulator;
    finisher;
    Collector = CollectableSymbol;
    constructor(identity, interruptor, accumulator, finisher) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interruptor = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        }
        else {
            throw new TypeError("Invalid arguments");
        }
    }
    collect(parameter) {
        let accumulator = this.identity();
        let count = 0n;
        if (isFunction(parameter)) {
            parameter((element, index) => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, this.interruptor);
        }
        else if (isIterable(parameter)) {
            let iterable = parameter;
            for (let element of iterable) {
                accumulator = this.accumulator(accumulator, element, count);
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
    collect(identityOrCollector, accumulatorOrInterruptor, accumulatorOrFinisher, finisher) {
        let source = this.source();
        if (isFunction(source) || isIterable(source)) {
            if (isCollector(identityOrCollector)) {
                return identityOrCollector.collect(source);
            }
            if (isFunction(identityOrCollector) && isFunction(accumulatorOrInterruptor) && isFunction(accumulatorOrFinisher)) {
                if (isFunction(finisher)) {
                    return Collector.shortable(identityOrCollector, accumulatorOrInterruptor, accumulatorOrFinisher, finisher).collect(this.source);
                }
                return Collector.full(identityOrCollector, accumulatorOrInterruptor, accumulatorOrFinisher).collect(source);
            }
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
export class OrderedCollectable extends Collectable {
    OrderedCollectable = OrderedCollectableSymbol;
    ordered = [];
    constructor(argument1, argument2) {
        super();
        if (isIterable(argument1)) {
            let iterable = argument1;
            let index = 0n;
            for (let element of iterable) {
                this.ordered.push({ index: index, value: element });
                index++;
            }
        }
        else if (isFunction(argument1)) {
            let generator = argument1;
            generator((element, index) => {
                this.ordered.push({ index: index, value: element });
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
    }
    source() {
        this.ordered.forEach((indexed) => {
            console.log(indexed.index, indexed.value);
        });
        return this.ordered.map((indexed) => indexed.value);
    }
}
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
export class Statistics extends OrderedCollectable {
    Statistics = StatisticsSymbol;
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
    count() {
        return BigInt(this.ordered.length);
    }
    maximum(argument1) {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (useCompare(current, element) > 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            else {
                return Optional.ofNullable();
            }
        }
        else {
            let comparator = argument1;
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (comparator(current, element) > 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
        }
        return Optional.ofNullable();
    }
    minimum(argument1) {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (useCompare(current, element) < 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            else {
                return Optional.ofNullable();
            }
        }
        else {
            let comparator = argument1;
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (comparator(current, element) < 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            return Optional.ofNullable();
        }
    }
}
;
export class NumericStatistics extends Statistics {
    NumericStatistics = NumericStatisticsSymbol;
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
    range(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let minimum = this.ordered[0].value;
            let maximum = this.ordered[0].value;
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
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let minimum = mapper(this.ordered[0].value);
            let maximum = mapper(this.ordered[0].value);
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
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let summate = this.summate();
            return (summate / Number(this.count())) - (mean * mean);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / Number(this.count())) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }
    standardDeviation(argument1) {
        if (invalidate(argument1)) {
            return Math.sqrt(this.variance());
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let variance = this.variance(mapper);
            return Math.sqrt(variance);
        }
        throw new TypeError("Invalid arguments.");
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate = this.summate();
            return summate / Number(this.count());
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = this.summate(mapper);
            return summate / Number(this.count());
        }
        throw new TypeError("Invalid arguments.");
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = Number(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + Number(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = mapper(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + mapper(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let frequency = this.frequency();
            let mode = 0;
            let maxFrequency = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = this.frequency(mapper);
            let mode = 0;
            let maxFrequency = 0n;
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
    frequency(argument1) {
        if (this.isEmpty()) {
            return new Map();
        }
        if (invalidate(argument1)) {
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = Number(this.ordered[index].value);
            return value;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let lower = this.quantile(0.25);
            let upper = this.quantile(0.75);
            return upper - lower;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray();
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray();
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
}
;
export class BigIntStatistics extends Statistics {
    BigIntStatistics = BigIntStatisticsSymbol;
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
    range(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let minimum = this.ordered[0].value;
            let maximum = this.ordered[0].value;
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
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let minimum = mapper(this.ordered[0].value);
            let maximum = mapper(this.ordered[0].value);
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
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let summate = this.summate();
            return (summate / this.count()) - (mean * mean);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / this.count()) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }
    standardDeviation(argument1) {
        if (invalidate(argument1)) {
            return BigInt(Math.sqrt(Number(this.variance())));
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        throw new TypeError("Invalid arguments.");
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate = this.summate();
            return summate / this.count();
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = this.summate(mapper);
            return summate / this.count();
        }
        throw new TypeError("Invalid arguments.");
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = BigInt(Number(this.ordered[middle].value));
            if (count % 2 === 0) {
                median = (median + BigInt(Number(this.ordered[middle - 1].value))) / 2n;
                return median;
            }
            return median;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let count = this.count();
            let middle = count / 2n;
            let median = mapper(this.ordered[Number(middle)].value);
            if (count % 2n === 0n) {
                median = (median + mapper(this.ordered[Number(middle - 1n)].value)) / 2n;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let frequency = this.frequency();
            let mode = 0n;
            let maxFrequency = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = this.frequency(mapper);
            let mode = 0n;
            let maxFrequency = 0n;
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
    frequency(argument1) {
        if (this.isEmpty()) {
            return new Map();
        }
        if (invalidate(argument1)) {
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                summate += current;
            }
            return summate;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }
    quantile(quantile, mapper) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(mapper)) {
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = BigInt(Number(this.ordered[index].value));
            return value;
        }
        else if (isFunction(mapper)) {
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
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let lower = this.quantile(0.25);
            let upper = this.quantile(0.75);
            return upper - lower;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray();
            let summate = 0n;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
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
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray();
            let summate = 0n;
            let count = data.length;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            let count = data.length;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        }
        throw new TypeError("Invalid arguments.");
    }
}
;
