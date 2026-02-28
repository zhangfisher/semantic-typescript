import type { Collectable, OrderedCollectable, Statistics, UnorderedCollectable, WindowCollectable } from "./semantic";
import type { Collector } from "./collector";
import type { Optional } from "./optional";
import type { Semantic } from "./semantic";
import { BigIntStatisticsSymbol, CollectableSymbol, CollectorsSymbol,
    NumericStatisticsSymbol, OptionalSymbol, OrderedCollectableSymbol, 
    SemanticSymbol, StatisticsSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
import type { AsyncFunction, MaybePrimitive, Primitive } from "./utility";

export let isBoolean: (target: unknown) => target is boolean = (target: unknown): target is boolean => {
    return typeof target === "boolean";
};
export let isString: (target: unknown) => target is string = (target: unknown): target is string => {
    return typeof target === "string";
};
export let isNumber: (target: unknown) => target is number = (target: unknown): target is number => {
    return typeof target === "number" && !Number.isNaN(target) && Number.isFinite(target);
};
export let isFunction: (target: unknown) => target is Function = (target: unknown): target is Function => {
    return typeof target === "function";
};
export let isObject: (target: unknown) => target is object = (target: unknown): target is object => {
    return typeof target === "object" && target !== null;
};
export let isSymbol: (target: unknown) => target is symbol = (target: unknown): target is symbol => {
    return typeof target === "symbol";
};
export let isBigInt: (target: unknown) => target is bigint = (target: unknown): target is bigint => {
    return typeof target === "bigint";
};
export let isPrimitive: (target: MaybePrimitive<unknown>) => target is Primitive = (target: MaybePrimitive<unknown>): target is Primitive => {
    return isBoolean(target) || isString(target) || isNumber(target) || isSymbol(target) || isBigInt(target) || isFunction(target);
};

export let isAsyncIterable: (target: unknown) => target is Iterable<unknown> = (target: unknown): target is Iterable<unknown> => {
    if (isObject(target)) {
        return isFunction(Reflect.get(target, Symbol.asyncIterator));
    }
    return false;
};
export let isIterable: (target: unknown) => target is Iterable<unknown> = (target: unknown): target is Iterable<unknown> => {
    if (isObject(target)) {
        return isFunction(Reflect.get(target, Symbol.iterator));
    }
    return false;
};

export let isSemantic: (target: unknown) => target is Semantic<unknown> = (target: unknown): target is Semantic<unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "Semantic") === SemanticSymbol;
    }
    return false;
};
export let isCollector: (target: unknown) => target is Collector<unknown, unknown, unknown> = (target: unknown): target is Collector<unknown, unknown, unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "Collector") === CollectorsSymbol;
    }
    return false;
};
export let isCollectable: (target: unknown) => target is Collectable<unknown> = (target: unknown): target is Collectable<unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "Collectable") === CollectableSymbol;
    }
    return false;
};
export let isOrderedCollectable: (target: unknown) => target is OrderedCollectable<unknown> = (target: unknown): target is OrderedCollectable<unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "OrderedCollectable") === OrderedCollectableSymbol;
    }
    return false;
};
export let isWindowCollectable: (target: unknown) => target is WindowCollectable<unknown> = (target: unknown): target is WindowCollectable<unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "WindowCollectable") === WindowCollectableSymbol;
    }
    return false;
};
export let isUnorderedCollectable: (target: unknown) => target is UnorderedCollectable<unknown> = (target: unknown): target is UnorderedCollectable<unknown> => {
    if (isObject(target)) {
        return Reflect.get(target, "UnorderedCollectable") === UnorderedCollectableSymbol;
    }
    return false;
};
export let isStatistics: (target: unknown) => target is Statistics<unknown, number | bigint> = (target: unknown): target is Statistics<unknown, number | bigint> => {
    if (isObject(target)) {
        return Reflect.get(target, "Statistics") === StatisticsSymbol;
    }
    return false;
};
export let isNumericStatistics: (target: unknown) => target is Statistics<unknown, number | bigint> = (target: unknown): target is Statistics<unknown, number | bigint> => {
    if (isObject(target)) {
        return Reflect.get(target, "NumericStatistics") === NumericStatisticsSymbol;
    }
    return false;
};
export let isBigIntStatistics: (target: unknown) => target is Statistics<unknown, number | bigint> = (target: unknown): target is Statistics<unknown, number | bigint> => {
    if (isObject(target)) {
        return Reflect.get(target, "BigIntStatistics") === BigIntStatisticsSymbol;
    }
    return false;
};
export let isOptional: <T>(target: unknown) => target is Optional<T> = <T>(target: unknown): target is Optional<T> => {
    if(isObject(target)){
        return Reflect.get(target, "Optional") === OptionalSymbol;
    }
    return false;
};


export let isPromise: (target: unknown) => target is Promise<unknown> = (target: unknown): target is Promise<unknown> => {
    if(isObject(target)){
        return isFunction(Reflect.get(target, "then")) && isFunction(Reflect.get(target, "catch"));
    }
    return false;
};

export let isAsyncFunction: (target: unknown) => target is AsyncFunction = (target: unknown): target is AsyncFunction => {
    if(isFunction(target)){
        return Reflect.get(target, Symbol.toStringTag) === "AsyncFunction" && target.constructor.name === "AsyncFunction";
    }
    return false;
};

export let isGeneratorFunction: (target: unknown) => target is Generator<unknown, unknown, unknown> = (target: unknown): target is Generator<unknown, unknown, unknown> => {
    if(isObject(target)){
        return isFunction(target) && Reflect.get(target, "constructor").name === "GeneratorFunction";
    }
    return false;
};

export let isAsyncGeneratorFunction: (target: unknown) => target is AsyncGenerator<unknown, unknown, unknown> = (target: unknown): target is AsyncGenerator<unknown, unknown, unknown> => {
    if(isObject(target)){
        return isFunction(target) && Reflect.get(target, "constructor").name === "AsyncGeneratorFunction";
    }
    return false;
};

export let isWindow: (target: unknown) => target is Window = (target: unknown): target is Window => {
    if(isObject(target) && isObject(Reflect.get(target, "window"))){
        return Object.prototype.toString.call(Reflect.get(target, "window")) === "[object Window]";
    }
    return false;
};

export let isDocument: (target: unknown) => target is Document = (target: unknown): target is Document => {
    if(isObject(target) && isObject(Reflect.get(target, "document"))){
        return Object.prototype.toString.call(Reflect.get(target, "document")) === "[object HTMLDocument]";
    }
    return false;
};

export let isHTMLElemet: (target: unknown) => target is HTMLElement = (target: unknown): target is HTMLElement => {
    if(isObject(target)){
        let regex: RegExp = /^\[object HTML\w+Element\]$/;
        return regex.test(Object.prototype.toString.call(target));
    }
    return false;
};

