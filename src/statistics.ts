import { OrderedCollectable } from "./collectable";
import {
    Collector, useBigIntAverage, useBigIntMedian, useBigIntMode, useBigIntSummate, useBigIntVariance,
    useFrequency, useNumericAverage, useNumericMedian, useNumericMode, useNumericStandardDeviation,
    useNumericSummate, useNumericVariance,
    useToAsyncGeneratorFunction,
    useToGeneratorFunction
} from "./collector";
import { isFunction } from "./guard";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import { StatisticsSymbol, NumericStatisticsSymbol, BigIntStatisticsSymbol } from "./symbol";
import type { Comparator, Functional, Generator } from "./utility";

export abstract class Statistics<E, D extends number | bigint> extends OrderedCollectable<E> {

    protected readonly Statistics: symbol = StatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "Statistics": {
                value: StatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
        Object.freeze(this);
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

    public count(): bigint {
        return BigInt(this.buffer.length);
    }

    public abstract average(): D;
    public abstract average(mapper: Functional<E, D>): D;

    public abstract range(): D;
    public abstract range(mapper: Functional<E, D>): D;

    public abstract variance(): D;
    public abstract variance(mapper: Functional<E, D>): D;

    public abstract standardDeviation(): D;
    public abstract standardDeviation(mapper: Functional<E, D>): D;

    public abstract mean(): D;
    public abstract mean(mapper: Functional<E, D>): D;

    public abstract median(): D;
    public abstract median(mapper: Functional<E, D>): D;

    public abstract mode(): D;
    public abstract mode(mapper: Functional<E, D>): D;

    public frequency(): Map<E, bigint> {
        return useFrequency<E>().collect(this.source());
    }

    public abstract summate(): D;
    public abstract summate(mapper: Functional<E, D>): D;

    public abstract quantile(quantile: number): D;
    public abstract quantile(quantile: number, mapper: Functional<E, D>): D;

    public abstract interquartileRange(): D;
    public abstract interquartileRange(mapper: Functional<E, D>): D;

    public abstract skewness(): D;
    public abstract skewness(mapper: Functional<E, D>): D;

    public abstract kurtosis(): D;
    public abstract kurtosis(mapper: Functional<E, D>): D;
};
Object.freeze(Statistics);
Object.freeze(Statistics.prototype);
Object.freeze(Object.getPrototypeOf(Statistics));

export class NumericStatistics<E> extends Statistics<E, number> {

    protected readonly NumericStatistics: symbol = NumericStatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "NumericStatistics": {
                value: NumericStatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false
            }
        });
        Object.freeze(this);
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

    public average(): number;
    public average(mapper: Functional<E, number>): number;
    public average(mapper?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (isFunction(mapper)) {
                return useNumericAverage(mapper).collect(this.source());
            }
            return useNumericAverage().collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }

    public range(): number;
    public range(mapper: Functional<E, number>): number;
    public range(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (this.count() === 1n) {
                return 0;
            }
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let count: number = this.buffer.length;
            let minimum: E = this.buffer[0].element;
            let maximum: E = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        } catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }

    public variance(): number;
    public variance(mapper: Functional<E, number>): number;
    public variance(argument1?: Functional<E, number>): number {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericVariance(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }

    public standardDeviation(): number;
    public standardDeviation(mapper: Functional<E, number>): number;
    public standardDeviation(argument1?: Functional<E, number>): number {
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericStandardDeviation(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }

    public mean(): number;
    public mean(mapper: Functional<E, number>): number;
    public mean(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }

    public median(): number;
    public median(mapper: Functional<E, number>): number;
    public median(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMedian(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }

    public mode(): number;
    public mode(mapper: Functional<E, number>): number;
    public mode(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMode(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }

    public summate(): number;
    public summate(mapper: Functional<E, number>): number;
    public summate(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericSummate(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }

    public quantile(quantile: number): number;
    public quantile(quantile: number, mapper: Functional<E, number>): number;
    public quantile(quantile: number, argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        } catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }

    public interquartileRange(): number;
    public interquartileRange(mapper: Functional<E, number>): number;
    public interquartileRange(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        } catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }

    public skewness(): number;
    public skewness(mapper: Functional<E, number>): number;
    public skewness(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        } catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }

    public kurtosis(): number;
    public kurtosis(mapper: Functional<E, number>): number;
    public kurtosis(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper: Functional<E, number> = isFunction(argument1) ? argument1 : useToNumber;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        } catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
};
Object.freeze(NumericStatistics);
Object.freeze(NumericStatistics.prototype);
Object.freeze(Object.getPrototypeOf(NumericStatistics));

export class BigIntStatistics<E> extends Statistics<E, bigint> {

    protected readonly BigIntStatistics: symbol = BigIntStatisticsSymbol;

    public constructor(generator: Generator<E>);
    public constructor(generator: Generator<E>, comparator: Comparator<E>);
    public constructor(parameter: Generator<E>, comparator?: Comparator<E>) {
        super(parameter, comparator || useCompare);
        Object.defineProperties(this, {
            "BigIntStatistics": {
                value: BigIntStatisticsSymbol,
                enumerable: false,
                writable: false,
                configurable: false 
            }
        });
        Object.freeze(this);
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

    public average(): bigint;
    public average(mapper: Functional<E, bigint>): bigint;
    public average(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }

    public range(): bigint;
    public range(mapper: Functional<E, bigint>): bigint;
    public range(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let count: number = this.buffer.length;
            let minimum: E = this.buffer[0].element;
            let maximum: E = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        } catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }

    public variance(): bigint;
    public variance(mapper: Functional<E, bigint>): bigint;
    public variance(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntVariance(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }

    public standardDeviation(): bigint;
    public standardDeviation(mapper: Functional<E, bigint>): bigint;
    public standardDeviation(argument1?: Functional<E, bigint>): bigint {
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        } catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }

    public mean(): bigint;
    public mean(mapper: Functional<E, bigint>): bigint;
    public mean(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }

    public median(): bigint;
    public median(mapper: Functional<E, bigint>): bigint;
    public median(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMedian(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }

    public mode(): bigint;
    public mode(mapper: Functional<E, bigint>): bigint;
    public mode(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMode(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }

    public summate(): bigint;
    public summate(mapper: Functional<E, bigint>): bigint;
    public summate(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntSummate(mapper).collect(this.source());
        } catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }

    public quantile(quantile: number): bigint;
    public quantile(quantile: number, mapper: Functional<E, bigint>): bigint;
    public quantile(quantile: number, argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = mapper(this.buffer[index].element);
            return value;
        } catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }

    public interquartileRange(): bigint;
    public interquartileRange(mapper: Functional<E, bigint>): bigint;
    public interquartileRange(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let lower: bigint = this.quantile(0.25, mapper);
            let upper: bigint = this.quantile(0.75, mapper);
            return upper - lower;
        } catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }

    public skewness(): bigint;
    public skewness(mapper: Functional<E, bigint>): bigint;
    public skewness(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let mean: bigint = this.mean(mapper);
            let standardDeviation: bigint = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        } catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }

    public kurtosis(): bigint;
    public kurtosis(mapper: Functional<E, bigint>): bigint;
    public kurtosis(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper: Functional<E, bigint> = isFunction(argument1) ? argument1 : useToBigInt;
            let mean: bigint = this.mean(mapper);
            let standardDeviation: bigint = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            let count: number = data.length;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        } catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
};
Object.freeze(BigIntStatistics);
Object.freeze(BigIntStatistics.prototype);
Object.freeze(Object.getPrototypeOf(BigIntStatistics));
