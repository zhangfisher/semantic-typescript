# Semantic-TypeScript Stream Processing Framework

## Introduction

Semantic-TypeScript is a modern stream processing library inspired by JavaScript GeneratorFunction, Java Stream, and MySQL Index. The core design philosophy is based on constructing efficient data processing pipelines through data indexing, providing a type-safe, functional-style streaming operation experience for frontend development.

Unlike traditional synchronous processing, Semantic employs an asynchronous processing model. When creating data streams, the timing of terminal data reception depends entirely on when upstream calls the `accept` and `interrupt` callback functions. This design enables the library to elegantly handle real-time data streams, large datasets, and asynchronous data sources.

## Core Features

| Feature | Description | Advantage |
|------|------|------|
| **Type-Safe Generics** | Complete TypeScript type support | Compile-time error detection, better development experience |
| **Functional Programming** | Immutable data structures and pure functions | More predictable code, easier testing and maintenance |
| **Lazy Evaluation** | On-demand computation, performance optimisation | High memory efficiency when processing large datasets |
| **Asynchronous Stream Processing** | Generator-based asynchronous data streams | Suitable for real-time data and event-driven scenarios |
| **Multi-Paradigm Collectors** | Ordered, unordered, statistical collection strategies | Optimal strategy selection based on different scenarios |
| **Statistical Analysis** | Built-in complete statistical calculation functions | Integrated data analysis and reporting generation |

## Performance Considerations

**Important Note**: The following methods sacrifice performance to collect and sort data, resulting in ordered data collections:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

Particularly important to note: `sorted()` and `sorted(comparator)` will override the results of the following methods:
- `redirect(redirector)`
- `translate(translator)` 
- `shuffle(mapper)`

## Factory Methods

### Stream Creation Factories

| Method | Description | Time Complexity | Space Complexity |
|--------|-------------|-----------------|------------------|
| `blob(blob, chunkSize)` | Create stream from Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Create empty stream | O(1) | O(1) |
| `fill<E>(element, count)` | Create filled stream | O(n) | O(1) |
| `from<E>(iterable)` | Create stream from iterable object | O(1) | O(1) |
| `interval(period, delay?)` | Create timed interval stream | O(1)* | O(1) |
| `iterate<E>(generator)` | Create stream from generator | O(1) | O(1) |
| `range(start, end, step)` | Create numeric range stream | O(n) | O(1) |
| `websocket(websocket)` | Create stream from WebSocket | O(1) | O(1) |

```typescript
// Example usage of Semantic factory methods

// Create stream from Blob (chunked reading)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Stream write successful
  .catch(writeFi); // Stream write failed

// Create empty stream that won't execute until concatenated with other streams
empty<string>()
  .toUnordered()
  .join(); //[]

// Create filled stream
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Create time series stream with 2-second initial delay and 5-second execution cycle,
// implemented via timer mechanism, potential timing variations due to system scheduling constraints.
const intervalStream = interval(5000, 2000);

// Create stream from iterable object
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Create range stream
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket event stream
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // Monitor only message events
  .toUnordered() // For events typically unsorted
  .forEach((event)=> receive(event)); // Receive messages
```

### Utility Function Factories

| Method | Signature | Description | Example |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | Validate if value is valid | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | Validate if value is invalid | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | Generic comparison function | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | Pseudorandom number generator | `useRandom(5)` → random number |

**Code Example Supplement:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// Validate data validity
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // Safe call because validate ensures data is not null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("Data invalid"); // Will execute because invalidate detected null
}

// Compare values
const comparison = useCompare("apple", "banana"); // -1

// Generate random number
const randomNum = useRandom(42); // Random number based on seed 42
```

## Core Class Details

### Optional<T> - Safe Null Value Handling

The Optional class provides a functional approach to safely handle values that may be null or undefined.

| Method | Return Type | Description | Time Complexity |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | Filter values satisfying condition | O(1) |
| `get()` | `T` | Get value, throw error if empty | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | Get value or default value | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | Execute action if value exists | O(1) |
| `isEmpty()` | `boolean` | Check if empty | O(1) |
| `isPresent()` | `boolean` | Check if value exists | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | Map and transform value | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Create Optional instance | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | Create nullable Optional | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | Create non-null Optional | O(1) |

**Code Example Supplement:**
```typescript
import { Optional } from 'semantic-typescript';

// Create Optional instance
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// Chain operations
const result = optionalValue
    .filter(val => val.length > 3) // Filter values longer than 3
    .map(val => val.toUpperCase()) // Convert to uppercase
    .getOrDefault("default"); // Get value or default

console.log(result); // "HELLO" or "default"

// Safe operations
optionalValue.ifPresent(val => {
    console.log(`Value exists: ${val}`);
});

// Check status
if (optionalValue.isPresent()) {
    console.log("Has value");
} else if (optionalValue.isEmpty()) {
    console.log("Is empty");
}
```

### Semantic<E> - Lazy Data Stream

Semantic is the core stream processing class, providing rich stream operators.

#### Stream Transformation Operations

| Method | Return Type | Description | Performance Impact |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | Concatenate two streams | O(n+m) |
| `distinct()` | `Semantic<E>` | Remove duplicates (using Set) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | Custom comparator deduplication | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | Discard starting elements satisfying condition | O(n) |
| `filter(predicate)` | `Semantic<E>` | Filter elements | O(n) |
| `flat(mapper)` | `Semantic<E>` | Flatten nested streams | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | Map and flatten | O(n×m) |
| `limit(n)` | `Semantic<E>` | Limit number of elements | O(n) |
| `map(mapper)` | `Semantic<R>` | Map and transform elements | O(n) |
| `peek(consumer)` | `Semantic<E>` | View elements without modification | O(n) |
| `redirect(redirector)` | `Semantic<E>` | Redirect indices | O(n) |
| `reverse()` | `Semantic<E>` | Reverse stream order | O(n) |
| `shuffle()` | `Semantic<E>` | Randomly shuffle order | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | Custom shuffle logic | O(n) |
| `skip(n)` | `Semantic<E>` | Skip first n elements | O(n) |
| `sub(start, end)` | `Semantic<E>` | Get substream | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | Get starting elements satisfying condition | O(n) |
| `translate(offset)` | `Semantic<E>` | Translate indices | O(n) |
| `translate(translator)` | `Semantic<E>` | Custom index transformation | O(n) |

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Stream transformation operation examples
const processedStream = stream
    .filter(x => x % 2 === 0) // Filter even numbers
    .map(x => x * 2) // Multiply each element by 2
    .distinct() // Remove duplicates
    .limit(3) // Limit to first 3 elements
    .peek((val, index) => console.log(`Element ${val} at index ${index}`)); // View elements

// Note: The stream hasn't executed yet, needs conversion to Collectable for terminal operations
```

#### Stream Terminal Operations

| Method | Return Type | Description | Performance Characteristics |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | Convert to ordered collection | Sorting operation, lower performance |
| `toUnordered()` | `UnorderedCollectable<E>` | Convert to unordered collection | Fastest, no sorting |
| `toWindow()` | `WindowCollectable<E>` | Convert to window collection | Sorting operation, lower performance |
| `toNumericStatistics()` | `Statistics<E, number>` | Numerical statistical analysis | Sorting operation, lower performance |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Big integer statistical analysis | Sorting operation, lower performance |
| `sorted()` | `OrderedCollectable<E>` | Natural sorting | Overrides redirection results |
| `sorted(comparator)` | `OrderedCollectable<E>` | Custom sorting | Overrides redirection results |

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// Convert to ordered collection (lower performance)
const ordered = semanticStream.toOrdered();

// Convert to unordered collection (fastest)
const unordered = semanticStream.toUnordered();

// Natural sorting
const sortedNatural = semanticStream.sorted();

// Custom sorting
const sortedCustom = semanticStream.sorted((a, b) => b - a); // Descending sort

// Convert to statistical object
const stats = semanticStream.toNumericStatistics();

// Note: Must call above methods through Semantic instance to get Collectable before using terminal methods
```

### Collector<E, A, R> - Data Collector

Collectors are used to aggregate stream data into specific structures.

| Method | Description | Usage Scenario |
|------|------|----------|
| `collect(generator)` | Execute data collection | Stream terminal operation |
| `static full(identity, accumulator, finisher)` | Create complete collector | Requires complete processing |
| `static shortable(identity, interruptor, accumulator, finisher)` | Create interruptible collector | May terminate early |

**Code Example Supplement:**
```typescript
import { Collector } from 'semantic-typescript';

// Create custom collector
const sumCollector = Collector.full(
    () => 0, // Initial value
    (acc, value) => acc + value, // Accumulator
    result => result // Finisher function
);

// Use collector (requires conversion from Semantic to Collectable first)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - Collectable Data Abstract Class

Provides rich data aggregation and transformation methods. **Note: Must first obtain Collectable instance by calling sorted(), toOrdered() etc. through Semantic instance before using the following methods.**

#### Data Query Operations

| Method | Return Type | Description | Example |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | Whether any element matches | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | Whether all elements match | `allMatch(x => x > 0)` |
| `count()` | `bigint` | Element count statistics | `count()` → `5n` |
| `isEmpty()` | `boolean` | Whether stream is empty | `isEmpty()` |
| `findAny()` | `Optional<E>` | Find any element | `findAny()` |
| `findFirst()` | `Optional<E>` | Find first element | `findFirst()` |
| `findLast()` | `Optional<E>` | Find last element | `findLast()` |

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// Must convert to Collectable before using terminal methods
const collectable = numbers.toUnordered();

// Data query operations
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // Any element
```

#### Data Aggregation Operations

| Method | Return Type | Description | Complexity |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | Group by classifier | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | Group by key-value extractors | O(n) |
| `join()` | `string` | Join as string | O(n) |
| `join(delimiter)` | `string` | Join with delimiter | O(n) |
| `partition(count)` | `E[][]` | Partition by count | O(n) |
| `partitionBy(classifier)` | `E[][]` | Partition by classifier | O(n) |
| `reduce(accumulator)` | `Optional<E>` | Reduction operation | O(n) |
| `reduce(identity, accumulator)` | `E` | Reduction with identity | O(n) |
| `toArray()` | `E[]` | Convert to array | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Convert to Map | O(n) |
| `toSet()` | `Set<E>` | Convert to Set | O(n) |

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// Must convert to Collectable before using aggregation operations
const collectable = people.toUnordered();

// Grouping operations
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// Convert to collections
const array = collectable.toArray(); // Original array
const set = collectable.toSet(); // Set collection
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// Reduction operations
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### Specific Collector Implementations

#### UnorderedCollectable<E>
- **Characteristics**: Fastest collector, no sorting
- **Usage Scenarios**: Order unimportant, maximum performance desired
- **Methods**: Inherits all Collectable methods

#### OrderedCollectable<E> 
- **Characteristics**: Guarantees element order, lower performance
- **Usage Scenarios**: Require sorted results
- **Special Methods**: Inherits all methods, maintains internal sort state

#### WindowCollectable<E>
- **Characteristics**: Supports sliding window operations
- **Usage Scenarios**: Time series data analysis
- **Special Methods**:
  - `slide(size, step)` - Sliding window
  - `tumble(size)` - Tumbling window

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Unordered collector (fastest)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // May maintain original order [1, 2, 3, ...]

// Ordered collector
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // Guaranteed sorted [1, 2, 3, ...]

// Window collector
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // Window size 3, step 2
// Window 1: [1, 2, 3], Window 2: [3, 4, 5], Window 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // Tumbling window size 4
// Window 1: [1, 2, 3, 4], Window 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - Statistical Analysis

Statistical analysis base class providing rich statistical calculation methods. **Note: Must first obtain Statistics instance by calling toNumericStatistics() or toBigIntStatistics() through Semantic instance before using the following methods.**

#### Statistical Calculation Operations

| Method | Return Type | Description | Algorithm Complexity |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | Maximum value | O(n) |
| `minimum()` | `Optional<E>` | Minimum value | O(n) |
| `range()` | `D` | Range (max-min) | O(n) |
| `variance()` | `D` | Variance | O(n) |
| `standardDeviation()` | `D` | Standard deviation | O(n) |
| `mean()` | `D` | Mean value | O(n) |
| `median()` | `D` | Median value | O(n log n) |
| `mode()` | `D` | Mode value | O(n) |
| `frequency()` | `Map<D, bigint>` | Frequency distribution | O(n) |
| `summate()` | `D` | Summation | O(n) |
| `quantile(quantile)` | `D` | Quantile | O(n log n) |
| `interquartileRange()` | `D` | Interquartile range | O(n log n) |
| `skewness()` | `D` | Skewness | O(n) |
| `kurtosis()` | `D` | Kurtosis | O(n) |

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Must convert to statistical object before using statistical methods
const stats = numbers.toNumericStatistics();

// Basic statistics
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// Advanced statistics
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // Any value (since all appear once)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// Frequency distribution
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### Specific Statistical Implementation Classes

**NumericStatistics<E>**
- Handles number type statistical analysis
- All statistical calculations return number type

**BigIntStatistics<E>**  
- Handles bigint type statistical analysis
- All statistical calculations return bigint type

**Code Example Supplement:**
```typescript
import { from } from 'semantic-typescript';

// Numerical statistics
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Big integer statistics
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// Statistics using mapper functions
const objectData = from([
    { value: 15 },
    { value: 25 }, 
    { value: 35 },
    { value: 45 }
]);

const objectStats = objectData.toNumericStatistics();
const meanWithMapper = objectStats.mean(obj => obj.value); // 30
const sumWithMapper = objectStats.summate(obj => obj.value); // 120
```

## Complete Usage Example

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. Create data stream
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. Stream processing pipeline
const processedStream = semanticStream
    .filter(val => validate(val)) // Filter out null and undefined
    .map(val => val! * 2) // Multiply each value by 2 (using ! because validate ensures not empty)
    .distinct(); // Remove duplicates

// 3. Convert to Collectable and use terminal operations
const collectable = processedStream.toUnordered();

// 4. Data validation and usage
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // Filter again
        .toArray(); // Convert to array
    
    console.log("Processing results:", results); // [16, 18, 14, 8, 12]
    
    // Statistical information
    const stats = processedStream.toNumericStatistics();
    console.log("Mean value:", stats.mean()); // 11.2
    console.log("Total sum:", stats.summate()); // 56
}

// 5. Handle potentially invalid data
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("Valid data:", validData); // [1, 3, 4]
console.log("Invalid data:", invalidData); // [null, null]
```

## Important Usage Rules Summary

1. **Create Stream**: Use `from()`, `range()`, `fill()` etc. factory methods to create Semantic instances
2. **Stream Transformation**: Call `map()`, `filter()`, `distinct()` etc. methods on Semantic instances
3. **Convert to Collectable**: Must call one of the following methods through Semantic instance:
   - `toOrdered()` - Ordered collector
   - `toUnordered()` - Unordered collector (fastest)
   - `toWindow()` - Window collector  
   - `toNumericStatistics()` - Numerical statistics
   - `toBigIntStatistics()` - Big integer statistics
   - `sorted()` - Natural sorting
   - `sorted(comparator)` - Custom sorting
4. **Terminal Operations**: Call `toArray()`, `count()`, `summate()` etc. terminal methods on Collectable instances
5. **Data Validation**: Use `validate()` to ensure data is not null/undefined, use `invalidate()` to check invalid data

This design ensures type safety and performance optimisation while providing rich stream processing functionality.