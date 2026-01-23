import type { Collectable } from "./collectable";
import { Optional } from "./optional";
import type { Semantic } from "./semantic";
import { type BiFunctional, type BiPredicate, type Functional, type Predicate, type Supplier, type TriFunctional, type Generator, type TriPredicate, type Consumer, type BiConsumer } from "./utility";
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
    collect(collectable: Collectable<E>): R;
    collect(start: number, end: number): R;
    collect(start: bigint, end: bigint): R;
    static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
export declare let useAnyMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean>;
export declare let useAllMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean>;
interface UseCollect {
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
export declare let useCollect: UseCollect;
export declare let useCount: <E = unknown>() => Collector<E, bigint, bigint>;
export interface UseError {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useError: UseLog;
export declare let useFindFirst: <E>() => Collector<E, Optional<E>, Optional<E>>;
export declare let useFindAny: <E>() => Collector<E, Optional<E>, Optional<E>>;
export declare let useFindLast: <E>() => Collector<E, Optional<E>, Optional<E>>;
export interface UseForEach {
    <E>(action: Consumer<E>): Collector<E, bigint, bigint>;
    <E>(action: BiConsumer<E, bigint>): Collector<E, bigint, bigint>;
}
export declare let useForEach: UseForEach;
export declare let useNoneMatch: <E>(predicate: Predicate<E>) => Collector<E, boolean, boolean>;
export declare let useGroup: <E, K>(classifier: Functional<E, K>) => Collector<E, Map<K, E[]>, Map<K, E[]>>;
export declare let useGroupBy: <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>) => Collector<E, Map<K, V[]>, Map<K, V[]>>;
export interface UseJoin {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(delimiter: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, delimiter: string, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useJoin: UseJoin;
export interface UseLog {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useLog: UseLog;
export declare let usePartition: <E>(count: bigint) => Collector<E, Array<Array<E>>, Array<Array<E>>>;
export declare let usePartitionBy: <E>(classifier: Functional<E, bigint>) => Collector<E, Array<E[]>, Array<E[]>>;
export interface UseReduce {
    <E>(accumulator: BiFunctional<E, E, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(accumulator: TriFunctional<E, E, bigint, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(identity: E, accumulator: BiFunctional<E, E, E>): Collector<E, E, E>;
    <E>(identity: E, accumulator: TriFunctional<E, E, bigint, E>): Collector<E, E, E>;
    <E, R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): Collector<E, R, R>;
    <E, R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): Collector<E, R, R>;
}
export declare let useReduce: UseReduce;
export declare let useToArray: <E>() => Collector<E, E[], E[]>;
export declare let useToMap: <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>) => Collector<E, Map<K, V>, Map<K, V>>;
export declare let useToSet: <E>() => Collector<E, Set<E>, Set<E>>;
export interface UseWrite {
    <E, S = string>(stream: WritableStream<S>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
}
export declare let useWrite: UseWrite;
export type NumericAverageInformation = {
    summate: number;
    count: number;
};
export interface UseNumericAverage {
    (): Collector<number, NumericAverageInformation, number>;
    <E>(mapper: Functional<E, number>): Collector<E, NumericAverageInformation, number>;
}
export declare let useNumericAverage: UseNumericAverage;
export type BigIntAverageInformation = {
    summate: bigint;
    count: bigint;
};
export interface UseBigIntAverage {
    (): Collector<bigint, BigIntAverageInformation, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntAverageInformation, bigint>;
}
export declare let useBigIntAverage: UseBigIntAverage;
export declare let useFrequency: <E>() => Collector<E, Map<E, bigint>, Map<E, bigint>>;
export interface UseNumericSummate {
    (): Collector<number, number, number>;
    <E>(mapper: Functional<E, number>): Collector<E, number, number>;
}
export declare let useSummate: UseNumericSummate;
export {};
