import { BigIntStatisticsSymbol, CollectableSymbol, CollectorsSymbol, NumericStatisticsSymbol, OrderedCollectableSymbol, SemanticMapSymbol, SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
export let isBoolean = (t) => {
    return typeof t === "boolean";
};
export let isString = (t) => {
    return typeof t === "string";
};
export let isNumber = (t) => {
    return typeof t === "number" && !Number.isNaN(t) && Number.isFinite(t);
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
export let isBigInt = (t) => {
    return typeof t === "bigint";
};
export let isPrimitive = (t) => {
    return isBoolean(t) || isString(t) || isNumber(t) || isSymbol(t) || isBigInt(t) || isFunction(t);
};
export let isAsyncIterable = (t) => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.asyncIterator));
    }
    return false;
};
export let isIterable = (t) => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, Symbol.iterator));
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
        return Reflect.get(t, "WindowCollectable") === WindowCollectableSymbol;
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
export let isSemanticMap = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "SemanticMap") === SemanticMapSymbol;
    }
    return false;
};
export let isHashMap = (t) => {
    if (isObject(t)) {
        return Reflect.get(t, "HashMap") === SemanticMapSymbol;
    }
    return false;
};
export let isHashSet = (t) => {
    if (isObject(t)) {
        return false;
    }
    return false;
};
export let isPromise = (t) => {
    if (isObject(t)) {
        return isFunction(Reflect.get(t, "then")) && isFunction(Reflect.get(t, "catch"));
    }
    return false;
};
export let isAsyncFunction = (t) => {
    if (isFunction(t)) {
        return Reflect.get(t, Symbol.toStringTag) === "AsyncFunction" && t.constructor.name === "AsyncFunction";
    }
    return false;
};
export let isGeneratorFunction = (t) => {
    if (isObject(t)) {
        return isFunction(t) && Reflect.get(t, "constructor").name === "GeneratorFunction";
    }
    return false;
};
export let isAsyncGeneratorFunction = (t) => {
    if (isObject(t)) {
        return isFunction(t) && Reflect.get(t, "constructor").name === "AsyncGeneratorFunction";
    }
    return false;
};
