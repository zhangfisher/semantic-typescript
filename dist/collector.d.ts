import type { Semantic } from "./semantic";
import type { BiFunctional, BiPredicate, Functional, Predicate, Supplier, TriFunctional, Generator, TriPredicate } from "./utility";
export declare class Collector<E, A, R> {
    protected identity: Supplier<A>;
    protected interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;
    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;
    protected finisher: Functional<A, R>;
    protected readonly Collector: symbol;
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    collect(generator: Generator<E>): R;
    collect(iterable: Iterable<E>): R;
    collect(semantic: Semantic<E>): R;
    static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
