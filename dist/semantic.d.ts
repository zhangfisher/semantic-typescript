export type Invalid<T> = T extends null | undefined ? T : never;
export type Valid<T> = T extends null | undefined ? never : T;
export type MaybeInvalid<T> = T | null | undefined;
export declare let validate: <T>(t: MaybeInvalid<T>) => t is T;
export declare let invalidate: <T>(t: MaybeInvalid<T>) => t is (null | undefined);
export declare let isBoolean: (t: unknown) => t is boolean;
export declare let isString: (t: unknown) => t is string;
export declare let isNumber: (t: unknown) => t is number;
export declare let isFunction: (t: unknown) => t is Function;
export declare let isObject: (t: unknown) => t is object;
export declare let isSymbol: (t: unknown) => t is symbol;
export declare let isBigint: (t: unknown) => t is bigint;
export declare let isIterable: (t: unknown) => t is Iterable<unknown>;
export declare let useCompare: <T>(t1: T, t2: T) => number;
export declare let useRandom: <T = number | bigint>(index: T) => T;
export declare let OptionalSymbol: symbol;
export declare let SemanticSymbol: symbol;
export declare let CollectorsSymbol: symbol;
export declare let CollectableSymbol: symbol;
export declare let OrderedCollectableSymbol: symbol;
export declare let UnorderedCollectableSymbol: symbol;
export declare let StatisticsSymbol: symbol;
export declare let isOptional: (t: unknown) => t is Optional<unknown>;
export declare let isSemantic: (t: unknown) => t is Semantic<unknown>;
export declare let isCollector: (t: unknown) => t is Collector<unknown, unknown, unknown>;
export declare let isCollectable: (t: unknown) => t is Collectable<unknown>;
export declare let isOrderedCollectable: (t: unknown) => t is OrderedCollectable<unknown>;
export declare let isUnorderedCollectable: (t: unknown) => t is UnorderedCollectable<unknown>;
export declare let isStatistics: (t: unknown) => t is Statistics<unknown, number | bigint>;
export interface Runnable {
    (): void;
}
export interface Supplier<R> {
    (): R;
}
export interface Functional<T, R> {
    (t: T): R;
}
export interface Predicate<T> {
    (t: T): boolean;
}
export interface BiFunctional<T, U, R> {
    (t: T, u: U): R;
}
export interface BiPredicate<T, U> {
    (t: T, u: U): boolean;
}
export interface Comparator<T> {
    (t1: T, t2: T): number;
}
export interface TriFunctional<T, U, V, R> {
    (t: T, u: U, v: V): R;
}
export interface Consumer<T> {
    (t: T): void;
}
export interface BiConsumer<T, U> {
    (t: T, u: U): void;
}
export interface TriConsumer<T, U, V> {
    (t: T, u: U, v: V): void;
}
export interface Generator<T> {
    (accept: BiConsumer<T, bigint>, interrupt: Predicate<T>): void;
}
declare class Optional<T> {
    protected value: MaybeInvalid<T>;
    protected readonly Optional: Symbol;
    protected constructor(value: MaybeInvalid<T>);
    filter(predicate: Predicate<T>): Optional<T>;
    get(): T;
    getOrDefault(defaultValue: T): T;
    ifPresent(action: Consumer<T>): void;
    isEmpty(): boolean;
    isPresent(): boolean;
    map<R>(mapper: Functional<T, R>): Optional<R>;
    static of<T>(value: MaybeInvalid<T>): Optional<T>;
    static ofNullable<T>(value?: MaybeInvalid<T>): Optional<T>;
    static ofNonNull<T>(value: T): Optional<T>;
}
export declare let empty: <E>() => Semantic<E>;
export declare let fill: <E>(element: E | Supplier<E>, count: bigint) => Semantic<E>;
export declare let from: <E>(iterable: Iterable<E>) => Semantic<E>;
export declare let range: <N extends number | bigint>(start: N, end: N, step: N) => Semantic<N>;
export declare function iterate<E>(generator: Generator<E>): Semantic<E>;
export declare class Semantic<E> {
    protected generator: Generator<E>;
    protected readonly Semantic: Symbol;
    constructor(generator: Generator<E>);
    concat(other: Semantic<E>): Semantic<E>;
    concat(other: Iterable<E>): Semantic<E>;
    distinct(): Semantic<E>;
    distinct(comparator: Comparator<E>): Semantic<E>;
    dropWhile(predicate: Predicate<E>): Semantic<E>;
    filter(predicate: Predicate<E>): Semantic<E>;
    flat(mapper: Functional<E, Iterable<E> | Semantic<E>>): Semantic<E>;
    flatMap<R>(mapper: Functional<E, Iterable<R> | Semantic<R>>): Semantic<R>;
    limit(n: number): Semantic<E>;
    limit(n: bigint): Semantic<E>;
    map<R>(mapper: Functional<E, R>): Semantic<R>;
    peek(consumer: BiConsumer<E, bigint>): Semantic<E>;
    redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E>;
    reverse(): Semantic<E>;
    shuffle(): Semantic<E>;
    shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>;
    skip(n: number): Semantic<E>;
    skip(n: bigint): Semantic<E>;
    sorted(): OrderedCollectable<E>;
    sorted(comparator: Comparator<E>): OrderedCollectable<E>;
    sub(start: bigint, end: bigint): Semantic<E>;
    takeWhile(predicate: Predicate<E>): Semantic<E>;
    toOrdered(): OrderedCollectable<E>;
    toNumericStatistics(): Statistics<E, number>;
    toBigintStatistics(): Statistics<E, bigint>;
    toUnoredered(): UnorderedCollectable<E>;
    toWindow(): WindowCollectable<E>;
    translate(offset: bigint): Semantic<E>;
    translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>;
}
export declare class Collector<E, A, R> {
    protected identity: Supplier<A>;
    protected interruptor: Predicate<E>;
    protected accumulator: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A>;
    protected finisher: Functional<A, R>;
    protected readonly Collector: symbol;
    constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>);
    constructor(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>);
    collect(generator: Generator<E>): R;
    collect(iterable: Iterable<E>): R;
    static full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>;
    static shortable<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>;
}
export declare abstract class Collectable<E> {
    constructor();
    anyMatch(predicate: Predicate<E>): boolean;
    allMatch(predicate: Predicate<E>): boolean;
    collect<A, R>(collector: Collector<E, A, R>): R;
    collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    count(): bigint;
    isEmpty(): boolean;
    findAny(): Optional<E>;
    findFirst(): Optional<E>;
    findLast(): Optional<E>;
    forEach(action: BiConsumer<E, bigint>): void;
    group<K>(classifier: Functional<E, K>): Map<K, Array<E>>;
    groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>;
    join(): string;
    join(delimiter: string): string;
    join(prefix: string, delimiter: string, suffix: string): string;
    join(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): string;
    join(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string;
    log(): void;
    log(accumulator: BiFunctional<string, E, string>): void;
    log(accumulator: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>): void;
    log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void;
    log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void;
    nonMatch(predicate: Predicate<E>): boolean;
    partition(count: bigint): Array<Array<E>>;
    partitionBy(classifier: Functional<E, bigint>): Array<Array<E>>;
    reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: BiFunctional<R, R, R>): R;
    reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: BiFunctional<R, R, R>): R;
    semantic(): Semantic<E>;
    protected abstract source(): Generator<E> | Iterable<E>;
    toArray(): Array<E>;
    toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>;
    toSet(): Set<E>;
}
export declare class UnorderedCollectable<E> extends Collectable<E> {
    protected generator: Generator<E>;
    constructor(generator: Generator<E>);
    source(): Generator<E>;
}
type Indexed<K, V> = {
    index: K;
    value: V;
};
export declare class OrderedCollectable<E> extends Collectable<E> {
    protected ordered: Array<Indexed<bigint, E>>;
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    source(): Generator<E> | Iterable<E>;
}
export declare class WindowCollectable<E> extends OrderedCollectable<E> {
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    slide(size: bigint, step?: bigint): Semantic<Semantic<E>>;
    tumble(size: bigint): Semantic<Semantic<E>>;
}
export declare abstract class Statistics<E, D extends number | bigint> extends OrderedCollectable<E> {
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    count(): bigint;
    maximum(): Optional<E>;
    maximum(comparator: Comparator<E>): Optional<E>;
    minimum(): Optional<E>;
    minimum(comparator: Comparator<E>): Optional<E>;
    abstract range(): D;
    abstract range(mapper: Functional<E, D>): D;
    abstract variance(): D;
    abstract variance(mapper: Functional<E, D>): D;
    abstract standardDeviation(): D;
    abstract standardDeviation(mapper: Functional<E, D>): D;
    abstract mean(): D;
    abstract mean(mapper: Functional<E, D>): D;
    abstract median(): D;
    abstract median(mapper: Functional<E, D>): D;
    abstract mode(): D;
    abstract mode(mapper: Functional<E, D>): D;
    abstract frequency(): Map<D, bigint>;
    abstract frequency(mapper: Functional<E, D>): Map<D, bigint>;
    abstract summate(): D;
    abstract summate(mapper: Functional<E, D>): D;
    abstract quantile(quantile: number): D;
    abstract quantile(quantile: number, mapper: Functional<E, D>): D;
    abstract interquartileRange(): D;
    abstract interquartileRange(mapper: Functional<E, D>): D;
    abstract skewness(): D;
    abstract skewness(mapper: Functional<E, D>): D;
    abstract kurtosis(): D;
    abstract kurtosis(mapper: Functional<E, D>): D;
}
export declare class NumericStatistics<E> extends Statistics<E, number> {
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    range(): number;
    range(mapper: Functional<E, number>): number;
    variance(): number;
    variance(mapper: Functional<E, number>): number;
    standardDeviation(): number;
    standardDeviation(mapper: Functional<E, number>): number;
    mean(): number;
    mean(mapper: Functional<E, number>): number;
    median(): number;
    median(mapper: Functional<E, number>): number;
    mode(): number;
    mode(mapper: Functional<E, number>): number;
    frequency(): Map<number, bigint>;
    frequency(mapper: Functional<E, number>): Map<number, bigint>;
    summate(): number;
    summate(mapper: Functional<E, number>): number;
    quantile(quantile: number): number;
    quantile(quantile: number, mapper: Functional<E, number>): number;
    interquartileRange(): number;
    interquartileRange(mapper: Functional<E, number>): number;
    skewness(): number;
    skewness(mapper: Functional<E, number>): number;
    kurtosis(): number;
    kurtosis(mapper: Functional<E, number>): number;
}
export declare class BigIntStatistics<E> extends Statistics<E, bigint> {
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    range(): bigint;
    range(mapper: Functional<E, bigint>): bigint;
    variance(): bigint;
    variance(mapper: Functional<E, bigint>): bigint;
    standardDeviation(): bigint;
    standardDeviation(mapper: Functional<E, bigint>): bigint;
    mean(): bigint;
    mean(mapper: Functional<E, bigint>): bigint;
    median(): bigint;
    median(mapper: Functional<E, bigint>): bigint;
    mode(): bigint;
    mode(mapper: Functional<E, bigint>): bigint;
    frequency(): Map<bigint, bigint>;
    frequency(mapper: Functional<E, bigint>): Map<bigint, bigint>;
    summate(): bigint;
    summate(mapper: Functional<E, bigint>): bigint;
    quantile(quantile: number): bigint;
    quantile(quantile: number, mapper: Functional<E, bigint>): bigint;
    interquartileRange(): bigint;
    interquartileRange(mapper: Functional<E, bigint>): bigint;
    skewness(): bigint;
    skewness(mapper: Functional<E, bigint>): bigint;
    kurtosis(): bigint;
    kurtosis(mapper: Functional<E, bigint>): bigint;
}
export {};
