import { OrderedCollectable } from "./collectable";
import { isFunction, isIterable } from "./guard";
import { useCompare } from "./hook";
import { Optional } from "./optional";
import { StatisticsSymbol, NumericStatisticsSymbol, BigIntStatisticsSymbol } from "./symbol";
import { invalidate } from "./utility";
export class Statistics extends OrderedCollectable {
    Statistics = StatisticsSymbol;
    constructor(parameter, comparator) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
        else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
    }
    count() {
        return BigInt(this.ordered.length);
    }
    maximum(argument1) {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (useCompare(current, element) > 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            else {
                return Optional.ofNullable();
            }
        }
        else {
            let comparator = argument1;
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (comparator(current, element) > 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
        }
        return Optional.ofNullable();
    }
    minimum(argument1) {
        if (invalidate(argument1)) {
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (useCompare(current, element) < 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            else {
                return Optional.ofNullable();
            }
        }
        else {
            let comparator = argument1;
            if (!this.isEmpty()) {
                return this.collect(() => {
                    return Optional.ofNullable();
                }, (result, element) => {
                    if (result.isEmpty()) {
                        return Optional.of(element);
                    }
                    else {
                        let current = result.get();
                        if (comparator(current, element) < 0) {
                            return Optional.of(element);
                        }
                        else {
                            return result;
                        }
                    }
                }, (result) => result);
            }
            return Optional.ofNullable();
        }
    }
}
;
export class NumericStatistics extends Statistics {
    NumericStatistics = NumericStatisticsSymbol;
    constructor(parameter, comparator) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
        else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let minimum = this.ordered[0].element;
            let maximum = this.ordered[0].element;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].element;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return useCompare(maximum, minimum);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let minimum = mapper(this.ordered[0].element);
            let maximum = mapper(this.ordered[0].element);
            for (let i = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
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
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let summate = this.summate();
            return (summate / Number(this.count())) - (mean * mean);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / Number(this.count())) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }
    standardDeviation(argument1) {
        if (invalidate(argument1)) {
            return Math.sqrt(this.variance());
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let variance = this.variance(mapper);
            return Math.sqrt(variance);
        }
        throw new TypeError("Invalid arguments.");
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate = this.summate();
            return summate / Number(this.count());
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = this.summate(mapper);
            return summate / Number(this.count());
        }
        throw new TypeError("Invalid arguments.");
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = Number(this.ordered[middle].element);
            if (count % 2 === 0) {
                median = (median + Number(this.ordered[middle - 1].element)) / 2;
            }
            return median;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = mapper(this.ordered[middle].element);
            if (count % 2 === 0) {
                median = (median + mapper(this.ordered[middle - 1].element)) / 2;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let frequency = this.frequency();
            let mode = 0;
            let maxFrequency = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = this.frequency(mapper);
            let mode = 0;
            let maxFrequency = 0n;
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
    frequency(argument1) {
        if (this.isEmpty()) {
            return new Map();
        }
        if (invalidate(argument1)) {
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].element);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let summate = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = Number(this.ordered[i].element);
                summate += current;
            }
            return summate;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = 0;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }
    quantile(quantile, argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = Number(this.ordered[index].element);
            return value;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.ordered[index].element);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let lower = this.quantile(0.25);
            let upper = this.quantile(0.75);
            return upper - lower;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray();
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 3);
            }
            return summate / data.length;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0) {
                return 0;
            }
            let data = this.toArray();
            let summate = 0;
            for (let value of data) {
                let z = (value - mean) / standardDeviation;
                summate += Math.pow(z, 4);
            }
            return summate / (data.length * data.length) - 3;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
}
;
export class BigIntStatistics extends Statistics {
    BigIntStatistics = BigIntStatisticsSymbol;
    constructor(parameter, comparator) {
        if (isIterable(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
        else if (isFunction(parameter)) {
            if (isFunction(comparator)) {
                super(parameter, comparator);
            }
            else {
                super(parameter);
            }
        }
    }
    range(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let minimum = this.ordered[0].element;
            let maximum = this.ordered[0].element;
            for (let i = 1; i < this.ordered.length; i++) {
                let current = this.ordered[i].element;
                if (useCompare(current, minimum) < 0) {
                    minimum = current;
                }
                if (useCompare(current, maximum) > 0) {
                    maximum = current;
                }
            }
            return BigInt(useCompare(maximum, minimum));
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let minimum = mapper(this.ordered[0].element);
            let maximum = mapper(this.ordered[0].element);
            for (let i = 1; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
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
    variance(argument1) {
        if (this.isEmpty() || this.count() === 1n) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let summate = this.summate();
            return (summate / this.count()) - (mean * mean);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let mean = this.mean(mapper);
            let summate = this.summate(mapper);
            return (summate / this.count()) - (mean * mean);
        }
        throw new TypeError("Invalid arguments.");
    }
    standardDeviation(argument1) {
        if (invalidate(argument1)) {
            return BigInt(Math.sqrt(Number(this.variance())));
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let variance = this.variance(mapper);
            return BigInt(Math.sqrt(Number(variance)));
        }
        throw new TypeError("Invalid arguments.");
    }
    mean(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate = this.summate();
            return summate / this.count();
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = this.summate(mapper);
            return summate / this.count();
        }
        throw new TypeError("Invalid arguments.");
    }
    median(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let count = Number(this.count());
            let middle = Math.floor(count / 2);
            let median = BigInt(Number(this.ordered[middle].element));
            if (count % 2 === 0) {
                median = (median + BigInt(Number(this.ordered[middle - 1].element))) / 2n;
                return median;
            }
            return median;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let count = this.count();
            let middle = count / 2n;
            let median = mapper(this.ordered[Number(middle)].element);
            if (count % 2n === 0n) {
                median = (median + mapper(this.ordered[Number(middle - 1n)].element)) / 2n;
            }
            return median;
        }
        throw new TypeError("Invalid arguments.");
    }
    mode(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let frequency = this.frequency();
            let mode = 0n;
            let maxFrequency = 0n;
            for (let [value, freq] of frequency) {
                if (freq > maxFrequency) {
                    mode = value;
                    maxFrequency = freq;
                }
            }
            return mode;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = this.frequency(mapper);
            let mode = 0n;
            let maxFrequency = 0n;
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
    frequency(argument1) {
        if (this.isEmpty()) {
            return new Map();
        }
        if (invalidate(argument1)) {
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].element));
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let frequency = new Map();
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
                let count = frequency.get(current) || 0n;
                frequency.set(current, count + 1n);
            }
            return frequency;
        }
        throw new TypeError("Invalid arguments.");
    }
    summate(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let summate = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = BigInt(Number(this.ordered[i].element));
                summate += current;
            }
            return summate;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let summate = 0n;
            for (let i = 0; i < this.ordered.length; i++) {
                let current = mapper(this.ordered[i].element);
                summate += current;
            }
            return summate;
        }
        throw new TypeError("Invalid arguments.");
    }
    quantile(quantile, mapper) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (typeof quantile !== "number" || quantile < 0 || quantile > 1) {
            throw new RangeError("Invalid quantile.");
        }
        if (invalidate(mapper)) {
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = BigInt(Number(this.ordered[index].element));
            return value;
        }
        else if (isFunction(mapper)) {
            let count = Number(this.count());
            let index = Math.floor(quantile * count);
            if (index === count) {
                index--;
            }
            let value = mapper(this.ordered[index].element);
            return value;
        }
        throw new TypeError("Invalid arguments.");
    }
    interquartileRange(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let lower = this.quantile(0.25);
            let upper = this.quantile(0.75);
            return upper - lower;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
            let lower = this.quantile(0.25, mapper);
            let upper = this.quantile(0.75, mapper);
            return upper - lower;
        }
        throw new TypeError("Invalid arguments.");
    }
    skewness(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray();
            let summate = 0n;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z;
            }
            return summate / BigInt(data.length);
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
        throw new TypeError("Invalid arguments.");
    }
    kurtosis(argument1) {
        if (this.isEmpty()) {
            return 0n;
        }
        if (invalidate(argument1)) {
            let mean = this.mean();
            let standardDeviation = this.standardDeviation();
            if (standardDeviation === 0n) {
                return 0n;
            }
            let data = this.toArray();
            let summate = 0n;
            let count = data.length;
            for (let value of data) {
                let z = BigInt(Number(value)) - mean;
                summate += z * z * z * z;
            }
            return summate / BigInt(count * count) - 3n;
        }
        else if (isFunction(argument1)) {
            let mapper = argument1;
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
        throw new TypeError("Invalid arguments.");
    }
}
;
