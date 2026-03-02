import { AsynchronousBigIntStatisticsSymbol, AsynchronousCollectorSymbol, AsynchronousNumericStatisticsSymbol, AsynchronousOrderedCollectableSymbol, AsynchronousSemanticSymbol, AsynchronousStatisticsSymbol, AsynchronousUnorderedCollectableSymbol, AsynchronousWindowCollectableSymbol, OptionalSymbol, SynchronousBigIntStatisticsSymbol, SynchronousCollectorSymbol, SynchronousNumericStatisticsSymbol, SynchronousOrderedCollectableSymbol, SynchronousSemanticSymbol, SynchronousStatisticsSymbol, SynchronousUnorderedCollectableSymbol, SynchronousWindowCollectableSymbol } from "./symbol";
export let isBoolean = (target) => {
    return typeof target === "boolean";
};
export let isString = (target) => {
    return typeof target === "string";
};
export let isNumber = (target) => {
    return typeof target === "number" && !Number.isNaN(target) && Number.isFinite(target);
};
export let isFunction = (target) => {
    return typeof target === "function";
};
export let isObject = (target) => {
    return typeof target === "object" && target !== null;
};
export let isSymbol = (target) => {
    return typeof target === "symbol";
};
export let isBigInt = (target) => {
    return typeof target === "bigint";
};
export let isPrimitive = (target) => {
    return isBoolean(target) || isString(target) || isNumber(target) || isSymbol(target) || isBigInt(target) || isFunction(target);
};
export let isAsyncIterable = (target) => {
    if (isObject(target)) {
        return isFunction(Reflect.get(target, Symbol.asyncIterator));
    }
    return false;
};
export let isIterable = (target) => {
    if (isObject(target)) {
        return isFunction(Reflect.get(target, Symbol.iterator));
    }
    return false;
};
export let isAsynchronousSemantic = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousSemantic") === AsynchronousSemanticSymbol;
    }
    return false;
};
export let isSynchronousSemantic = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousSemantic") === SynchronousSemanticSymbol;
    }
    return false;
};
export let isAsynchronousCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousCollectable") === AsynchronousSemanticSymbol || isAsynchronousSemantic(target) || isAsynchronousOrderedCollectable(target) || isAsynchronousUnorderedCollectable(target) || isAsynchronousStatistics(target) || isAsynchronousNumericStatistics(target) || isAsynchronousBigIntStatistics(target) || isAsynchronousWindowCollectable(target);
    }
    return false;
};
export let isSynchronousCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousCollectable") === SynchronousSemanticSymbol || isSynchronousSemantic(target) || isSynchronousOrderedCollectable(target) || isSynchronousUnorderedCollectable(target) || isSynchronousStatistics(target) || isSynchronousNumericStatistics(target) || isSynchronousBigIntStatistics(target) || isSynchronousWindowCollectable(target);
    }
    return false;
};
export let isAsynchronousOrderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousOrderedCollectable") === AsynchronousOrderedCollectableSymbol;
    }
    return false;
};
export let isSynchronousOrderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousOrderedCollectable") === SynchronousOrderedCollectableSymbol;
    }
    return false;
};
export let isAsynchronousUnorderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousUnorderedCollectable") === AsynchronousUnorderedCollectableSymbol;
    }
    return false;
};
export let isSynchronousUnorderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousUnorderedCollectable") === SynchronousUnorderedCollectableSymbol;
    }
    return false;
};
export let isAsynchronousStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousStatistics") === AsynchronousStatisticsSymbol;
    }
    return false;
};
export let isSynchronousStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousStatistics") === SynchronousStatisticsSymbol;
    }
    return false;
};
export let isAsynchronousBigIntStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousBigIntStatistics") === AsynchronousBigIntStatisticsSymbol;
    }
    return false;
};
export let isSynchronousBigIntStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousBigIntStatistics") === SynchronousBigIntStatisticsSymbol;
    }
    return false;
};
export let isAsynchronousNumericStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousBigIntStatistics") === AsynchronousNumericStatisticsSymbol;
    }
    return false;
};
export let isSynchronousNumericStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousNumericStatistics") === SynchronousNumericStatisticsSymbol;
    }
    return false;
};
export let isAsynchronousWindowCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousWindowCollectable") === AsynchronousWindowCollectableSymbol;
    }
    return false;
};
export let isSynchronousWindowCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousWindowCollectable") === SynchronousWindowCollectableSymbol;
    }
    return false;
};
export let isSynchronousCollector = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SynchronousCollector") === SynchronousCollectorSymbol;
    }
    return false;
};
export let isAsynchronousCollector = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "AsynchronousCollector") === AsynchronousCollectorSymbol;
    }
    return false;
};
export let isOptional = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Optional") === OptionalSymbol;
    }
    return false;
};
export let isPromise = (target) => {
    if (isObject(target)) {
        return isFunction(Reflect.get(target, "then")) && isFunction(Reflect.get(target, "catch"));
    }
    return false;
};
export let isAsyncFunction = (target) => {
    if (isFunction(target)) {
        return Reflect.get(target, Symbol.toStringTag) === "AsyncFunction" && target.constructor.name === "AsyncFunction";
    }
    return false;
};
export let isGeneratorFunction = (target) => {
    if (isObject(target)) {
        return isFunction(target) && Reflect.get(target, "constructor").name === "GeneratorFunction";
    }
    return false;
};
export let isAsyncGeneratorFunction = (target) => {
    if (isObject(target)) {
        return isFunction(target) && Reflect.get(target, "constructor").name === "AsyncGeneratorFunction";
    }
    return false;
};
export let isWindow = (target) => {
    if (isObject(target) && isObject(Reflect.get(target, "window"))) {
        return Object.prototype.toString.call(Reflect.get(target, "window")) === "[object Window]";
    }
    return false;
};
export let isDocument = (target) => {
    if (isObject(target) && isObject(Reflect.get(target, "document"))) {
        return Object.prototype.toString.call(Reflect.get(target, "document")) === "[object HTMLDocument]";
    }
    return false;
};
export let isHTMLElemet = (target) => {
    if (isObject(target)) {
        let regex = /^\[object HTML\w+Element\]$/;
        return regex.test(Object.prototype.toString.call(target));
    }
    return false;
};
