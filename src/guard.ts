import type { Collectable, OrderedCollectable, UnorderedCollectable } from "./collectable";
import type { Collector } from "./collector";
import type { Semantic } from "./semantic";
import type { Statistics } from "./statistics";
import { BigIntStatisticsSymbol, CollectableSymbol, CollectorsSymbol, NumericStatisticsSymbol, OrderedCollectableSymbol, SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol } from "./symbol";
import type { AsyncFunction, MaybePrimitive, Primitive } from "./utility";

export let isBoolean: (t: unknown) => t is boolean = (t: unknown): t is boolean => {
    return typeof t === "boolean";
};
export let isString: (t: unknown) => t is string = (t: unknown): t is string => {
    return typeof t === "string";
};
export let isNumber: (t: unknown) => t is number = (t: unknown): t is number => {
    return typeof t === "number" && !Number.isNaN(t) && Number.isFinite(t);
};
export let isFunction: (t: unknown) => t is Function = (t: unknown): t is Function => {
    return typeof t === "function";
};
export let isObject: (t: unknown) => t is object = (t: unknown): t is object => {
    return typeof t === "object" && t !== null;
};
export let isSymbol: (t: unknown) => t is symbol = (t: unknown): t is symbol => {
    return typeof t === "symbol";
};
export let isBigInt: (t: unknown) => t is bigint = (t: unknown): t is bigint => {
    return typeof t === "bigint";
};
export let isPrimitive: (t: MaybePrimitive<unknown>) => t is Primitive = (t: MaybePrimitive<unknown>): t is Primitive => {
    return isBoolean(t) || isString(t) || isNumber(t) || isSymbol(t) || isBigInt(t) || isFunction(t);
};

export let isAsyncIterable: (t: unknown) => t is Iterable<unknown> = (t: unknown): t is Iterable<unknown> => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.asyncIterator));
    }
    return false;
};
export let isIterable: (t: unknown) => t is Iterable<unknown> = (t: unknown): t is Iterable<unknown> => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.iterator));
    }
    return false;
};

export let isSemantic: (t: unknown) => t is Semantic<unknown> = (t: unknown): t is Semantic<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Semantic") === SemanticSymbol;
    }
    return false;
};
export let isCollector: (t: unknown) => t is Collector<unknown, unknown, unknown> = (t: unknown): t is Collector<unknown, unknown, unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Collector") === CollectorsSymbol;
    }
    return false;
};
export let isCollectable: (t: unknown) => t is Collectable<unknown> = (t: unknown): t is Collectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "Collectable") === CollectableSymbol;
    }
    return false;
};
export let isOrderedCollectable: (t: unknown) => t is OrderedCollectable<unknown> = (t: unknown): t is OrderedCollectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "OrderedCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isWindowCollectable: (t: unknown) => t is OrderedCollectable<unknown> = (t: unknown): t is OrderedCollectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "WindowCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isUnorderedCollectable: (t: unknown) => t is UnorderedCollectable<unknown> = (t: unknown): t is UnorderedCollectable<unknown> => {
    if (isObject(t)) {
        return Reflect.get(t, "UnorderedCollectable") === UnorderedCollectableSymbol;
    }
    return false;
};
export let isStatistics: (t: unknown) => t is Statistics<unknown, number | bigint> = (t: unknown): t is Statistics<unknown, number | bigint> => {
    if (isObject(t)) {
        return Reflect.get(t, "Statistics") === StatisticsSymbol;
    }
    return false;
};
export let isNumericStatistics: (t: unknown) => t is Statistics<unknown, number | bigint> = (t: unknown): t is Statistics<unknown, number | bigint> => {
    if (isObject(t)) {
        return Reflect.get(t, "NumericStatistics") === NumericStatisticsSymbol;
    }
    return false;
};
export let isBigIntStatistics: (t: unknown) => t is Statistics<unknown, number | bigint> = (t: unknown): t is Statistics<unknown, number | bigint> => {
    if (isObject(t)) {
        return Reflect.get(t, "BigIntStatistics") === BigIntStatisticsSymbol;
    }
    return false;
};
export let isPromise: (t: unknown) => t is Promise<unknown> = (t: unknown): t is Promise<unknown> => {
    if(isObject(t)){
        return isFunction(Reflect.get(t, "then")) && isFunction(Reflect.get(t, "catch"));
    }
    return false;
};

export let isAsyncFunction: (t: unknown) => t is AsyncFunction = (t: unknown): t is AsyncFunction => {
    if(isFunction(t)){
        return Reflect.get(t, Symbol.toStringTag) === "AsyncFunction" && t.constructor.name === "AsyncFunction";
    }
    return false;
};

export let isGeneratorFunction: (t: unknown) => t is Generator<unknown, unknown, unknown> = (t: unknown): t is Generator<unknown, unknown, unknown> => {
    if(isObject(t)){
        return isFunction(t) && Reflect.get(t, "constructor").name === "GeneratorFunction";
    }
    return false;
};

export let isAsyncGeneratorFunction: (t: unknown) => t is AsyncGenerator<unknown, unknown, unknown> = (t: unknown): t is AsyncGenerator<unknown, unknown, unknown> => {
    if(isObject(t)){
        return isFunction(t) && Reflect.get(t, "constructor").name === "AsyncGeneratorFunction";
    }
    return false;
};