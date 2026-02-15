import { Collector, useAllMatch, useAnyMatch, useCollect, useCount, useError, useFindAny, useFindFirst, useFindLast, useForEach, useGroup, useGroupBy, useJoin, useLog, useNoneMatch, usePartition, useReduce, useToArray, useToMap, useToSet, useWrite } from "./collector";
import { isBigInt, isCollector, isFunction, isIterable, isObject, isString } from "./guard";
import { useArrange, useGenerator } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
export class Collectable {
    Collectable = CollectableSymbol;
    constructor() {
    }
    *[Symbol.iterator]() {
        let buffer = this.toArray();
        for (let element of buffer) {
            yield element;
        }
    }
    *generate() {
        let buffer = this.toArray();
        for (let element of buffer) {
            yield element;
        }
    }
    async *[Symbol.asyncIterator]() {
        let buffer = this.toArray();
        for (let element of buffer) {
            yield element;
        }
    }
    anyMatch(predicate) {
        if (isFunction(predicate)) {
            return useAnyMatch(predicate).collect(this);
        }
        throw new TypeError("Predicate must be a function.");
    }
    allMatch(predicate) {
        return useAllMatch(predicate).collect(this);
    }
    collect(argument1, argument2, argument3, argument4) {
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
        throw new TypeError("Invalid arguments.");
    }
    count() {
        return useCount().collect(this);
    }
    error(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            useError().collect(this);
        }
        else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1;
            useError(accumulator).collect(this);
        }
        else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix = argument1;
            let accumulator = argument2;
            let suffix = argument3;
            useError(prefix, accumulator, suffix).collect(this);
        }
        {
            throw new TypeError("Invalid arguments.");
        }
    }
    isEmpty() {
        return this.count() === 0n;
    }
    findAny() {
        return useFindAny().collect(this);
    }
    findFirst() {
        return useFindFirst().collect(this);
    }
    findLast() {
        return useFindLast().collect(this);
    }
    forEach(action) {
        if (isFunction(action)) {
            useForEach(action).collect(this);
        }
        else {
            throw new TypeError("Action must be a function.");
        }
    }
    group(classifier) {
        if (isFunction(classifier)) {
            return useGroup(classifier).collect(this);
        }
        throw new TypeError("Classifier must be a function.");
    }
    groupBy(keyExtractor, valueExtractor) {
        if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
            return useGroupBy(keyExtractor, valueExtractor).collect(this);
        }
        throw new TypeError("Key and value extractors must be functions.");
    }
    join(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            return useJoin().collect(this);
        }
        if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let delimiter = argument1;
            return useJoin(delimiter).collect(this);
        }
        if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix = argument1;
            let accumulator = argument2;
            let suffix = argument3;
            return useJoin(prefix, accumulator, suffix).collect(this);
        }
        if (isString(argument1) && isString(argument2) && isString(argument3)) {
            let prefix = argument1;
            let delimiter = argument2;
            let suffix = argument3;
            return useJoin(prefix, delimiter, suffix).collect(this);
        }
        throw new TypeError("Invalid arguments.");
    }
    log(argument1, argument2, argument3) {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            useLog().collect(this);
        }
        else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1;
            useLog(accumulator).collect(this);
        }
        else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix = argument1;
            let accumulator = argument2;
            let suffix = argument3;
            useLog(prefix, accumulator, suffix).collect(this);
        }
        {
            throw new TypeError("Invalid arguments.");
        }
    }
    nonMatch(predicate) {
        if (isFunction(predicate)) {
            return useNoneMatch(predicate).collect(this);
        }
        throw new TypeError("Predicate must be a function.");
    }
    partition(count) {
        if (isBigInt(count)) {
            return usePartition(count).collect(this);
        }
        throw new TypeError("Count must be a BigInt.");
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
            return useReduce(accumulator).collect(this);
        }
        else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            let identity = argument1;
            let accumulator = argument2;
            return useReduce(identity, accumulator).collect(this);
        }
        else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1;
            let accumulator = argument2;
            let finisher = argument3;
            return useReduce(identity, accumulator, finisher).collect(this);
        }
        else {
            throw new TypeError("Invalid arguments.");
        }
    }
    semantic() {
        let source = this.source();
        if (isFunction(source)) {
            return new Semantic(source);
        }
        else {
            throw new TypeError("Invalid source.");
        }
    }
    toArray() {
        return useToArray().collect(this);
    }
    toMap(keyExtractor, valueExtractor) {
        return useToMap(keyExtractor, valueExtractor).collect(this);
    }
    toSet() {
        return useToSet().collect(this);
    }
    write(argument1, argument2) {
        if (isObject(argument1)) {
            let stream = argument1;
            if (isFunction(argument2)) {
                let accumulator = argument2;
                return useWrite(stream, accumulator);
            }
            else {
                return useWrite(stream);
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
        if (isIterable(argument1)) {
            this.generator = useGenerator(argument1);
        }
        else if (isFunction(argument1)) {
            this.generator = argument1;
        }
        else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }
    source() {
        return this.generator;
    }
}
;
export class OrderedCollectable extends Collectable {
    OrderedCollectable = OrderedCollectableSymbol;
    ordered = [];
    generator;
    constructor(argument1, argument2) {
        super();
        if (isIterable(argument1)) {
            this.generator = isFunction(argument2) ? useArrange(argument1, argument2) : useArrange(argument1);
        }
        else if (isFunction(argument1)) {
            this.generator = isFunction(argument2) ? useArrange(argument1, argument2) : useArrange(argument1);
        }
        else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }
    source() {
        return useGenerator(this.ordered.map((indexed) => indexed.element));
    }
}
;
