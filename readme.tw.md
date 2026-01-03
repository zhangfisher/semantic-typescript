# 📘 semantic-typescript

一個強大且**類型安全**的 TypeScript 工具庫，專為**語意化資料處理（Semantic Data Processing）**而設計。  
提供可組合的函數式結構，用於處理集合（Collections）、資料流（Streams）與序列（Sequences），並支援排序、篩選、分組、統計分析等多種功能。

無論您是處理**已排序或未排序的資料**、進行**統計分析**，還是僅想**流暢地鏈式操作資料**，這個套件都能滿足您的需求。

---

## 🧩 功能特色

- ✅ 全面採用**類型安全的泛型（Generics）**
- ✅ **函數式編程風格**（例如：map、filter、reduce）
- ✅ **語意化資料流（Semantic<E>）**，支援延遲求值（Lazy Evaluation）
- ✅ 可將資料流轉換為實體資料結構的**收集器（Collectors）**
- ✅ **已排序與未排序的收集器（Collectables）** — 其中 `toUnordered()` 是**最快的（不會排序）**
- ✅ 支援透過 `sorted()`、`toOrdered()` 與自訂比較器進行**排序**
- ✅ **統計分析功能**（`Statistics`、`NumericStatistics`、`BigIntStatistics`）
- ✅ **Optional<T>** — 安全處理可能為 `null` 或 `undefined` 值的 Monad
- ✅ 採用**迭代器（Iterator）與生成器（Generator）**架構，適用於大型或非同步資料

---

## 📦 安裝方式

```bash
npm install semantic-typescript
```

---

## 🧠 核心概念

### 1. `Optional<T>` — 安全處理可為空（Nullable）的值

用來包裝可能為 `null` 或 `undefined` 的值的 Monad 容器。

#### 提供的方法：

| 方法 | 說明 | 範例 |
|------|------|------|
| `of(value)` | 包裝一個值（可為空） | `Optional.of(null)` |
| `ofNullable(v)` | 包裝，允許為空值 | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | 包裝，若為 null/undefined 則拋出例外 | `Optional.ofNonNull(5)` |
| `get()` | 取得值（若為空則拋出例外） | `opt.get()` |
| `getOrDefault(d)` | 取得值，若無則回傳預設值 | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | 若有值則執行副作用 | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | 若有值則對其進行轉換 | `opt.map(x => x + 1)` |
| `filter(fn)` | 僅保留符合條件的值 | `opt.filter(x => x > 0)` |
| `isEmpty()` | 判斷是否為空 | `opt.isEmpty()` |
| `isPresent()` | 判斷是否有值 | `opt.isPresent()` |

#### 範例：

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

### 2. `Semantic<E>` — 延遲資料流（Lazy Data Stream）

一個**可組合、延遲求值的資料序列**，類似於 Java 的 Streams 或 Kotlin 的 Sequences。

您可使用 `from()`、`range()`、`iterate()` 或 `fill()` 等輔助函數建立 `Semantic` 資料流。

#### 建立方式：

| 函數 | 說明 | 範例 |
|------|------|------|
| `from(iterable)` | 從陣列、集合或可迭代物件建立 | `from([1, 2, 3])` |
| `range(start, end, step?)` | 產生數字範圍 | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | 重複某個元素 N 次 | `fill('a', 3n)` |
| `iterate(gen)` | 使用自訂的生成器函數 | `iterate(genFn)` |

#### 常見操作：

| 方法 | 說明 | 範例 |
|------|------|------|
| `map(fn)` | 對每個元素進行轉換 | `.map(x => x * 2)` |
| `filter(fn)` | 僅保留符合條件的元素 | `.filter(x => x > 10)` |
| `limit(n)` | 限制回傳前 N 個元素 | `.limit(5)` |
| `skip(n)` | 跳過前 N 個元素 | `.skip(2)` |
| `distinct()` | 移除重複項（預設使用 Set） | `.distinct()` |
| `sorted()` | 對元素進行排序（自然順序） | `.sorted()` |
| `sorted(comparator)` | 使用自訂比較器排序 | `.sorted((a, b) => a - b)` |
| `toOrdered()` | 排序後回傳 OrderedCollectable | `.toOrdered()` |
| `toUnordered()` | **不進行排序（最快的方法）** | `.toUnordered()` ✅ |
| `collect(collector)` | 使用 Collector 進行聚合 | `.collect(Collector.full(...))` |
| `toArray()` | 轉為陣列 | `.toArray()` |
| `toSet()` | 轉為 Set | `.toSet()` |
| `toMap(keyFn, valFn)` | 轉為 Map | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` — 🚀 最快，不排序

如果您**不需要排序**，且希望獲得**最快的效能**，請使用：

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **不會套用任何排序演算法。**  
當資料的順序不重要，而您追求極致效能時，這是最佳選擇。

---

### 4. `toOrdered()` 與 `sorted()` — 排序後的資料

如果您需要**排序後的資料**，可使用以下方法：

```typescript
const ordered = semanticStream.sorted(); // 自然排序
const customSorted = semanticStream.sorted((a, b) => a - b); // 自訂比較器
const orderedCollectable = semanticStream.toOrdered(); // 也會排序
```

⚠️ 這些方法**會對資料進行排序**，可選擇使用自然排序或自訂比較器。

---

### 5. `Collector<E, A, R>` — 資料聚合

Collector 可讓您將資料流**縮減為單一值或複雜的資料結構**。

內建靜態工廠：

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

但您通常會透過 `Collectable` 類別提供的高階方法來使用它們。

---

### 6. `Collectable<E>`（抽象類別）

以下類別的基礎：

- `OrderedCollectable<E>` — 排序後的資料
- `UnorderedCollectable<E>` — 不排序，速度最快
- `WindowCollectable<E>` — 滑動視窗資料
- `Statistics<E, D>` — 統計資料聚合

#### 常見方法（繼承而來）：

| 方法 | 說明 | 範例 |
|------|------|------|
| `count()` | 計算元素數量 | `.count()` |
| `toArray()` | 轉為陣列 | `.toArray()` |
| `toSet()` | 轉為 Set | `.toSet()` |
| `toMap(k, v)` | 轉為 Map | `.toMap(x => x.id, x => x)` |
| `group(k)` | 依鍵值分組 | `.group(x => x.category)` |
| `findAny()` | 找出任意符合的元素（Optional） | `.findAny()` |
| `findFirst()` | 找出第一個元素（Optional） | `.findFirst()` |
| `reduce(...)` | 自訂縮減邏輯 | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` — 排序資料

如果您希望資料**自動排序**，可使用此類別。

可接受**自訂比較器**，或使用自然排序。

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **保證輸出為排序後的資料。**

---

### 8. `UnorderedCollectable<E>` — 不排序（🚀 最快）

如果您**不在意資料順序**，且希望獲得**最佳效能**，可使用：

```typescript
const unordered = new UnorderedCollectable(stream);
// 或
const fastest = semanticStream.toUnordered();
```

✅ **不執行任何排序演算法**  
✅ **當資料順序不重要時，提供最快速的處理方式**

---

### 9. `Statistics<E, D>` — 統計分析

用於分析數值資料的抽象基礎類別。

#### 子類別：

- `NumericStatistics<E>` — 適用於 `number` 類型
- `BigIntStatistics<E>` — 適用於 `bigint` 類型

##### 常見統計方法：

| 方法 | 說明 | 範例 |
|------|------|------|
| `mean()` | 平均值 | `.mean()` |
| `median()` | 中位數 | `.median()` |
| `mode()` | 眾數（最常出現的值） | `.mode()` |
| `minimum()` | 最小值 | `.minimum()` |
| `maximum()` | 最大值 | `.maximum()` |
| `range()` | 範圍（最大值 - 最小值） | `.range()` |
| `variance()` | 變異數 | `.variance()` |
| `standardDeviation()` | 標準差 | `.standardDeviation()` |
| `summate()` | 總和 | `.summate()` |
| `quantile(q)` | 第 q 百分位數（0–1） | `.quantile(0.5)` → 中位數 |
| `frequency()` | 頻率統計（Map） | `.frequency()` |

---

## 🧪 完整範例

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// 範例資料
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 最快：不排序
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // 例如：[10, 2, 8, 4, 5, 6]（原始順序）

// 🔢 自然排序
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 統計分析
const stats = new NumericStatistics(numbers);
console.log('平均值:', stats.mean());
console.log('中位數:', stats.median());
console.log('眾數:', stats.mode());
console.log('範圍:', stats.range());
console.log('標準差:', stats.standardDeviation());
```

---

## 🛠️ 工具函數

本套件也提供多種**型別守衛（Type Guards）**與**比較工具**：

| 函數 | 用途 |
|------|------|
| `isString(x)` | 判斷是否為 `string` |
| `isNumber(x)` | 判斷是否為 `number` |
| `isBoolean(x)` | 判斷是否為 `boolean` |
| `isIterable(x)` | 判斷是否為可迭代物件 |
| `useCompare(a, b)` | 通用比較函數 |
| `useRandom(x)` | 偽隨機數生成器（趣味用途） |

---

## 🧩 進階：自訂生成器與滑動視窗

您可以建立**自訂的資料生成器**，用於控制或無限的資料流：

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

或者使用**滑動視窗（Sliding Window）**：

```typescript
const windowed = ordered.slide(3n, 2n); // 視窗大小為 3，每次移動 2
```

---

## 📄 授權

本專案採用 **MIT 授權**，可免費用於商業或個人用途。

---

## 🙌 貢獻

歡迎提交 Pull Request、提出問題（Issues）或分享想法！

---

## 🚀 快速入門總覽

| 任務 | 方法 |
|------|------|
| 安全處理 null/undefined | `Optional<T>` |
| 建立資料流 | `from([...])`、`range()`、`fill()` |
| 資料轉換 | `map()`、`filter()` |
| 資料排序 | `sorted()`、`toOrdered()` |
| 不排序（最快） | `toUnordered()` ✅ |
| 分組 / 聚合 | `toMap()`、`group()`、`Collector` |
| 統計分析 | `NumericStatistics`、`mean()`、`median()` 等 |

---

## 🔗 相關連結

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 文件：請參考原始碼 / 類型定義

---

**享受在 TypeScript 中進行函數式、類型安全且可組合的資料處理吧！** 🚀

--- 

✅ **請記住：**  
- `toUnordered()` → **不排序，最快**  
- 其他方法（如 `sorted()`、`toOrdered()`）→ **會進行排序**