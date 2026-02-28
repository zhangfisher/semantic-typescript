import { useToArray } from "./collector";
import { isBigInt, isFunction, isIterable, isNumber, isObject, isPrimitive } from "./guard";
import { invalidate, validate } from "./utility";
export let useCompare = (t1, t2) => {
    if (t1 === t2 || Object.is(t1, t2)) {
        return 0;
    }
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
                if (t1.description === t2.description) {
                    return 0;
                }
                return (t1.description || "").localeCompare((t2.description) || "");
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
;
export let useRandom = (start, end) => {
    let getRandomBits = () => {
        let random = Math.random();
        let full = random * 0x10000000000000;
        let high = Math.floor(full / 0x100000000);
        let low = Math.floor(full) & 0xFFFFFFFF;
        return [high, low];
    };
    let getRandomBigInt = () => {
        let [h1, l1] = getRandomBits();
        let [h2, l2] = getRandomBits();
        let [h3, l3] = getRandomBits();
        return ((BigInt(h1) << 84n) | (BigInt(l1) << 52n) | (BigInt(h2) << 32n) | (BigInt(l2) << 3n) | (BigInt(h3) << 116n)) | (BigInt(l3) << 80n);
    };
    if (isNumber(start)) {
        let seed = Math.random();
        if (isNumber(end)) {
            let minimum = Math.min(start, end);
            let maximum = Math.max(start, end);
            let range = maximum - minimum;
            return (minimum + seed * range);
        }
        else {
            return Math.exp(-seed);
        }
    }
    if (isBigInt(start)) {
        let randomBigInt = getRandomBigInt();
        if (isBigInt(end)) {
            let minimum = start < end ? start : end;
            let maximum = start < end ? end : start;
            let range = maximum - minimum;
            if (range === 0n) {
                return minimum;
            }
            let mask = range;
            mask |= mask >> 1n;
            mask |= mask >> 2n;
            mask |= mask >> 4n;
            mask |= mask >> 8n;
            mask |= mask >> 16n;
            mask |= mask >> 32n;
            mask |= mask >> 64n;
            let result;
            do {
                let raw = randomBigInt & mask;
                result = raw;
                result ^= result >> 17n;
                result *= 0xed5ad4bbn;
                result ^= result >> 11n;
                result *= 0xac4c1b51n;
                result ^= result >> 15n;
                result *= 0x31848babn;
                result ^= result >> 14n;
            } while (result >= range);
            return (minimum + result);
        }
        else {
            let seed = Math.random();
            let expValue = Math.exp(-seed);
            let normalized = expValue / Math.E;
            let [high, low] = getRandomBits();
            let adjusted = BigInt(Math.floor(normalized * 0xFFFFFFFF)) << 32n;
            let result = (adjusted | BigInt(low)) ^ BigInt(high);
            if (start <= 0n) {
                return 0n;
            }
            if (result >= start) {
                result = result % start;
            }
            return result;
        }
    }
    throw new TypeError("Invalid arguments.");
};
;
;
;
export let useTraverse = (t, callback) => {
    if (isObject(t)) {
        let seen = new WeakSet();
        let path = [];
        let traverse = (target) => {
            if (!seen.has(target)) {
                seen.add(target);
                let stop = false;
                let properties = Reflect.ownKeys(target);
                for (let property of properties) {
                    path.push(property);
                    let value = Reflect.get(target, property);
                    if (stop) {
                        break;
                    }
                    if (validate(value)) {
                        if (isObject(value)) {
                            if (isIterable(value)) {
                                let index = 0;
                                for (let item of value) {
                                    path.push(index);
                                    if (validate(item)) {
                                        if (isObject(item)) {
                                            traverse(item);
                                        }
                                        else {
                                            if (!callback(index, item, path)) {
                                                stop = true;
                                                break;
                                            }
                                        }
                                    }
                                    index++;
                                }
                            }
                            else {
                                traverse(value);
                            }
                        }
                        else {
                            if (!callback(property, value, path)) {
                                stop = true;
                                break;
                            }
                        }
                    }
                }
            }
        };
        traverse(t);
    }
};
export let useGenerator = (iterable) => {
    if (isIterable(iterable)) {
        return (accept, interrupt) => {
            let index = 0n;
            for (let element of iterable) {
                if (interrupt(element, index)) {
                    break;
                }
                accept(element, index);
            }
        };
    }
    return () => { };
};
;
export let useArrange = (source, comparator) => {
    if (isIterable(source)) {
        let buffer = [...source];
        if (validate(comparator) && isFunction(comparator)) {
            return useGenerator(buffer.sort(comparator));
        }
        else {
            return useGenerator(buffer.map((element, index) => {
                return {
                    element: element,
                    index: BigInt(((index % buffer.length) + buffer.length) % buffer.length)
                };
            }).sort((a, b) => {
                return Number(a.index - b.index);
            }).map((indexed) => {
                return indexed.element;
            }));
        }
    }
    else if (isFunction(source)) {
        let collector = useToArray();
        let buffer = collector.collect(source);
        if (validate(comparator) && isFunction(comparator)) {
            return useGenerator(buffer.sort(comparator));
        }
        else {
            return useGenerator(buffer.map((element, index) => {
                return {
                    element: element,
                    index: BigInt(((index % buffer.length) + buffer.length) % buffer.length)
                };
            }).sort((a, b) => {
                return Number(a.index - b.index);
            }).map((indexed) => {
                return indexed.element;
            }));
        }
    }
    return useGenerator([]);
};
export let useToNumber = (target) => {
    switch (typeof target) {
        case "number":
            return isNumber(target) ? target : 0;
        case "boolean":
            return target ? 1 : 0;
        case "string":
            let result = Number(target);
            return isNumber(result) ? result : 0;
        case "bigint":
            return Number(target);
        case "object":
            if (invalidate(target)) {
                return 0;
            }
            if (Reflect.has(target, Symbol.toPrimitive)) {
                let resolved = Reflect.apply(Reflect.get(target, Symbol.toPrimitive), target, ["default"]);
                return isNumber(resolved) ? resolved : 0;
            }
            return 0;
        default:
            return 0;
    }
};
export let useToBigInt = (target) => {
    switch (typeof target) {
        case "number":
            return isNumber(target) ? BigInt(target) : 0n;
        case "boolean":
            return target ? 1n : 0n;
        case "string":
            let regex = /^[-+]?\d+$/;
            return regex.test(target) ? BigInt(target) : 0n;
        case "bigint":
            return target;
        case "object":
            if (invalidate(target)) {
                return 0n;
            }
            if (Reflect.has(target, Symbol.toPrimitive)) {
                let resolved = Reflect.apply(Reflect.get(target, Symbol.toPrimitive), target, ["default"]);
                return isBigInt(resolved) ? resolved : 0n;
            }
            return 0n;
        default:
            return 0n;
    }
};
