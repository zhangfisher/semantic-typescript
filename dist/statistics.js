import { OrderedCollectable } from "./collectable";
import { Collector, useBigIntAverage, useBigIntMedian, useBigIntMode, useBigIntSummate, useBigIntVariance, useFrequency, useNumericAverage, useNumericMedian, useNumericMode, useNumericStandardDeviation, useNumericSummate, useNumericVariance, useToAsyncGeneratorFunction, useToGeneratorFunction } from "./collector";
import { isFunction } from "./guard";
import { useCompare, useToBigInt, useToNumber } from "./hook";
import { StatisticsSymbol, NumericStatisticsSymbol, BigIntStatisticsSymbol } from "./symbol";
export class Statistics extends OrderedCollectable {
    Statistics = StatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    count() {
        return BigInt(this.buffer.length);
    }
    frequency() {
        return useFrequency().collect(this.source());
    }
}
;
Object.freeze(Statistics);
Object.freeze(Statistics.prototype);
Object.freeze(Object.getPrototypeOf(Statistics));
export class NumericStatistics extends Statistics {
    NumericStatistics = NumericStatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    average(mapper) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (isFunction(mapper)) {
                return useNumericAverage(mapper).collect(this.source());
            }
            return useNumericAverage().collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            if (this.count() === 1n) {
                return 0;
            }
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let count = this.buffer.length;
            let minimum = this.buffer[0].element;
            let maximum = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        }
        catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericVariance(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }
    standardDeviation(argument1) {
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericStandardDeviation(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMedian(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericMode(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            return useNumericSummate(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        }
        catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
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
        catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToNumber;
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
        catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
}
;
Object.freeze(NumericStatistics);
Object.freeze(NumericStatistics.prototype);
Object.freeze(Object.getPrototypeOf(NumericStatistics));
export class BigIntStatistics extends Statistics {
    BigIntStatistics = BigIntStatisticsSymbol;
    constructor(parameter, comparator) {
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
    *[Symbol.iterator]() {
        try {
            let collector = useToGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on Generator.");
        }
    }
    async *[Symbol.asyncIterator]() {
        try {
            let collector = useToAsyncGeneratorFunction();
            yield* collector.collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on AsyncGenerator.");
        }
    }
    average(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on average.");
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let count = this.buffer.length;
            let minimum = this.buffer[0].element;
            let maximum = this.buffer[count - 1].element;
            return mapper(maximum) - mapper(minimum);
        }
        catch (error) {
            throw new Error("Uncaught error on range.");
        }
    }
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntVariance(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on variance.");
        }
    }
    standardDeviation(argument1) {
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        catch (error) {
            throw new Error("Uncaught error on standardDeviation.");
        }
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntAverage(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mean.");
        }
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMedian(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on median.");
        }
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntMode(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on mode.");
        }
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            return useBigIntSummate(mapper).collect(this.source());
        }
        catch (error) {
            throw new Error("Uncaught error on summate.");
        }
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.buffer[index].element);
            return value;
        }
        catch (error) {
            throw new Error("Uncaught error on quantile.");
        }
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        catch (error) {
            throw new Error("Uncaught error on interquartileRange.");
        }
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
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
        catch (error) {
            throw new Error("Uncaught error on skewness.");
        }
    }
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        try {
            let mapper = isFunction(argument1) ? argument1 : useToBigInt;
            let mean = this.mean(mapper);
            let standardDeviation = this.standardDeviation(mapper);
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray().map(item => mapper(item));
            let summate = 0n;
            let count = data.length;
            for (let value of data) {
                let z = value - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        }
        catch (error) {
            throw new Error("Uncaught error on kurtosis.");
        }
    }
}
;
Object.freeze(BigIntStatistics);
Object.freeze(BigIntStatistics.prototype);
Object.freeze(Object.getPrototypeOf(BigIntStatistics));
