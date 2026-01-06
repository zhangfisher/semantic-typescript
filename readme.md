# Semantic-TypeScript Stream Processing Library

## Introduction

Semantic-TypeScript is a modern stream processing library inspired by JavaScript GeneratorFunction, Java Stream, and MySQL Index. Its core design philosophy is based on building efficient data processing pipelines using data indexing, providing a type-safe, functional-style streaming operation experience for front-end development.

Unlike traditional synchronous processing, Semantic employs an asynchronous processing model. When creating a data stream, the time when the terminal receives data entirely depends on when the upstream calls the `accept` and `interrupt` callback functions. This design allows the library to elegantly handle real-time data streams, large datasets, and asynchronous data sources.

## Installation

```bash
npm install semantic-typescript
```

## Basic Types

| Type | Description |
|------|------|
| `Invalid<T>` | Type extending null or undefined |
| `Valid<T>` | Type excluding null and undefined |
| `MaybeInvalid<T>` | Type that may be null or undefined |
| `Primitive` | Collection of primitive types |
| `MaybePrimitive<T>` | Type that may be a primitive type |
| `OptionalSymbol` | Symbol identifier for the Optional class |
| `SemanticSymbol` | Symbol identifier for the Semantic class |
| `CollectorsSymbol` | Symbol identifier for the Collector class |
| `CollectableSymbol` | Symbol identifier for the Collectable class |
| `OrderedCollectableSymbol` | Symbol identifier for the OrderedCollectable class |
| `WindowCollectableSymbol` | Symbol identifier for the WindowCollectable class |
| `StatisticsSymbol` | Symbol identifier for the Statistics class |
| `NumericStatisticsSymbol` | Symbol identifier for the NumericStatistics class |
| `BigIntStatisticsSymbol` | Symbol identifier for the BigIntStatistics class |
| `UnorderedCollectableSymbol` | Symbol identifier for the UnorderedCollectable class |
| `Runnable` | Function with no parameters and no return value |
| `Supplier<R>` | Function with no parameters returning R |
| `Functional<T, R>` | Single-parameter transformation function |
| `Predicate<T>` | Single-parameter predicate function |
| `BiFunctional<T, U, R>` | Two-parameter transformation function |
| `BiPredicate<T, U>` | Two-parameter predicate function |
| `Comparator<T>` | Comparison function |
| `TriFunctional<T, U, V, R>` | Three-parameter transformation function |
| `Consumer<T>` | Single-parameter consumer function |
| `BiConsumer<T, U>` | Two-parameter consumer function |
| `TriConsumer<T, U, V>` | Three-parameter consumer function |
| `Generator<T>` | Generator function |

```typescript
// Type usage examples
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## Type Guards

| Function | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Validate value is not null or undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Validate value is null or undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Check if it is a boolean | O(1) | O(1) |
| `isString(t: unknown): t is string` | Check if it is a string | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Check if it is a number | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Check if it is a function | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Check if it is an object | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Check if it is a Symbol | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Check if it is a BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Check if it is a primitive type | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Check if it is an iterable object | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Check if it is an Optional instance | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Check if it is a Semantic instance | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Check if it is a Collector instance | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Check if it is a Collectable instance | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Check if it is an OrderedCollectable instance | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Check if it is a WindowCollectable instance | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Check if it is an UnorderedCollectable instance | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Check if it is a Statistics instance | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Check if it is a NumericStatistics instance | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Check if it is a BigIntStatistics instance | O(1) | O(1) |

```typescript
// Type guard usage examples
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Type-safe, value inferred as string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## Utility Functions

| Function | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Generic comparison function | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Pseudo-random number generator | O(log n) | O(1) |

```typescript
// Utility function usage examples
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // Seed-based random number
const randomBigInt = useRandom(1000n); // BigInt random number
```

## Factory Methods

### Optional Factory Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `Optional.empty<T>()` | Create an empty Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | Create an Optional containing a value | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Create a potentially empty Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Create a non-null Optional | O(1) | O(1) |

```typescript
// Optional usage examples
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // Outputs 42
console.log(emptyOpt.orElse(100)); // Outputs 100
```

### Collector Factory Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Create a full collector | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Create an interruptible collector | O(1) | O(1) |

```typescript
// Collector usage examples
const sumCollector = Collector.full(
    () => 0,
    (sum, num) => sum + num,
    result => result
);

const numbers = from([1, 2, 3, 4, 5]);
const total = numbers.toUnoredered().collect(sumCollector); // 15
```

### Semantic Factory Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `blob(blob, chunkSize)` | Create a stream from a Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Create an empty stream | O(1) | O(1) |
| `fill<E>(element, count)` | Create a filled stream | O(n) | O(1) |
| `from<E>(iterable)` | Create a stream from an iterable object | O(1) | O(1) |
| `interval(period, delay?)` | Create a timed interval stream | O(1)* | O(1) |
| `iterate<E>(generator)` | Create a stream from a generator | O(1) | O(1) |
| `range(start, end, step)` | Create a numerical range stream | O(n) | O(1) |
| `websocket(websocket)` | Create a stream from a WebSocket | O(1) | O(1) |

```typescript
// Semantic factory method usage examples

// Create a stream from a Blob (chunked reading)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Write stream successful
  .catch(writeFi); // Write stream failed

// Create an empty stream, won't execute until concatenated with other streams
empty<string>()
  .toUnordered()
  .join(); //[]

// Create a filled stream
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Create a timed stream with initial 2-second delay and 5-second execution period, implemented based on timer mechanism; may experience time drift due to system scheduling precision limitations.
const intervalStream = interval(5000, 2000);

// Create a stream from an iterable object
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Create a range stream
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket event stream
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message"); // Only listen to message events
  .toUnordered() // Generally not ordered for events
  .forEach((event)=> receive(event)); // Receive messages
```

## Semantic Class Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `concat(other)` | Concatenate two streams | O(n) | O(1) |
| `distinct()` | Remove duplicates | O(n) | O(n) |
| `distinct(comparator)` | Remove duplicates using a comparator | O(n²) | O(n) |
| `dropWhile(predicate)` | Discard elements satisfying condition | O(n) | O(1) |
| `filter(predicate)` | Filter elements | O(n) | O(1) |
| `flat(mapper)` | Flattening map | O(n × m) | O(1) |
| `flatMap(mapper)` | Flattening map to new type | O(n × m) | O(1) |
| `limit(n)` | Limit number of elements | O(n) | O(1) |
| `map(mapper)` | Map transformation | O(n) | O(1) |
| `peek(consumer)` | Peek at elements | O(n) | O(1) |
| `redirect(redirector)` | Redirect index | O(n) | O(1) |
| `reverse()` | Reverse stream | O(n) | O(1) |
| `shuffle()` | Randomly shuffle | O(n) | O(1) |
| `shuffle(mapper)` | Shuffle using a mapper | O(n) | O(1) |
| `skip(n)` | Skip first n elements | O(n) | O(1) |
| `sorted()` | Sort | O(n log n) | O(n) |
| `sorted(comparator)` | Sort using a comparator | O(n log n) | O(n) |
| `sub(start, end)` | Get substream | O(n) | O(1) |
| `takeWhile(predicate)` | Get elements satisfying condition | O(n) | O(1) |
| `translate(offset)` | Translate index | O(n) | O(1) |
| `translate(translator)` | Translate index using a translator | O(n) | O(1) |

```typescript
// Semantic operation examples
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // Filter even numbers
    .map(n => n * 2)                 // Multiply by 2
    .skip(1)                         // Skip the first
    .limit(3)                        // Limit to 3 elements
    .toArray();                      // Convert to array
// Result: [8, 12, 20]

// Complex operation example
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Map each element to two
    .distinct()                      // Remove duplicates
    .shuffle()                       // Shuffle order
    .takeWhile(n => n < 50)         // Take elements less than 50
    .toOrdered()                     // Convert to ordered collector
    .toArray();                      // Convert to array
```

## Collector Conversion Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `toUnoredered()` | Convert to unordered collector (performance first) | O(1) | O(1) |
| `toOrdered()` | Convert to ordered collector | O(1) | O(1) |
| `sorted()` | Sort and convert to ordered collector | O(n log n) | O(n) |
| `toWindow()` | Convert to window collector | O(1) | O(1) |
| `toNumericStatistics()` | Convert to numerical statistics | O(1) | O(1) |
| `toBigintStatistics()` | Convert to big integer statistics | O(1) | O(1) |

```typescript
// Collector conversion examples
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Performance first: use unordered collector
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// Need sorting: use ordered collector  
const ordered = numbers
    .sorted()
    .toOrdered();

// Statistical analysis: use statistical collector
const stats = numbers
    .toNumericStatistics();

console.log(stats.mean());        // Average value
console.log(stats.median());      // Median value
console.log(stats.standardDeviation()); // Standard deviation

// Window operations
const windowed = numbers
    .toWindow()
    .tumble(3n); // Every 3 elements form a window

windowed.forEach(window => {
    console.log(window.toArray()); // Contents of each window
});
```

## Collectable Collection Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `anyMatch(predicate)` | Whether any element matches | O(n) | O(1) |
| `allMatch(predicate)` | Whether all elements match | O(n) | O(1) |
| `count()` | Element count | O(n) | O(1) |
| `isEmpty()` | Whether it is empty | O(1) | O(1) |
| `findAny()` | Find any element | O(n) | O(1) |
| `findFirst()` | Find the first element | O(n) | O(1) |
| `findLast()` | Find the last element | O(n) | O(1) |
| `forEach(action)` | Iterate over all elements | O(n) | O(1) |
| `group(classifier)` | Group by classifier | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Group by key-value extractor | O(n) | O(n) |
| `join()` | Join as string | O(n) | O(n) |
| `join(delimiter)` | Join using a delimiter | O(n) | O(n) |
| `nonMatch(predicate)` | Whether no elements match | O(n) | O(1) |
| `partition(count)` | Partition by count | O(n) | O(n) |
| `partitionBy(classifier)` | Partition by classifier | O(n) | O(n) |
| `reduce(accumulator)` | Reduction operation | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reduction with initial value | O(n) | O(1) |
| `toArray()` | Convert to array | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convert to Map | O(n) | O(n) |
| `toSet()` | Convert to Set | O(n) | O(n) |
| `write(stream)` | Write to stream | O(n) | O(1) |

```typescript
// Collectable operation examples
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Match checks
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Find operations
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Any element

// Grouping operations
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Reduction operations
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Output operations
data.join(", "); // "2, 4, 6, 8, 10"
```

## Statistical Analysis Methods

### NumericStatistics Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `range()` | Range | O(n) | O(1) |
| `variance()` | Variance | O(n) | O(1) |
| `standardDeviation()` | Standard deviation | O(n) | O(1) |
| `mean()` | Mean | O(n) | O(1) |
| `median()` | Median | O(n log n) | O(n) |
| `mode()` | Mode | O(n) | O(n) |
| `frequency()` | Frequency distribution | O(n) | O(n) |
| `summate()` | Summation | O(n) | O(1) |
| `quantile(quantile)` | Quantile | O(n log n) | O(n) |
| `interquartileRange()` | Interquartile range | O(n log n) | O(n) |
| `skewness()` | Skewness | O(n) | O(1) |
| `kurtosis()` | Kurtosis | O(n) | O(1) |

```typescript
// Statistical analysis examples
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Mean:", numbers.mean()); // 5.5
console.log("Median:", numbers.median()); // 5.5
console.log("Standard deviation:", numbers.standardDeviation()); // ~2.87
console.log("Sum:", numbers.summate()); // 55

// Statistical analysis using mappers
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Mapped mean:", objects.mean(obj => obj.value)); // 20
```

## Performance Selection Guide

### Choose Unordered Collector (Performance First)
```typescript
// When order guarantee is not needed, use unordered collector for best performance
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Best performance
```

### Choose Ordered Collector (Order Required)
```typescript
// When element order needs to be maintained, use ordered collector
const ordered = data.sorted(comparator);
```

### Choose Window Collector (Window Operations)
```typescript  
// When window operations are needed
const windowed = data
    .toWindow()
    .slide(5n, 2n); // Sliding window
```

### Choose Statistical Analysis (Numerical Calculations)
```typescript  
// When statistical analysis is needed
const stats = data
    .toNumericStatistics(); // Numerical statistics

const bigIntStats = data
    .toBigintStatistics(); // Big integer statistics
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Important Notes

1. **Impact of Sorting Operations**: In ordered collectors, the `sorted()` operation overrides the effects of `redirect`, `translate`, `shuffle`, `reverse`
2. **Performance Considerations**: If order guarantee is not needed, prioritise using `toUnoredered()` for better performance
3. **Memory Usage**: Sorting operations require O(n) additional space
4. **Real-time Data**: Semantic streams are suitable for processing real-time data and support asynchronous data sources

This library provides TypeScript developers with powerful and flexible streaming capabilities, combining the benefits of functional programming with type safety guarantees.