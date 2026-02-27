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
| `MaybeInvalid<T>` | Type that is either `T` or `null` or `undefined` |
| `MaybeUndefined<T>` | Type that is either `T` or `undefined` |
| `MaybeNull<T>` | Type that is either `T` or `null` |
| `Type` | String literal type representing JavaScript type names |
| `Primitive` | Type representing all primitive JavaScript values |
| `MaybePrimitive<T>` | Type that is either `T` or a primitive value |
| `AsyncFunction` | Type representing an asynchronous function returning a Promise |
| `DeepPropertyKey<T extends object>` | Recursive type for nested object keys |
| `DeepPropertyValue<T extends object>` | Recursive type for nested object values |

## Functional Interfaces

| Interface | Description |
|-----------|-------------|
| `Constructor<T>` | Class constructor that creates instances of type `T` |
| `Runnable` | Function with no parameters and no return value |
| `Supplier<R>` | Function with no parameters returning `R` |
| `Functional<T, R>` | Function that takes `T` and returns `R` |
| `Predicate<T>` | Function that takes `T` and returns a boolean |
| `BiFunctional<T, U, R>` | Function that takes `T` and `U` and returns `R` |
| `BiPredicate<T, U>` | Function that takes `T` and `U` and returns a boolean |
| `TriPredicate<T, U, V>` | Function that takes `T`, `U`, and `V` and returns a boolean |
| `Comparator<T>` | Function that compares two values of type `T` and returns a number |
| `TriFunctional<T, U, V, R>` | Function that takes `T`, `U`, and `V` and returns `R` |
| `Consumer<T>` | Function that takes `T` and returns nothing |
| `BiConsumer<T, U>` | Function that takes `T` and `U` and returns nothing |
| `TriConsumer<T, U, V>` | Function that takes `T`, `U`, and `V` and returns nothing |
| `Generator<T>` | Overloaded function type for generating values with callbacks |
| `Indexed<E>` | Interface containing an element and its index |

```typescript
// Type usage examples
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## Validation Functions

| Function | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Validate value is not null or undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Validate value is null or undefined | O(1) | O(1) |
| `typeOf<T>(t: T): Type` | Returns the type name of a value, distinguishing null from objects | O(1) | O(1) |

## Type Guards

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `isBoolean(target: unknown): target is boolean` | Checks if value is a boolean | O(1) | O(1) |
| `isString(target: unknown): target is string` | Checks if value is a string | O(1) | O(1) |
| `isNumber(target: unknown): target is number` | Checks if value is a finite, non-NaN number | O(1) | O(1) |
| `isFunction(target: unknown): target is Function` | Checks if value is a function | O(1) | O(1) |
| `isObject(target: unknown): target is object` | Checks if value is a non-null object | O(1) | O(1) |
| `isSymbol(target: unknown): target is symbol` | Checks if value is a symbol | O(1) | O(1) |
| `isBigInt(target: unknown): target is bigint` | Checks if value is a bigint | O(1) | O(1) |
| `isPrimitive(target: MaybePrimitive<unknown>): target is Primitive` | Checks if value is any primitive type | O(1) | O(1) |
| `isAsyncIterable(target: unknown): target is Iterable<unknown>` | Checks if value is async iterable | O(1) | O(1) |
| `isIterable(target: unknown): target is Iterable<unknown>` | Checks if value is iterable | O(1) | O(1) |
| `isSemantic(target: unknown): target is Semantic<unknown>` | Checks if value is a Semantic | O(1) | O(1) |
| `isCollector(target: unknown): target is Collector<unknown, unknown, unknown>` | Checks if value is a Collector | O(1) | O(1) |
| `isCollectable(target: unknown): target is Collectable<unknown>` | Checks if value is a Collectable | O(1) | O(1) |
| `isOrderedCollectable(target: unknown): target is OrderedCollectable<unknown>` | Checks if value is an OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(target: unknown): target is WindowCollectable<unknown>` | Checks if value is a WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(target: unknown): target is UnorderedCollectable<unknown>` | Checks if value is an UnorderedCollectable | O(1) | O(1) |
| `isStatistics(target: unknown): target is Statistics<unknown, number \| bigint>` | Checks if value is a Statistics | O(1) | O(1) |
| `isNumericStatistics(target: unknown): target is Statistics<unknown, number \| bigint>` | Checks if value is a NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(target: unknown): target is Statistics<unknown, number \| bigint>` | Checks if value is a BigIntStatistics | O(1) | O(1) |
| `isSemanticMap(target: unknown): target is SemanticMap<unknown, unknown>` | Checks if value is a SemanticMap | O(1) | O(1) |
| `isHashMap(target: unknown): target is HashMap<unknown, unknown>` | Checks if value is a HashMap | O(1) | O(1) |
| `isHashSet(target: unknown): target is HashSet<unknown>` | Checks if value is a HashSet | O(1) | O(1) |
| `isNode(target: unknown): target is Node<unknown, any>` | Checks if value is a Node | O(1) | O(1) |
| `isLinearNode(target: unknown): target is LinearNode<unknown>` | Checks if value is a LinearNode | O(1) | O(1) |
| `isBinaryNode(target: unknown): target is BinaryNode<unknown, any>` | Checks if value is a BinaryNode | O(1) | O(1) |
| `isRedBlackNode(target: unknown): target is BinaryNode<unknown, any>` | Checks if value is a RedBlackNode | O(1) | O(1) |
| `isTree(target: unknown): target is Node<unknown, any>` | Checks if value is a Tree (Linear or Binary Node) | O(1) | O(1) |
| `isBinaryTree(target: unknown): target is Node<unknown, any>` | Checks if value is a BinaryTree | O(1) | O(1) |
| `isRedBlackTree(target: unknown): target is Node<unknown, any>` | Checks if value is a RedBlackTree | O(1) | O(1) |
| `isOptional<T>(target: unknown): target is Optional<T>` | Checks if value is an Optional | O(1) | O(1) |
| `isPromise(target: unknown): target is Promise<unknown>` | Checks if value is a Promise | O(1) | O(1) |
| `isAsyncFunction(target: unknown): target is AsyncFunction` | Checks if value is an AsyncFunction | O(1) | O(1) |
| `isGeneratorFunction(target: unknown): target is Generator<unknown, unknown, unknown>` | Checks if value is a GeneratorFunction | O(1) | O(1) |
| `isAsyncGeneratorFunction(target: unknown): target is AsyncGenerator<unknown, unknown, unknown>` | Checks if value is an AsyncGeneratorFunction | O(1) | O(1) |
| `isWindow(target: unknown): target is Window` | Checks if value is a Window object | O(1) | O(1) |
| `isDocument(target: unknown): target is Document` | Checks if value is a Document object | O(1) | O(1) |
| `isHTMLElemet(target: unknown): target is HTMLElement` | Checks if value is an HTMLElement | O(1) | O(1) |

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

## Hooks

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `useCompare<T>(t1: T, t2: T)` | Compares two values (`t1` and `t2`) of the same type, returning a number (`<0`, `0`, `>0`) indicating their sort order. Throws an error for different types or functions. For objects, it attempts to use `Symbol.toPrimitive`, `valueOf`, or `toString`. | O(n) | O(n) |
| `Useandom<T>(index: T)` | Generates a deterministic pseudo-random number based on a Van der Corput sequence, the golden ratio, and a linear congruential generator. The input `index` must be a number or bigint. | O(1) | O(1) |
| `useTraverse<T extends object>(t: T, callback: UseTraverseCallback<T>)` | Performs a depth-first traversal of an object `t`. The `callback` receives the key and value for each primitive property. Traversal stops if the callback returns `false`. | O(n) | O(n) |
| `useTraverse<T extends object>(t: T, callback: UseTraversePathCallback<T>)` | Performs a depth-first traversal of an object `t`. The `callback` receives the key, value, and the complete traversal path for each primitive property. Traversal stops if the callback returns `false`. | O(n) | O(n) |
| `useGenerator<E>(iterable: Iterable<E>)` | Converts an `Iterable<E>` into a `Generator<E>` function. This function accepts `accept` and `interrupt` callbacks to process or break iteration over the elements. | O(1) | O(1) |
| `useArrange<E>(source: Iterable<E>)` | Sorts the elements from the `source` iterable. Without a comparator, it performs a stable sort based on the original indices. | O(n log n) | O(n) |
| `useArrange<E>(source: Iterable<E>, comparator: Comparator<E>)` | Sorts the elements from the `source` iterable using the provided `comparator` function. | O(n log n) | O(n) |
| `useArrange<E>(source: Generator<E>)` | Collects elements from the `source` generator and sorts them. Without a comparator, it performs a stable sort based on the order of collection. | O(n log n) | O(n) |
| `useArrange<E>(source: Generator<E>, comparator: Comparator<E>)` | Collects elements from the `source` generator and sorts them using the provided `comparator` function. | O(n log n) | O(n) |
| `useToNumber<T>(target: T)` | Attempts to convert the `target` value into a `number`. It handles primitives and objects with `Symbol.toPrimitive`. Invalid conversions result in `0`. | O(1) | O(1) |
| `useToBigInt<T>(target: T)` | Attempts to convert the `target` value into a `bigint`. It handles primitives (strings must be pure integers) and objects with `Symbol.toPrimitive`. Invalid conversions result in `0n`. | O(1) | O(1) |

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
useTraverse(o, (value, key, path: Array<string | number | symbol>): boolean => {
    console.log(key, value, path);
    return true; // Returns true to continue traversing.
});

let toBeResolved: object = {
    [Symbol.toPrimitive]: () => 5
};
let resolvedNumber: number = useToNumber(toBeResolved); // 5
let resolvedBigInt: bigint = useToBigInt(toBeResolved); // 5n
```

## Hash Algorithms

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `register<T>(type: Type, handler: Handler<T>)` | Registers a custom hash handler for a given `type` string. The `handler` function will be invoked by `useHash` for values of that type to compute a `bigint` hash. | O(1) | O(1) |
| `unregister(type: Type)` | Removes a previously registered custom hash handler for the specified `type`. It only succeeds for types not in the built-in list (e.g., "undefined", "object"). | O(1) | O(1) |
| `useHash<T>(target: T)` | Computes and returns a deterministic `bigint` hash for a single `target` value. It uses the built-in or registered handler based on the value's type. For objects, it performs a traversal. | O(n) | O(n) |
| `useHash(value: Array<unknown>)` | Computes a hash for an array containing all provided arguments (`value`). The array itself becomes the `target` for the hashing process. | O(n) | O(n) |

## HashMap Class Methods

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `clear(): void` | Removes all key-value mappings from this map. | O(n) | O(1) |
| `compute(key: K, remapping: BiFunctional<K, MaybeInvalid<V>, MaybeInvalid<V>>): MaybeInvalid<V>` | Attempts to compute a new mapping for the specified `key` and its current mapped value (or `undefined` if none). The `remapping` function generates the new value. Returns the new value associated with the key, or `undefined` if the mapping was removed. | O(1) avg / O(n) worst | O(1) |
| `computeIfAbsent(key: K, remapping: Supplier<V>): V` | If the specified `key` is not already associated with a value (or is mapped to `undefined`), attempts to compute its value using the `remapping` function and enters it into this map. Returns the current (existing or computed) value associated with the key. | O(1) avg / O(n) worst | O(1) |
| `computeIfPresent(key: K, remapping: BiFunctional<K, V, MaybeInvalid<V>>): MaybeInvalid<V>` | If the value for the specified `key` is present and not `undefined`, attempts to compute a new mapping using the `remapping` function. Returns the new value if the mapping is updated, or `undefined` if the mapping was removed. Returns the original value if the key was not present. | O(1) avg / O(n) worst | O(1) |
| `delete(key: K): boolean` | Removes the mapping for a `key` from this map if it is present. Returns `true` if the map contained the key, otherwise `false`. | O(1) avg / O(n) worst | O(1) |
| `entries(): MapIterator<[K, V]>` | Returns a new iterator object that contains an array of `[key, value]` for each element in this map in insertion order. | O(1) | O(1) |
| `forEach(consumer: BiConsumer<V, K>): void` | Executes the provided `consumer` function once for each key-value pair in this map, in insertion order. | O(n) | O(1) |
| `forEach(consumer: TriConsumer<V, K, Map<K, V>>): void` | Executes the provided `consumer` function (which also receives the map itself) once for each key-value pair in this map, in insertion order. | O(n) | O(1) |
| `get(key: K): MaybeUndefined<V>` | Returns the value associated with the specified `key`, or `undefined` if the map contains no mapping for the key. | O(1) avg / O(n) worst | O(1) |
| `get(key: K, defaultValue: V): V` | Returns the value associated with the specified `key`, or the provided `defaultValue` if the map contains no mapping for the key. | O(1) avg / O(n) worst | O(1) |
| `has(key: K): boolean` | Returns `true` if this map contains a mapping for the specified `key`. | O(1) avg / O(n) worst | O(1) |
| `keys(): MapIterator<K>` | Returns a new iterator object that contains the keys for each element in this map in insertion order. | O(1) | O(1) |
| `replace(key: K, value: V): MaybeInvalid<V>` | Replaces the entry for the specified `key` only if it is currently mapped to some value. Returns the previous value associated with the key, or `undefined` if there was no mapping. | O(1) avg / O(n) worst | O(1) |
| `replace(key: K, oldValue: V, newValue: V): boolean` | Replaces the entry for the specified `key` only if it is currently mapped to the specified `oldValue`. Returns `true` if the value was replaced. | O(1) avg / O(n) worst | O(1) |
| `replaceAll(operator: BiFunctional<K, V, MaybeInvalid<V>>): void` | Replaces each entry's value with the result of invoking the given `operator` on that entry until all entries have been processed or the function throws an exception. Entries are removed if the operator returns an invalid value. | O(n) | O(1) |
| `set(key: K, value: V): this` | Associates the specified `value` with the specified `key` in this map. If the map previously contained a mapping for the key, the old value is replaced. Returns the `HashMap` instance for chaining. | O(1) avg / O(n) worst | O(1) |
| `values(): IterableIterator<V>` | Returns a new iterator object that contains the values for each element in this map in insertion order. | O(1) | O(1) |

## HashSet Class Methods

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `add(value: E): this` | Adds the specified `value` to the set if it is not already present. Returns the `HashSet` instance for chaining. | O(1) avg / O(n) worst | O(1) |
| `clear(): void` | Removes all elements from the `HashSet`. | O(n) | O(1) |
| `delete(value: E): boolean` | Removes the specified `value` from the set if it is present. Returns `true` if the element was removed, otherwise `false`. | O(1) avg / O(n) worst | O(1) |
| `entries(): SetIterator<[E, E]>` | Returns a new iterator object that yields an array of `[value, value]` for each element in the set, in insertion order. | O(1) | O(1) |
| `forEach(consumer: Consumer<E>): void` | Executes the provided `consumer` function once for each value in the set, in insertion order. | O(n) | O(1) |
| `forEach(consumer: BiConsumer<E, E>): void` | Executes the provided `consumer` function (receiving the same value twice) once for each element in the set, in insertion order. | O(n) | O(1) |
| `forEach(consumer: TriConsumer<E, E, Set<E>>): void` | Executes the provided `consumer` function (receiving the value twice and the set itself) once for each element in the set, in insertion order. | O(n) | O(1) |
| `has(value: E): boolean` | Returns `true` if the set contains the specified `value`. | O(1) avg / O(n) worst | O(1) |
| `keys(): IterableIterator<E>` | Returns a new iterator object that yields the keys (which are the values) for each element in the set, in insertion order. | O(1) | O(1) |
| `values(): IterableIterator<E>` | Returns a new iterator object that yields the values for each element in the set, in insertion order. | O(1) | O(1) |

## Optional Factory Methods

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

## Optional Class Methods

| Function | Description | Time Complexity | Space Complexity |
|------|------|------------|------------|
| `filter(predicate: Predicate<T>)` | If a value is present and the `predicate` returns `true`, returns an `Optional` containing that value. Otherwise, returns an empty `Optional`. | O(1) | O(1) |
| `get()` | Returns the contained value if present. Throws a `TypeError` if no value is present. | O(1) | O(1) |
| `get(defaultValue: T)` | Returns the contained value if present. Otherwise, returns the provided `defaultValue`. | O(1) | O(1) |
| `ifPresent(action: Consumer<T>)` | If a value is present, invokes the given `action` with the value. Does nothing if empty. | O(1) | O(1) |
| `ifPresent(action: Consumer<T>, elseAction: Runnable)` | If a value is present, invokes `action` with the value. Otherwise, invokes `elseAction`. | O(1) | O(1) |
| `isEmpty()` | Returns `true` if no value is present. Otherwise, returns `false`. | O(1) | O(1) |
| `isPresent()` | Returns `true` if a value is present. Otherwise, returns `false`. | O(1) | O(1) |
| `map<R>(mapper: Functional<T, R>)` | If a value is present, applies the `mapper` function to it and returns an `Optional` containing the result. Returns an empty `Optional` if the input is empty or the result is invalid. | O(1) | O(1) |
| `flat(mapper: Functional<T, Optional<T>>)` | If a value is present, returns the result of applying the `mapper` function (which must return an `Optional<T>`). Returns an empty `Optional` if the input is empty. | O(1) | O(1) |
| `flatMap<R>(mapper: Functional<T, Optional<R>>)` | If a value is present, returns the result of applying the `mapper` function (which must return an `Optional<R>`). Returns an empty `Optional<R>` if the input is empty. | O(1) | O(1) |
| `orElse(other: MaybeInvalid<T>)` | Returns the contained value if present. Otherwise, returns the `other` value. | O(1) | O(1) |
| `semantic()` | Returns a `Semantic<T>` that lazily yields the contained value (if present) and can indicate emptiness. Returns an empty `Semantic` if this `Optional` is empty. | O(1) | O(1) |
| `Optional.empty<T>()` | Returns an empty `Optional` instance for the specified type `T`. | O(1) | O(1) |
| `Optional.of<T>(value: MaybeInvalid<T>)` | Returns an `Optional` describing the given `value`. This is an alias for `ofNullable`. | O(1) | O(1) |
| `Optional.ofNullable<T>(value: MaybeInvalid<T>)` | Returns an `Optional` describing the given `value` if it is valid (`validate` returns `true`), otherwise returns an empty `Optional`. | O(1) | O(1) |
| `Optional.ofNonNull<T>(value: T)` | Returns an `Optional` describing the given non-null `value`. Throws a `TypeError` if the `value` is invalid (`validate` returns `false`). | O(1) | O(1) |

```typescript
// Filter example
let filtered: Optional<number> = Optional.of(42).filter((value: number) => value > 10);
filtered.ifPresent((value: number) => console.log(value)); // Outputs 42

// Get example
let get: Optional<number> = Optional.of(42);
console.log(get.get()); // Outputs 42
console.log(get.get(100)); // Outputs 42
Optional.of(null).get(); // Throws a TypeError.
console.log(Optional.of(null).get(100)); // Outputs 100

// IfPresent example
let ifPresent: Optional<number> = Optional.of(42);
ifPresent.ifPresent((value: number) => console.log(value)); // Outputs 42

// Map example
let mapped: Optional<string> = Optional.of(42).map((value: number) => value.toString());
mapped.ifPresent((value: string) => console.log(value)); // Outputs "42"

// FlatMap example
let flatMapped: Optional<number> = Optional.of(42).flatMap((value: number) => Optional.of(value * 2));
flatMapped.ifPresent((value: number) => console.log(value)); // Outputs 84

// Flat example
let a: Optional<number> = Optional.of({
    a: Optional.of(1),
}).flat((value) => value.a);
```

### Collector Factory Methods

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `full<E, A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>)` | Creates a `Collector` that processes all elements without interruption. The `accumulator` combines an element with the intermediate result. | O(1) | O(1) |
| `full<E, A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>)` | Creates a `Collector` that processes all elements without interruption. The `accumulator` combines an element and its index with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element (`interrupt`). The `accumulator` combines an element with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element (`interrupt`). The `accumulator` combines an element and its index with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element and its index (`interrupt`). The `accumulator` combines an element with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element and its index (`interrupt`). The `accumulator` combines an element and its index with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element, its index, and the current accumulator value (`interrupt`). The `accumulator` combines an element with the intermediate result. | O(1) | O(1) |
| `shortable<E, A, R>(identity: Supplier<A>, interrupt: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>)` | Creates a `Collector` that can stop early based on an element, its index, and the current accumulator value (`interrupt`). The `accumulator` combines an element and its index with the intermediate result. | O(1) | O(1) |

### Collector Class Methods

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `collect(generator: Generator<E>): R` | Processes elements from a `Generator<E>` function, accumulating results according to the collector's logic, and returns the final transformed result (`R`). | O(n) | O(1) |
| `collect(iterable: Iterable<E>): R` | Processes elements from an `Iterable<E>` (e.g., Array, Set), accumulating results, and returns the final transformed result (`R`). | O(n) | O(1) |
| `collect(semantic: Semantic<E>): R` | Processes elements from a `Semantic<E>` object, accumulating results, and returns the final transformed result (`R`). | O(n) | O(1) |
| `collect(collectable: Collectable<E>): R` | Processes elements from a `Collectable<E>` object, accumulating results, and returns the final transformed result (`R`). | O(n) | O(1) |
| `collect(start: number, end: number): R` | Generates a numeric range from `start` to `end` (exclusive), processes each number as an element, accumulates results, and returns the final transformed result (`R`). | O(n) | O(1) |
| `collect(start: bigint, end: bigint): R` | Generates a big integer range from `start` to `end` (exclusive), processes each bigint as an element, accumulates results, and returns the final transformed result (`R`). | O(n) | O(1) |

## Collector Factory Functions

| Function | Description | Time Complexity | Space Complexity |
|----------|-------------|-----------------|------------------|
| `useAnyMatch<E>(predicate: Predicate<E>)` | Creates a short-circuiting `Collector` that returns `true` if **any** element in the stream matches the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useAnyMatch<E>(predicate: BiPredicate<E, bigint>)` | Creates a short-circuiting `Collector` that returns `true` if **any** element (with its index) matches the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useAllMatch<E>(predicate: Predicate<E>)` | Creates a short-circuiting `Collector` that returns `true` if **all** elements in the stream match the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useAllMatch<E>(predicate: BiPredicate<E, bigint>)` | Creates a short-circuiting `Collector` that returns `true` if **all** elements (with their indices) match the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useCollect<E, A, R>(identity, accumulator, finisher)` | Creates a non-short-circuiting `Collector`. Requires a `Supplier<A>` for the identity, a `Bi/TriFunctional` for accumulation, and a `Functional<A, R>` for the final transformation. Returns a `Collector<E, A, R>`. | O(1) | O(1) |
| `useCollect<E, A, R>(identity, interrupt, accumulator, finisher)` | Creates a potentially short-circuiting `Collector`. Requires a `Supplier<A>`, an interrupt predicate (`Predicate<E>`, `BiPredicate<E, bigint>`, or `TriPredicate<E, bigint, A>`), a `Bi/TriFunctional` accumulator, and a `Functional<A, R>` finisher. Returns a `Collector<E, A, R>`. | O(1) | O(1) |
| `useCount<E>()` | Creates a `Collector` that counts the number of elements in a stream. Returns a `Collector<E, bigint, bigint>`. | O(1) | O(1) |
| `useError<E>()` | Creates a `Collector` that concatenates elements (converted to strings with commas) within brackets `[...]` and logs the final string to `console.error`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useError<E>(accumulator)` | Creates a `Collector` that uses a custom `accumulator` function to build an error message string within brackets `[...]` and logs it to `console.error`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useError<E>(prefix, accumulator, suffix)` | Creates a `Collector` that uses a custom `accumulator` and wraps the final message with the given `prefix` and `suffix` strings before logging to `console.error`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useFindAt<E>(index: number)` | Creates a `Collector` that returns an `Optional<E>` containing the element at the specified `index`. For negative indices, it fetches from the end. Returns a `Collector<E, Array<E>, Optional<E>>`. | O(1) | O(n) |
| `useFindAt<E>(index: bigint)` | Creates a `Collector` that returns an `Optional<E>` containing the element at the specified `index` (as `bigint`). For negative indices, it fetches from the end. Returns a `Collector<E, Array<E>, Optional<E>>`. | O(1) | O(n) |
| `useFindFirst<E>()` | Creates a short-circuiting `Collector` that returns an `Optional<E>` containing the **first** element of the stream. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindAny<E>()` | Creates a short-circuiting `Collector` that returns an `Optional<E>` containing a **randomly selected** element from the stream. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindLast<E>()` | Creates a `Collector` that returns an `Optional<E>` containing the **last** element of the stream. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindMaximum<E>()` | Creates a `Collector` that returns an `Optional<E>` containing the **maximum** element according to the default `useCompare` comparator. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindMaximum<E>(comparator)` | Creates a `Collector` that returns an `Optional<E>` containing the **maximum** element according to the provided `comparator` function. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindMinimum<E>()` | Creates a `Collector` that returns an `Optional<E>` containing the **minimum** element according to the default `useCompare` comparator. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useFindMinimum<E>(comparator)` | Creates a `Collector` that returns an `Optional<E>` containing the **minimum** element according to the provided `comparator` function. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useForEach<E>(action: Consumer<E>)` | Creates a `Collector` that performs the given `action` on each element and returns the count of processed elements. Returns a `Collector<E, bigint, bigint>`. | O(1) | O(1) |
| `useForEach<E>(action: BiConsumer<E, bigint>)` | Creates a `Collector` that performs the given `action` on each element (with its index) and returns the count of processed elements. Returns a `Collector<E, bigint, bigint>`. | O(1) | O(1) |
| `useNoneMatch<E>(predicate: Predicate<E>)` | Creates a short-circuiting `Collector` that returns `true` if **no** elements in the stream match the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useNoneMatch<E>(predicate: BiPredicate<E, bigint>)` | Creates a short-circuiting `Collector` that returns `true` if **no** elements (with their indices) match the given `predicate`. Returns a `Collector<E, boolean, boolean>`. | O(1) | O(1) |
| `useGroup<E, K>(classifier: Functional<E, K>)` | Creates a `Collector` that groups stream elements by keys produced by the `classifier` function into a `Map<K, E[]>`.
| `useGroup<E, K>(classifier: BiFunctional<E, bigint, K>)` | Creates a `Collector` that groups stream elements (with their indices) by keys produced by the `classifier` function into a `Map<K, E[]>`.
| `useGroupBy<E, K>(keyExtractor: Functional<E, K>)` | Creates a `Collector` that groups stream elements by keys from the `keyExtractor` into a `Map<K, E[]>` (using elements as values). Returns a `Collector<E, Map<K, E[]>, Map<K, E[]>>`.
| `useGroupBy<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>)` | Creates a `Collector` that groups stream elements. It extracts a key using `keyExtractor` and a value using `valueExtractor`, placing results into a `Map<K, V[]>`.
| `useGroupBy<E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>)` | Creates a `Collector` that groups stream elements (with indices). It extracts a key and a value using the respective extractor functions, placing results into a `Map<K, V[]>`.
| `useJoin<E>()` | Creates a `Collector` that concatenates stream elements (converted to strings) into a single string, formatted as `[element1,element2,...]`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useJoin<E>(delimiter: string)` | Creates a `Collector` that concatenates stream elements into a single string using the specified `delimiter`, formatted within `[...]`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useJoin<E>(prefix: string, delimiter: string, suffix: string)` | Creates a `Collector` that concatenates stream elements into a single string using the `delimiter`, and wraps the result with the given `prefix` and `suffix`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useJoin<E>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string)` | Creates a `Collector` that uses a custom `accumulator` function to build the result string, which is then wrapped with the given `prefix` and `suffix`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useJoin<E>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string)` | Creates a `Collector` that uses a custom `accumulator` function (with index) to build the result string, which is then wrapped with the given `prefix` and `suffix`. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useLog<E>()` | Creates a `Collector` that logs each element to the console and concatenates them into a bracketed string `[...]`, which is also logged. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useLog<E>(accumulator: BiFunctional<string, E, string>)` | Creates a `Collector` that uses a custom `accumulator` to build a log message within brackets `[...]`, which is then logged. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useLog<E>(accumulator: TriFunctional<string, E, bigint, string>)` | Creates a `Collector` that uses a custom `accumulator` (with index) to build a log message within brackets `[...]`, which is then logged. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useLog<E>(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string)` | Creates a `Collector` that uses a custom `accumulator` to build a log message, which is wrapped with the given `prefix` and `suffix` before being logged. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `useLog<E>(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string)` | Creates a `Collector` that uses a custom `accumulator` (with index) to build a log message, which is wrapped with the given `prefix` and `suffix` before being logged. Returns a `Collector<E, string, string>`. | O(1) | O(1) |
| `usePartition<E>(count: bigint)` | Creates a `Collector` that partitions stream elements into a fixed number (`count`) of sub-arrays, distributing elements in a round-robin fashion. Returns a `Collector<E, Array<Array<E>>, Array<Array<E>>>`. | O(1) | O(1) |
| `usePartitionBy<E>(classifier: Functional<E, bigint>)` | Creates a `Collector` that partitions stream elements into sub-arrays based on the index returned by the `classifier` function. Returns a `Collector<E, Array<Array<E>>, Array<Array<E>>>`. | O(1) | O(1) |
| `usePartitionBy<E>(classifier: BiFunctional<E, bigint, bigint>)` | Creates a `Collector` that partitions stream elements (with index) into sub-arrays based on the index returned by the `classifier` function. Returns a `Collector<E, Array<Array<E>>, Array<Array<E>>>`. | O(1) | O(1) |
| `useReduce<E>(accumulator: BiFunctional<E, E, E>)` | Creates a `Collector` that reduces the stream elements using the `accumulator` function, returning an `Optional<E>` containing the result. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useReduce<E>(accumulator: TriFunctional<E, E, bigint, E>)` | Creates a `Collector` that reduces the stream elements (with index) using the `accumulator` function, returning an `Optional<E>` containing the result. Returns a `Collector<E, Optional<E>, Optional<E>>`. | O(1) | O(1) |
| `useReduce<E>(identity: E, accumulator: BiFunctional<E, E, E>)` | Creates a `Collector` that reduces the stream elements using the `accumulator` function and the provided `identity` value as the initial accumulator. Returns a `Collector<E, E, E>`. | O(1) | O(1) |
| `useReduce<E>(identity: E, accumulator: TriFunctional<E, E, bigint, E>)` | Creates a `Collector` that reduces the stream elements (with index) using the `accumulator` function and the provided `identity` value. Returns a `Collector<E, E, E>`. | O(1) | O(1) |
| `useReduce<E, R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>)` | Creates a `Collector` that reduces the stream to a type `R` using the `identity`, `accumulator`, and `finisher` functions. Returns a `Collector<E, R, R>`. | O(1) | O(1) |
| `useReduce<E, R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>)` | Creates a `Collector` that reduces the stream (with index) to a type `R` using the `identity`, `accumulator` (with index), and `finisher` functions. Returns a `Collector<E, R, R>`. | O(1) | O(1) |
| `useToArray<E>()` | Creates a `Collector` that accumulates stream elements into an array. Returns a `Collector<E, E[], E[]>`. | O(1) | O(1) |
| `useToMap<E, K>(keyExtractor: Functional<E, K>)` | Creates a `Collector` that accumulates stream elements into a `Map<K, E>`, using the `keyExtractor` to determine keys. Returns a `Collector<E, Map<K, E>, Map<K, E>>`. | O(1) | O(1) |
| `useToMap<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>)` | Creates a `Collector` that accumulates stream elements into a `Map<K, V>`, using the provided extractor functions for keys and values. Returns a `Collector<E, Map<K, V>, Map<K, V>>`. | O(1) | O(1) |
| `useToMap<E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>)` | Creates a `Collector` that accumulates stream elements (with index) into a `Map<K, V>`, using the provided extractor functions for keys and values. Returns a `Collector<E, Map<K, V>, Map<K, V>>`. | O(1) | O(1) |
| `useToHashMap<E, K>(keyExtractor: Functional<E, K>)` | Creates a `Collector` that accumulates stream elements into a `HashMap<K, E>`, using the `keyExtractor` to determine keys. Returns a `Collector<E, HashMap<K, E>, HashMap<K, E>>`. | O(1) | O(1) |
| `useToHashMap<E, K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>)` | Creates a `Collector` that accumulates stream elements into a `HashMap<K, V>`, using the provided extractor functions for keys and values. Returns a `Collector<E, HashMap<K, V>, HashMap<K, V>>`. | O(1) | O(1) |
| `useToHashMap<E, K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>)` | Creates a `Collector` that accumulates stream elements (with index) into a `HashMap<K, V>`, using the provided extractor functions for keys and values. Returns a `Collector<E, HashMap<K, V>, HashMap<K, V>>`. | O(1) | O(1) |
| `useToSet<E>()` | Creates a `Collector` that accumulates distinct stream elements into a `Set<E>`. Returns a `Collector<E, Set<E>, Set<E>>`. | O(1) | O(1) |
| `useToHashSet<E>()` | Creates a `Collector` that accumulates distinct stream elements into a `HashSet<E>`. Returns a `Collector<E, HashSet<E>, HashSet<E>>`. | O(1) | O(1) |
| `useWrite<E, S = string>(stream: WritableStream<S>)` | Creates a `Collector` that writes each stream element (converted to string) to the provided `WritableStream<S>`. Returns a `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>`. | O(1) | O(1) |
| `useWrite<E, S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>)` | Creates a `Collector` that uses a custom `accumulator` function to write elements to the provided `WritableStream<S>`. Returns a `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>`. | O(1) | O(1) |
| `useWrite<E, S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>)` | Creates a `Collector` that uses a custom `accumulator` function (with index) to write elements to the provided `WritableStream<S>`. Returns a `Collector<E, Promise<WritableStream<S>>, Promise<WritableStream<S>>>`. | O(1) | O(1) |
| `useNumericSummate<E>()` | Creates a `Collector` that sums numeric values from the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, number, number>`. | O(1) | O(1) |
| `useNumericSummate<E>(mapper: Functional<E, number>)` | Creates a `Collector` that sums numeric values from the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, number, number>`. | O(1) | O(1) |
| `useBigIntSummate<E>()` | Creates a `Collector` that sums big integer values from the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, bigint, bigint>`. | O(1) | O(1) |
| `useBigIntSummate<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that sums big integer values from the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, bigint, bigint>`. | O(1) | O(1) |
| `useNumericAverage<E>()` | Creates a `Collector` that calculates the arithmetic mean of numeric values from the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, NumericAverageAccumulator, number>`. | O(1) | O(1) |
| `useNumericAverage<E>(mapper: Functional<E, number>)` | Creates a `Collector` that calculates the arithmetic mean of numeric values from the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, NumericAverageAccumulator, number>`. | O(1) | O(1) |
| `useBigIntAverage<E>()` | Creates a `Collector` that calculates the integer average (floor division) of big integer values from the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, BigIntAverageAccumulator, bigint>`. | O(1) | O(1) |
| `useBigIntAverage<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that calculates the integer average (floor division) of big integer values from the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, BigIntAverageAccumulator, bigint>`. | O(1) | O(1) |
| `useFrequency<E>()` | Creates a `Collector` that counts the frequency of each distinct element in the stream, returning a `Map<E, bigint>`. Returns a `Collector<E, Map<E, bigint>, Map<E, bigint>>`. | O(1) | O(1) |
| `useNumericMode<E>()` | Creates a `Collector` that finds the mode (most frequent value) of numeric values in the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, Map<number, bigint>, number>`. | O(1) | O(1) |
| `useNumericMode<E>(mapper: Functional<E, number>)` | Creates a `Collector` that finds the mode (most frequent value) of numeric values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, Map<number, bigint>, number>`. | O(1) | O(1) |
| `useBigIntMode<E>()` | Creates a `Collector` that finds the mode (most frequent value) of big integer values in the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, Map<bigint, bigint>, bigint>`. | O(1) | O(1) |
| `useBigIntMode<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that finds the mode (most frequent value) of big integer values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, Map<bigint, bigint>, bigint>`. | O(1) | O(1) |
| `useNumericVariance<E>()` | Creates a `Collector` that calculates the population variance of numeric values in the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, VarianceAccumulator, number>`. | O(1) | O(1) |
| `useNumericVariance<E>(mapper: Functional<E, number>)` | Creates a `Collector` that calculates the population variance of numeric values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, VarianceAccumulator, number>`. | O(1) | O(1) |
| `useBigIntVariance<E>()` | Creates a `Collector` that calculates the population variance of big integer values in the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, BigIntVarianceAccumulator, bigint>`. | O(1) | O(1) |
| `useBigIntVariance<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that calculates the population variance of big integer values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, BigIntVarianceAccumulator, bigint>`. | O(1) | O(1) |
| `useNumericStandardDeviation<E>()` | Creates a `Collector` that calculates the population standard deviation of numeric values in the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, StandardDeviationAccumulator, number>`. | O(1) | O(1) |
| `useNumericStandardDeviation<E>(mapper: Functional<E, number>)` | Creates a `Collector` that calculates the population standard deviation of numeric values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, StandardDeviationAccumulator, number>`. | O(1) | O(1) |
| `useBigIntStandardDeviation<E>()` | Creates a `Collector` that calculates the population standard deviation of big integer values in the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, BigIntStandardDeviationAccumulator, bigint>`. | O(1) | O(1) |
| `useBigIntStandardDeviation<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that calculates the population standard deviation of big integer values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, BigIntStandardDeviationAccumulator, bigint>`. | O(1) | O(1) |
| `useNumericMedian<E>()` | Creates a `Collector` that calculates the median of numeric values in the stream, converting each element to a `number` using `useToNumber`. Returns a `Collector<E, number[], number>`. | O(1) | O(1) |
| `useNumericMedian<E>(mapper: Functional<E, number>)` | Creates a `Collector` that calculates the median of numeric values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, number[], number>`. | O(1) | O(1) |
| `useBigIntMedian<E>()` | Creates a `Collector` that calculates the median of big integer values in the stream, converting each element to a `bigint` using `useToBigInt`. Returns a `Collector<E, bigint[], bigint>`. | O(1) | O(1) |
| `useBigIntMedian<E>(mapper: Functional<E, bigint>)` | Creates a `Collector` that calculates the median of big integer values in the stream, converting each element using the provided `mapper` function. Returns a `Collector<E, bigint[], bigint>`. | O(1) | O(1) |
| `useToGeneratorFunction<E>()` | Creates a `Collector` that accumulates stream elements into an array and then returns a standard JavaScript `Generator` function that yields those elements. Returns a `Collector<E, Array<E>, Generator<E, void, undefined>>`. | O(1) | O(1) |
| `useToAsyncGeneratorFunction<E>()` | Creates a `Collector` that accumulates stream elements into an array and then returns a standard JavaScript `AsyncGenerator` function that yields those elements. Returns a `Collector<E, Array<E>, AsyncGenerator<E, void, undefined>>`. | O(1) | O(1) |

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

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `animationFrame(period: number): Semantic<number>` | Creates a `Semantic<number>` that yields the current timestamp (`performance.now()`) approximately every `period` milliseconds, using `requestAnimationFrame` for scheduling. | O(1) | O(1) |
| `animationFrame(period: number, delay: number): Semantic<number>` | Creates a `Semantic<number>` that yields the current timestamp (`performance.now()`) every `period` milliseconds, after an initial `delay`, using `requestAnimationFrame`. | O(1) | O(1) |
| `attribute<T extends object>(target: T): Semantic<Attribute<T>>` | Creates a `Semantic<Attribute<T>>` that traverses the given object `target` and yields each of its key-value pairs as an `Attribute` object (containing `key` and `value`). | O(n) | O(1) |
| `blob(blob: Blob): Semantic<Uint8Array>` | Creates a `Semantic<Uint8Array>` that asynchronously reads the given `Blob` in chunks (default 64KB) and yields each chunk as a `Uint8Array`. | O(1) | O(1) |
| `blob(blob: Blob, chunk: bigint): Semantic<Uint8Array>` | Creates a `Semantic<Uint8Array>` that asynchronously reads the given `Blob` in chunks of the specified `chunk` size (in bytes) and yields each chunk. | O(1) | O(1) |
| `empty<E>(): Semantic<E>` | Creates an empty `Semantic<E>` that yields no elements. | O(1) | O(1) |
| `event<E extends Window>(target: E, key: K): Semantic<V>` | Creates a `Semantic<V>` that listens for the DOM event specified by `key` (e.g., `'click'`) on the `Window` `target` and yields the corresponding event object. | O(1) | O(1) |
| `event<E extends Window>(target: E, key: Iterable<K>): Semantic<V>` | Creates a `Semantic<V>` that listens for multiple DOM events specified by the `Iterable<K>` of keys on the `Window` `target` and yields event objects. | O(1) | O(1) |
| `event<E extends Document>(target: E, key: K): Semantic<V>` | Creates a `Semantic<V>` that listens for the DOM event specified by `key` on the `Document` `target` and yields the event object. | O(1) | O(1) |
| `event<E extends Document>(target: E, key: Iterable<K>): Semantic<V>` | Creates a `Semantic<V>` that listens for multiple DOM events on the `Document` `target` and yields event objects. | O(1) | O(1) |
| `event<E extends HTMLElement>(target: E, key: K): Semantic<V>` | Creates a `Semantic<V>` that listens for the DOM event specified by `key` on the `HTMLElement` `target` and yields the event object. | O(1) | O(1) |
| `event<E extends HTMLElement>(target: E, key: Iterable<K>): Semantic<V>` | Creates a `Semantic<V>` that listens for multiple DOM events on the `HTMLElement` `target` and yields event objects. | O(1) | O(1) |
| `event<E extends HTMLElement>(target: Iterable<E>, key: K): Semantic<V>` | Creates a `Semantic<V>` that listens for the DOM event specified by `key` on each `HTMLElement` in the `Iterable<E>` `target` and yields event objects. | O(1) | O(1) |
| `event<E extends HTMLElement>(target: Iterable<E>, key: Iterable<K>): Semantic<V>` | Creates a `Semantic<V>` that listens for multiple DOM events on each `HTMLElement` in the `Iterable<E>` `target` and yields event objects. | O(1) | O(1) |
| `fill<E>(element: E, count: bigint): Semantic<E>` | Creates a `Semantic<E>` that yields the provided `element` repeatedly, `count` times. | O(1) | O(1) |
| `fill<E>(supplier: Supplier<E>, count: bigint): Semantic<E>` | Creates a `Semantic<E>` that yields values obtained by calling the `supplier` function repeatedly, `count` times. | O(1) | O(1) |
| `from<E>(iterable: Iterable<E>): Semantic<E>` | Creates a `Semantic<E>` that yields each element from the synchronous `Iterable<E>`. | O(1) | O(1) |
| `from<E>(iterable: AsyncIterable<E>): Semantic<E>` | Creates a `Semantic<E>` that asynchronously yields each element from the `AsyncIterable<E>`. | O(1) | O(1) |
| `generate<E>(supplier: Supplier<E>, interrupt: Predicate<E>): Semantic<E>` | Creates a `Semantic<E>` that lazily generates elements by repeatedly calling the `supplier` function. Generation stops when the `interrupt` predicate returns `true` for an element. | O(1) | O(1) |
| `generate<E>(supplier: Supplier<E>, interrupt: BiPredicate<E, bigint>): Semantic<E>` | Creates a `Semantic<E>` that lazily generates elements by repeatedly calling the `supplier` function. Generation stops when the `interrupt` predicate (receiving element and index) returns `true`. | O(1) | O(1) |
| `interval(period: number): Semantic<number>` | Creates a `Semantic<number>` that yields an incrementing count (starting from 0) every `period` milliseconds, using `setInterval`. | O(1) | O(1) |
| `interval(period: number, delay: number): Semantic<number>` | Creates a `Semantic<number>` that yields an incrementing count every `period` milliseconds, after an initial `delay`. | O(1) | O(1) |
| `iterate<E>(generator: Generator<E>): Semantic<E>` | Creates a `Semantic<E>` by directly wrapping an existing `Generator<E>` function. | O(1) | O(1) |
| `promise<T>(promise: Promise<T>): Semantic<T>` | Creates a `Semantic<T>` that yields the resolved value of the provided `Promise<T>`. | O(1) | O(1) |
| `range(start: number, end: number): Semantic<number>` | Creates a `Semantic<number>` that yields a sequence of numbers from `start` (inclusive) to `end` (exclusive), with a default step of `1`. | O(1) | O(1) |
| `range(start: number, end: number, step: number): Semantic<number>` | Creates a `Semantic<number>` that yields a sequence of numbers from `start` to `end` with the specified `step` size. Handles both positive and negative steps. | O(1) | O(1) |
| `websocket(websocket: WebSocket): Semantic<MessageEvent \| CloseEvent \| Event>` | Creates a `Semantic` that listens to the `WebSocket`'s `'open'`, `'message'`, `'error'`, and `'close'` events, yielding the corresponding event objects. | O(1) | O(1) |

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

// Create an event stream.
let windowEventStream = event(window, "resize");
let documentEventStream = event(document, "click");
let elementEventStream = event(element, "input");
let multipleWindowEventStream = event(window, ["resize", "scroll"]);
let multipleDocumentEventStream = event(document, ["click", "keydown"]);
let multipleElementEventStream = event([element1, element2], "input");
let multipleMixedEventStream = event([element1, element2, element3], ["resize", "click"]);

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
| `constructor(generator: Generator<E>)` | Constructs a new `Semantic<E>` instance from the provided generator function. | O(1) | O(1) |
| `concat(other: Semantic<E>): Semantic<E>` | Creates a new `Semantic<E>` that concatenates the elements of this `Semantic` with those of the provided `Semantic<E>` `other`. | O(1) | O(1) |
| `concat(other: Iterable<E>): Semantic<E>` | Creates a new `Semantic<E>` that concatenates the elements of this `Semantic` with those of the provided `Iterable<E>` `other`. | O(1) | O(1) |
| `distinct(): Semantic<E>` | Creates a new `Semantic<E>` that returns distinct elements from this `Semantic`, using the element itself as the key. | O(1) | O(1) |
| `distinct<K>(keyExtractor: Functional<E, K>): Semantic<E>` | Creates a new `Semantic<E>` that returns distinct elements from this `Semantic`, using the key produced by the `keyExtractor` function. | O(1) | O(1) |
| `distinct<K>(keyExtractor: BiFunctional<E, bigint, K>): Semantic<E>` | Creates a new `Semantic<E>` that returns distinct elements from this `Semantic`, using the key produced by the `keyExtractor` function (which also receives the element's index). | O(1) | O(1) |
| `dropWhile(predicate: Predicate<E>): Semantic<E>` | Creates a new `Semantic<E>` that skips the initial elements of this `Semantic` while the `predicate` returns `true`, then yields the remaining elements. | O(1) | O(1) |
| `dropWhile(predicate: BiPredicate<E, bigint>): Semantic<E>` | Creates a new `Semantic<E>` that skips the initial elements (with their indices) while the `predicate` returns `true`, then yields the remaining elements. | O(1) | O(1) |
| `filter(predicate: Predicate<E>): Semantic<E>` | Creates a new `Semantic<E>` that yields only the elements of this `Semantic` that satisfy the given `predicate`. | O(1) | O(1) |
| `filter(predicate: BiPredicate<E, bigint>): Semantic<E>` | Creates a new `Semantic<E>` that yields only the elements (with their indices) of this `Semantic` that satisfy the given `predicate`. | O(1) | O(1) |
| `flat(mapper: Functional<E, Iterable<E>>): Semantic<E>` | Creates a new `Semantic<E>` that maps each element to an `Iterable<E>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flat(mapper: BiFunctional<E, bigint, Iterable<E>>): Semantic<E>` | Creates a new `Semantic<E>` that maps each element (with its index) to an `Iterable<E>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flat(mapper: Functional<E, Semantic<E>>): Semantic<E>` | Creates a new `Semantic<E>` that maps each element to a `Semantic<E>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flat(mapper: BiFunctional<E, bigint, Semantic<E>>): Semantic<E>` | Creates a new `Semantic<E>` that maps each element (with its index) to a `Semantic<E>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flatMap<R>(mapper: Functional<E, Iterable<R>>): Semantic<R>` | Creates a new `Semantic<R>` that maps each element to an `Iterable<R>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flatMap<R>(mapper: BiFunctional<E, bigint, Iterable<R>>): Semantic<R>` | Creates a new `Semantic<R>` that maps each element (with its index) to an `Iterable<R>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flatMap<R>(mapper: Functional<E, Semantic<R>>): Semantic<R>` | Creates a new `Semantic<R>` that maps each element to a `Semantic<R>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `flatMap<R>(mapper: BiFunctional<E, bigint, Semantic<R>>): Semantic<R>` | Creates a new `Semantic<R>` that maps each element (with its index) to a `Semantic<R>` using `mapper`, then flattens and yields the resulting elements. | O(1) | O(1) |
| `limit(n: number): Semantic<E>` | Creates a new `Semantic<E>` that yields at most the first `n` elements (where `n` is a `number`) from this `Semantic`. | O(1) | O(1) |
| `limit(n: bigint): Semantic<E>` | Creates a new `Semantic<E>` that yields at most the first `n` elements (where `n` is a `bigint`) from this `Semantic`. | O(1) | O(1) |
| `map<R>(mapper: Functional<E, R>): Semantic<R>` | Creates a new `Semantic<R>` that yields the results of applying the given `mapper` function to each element of this `Semantic`. | O(1) | O(1) |
| `map<R>(mapper: BiFunctional<E, bigint, R>): Semantic<R>` | Creates a new `Semantic<R>` that yields the results of applying the given `mapper` function (which also receives the index) to each element of this `Semantic`. | O(1) | O(1) |
| `peek(consumer: Consumer<E>): Semantic<E>` | Creates a new `Semantic<E>` that performs the provided `consumer` action on each element as they are consumed from this `Semantic`, then yields the elements unchanged. | O(1) | O(1) |
| `peek(consumer: BiConsumer<E, bigint>): Semantic<E>` | Creates a new `Semantic<E>` that performs the provided `consumer` action (which also receives the index) on each element as they are consumed, then yields the elements unchanged. | O(1) | O(1) |
| `redirect(redirector: BiFunctional<E, bigint, bigint>): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is transformed by the `redirector` function. The elements themselves are unchanged. | O(1) | O(1) |
| `reverse(): Semantic<E>` | Creates a new `Semantic<E>` where the indices of the elements from this `Semantic` are negated (e.g., `0` becomes `-0n`, `1` becomes `-1n`, etc.). | O(1) | O(1) |
| `shuffle(): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is replaced by a hash computed from the element and its original index (using `useHash`). | O(1) | O(1) |
| `shuffle(mapper: BiFunctional<E, bigint, bigint>): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is transformed by the provided `mapper` function (which receives the element and its original index). | O(1) | O(1) |
| `skip(n: number): Semantic<E>` | Creates a new `Semantic<E>` that discards the first `n` elements (where `n` is a `number`) from this `Semantic`, then yields the remaining elements. | O(1) | O(1) |
| `skip(n: bigint): Semantic<E>` | Creates a new `Semantic<E>` that discards the first `n` elements (where `n` is a `bigint`) from this `Semantic`, then yields the remaining elements. | O(1) | O(1) |
| `sorted(): OrderedCollectable<E>` | Creates an `OrderedCollectable<E>` that will yield the elements of this `Semantic` in natural order (using `useCompare` for comparison). | O(1) | O(1) |
| `sorted(comparator: Comparator<E>): OrderedCollectable<E>` | Creates an `OrderedCollectable<E>` that will yield the elements of this `Semantic` sorted according to the provided `comparator` function. | O(1) | O(1) |
| `sub(start: bigint, end: bigint): Semantic<E>` | Creates a new `Semantic<E>` that yields elements from this `Semantic` starting at index `start` (inclusive) up to, but not including, index `end`. | O(1) | O(1) |
| `takeWhile(predicate: Predicate<E>): Semantic<E>` | Creates a new `Semantic<E>` that yields elements from this `Semantic` while the `predicate` returns `true`, then stops. | O(1) | O(1) |
| `takeWhile(predicate: BiPredicate<E, bigint>): Semantic<E>` | Creates a new `Semantic<E>` that yields elements (with their indices) from this `Semantic` while the `predicate` returns `true`, then stops. | O(1) | O(1) |
| `toCollectable(): Collectable<E>` | Creates a `Collectable<E>` from this `Semantic`. This allows terminal collection operations to be performed. | O(1) | O(1) |
| `toCollectable<C extends Collectable<E>>(mapper: Functional<Generator<E>, C>): C` | Creates a `Collectable<E>` from this `Semantic` by applying the provided `mapper` function to its generator. | O(1) | O(1) |
| `toBigintStatistics(): BigIntStatistics<E>` | Creates a `BigIntStatistics<E>` from this `Semantic`, enabling statistical operations on elements as big integers. | O(1) | O(1) |
| `toNumericStatistics(): NumericStatistics<E>` | Creates a `NumericStatistics<E>` from this `Semantic`, enabling statistical operations on elements as numbers. | O(1) | O(1) |
| `toOrdered(): OrderedCollectable<E>` | Creates an `OrderedCollectable<E>` from this `Semantic`. This is an alias for `sorted()`. | O(1) | O(1) |
| `toUnordered(): UnorderedCollectable<E>` | Creates an `UnorderedCollectable<E>` from this `Semantic`. | O(1) | O(1) |
| `toWindow(): WindowCollectable<E>` | Creates a `WindowCollectable<E>` from this `Semantic`. | O(1) | O(1) |
| `translate(offset: number): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is shifted by the specified numeric `offset`. | O(1) | O(1) |
| `translate(offset: bigint): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is shifted by the specified big integer `offset`. | O(1) | O(1) |
| `translate(translator: BiFunctional<E, bigint, bigint>): Semantic<E>` | Creates a new `Semantic<E>` where each element's index is transformed by the provided `translator` function (which receives the element and its original index). | O(1) | O(1) |

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
| `anyMatch(predicate: Predicate<E>): boolean` | Checks if any element in the collectable matches the given `predicate`. Returns `true` if a matching element is found, `false` otherwise. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `allMatch(predicate: Predicate<E>): boolean` | Checks if all elements in the collectable match the given `predicate`. Returns `false` upon the first non-matching element. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(collector: Collector<E, A, R>): R` | Performs a mutable reduction operation on the elements using the provided `Collector`. This is a terminal operation. | O(n) | O(depends on collector) |
| `collect<A, R>(identity: Supplier<A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction using the provided `identity`, `accumulator`, and `finisher` functions. This is a terminal operation. | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction using the provided `identity`, `accumulator` (with index), and `finisher` functions. This is a terminal operation. | O(n) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate, using `identity`, `accumulator`, and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate (with index), using `identity`, `accumulator`, and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: BiFunctional<A, E, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate (with index and accumulator), using `identity`, `accumulator`, and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: Predicate<E>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate, using `identity`, `accumulator` (with index), and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: BiPredicate<E, bigint>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate (with index), using `identity`, `accumulator` (with index), and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `collect<A, R>(identity: Supplier<A>, interruptor: TriPredicate<E, bigint, A>, accumulator: TriFunctional<A, E, bigint, A>, finisher: Functional<A, R>): R` | Performs a mutable reduction with a short-circuiting `interruptor` predicate (with index and accumulator), using `identity`, `accumulator` (with index), and `finisher`. This is a terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `count(): bigint` | Returns the count of elements in the collectable. This is a terminal operation. | O(n) | O(1) |
| `error(): void` | Concatenates elements into a bracketed string (`[...]`) and logs it to `console.error`. This is a terminal operation. | O(n) | O(1) |
| `error(accumulator: BiFunctional<string, E, string>): void` | Builds an error message using the custom `accumulator`, wraps it in brackets, and logs it to `console.error`. This is a terminal operation. | O(n) | O(1) |
| `error(accumulator: TriFunctional<string, E, bigint, string>): void` | Builds an error message using the custom `accumulator` (with index), wraps it in brackets, and logs it to `console.error`. This is a terminal operation. | O(n) | O(1) |
| `error(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void` | Builds an error message using the custom `accumulator`, wraps it with `prefix` and `suffix`, and logs it to `console.error`. This is a terminal operation. | O(n) | O(1) |
| `error(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void` | Builds an error message using the custom `accumulator` (with index), wraps it with `prefix` and `suffix`, and logs it to `console.error`. This is a terminal operation. | O(n) | O(1) |
| `isEmpty(): boolean` | Returns `true` if the collectable contains no elements, otherwise `false`. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `findAny(): Optional<E>` | Returns an `Optional` describing a randomly selected element from the collectable, or an empty `Optional` if it is empty. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `findAt(index: number): Optional<E>` | Returns an `Optional` describing the element at the specified numeric `index`. For negative indices, fetches from the end. This is a terminal operation. | O(n) | O(1) |
| `findAt(index: bigint): Optional<E>` | Returns an `Optional` describing the element at the specified big integer `index`. For negative indices, fetches from the end. This is a terminal operation. | O(n) | O(1) |
| `findFirst(): Optional<E>` | Returns an `Optional` describing the first element of the collectable, or an empty `Optional` if it is empty. This is a short-circuiting terminal operation. | O(1) (average), O(n) (worst) | O(1) |
| `findLast(): Optional<E>` | Returns an `Optional` describing the last element of the collectable, or an empty `Optional` if it is empty. This is a terminal operation. | O(n) | O(1) |
| `findMaximum(): Optional<E>` | Returns an `Optional` describing the maximum element according to the default comparator (`useCompare`), or an empty `Optional` if the collectable is empty. This is a terminal operation. | O(n) | O(1) |
| `findMaximum(comparator: Comparator<E>): Optional<E>` | Returns an `Optional` describing the maximum element according to the provided `comparator`, or an empty `Optional` if the collectable is empty. This is a terminal operation. | O(n) | O(1) |
| `findMinimum(): Optional<E>` | Returns an `Optional` describing the minimum element according to the default comparator (`useCompare`), or an empty `Optional` if the collectable is empty. This is a terminal operation. | O(n) | O(1) |
| `findMinimum(comparator: Comparator<E>): Optional<E>` | Returns an `Optional` describing the minimum element according to the provided `comparator`, or an empty `Optional` if the collectable is empty. This is a terminal operation. | O(n) | O(1) |
| `forEach(action: Consumer<E>): void` | Performs the given `action` on each element. This is a terminal operation. | O(n) | O(1) |
| `forEach(action: BiConsumer<E, bigint>): void` | Performs the given `action` (with index) on each element. This is a terminal operation. | O(n) | O(1) |
| `group<K>(classifier: Functional<E, K>): Map<K, Array<E>>` | Groups elements by the key returned by the `classifier` function, returning a `Map<K, E[]>` where each key maps to a list of its corresponding elements. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `group<K>(classifier: BiFunctional<E, bigint, K>): Map<K, Array<E>>` | Groups elements (with index) by the key returned by the `classifier` function, returning a `Map<K, E[]>` where each key maps to a list of its corresponding elements. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `groupBy<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, Array<V>>` | Groups elements by keys and values extracted by the provided functions, returning a `Map<K, V[]>` where each key maps to a list of its corresponding values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `groupBy<K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, K>): Map<K, Array<V>>` | Groups elements (with index) by keys and values extracted by the provided functions, returning a `Map<K, V[]>` where each key maps to a list of its corresponding values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `join(): string` | Concatenates the elements (converted to strings) into a single string, formatted as `[element1,element2,...]`. This is a terminal operation. | O(n) | O(n) |
| `join(delimiter: string): string` | Concatenates the elements into a single string using the specified `delimiter`, formatted within `[...]`. This is a terminal operation. | O(n) | O(n) |
| `join(prefix: string, delimiter: string, suffix: string): string` | Concatenates the elements into a single string using the `delimiter`, and wraps the result with the given `prefix` and `suffix`. This is a terminal operation. | O(n) | O(n) |
| `join(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): string` | Builds the result string using the custom `accumulator` and wraps it with the given `prefix` and `suffix`. This is a terminal operation. | O(n) | O(n) |
| `join(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): string` | Builds the result string using the custom `accumulator` (with index) and wraps it with the given `prefix` and `suffix`. This is a terminal operation. | O(n) | O(n) |
| `log(): void` | Logs each element and concatenates them into a bracketed string `[...]`, which is also logged. This is a terminal operation. | O(n) | O(1) |
| `log(accumulator: BiFunctional<string, E, string>): void` | Builds a log message using the custom `accumulator`, wraps it in brackets, and logs it. This is a terminal operation. | O(n) | O(1) |
| `log(accumulator: TriFunctional<string, E, bigint, string>): void` | Builds a log message using the custom `accumulator` (with index), wraps it in brackets, and logs it. This is a terminal operation. | O(n) | O(1) |
| `log(prefix: string, accumulator: BiFunctional<string, E, string>, suffix: string): void` | Builds a log message using the custom `accumulator`, wraps it with `prefix` and `suffix`, and logs it. This is a terminal operation. | O(n) | O(1) |
| `log(prefix: string, accumulator: TriFunctional<string, E, bigint, string>, suffix: string): void` | Builds a log message using the custom `accumulator` (with index), wraps it with `prefix` and `suffix`, and logs it. This is a terminal operation. | O(n) | O(1) |
| `nonMatch(predicate: Predicate<E>): boolean` | Returns `true` if no elements in the collectable match the given `predicate`, otherwise `false`. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `nonMatch(predicate: BiPredicate<E, bigint>): boolean` | Returns `true` if no elements (with index) in the collectable match the given `predicate`, otherwise `false`. This is a short-circuiting terminal operation. | O(n) (average), O(n) (worst) | O(1) |
| `partition(count: bigint): Array<Array<E>>` | Partitions elements into a fixed number (`count`) of sub-arrays, distributing elements in a round-robin fashion. Returns an `Array<Array<E>>`. This is a terminal operation. | O(n) | O(k) |
| `partitionBy(classifier: Functional<E, bigint>): Array<Array<E>>` | Partitions elements into sub-arrays based on the index returned by the `classifier` function. Returns an `Array<Array<E>>`. This is a terminal operation. | O(n) | O(k) |
| `partitionBy(classifier: BiFunctional<E, bigint, bigint>): Array<Array<E>>` | Partitions elements (with index) into sub-arrays based on the index returned by the `classifier` function. Returns an `Array<Array<E>>`. This is a terminal operation. | O(n) | O(k) |
| `reduce(accumulator: BiFunctional<E, E, E>): Optional<E>` | Performs a reduction on the elements using the associative `accumulator` function, returning an `Optional<E>`. This is a terminal operation. | O(n) | O(1) |
| `reduce(accumulator: TriFunctional<E, E, bigint, E>): Optional<E>` | Performs a reduction on the elements using the associative `accumulator` function (with index), returning an `Optional<E>`. This is a terminal operation. | O(n) | O(1) |
| `reduce(identity: E, accumulator: BiFunctional<E, E, E>): E` | Performs a reduction on the elements using the provided `identity` and `accumulator` function, returning the reduced value. This is a terminal operation. | O(n) | O(1) |
| `reduce(identity: E, accumulator: TriFunctional<E, E, bigint, E>): E` | Performs a reduction on the elements using the provided `identity` and `accumulator` function (with index), returning the reduced value. This is a terminal operation. | O(n) | O(1) |
| `reduce<R>(identity: R, accumulator: BiFunctional<R, E, R>, finisher: Functional<R, R>): R` | Performs a reduction on the elements to type `R` using the provided `identity`, `accumulator`, and `finisher` functions. This is a terminal operation. | O(n) | O(1) |
| `reduce<R>(identity: R, accumulator: TriFunctional<R, E, bigint, R>, finisher: Functional<R, R>): R` | Performs a reduction on the elements (with index) to type `R` using the provided `identity`, `accumulator` (with index), and `finisher` functions. This is a terminal operation. | O(n) | O(1) |
| `semantic(): Semantic<E>` | Returns a `Semantic<E>` view of this collectable. | O(1) | O(1) |
| `source(): Generator<E>` | (Abstract) Returns the underlying generator function. | O(1) | O(1) |
| `toArray(): Array<E>` | Accumulates the elements into an array. This is a terminal operation. | O(n) | O(n) |
| `toMap<K, V>(keyExtractor: Functional<E, K>): Map<K, V>` | Accumulates elements into a `Map<K, V>` using the `keyExtractor` to determine keys and elements as values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): Map<K, V>` | Accumulates elements into a `Map<K, V>` using the provided extractor functions for keys and values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toMap<K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): Map<K, V>` | Accumulates elements (with index) into a `Map<K, V>` using the provided extractor functions for keys and values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toHashMap<K, V>(keyExtractor: Functional<E, K>): HashMap<K, V>` | Accumulates elements into a `HashMap<K, V>` using the `keyExtractor` to determine keys and elements as values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toHashMap<K, V>(keyExtractor: Functional<E, K>, valueExtractor: Functional<E, V>): HashMap<K, V>` | Accumulates elements into a `HashMap<K, V>` using the provided extractor functions for keys and values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toHashMap<K, V>(keyExtractor: BiFunctional<E, bigint, K>, valueExtractor: BiFunctional<E, bigint, V>): HashMap<K, V>` | Accumulates elements (with index) into a `HashMap<K, V>` using the provided extractor functions for keys and values. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(k) |
| `toSet(): Set<E>` | Accumulates distinct elements into a `Set<E>`. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(n) |
| `toHashSet(): HashSet<E>` | Accumulates distinct elements into a `HashSet<E>`. This is a terminal operation. | O(n) (average), O(n²) (worst) | O(n) |
| `write<S = string>(stream: WritableStream<S>): Promise<WritableStream<S>>` | Writes each element (converted to string) to the provided `WritableStream<S>`. This is a terminal operation. | O(n) | O(1) |
| `write<S = string>(stream: WritableStream<S>, accumulator: BiFunctional<WritableStream<S>, E, WritableStream<S>>): Promise<WritableStream<S>>` | Writes elements to the provided `WritableStream<S>` using the custom `accumulator`. This is a terminal operation. | O(n) | O(1) |
| `write<S = string>(stream: WritableStream<S>, accumulator: TriFunctional<WritableStream<S>, E, bigint, WritableStream<S>>): Promise<WritableStream<S>>` | Writes elements (with index) to the provided `WritableStream<S>` using the custom `accumulator`. This is a terminal operation. | O(n) | O(1) |

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

