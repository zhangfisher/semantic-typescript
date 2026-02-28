import { useAnyMatch, useAllMatch, Collector, useCollect, useCount, useError, useFindAny, useFindAt, useFindFirst, useFindLast, useFindMaximum, useFindMinimum, useForEach, useGroup, useGroupBy, useJoin, useLog, useNoneMatch, usePartition, usePartitionBy, useReduce, useToArray, useToMap, useToSet, useWrite, useFrequency, useNumericAverage, useNumericVariance, useNumericStandardDeviation, useNumericMedian, useNumericMode, useNumericSummate, useBigIntAverage, useBigIntVariance, useBigIntMedian, useBigIntMode, useBigIntSummate } from "./collector";
import { isBigInt, isCollectable, isCollector, isFunction, isIterable, isNumber, isObject, isSemantic, isString } from "./guard";
import { useHash } from "./hash";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import { AsyncCollectableSymbol, BigIntStatisticsSymbol, CollectableSymbol, NumericStatisticsSymbol, OrderedCollectableSymbol, SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
export class Semantic {
    generator;
    Semantic = SemanticSymbol;
    constructor(generator) {
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
    distinct(argument1) {
        let keyExtractor = validate(argument1) ? argument1 : (element) => element;
        return new Semantic((accept, interrupt) => {
            try {
                let set = new Set();
                this.generator((element, index) => {
                    let key = keyExtractor(element, index);
                    if (!set.has(key)) {
                        set.add(key);
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
                            if (!predicate(element, index)) {
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
                        if (predicate(element, index)) {
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
                    this.generator((element, index) => {
                        let result = mapper(element, index);
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
                    this.generator((element, index) => {
                        let result = mapper(element, index);
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
                        let resolved = mapper(element, index);
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
                    accept(element, useHash(element, index));
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
                    if (!predicate(element, index)) {
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
    toEvent() {
        try {
            return new EventCollectable(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on toEvent.");
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
            throw new Error(String(error));
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
export class Collectable {
    Collectable = CollectableSymbol;
    constructor() {
        Object.defineProperty(this, "Collectable", {
            value: CollectableSymbol,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }
    anyMatch(predicate) {
        if (isFunction(predicate)) {
            try {
                return useAnyMatch(predicate).collect(this);
            }
            catch (error) {
                throw new Error("Uncaught error on anyMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }
    allMatch(predicate) {
        return useAllMatch(predicate).collect(this);
    }
    collect(argument1, argument2, argument3, argument4) {
        try {
            if (isCollector(argument1)) {
                let collector = argument1;
                return collector.collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
                let identity = argument1;
                let accumulator = argument2;
                let finisher = argument3;
                return useCollect(identity, accumulator, finisher).collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
                let identity = argument1;
                let interrupt = argument2;
                let accumulator = argument3;
                let finisher = argument4;
                return useCollect(identity, interrupt, accumulator, finisher).collect(this);
            }
        }
        catch (error) {
            throw new Error("Uncaught error on collect.");
        }
        throw new TypeError("Invalid arguments.");
    }
    count() {
        return useCount().collect(this.source());
    }
    error(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                useError().collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on error.");
            }
        }
        else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator = argument1;
                useError(accumulator).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on error.");
            }
        }
        else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix = argument1;
                let accumulator = argument2;
                let suffix = argument3;
                useError(prefix, accumulator, suffix).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on error.");
            }
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    isEmpty() {
        return this.count() === 0n;
    }
    findAny() {
        try {
            return useFindAny().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on findAny.");
        }
    }
    findAt(index) {
        if (isBigInt(index)) {
            try {
                return useFindAt(index).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on findAt.");
            }
        }
        else if (isNumber(index)) {
            try {
                return useFindAt(index).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on findAt.");
            }
        }
        throw new TypeError("Index must be a bigint.");
    }
    findFirst() {
        try {
            return useFindFirst().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on findFirst.");
        }
    }
    findLast() {
        try {
            return useFindLast().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on findLast.");
        }
    }
    findMaximum(argument1) {
        try {
            let comparator = isFunction(argument1) ? argument1 : useCompare;
            return useFindMaximum(comparator).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on findMaximum.");
        }
    }
    findMinimum(argument1) {
        try {
            let comparator = isFunction(argument1) ? argument1 : useCompare;
            return useFindMinimum(comparator).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on findMinimum.");
        }
    }
    forEach(action) {
        if (isFunction(action)) {
            try {
                useForEach(action).collect(this);
            }
            catch (error) {
                throw new Error("Uncaught error on forEach.");
            }
        }
        else {
            throw new TypeError("Action must be a function.");
        }
    }
    group(classifier) {
        if (isFunction(classifier)) {
            try {
                return useGroup(classifier).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on group.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }
    groupBy(keyExtractor, valueExtractor) {
        if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
            try {
                return useGroupBy(keyExtractor, valueExtractor).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on groupBy.");
            }
        }
        throw new TypeError("Key and value extractors must be functions.");
    }
    join(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                return useJoin().collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        else if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let delimiter = argument1;
                return useJoin(delimiter).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix = argument1;
                let accumulator = argument2;
                let suffix = argument3;
                return useJoin(prefix, accumulator, suffix).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        else if (isString(argument1) && isString(argument2) && isString(argument3)) {
            try {
                let prefix = argument1;
                let delimiter = argument2;
                let suffix = argument3;
                return useJoin(prefix, delimiter, suffix).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }
    log(argument1, argument2, argument3) {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator = argument1;
                useLog(accumulator).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on log.");
            }
        }
        else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix = argument1;
                let accumulator = argument2;
                let suffix = argument3;
                useLog(prefix, accumulator, suffix).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on log.");
            }
        }
        else {
            try {
                useLog().collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on log.");
            }
        }
    }
    nonMatch(predicate) {
        if (isFunction(predicate)) {
            try {
                return useNoneMatch(predicate).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on nonMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }
    partition(count) {
        if (isBigInt(count)) {
            try {
                return usePartition(count).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on partition.");
            }
        }
        throw new TypeError("Count must be a BigInt.");
    }
    partitionBy(classifier) {
        if (isFunction(classifier)) {
            try {
                let collector = usePartitionBy(classifier);
                return collector.collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on partitionBy.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }
    reduce(argument1, argument2, argument3) {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator = argument1;
                return useReduce(accumulator).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        }
        else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            try {
                let identity = argument1;
                let accumulator = argument2;
                return useReduce(identity, accumulator).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        }
        else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            try {
                let identity = argument1;
                let accumulator = argument2;
                let finisher = argument3;
                return useReduce(identity, accumulator, finisher).collect(this.source());
            }
            catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    semantic() {
        let source = this.source();
        if (isFunction(source)) {
            try {
                return new Semantic(source);
            }
            catch (error) {
                throw new Error("Uncaught error on semantic.");
            }
        }
        else {
            throw new TypeError("Invalid source.");
        }
    }
    toArray() {
        try {
            return useToArray().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on toArray.");
        }
    }
    toMap(keyExtractor, valueExtractor = (element) => element) {
        try {
            return useToMap(keyExtractor, valueExtractor).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on toMap.");
        }
    }
    toSet() {
        try {
            return useToSet().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on toSet.");
        }
    }
    write(argument1, argument2) {
        if (isObject(argument1)) {
            try {
                let stream = argument1;
                if (isFunction(argument2)) {
                    let accumulator = argument2;
                    return useWrite(stream, accumulator).collect(this.source());
                }
                else {
                    return useWrite(stream).collect(this.source());
                }
            }
            catch (error) {
                throw new Error("Uncaught error on write.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }
}
;
export class EventCollectable extends Collectable {
    AsyncCollectable = AsyncCollectableSymbol;
    generator;
    constructor(argument1) {
        super();
        if (isFunction(argument1)) {
            let generator = argument1;
            this.generator = generator;
            Object.defineProperty(this, "AsyncCollectable", {
                value: AsyncCollectableSymbol,
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
        else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }
    source() {
        return this.generator;
    }
    *[Symbol.iterator]() {
        try {
            let collector = useToArray();
            yield* collector.collect(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToArray();
            yield* collector.collect(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
}
export class UnorderedCollectable extends Collectable {
    UnorderedCollectable = UnorderedCollectableSymbol;
    buffer = new Map();
    constructor(argument1) {
        super();
        if (isFunction(argument1)) {
            let generator = argument1;
            generator((element, index) => {
                this.buffer.set(index, element);
            }, () => false);
            Object.defineProperties(this, {
                "UnorderedCollectable": {
                    value: UnorderedCollectableSymbol,
                    writable: false,
                    enumerable: false,
                    configurable: false
                }
            });
        }
        else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }
    source() {
        return (accept, interrupt) => {
            for (let [index, element] of this.buffer) {
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
            }
        };
    }
    *[Symbol.iterator]() {
        try {
            for (let [_index, element] of this.buffer) {
                yield element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let [_index, element] of this.buffer) {
                yield element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
}
;
export class OrderedCollectable extends Collectable {
    OrderedCollectable = OrderedCollectableSymbol;
    buffer;
    constructor(argument1, argument2) {
        super();
        if (isFunction(argument1)) {
            try {
                if (isFunction(argument2)) {
                    let collector = useToArray();
                    this.buffer = collector.collect(argument1).sort(argument2).map((element, index) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    });
                }
                else {
                    let collector = useToArray();
                    this.buffer = collector.collect(argument1).map((element, index) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    }).sort((a, b) => {
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
            }
            catch (error) {
                throw new Error("Uncaught error on creating buffer.");
            }
        }
        else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }
    *[Symbol.iterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    source() {
        try {
            return (accept, interrupt) => {
                for (let indexed of this.buffer) {
                    if (interrupt(indexed.element, indexed.index)) {
                        break;
                    }
                    accept(indexed.element, indexed.index);
                }
            };
        }
        catch (error) {
            throw new Error("Uncaught error on creating source.");
        }
    }
    isEmpty() {
        return this.buffer.length === 0;
    }
}
;
export class Statistics extends OrderedCollectable {
    Statistics = StatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    count() {
        return BigInt(this.buffer.length);
    }
    frequency() {
        return useFrequency().collect(this.source());
    }
}
;
export class NumericStatistics extends Statistics {
    NumericStatistics = NumericStatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    average(mapper) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (isFunction(mapper)) {
                return useNumericAverage(mapper).collect(this.source());
            }
            return useNumericAverage().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (this.count() === 1n) {
                return 0;
            }
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let count = this.buffer.length;
            let minimum = this.buffer[0].element;
            let maximum = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        }
        catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericVariance(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }
    standardDeviation(argument1) {
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericStandardDeviation(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMedian(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMode(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericSummate(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        }
        catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
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
        catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
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
        catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
}
;
export class BigIntStatistics extends Statistics {
    BigIntStatistics = BigIntStatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    average(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let count = this.buffer.length;
            let minimum = this.buffer[0].element;
            let maximum = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        }
        catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntVariance(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }
    standardDeviation(argument1) {
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMedian(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMode(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntSummate(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        }
        catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
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
        catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
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
        catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
}
;
export class WindowCollectable extends OrderedCollectable {
    WindowCollectable = WindowCollectableSymbol;
    constructor(parameter, comparator = useCompare) {
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
    *[Symbol.iterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            for (let indexed of this.buffer) {
                yield indexed.element;
            }
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    slide(size, step = 1n) {
        if (size > 0n && step > 0n) {
            return new Semantic((accepet, interrupt) => {
                try {
                    let index = 0n;
                    for (let start = 0n; start < BigInt(this.buffer.length); start += step) {
                        let end = start + size;
                        let inner = new Semantic((accept, interrupt) => {
                            for (let index = start; index < end && index < BigInt(this.buffer.length); index++) {
                                let indexed = this.buffer[Number(index)];
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
                }
                catch (error) {
                    throw new Error("Uncaught error on slide.");
                }
            });
        }
        throw new RangeError("Invalid arguments.");
    }
    tumble(size) {
        if (isBigInt(size) && size > 0n) {
            try {
                return this.slide(size, size);
            }
            catch (error) {
                throw new Error("Uncaught error on tumble.");
            }
        }
        throw new RangeError("Invalid arguments.");
    }
}
;
