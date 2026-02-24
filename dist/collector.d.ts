import type { Collectable } from "./collectable";
import { HashMap } from "./map";
import { Optional } from "./optional";
import type { Semantic } from "./semantic";
import { HashSet } from "./set";
import { type BiFunctional, type BiPredicate, type Functional, type Predicate, type Supplier, type TriFunctional, type Generator, type TriPredicate, type Consumer, type BiConsumer, type Comparator } from "./utility";
export declare class Collector<E, A, R> {
    protected identity: Supplier<A>;
    protected interrupt: Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>;
    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;
    protected finisher: Functional<A, R>;
    protected readonly Collector: symbol;
    protected constructor(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    protected constructor(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    collect(generator: Generator<E>): R;
    collect(iterable: Iterable<E>): R;
    collect(semantic: Semantic<E>): R;
    collect(collectable: Collectable<E>): R;
    collect(start: number, end: number): R;
    collect(start: bigint, end: bigint): R;
    static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
interface UseAnyMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
}
export declare let useAnyMatch: UseAnyMatch;
interface UseAllMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
}
export declare let useAllMatch: UseAllMatch;
interface UseCollect {
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    <E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
export declare let useCollect: UseCollect;
export declare let useCount: <E = unknown>() => Collector<E, bigint, bigint>;
interface UseError {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useError: UseError;
interface UseFindAt {
    <E>(index: number): Collector<E, Array<E>, Optional<E>>;
    <E>(index: bigint): Collector<E, Array<E>, Optional<E>>;
}
export declare let useFindAt: UseFindAt;
export declare let useFindFirst: <E>() => Collector<E, Optional<E>, Optional<E>>;
export declare let useFindAny: <E>() => Collector<E, Optional<E>, Optional<E>>;
export declare let useFindLast: <E>() => Collector<E, Optional<E>, Optional<E>>;
interface UseFindMaximum {
    <E>(): Collector<E, Optional<E>, Optional<E>>;
    <E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>;
}
export declare let useFindMaximum: UseFindMaximum;
interface UseFindMinimum {
    <E>(): Collector<E, Optional<E>, Optional<E>>;
    <E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>;
}
export declare let useFindMinimum: UseFindMinimum;
interface UseForEach {
    <E>(action: Consumer<E>): Collector<E, bigint, bigint>;
    <E>(action: BiConsumer<E, bigint>): Collector<E, bigint, bigint>;
}
export declare let useForEach: UseForEach;
interface UseNonMatch {
    <E>(predicate: Predicate<E>): Collector<E, boolean, boolean>;
    <E>(predicate: BiPredicate<E, bigint>): Collector<E, boolean, boolean>;
}
export declare let useNoneMatch: UseNonMatch;
interface UseGroup {
    <E, K>(classifier: Functional<E, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>;
    <E, K>(classifier: BiFunctional<E, bigint, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>;
}
export declare let useGroup: UseGroup;
interface UseGroupBy {
    <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V[]>, Map<K, V[]>>;
    <E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Collector<E, Map<K, V[]>, Map<K, V[]>>;
}
export declare let useGroupBy: UseGroupBy;
interface UseJoin {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(delimiter: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, delimiter: string, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useJoin: UseJoin;
interface UseLog {
    <E = unknown>(): Collector<E, string, string>;
    <E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>;
    <E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>;
    <E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>;
}
export declare let useLog: UseLog;
export declare let usePartition: <E>(count: bigint) => Collector<E, Array<Array<E>>, Array<Array<E>>>;
interface UsePartitionBy {
    <E>(classifier: Functional<E, bigint>): Collector<E, Array<E[]>, Array<E[]>>;
    <E>(classifier: BiFunctional<E, bigint, bigint>): Collector<E, Array<E[]>, Array<E[]>>;
}
export declare let usePartitionBy: UsePartitionBy;
interface UseReduce {
    <E>(accumulator: BiFunctional<E, E, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(accumulator: TriFunctional<E, E, bigint, E>): Collector<E, Optional<E>, Optional<E>>;
    <E>(identity: E, accumulator: BiFunctional<E, E, E>): Collector<E, E, E>;
    <E>(identity: E, accumulator: TriFunctional<E, E, bigint, E>): Collector<E, E, E>;
    <E, R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): Collector<E, R, R>;
    <E, R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): Collector<E, R, R>;
}
export declare let useReduce: UseReduce;
export declare let useToArray: <E>() => Collector<E, E[], E[]>;
interface UseToMap {
    <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V>, Map<K, V>>;
    <E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Collector<E, Map<K, V>, Map<K, V>>;
}
export declare let useToMap: UseToMap;
interface UseToHashMap {
    <E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, HashMap<K, V>, HashMap<K, V>>;
    <E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Collector<E, HashMap<K, V>, HashMap<K, V>>;
}
export declare let useToHashMap: UseToHashMap;
export declare let useToSet: <E>() => Collector<E, Set<E>, Set<E>>;
export declare let useToHashSet: <E>() => Collector<E, HashSet<E>, HashSet<E>>;
interface UseWrite {
    <E, S = string>(stream: WritableStream<S>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    <E, S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
}
export declare let useWrite: UseWrite;
interface UseNumericSummate {
    <E>(): Collector<E, number, number>;
    <E>(mapper: Functional<E, number>): Collector<E, number, number>;
}
export declare let useNumericSummate: UseNumericSummate;
interface UseBigIntSummate {
    <E>(): Collector<E, bigint, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, bigint, bigint>;
}
export declare let useBigIntSummate: UseBigIntSummate;
interface UseNumericAverage {
    <E>(): Collector<E, NumericAverageAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, NumericAverageAccumulator, number>;
}
interface NumericAverageAccumulator {
    summate: number;
    count: number;
}
export declare let useNumericAverage: UseNumericAverage;
interface UseBigIntAverage {
    <E>(): Collector<E, BigIntAverageAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntAverageAccumulator, bigint>;
}
interface BigIntAverageAccumulator {
    summate: bigint;
    count: bigint;
}
export declare let useBigIntAverage: UseBigIntAverage;
export declare let useFrequency: <E>() => Collector<E, Map<E, bigint>, Map<E, bigint>>;
interface UseNumericMode {
    <E>(): Collector<E, Map<number, bigint>, number>;
    <E>(mapper: Functional<E, number>): Collector<E, Map<number, bigint>, number>;
}
export declare let useNumericMode: UseNumericMode;
interface UseBigIntMode {
    <E>(): Collector<E, Map<bigint, bigint>, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, Map<bigint, bigint>, bigint>;
}
export declare let useBigIntMode: UseBigIntMode;
interface UseNumericVariance {
    <E>(): Collector<E, VarianceAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, VarianceAccumulator, number>;
}
interface VarianceAccumulator {
    summate: number;
    summateOfSquares: number;
    count: number;
}
export declare let useNumericVariance: UseNumericVariance;
interface UseBigIntVariance {
    <E>(): Collector<E, BigIntVarianceAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntVarianceAccumulator, bigint>;
}
interface BigIntVarianceAccumulator {
    summate: bigint;
    summateOfSquares: bigint;
    count: bigint;
}
export declare let useBigIntVariance: UseBigIntVariance;
interface UseNumericStandardDeviation {
    <E>(): Collector<E, StandardDeviationAccumulator, number>;
    <E>(mapper: Functional<E, number>): Collector<E, StandardDeviationAccumulator, number>;
}
interface StandardDeviationAccumulator {
    summate: number;
    summateOfSquares: number;
    count: number;
}
export declare let useNumericStandardDeviation: UseNumericStandardDeviation;
interface UseBigIntStandardDeviation {
    <E>(): Collector<E, BigIntStandardDeviationAccumulator, bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, BigIntStandardDeviationAccumulator, bigint>;
}
interface BigIntStandardDeviationAccumulator {
    summate: bigint;
    summateOfSquares: bigint;
    count: bigint;
}
export declare let useBigIntStandardDeviation: UseBigIntStandardDeviation;
interface UseNumericMedian {
    <E>(): Collector<E, number[], number>;
    <E>(mapper: Functional<E, number>): Collector<E, number[], number>;
}
export declare let useNumericMedian: UseNumericMedian;
interface UseBigIntMedian {
    <E>(): Collector<E, bigint[], bigint>;
    <E>(mapper: Functional<E, bigint>): Collector<E, bigint[], bigint>;
}
export declare let useBigIntMedian: UseBigIntMedian;
export declare let useToGeneratorFunction: <E>() => Collector<E, Array<E>, globalThis.Generator<E, void, undefined>>;
export declare let useToAsyncGeneratorFunction: <E>() => Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>>;
export {};
