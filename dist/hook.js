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
export let Useandom = (index) => {
    if (isNumber(index)) {
        let x = Number(index);
        let phi = (1 + Math.sqrt(5)) / 2;
        let vanDerCorput = (base, n) => {
            let result = 0;
            let f = 1 / base;
            let i = n;
            while (i > 0) {
                result += (i % base) * f;
                i = Math.floor(i / base);
                f = f / base;
            }
            return result;
        };
        let h = vanDerCorput(2, x) + vanDerCorput(3, x);
        let golden = (x * phi) % 1;
        let lcg = (1103515245 * x + 12345) % 2147483648;
        let mixed = (h * 0.5 + golden * 0.3 + lcg / 2147483648 * 0.2);
        return (mixed * 1000000);
    }
    throw new TypeError("Invalid input type");
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
