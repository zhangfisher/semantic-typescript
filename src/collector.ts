import { isFunction, isIterable, isSemantic } from "./guard";
import type { Semantic } from "./semantic";
import { CollectableSymbol } from "./symbol";
import type { BiFunctional, BiPredicate, Functional, Predicate, Supplier, TriFunctional, Generator, TriPredicate } from "./utility";

export class Collector<E, A, R> {

    protected identity: Supplier<A>;

    protected interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;

    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;

    protected finisher: Functional<A, R>;

    protected readonly Collector: symbol = CollectableSymbol;

    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>) {
        if (isFunction(identity) && isFunction(interruptor) && isFunction(accumulator) && isFunction(finisher)) {
            this.identity = identity;
            this.interrupt = interruptor;
            this.accumulator = accumulator;
            this.finisher = finisher;
        } else {
            throw new TypeError("Invalid arguments");
        }
    }

    public collect(generator: Generator<E>): R;
    public collect(iterable: Iterable<E>): R;
    public collect(semantic: Semantic<E>): R;
    public collect(parameter: Generator<E> | Iterable<E> | Semantic<E>): R {
        let accumulator: A = this.identity();
        let count: bigint = 0n;
        if (isFunction(parameter)) {
            parameter((element: E, index: bigint): void => {
                accumulator = this.accumulator(accumulator, element, index);
                count++;
            }, (element: E, index: bigint): boolean => this.interrupt(element, index, accumulator));
        } else if (isIterable(parameter)) {
            let iterable: Iterable<E> = parameter;
            let index: bigint = 0n;
            for (let element of iterable) {
                if (this.interrupt(element, index, accumulator)) {
                    break;
                }
                accumulator = this.accumulator(accumulator, element, count);
                count++;
                index++;
            }
        }else if (isSemantic(parameter)) {
            let semantic: Semantic<E> = parameter;
            let generator: Generator<E> = Reflect.get(semantic, "generator");
            if(isFunction(generator)){
                generator((element: E, index: bigint): void => {
                    accumulator = this.accumulator(accumulator, element, index);
                    count++;
                }, (element: E, index: bigint): boolean => this.interrupt(element, index, accumulator));
            }else{
                throw new TypeError("Invalid arguments");
            }
        }
        return this.finisher(accumulator);
    }

    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector(identity, () => false, accumulator, finisher);
    }

    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>
    public static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E> | BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R> {
        return new Collector<E, A, R>(identity, interruptor, accumulator, finisher);
    }
};