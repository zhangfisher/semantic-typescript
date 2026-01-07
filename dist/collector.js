import { isFunction, isIterable, isSemantic } from "./guard";
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
    collect(parameter) {
        let accumulator = this.identity();
        let count = 0n;
        if (isFunction(parameter)) {
            parameter((element, index) => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, (element, index) => this.interrupt(element, index, accumulator));
        }
        else if (isIterable(parameter)) {
            let iterable = parameter;
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
        else if (isSemantic(parameter)) {
            let semantic = parameter;
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
