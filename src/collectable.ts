import { Collector, useAllMatch, useAnyMatch, useCollect, useCount, useError, useFindAny, useFindFirst, useFindLast, useFindMaximum, useFindMinimum, useForEach, useGroup, useGroupBy, useJoin, useLog, useNoneMatch, usePartition, usePartitionBy, useReduce, useToArray, useToAsyncGeneratorFunction, useToGeneratorFunction, useToMap, useToSet, useWrite } from "./collector";
import { isBigInt, isCollector, isFunction, isObject, isString } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
import type {
    BiConsumer, BiFunctional, Comparator, Consumer, Functional,
    Predicate, Supplier, TriFunctional, Generator, BiPredicate, TriPredicate, Indexed
} from "./utility";


export abstract class Collectable<E> implements Iterable<E>, AsyncIterable<E> {

    protected readonly Collectable: symbol = CollectableSymbol;

    public constructor() {

    }

    public abstract [Symbol.iterator](): globalThis.Generator<E, void, undefined>;

    public abstract [Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined>;

    public anyMatch(predicate: Predicate<E>): boolean {
        if (isFunction(predicate)) {
            try {
                return useAnyMatch(predicate).collect(this);
            } catch (error) {
                throw new Error("Uncaught error on anyMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }

    public allMatch(predicate: Predicate<E>): boolean {
        return useAllMatch(predicate).collect(this);
    }

    public collect<A, R>(collector: Collector<E, A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R;
    public collect<A, R>(argument1: Supplier<A> | Collector<E, A, R>, argument2?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Predicate<E> | BiPredicate<E, bigint> | TriPredicate<E, bigint, A>, argument3?: BiFunctional<A, E, A> | TriFunctional<A, E, bigint, A> | Functional<A, R>, argument4?: Functional<A, R>): R {
        try {
            if (isCollector(argument1)) {
                let collector: Collector<E, A, R> = argument1 as Collector<E, A, R>;
                return collector.collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3)) {
                let identity: Supplier<A> = argument1 as Supplier<A>;
                let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument2 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
                let finisher: Functional<A, R> = argument3 as Functional<A, R>;
                return useCollect(identity, accumulator, finisher).collect(this);
            }
            if (isFunction(argument1) && isFunction(argument2) && isFunction(argument3) && isFunction(argument4)) {
                let identity: Supplier<A> = argument1 as Supplier<A>;
                let interrupt: Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A> = argument2 as Predicate<E> & BiPredicate<E, bigint> & TriPredicate<E, bigint, A>;
                let accumulator: BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A> = argument3 as BiFunctional<A, E, A> & TriFunctional<A, E, bigint, A>;
                let finisher: Functional<A, R> = argument4 as Functional<A, R>;
                return useCollect(identity, interrupt, accumulator, finisher).collect(this);
            }
        } catch (error) {
            throw new Error("Uncaught error on collect.");
        }
        throw new TypeError("Invalid arguments.");
    }

    public count(): bigint {
        return useCount<E>().collect(this.source());
    }

    public error(): void;
    public error(accumulator: BiFunctional<string, E, string>): void;
    public error(accumulator: TriFunctional<string, E, bigint, string>): void;
    public error(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public error(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public error(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                useError<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                useError<E>(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                useError<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on error.");
            }
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public isEmpty(): boolean {
        return this.count() === 0n;
    }

    public findAny(): Optional<E> {
        try {
            return useFindAny<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findAny.");
        }
    }

    public findFirst(): Optional<E> {
        try {
            return useFindFirst<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findFirst.");
        }
    }

    public findLast(): Optional<E> {
        try {
            return useFindLast<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findLast.");
        }
    }

    public findMaximum(): Optional<E>;
    public findMaximum(comparator: Comparator<E>): Optional<E>;
    public findMaximum(argument1?: Comparator<E>): Optional<E> {
        try {
            let comparator: Comparator<E> = isFunction(argument1) ? argument1 : useCompare;
            return useFindMaximum(comparator).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findMaximum.");
        }
    }

    public findMinimum(): Optional<E>;
    public findMinimum(comparator: Comparator<E>): Optional<E>;
    public findMinimum(argument1?: Comparator<E>): Optional<E> {
        try {
            let comparator: Comparator<E> = isFunction(argument1) ? argument1 : useCompare;
            return useFindMinimum(comparator).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on findMinimum.");
        }
    }

    public forEach(action: Consumer<E>): void
    public forEach(action: BiConsumer<E, bigint>): void
    public forEach(action: Consumer<E> | BiConsumer<E, bigint>): void {
        if (isFunction(action)) {
            try {
                useForEach(action).collect(this);
            } catch (error) {
                throw new Error("Uncaught error on forEach.");
            }
        } else {
            throw new TypeError("Action must be a function.");
        }
    }

    public group<K>(classifier: Functional<E, K>): Map<K, Array<E>> {
        if (isFunction(classifier)) {
            try {
                return useGroup(classifier).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on group.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }

    public groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>> {
        if (isFunction(keyExtractor) && isFunction(valueExtractor)) {
            try {
                return useGroupBy(keyExtractor, valueExtractor).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on groupBy.");
            }
        }
        throw new TypeError("Key and value extractors must be functions.");
    }

    public join(): string;
    public join(delimiter: string): string;
    public join(prefix: string, delimiter: string, suffix: string): string;
    public join(prefiex: string, accumulator: BiFunctional<string, E, string>, suffix: string): string;
    public join(prefiex: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string;
    public join(argument1?: string, argument2?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): string {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                return useJoin<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let delimiter: string = argument1;
                return useJoin<E>(delimiter).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                return useJoin<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        } else if (isString(argument1) && isString(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let delimiter: string = argument2;
                let suffix: string = argument3;
                return useJoin<E>(prefix, delimiter, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on join.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }

    public log(): void;
    public log(accumulator: BiFunctional<string, E, string>): void;
    public log(accumulator: TriFunctional<string, E, bigint, string>): void;
    public log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public log(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                useLog<E>(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        } else if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            try {
                let prefix: string = argument1;
                let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
                let suffix: string = argument3;
                useLog<E>(prefix, accumulator, suffix).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        } else {
            try {
                useLog<E>().collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on log.");
            }
        }
    }

    public nonMatch(predicate: Predicate<E>): boolean {
        if (isFunction(predicate)) {
            try {
                return useNoneMatch(predicate).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on nonMatch.");
            }
        }
        throw new TypeError("Predicate must be a function.");
    }

    public partition(count: bigint): Array<Array<E>> {
        if (isBigInt(count)) {
            try {
                return usePartition<E>(count).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on partition.");
            }
        }
        throw new TypeError("Count must be a BigInt.");
    }

    public partitionBy(classifier: Functional<E, bigint>): Array<Array<E>> {
        if (isFunction(classifier)) {
            try {
                let collector: Collector<E, Array<E[]>, Array<E[]>> = usePartitionBy(classifier);
                return collector.collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on partitionBy.");
            }
        }
        throw new TypeError("Classifier must be a function.");
    }

    public reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    public reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    public reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    public reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    public reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): R;
    public reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): R;
    public reduce<R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: Functional<R, R>): R | E | Optional<E> {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            try {
                let accumulator = argument1 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
                return useReduce(accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            try {
                let identity = argument1 as E;
                let accumulator = argument2 as BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E>;
                return useReduce(identity, accumulator).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            try {
                let identity = argument1 as R;
                let accumulator = argument2 as BiFunctional<R, E, R> & TriFunctional<R, E, bigint, R>;
                let finisher = argument3 as Functional<R, R>;
                return useReduce(identity, accumulator, finisher).collect(this.source());
            } catch (error) {
                throw new Error("Uncaught error on reduce.");
            }
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public semantic(): Semantic<E> {
        let source: Generator<E> = this.source();
        if (isFunction(source)) {
            try {
                return new Semantic(source);
            } catch (error) {
                throw new Error("Uncaught error on semantic.");
            }
        } else {
            throw new TypeError("Invalid source.");
        }
    }

    public abstract source(): Generator<E>;

    public toArray(): Array<E> {
        try {
            return useToArray<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toArray.");
        }
    }

    public toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
        try {
            return useToMap<E, K, V>(keyExtractor, valueExtractor).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toMap.");
        }
    }

    public toSet(): Set<E> {
        try {
            return useToSet<E>().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on toSet.");
        }
    }

    public write<S = string>(stream: WritableStream<S>): Promise<WritableStream<S>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Promise<WritableStream<S>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>>;
    public write<S = string>(argument1: WritableStream<S>, argument2?: BiFunctional<WritableStream<S>, E, WritableStream<S>> | TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>> {
        if (isObject(argument1)) {
            try {
                let stream: WritableStream<S> = argument1 as WritableStream<S>;
                if (isFunction(argument2)) {
                    let accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>> = argument2 as BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>;
                    return useWrite(stream, accumulator).collect(this.source());
                } else {
                    return useWrite(stream).collect(this.source());
                }
            } catch (error) {
                throw new Error("Uncaught error on write.");
            }
        }
        throw new TypeError("Invalid arguments.");
    }
};

export class UnorderedCollectable<E> extends Collectable<E> {

    protected readonly UnorderedCollectable: symbol = UnorderedCollectableSymbol;

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>);
    public constructor(argument1: Generator<E>) {
        super();
        if (isFunction(argument1)) {
            this.generator = argument1;
        } else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }

    public source(): Generator<E> {
        return this.generator;
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.Generator<E, void, undefined>> = useToGeneratorFunction();
            yield* collector.collect(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>> = useToAsyncGeneratorFunction();
            yield* collector.collect(this.generator);
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

};

export class OrderedCollectable<E> extends Collectable<E> {

    protected readonly OrderedCollectable: symbol = OrderedCollectableSymbol;

    protected buffer: Array<Indexed<E>>;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(argument1: Generator<E>, argument2?: Comparator<E>) {
        super();
        if (isFunction(argument1)) {
            try {
                if (isFunction(argument2)) {
                    let collector: Collector<E, Array<E>, Array<E>> = useToArray();
                    this.buffer = collector.collect(argument1).sort(argument2).map((element: E, index: number) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    });
                } else {
                    let collector: Collector<E, Array<E>, Array<E>> = useToArray();
                    this.buffer = collector.collect(argument1).map((element: E, index: number) => {
                        return {
                            element: element,
                            index: BigInt(index)
                        };
                    }).sort((a: Indexed<E>, b: Indexed<E>): number => {
                        return Number(a.index - b.index);
                    });
                }
            } catch (error) {
                throw new Error("Uncaught error on creating buffer.");
            }
        } else {
            throw new TypeError("Source must be an iterable or a generator function.");
        }
    }

    public override *[Symbol.iterator](): globalThis.Generator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.Generator<E, void, undefined>> = useToGeneratorFunction();
            yield* collector.collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }

    public override async *[Symbol.asyncIterator](): globalThis.AsyncGenerator<E, void, undefined> {
        try {
            let collector: Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>> = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }

    public override source(): Generator<E> {
        try {
            return (accept: Consumer<E> | BiConsumer<E, bigint>, interrupt: Predicate<E> | BiPredicate<E, bigint>): void => {
                for (let indexed of this.buffer) {
                    if (interrupt(indexed.element, indexed.index)) {
                        break;
                    }
                    accept(indexed.element, indexed.index);
                }
            };
        } catch (error) {
            throw new Error("Uncaught error on creating source.");
        }
    }

    public isEmpty(): boolean {
        return this.buffer.length === 0;
    }
};