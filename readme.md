# Semantic-TypeScript Stream Processing Library

## Introduction

**Semantic-TypeScript: A Paradigm-Shifting Stream Processing Library for the Modern Web**

Semantic-TypeScript represents a significant advancement in stream processing technology, synthesising the most effective concepts from JavaScript GeneratorFunction, Java Stream, and MySQL Index paradigms. Its foundational design principle is centred on constructing exceptionally efficient data processing pipelines through sophisticated data indexing methodologies. The library delivers a rigorously type-safe, functionally pure streaming operation experience specifically engineered for contemporary front-end development.

In contrast to conventional synchronous processing architectures, Semantic-TypeScript implements a fully asynchronous processing model. During data stream generation, the temporal reception of data at the terminal is determined exclusively by the upstream invocation of the `accept` and `interrupt` callback mechanisms. This deliberate architectural choice enables the library to handle with exceptional grace:

- **Real-time data streams** with deterministic latency characteristics
- **Large-scale datasets** through memory-efficient processing pipelines
- **Asynchronous data sources** with guaranteed consistency and reliability

The library's innovative approach fundamentally reimagines how developers interact with streaming data, providing both unprecedented performance characteristics and developer ergonomics in a single, cohesive package.

### Why Choose Semantic-TypeScript?

Selecting the right library for data stream processing in a TypeScript project involves balancing performance, developer experience, and architectural fit. Semantic-TypeScript is engineered to excel across all these dimensions, offering a paradigm-shifting approach for the modern web. Here’s why it stands out.

#### 1. **A Unified, Type-Safe Paradigm for Streams**
Semantic-TypeScript synthesises the most effective concepts from **JavaScript GeneratorFunctions**, **Java Streams API**, and **database indexing strategies**. It provides a consistent, declarative API for processing any data sequence—be it static arrays, real-time events, or asynchronous chunks—while leveraging TypeScript's full power to ensure end-to-end type safety. This eliminates a whole class of runtime errors and transforms stream manipulation into a predictable, compiler-verified activity.

#### 2. **Uncompromising Performance with Intelligent Laziness**
At its core, the library is built on **lazy evaluation**. Operations like `filter`, `map`, and `flatMap` merely compose a processing pipeline; no work is done until a terminal operation (like `collect` or `toArray`) is invoked. This is coupled with **short-circuiting** capabilities (via operations like `limit`, `anyMatch`, or custom `interruptor` functions), which allows the processing to stop early when the result is known, dramatically improving efficiency for large or infinite streams.

#### 3. **Architectural Distinction: `Semantic<E>` vs. `Collectable<E>`**
This library introduces a crucial architectural separation that others often lack:
*   **`Semantic<E>`**: Represents the abstract, lazy stream definition—the "blueprint" of your data transformation. It is immutable and composable.
*   **`Collectable<E>`**: Represents a materialised, executable view of the stream, offering all terminal operations.

This separation enforces a clear mental model and allows for optimisations (e.g., an `UnorderedCollectable` can skip expensive sorting steps if order is not required).

#### 4. **The Power of the `Collector<E, A, R>` Pattern**
Inspired by Java, the `Collector` pattern is the engine of flexibility. It decouples the *specification* of how to accumulate stream elements from the *execution* of the stream itself. The library provides a rich set of built-in collectors (`useToArray`, `useGroupBy`, `useSummate`, etc.) for everyday tasks, while the pattern makes it trivial to implement your own complex, reusable reduction logic. This is far more powerful and composable than a fixed set of terminal methods.

#### 5. **First-Class Support for Modern Web & Async Data**
Semantic-TypeScript is designed for contemporary front-end and Node.js development. It offers native factory methods for modern web sources:
*   `from(iterable)`, `range()` for static data.
*   `interval()`, `animationFrame()` for time-based streams.
*   `blob()` for chunked binary data processing.
*   `websocket()` for real-time message streams.
Its foundational support for both `Iterable` and `AsyncIterable` protocols means it handles synchronous and asynchronous data flows with the same elegant API.

#### 6. **Beyond Basic Aggregation: Built-in Statistical Analysis**
Move beyond simple sums and averages. The library provides dedicated `NumericStatistics` and `BigIntStatistics` classes, offering immediate access to advanced statistical measures directly from your streams—**variance, standard deviation, median, quantiles, skewness, and kurtosis**. This turns complex data analysis into a one-liner, saving you from manual implementation or integrating another specialised library.

#### 7. **Designed for Developer Ergonomics**
*   **Fluent, Chainable API**: Write complex data pipelines as readable, sequential chains of operations.
*   **Comprehensive Utility Suite**: Comes with essential guards (`isOptional`, `isSemantic`), type-safe utilities (`useCompare`, `useTraverse`), and functional interfaces out of the box.
*   **`Optional<T>` Integration**: Models the absence of a value safely, eliminating null-pointer concerns in find operations.
*   **Performance Guidance**: The documentation clearly guides you on when to use `toUnordered()` (for maximum speed) versus `toOrdered()` (when sequence matters).

#### 8. **Robust, Community-Ready Foundation**
As an open-source library hosted on **GitHub** and distributed via **npm**, it is built for real-world use. The extensive documentation, complete with time/space complexity annotations and practical examples, lowers the learning curve and provides clarity for performance-sensitive applications.

**In summary, choose Semantic-TypeScript if you seek a rigorously designed, type-safe, and high-performance stream processing library that brings the power of enterprise-level data transformation patterns to the TypeScript ecosystem, without compromising on the idioms and needs of modern web development.**

## Installation

```bash
npm install semantic-typescript
```

## Basic Types

| Type | Description |
|------|-------------|
| `Invalid<T>` | Type that extends `null` or `undefined` |
| `Valid<T>` | Type that excludes `null` and `undefined` |
| `MaybeInvalid<T>` | Type that may be `null` or `undefined` |
| `Primitive` | Collection of primitive types |
| `MaybePrimitive<T>` | Type that may be a primitive type |
| `OptionalSymbol` | Symbol identifier of the `Optional` class |
| `SemanticSymbol` | Symbol identifier of the `Semantic` class |
| `CollectorsSymbol` | Symbol identifier of the `Collector` class |
| `CollectableSymbol` | Symbol identifier of the `Collectable` class |
| `OrderedCollectableSymbol` | Symbol identifier of the `OrderedCollectable` class |
| `WindowCollectableSymbol` | Symbol identifier of the `WindowCollectable` class |
| `StatisticsSymbol` | Symbol identifier of the `Statistics` class |
| `NumericStatisticsSymbol` | Symbol identifier of the `NumericStatistics` class |
| `BigIntStatisticsSymbol` | Symbol identifier of the `BigIntStatistics` class |
| `UnorderedCollectableSymbol` | Symbol identifier of the `UnorderedCollectable` class |

## Functional Interfaces

| Interface | Description |
|-----------|-------------|
| `Runnable` | Function with no parameters and no return value |  
| `Supplier<R>` | Function with no parameters returning `R` |  
| `Functional<T, R>` | Single-parameter transformation function |
| `BiFunctional<T, U, R>` | Two-parameter transformation function |
| `TriFunctional<T, U, V, R>` | Three-parameter transformation function |
| `Predicate<T>` | Single-parameter predicate function |
| `BiPredicate<T, U>` | Two-parameter predicate function |
| `TriPredicate<T, U, V>` | Three-parameter predicate function |
| `Consumer<T>` | Single-parameter consumer function |
| `BiConsumer<T, U>` | Two-parameter consumer function |
| `TriConsumer<T, U, V>` | Three-parameter consumer function |
| `Comparator<T>` | Two-parameter comparison function |
| `Generator<T>` | Generator function (core and foundation) |

```typescript
// Type usage examples
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
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
| `isPromise(t: unknown): t is Promise<unknown>` | Check if it is a Promise object  | O(1) | O(1) |
| `isAsyncFunction(t: unknown): t is AsyncFunction` | Check if it is an AsyncFunction | O(1) | O(1) |
| `isGeneratorFunction(t: unknown): t is GeneratorFunction` | Check if it is a GeneratorFunction | O(1) | O(1) |
| `isAsyncGeneratorFunction(t: unknown): t is AsyncGeneratorFunction` | Check if it is an AsyncGeneratorFunction | O(1) | O(1) |

```typescript
// Type guard usage examples
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Type-safe, value inferred as string
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(value));
}

if(isIterable(value)){
    // Type-safe, now it's an iterable object.
    for(let item of value){
        console.log(item);
    }
}
```

## Utility Functions

| Function | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Generic comparison function | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Pseudo-random number generator | O(log n) | O(1) |
| `useTraverse(t, callback)` | Deep traverse an object without cyclic references | O(n) | O(1) |
| `useToNumber(t: unknown): number` | Convert a value to a number | O(1) | O(1) |
| `useToBigInt(t: unknown): bigint` | Convert a value to a BigInt | O(1) | O(1) |

```typescript
// Utility function usage examples
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum: number = useRandom(42); // Seed-based random number

let o = {
    a: 1,
    b: {
        c: 2,
        d: o
    },
    c: [1, 3, 5, o],
    e: undefined,
    f: null
};
useTraverse(o, (value, key): boolean => {
    console.log(key, value); 
    /*
    a 1
    c 2
    1 3 5
    Cyclic references, undefined and null values are not traversed.
    */
    return true; // Returns true to continue traversing.
});

let toBeResolved: object = {
    [Symbol.toPrimitive]: () => 5
};
let resolvedNumber: number = useToNumber(toBeResolved); // 5
let resolvedBigInt: bigint = useToBigInt(toBeResolved); // 5n
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
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((value: number): void => console.log(value)); // Outputs 42
console.log(empty.get(100)); // Outputs 100
```

### Collector Factory Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Create a full collector | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Create an interruptible collector | O(1) | O(1) |
| `useAnyMatch<E>(predicate)` | Create a shortable collector returning true if any element matches the predicate | O(n) | O(1) |
| `useAllMatch<E>(predicate)` | Create a shortable collector returning true if all elements match the predicate | O(n) | O(1) |
| `useCollect<E, A, R>(identity, accumulator, finisher)` | Create a full collector with identity, accumulator, finisher | O(1) | O(1) |
| `useCollect<E, A, R>(identity, interruptor, accumulator, finisher)` | Create a shortable collector with identity, interruptor, accumulator, finisher | O(1) | O(1) |
| `useCount<E>()` | Create a full collector counting elements | O(n) | O(1) |
| `useError<E>()` | Create a collector printing an error | O(n) | O(1) |
| `useError<E>(accumulator)` | Create a collector printing an accumulated error | O(n) | O(1) |
| `useError<E>(prefix, accumulator, suffix)` | Create a collector printing an accumulated error with prefix and suffix | O(n) | O(1) |
| `useFindFirst<E>()` | Create a shortable collector returning the first element | O(n) | O(1) |
| `useFindAny<E>()` | Create a shortable collector returning any element | O(n) | O(1) |
| `useFindLast<E>()` | Create a full collector returning the last element | O(n) | O(1) |
| `useFindMaximum<E>()` | Create a full collector returning the maximum element | O(n) | O(1) |
| `useFindMaximum<E>(comparator?)` | Create a full collector returning the maximum element | O(n) | O(1) |
| `useFindMinimum<E>()` | Create a full collector returning the minimum element | O(n) | O(1) |
| `useFindMinimum<E>(comparator?)` | Create a full collector returning the minimum element | O(n) | O(1) |
| `useForEach<E>(action)` | Create a full collector executing an action for each element | O(n) | O(1) |
| `useNoneMatch<E>(predicate)` | Create a shortable collector returning true if no element matches the predicate | O(n) | O(1) |
| `useGroup<E, K>(classifier)` | Create a full collector grouping elements by classifier key | O(n) | O(n) |
| `useGroupBy<E, K, V>(keyExtractor, valueExtractor)` | Create a full collector grouping elements by key with extracted values | O(n) | O(n) |
| `useJoin<E>()` | Create a full collector joining elements into a string with default format | O(n) | O(1) |
| `useJoin<E>(delimiter)` | Create a full collector joining elements with delimiter | O(n) | O(1) |
| `useJoin<E>(prefix, delimiter, suffix)` | Create a full collector joining elements with prefix, delimiter, suffix | O(n) | O(1) |
| `useJoin<E>(prefix, accumulator, suffix)` | Create a full collector joining elements via custom accumulator | O(n) | O(1) |
| `useLog<E>()` | Create a full collector logging elements to console with default format | O(n) | O(1) |
| `useLog<E>(accumulator)` | Create a full collector logging elements via custom accumulator | O(n) | O(1) |
| `useLog<E>(prefix, accumulator, suffix)` | Create a full collector logging elements with prefix/suffix via accumulator | O(n) | O(1) |
| `usePartition<E>(count)` | Create a full collector partitioning elements into chunks of specified size | O(n) | O(n) |
| `usePartitionBy<E>(classifier)` | Create a full collector partitioning elements by classifier result | O(n) | O(n) |
| `useReduce<E>(accumulator)` | Create a full collector reducing elements without identity | O(n) | O(1) |
| `useReduce<E>(identity, accumulator)` | Create a full collector reducing elements with identity | O(n) | O(1) |
| `useReduce<E, R>(identity, accumulator, finisher)` | Create a full collector reducing elements with identity, accumulator, finisher | O(n) | O(1) |
| `useToArray<E>()` | Create a full collector gathering elements into an array | O(n) | O(n) |
| `useToMap<E, K, V>(keyExtractor, valueExtractor)` | Create a full collector gathering elements into a Map | O(n) | O(n) |
| `useToSet<E>()` | Create a full collector gathering elements into a Set | O(n) | O(n) |
| `useWrite<E, S>(stream)` | Create a full collector writing elements to a stream | O(n) | O(1) |
| `useWrite<E, S>(stream, accumulator)` | Create a full collector writing elements via custom accumulator | O(n) | O(1) |
| `useNumericAverage<E>(mapper)` | Create a full collector computing numeric average with mapper | O(n) | O(1) |
| `useNumericAverage<E>()` | Create a full collector computing numeric average | O(n) | O(1) |
| `useBigIntAverage<E>(mapper)` | Create a full collector computing bigint average with mapper | O(n) | O(1) |
| `useBigIntAverage<E>()` | Create a full collector computing bigint average | O(n) | O(1) |
| `useFrequency<E>()` | Create a full collector counting element frequencies | O(n) | O(n) |
| `useNumericSummate<E>()` | Create a full collector summing numeric elements | O(n) | O(1) |
| `useNumericSummate<E>(mapper)` | Create a full collector summing mapped numeric values | O(n) | O(1) |
| `useBigIntSummate<E>()` | Create a full collector summing numeric elements | O(n) | O(1) |
| `useBigIntSummate<E>(mapper)` | Create a full collector summing mapped numeric values | O(n) | O(1) |
| `useNumericAverage<E>()` | Create a full collector computing numeric average | O(n) | O(1) |
| `useNumericAverage<E>(mapper)` | Create a full collector computing numeric average with mapper | O(n) | O(1) |
| `useBigIntAverage<E>()` | Create a full collector computing bigint average | O(n) | O(1) |
| `useBigIntAverage<E>(mapper)` | Create a full collector computing bigint average with mapper | O(n) | O(1) |
| `useFrequency<E>()` | Create a full collector counting element frequencies | O(n) | O(n) |
| `useNumericMode<E>()` | Create a full collector computing numeric mode | O(n) | O(n) |
| `useNumericMode<E>(mapper)` | Create a full collector computing numeric mode with mapper | O(n) | O(n) |
| `useBigIntMode<E>()` | Create a full collector computing bigint mode | O(n) | O(n) |
| `useBigIntMode<E>(mapper)` | Create a full collector computing bigint mode with mapper | O(n) | O(n) |
| `useNumericVariance<E>()` | Create a full collector computing numeric variance | O(n) | O(1) |
| `useNumericVariance<E>(mapper)` | Create a full collector computing numeric variance with mapper | O(n) | O(1) |
| `useBigIntVariance<E>()` | Create a full collector computing bigint variance | O(n) | O(1) |
| `useBigIntVariance<E>(mapper)` | Create a full collector computing bigint variance with mapper | O(n) | O(1) |
| `useNumericStandardDeviation<E>()` | Create a full collector computing numeric standard deviation | O(n) | O(1) |
| `useNumericStandardDeviation<E>(mapper)` | Create a full collector computing numeric standard deviation with mapper | O(n) | O(1) |
| `useBigIntStandardDeviation<E>()` | Create a full collector computing bigint standard deviation | O(n) | O(1) |
| `useBigIntStandardDeviation<E>(mapper)` | Create a full collector computing bigint standard deviation with mapper | O(n) | O(1) |
| `useNumericMedian<E>()` | Create a full collector computing numeric median | O(n) | O(1) |
| `useNumericMedian<E>(mapper)` | Create a full collector computing numeric median with mapper | O(n) | O(1) |
| `useBigIntMedian<E>()` | Create a full collector computing bigint median | O(n) | O(1) |
| `useBigIntMedian<E>(mapper)` | Create a full collector computing bigint median with mapper | O(n) | O(1) |
| `useToGeneratorFunction<E>()` | Create a full collector converting a stream to a generator function | O(n) | O(1) |
| `useToAsyncGeneratorFunction<E>()` | Create a full collector converting a stream to an async generator function | O(n) | O(1) |

```typescript
// Collector conversion examples
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Performance first: use unordered collector
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnoredered();

// Sorting needed: use ordered collector  
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// Counts the number of elements
let count: Collector<number, number, number> = useCount();
count.collect(from([1,2,3,4,5])); // Counts from a stream
count.collect([1,2,3,4,5]); // Counts from an iterable object

// Finds the first element
let findFirst: Collector<number, number, number> = useFindFirst();
find.collect(from([1,2,3,4,5])); // Finds the first element
find.collect([1,2,3,4,5]); // Finds the first element

// Calculates the sum of elements
let summate: Collector<number, number, number> = useSummate();
summate.collect(from([1,2,3,4,5])); // Sums from a stream
summate.collect([1,2,3,4,5]); // Sums from an iterable object

// Calculates the average of elements
let average: Collector<number, number, number> = useNumericAverage();
average.collect(from([1,2,3,4,5])); // Averages from a stream
average.collect([1,2,3,4,5]); // Averages from an iterable object
```

## Collector Class Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `collect(stream)` | Collect elements from a stream | O(n) | O(1) |
| `collect(iterable)` | Collect elements from an iterable object | O(n) | O(1) |
| `collect(generator)` | Collect elements from a generator | O(n) | O(1) |
| `collect(semantic)` | Collect elements from a semantic stream | O(n) | O(1) |
| `collect(collectable)` | Collect elements from a collectable stream | O(n) | O(1) |
| `collect(start, endExelusive)` | Collect elements from a range | O(n) | O(1) |

### Semantic Factory Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | Create a timed animation frame stream | O(1)* | O(1) |
| `attribute(target)` | Create a stream from an object deep attributes | O(n) | O(1) |
| `blob(blob, chunkSize)` | Create a stream from a Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Create an empty stream | O(1) | O(1) |
| `fill<E>(element, count)` | Create a filled stream | O(n) | O(1) |
| `from<E>(iterable)` | Create a stream from an iterable object | O(1) | O(1) |
| `interval(period, delay?)` | Create a timed interval stream | O(1)* | O(1) |
| `iterate<E>(generator)` | Create a stream from a generator | O(1) | O(1) |
| `promise<E>(promise)` | Create a stream from a promise | O(1) | O(1) |
| `range(start, end, step)` | Create a numerical range stream | O(n) | O(1) |
| `websocket(websocket)` | Create a stream from a WebSocket | O(1) | O(1) |

```typescript
// Semantic factory method usage examples

// Create a stream from a timed animation frame
animationFrame(1000)
    .toUnordered()
    .forEach((frame): void => console.log(frame));

// Create a stream from a Blob (chunked reading)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // Write stream successful
    .catch(callback); // Write stream failed

// Create an empty stream, won't execute until concatenated with other streams
empty<string>()
    .toUnordered()
    .join(); //[]

// Create a filled stream
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Create a timed stream with initial 2-second delay and 5-second execution period, implemented based on timer mechanism; may experience time drift due to system scheduling precision limitations.
let intervalStream = interval(5000, 2000);

// Create a stream from an iterable object
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// Create a stream from a resolved Promise
let promisedStream: Semantic<Array<number>> = promise(Promise.resolve([1, 2, 3, 4, 5]));

// Create a range stream
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket event stream
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message"); // Only listen to message events
  .toUnordered() // Generally not ordered for events
  .forEach((event): void => receive(event)); // Receive messages
```

## Semantic Class Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `concat(semantic)` | Concatenate two streams | O(n) | O(1) |
| `concat(iterable)` | Concatenate from an iterable object | O(n) | O(1) |
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
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)        // Filter even numbers
    .map((n: number): number => n * 2)                 // Multiply by 2
    .skip(1)                         // Skip the first
    .limit(3)                        // Limit to 3 elements
    .toUnordered()                   // Convert to unordered collector
    .toArray();                      // Convert to array
// Result: [8, 12, 20]

// Complex operation example
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // Map each element to two
    .distinct()                      // Remove duplicates
    .shuffle()                       // Shuffle order
    .takeWhile((n: number): boolean => n < 50)         // Take elements less than 50
    .toOrdered()                     // Convert to ordered collector
    .toArray();                      // Convert to array
```

## Semantic Conversion Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `sorted()` | Convert to ordered collector | O(n log n) | O(n) |
| `sorted(comparator)` | Convert to ordered collector with comparator | O(n log n) | O(n) |
| `toUnordered()` | Convert to unordered collector | O(1) | O(1) |
| `toOrdered()` | Convert to ordered collector | O(1) | O(1) |
| `toNumericStatistics()` | Convert to numeric statistics | O(n) | O(1) |
| `toBigintStatistics()` | Convert to bigint statistics | O(n) | O(1) |
| `toWindow()` | Convert to window collector | O(1) | O(1) |
| `toCollectable()` | Convert to `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Convert to customized collectable | O(n) | O(1) |

```typescript
// Convert to an ascending sorted array
from([6,4,3,5,2]) // Creates a stream
    .sorted() // Sorts the stream in ascending order
    .toArray(); // [2, 3, 4, 5, 6]

// Convert to a descending sorted array
from([6,4,3,5,2]) // Creates a stream
    .soted((a: number, b: number): number => b - a) // Sorts the stream in descending order
    .toArray(); // [6, 5, 4, 3, 2]

// Redirect to a reversed array
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // Redirects to reversed order
    .toOrderd() // Keeps the redirected order
    .toArray(); // [2, 5, 3, 4, 6]

// Ignore redirections to reverse array
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // Redirects to reversed order
    .toUnorderd() // Drops the redirected order. This operation will ignore `redirect`, `reverse`, `shuffle` and `translate` operations
    .toArray(); // [2, 5, 3, 4, 6]

// Reverse the stream into an array
from([6, 4, 3, 5, 2])
    .reverse() // Reverses the stream
    .toOrdered() // Guarantees the reversed order
    .toArray(); // [2, 5, 3, 4, 6]

// Overwrite the shuffled stream into an array
from([6, 4, 3, 5, 2])
    .shuffle() // Shuffles the stream
    .sorted() // Overwrites the shuffled order. This operation will overwrite `redirect`, `reverse`, `shuffle` and `translate` operations
    .toArray(); // [2, 5, 3, 4, 6]

// Convert to window collector
from([6, 4, 3, 5, 2]).toWindow();

// Convert to numeric statistics
from([6, 4, 3, 5, 2]).toNumericStatistics();

// Convert to bigint statistics
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// Defines a customized collector to collect data
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable Collection Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `anyMatch(predicate)` | Whether any element matches the predicate | O(n) | O(1) |
| `allMatch(predicate)` | Whether all elements match the predicate | O(n) | O(1) |
| `collect(collector)` | Collect elements using the given collector | O(n) | O(1) |
| `collect(identity, accumulator, finisher)` | Collect elements with identity, accumulator, and finisher | O(n) | O(1) |
| `collect(identity, interruptor, accumulator, finisher)` | Collect elements with identity, interruptor, accumulator, and finisher | O(n) | O(1) |
| `count()` | Count the number of elements | O(n) | O(1) |
| `error()` | Log elements to console with default error format | O(n) | O(1) |
| `error(accumulator)` | Log elements via custom accumulator error format | O(n) | O(1) |
| `error(prefix, accumulator, suffix)` | Log elements with prefix, custom accumulator, and suffix | O(n) | O(1) |
| `isEmpty()` | Check whether the collectable is empty | O(n) | O(1) |
| `findAny()` | Find any element in the collectable | O(n) | O(1) |
| `findFirst()` | Find the first element in the collectable | O(n) | O(1) |
| `findLast()` | Find the last element in the collectable | O(n) | O(1) |
| `findMaximum()` | Find the maximum element in the collectable | O(n) | O(1) |
| `findMaximum(comparator)` | Find the maximum element in the collectable using a comparator | O(n) | O(1) |
| `findMinimum()` | Find the minimum element in the collectable | O(n) | O(1) |
| `findMinimum(comparator)` | Find the minimum element in the collectable using a comparator | O(n) | O(1) |
| `forEach(action)` | Iterate over all elements with a consumer or bi-consumer | O(n) | O(1) |
| `group(classifier)` | Group elements by a classifier function | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Group elements by key and value extractors | O(n) | O(n) |
| `join()` | Join elements into a string with default format | O(n) | O(n) |
| `join(delimiter)` | Join elements into a string with a delimiter | O(n) | O(n) |
| `join(prefix, delimiter, suffix)` | Join elements with prefix, delimiter, and suffix | O(n) | O(n) |
| `join(prefix, accumulator, suffix)` | Join elements via custom accumulator with prefix and suffix | O(n) | O(n) |
| `log()` | Log elements to console with default format | O(n) | O(1) |
| `log(accumulator)` | Log elements via custom accumulator | O(n) | O(1) |
| `log(prefix, accumulator, suffix)` | Log elements with prefix, custom accumulator, and suffix | O(n) | O(1) |
| `nonMatch(predicate)` | Whether no elements match the predicate | O(n) | O(1) |
| `partition(count)` | Partition elements into chunks of specified size | O(n) | O(n) |
| `partitionBy(classifier)` | Partition elements by a classifier function | O(n) | O(n) |
| `reduce(accumulator)` | Reduce elements using an accumulator (no initial value) | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reduce elements with an initial value and accumulator | O(n) | O(1) |
| `reduce(identity, accumulator, finisher)` | Reduce elements with initial value, accumulator, and finisher | O(n) | O(1) |
| `semantic()` | Convert the collectable to a semantic object | O(1) | O(1) |
| `source()` | Get the source of the collectable | O(1) | O(1) |
| `toArray()` | Convert elements to an array | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convert elements to a Map via key and value extractors | O(n) | O(n) |
| `toSet()` | Convert elements to a Set | O(n) | O(n) |
| `write(stream)` | Write elements to a stream (default format) | O(n) | O(1) |
| `write(stream, accumulator)` | Write elements to a stream via custom accumulator | O(n) | O(1) |

```typescript
// Collectable operation examples
let data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// Match checks
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// Find operations
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // Any element

// Grouping operations
let grouped = data.groupBy(
    (n: number): string => n > 5 ? "large" : "small",
    (n: number): number => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Reduction operations
let sum = data.reduce(0, (accumulator: number, n: number): number => accumulator + n); // 30

// Output operations
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Unordered Collectable Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |

## Ordered Collectable Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |

## Statistical Analysis Methods

### Statisttics Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |
| `count()` | Count the number of elements | O(n) | O(1) |
| `frequency()` | Frequency distribution | O(n) | O(n) |

### NumericStatistics Methods

| Method | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |
| `average()` | Calculate the average of elements | O(n) | O(1) |
| `average(mapper)` | Calculate the average of elements using a mapper | O(n) | O(1) |
| `range()` | Calculate the range of elements | O(n) | O(1) |
| `range(mapper)` | Calculate the range of elements using a mapper | O(n) | O(1) |
| `variance()` | Calculate the variance of elements | O(n) | O(1) |
| `variance(mapper)` | Calculate the variance of elements using a mapper | O(n) | O(1) |
| `standardDeviation()` | Calculate the standard deviation of elements | O(n) | O(1) |
| `standardDeviation(mapper)` | Calculate the standard deviation of elements using a mapper | O(n) | O(1) |
| `mean()` | Calculate the mean of elements | O(n) | O(1) |
| `mean(mapper)` | Calculate the mean of elements using a mapper | O(n) | O(1) |
| `median()` | Calculate the median of elements | O(n) | O(1) |
| `median(mapper)` | Calculate the median of elements using a mapper | O(n) | O(1) |
| `mode()` | Calculate the mode of elements | O(n) | O(1) |
| `mode(mapper)` | Calculate the mode of elements using a mapper | O(n) | O(1) |
| `summate()` | Calculate the sum of elements | O(n) | O(1) |
| `summate(mapper)` | Calculate the sum of elements using a mapper | O(n) | O(1) |
| `quantile(quantile)` | Calculate the quantile of elements | O(n) | O(1) |
| `quantile(quantile, mapper)` | Calculate the quantile of elements using a mapper | O(n) | O(1) |
| `interquartileRange()` | Calculate the interquartile range of elements | O(n) | O(1) |
| `interquartileRange(mapper)` | Calculate the interquartile range of elements using a mapper | O(n) | O(1) |
| `skewness()` | Calculate the percentile of elements | O(n) | O(1) |
| `skewness(mapper)` | Calculate the percentile of elements using a mapper | O(n) | O(1) |
| `kurtosis()` | Calculate the kurtosis of elements | O(n) | O(1) |
| `kurtosis(mapper)` | Calculate the kurtosis of elements using a mapper | O(n) | O(1) |

```typescript
// Statistical analysis examples
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Mean:", numbers.mean()); // 5.5
console.log("Median:", numbers.median()); // 5.5
console.log("Standard deviation:", numbers.standardDeviation()); // ~2.87
console.log("Sum:", numbers.summate()); // 55

// Statistical analysis using mappers
let objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Mapped mean:", objects.mean(obj => obj.value)); // 20
```

### BigintStatistics Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |
| `average()` | Calculate the average of elements | O(n) | O(1) |
| `average(mapper)` | Calculate the average of elements using a mapper | O(n) | O(1) |
| `range()` | Calculate the range of elements | O(n) | O(1) |
| `range(mapper)` | Calculate the range of elements using a mapper | O(n) | O(1) |
| `variance()` | Calculate the variance of elements | O(n) | O(1) |
| `variance(mapper)` | Calculate the variance of elements using a mapper | O(n) | O(1) |
| `standardDeviation()` | Calculate the standard deviation of elements | O(n) | O(1) |
| `standardDeviation(mapper)` | Calculate the standard deviation of elements using a mapper | O(n) | O(1) |
| `mean()` | Calculate the mean of elements | O(n) | O(1) |
| `mean(mapper)` | Calculate the mean of elements using a mapper | O(n) | O(1) |
| `median()` | Calculate the median of elements | O(n) | O(1) |
| `median(mapper)` | Calculate the median of elements using a mapper | O(n) | O(1) |
| `mode()` | Calculate the mode of elements | O(n) | O(1) |
| `mode(mapper)` | Calculate the mode of elements using a mapper | O(n) | O(1) |
| `summate()` | Calculate the sum of elements | O(n) | O(1) |
| `summate(mapper)` | Calculate the sum of elements using a mapper | O(n) | O(1) |
| `quantile(quantile)` | Calculate the quantile of elements | O(n) | O(1) |
| `quantile(quantile, mapper)` | Calculate the quantile of elements using a mapper | O(n) | O(1) |
| `interquartileRange()` | Calculate the interquartile range of elements | O(n) | O(1) |
| `interquartileRange(mapper)` | Calculate the interquartile range of elements using a mapper | O(n) | O(1) |
| `skewness()` | Calculate the percentile of elements | O(n) | O(1) |
| `skewness(mapper)` | Calculate the percentile of elements using a mapper | O(n) | O(1) |
| `kurtosis()` | Calculate the kurtosis of elements | O(n) | O(1) |
| `kurtosis(mapper)` | Calculate the kurtosis of elements using a mapper | O(n) | O(1) |

### Window Collectable Methods

| Method | Description | Time Complexity | Space Complexity |
|------------|------------|------------|------------|
| `*[Symbol.iterator]()` | Iterate over all elements | O(n) | O(1) |
| `*[Symbol.asyncIterator]()` | Iterate over all elements asynchronously | O(n) | O(1) |
| `slide(size)` | Slide a window of a given size | O(n) | O(1) |
| `slide(size, step)` | Slide a window of a given size and step | O(n) | O(1) |
| `tumble(size)` | Tumble a window of a given size | O(n) | O(1) |

## Performance Selection Guide

### Choose Unordered Collector (Performance First)
```typescript
// When order guarantee is not needed, use unordered collector for best performance
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Best performance
```

### Choose Ordered Collector (Order Required)
```typescript
// When element order needs to be maintained, use ordered collector
let ordered = data.sorted(comparator);
```

### Choose Window Collector (Window Operations)
```typescript  
// When window operations are needed
let window: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // Sliding window
```

### Choose Statistical Analysis (Numerical Calculations)
```typescript  
// When statistical analysis is needed
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // Numerical statistics

let bigIntStatistics: BigintStatistics<bigint> = data
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


