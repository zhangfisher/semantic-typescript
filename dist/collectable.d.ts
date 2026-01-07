import { Collector } from "./collector";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import type { BiConsumer, BiFunctional, Comparator, Consumer, Functional, Predicate, Supplier, TriFunctional, Generator, BiPredicate, TriPredicate } from "./utility";
export declare abstract class Collectable<E> {
    protected readonly Collectable: symbol;
    constructor();
    anyMatch(predicate: Predicate<E>): boolean;
    allMatch(predicate: Predicate<E>): boolean;
    collect<A, R>(collector: Collector<E, A, R>): R;
    collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    count(): bigint;
    isEmpty(): boolean;
    findAny(): Optional<E>;
    findFirst(): Optional<E>;
    findLast(): Optional<E>;
    forEach(action: Consumer<E>): void;
    forEach(action: BiConsumer<E, bigint>): void;
    group<K>(classifier: Functional<E, K>): Map<K, Array<E>>;
    groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>>;
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
    write(stream: WritableStream<string>): Promise<WritableStream<string>>;
    write(stream: WritableStream<string>, accumulator: BiFunctional<E, bigint, string>): Promise<WritableStream<string>>;
    write(stream: WritableStream<Uint8Array>, accumulator: BiFunctional<E, bigint, Uint8Array>): Promise<WritableStream<Uint8Array>>;
}
export declare class UnorderedCollectable<E> extends Collectable<E> {
    protected readonly UnorderedCollectable: symbol;
    protected generator: Generator<E>;
    constructor(generator: Generator<E>);
    source(): Generator<E>;
}
type Indexed<K, V> = {
    index: K;
    value: V;
};
export declare class OrderedCollectable<E> extends Collectable<E> {
    protected readonly OrderedCollectable: symbol;
    protected ordered: Array<Indexed<bigint, E>>;
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    source(): Generator<E> | Iterable<E>;
}
export declare class WindowCollectable<E> extends OrderedCollectable<E> {
    protected readonly WindowCollectable: symbol;
    constructor(iterable: Iterable<E>);
    constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    constructor(generator: Generator<E>);
    constructor(generator: Generator<E>, comparator: Comparator<E>);
    slide(size: bigint, step?: bigint): Semantic<Semantic<E>>;
    tumble(size: bigint): Semantic<Semantic<E>>;
}
export {};
