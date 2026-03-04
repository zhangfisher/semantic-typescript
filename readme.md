**Semantic-TypeScript**  
*Elegant, type-safe, asynchronous stream processing for the modern web*

---

### Overview

Semantic-TypeScript represents a significant advancement in stream processing technology, **synthesising** the most effective concepts from JavaScript `GeneratorFunction`, Java Streams, and MySQL-style indexing. Its core philosophy is simple yet powerful: build exceptionally efficient data-processing pipelines through sophisticated indexing rather than brute-force iteration.

Where traditional libraries force synchronous loops or awkward promise chains, Semantic-TypeScript delivers a **fully asynchronous**, functionally pure, and rigorously type-safe experience designed specifically for contemporary front-end development.

In its elegant asynchronous model, data only arrives at the consumer when the upstream pipeline explicitly calls the `accept` (and optionally `interrupt`) callbacks. The timing is entirely under your control — exactly when you need it.

---

### Why Developers Love It

- **Zero boilerplate indexing** — every element carries its natural or custom index  
- **Pure functional style** with full TypeScript inference  
- **Event streams that don’t leak** — `useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket` etc.  
- **Statistics out of the box** — numeric and bigint averages, medians, modes, variance, skewness, kurtosis…  
- **Performance you can reason about** — choose ordered or unordered collectors depending on your needs  

---

### Installation

```bash
npm install semantic-typescript
```  
or  
```bash
yarn add semantic-typescript
```  

---

### Quick Start

```ts
import { useOf, useRange, useWindow } from "semantic-typescript";

// Simple in-memory stream
const numbers = useOf(10, 20, 30, 40)
  .map(n => n * 2)
  .toUnordered()                    // ← required before terminal ops
  .summate();                       // 200n

// Infinite range with early termination
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)                       // stop after 10 elements
  .toUnordered()
  .toArray();

// Real-time window resize (automatically stops after 5 events)
useWindow("resize")
  .limit(5n)                        // ← critical for event streams!
  .toUnordered()
  .forEach((ev, idx) => console.log(`Resize #${idx}`));
```  

---

### Core Concepts

| Concept                                      | Purpose                                                      | When to use                                          |
|----------------------------------------------|--------------------------------------------------------------|------------------------------------------------------|
| `AsynchronousSemantic`                       | Core builder for asynchronous streams, events and lazy pipelines | Real-time events, WebSocket, DOM listeners, long-running or infinite streams |
| `SynchronousSemantic`                        | Builder for synchronous, in-memory or loop-based streams     | Static data, ranges, immediate loops                 |
| `.toUnordered()`                             | Fastest terminal collector (Map-based indexing)              | Performance-critical paths (O(n) time & space, no sorting) |
| `.toOrdered()`                               | Sorted, index-stable collector                               | When stable ordering or indexed access is required   |
| `.toNumericStatistics()` / `.toBigIntStatistics()` | Rich statistical analysis (mean, median, variance, skewness, kurtosis, etc.) | Data analytics and statistical computations          |
| `.toWindow()`                                | Sliding and tumbling window support                          | Time-series processing, batching and windowed operations |

---

**Important usage rules**

1. **Event streams** (`useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`, …) return an `AsynchronousSemantic`.  
   → You **must** call `.limit(n)`, `.sub(start, end)`, or `.takeWhile()` to stop listening, otherwise the listener remains active.

2. **Terminal operations** (`.toArray()`, `.count()`, `.average()`, `.reduce()`, `.findFirst()` etc.) are **only available after** converting to a collectable:
   ```ts
   .toUnordered()   // O(n) time & space, no sorting
   // or
   .toOrdered()     // sorted, ~2× O(n) time
   ```

---

### Performance Notes

| Collector               | Extra time | Extra space | Sorting? | Best for |
|-------------------------|------------|-------------|----------|----------|
| `toUnordered()`         | O(n)       | O(n)        | No       | Speed |
| `toOrdered()` / Statistics / Window | ~2× O(n)   | O(n)        | Yes      | Order & analytics |

Choose `toUnordered()` whenever raw speed matters; switch to `toOrdered()` only when you need stable ordering or statistical methods that rely on sorted data.

---

### Ready to Explore?

Semantic-TypeScript turns complex data flows into readable, composable, and lightning-fast pipelines. Whether you are handling real-time UI events, processing large datasets, or building analytics dashboards, the library gives you the power of database-grade indexing with the elegance of functional programming.

**Next steps:**

- Browse the full typed API in your IDE (everything is exported from the main package)
- Try the interactive examples in the `examples/` folder
- Join the growing community of developers who have replaced messy async iterators with clean Semantic pipelines

**Semantic-TypeScript** — where streams meet structure.

Start building today and experience the difference that thoughtful indexing makes.  

Happy streaming! 🚀