# **Semantic-TypeScript**
**流，索引化。** 您的数据，尽在掌控。

---

### 概述

Semantic-TypeScript 是流处理技术的一次重大飞跃，它**集大成**了 JavaScript `GeneratorFunction`、Java Streams 和 MySQL 式索引中最有效的概念。其核心理念既简单又强大：通过智能索引而非暴力迭代，来构建高效的数据处理管道。

当传统库强制使用同步循环或笨拙的 Promise 链时，Semantic-TypeScript 提供了一种**完全异步**、函数式纯粹且类型安全的体验，专为现代前端开发的需求而设计。

在其优雅的模型中，数据仅在上游管道显式调用 `accept`（以及可选的 `interrupt`）回调时才会抵达消费者。您完全掌控时机——就在您需要的时候。

---

### 开发者为何青睐它

-   **零样板索引** — 每个元素都携带其自然或自定义索引。
-   **函数式纯粹风格** — 具备完整的 TypeScript 类型推断。
-   **防泄漏事件流** — `useWindow`、`useDocument`、`useHTMLElement` 和 `useWebSocket` 在设计时就考虑了安全性。您通过 `limit(n)`、`sub(start, end)` 或 `takeWhile(predicate)` 定义边界，库则负责清理。没有残留的监听器，没有内存泄漏。
-   **开箱即用的统计** — 全面的数值和 bigint 分析，包括平均值、中位数、众数、方差、偏度和峰度。
-   **可预测的性能** — 根据需求在有序和无序收集器之间选择。
-   **内存高效** — 流采用惰性求值，无需担心内存问题。
-   **无未定义行为** — TypeScript 保证类型安全和可空性。除非在回调函数中显式修改，否则输入数据保持不变。

---

### 安装

```bash
npm install semantic-typescript
```
或
```bash
yarn add semantic-typescript
```

---

### 快速开始

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// 数值统计
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // 终结操作前必需
  .summate();             // 200

// Bigint 统计
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // 终结操作前必需
  .summate();             // 200n

// 通过索引反转流
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // 负索引以实现反转
  .toOrdered() // 调用 toOrdered() 以保持索引顺序
  .toArray(); // [5, 4, 3, 2, 1]

// 打乱流
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // 例如：[2, 5, 1, 4, 3]

// 在流内平移元素
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // 将元素向右移动 2 位
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // 将元素向左移动 2 位
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// 无限范围与提前终止
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // 在 10 个元素后停止
  .toUnordered()
  .toArray();

// 实时窗口大小调整（5 次事件后自动停止）
useWindow("resize")
  .limit(5n)          // 对事件流至关重要
  .toUnordered()
  .forEach((ev, idx) => console.log(`调整大小 #${idx}`));

// 监听 HTML 元素
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 监听多个元素和事件
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 监听 WebSocket
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // 需手动管理 WebSocket 生命周期
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// 按码点迭代字符串
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // 输出字符串

// 安全地字符串化包含循环引用的对象
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // 循环引用
};
// let text: string = JSON.stringify(o); // 抛出错误
let text: string = useStringify(o); // 安全地生成 `{a: 1, b: "text", c: []}`
```

---

### 核心概念

| 概念 | 目的 | 何时使用 |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | 用于异步流、事件和惰性管道的核心构建器。 | 实时事件、WebSocket、DOM 监听器、长时间运行或无限流。 |
| `SynchronousSemantic` | 用于同步、内存中或基于循环的流的构建器。 | 静态数据、范围、立即迭代。 |
| `toUnordered()` | 最快的终结收集器（基于 Map 的索引）。 | 性能关键路径（O(n) 时间与空间，无排序）。 |
| `toOrdered()` | 有序的、索引稳定的收集器。 | 当需要稳定排序或索引访问时。 |
| `toNumericStatistics()` | 丰富的数值统计分析（均值、中位数、方差、偏度、峰度等）。 | 数据分析和统计计算。 |
| `toBigIntStatistics()` | 丰富的 bigint 统计分析。 | 针对大整数的数据分析和统计计算。 |
| `toWindow()` | 滑动和滚动窗口支持。 | 时间序列处理、批处理和窗口化操作。 |

---

**重要使用规则**

1.  **事件流**（`useWindow`、`useDocument`、`useHTMLElement`、`useWebSocket`……）返回一个 `AsynchronousSemantic`。
    → 您**必须**调用 `.limit(n)`、`.sub(start, end)` 或 `.takeWhile()` 来停止监听。否则，监听器将保持活动状态。

2.  **终结操作**（`.toArray()`、`.count()`、`.average()`、`.reduce()`、`.findFirst()` 等）**仅在**转换为收集器**之后**可用：
    ```typescript
    .toUnordered()   // O(n) 时间与空间，无排序
    // 或
    .toOrdered()     // 已排序，保持顺序
    ```

---

### 性能特征

| 收集器 | 时间复杂度 | 空间复杂度 | 是否排序？ | 最佳适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | 否 | 追求原始速度，顺序不重要时。 |
| `toOrdered()` | O(2n) | O(n) | 是 | 需要稳定排序、索引访问或分析时。 |
| `toNumericStatistics()` | O(2n) | O(n) | 是 | 需要排序数据的统计操作。 |
| `toBigIntStatistics()` | O(2n) | O(n) | 是 | 针对 bigint 的统计操作。 |
| `toWindow()` | O(2n) | O(n) | 是 | 基于时间的窗口化操作。 |

当速度至上时，选择 `toUnordered()`。仅当您需要稳定排序或依赖于排序数据的统计方法时，才使用 `toOrdered()`。

---

**与其他前端流处理器的对比**

| 特性 | Semantic-TypeScript | RxJS | 原生 Async Iterators / Generators | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| **TypeScript 集成** | 一流的深度类型支持，具备原生索引感知。 | 优秀，但涉及复杂的泛型。 | 良好，需要手动类型标注。 | 强大，函数式优先风格。 |
| **内置统计分析** | 对 `number` 和 `bigint` 的全面原生支持。 | 非原生支持（需要自定义操作符）。 | 无。 | 无。 |
| **索引与位置感知** | 原生、强大的每个元素 bigint 索引。 | 需要自定义操作符（`scan`、`withLatestFrom`）。 | 需要手动计数器。 | 基础，无内置索引。 |
| **事件流管理** | 专用的、类型安全的工厂函数，具备显式的提前停止控制。 | 强大但需要手动管理订阅。 | 手动事件监听器 + 取消。 | 良好的 `fromEvent`，轻量。 |
| **性能与内存效率** | 卓越——优化的 `toUnordered()` 和 `toOrdered()` 收集器。 | 非常好，但操作符链会带来开销。 | 优秀（零开销）。 | 优秀。 |
| **包体积** | 非常轻量。 | 较大（即使进行 Tree Shaking）。 | 零（原生）。 | 小。 |
| **API 设计理念** | 函数式收集器模式，具有显式索引。 | 响应式 Observable 模式。 | 迭代器 / 生成器模式。 | 函数式，无点风格。 |
| **提前终止与控制** | 显式（`interrupt`、`.limit()`、`.takeWhile()`、`.sub()`）。 | 良好（`take`、`takeUntil`、`first`）。 | 手动（在 `for await…of` 中使用 `break`）。 | 良好（`take`、`until`）。 |
| **同步与异步支持** | 统一的 API——对两者都提供一流支持。 | 主要是异步。 | 两者都支持，但需手动处理。 | 主要是异步。 |
| **学习曲线** | 对于熟悉函数式和索引管道的开发者来说很平缓。 | 较陡峭（众多操作符、热/冷 Observable）。 | 低。 | 中等。 |

**Semantic-TypeScript 的主要优势**

*   独特的内置统计和索引功能，无需手动 `reduce` 或外部库。
*   对事件流的显式控制，防止了 RxJS 中常见的内存泄漏。
*   统一的同步/异步设计，为多样化的用例提供了单一、一致的 API。

此对比说明了为何 Semantic-TypeScript 特别适合那些需要高性能、类型安全和丰富分析功能，而又不希望陷入传统响应式库繁琐仪式感的现代 TypeScript 前端应用。

---

### 准备探索？

Semantic-TypeScript 将复杂的数据流转化为可读、可组合且高性能的管道。无论您是处理实时 UI 事件、处理大型数据集还是构建分析仪表板，它都能提供数据库级索引的强大功能与函数式编程的优雅。

**下一步：**

*   在您的 IDE 中浏览完整的类型化 API（所有导出均来自主包）。
*   加入不断壮大的开发者社区，他们已用清晰的 Semantic 管道取代了复杂的异步迭代器。

**Semantic-TypeScript** — 流与结构的交汇点。

立即开始构建，体验精心设计的索引所带来的不同。

**构建清晰，运行自信，让数据流转尽在掌控。**