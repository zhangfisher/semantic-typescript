import { Collector, useAllMatch, useAnyMatch, useCollect, useCount, useError, useFindAny, useFindFirst, useFindLast, useForEach, useGroup, useGroupBy, useJoin, useLog, useNoneMatch, usePartition, useReduce, useToArray, useToMap, useToSet, useWrite } from "./collector";
import { from } from "./factory";
import { isBigInt, isCollector, isFunction, isIterable, isObject, isString } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { Semantic } from "./semantic";
import { CollectableSymbol, OrderedCollectableSymbol, UnorderedCollectableSymbol, WindowCollectableSymbol } from "./symbol";
import { invalidate, validate } from "./utility";
import type { BiConsumer, BiFunctional, Comparator, Consumer, Functional, Predicate, Supplier, TriFunctional, Generator, BiPredicate, TriPredicate } from "./utility";

export abstract class Collectable<E> {

    protected readonly Collectable: symbol = CollectableSymbol;

    public constructor() {

    }

    public anyMatch(predicate: Predicate<E>): boolean {
        if(isFunction(predicate)){
            return useAnyMatch(predicate).collect(this);
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
        throw new TypeError("Invalid arguments.");
    }

    public count(): bigint {
        return useCount<E>().collect(this);
    }

    public error(): void;
    public error(accumulator: BiFunctional<string, E, string>): void;
    public error(accumulator: TriFunctional<string, E, bigint, string>): void;
    public error(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public error(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public error(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            useError<E>().collect(this);
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
            useError<E>(accumulator).collect(this);
        } else if(isString(argument1) && isFunction(argument2) && isString(argument3)){
            let prefix: string = argument1;
            let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
            let suffix: string = argument3;
            useError<E>(prefix, accumulator, suffix).collect(this);
        } {
            throw new TypeError("Invalid arguments.");
        }
    }

    public isEmpty(): boolean {
        return this.count() === 0n;
    }

    public findAny(): Optional<E> {
        return useFindAny<E>().collect(this);
    }

    public findFirst(): Optional<E> {
        return useFindFirst<E>().collect(this);
    }

    public findLast(): Optional<E> {
        return useFindLast<E>().collect(this);
    }

    public forEach(action: Consumer<E>): void
    public forEach(action: BiConsumer<E, bigint>): void
    public forEach(action: Consumer<E> | BiConsumer<E, bigint>): void {
        if (isFunction(action)) {
            useForEach(action).collect(this);
        }else{
            throw new TypeError("Action must be a function.");
        }
    }

    public group<K>(classifier: Functional<E, K>): Map<K, Array<E>> {
        if(isFunction(classifier)){
            return useGroup(classifier).collect(this);
        }
        throw new TypeError("Classifier must be a function.");
    }

    public groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>> {
        if(isFunction(keyExtractor) && isFunction(valueExtractor)){
            return useGroupBy(keyExtractor, valueExtractor).collect(this);
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
            return useJoin<E>().collect(this);
        }
        if (isString(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let delimiter: string = argument1;
            return useJoin<E>(delimiter).collect(this);
        }
        if (isString(argument1) && isFunction(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
            let suffix: string = argument3;
            return useJoin<E>(prefix, accumulator, suffix).collect(this);
        }
        if (isString(argument1) && isString(argument2) && isString(argument3)) {
            let prefix: string = argument1;
            let delimiter: string = argument2;
            let suffix: string = argument3;
            return useJoin<E>(prefix, delimiter, suffix).collect(this);
        }
        throw new TypeError("Invalid arguments.");
    }

    public log(): void;
    public log(accumulator: BiFunctional<string, E, string>): void;
    public log(accumulator: TriFunctional<string, E, bigint, string>): void;
    public log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void
    public log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void
    public log(argument1?: string | BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument2?: BiFunctional<string, E, string> | TriFunctional<string, E, bigint, string>, argument3?: string): void {
        if (invalidate(argument1) && invalidate(argument2) && invalidate(argument3)) {
            useLog<E>().collect(this);
        } else if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument1 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
            useLog<E>(accumulator).collect(this);
        } else if(isString(argument1) && isFunction(argument2) && isString(argument3)){
            let prefix: string = argument1;
            let accumulator: BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string> = argument2 as BiFunctional<string, E, string> & TriFunctional<string, E, bigint, string>;
            let suffix: string = argument3;
            useLog<E>(prefix, accumulator, suffix).collect(this);
        } {
            throw new TypeError("Invalid arguments.");
        }
    }

    public nonMatch(predicate: Predicate<E>): boolean {
        if(isFunction(predicate)){
            return useNoneMatch(predicate).collect(this);
        }
        throw new TypeError("Predicate must be a function.");
    }

    public partition(count: bigint): Array<Array<E>> {
        if(isBigInt(count)){
            return usePartition<E>(count).collect(this);
        }
        throw new TypeError("Count must be a BigInt.");
    }

    public partitionBy(classifier: Functional<E, bigint>): Array<Array<E>> {
        return this.collect<Array<Array<E>>, Array<Array<E>>>((): Array<Array<E>> => {
            return [];
        }, (array: Array<Array<E>>, element: E): Array<Array<E>> => {
            let index: bigint = classifier(element);
            while (index > BigInt(array.length) - 1n) {
                array.push([]);
            }
            array[Number(index)].push(element);
            return array;
        }, (result: Array<Array<E>>,): Array<Array<E>> => {
            return result;
        });
    }

    public reduce(accumulator: BiFunctional<E, E, E>): Optional<E>;
    public reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>;
    public reduce(identity: E, accumulator: BiFunctional<E, E, E>): E;
    public reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E;
    public reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): R;
    public reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): R;
    public reduce<R>(argument1?: R | E | BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>, argument2?: BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E> | BiFunctional<R, E, R> | TriFunctional<R, E, bigint, R>, argument3?: Functional<R, R>): R | E | Optional<E> {
        if (isFunction(argument1) && invalidate(argument2) && invalidate(argument3)) {
            let accumulator = argument1 as BiFunctional<E, E, E> | TriFunctional<E, E, bigint, E>;
            return useReduce(accumulator).collect(this);
        } else if (validate(argument1) && isFunction(argument2) && invalidate(argument3)) {
            let identity = argument1 as E;
            let accumulator = argument2 as BiFunctional<E, E, E> & TriFunctional<E, E, bigint, E>;
            return useReduce(identity, accumulator).collect(this);
        } else if (validate(argument1) && isFunction(argument2) && isFunction(argument3)) {
            let identity = argument1 as R;
            let accumulator = argument2 as BiFunctional<R, E, R> & TriFunctional<R, E, bigint, R>;
            let finisher = argument3 as Functional<R, R>;
            return useReduce(identity, accumulator, finisher).collect(this);
        } else {
            throw new TypeError("Invalid arguments.");
        }
    }

    public semantic(): Semantic<E> {
        let source: Generator<E> | Iterable<E> = this.source();
        if (isIterable(source)) {
            return from(source);
        } else if (isFunction(source)) {
            return new Semantic(source);
        } else {
            throw new TypeError("Invalid source.");
        }
    }

    public abstract source(): Generator<E> | Iterable<E>;

    public toArray(): Array<E> {
        return useToArray<E>().collect(this);
    }

    public toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V> {
        return useToMap<E, K, V>(keyExtractor, valueExtractor).collect(this);
    }

    public toSet(): Set<E> {
        return useToSet<E>().collect(this);
    }

    public write<S = string>(stream: WritableStream<S>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    public write<S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>;
    public write<S = string>(argument1: WritableStream<S>, argument2?: BiFunctional<WritableStream<S>, E, WritableStream<S>> | TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>> {
        if(isObject(argument1)){
            let stream: WritableStream<S> = argument1 as WritableStream<S>;
            if(isFunction(argument2)){
                let accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>> = argument2 as BiFunctional<WritableStream<S>, E, WritableStream<S>> & TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>;
                return useWrite(stream, accumulator);
            }else{
                return useWrite(stream);
            }
        }
        throw new TypeError("Invalid arguments.");
    }
};

export class UnorderedCollectable<E> extends Collectable<E> {

    protected readonly UnorderedCollectable: symbol = UnorderedCollectableSymbol;

    protected generator: Generator<E>;

    public constructor(generator: Generator<E>) {
        super();
        this.generator = generator;
    }

    public source(): Generator<E> {
        return this.generator;
    }
};

type Indexed<K, V> = {
    index: K;
    value: V;
}
export class OrderedCollectable<E> extends Collectable<E> {

    protected readonly OrderedCollectable: symbol = OrderedCollectableSymbol;

    protected ordered: Array<Indexed<bigint, E>> = [];

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(argument1: Iterable<E> | Generator<E>, argument2?: Comparator<E>) {
        super();
        let buffer: Array<Indexed<bigint, E>> = [];
        if (isIterable(argument1)) {
            let iterable: Iterable<E> = argument1;
            let index: bigint = 0n;
            for (let element of iterable) {
                buffer.push({
                    index: index,
                    value: element
                });
                index++;
            }
        } else if (isFunction(argument1)) {
            let generator: Generator<E> = argument1;
            generator((element: E, index: bigint): void => {
                buffer.push({
                    index: index,
                    value: element
                });
            }, (): boolean => false);

        } else {
            throw new TypeError("Invalid arguments.");
        }
        buffer.map((indexed: Indexed<bigint, E>, _index: number, array: Array<Indexed<bigint, E>>): Indexed<bigint, E> => {
            let length: bigint = BigInt(array.length);
            return {
                index: ((indexed.index % length) + length) % length,
                value: indexed.value
            }
        }).sort((a: Indexed<bigint, E>, b: Indexed<bigint, E>): number => {
            if (isFunction(argument2)) {
                let comparator: Comparator<E> = argument2;
                return comparator(a.value, b.value);
            } else {
                return useCompare(a.index, b.index);
            }
        }).forEach((indexed: Indexed<bigint, E>) => {
            this.ordered.push(indexed);
        });
    }

    public override source(): Generator<E> | Iterable<E> {
        return this.ordered.map((indexed: Indexed<bigint, E>) => indexed.value);
    }
};

export class WindowCollectable<E> extends OrderedCollectable<E> {

    protected readonly WindowCollectable: symbol = WindowCollectableSymbol;

    public constructor(iterable: Iterable<E>);
    public constructor(iterable: Iterable<E>, comparator: Comparator<E>);
    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Iterable<E> | Generator<E>, comparator?: Comparator<E>) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        } else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            } else {
                super(parameter);
            }
        }
    }

    public slide(size: bigint, step: bigint = 1n): Semantic<Semantic<E>> {
        if (size > 0n && step > 0n) {
            let source: Array<E> = this.toArray();
            let windows: Array<Array<E>> = [];
            let windowStartIndex: bigint = 0n;
            while (windowStartIndex < BigInt(source.length)) {
                let windowEnd = windowStartIndex + size;
                let window = source.slice(Number(windowStartIndex), Number(windowEnd));
                if (window.length > 0) {
                    windows.push(window);
                }
                windowStartIndex += step;
            }
            return from(windows).map((window: Array<E>) => from(window));
        }
        throw new RangeError("Invalid arguments.");
    }

    public tumble(size: bigint): Semantic<Semantic<E>> {
        return this.slide(size, size);
    }
};