import { isBigInt, isBoolean, isFunction, isHashable, isNumber, isObject, isString, isSymbol } from "./guard";
import { useTraverse } from "./hook";
import { HashableSymbol } from "./symbol";
import { typeOf } from "./utility";
;
const masks = new Map();
masks.set("undefined", BigInt(masks.size));
masks.set("null", BigInt(masks.size));
masks.set("boolean", BigInt(masks.size));
masks.set("number", BigInt(masks.size));
masks.set("bigint", BigInt(masks.size));
masks.set("symbol", BigInt(masks.size));
masks.set("string", BigInt(masks.size));
masks.set("function", BigInt(masks.size));
masks.set("object", BigInt(masks.size));
Object.freeze(masks);
const internal = Object.freeze(Array.from(masks.keys()));
export let maskOf = (type) => {
    return masks.get(type) || masks.get("object") || 0n;
};
let primitive = new Map();
let complex = new WeakMap();
const handlers = new Map();
export let register = (type, handler) => {
    if (isString(type) && isFunction(handler)) {
        handlers.set(type, handler);
    }
};
export let unregister = (type) => {
    if (isString(type) && handlers.has(type) && !internal.includes(type)) {
        handlers.delete(type);
    }
};
register("undefined", (value) => {
    if (value === (void 0)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("undefined");
        let result = (0n << 4n) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("null", (value) => {
    if (value === null) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("null");
        let result = (0n << 4n) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("boolean", (value) => {
    if (isBoolean(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("boolean");
        let result = ((value === true ? 1n : 0n) << 4n) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("number", (value) => {
    if (isNumber(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("number");
        let bit = 0xffffffffffffffffn;
        let buffer = new ArrayBuffer(8);
        let array = new Float64Array(buffer);
        array[0] = value;
        let view = new BigInt64Array(buffer);
        let result = ((view[0] << 4n) & bit) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("bigint", (value) => {
    if (isBigInt(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("bigint");
        let bit = 0xffffffffffffffffn;
        let result = ((value << 4n) & bit) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("string", (value) => {
    if (isString(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("string");
        let bit = 0xffffffffffffffffn;
        let gap = value.length < 64 ? 1 : Math.ceil(Math.log2(value.length));
        let result = 0n;
        for (let i = 0; i < value.length; i += gap) {
            result = (((result * 33n) & bit) ^ BigInt(value.charCodeAt(i))) + BigInt(i);
        }
        result = (result ^ (result >> 32n)) * 0x9e3779b97f4a7c15n;
        result = (((result ^ (result >> 32n)) << 4n) & bit) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("symbol", (value) => {
    if (isSymbol(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("symbol");
        let bit = 0xffffffffffffffffn;
        let description = (value.description || "") + String(value);
        let result = 0n;
        let gap = description.length < 64 ? 1 : Math.ceil(Math.log2(description.length));
        for (let i = 0; i < description.length; i += gap) {
            result = (((result * 33n) & bit) ^ BigInt(description.charCodeAt(i))) + BigInt(i);
        }
        result = (result ^ (result >> 32n)) * 0x9e3779b97f4a7c15n;
        result = (((result ^ (result >> 32n)) << 4n) & bit) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("function", (value) => {
    if (isFunction(value)) {
        if (primitive.has(value)) {
            return primitive.get(value) || 0n;
        }
        let mask = maskOf("function");
        let bit = 0xffffffffffffffffn;
        let description = (value.name || "") + String(value);
        let result = 0n;
        let gap = description.length < 64 ? 1 : Math.ceil(Math.log2(description.length));
        for (let i = 0; i < description.length; i += gap) {
            result = (((result * 33n) & bit) ^ BigInt(description.charCodeAt(i))) + BigInt(i);
        }
        result = (result ^ (result >> 32n)) * 0x9e3779b97f4a7c15n;
        result = (((result ^ (result >> 32n)) << 4n) & bit) | mask;
        primitive.set(value, result);
        return result;
    }
    return 0n;
});
register("object", (value) => {
    if (isObject(value)) {
        if (complex.has(value)) {
            return complex.get(value) || 0n;
        }
        try {
            let mask = maskOf("object");
            let bit = 0xffffffffffffffffn;
            let result = 0n;
            useTraverse(value, (key, value, path) => {
                let keyHashHandler = handlers.get(typeOf(key));
                let keyHash = keyHashHandler ? keyHashHandler(key) : 0n;
                let valueHashHandler = handlers.get(typeOf(value));
                let valueHash = valueHashHandler ? valueHashHandler(value) : 0n;
                let pathHash = 0n;
                if (complex.has(path)) {
                    pathHash = complex.get(path) || 0n;
                }
                else {
                    for (let p of path) {
                        let pathHashHandler = handlers.get(typeOf(p));
                        pathHash = (((pathHash << 5n) - pathHash) ^ (pathHashHandler ? pathHashHandler(p) : 0n)) & bit;
                    }
                    complex.set(path, pathHash);
                }
                result = (((result << 13n) | (result >> 51n)) ^ (keyHash * 0x243f6a8885a308d3n) ^ (valueHash * 0x517cc1b727220a95n) ^ (pathHash * 0x9e3779b97f4a7c15n)) & bit;
                return true;
            });
            result = (result ^ (result >> 32n)) * 0x9e3779b97f4a7c15n;
            result = (((result ^ (result >> 32n)) << 4n) & bit) | mask;
            complex.set(value, result);
            return result;
        }
        catch (error) {
            throw new Error("Uncaught error on hashing object.");
        }
    }
    return 0n;
});
;
export let useHash = (target) => {
    let type = typeOf(target);
    if (type === "object" && isHashable(target)) {
        if (complex.has(target)) {
            return complex.get(target) || 0n;
        }
        let hash = Reflect.get(target, HashableSymbol)();
        complex.set(target, hash);
        return hash;
    }
    let handler = handlers.get(type) || (() => 0n);
    return handler(target);
};
