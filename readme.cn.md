# 📘 semantic-typescript

一个强大、类型安全的 TypeScript 工具库，用于**语义化数据处理**。  
提供可组合的函数式风格构造，用于处理集合、流和序列 —— 支持排序、过滤、分组、统计分析等功能。

无论您是在处理**有序或无序数据**、进行**统计分析**，还是仅仅想要**流畅地链式操作**，本库都能满足您的需求。

---

## 🧩 特性

- ✅ 全程**类型安全泛型**
- ✅ **函数式编程**风格（map、filter、reduce 等）
- ✅ **语义数据流**（`Semantic<E>`）支持惰性求值
- ✅ **收集器**用于将流转换为具体结构
- ✅ **有序与无序收集器** —— `toUnordered()` **不排序，最快**！其他收集器会排序
- ✅ **排序支持**通过 `sorted()`、`toOrdered()`、比较器
- ✅ **统计分析**（`Statistics`、`NumericStatistics`、`BigIntStatistics`）
- ✅ **Optional<T>** 单体模式，安全处理可空值
- ✅ 基于**迭代器与生成器**的设计 —— 适用于大型/异步数据

---

## 📦 安装

```bash
npm install semantic-typescript
```

---

## 🧠 核心概念

### 1. `Optional<T>` – 安全的可空值处理

用于包装可能为 `null` 或 `undefined` 的值的单体制容器。

#### 方法：

| 方法 | 说明 | 示例 |
|------|------|------|
| `of(value)` | 包装值（可为空） | `Optional.of(null)` |
| `ofNullable(v)` | 包装，允许空值 | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | 包装，若为 null/undefined 则抛出 | `Optional.ofNonNull(5)` |
| `get()` | 获取值，空则抛出 | `opt.get()` |
| `getOrDefault(d)` | 获取值或默认值 | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | 若存在则执行副作用 | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | 若存在则转换值 | `opt.map(x => x + 1)` |
| `filter(fn)` | 仅保留满足谓词的值 | `opt.filter(x => x > 0)` |
| `isEmpty()` | 检查是否为空 | `opt.isEmpty()` |
| `isPresent()` | 检查是否有值 | `opt.isPresent()` |

#### 示例：

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 或 0
```

---

### 2. `Semantic<E>` – 惰性数据流

一个**惰性、可组合的序列**元素。类似于 Java Streams 或 Kotlin Sequences 的函数式流。

您可以使用 `from()`、`range()`、`iterate()` 或 `fill()` 等辅助函数创建 `Semantic`。

#### 创建方法：

| 函数 | 说明 | 示例 |
|------|------|------|
| `from(iterable)` | 从 Array/Set/Iterable 创建 | `from([1, 2, 3])` |
| `range(start, end, step?)` | 生成数字范围 | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | 重复元素 N 次 | `fill('a', 3n)` |
| `iterate(gen)` | 使用自定义生成器函数 | `iterate(genFn)` |

#### 常用操作符：

| 方法 | 说明 | 示例 |
|------|------|------|
| `map(fn)` | 转换每个元素 | `.map(x => x * 2)` |
| `filter(fn)` | 保留满足谓词的元素 | `.filter(x => x > 10)` |
| `limit(n)` | 限制前 N 个元素 | `.limit(5)` |
| `skip(n)` | 跳过前 N 个元素 | `.skip(2)` |
| `distinct()` | 去重（默认使用 Set） | `.distinct()` |
| `sorted()` | 排序元素（需自然排序） | `.sorted()` |
| `sorted(comparator)` | 自定义排序 | `.sorted((a,b) => a - b)` |
| `toOrdered()` | 排序并返回 OrderedCollectable | `.toOrdered()` |
| `toUnordered()` | **不排序** – 最快的收集器 | `.toUnordered()` ✅ |
| `collect(collector)` | 使用收集器聚合 | `.collect(Collector.full(...))` |
| `toArray()` | 转换为数组 | `.toArray()` |
| `toSet()` | 转换为 Set | `.toSet()` |
| `toMap(keyFn, valFn)` | 转换为 Map | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` – 🚀 最快，不排序

如果您**不关心顺序**且希望获得**最佳性能**，请使用：

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **不应用任何排序算法。**  
当顺序无关紧要且您需要最大速度时，请使用此方法。

---

### 4. `toOrdered()` 和 `sorted()` – 排序输出

如果您需要**排序输出**，请使用：

```typescript
const ordered = semanticStream.sorted(); // 自然排序
const customSorted = semanticStream.sorted((a, b) => a - b); // 自定义比较器
const orderedCollectable = semanticStream.toOrdered(); // 同样排序
```

⚠️ 这些方法**会对元素进行排序**，使用自然排序或提供的比较器。

---

### 5. `Collector<E, A, R>` – 数据聚合

收集器让您能够将流**缩减为单个或复杂结构**。

内置静态工厂：

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

但您通常会通过 `Collectable` 类的高层辅助方法使用它们。

---

### 6. `Collectable<E>`（抽象类）

以下类的基类：

- `OrderedCollectable<E>` – 排序输出
- `UnorderedCollectable<E>` – 不排序，最快
- `WindowCollectable<E>` – 滑动窗口
- `Statistics<E, D>` – 统计聚合

#### 常用方法（通过继承）：

| 方法 | 说明 | 示例 |
|------|------|------|
| `count()` | 计数元素 | `.count()` |
| `toArray()` | 转为数组 | `.toArray()` |
| `toSet()` | 转为 Set | `.toSet()` |
| `toMap(k, v)` | 转为 Map | `.toMap(x => x.id, x => x)` |
| `group(k)` | 按键分组 | `.group(x => x.category)` |
| `findAny()` | 任意匹配元素（Optional） | `.findAny()` |
| `findFirst()` | 第一个元素（Optional） | `.findFirst()` |
| `reduce(...)` | 自定义缩减 | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` – 排序数据

如果您希望元素**自动排序**，请使用此类。

可接受**自定义比较器**或使用自然排序。

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **保证排序输出。**

---

### 8. `UnorderedCollectable<E>` – 不排序（🚀 最快）

如果您**不关心顺序**且希望获得**最佳性能**，请使用：

```typescript
const unordered = new UnorderedCollectable(stream);
// 或
const fastest = semanticStream.toUnordered();
```

✅ **不执行任何排序算法**  
✅ **顺序无关紧要时的最佳性能**

---

### 9. `Statistics<E, D>` – 统计分析

用于分析数值数据的抽象基类。

#### 子类：

- `NumericStatistics<E>` – 适用于 `number` 值
- `BigIntStatistics<E>` – 适用于 `bigint` 值

##### 常用统计方法：

| 方法 | 说明 | 示例 |
|------|------|------|
| `mean()` | 平均值 | `.mean()` |
| `median()` | 中位数 | `.median()` |
| `mode()` | 众数 | `.mode()` |
| `minimum()` | 最小元素 | `.minimum()` |
| `maximum()` | 最大元素 | `.maximum()` |
| `range()` | 最大值 - 最小值 | `.range()` |
| `variance()` | 方差 | `.variance()` |
| `standardDeviation()` | 标准差 | `.standardDeviation()` |
| `summate()` | 元素总和 | `.summate()` |
| `quantile(q)` | 第 q 分位数（0–1） | `.quantile(0.5)` → 中位数 |
| `frequency()` | 频率映射表 | `.frequency()` |

---

## 🧪 完整示例

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// 示例数据
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 最快：不排序
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // 例如 [10, 2, 8, 4, 5, 6]（保持原顺序）

// 🔢 自然排序
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 获取统计数据
const stats = new NumericStatistics(numbers);
console.log('平均值:', stats.mean());
console.log('中位数:', stats.median());
console.log('众数:', stats.mode());
console.log('极差:', stats.range());
console.log('标准差:', stats.standardDeviation());
```

---

## 🛠️ 工具函数

本库还导出许多**类型守卫**和**比较工具**：

| 函数 | 用途 |
|------|------|
| `isString(x)` | string 类型守卫 |
| `isNumber(x)` | number 类型守卫 |
| `isBoolean(x)` | boolean 类型守卫 |
| `isIterable(x)` | 检查对象是否可迭代 |
| `useCompare(a, b)` | 通用比较函数 |
| `useRandom(x)` | 伪随机数生成器（有趣） |

---

## 🧩 高级用法：自定义生成器与窗口

您可以创建自定义**生成器**用于无限或受控数据流：

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

或使用**滑动窗口**：

```typescript
const windowed = ordered.slide(3n, 2n); // 窗口大小为 3，步长为 2
```

---

## 📄 许可证

本项目采用 **MIT 许可证** – 可自由用于商业和个人用途。

---

## 🙌 贡献

欢迎提交 Pull Request、提出问题与想法！

---

## 🚀 快速开始总结

| 任务 | 方法 |
|------|------|
| 安全处理空值 | `Optional<T>` |
| 创建流 | `from([...])`、`range()`、`fill()` |
| 转换数据 | `map()`、`filter()` |
| 排序数据 | `sorted()`、`toOrdered()` |
| 不排序（最快 | `toUnordered()` ✅ |
| 分组/聚合 | `toMap()`、`group()`、`Collector` |
| 统计 | `NumericStatistics`、`mean()`、`median()` 等 |

---

## 🔗 链接

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 文档：参见源码 / 类型定义

---

**享受在 TypeScript 中进行可组合、类型安全、函数式的数据处理吧。** 🚀

--- 

✅ **记住：**  
- `toUnordered()` → **不排序，最快**  
- 其他方法（如 `sorted()`、`toOrdered()`）→ **会排序数据**