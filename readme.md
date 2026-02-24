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
| `isGenerator(t: unknown): t is Generator<unknown>` | Check if it is a Generator | O(1) | O(1) |
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
| `useTraverse(t, callback: BiPredicate<keyof T, T[keyof T]>): void` | Deep traverse an object without cyclic references | O(n) | O(1) |
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
| `Optional.empty<T>(): Optional<T>` | Create an empty Optional | O(1) | O(1) |
| `Optional.of<T>(value): Optional<T>` | Create an Optional containing a value | O(1) | O(1) |
| `Optional.ofNullable<T>(value): Optional<T>` | Create a potentially empty Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value): Optional<T>` | Create a non-null Optional | O(1) | O(1) |

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
| `Collector.full(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create a full collector | O(1) | O(1) |
| `Collector.full(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create a full collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `Collector.shortable(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Create an interruptible collector | O(1) | O(1) |
| `useAnyMatch<E>(predicate: Predicate<E>): Collector<E, boolean, boolean>` | Creates a collector that checks if any element matches the predicate | `predicate: Predicate<E>` | `Collector<E, boolean, boolean>` |
| `useAllMatch<E>(predicate: Predicate<E>): Collector<E, boolean, boolean>` | Creates a collector that checks if all elements match the predicate | `predicate: Predicate<E>` | `Collector<E, boolean, boolean>` |
| `useCollect<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates a full collector | `identity: Supplier<A>`, `accumulator: BiFunctional<A, E, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates a full collector | `identity: Supplier<A>`, `accumulator: TriFunctional<A, E, bigint, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: Predicate<E>`, `accumulator: BiFunctional<A, E, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: Predicate<E>`, `accumulator: TriFunctional<A, E, bigint, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: BiPredicate<E, bigint>`, `accumulator: BiFunctional<A, E, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: BiPredicate<E, bigint>`, `accumulator: TriFunctional<A, E, bigint, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: TriPredicate<E, bigint, A>`, `accumulator: BiFunctional<A, E, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCollect<E, A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): Collector<E, A, R>` | Creates an interruptible collector | `identity: Supplier<A>`, `interruptor: TriPredicate<E, bigint, A>`, `accumulator: TriFunctional<A, E, bigint, A>`, `finisher: Functional<A, R>` | `Collector<E, A, R>` |
| `useCount<E = unknown>(): Collector<E, bigint, bigint>` | Creates a collector that counts elements | None | `Collector<E, bigint, bigint>` |
| `useError<E = unknown>(): Collector<E, string, string>` | Creates a collector that accumulates errors to console.error | None | `Collector<E, string, string>` |
| `useError<E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>` | Creates a collector that accumulates errors with custom accumulator | `accumulator: BiFunctional<string, E, string>` | `Collector<E, string, string>` |
| `useError<E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>` | Creates a collector that accumulates errors with custom accumulator | `accumulator: TriFunctional<string, E, bigint, string>` | `Collector<E, string, string>` |
| `useError<E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>` | Creates a collector that accumulates errors with prefix and suffix | `prefix: string`, `accumulator: BiFunctional<string, E, string>`, `suffix: string` | `Collector<E, string, string>` |
| `useError<E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>` | Creates a collector that accumulates errors with prefix and suffix | `prefix: string`, `accumulator: TriFunctional<string, E, bigint, string>`, `suffix: string` | `Collector<E, string, string>` |
| `useFindFirst<E>(): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the first element | None | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindAny<E>(): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds any element randomly | None | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindLast<E>(): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the last element | None | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindMaximum<E>(): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the maximum element | None | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindMaximum<E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the maximum element with custom comparator | `comparator: Comparator<E>` | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindMinimum<E>(): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the minimum element | None | `Collector<E, Optional<E>, Optional<E>>` |
| `useFindMinimum<E>(comparator: Comparator<E>): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that finds the minimum element with custom comparator | `comparator: Comparator<E>` | `Collector<E, Optional<E>, Optional<E>>` |
| `useForEach<E>(action: Consumer<E>): Collector<E, bigint, bigint>` | Creates a collector that performs an action on each element | `action: Consumer<E>` | `Collector<E, bigint, bigint>` |
| `useForEach<E>(action: BiConsumer<E, bigint>): Collector<E, bigint, bigint>` | Creates a collector that performs an action on each element with index | `action: BiConsumer<E, bigint>` | `Collector<E, bigint, bigint>` |
| `useNoneMatch<E>(predicate: Predicate<E>): Collector<E, boolean, boolean>` | Creates a collector that checks if no element matches the predicate | `predicate: Predicate<E>` | `Collector<E, boolean, boolean>` |
| `useGroup<E, K>(classifier: Functional<E, K>): Collector<E, Map<K, E[]>, Map<K, E[]>>` | Creates a collector that groups elements by classifier | `classifier: Functional<E, K>` | `Collector<E, Map<K, E[]>, Map<K, E[]>>` |
| `useGroupBy<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V[]>, Map<K, V[]>>` | Creates a collector that groups elements by key and extracts values | `keyExtractor: Functional<E, K>`, `valueExtractor: Functional<E, V>` | `Collector<E, Map<K, V[]>, Map<K, V[]>>` |
| `useJoin<E = unknown>(): Collector<E, string, string>` | Creates a collector that joins elements into a string | None | `Collector<E, string, string>` |
| `useJoin<E = unknown>(delimiter: string): Collector<E, string, string>` | Creates a collector that joins elements with delimiter | `delimiter: string` | `Collector<E, string, string>` |
| `useJoin<E = unknown>(prefix: string, delimiter: string, suffix: string): Collector<E, string, string>` | Creates a collector that joins elements with prefix, delimiter, and suffix | `prefix: string`, `delimiter: string`, `suffix: string` | `Collector<E, string, string>` |
| `useJoin<E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>` | Creates a collector that joins elements with custom accumulator | `prefix: string`, `accumulator: BiFunctional<string, E, string>`, `suffix: string` | `Collector<E, string, string>` |
| `useJoin<E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>` | Creates a collector that joins elements with custom accumulator | `prefix: string`, `accumulator: TriFunctional<string, E, bigint, string>`, `suffix: string` | `Collector<E, string, string>` |
| `useLog<E = unknown>(): Collector<E, string, string>` | Creates a collector that accumulates logs to console.log | None | `Collector<E, string, string>` |
| `useLog<E = unknown>(accumulator: BiFunctional<string, E, string>): Collector<E, string, string>` | Creates a collector that accumulates logs with custom accumulator | `accumulator: BiFunctional<string, E, string>` | `Collector<E, string, string>` |
| `useLog<E = unknown>(accumulator: TriFunctional<string, E, bigint, string>): Collector<E, string, string>` | Creates a collector that accumulates logs with custom accumulator | `accumulator: TriFunctional<string, E, bigint, string>` | `Collector<E, string, string>` |
| `useLog<E = unknown>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): Collector<E, string, string>` | Creates a collector that accumulates logs with prefix and suffix | `prefix: string`, `accumulator: BiFunctional<string, E, string>`, `suffix: string` | `Collector<E, string, string>` |
| `useLog<E = unknown>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): Collector<E, string, string>` | Creates a collector that accumulates logs with prefix and suffix | `prefix: string`, `accumulator: TriFunctional<string, E, bigint, string>`, `suffix: string` | `Collector<E, string, string>` |
| `usePartition<E>(count: bigint): Collector<E, Array<Array<E>>, Array<Array<E>>>` | Creates a collector that partitions elements into groups | `count: bigint` | `Collector<E, Array<Array<E>>, Array<Array<E>>>` |
| `usePartitionBy<E>(classifier: Functional<E, bigint>): Collector<E, Array<E[]>, Array<E[]>>` | Creates a collector that partitions elements by classifier | `classifier: Functional<E, bigint>` | `Collector<E, Array<E[]>, Array<E[]>>` |
| `useReduce<E>(accumulator: BiFunctional<E, E, E>): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that reduces elements | `accumulator: BiFunctional<E, E, E>` | `Collector<E, Optional<E>, Optional<E>>` |
| `useReduce<E>(accumulator: TriFunctional<E, E, bigint, E>): Collector<E, Optional<E>, Optional<E>>` | Creates a collector that reduces elements | `accumulator: TriFunctional<E, E, bigint, E>` | `Collector<E, Optional<E>, Optional<E>>` |
| `useReduce<E>(identity: E, accumulator: BiFunctional<E, E, E>): Collector<E, E, E>` | Creates a collector that reduces elements with identity | `identity: E`, `accumulator: BiFunctional<E, E, E>` | `Collector<E, E, E>` |
| `useReduce<E>(identity: E, accumulator: TriFunctional<E, E, bigint, E>): Collector<E, E, E>` | Creates a collector that reduces elements with identity | `identity: E`, `accumulator: TriFunctional<E, E, bigint, E>` | `Collector<E, E, E>` |
| `useReduce<E, R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): Collector<E, R, R>` | Creates a collector that reduces elements with identity and finisher | `identity: R`, `accumulator: BiFunctional<R, E, R>`, `finisher: Functional<R, R>` | `Collector<E, R, R>` |
| `useReduce<E, R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): Collector<E, R, R>` | Creates a collector that reduces elements with identity and finisher | `identity: R`, `accumulator: TriFunctional<R, E, bigint, R>`, `finisher: Functional<R, R>` | `Collector<E, R, R>` |
| `useToArray<E>(): Collector<E, E[], E[]>` | Creates a collector that accumulates elements into an array | None | `Collector<E, E[], E[]>` |
| `useToMap<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V>, Map<K, V>>` | Creates a collector that accumulates elements into a map | `keyExtractor: Functional<E, K>`, `valueExtractor: Functional<E, V>` | `Collector<E, Map<K, V>, Map<K, V>>` |
| `useToHashMap<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Collector<E, Map<K, V>, Map<K, V>>` | Creates a collector that accumulates elements into a hash map | `keyExtractor: Functional<E, K>`, `valueExtractor: Functional<E, V>` | `Collector<E, Map<K, V>, Map<K, V>>` |
| `useToSet<E>(): Collector<E, Set<E>, Set<E>>` | Creates a collector that accumulates elements into a set | None | `Collector<E, Set<E>, Set<E>>` |
| `useWrite<E, S = string>(stream: WritableStream<S>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` | Creates a collector that writes elements to a stream | `stream: WritableStream<S>` | `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` |
| `useWrite<E, S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` | Creates a collector that writes elements to a stream with custom accumulator | `stream: WritableStream<S>`, `accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>` | `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` |
| `useWrite<E, S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` | Creates a collector that writes elements to a stream with custom accumulator | `stream: WritableStream<S>`, `accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>` | `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>` |
| `useNumericSummate<E>(): Collector<E, number, number>` | Creates a collector that sums numeric values | None | `Collector<number, number, number>` or `Collector<E, number, number>` |
| `useNumericSummate<E>(mapper: Functional<E, number>): Collector<E, number, number>` | Creates a collector that sums mapped numeric values | `mapper: Functional<E, number>` | `Collector<E, number, number>` |
| `useBigIntSummate<E>(): Collector<E, bigint, bigint>` | Creates a collector that sums bigint values | None | `Collector<bigint, bigint, bigint>` or `Collector<E, bigint, bigint>` |
| `useBigIntSummate<E>(mapper: Functional<E, bigint>): Collector<E, bigint, bigint>` | Creates a collector that sums mapped bigint values | `mapper: Functional<E, bigint>` | `Collector<E, bigint, bigint>` |
| `useNumericAverage<E>(): Collector<E, NumericAverageAccumulator, number>` | Creates a collector that calculates numeric average | None | `Collector<number, NumericAverageAccumulator, number>` or `Collector<E, NumericAverageAccumulator, number>` |
| `useNumericAverage<E>(mapper: Functional<E, number>): Collector<E, NumericAverageAccumulator, number>` | Creates a collector that calculates numeric average of mapped values | `mapper: Functional<E, number>` | `Collector<E, NumericAverageAccumulator, number>` |
| `useBigIntAverage<E>(): Collector<E, BigIntAverageAccumulator, bigint>` | Creates a collector that calculates bigint average | None | `Collector<bigint, BigIntAverageAccumulator, bigint>` or `Collector<E, BigIntAverageAccumulator, bigint>` |
| `useBigIntAverage<E>(mapper: Functional<E, bigint>): Collector<E, BigIntAverageAccumulator, bigint>` | Creates a collector that calculates bigint average of mapped values | `mapper: Functional<E, bigint>` | `Collector<E, BigIntAverageAccumulator, bigint>` |
| `useFrequency<E>(): Collector<E, Map<E, bigint>, Map<E, bigint>>` | Creates a collector that counts frequency of elements | None | `Collector<E, Map<E, bigint>, Map<E, bigint>>` |
| `useNumericMode<E>(): Collector<E, Map<number, bigint>, number>` | Creates a collector that finds numeric mode | None | `Collector<number, Map<number, bigint>, number>` or `Collector<E, Map<number, bigint>, number>` |
| `useNumericMode<E>(mapper: Functional<E, number>): Collector<E, Map<number, bigint>, number>` | Creates a collector that finds numeric mode of mapped values | `mapper: Functional<E, number>` | `Collector<E, Map<number, bigint>, number>` |
| `useBigIntMode<E>(): Collector<E, Map<bigint, bigint>, bigint>` | Creates a collector that finds bigint mode | None | `Collector<bigint, Map<bigint, bigint>, bigint>` or `Collector<E, Map<bigint, bigint>, bigint>` |
| `useBigIntMode<E>(mapper: Functional<E, bigint>): Collector<E, Map<bigint, bigint>, bigint>` | Creates a collector that finds bigint mode of mapped values | `mapper: Functional<E, bigint>` | `Collector<E, Map<bigint, bigint>, bigint>` |
| `useNumericVariance<E>(): Collector<E, VarianceAccumulator, number>` | Creates a collector that calculates numeric variance | None | `Collector<number, VarianceAccumulator, number>` or `Collector<E, VarianceAccumulator, number>` |
| `useNumericVariance<E>(mapper: Functional<E, number>): Collector<E, VarianceAccumulator, number>` | Creates a collector that calculates numeric variance of mapped values | `mapper: Functional<E, number>` | `Collector<E, VarianceAccumulator, number>` |
| `useBigIntVariance<E>(): Collector<E, BigIntVarianceAccumulator, bigint>` | Creates a collector that calculates bigint variance | None | `Collector<bigint, BigIntVarianceAccumulator, bigint>` or `Collector<E, BigIntVarianceAccumulator, bigint>` |
| `useBigIntVariance<E>(mapper: Functional<E, bigint>): Collector<E, BigIntVarianceAccumulator, bigint>` | Creates a collector that calculates bigint variance of mapped values | `mapper: Functional<E, bigint>` | `Collector<E, BigIntVarianceAccumulator, bigint>` |
| `useNumericStandardDeviation<E>(): Collector<E, StandardDeviationAccumulator, number>` | Creates a collector that calculates numeric standard deviation | None | `Collector<number, StandardDeviationAccumulator, number>` or `Collector<E, StandardDeviationAccumulator, number>` |
| `useNumericStandardDeviation<E>(mapper: Functional<E, number>): Collector<E, StandardDeviationAccumulator, number>` | Creates a collector that calculates numeric standard deviation of mapped values | `mapper: Functional<E, number>` | `Collector<E, StandardDeviationAccumulator, number>` |
| `useBigIntStandardDeviation<E>(): Collector<E, BigIntStandardDeviationAccumulator, bigint>` | Creates a collector that calculates bigint standard deviation | None | `Collector<bigint, BigIntStandardDeviationAccumulator, bigint>` or `Collector<E, BigIntStandardDeviationAccumulator, bigint>` |
| `useBigIntStandardDeviation<E>(mapper: Functional<E, bigint>): Collector<E, BigIntStandardDeviationAccumulator, bigint>` | Creates a collector that calculates bigint standard deviation of mapped values | `mapper: Functional<E, bigint>` | `Collector<E, BigIntStandardDeviationAccumulator, bigint>` |
| `useNumericMedian<E>(): Collector<E, number[], number>` | Creates a collector that calculates numeric median | None | `Collector<number, number[], number>` or `Collector<E, number[], number>` |
| `useNumericMedian<E>(mapper: Functional<E, number>): Collector<E, number[], number>` | Creates a collector that calculates numeric median of mapped values | `mapper: Functional<E, number>` | `Collector<E, number[], number>` |
| `useBigIntMedian<E>(): Collector<E, bigint[], bigint>` | Creates a collector that calculates bigint median | None | `Collector<bigint, bigint[], bigint>` or `Collector<E, bigint[], bigint>` |
| `useBigIntMedian<E>(mapper: Functional<E, bigint>): Collector<E, bigint[], bigint>` | Creates a collector that calculates bigint median of mapped values | `mapper: Functional<E, bigint>` | `Collector<E, bigint[], bigint>` |
| `useToGeneratorFunction<E>(): Collector<E, Array<E>, globalThis.Generator<E, void, undefined>>` | Creates a collector that converts elements to a generator function | None | `Collector<E, Array<E>, globalThis.Generator<E, void, undefined>>` |
| `useToAsyncGeneratorFunction<E>(): Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>>` | Creates a collector that converts elements to an async generator function | None | `Collector<E, Array<E>, globalThis.AsyncGenerator<E, void, undefined>>` |

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
|--------|-------------|-----------------|------------------|
| `collect(generator: Generator<E>): R` | Collect elements from a generator function | O(n) | O(1) |
| `collect(iterable: Iterable<E>): R` | Collect elements from an iterable object | O(n) | O(1) |
| `collect(semantic: Semantic<E>): R` | Collect elements from a semantic stream | O(n) | O(1) |
| `collect(collectable: Collectable<E>): R` | Collect elements from a collectable stream | O(n) | O(1) |
| `collect(start: number, end: number): R` | Collect elements from a numeric range | O(n) | O(1) |
| `collect(start: bigint, end: bigint): R` | Collect elements from a bigint range | O(n) | O(1) |

### Semantic Factory Methods

| Function | Description | Parameters | Return Type |
|----------|-------------|------------|-------------|
| `animationFrame(period: number): Semantic<number>` | Creates a semantic that emits animation frame timestamps | `period: number` | `Semantic<number>` |
| `animationFrame(period: number, delay: number): Semantic<number>` | Creates a semantic that emits animation frame timestamps with delay | `period: number`, `delay: number` | `Semantic<number>` |
| `attribute<T extends object>(target: T): Semantic<Attribute<T>>` | Creates a semantic that emits object attributes | `target: T` | `Semantic<Attribute<T>>` |
| `blob(blob: Blob): Semantic<Uint8Array>` | Creates a semantic that emits blob data in chunks | `blob: Blob` | `Semantic<Uint8Array>` |
| `blob(blob: Blob, chunk: bigint): Semantic<Uint8Array>` | Creates a semantic that emits blob data with custom chunk size | `blob: Blob`, `chunk: bigint` | `Semantic<Uint8Array>` |
| `empty<E>(): Semantic<E>` | Creates an empty semantic that emits no elements | None | `Semantic<E>` |
| `fill<E>(element: E, count: bigint): Semantic<E>` | Creates a semantic that emits a repeated element | `element: E`, `count: bigint` | `Semantic<E>` |
| `fill<E>(supplier: Supplier<E>, count: bigint): Semantic<E>` | Creates a semantic that emits values from a supplier | `supplier: Supplier<E>`, `count: bigint` | `Semantic<E>` |
| `from<E>(iterable: Iterable<E>): Semantic<E>` | Creates a semantic from an iterable | `iterable: Iterable<E>` | `Semantic<E>` |
| `from<E>(iterable: AsyncIterable<E>): Semantic<E>` | Creates a semantic from an async iterable | `iterable: AsyncIterable<E>` | `Semantic<E>` |
| `generate<E>(supplier: Supplier<E>, count: bigint): Semantic<E>` | Creates a semantic that generates a fixed number of values | `supplier: Supplier<E>`, `count: bigint` | `Semantic<E>` |
| `generate<E>(element: E, count: bigint): Semantic<E>` | Creates a semantic that repeats an element | `element: E`, `count: bigint` | `Semantic<E>` |
| `generate<E>(supplier: Supplier<E>, interrupt: Predicate<E>): Semantic<E>` | Creates a semantic that generates until condition is met | `supplier: Supplier<E>`, `interrupt: Predicate<E>` | `Semantic<E>` |
| `generate<E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): Semantic<E>` | Creates a semantic that generates until condition is met | `supplier: Supplier<E>`, `interrupt: BiPredicate<E, bigint>` | `Semantic<E>` |
| `interval(period: number): Semantic<number>` | Creates a semantic that emits at regular intervals | `period: number` | `Semantic<number>` |
| `interval(period: number, delay: number): Semantic<number>` | Creates a semantic that emits at intervals with initial delay | `period: number`, `delay: number` | `Semantic<number>` |
| `iterate<E>(generator: Generator<E>): Semantic<E>` | Creates a semantic from a generator function | `generator: Generator<E>` | `Semantic<E>` |
| `promise<T>(promise: Promise<T>): Semantic<T>` | Creates a semantic that emits a promise's result | `promise: Promise<T>` | `Semantic<T>` |
| `range(start: number, end: number): Semantic<number>` | Creates a semantic that emits a range of numbers | `start: number`, `end: number` | `Semantic<number>` |
| `range(start: number, end: number, step: number): Semantic<number>` | Creates a semantic that emits a range with custom step | `start: number`, `end: number`, `step: number` | `Semantic<number>` |
| `websocket(websocket: WebSocket): Semantic<MessageEvent \| CloseEvent \| Event>` | Creates a semantic that emits WebSocket events | `websocket: WebSocket` | `Semantic<MessageEvent \| CloseEvent \| Event>` |

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
|--------|-------------|-----------------|------------------|
| `concat(other: Semantic<E>): Semantic<E>` | Concatenates two semantics | O(m+n) | O(1) |
| `concat(other: Iterable<E>): Semantic<E>` | Concatenates semantic with an iterable | O(m+n) | O(1) |
| `distinct(): Semantic<E>` | Returns distinct elements | O(n) | O(n) |
| `distinct<K>(keyExtractor: Functional<E, K>): Semantic<E>` | Returns distinct elements by key | O(n) | O(n) |
| `distinct<K>(keyExtractor: BiFunctional<E, bigint, K>): Semantic<E>` | Returns distinct elements by key with index | O(n) | O(n) |
| `dropWhile(predicate: Predicate<E>): Semantic<E>` | Drops elements while predicate is true | O(n) | O(1) |
| `dropWhile(predicate: BiPredicate<E, bigint>): Semantic<E>` | Drops elements while predicate is true with index | O(n) | O(1) |
| `filter(predicate: Predicate<E>): Semantic<E>` | Filters elements by predicate | O(n) | O(1) |
| `filter(predicate: BiPredicate<E, bigint>): Semantic<E>` | Filters elements by predicate with index | O(n) | O(1) |
| `flat(mapper: Functional<E, Iterable<E>>): Semantic<E>` | Flattens iterable results | O(n) | O(1) |
| `flat(mapper: BiFunctional<E, bigint, Iterable<E>>): Semantic<E>` | Flattens iterable results with index | O(n) | O(1) |
| `flat(mapper: Functional<E, Semantic<E>>): Semantic<E>` | Flattens semantic results | O(n) | O(1) |
| `flat(mapper: BiFunctional<E, bigint, Semantic<E>>): Semantic<E>` | Flattens semantic results with index | O(n) | O(1) |
| `flatMap<R>(mapper: Functional<E, Iterable<R>>): Semantic<R>` | Maps and flattens to different type | O(n) | O(1) |
| `flatMap<R>(mapper: BiFunctional<E, bigint, Iterable<R>>): Semantic<R>` | Maps and flattens with index | O(n) | O(1) |
| `flatMap<R>(mapper: Functional<E, Semantic<R>>): Semantic<R>` | Maps and flattens semantics | O(n) | O(1) |
| `flatMap<R>(mapper: BiFunctional<E, bigint, Semantic<R>>): Semantic<R>` | Maps and flattens semantics with index | O(n) | O(1) |
| `limit(n: number): Semantic<E>` | Limits number of elements | O(n) | O(1) |
| `limit(n: bigint): Semantic<E>` | Limits number of elements (bigint) | O(n) | O(1) |
| `map<R>(mapper: Functional<E, R>): Semantic<R>` | Maps elements to different type | O(n) | O(1) |
| `map<R>(mapper: BiFunctional<E, bigint, R>): Semantic<R>` | Maps elements with index | O(n) | O(1) |
| `peek(consumer: Consumer<E>): Semantic<E>` | Performs action on elements | O(n) | O(1) |
| `peek(consumer: BiConsumer<E, bigint>): Semantic<E>` | Performs action on elements with index | O(n) | O(1) |
| `redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E>` | Redirects element indices | O(n) | O(1) |
| `reverse(): Semantic<E>` | Reverses element indices | O(n) | O(1) |
| `shuffle(): Semantic<E>` | Shuffles element indices randomly | O(n) | O(1) |
| `shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>` | Shuffles element indices with mapper | O(n) | O(1) |
| `skip(n: number): Semantic<E>` | Skips first n elements | O(n) | O(1) |
| `skip(n: bigint): Semantic<E>` | Skips first n elements (bigint) | O(n) | O(1) |
| `sub(start: bigint, end: bigint): Semantic<E>` | Returns sub-semantic range | O(n) | O(1) |
| `takeWhile(predicate: Predicate<E>): Semantic<E>` | Takes elements while predicate is true | O(n) | O(1) |
| `takeWhile(predicate: BiPredicate<E, bigint>): Semantic<E>` | Takes elements while predicate is true with index | O(n) | O(1) |
| `translate(offset: number): Semantic<E>` | Translates element indices by offset | O(n) | O(1) |
| `translate(offset: bigint): Semantic<E>` | Translates element indices by offset (bigint) | O(n) | O(1) |
| `translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>` | Translates element indices with translator | O(n) | O(1) |

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
| `sorted(): OrderedCollectable<E>` | Returns sorted collectable | O(n log n) | O(n) |
| `sorted(comparator: Comparator<E>): OrderedCollectable<E>` | Returns sorted collectable with comparator | O(n log n) | O(n) |
| `toCollectable(): Collectable<E>` | Converts to collectable | O(1) | O(1) |
| `toCollectable<C extends Collectable<E>>(mapper: Functional<Generator<E>, C>): C` | Converts to collectable with mapper | O(1) | O(1) |
| `toBigintStatistics(): BigIntStatistics<E>` | Converts to bigint statistics | O(1) | O(1) |
| `toNumericStatistics(): NumericStatistics<E>` | Converts to numeric statistics | O(1) | O(1) |
| `toOrdered(): OrderedCollectable<E>` | Converts to ordered collectable | O(1) | O(1) |
| `toUnordered(): UnorderedCollectable<E>` | Converts to unordered collectable | O(1) | O(1) |
| `toWindow(): WindowCollectable<E>` | Converts to window collectable | O(1) | O(1) |

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
|--------|-------------|-----------------|------------------|
| `anyMatch(predicate: Predicate<E>): boolean` | Returns true if any element matches the predicate | O(n) | O(1) |
| `allMatch(predicate: Predicate<E>): boolean` | Returns true if all elements match the predicate | O(n) | O(1) |
| `collect<A, R>(collector: Collector<E, A, R>): R` | Collects elements using a collector | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Collects elements with accumulator and finisher | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Collects elements with index-aware accumulator | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Collects with interruptor and accumulator | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Collects with index-aware interruptor | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Collects with state-aware interruptor | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Collects with index-aware accumulator | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Collects with both index-aware | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Collects with state and index awareness | O(n) | O(1) |
| `count(): bigint` | Counts number of elements | O(n) | O(1) |
| `error(): void` | Logs elements to console.error | O(n) | O(1) |
| `error(accumulator: BiFunctional<string, E, string>): void` | Logs with custom accumulator | O(n) | O(1) |
| `error(accumulator: TriFunctional<string, E, bigint, string>): void` | Logs with index-aware accumulator | O(n) | O(1) |
| `error(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void` | Logs with prefix and suffix | O(n) | O(1) |
| `error(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void` | Logs with index-aware accumulator | O(n) | O(1) |
| `isEmpty(): boolean` | Returns true if no elements | O(1) | O(1) |
| `findAny(): Optional<E>` | Returns any element randomly | O(1) | O(1) |
| `findFirst(): Optional<E>` | Returns the first element | O(1) | O(1) |
| `findLast(): Optional<E>` | Returns the last element | O(n) | O(1) |
| `findMaximum(): Optional<E>` | Returns maximum element | O(n) | O(1) |
| `findMaximum(comparator: Comparator<E>): Optional<E>` | Returns maximum with comparator | O(n) | O(1) |
| `findMinimum(): Optional<E>` | Returns minimum element | O(n) | O(1) |
| `findMinimum(comparator: Comparator<E>): Optional<E>` | Returns minimum with comparator | O(n) | O(1) |
| `forEach(action: Consumer<E>): void` | Performs action on each element | O(n) | O(1) |
| `forEach(action: BiConsumer<E, bigint>): void` | Performs action with index | O(n) | O(1) |
| `group<K>(classifier: Functional<E, K>): Map<K, Array<E>>` | Groups elements by classifier | O(n) | O(n) |
| `groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>>` | Groups with key-value mapping | O(n) | O(n) |
| `join(): string` | Joins elements into string | O(n) | O(1) |
| `join(delimiter: string): string` | Joins with delimiter | O(n) | O(1) |
| `join(prefix: string, delimiter: string, suffix: string): string` | Joins with prefix and suffix | O(n) | O(1) |
| `join(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): string` | Joins with custom accumulator | O(n) | O(1) |
| `join(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string` | Joins with index-aware accumulator | O(n) | O(1) |
| `log(): void` | Logs elements to console.log | O(n) | O(1) |
| `log(accumulator: BiFunctional<string, E, string>): void` | Logs with custom accumulator | O(n) | O(1) |
| `log(accumulator: TriFunctional<string, E, bigint, string>): void` | Logs with index-aware accumulator | O(n) | O(1) |
| `log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void` | Logs with prefix and suffix | O(n) | O(1) |
| `log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void` | Logs with index-aware accumulator | O(n) | O(1) |
| `nonMatch(predicate: Predicate<E>): boolean` | Returns true if no element matches | O(n) | O(1) |
| `partition(count: bigint): Array<Array<E>>` | Partitions into groups of size | O(n) | O(n) |
| `partitionBy(classifier: Functional<E, bigint>): Array<Array<E>>` | Partitions by classifier | O(n) | O(n) |
| `reduce(accumulator: BiFunctional<E, E, E>): Optional<E>` | Reduces elements | O(n) | O(1) |
| `reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>` | Reduces with index | O(n) | O(1) |
| `reduce(identity: E, accumulator: BiFunctional<E, E, E>): E` | Reduces with identity | O(n) | O(1) |
| `reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E` | Reduces with identity and index | O(n) | O(1) |
| `reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): R` | Reduces with finisher | O(n) | O(1) |
| `reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): R` | Reduces with index and finisher | O(n) | O(1) |
| `semantic(): Semantic<E>` | Converts to semantic | O(1) | O(1) |
| `source(): Generator<E>` | Returns generator source | O(1) | O(1) |
| `toArray(): Array<E>` | Converts to array | O(n) | O(n) |
| `toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>` | Converts to map | O(n) | O(n) |
| `toHashMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>` | Converts to hash map | O(n) | O(n) |
| `toSet(): Set<E>` | Converts to set | O(n) | O(n) |
| `toHashSet(): Set<E>` | Converts to hash set | O(n) | O(n) |
| `write<S = string>(stream: WritableStream<S>): Promise<WritableStream<S>>` | Writes to stream | O(n) | O(1) |
| `write<S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Promise<WritableStream<S>>` | Writes with accumulator | O(n) | O(1) |
| `write<S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>>` | Writes with index-aware accumulator | O(n) | O(1) |

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
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates unordered collectable | O(1) | O(1) |
| `source(): Generator<E>` | Returns generator source | O(1) | O(1) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |

## Ordered Collectable Methods

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates ordered collectable | O(n log n) | O(n) |
| `constructor(generator: Generator<E>, comparator: Comparator<E>)` | Creates ordered collectable with comparator | O(n log n) | O(n) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |
| `source(): Generator<E>` | Returns indexed generator source | O(1) | O(1) |
| `isEmpty(): boolean` | Returns true if buffer is empty | O(1) | O(1) |

## Statistical Analysis Methods

### Statisttics Methods

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates a statistics instance | O(n log n) | O(n) |
| `constructor(generator: Generator<E>, comparator: Comparator<E>)` | Creates a statistics instance with comparator | O(n log n) | O(n) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |
| `count(): bigint` | Returns the number of elements | O(1) | O(1) |
| `average(): D` | Returns the average (arithmetic mean) | O(n) | O(1) |
| `average(mapper: Functional<E, D>): D` | Returns the average of mapped values | O(n) | O(1) |
| `range(): D` | Returns the range (max-min) | O(1) | O(1) |
| `range(mapper: Functional<E, D>): D` | Returns the range of mapped values | O(1) | O(1) |
| `variance(): D` | Returns the variance | O(n) | O(1) |
| `variance(mapper: Functional<E, D>): D` | Returns the variance of mapped values | O(n) | O(1) |
| `standardDeviation(): D` | Returns the standard deviation | O(n) | O(1) |
| `standardDeviation(mapper: Functional<E, D>): D` | Returns the standard deviation of mapped values | O(n) | O(1) |
| `mean(): D` | Returns the mean (same as average) | O(n) | O(1) |
| `mean(mapper: Functional<E, D>): D` | Returns the mean of mapped values | O(n) | O(1) |
| `median(): D` | Returns the median | O(n) | O(n) |
| `median(mapper: Functional<E, D>): D` | Returns the median of mapped values | O(n) | O(n) |
| `mode(): D` | Returns the mode | O(n) | O(n) |
| `mode(mapper: Functional<E, D>): D` | Returns the mode of mapped values | O(n) | O(n) |
| `frequency(): Map<E, bigint>` | Returns the frequency distribution | O(n) | O(n) |
| `summate(): D` | Returns the sum of elements | O(n) | O(1) |
| `summate(mapper: Functional<E, D>): D` | Returns the sum of mapped values | O(n) | O(1) |
| `quantile(quantile: number): D` | Returns the specified quantile | O(1) | O(1) |
| `quantile(quantile: number, mapper: Functional<E, D>): D` | Returns the quantile of mapped values | O(1) | O(1) |
| `interquartileRange(): D` | Returns the interquartile range (IQR) | O(1) | O(1) |
| `interquartileRange(mapper: Functional<E, D>): D` | Returns the IQR of mapped values | O(1) | O(1) |
| `skewness(): D` | Returns the skewness measure | O(n) | O(1) |
| `skewness(mapper: Functional<E, D>): D` | Returns the skewness of mapped values | O(n) | O(1) |
| `kurtosis(): D` | Returns the kurtosis measure | O(n) | O(1) |
| `kurtosis(mapper: Functional<E, D>): D` | Returns the kurtosis of mapped values | O(n) | O(1) |


### NumericStatistics Methods

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates a numeric statistics instance | O(n log n) | O(n) |
| `constructor(generator: Generator<E>, comparator: Comparator<E>)` | Creates a numeric statistics instance with comparator | O(n log n) | O(n) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |
| `count(): bigint` | Returns the number of elements | O(1) | O(1) |
| `average(): number` | Returns the numeric average | O(n) | O(1) |
| `average(mapper: Functional<E, number>): number` | Returns the average of mapped numeric values | O(n) | O(1) |
| `range(): number` | Returns the numeric range | O(1) | O(1) |
| `range(mapper: Functional<E, number>): number` | Returns the range of mapped numeric values | O(1) | O(1) |
| `variance(): number` | Returns the numeric variance | O(n) | O(1) |
| `variance(mapper: Functional<E, number>): number` | Returns the variance of mapped numeric values | O(n) | O(1) |
| `standardDeviation(): number` | Returns the numeric standard deviation | O(n) | O(1) |
| `standardDeviation(mapper: Functional<E, number>): number` | Returns the standard deviation of mapped numeric values | O(n) | O(1) |
| `mean(): number` | Returns the numeric mean (same as average) | O(n) | O(1) |
| `mean(mapper: Functional<E, number>): number` | Returns the mean of mapped numeric values | O(n) | O(1) |
| `median(): number` | Returns the numeric median | O(n) | O(n) |
| `median(mapper: Functional<E, number>): number` | Returns the median of mapped numeric values | O(n) | O(n) |
| `mode(): number` | Returns the numeric mode | O(n) | O(n) |
| `mode(mapper: Functional<E, number>): number` | Returns the mode of mapped numeric values | O(n) | O(n) |
| `frequency(): Map<E, bigint>` | Returns the frequency distribution | O(n) | O(n) |
| `summate(): number` | Returns the numeric sum | O(n) | O(1) |
| `summate(mapper: Functional<E, number>): number` | Returns the sum of mapped numeric values | O(n) | O(1) |
| `quantile(quantile: number): number` | Returns the specified numeric quantile | O(1) | O(1) |
| `quantile(quantile: number, mapper: Functional<E, number>): number` | Returns the quantile of mapped numeric values | O(1) | O(1) |
| `interquartileRange(): number` | Returns the numeric interquartile range | O(1) | O(1) |
| `interquartileRange(mapper: Functional<E, number>): number` | Returns the IQR of mapped numeric values | O(1) | O(1) |
| `skewness(): number` | Returns the numeric skewness | O(n) | O(1) |
| `skewness(mapper: Functional<E, number>): number` | Returns the skewness of mapped numeric values | O(n) | O(1) |
| `kurtosis(): number` | Returns the numeric kurtosis | O(n) | O(1) |
| `kurtosis(mapper: Functional<E, number>): number` | Returns the kurtosis of mapped numeric values | O(n) | O(1) |

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
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates a bigint statistics instance | O(n log n) | O(n) |
| `constructor(generator: Generator<E>, comparator: Comparator<E>)` | Creates a bigint statistics instance with comparator | O(n log n) | O(n) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |
| `count(): bigint` | Returns the number of elements | O(1) | O(1) |
| `average(): bigint` | Returns the bigint average | O(n) | O(1) |
| `average(mapper: Functional<E, bigint>): bigint` | Returns the average of mapped bigint values | O(n) | O(1) |
| `range(): bigint` | Returns the bigint range | O(1) | O(1) |
| `range(mapper: Functional<E, bigint>): bigint` | Returns the range of mapped bigint values | O(1) | O(1) |
| `variance(): bigint` | Returns the bigint variance | O(n) | O(1) |
| `variance(mapper: Functional<E, bigint>): bigint` | Returns the variance of mapped bigint values | O(n) | O(1) |
| `standardDeviation(): bigint` | Returns the bigint standard deviation | O(n) | O(1) |
| `standardDeviation(mapper: Functional<E, bigint>): bigint` | Returns the standard deviation of mapped bigint values | O(n) | O(1) |
| `mean(): bigint` | Returns the bigint mean (same as average) | O(n) | O(1) |
| `mean(mapper: Functional<E, bigint>): bigint` | Returns the mean of mapped bigint values | O(n) | O(1) |
| `median(): bigint` | Returns the bigint median | O(n) | O(n) |
| `median(mapper: Functional<E, bigint>): bigint` | Returns the median of mapped bigint values | O(n) | O(n) |
| `mode(): bigint` | Returns the bigint mode | O(n) | O(n) |
| `mode(mapper: Functional<E, bigint>): bigint` | Returns the mode of mapped bigint values | O(n) | O(n) |
| `frequency(): Map<E, bigint>` | Returns the frequency distribution | O(n) | O(n) |
| `summate(): bigint` | Returns the bigint sum | O(n) | O(1) |
| `summate(mapper: Functional<E, bigint>): bigint` | Returns the sum of mapped bigint values | O(n) | O(1) |
| `quantile(quantile: number): bigint` | Returns the specified bigint quantile | O(1) | O(1) |
| `quantile(quantile: number, mapper: Functional<E, bigint>): bigint` | Returns the quantile of mapped bigint values | O(1) | O(1) |
| `interquartileRange(): bigint` | Returns the bigint interquartile range | O(1) | O(1) |
| `interquartileRange(mapper: Functional<E, bigint>): bigint` | Returns the IQR of mapped bigint values | O(1) | O(1) |
| `skewness(): bigint` | Returns the bigint skewness | O(n) | O(1) |
| `skewness(mapper: Functional<E, bigint>): bigint` | Returns the skewness of mapped bigint values | O(n) | O(1) |
| `kurtosis(): bigint` | Returns the bigint kurtosis | O(n) | O(1) |
| `kurtosis(mapper: Functional<E, bigint>): bigint` | Returns the kurtosis of mapped bigint values | O(n) | O(1) |

### Window Collectable Methods

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `constructor(generator: Generator<E>)` | Creates a window collectable instance | O(n log n) | O(n) |
| `constructor(generator: Generator<E>, comparator: Comparator<E>)` | Creates a window collectable with comparator | O(n log n) | O(n) |
| `[Symbol.iterator](): Generator<E, void, undefined>` | Returns iterator | O(n) | O(1) |
| `[Symbol.asyncIterator](): AsyncGenerator<E, void, undefined>` | Returns async iterator | O(n) | O(1) |
| `slide(size: bigint): Semantic<Semantic<E>>` | Creates sliding windows of elements with 1 step | O(m × n) | O(m × n) |
| `slide(size: bigint, step: bigint): Semantic<Semantic<E>>` | Creates sliding windows of elements | O(m × n) | O(m × n) |
| `tumble(size: bigint): Semantic<Semantic<E>>` | Creates tumbling windows of elements | O(k × n) | O(k × n) |

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

