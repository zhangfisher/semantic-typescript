import { OrderedCollectable } from "./collectable";
import { isFunction, isIterable } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { StatisticsSymbol, NumericStatisticsSymbol, BigIntStatisticsSymbol } from "./symbol";
import type { Comparator, Functional, Generator } from "./utility";
import { invalidate } from "./utility";

export abstract class Statistics<E, D extends number | bigint> extends OrderedCollectable<E> {

    protected readonly Statistics: symbol = StatisticsSymbol;

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

    public count(): bigint {
        return BigInt(this.ordered.length);
    }

    public maximum(): Optional<E>;
    public maximum(comparator: Comparator<E>): Optional<E>;
    public maximum(argument1?: Comparator<E>): Optional<E> {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (useCompare(current, element) > 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            } else {
                return Optional.ofNullable<E>();
            }
        } else {
            let comparator: Comparator<E> = argument1;
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (comparator(current, element) > 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            }
        }
        return Optional.ofNullable<E>();
    }

    public minimum(): Optional<E>;
    public minimum(comparator: Comparator<E>): Optional<E>;
    public minimum(argument1?: Comparator<E>): Optional<E> {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (useCompare(current, element) < 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            } else {
                return Optional.ofNullable<E>();
            }
        } else {
            let comparator: Comparator<E> = argument1;
            if (!this.isEmpty()) {
                return this.collect<Optional<E>, Optional<E>>((): Optional<E> => {
                    return Optional.ofNullable<E>();
                }, (result: Optional<E>, element: E): Optional<E> => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    } else {
                        let current: E = result.get();
                        if (comparator(current, element) < 0) {
                            return Optional.of(element);
                        } else {
                            return result;
                        }
                    }
                }, (result: Optional<E>): Optional<E> => result);
            }
            return Optional.ofNullable<E>();
        }
    }

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

    public abstract frequency(): Map<D, bigint>;
    public abstract frequency(mapper: Functional<E, D>): Map<D, bigint>;

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

export class NumericStatistics<E> extends Statistics<E, number> {

    protected readonly NumericStatistics: symbol = NumericStatisticsSymbol;

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

    public range(): number;
    public range(mapper: Functional<E, number>): number;
    public range(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let minimum: E = this.ordered[0].value;
            let maximum: E = this.ordered[0].value;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].value;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return useCompare(maximum, minimum);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let minimum: number = mapper(this.ordered[0].value);
            let maximum: number = mapper(this.ordered[0].value);
            for (let i = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                if (current < minimum) {
                    minimum = current;
                }
                if (current > maximum) {
                    maximum = current;
                }
            }
            return maximum - minimum;
        }
        throw new TypeError("Invalid arguments.");
    }

    public variance(): number;
    public variance(mapper: Functional<E, number>): number;
    public variance(argument1?: Functional<E, number>): number {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let summate: number = this.summate();
            return (summate / Number(this.count())) - (mean * mean);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / Number(this.count())) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }

    public standardDeviation(): number;
    public standardDeviation(mapper: Functional<E, number>): number;
    public standardDeviation(argument1?: Functional<E, number>): number {
        if (invalidate(argument1)) {
            return Math.sqrt(this.variance());
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let variance = this.variance(mapper);
            return Math.sqrt(variance);
        }
        throw new TypeError("Invalid arguments.");
    }

    public mean(): number;
    public mean(mapper: Functional<E, number>): number;
    public mean(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate: number = this.summate();
            return summate / Number(this.count());
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let summate = this.summate(mapper);
            return summate / Number(this.count());
        }
        throw new TypeError("Invalid arguments.");
    }

    public median(): number;
    public median(mapper: Functional<E, number>): number;
    public median(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let middle: number = Math.floor(count / 2);
            let median: number = Number(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + Number(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median: number = mapper(this.ordered[middle].value);
            if (count % 2 === 0) {
                median = (median + mapper(this.ordered[middle - 1].value)) / 2;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }

    public mode(): number;
    public mode(mapper: Functional<E, number>): number;
    public mode(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let frequency: Map<number, bigint> = this.frequency();
            let mode: number = 0;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let frequency = this.frequency(mapper);
            let mode: number = 0;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        throw new TypeError("Invalid arguments.");
    }

    public frequency(): Map<number, bigint>;
    public frequency(mapper: Functional<E, number>): Map<number, bigint>;
    public frequency(argument1?: Functional<E, number>): Map<number, bigint> {
        if (this.isEmpty()) {
            return new Map<number, bigint>();
        }
        if (invalidate(argument1)) {
            let frequency: Map<number, bigint> = new Map<number, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let frequency: Map<number, bigint> = new Map<number, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }

    public summate(): number;
    public summate(mapper: Functional<E, number>): number;
    public summate(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate: number = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].value);
                summate += current;
            }
            return summate;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let summate: number = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
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
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: number = Number(this.ordered[index].value);
            return value;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.ordered[index].value);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }

    public interquartileRange(): number;
    public interquartileRange(mapper: Functional<E, number>): number;
    public interquartileRange(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let lower: number = this.quantile(0.25);
            let upper: number = this.quantile(0.75);
            return upper - lower;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }

    public skewness(): number;
    public skewness(mapper: Functional<E, number>): number;
    public skewness(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let standardDeviation: number = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data: Array<E> = this.toArray();
            let summate: number = 0;
            for (let value of data) {
                let z = (value as unknown as number - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
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
        }
        throw new TypeError("Invalid arguments.");
    }

    public kurtosis(): number;
    public kurtosis(mapper: Functional<E, number>): number;
    public kurtosis(argument1?: Functional<E, number>): number {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean: number = this.mean();
            let standardDeviation: number = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data: Array<E> = this.toArray();
            let summate: number = 0;
            for (let value of data) {
                let z = (value as unknown as number - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, number> = argument1;
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
        }
        throw new TypeError("Invalid arguments.");
    }
};

export class BigIntStatistics<E> extends Statistics<E, bigint> {

    protected readonly BigIntStatistics: symbol = BigIntStatisticsSymbol;

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

    public range(): bigint;
    public range(mapper: Functional<E, bigint>): bigint;
    public range(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let minimum: E = this.ordered[0].value;
            let maximum: E = this.ordered[0].value;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].value;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return BigInt(useCompare(maximum, minimum));
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let minimum: bigint = mapper(this.ordered[0].value);
            let maximum: bigint = mapper(this.ordered[0].value);
            for (let i: number = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                if (current < minimum) {
                    minimum = current;
                }
                if (current > maximum) {
                    maximum = current;
                }
            }
            return maximum - minimum;
        }
        throw new TypeError("Invalid arguments.");
    }

    public variance(): bigint;
    public variance(mapper: Functional<E, bigint>): bigint;
    public variance(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let summate: bigint = this.summate();
            return (summate / this.count()) - (mean * mean);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let mean: bigint = this.mean(mapper);
            let summate: bigint = this.summate(mapper);
            return (summate / this.count()) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }

    public standardDeviation(): bigint;
    public standardDeviation(mapper: Functional<E, bigint>): bigint;
    public standardDeviation(argument1?: Functional<E, bigint>): bigint {
        if (invalidate(argument1)) {
            return BigInt(Math.sqrt(Number(this.variance())));
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let variance: bigint = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        throw new TypeError("Invalid arguments.");
    }

    public mean(): bigint;
    public mean(mapper: Functional<E, bigint>): bigint;
    public mean(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate: bigint = this.summate();
            return summate / this.count();
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let summate: bigint = this.summate(mapper);
            return summate / this.count();
        }
        throw new TypeError("Invalid arguments.");
    }

    public median(): bigint;
    public median(mapper: Functional<E, bigint>): bigint;
    public median(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let count: number = Number(this.count());
            let middle: number = Math.floor(count / 2);
            let median: bigint = BigInt(Number(this.ordered[middle].value));
            if (count % 2 === 0) {
                median = (median + BigInt(Number(this.ordered[middle - 1].value))) / 2n;
                return median;
            }
            return median;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let count: bigint = this.count();
            let middle: bigint = count / 2n;
            let median: bigint = mapper(this.ordered[Number(middle)].value);
            if (count % 2n === 0n) {
                median = (median + mapper(this.ordered[Number(middle - 1n)].value)) / 2n;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }

    public mode(): bigint;
    public mode(mapper: Functional<E, bigint>): bigint;
    public mode(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let frequency: Map<bigint, bigint> = this.frequency();
            let mode: bigint = 0n;
            let maxFrequency: bigint = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let frequency = this.frequency(mapper);
            let mode: bigint = 0n;
            let maxFrequency: bigint = 0n;
            for (let [value, frequence] of frequency) {
                if (frequence > maxFrequency) {
                    mode = value;
                    maxFrequency = frequence;
                }
            }
            return mode;
        }
        throw new TypeError("Invalid arguments.");
    }

    public frequency(): Map<bigint, bigint>;
    public frequency(mapper: Functional<E, bigint>): Map<bigint, bigint>;
    public frequency(argument1?: Functional<E, bigint>): Map<bigint, bigint> {
        if (this.isEmpty()) {
            return new Map<bigint, bigint>();
        }
        if (invalidate(argument1)) {
            let frequency: Map<bigint, bigint> = new Map<bigint, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let frequency: Map<bigint, bigint> = new Map<bigint, bigint>();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                let count: bigint = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }

    public summate(): bigint;
    public summate(mapper: Functional<E, bigint>): bigint;
    public summate(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate: bigint = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].value));
                summate += current;
            }
            return summate;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let summate: bigint = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].value);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }

    public quantile(quantile: number): bigint;
    public quantile(quantile: number, mapper: Functional<E, bigint>): bigint;
    public quantile(quantile: unknown, mapper?: unknown): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(mapper)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = BigInt(Number(this.ordered[index].value));
            return value;
        } else if (isFunction(mapper)) {
            let count: number = Number(this.count());
            let index: number = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value: bigint = mapper(this.ordered[index].value);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }

    public interquartileRange(): bigint;
    public interquartileRange(mapper: Functional<E, bigint>): bigint;
    public interquartileRange(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let lower: bigint = this.quantile(0.25);
            let upper: bigint = this.quantile(0.75);
            return upper - lower;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
            let lower: bigint = this.quantile(0.25, mapper);
            let upper: bigint = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }

    public skewness(): bigint;
    public skewness(mapper: Functional<E, bigint>): bigint;
    public skewness(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let standardDeviation: bigint = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data: Array<E> = this.toArray();
            let summate: bigint = 0n;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
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
        }
        throw new TypeError("Invalid arguments.");
    }

    public kurtosis(): bigint;
    public kurtosis(mapper: Functional<E, bigint>): bigint;
    public kurtosis(argument1?: Functional<E, bigint>): bigint {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean: bigint = this.mean();
            let standardDeviation: bigint = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data: Array<E> = this.toArray();
            let summate: bigint = 0n;
            let count: number = data.length;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        } else if (isFunction(argument1)) {
            let mapper: Functional<E, bigint> = argument1;
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
        }
        throw new TypeError("Invalid arguments.");
    }
};
