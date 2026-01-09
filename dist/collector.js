import { isBigInt, isFunction, isIterable, isNumber, isSemantic } from "./guard";
import { CollectableSymbol } from "./symbol";
export class Collector {
    identity;
    interrupt;
    accumulator;
    finisher;
    Collector = CollectableSymbol;
    constructor(identity, interruptor, accumulator, finisher) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        }
        else {
            throw new TypeError("Invalid arguments");
        }
    }
    collect(argument1, argument2) {
        let accumulator = this.identity();
        let count = 0n;
        if (isFunction(argument1)) {
            let generator = argument1;
            generator((element, index) => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, (element, index) => this.interrupt(element, index, accumulator));
        }
        else if (isIterable(argument1)) {
            let iterable = argument1;
            let index = 0n;
            for (let element of iterable) {
                if (this.interrupt(element, index, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, element, count);
                count++;
                index++;
            }
        }
        else if (isSemantic(argument1)) {
            let semantic = argument1;
            let generator = Reflect.get(semantic, "generator");
            if (isFunction(generator)) {
                generator((element, index) => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element, index) => this.interrupt(element, index, accumulator));
            }
            else {
                throw new TypeError("Invalid arguments");
            }
        }
        else if (isNumber(argument1) && isNumber(argument2)) {
            let start = argument1 < argument2 ? argument1 : argument2;
            let end = argument1 > argument2 ? argument1 : argument2;
            for (let i = start; i < end; i++) {
                if (this.interrupt(i, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i, count);
                count++;
            }
        }
        else if (isBigInt(argument1) && isBigInt(argument2)) {
            let start = argument1 < argument2 ? argument1 : argument2;
            let end = argument1 > argument2 ? argument1 : argument2;
            for (let i = start; i < end; i++) {
                if (this.interrupt(i, count, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, i, count);
                count++;
            }
        }
        return this.finisher(accumulator);
    }
    static full(identity, accumulator, finisher) {
        return new Collector(identity, () => false, accumulator, finisher);
    }
    static shortable(identity, interruptor, accumulator, finisher) {
        return new Collector(identity, interruptor, accumulator, finisher);
    }
}
;
