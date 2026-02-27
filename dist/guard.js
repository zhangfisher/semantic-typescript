import { BigIntStatisticsSymbol, BinaryNodeSymbol, CollectableSymbol, CollectorsSymbol, LinearNodeSymbol, NodeSymbol, NumericStatisticsSymbol, OptionalSymbol, OrderedCollectableSymbol, RedBlackNodeSymbol, SemanticMapSymbol, SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
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
export let isSemantic = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Semantic") === SemanticSymbol;
    }
    return false;
};
export let isCollector = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Collector") === CollectorsSymbol;
    }
    return false;
};
export let isCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Collectable") === CollectableSymbol;
    }
    return false;
};
export let isOrderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "OrderedCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isWindowCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "WindowCollectable") === WindowCollectableSymbol;
    }
    return false;
};
export let isUnorderedCollectable = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "UnorderedCollectable") === UnorderedCollectableSymbol;
    }
    return false;
};
export let isStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Statistics") === StatisticsSymbol;
    }
    return false;
};
export let isNumericStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "NumericStatistics") === NumericStatisticsSymbol;
    }
    return false;
};
export let isBigIntStatistics = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "BigIntStatistics") === BigIntStatisticsSymbol;
    }
    return false;
};
export let isSemanticMap = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "SemanticMap") === SemanticMapSymbol;
    }
    return false;
};
export let isHashMap = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "HashMap") === SemanticMapSymbol;
    }
    return false;
};
export let isHashSet = (target) => {
    if (isObject(target)) {
        return false;
    }
    return false;
};
export let isNode = (target) => {
    if (isObject(target)) {
        return Reflect.get(target, "Node") === NodeSymbol;
    }
    return false;
};
export let isLinearNode = (target) => {
    if (isObject(target)) {
        return isNode(target) && Reflect.get(target, "LinearNode") === LinearNodeSymbol;
    }
    return false;
};
export let isBinaryNode = (target) => {
    if (isObject(target)) {
        return isNode(target) && Reflect.get(target, "BinaryNode") === BinaryNodeSymbol;
    }
    return false;
};
export let isRedBlackNode = (target) => {
    if (isObject(target)) {
        return isBinaryNode(target) && Reflect.get(target, "RedBlackNode") === RedBlackNodeSymbol;
    }
    return false;
};
export let isTree = (target) => {
    if (isObject(target)) {
        return isNode(target) && (isLinearNode(target) || isBinaryNode(target));
    }
    return false;
};
export let isBinaryTree = (target) => {
    if (isObject(target)) {
        return isNode(target) && isBinaryNode(target);
    }
    return false;
};
export let isRedBlackTree = (target) => {
    if (isObject(target)) {
        return isNode(target) && isRedBlackNode(target);
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
