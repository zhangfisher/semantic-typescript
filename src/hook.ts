import { isFunction, isIterable, isNumber, isObject, isPrimitive } from "./guard";
import { validate, type BiPredicate, type DeepPropertyKey, type DeepPropertyValue, type MaybePrimitive } from "./utility";

export let useCompare: <T>(t1: T, t2: T) => number = <T>(t1: T, t2: T): number => {
    if (t1 === t2 || Object.is(t1, t2)) {
        return 0;
    }
    if (typeof t1 === typeof t2) {
        switch (typeof t1) {
            case "string":
                return t1.localeCompare(t2 as string);
            case "number":
                return t1 - (t2 as number);
            case "bigint":
                return Number(t1 - (t2 as bigint));
            case "boolean":
                return t1 === t2 ? 0 : (t1 ? 1 : -1);
            case "symbol":
                return Object.prototype.toString.call(t1).localeCompare(Object.prototype.toString.call(t2));
            case "function":
                throw new TypeError("Cannot compare functions.");
            case "undefined":
                return 0;
            case "object":
                if (isFunction(Reflect.get(t1 as object, Symbol.toPrimitive)) && isFunction(Reflect.get(t2 as object, Symbol.toPrimitive))) {
                    let a: MaybePrimitive<object> = Reflect.apply(Reflect.get(t1 as object, Symbol.toPrimitive), t1, ["default"]);
                    let b: MaybePrimitive<object> = Reflect.apply(Reflect.get(t2 as object, Symbol.toPrimitive), t2, ["default"]);
                    if (isPrimitive(a) && isPrimitive(b)) {
                        return useCompare(a, b);
                    }
                }
                let a: MaybePrimitive<object> = Object.prototype.valueOf.call(t1);
                let b: MaybePrimitive<object> = Object.prototype.valueOf.call(t2);
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

export let useRandom: <T = number | bigint>(index: T) => T = <T = number | bigint>(index: T): T => {
    if (isNumber(index)) {
        let x = Number(index);
        let phi = (1 + Math.sqrt(5)) / 2;
        let vanDerCorput = (base: number, n: number) => {
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
        return (mixed * 1000000) as unknown as T;
    }
    throw new TypeError("Invalid input type");
};

export let useTraverse: <T extends object>(t: T, callback: BiPredicate<DeepPropertyKey<T>, DeepPropertyValue<T>>) => void = <T extends object>(t: T, callback: BiPredicate<DeepPropertyKey<T>, DeepPropertyValue<T>>): void => {
    if (isObject(t)) {
        let seen: WeakSet<object> = new WeakSet<object>();
        let traverse = (target: object): void => {
            if (!seen.has(target)) {
                seen.add(target);
                let stop: boolean = false;
                let properties: Array<string | symbol> = Reflect.ownKeys(target);
                for (let property of properties) {
                    let value: T[keyof T] = (target as T)[property as keyof T];
                    if(stop){
                        break;
                    }
                    if (validate(value)) {
                        if (isObject(value)) {
                            if (isIterable(value)) {
                                let index: number = 0;
                                for (let item of value) {
                                    if (validate(item)) {
                                        if (isObject(item)) {
                                            traverse(item);
                                        } else {
                                            if(!callback(index as DeepPropertyKey<T>, item as DeepPropertyValue<T>)){
                                                stop = true;
                                                break;
                                            }
                                        }
                                    }
                                    index++;
                                }
                            }
                        } else {
                            if(!callback(property as DeepPropertyKey<T>, value as DeepPropertyValue<T>)){
                                stop = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        traverse(t);
    }
};