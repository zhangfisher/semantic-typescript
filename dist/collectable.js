import { Collector, useAllMatch, useAnyMatch, useCollect, useCount, useError, useFindAny, useFindFirst, useFindLast, useFindMaximum, useFindMinimum, useForEach, useGroup, useGroupBy, useJoin, useLog, useNoneMatch, usePartition, usePartitionBy, useReduce, useToArray, useToAsyncGeneratorFunction, useToGeneratorFunction, useToMap, useToSet, useWrite } from "./collector";
import { isBigInt, isCollector, isFunction, isObject, isString } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
export class Collectable {
    Collectable = CollectableSymbol;
    constructor() {
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
    toMap(keyExtractor, valueExtractor) {
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
export class UnorderedCollectable extends Collectable {
    UnorderedCollectable = UnorderedCollectableSymbol;
    generator;
    constructor(argument1) {
        super();
        if (isFunction(argument1)) {
            this.generator = argument1;
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
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.generator);
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.generator);
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
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
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
