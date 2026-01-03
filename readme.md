# 📘 semantic-typescript

A powerful, type-safe utility library for **semantic data processing** in TypeScript.  
Provides composable, functional-style constructs for working with collections, streams, and sequences — with support for sorting, filtering, grouping, statistics, and more.

Whether you're processing **ordered or unordered data**, performing **statistical analysis**, or simply **chaining operations fluently**, this library has you covered.

---

## 🧩 Features

- ✅ **Type-safe generics** throughout
- ✅ **Functional programming** style (map, filter, reduce, etc.)
- ✅ **Semantic data streams** (`Semantic<E>`) for lazy evaluation
- ✅ **Collectors** for transforming streams into concrete structures
- ✅ **Ordered & Unordered Collectables** — with `toUnordered()` being the **fastest** (no sorting)
- ✅ **Sorting support** via `sorted()`, `toOrdered()`, comparators
- ✅ **Statistical analysis** (`Statistics`, `NumericStatistics`, `BigIntStatistics`)
- ✅ **Optional<T>** monad for safe nullable handling
- ✅ **Iterators & Generators** based design — suitable for large or asynchronous data

---

## 📦 Installation

```bash
npm install semantic-typescript
```

---

## 🧠 Core Concepts

### 1. `Optional<T>` – Safe Nullable Handling

A monadic container for values that may be `null` or `undefined`.

#### Methods:

| Method         | Description                                      | Example |
|----------------|--------------------------------------------------|---------|
| `of(value)`    | Wrap a value (may be nullish)                    | `Optional.of(null)` |
| `ofNullable(v)`| Wrap, allowing nullish values                    | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | Wrap, throws if null/undefined                   | `Optional.ofNonNull(5)` |
| `get()`        | Retrieve value or throw if empty                 | `opt.get()` |
| `getOrDefault(d)`| Retrieve value or default                       | `opt.getOrDefault(0)` |
| `ifPresent(fn)`| Execute side-effect if present                    | `opt.ifPresent(x => console.log(x))` |
| `map(fn)`      | Transform value if present                       | `opt.map(x => x + 1)` |
| `filter(fn)`   | Retain value only if predicate passes            | `opt.filter(x => x > 0)` |
| `isEmpty()`    | Check if empty                                   | `opt.isEmpty()` |
| `isPresent()`  | Check if contains a value                        | `opt.isPresent()` |

#### Example:

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 or 0
```

---

### 2. `Semantic<E>` – Lazy Data Stream

A **lazy, composable sequence** of elements. Resembles functional streams such as Java Streams or Kotlin Sequences.

Create a `Semantic` using helpers like `from()`, `range()`, `iterate()`, or `fill()`.

#### Creators:

| Function       | Description                                  | Example |
|----------------|----------------------------------------------|---------|
| `from(iterable)` | Create from Array/Set/Iterable               | `from([1, 2, 3])` |
| `range(start, end, step?)` | Generate number range                | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | Repeat an element N times                 | `fill('a', 3n)` |
| `iterate(gen)`   | Use a custom generator function              | `iterate(genFn)` |

#### Common Operators:

| Method             | Description                                       | Example |
|--------------------|---------------------------------------------------|---------|
| `map(fn)`          | Transform each element                            | `.map(x => x * 2)` |
| `filter(fn)`       | Retain elements passing predicate                 | `.filter(x => x > 10)` |
| `limit(n)`         | Limit to first N elements                         | `.limit(5)` |
| `skip(n)`          | Skip first N elements                             | `.skip(2)` |
| `distinct()`       | Remove duplicates (uses Set by default)           | `.distinct()` |
| `sorted()`         | Sort elements (natural ordering)                  | `.sorted()` |
| `sorted(comparator)`| Custom sorting                                   | `.sorted((a, b) => a - b)` |
| `toOrdered()`      | Sort and return `OrderedCollectable`              | `.toOrdered()` |
| `toUnordered()`    | **No sorting** – fastest possible collectable     | `.toUnordered()` ✅ |
| `collect(collector)`| Aggregate using a `Collector`                     | `.collect(Collector.full(...))` |
| `toArray()`        | Convert to Array                                  | `.toArray()` |
| `toSet()`          | Convert to Set                                    | `.toSet()` |
| `toMap(keyFn, valFn)`| Convert to Map                                 | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` – 🚀 Fastest, No Sorting

If you **do not require ordering** and seek the **fastest possible performance**, use:

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **No sorting algorithm is applied.**  
Ideal when order is irrelevant and maximum speed is desired.

---

### 4. `toOrdered()` and `sorted()` – Sorted Output

If you need **sorted output**, use:

```typescript
const ordered = semanticStream.sorted(); // Natural ordering
const customSorted = semanticStream.sorted((a, b) => a - b); // Custom comparator
const orderedCollectable = semanticStream.toOrdered(); // Also sorted
```

⚠️ These methods **will sort** the elements using either natural or provided comparator.

---

### 5. `Collector<E, A, R>` – Aggregate Data

Collectors enable you to **reduce streams into single or complex structures**.

Built-in static factories:

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

Typically used via higher-level helpers on `Collectable` classes.

---

### 6. `Collectable<E>` (Abstract)

Base class for:

- `OrderedCollectable<E>` – Sorted output
- `UnorderedCollectable<E>` – No sorting, fastest
- `WindowCollectable<E>` – Sliding windows
- `Statistics<E, D>` – Statistical aggregations

#### Common Methods (via inheritance):

| Method         | Description                              | Example |
|----------------|------------------------------------------|---------|
| `count()`      | Count elements                           | `.count()` |
| `toArray()`    | Convert to Array                         | `.toArray()` |
| `toSet()`      | Convert to Set                           | `.toSet()` |
| `toMap(k, v)`  | Convert to Map                           | `.toMap(x => x.id, x => x)` |
| `group(k)`     | Group by key                             | `.group(x => x.category)` |
| `findAny()`    | Any matching element (Optional)          | `.findAny()` |
| `findFirst()`  | First element (Optional)                 | `.findFirst()` |
| `reduce(...)`  | Custom reduction                         | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` – Sorted Data

If you require elements to be **automatically sorted**, use this.

Accepts a **custom comparator** or uses natural order.

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **Sorted output is guaranteed.**

---

### 8. `UnorderedCollectable<E>` – No Sorting (🚀 Fastest)

If you **do not require ordering** and seek the **fastest performance**, use:

```typescript
const unordered = new UnorderedCollectable(stream);
// OR
const fastest = semanticStream.toUnordered();
```

✅ **No sorting algorithm executed**  
✅ **Best performance** when order is irrelevant

---

### 9. `Statistics<E, D>` – Statistical Analysis

Abstract base for analysing numeric data.

#### Subclasses:

- `NumericStatistics<E>` – For `number` values
- `BigIntStatistics<E>` – For `bigint` values

##### Common statistical methods:

| Method            | Description                          | Example |
|-------------------|--------------------------------------|---------|
| `mean()`          | Arithmetic mean                      | `.mean()` |
| `median()`        | Median value                         | `.median()` |
| `mode()`          | Most frequent value                  | `.mode()` |
| `minimum()`       | Smallest element                     | `.minimum()` |
| `maximum()`       | Largest element                      | `.maximum()` |
| `range()`         | Maximum − Minimum                    | `.range()` |
| `variance()`      | Variance                             | `.variance()` |
| `standardDeviation()` | Standard deviation               | `.standardDeviation()` |
| `summate()`       | Sum of elements                      | `.summate()` |
| `quantile(q)`     | Value at q-th percentile (0–1)       | `.quantile(0.5)` → median |
| `frequency()`     | Frequency map                        | `.frequency()` |

---

## 🧪 Full Example

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// Sample data
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 Fastest: no sorting
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // e.g. [10, 2, 8, 4, 5, 6] (original order)

// 🔢 Naturally sorted
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 Perform statistical analysis
const stats = new NumericStatistics(numbers);
console.log('Mean:', stats.mean());
console.log('Median:', stats.median());
console.log('Mode:', stats.mode());
console.log('Range:', stats.range());
console.log('Standard Deviation:', stats.standardDeviation());
```

---

## 🛠️ Utility Functions

The library also exports numerous **type guards** and **comparison utilities**:

| Function         | Purpose                          |
|------------------|----------------------------------|
| `isString(x)`    | Type guard for `string`          |
| `isNumber(x)`    | Type guard for `number`          |
| `isBoolean(x)`   | Type guard for `boolean`         |
| `isIterable(x)`  | Checks if object is iterable     |
| `useCompare(a, b)`| Universal comparison function     |
| `useRandom(x)`   | Pseudo-random generator (fun)    |

---

## 🧩 Advanced: Custom Generators & Windows

You may create custom **generators** for infinite or controlled data streams:

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

Or employ **sliding windows**:

```typescript
const windowed = ordered.slide(3n, 2n); // windows of 3, stepping by 2
```

---

## 📄 License

This project is licensed under the **MIT License** – free for commercial and personal use.

---

## 🙌 Contributing

Pull requests, issues, and suggestions are most welcome!

---

## 🚀 Quick Start Summary

| Task | Method |
|------|--------|
| Safely handle nulls | `Optional<T>` |
| Create a stream | `from([...])`, `range()`, `fill()` |
| Transform data | `map()`, `filter()` |
| Sort data | `sorted()`, `toOrdered()` |
| No sort (fastest) | `toUnordered()` ✅ |
| Group / aggregate | `toMap()`, `group()`, `Collector` |
| Statistics | `NumericStatistics`, `mean()`, `median()`, etc. |

---

## 🔗 Links

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 Documentation: See source code / type definitions

---

**Enjoy composable, type-safe, functional data processing in TypeScript.** 🚀

--- 

✅ **Remember:**  
- `toUnordered()` → **No sort, fastest**  
- All others (e.g. `sorted()`, `toOrdered()`) → **Sort data**