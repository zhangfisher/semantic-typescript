# Semantic-TypeScript 串流處理框架

## 引言

Semantic-TypeScript 是一個現代化的串流處理函式庫，靈感來自 JavaScript GeneratorFunction、Java Stream 和 MySQL Index。其核心設計理念基於透過資料索引建構高效的資料處理管道，為前端開發提供型別安全、函數式風格的串流操作體驗。

與傳統的同步處理不同，Semantic 採用非同步處理模型。在建立資料流時，終端資料接收的時機完全取決於上游何時呼叫 `accept` 和 `interrupt` 回呼函數。這種設計使得函式庫能夠優雅地處理即時資料流、大型資料集和非同步資料來源。

## 核心特性

| 特性 | 描述 | 優勢 |
|------|------|------|
| **型別安全泛型** | 完整的 TypeScript 型別支援 | 編譯時錯誤檢測，更好的開發體驗 |
| **函數式程式設計** | 不可變資料結構和純函數 | 更可預測的程式碼，易於測試和維護 |
| **惰性求值** | 按需計算，效能最佳化 | 處理大型資料集時記憶體效率高 |
| **非同步串流處理** | 基於產生器的非同步資料流 | 適用於即時資料和事件驅動場景 |
| **多範型收集器** | 有序、無序、統計收集策略 | 根據不同場景選擇最佳策略 |
| **統計分析** | 內建完整的統計計算函數 | 整合資料分析和報表生成 |

## 效能考量

**重要注意**：以下方法會犧牲效能來收集和排序資料，從而產生有序的資料集合：
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

特別需要注意的是：`sorted()` 和 `sorted(comparator)` 會覆寫以下方法的結果：
- `redirect(redirector)`
- `translate(translator)`
- `shuffle(mapper)`

## 工廠方法

### 串流建立工廠

| 方法 | 簽章 | 描述 | 範例 |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | 將 Blob 轉換為位元組流 | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | 建立空串流 | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | 填充指定數量的元素 | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | 從可迭代物件建立串流 | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | 建立數值範圍串流 | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | 從產生器函數建立串流 | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | 從 WebSocket 建立事件流 | `websocket(socket)` |

**程式碼範例補充：**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// 從陣列建立串流
const numberStream = from([1, 2, 3, 4, 5]);

// 建立數值範圍串流
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// 填充重複元素
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// 建立空串流
const emptyStream = empty<number>();
```

### 實用函數工廠

| 方法 | 簽章 | 描述 | 範例 |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | 驗證值是否有效 | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | 驗證值是否無效 | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | 通用比較函數 | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | 偽隨機數產生器 | `useRandom(5)` → 隨機數 |

**程式碼範例補充：**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// 驗證資料有效性
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // 安全呼叫，因為 validate 確保資料不為 null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("資料無效"); // 會執行，因為 invalidate 檢測到 null
}

// 比較值
const comparison = useCompare("apple", "banana"); // -1

// 產生隨機數
const randomNum = useRandom(42); // 基於種子 42 的隨機數
```

## 核心類別詳情

### Optional<T> - 安全空值處理

Optional 類別提供函數式方法來安全處理可能為 null 或 undefined 的值。

| 方法 | 回傳型別 | 描述 | 時間複雜度 |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | 過濾滿足條件的值 | O(1) |
| `get()` | `T` | 獲取值，若為空則拋出錯誤 | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | 獲取值或預設值 | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | 如果值存在則執行動作 | O(1) |
| `isEmpty()` | `boolean` | 檢查是否為空 | O(1) |
| `isPresent()` | `boolean` | 檢查值是否存在 | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | 對值進行對映和轉換 | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | 建立 Optional 實例 | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | 建立可為空的 Optional | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | 建立非空 Optional | O(1) |

**程式碼範例補充：**
```typescript
import { Optional } from 'semantic-typescript';

// 建立 Optional 實例
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// 鏈式操作
const result = optionalValue
    .filter(val => val.length > 3) // 過濾長度大於 3 的值
    .map(val => val.toUpperCase()) // 轉換為大寫
    .getOrDefault("default"); // 獲取值或預設值

console.log(result); // "HELLO" 或 "default"

// 安全操作
optionalValue.ifPresent(val => {
    console.log(`值存在: ${val}`);
});

// 檢查狀態
if (optionalValue.isPresent()) {
    console.log("有值");
} else if (optionalValue.isEmpty()) {
    console.log("為空");
}
```

### Semantic<E> - 惰性資料流

Semantic 是核心的串流處理類別，提供豐富的串流運算子。

#### 串流轉換操作

| 方法 | 回傳型別 | 描述 | 效能影響 |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | 連接兩個串流 | O(n+m) |
| `distinct()` | `Semantic<E>` | 移除重複項（使用 Set） | O(n) |
| `distinct(comparator)` | `Semantic<E>` | 自訂比較器去重 | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | 丟棄滿足條件的起始元素 | O(n) |
| `filter(predicate)` | `Semantic<E>` | 過濾元素 | O(n) |
| `flat(mapper)` | `Semantic<E>` | 扁平化巢狀串流 | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | 對映並扁平化 | O(n×m) |
| `limit(n)` | `Semantic<E>` | 限制元素數量 | O(n) |
| `map(mapper)` | `Semantic<R>` | 對映和轉換元素 | O(n) |
| `peek(consumer)` | `Semantic<E>` | 檢視元素而不修改 | O(n) |
| `redirect(redirector)` | `Semantic<E>` | 重新導向索引 | O(n) |
| `reverse()` | `Semantic<E>` | 反轉串流順序 | O(n) |
| `shuffle()` | `Semantic<E>` | 隨機洗牌順序 | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | 自訂洗牌邏輯 | O(n) |
| `skip(n)` | `Semantic<E>` | 跳過前 n 個元素 | O(n) |
| `sub(start, end)` | `Semantic<E>` | 獲取子串流 | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | 獲取滿足條件的起始元素 | O(n) |
| `translate(offset)` | `Semantic<E>` | 平移索引 | O(n) |
| `translate(translator)` | `Semantic<E>` | 自訂索引轉換 | O(n) |

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 串流轉換操作範例
const processedStream = stream
    .filter(x => x % 2 === 0) // 過濾偶數
    .map(x => x * 2) // 每個元素乘以 2
    .distinct() // 移除重複項
    .limit(3) // 限制為前 3 個元素
    .peek((val, index) => console.log(`元素 ${val} 在索引 ${index}`)); // 檢視元素

// 注意：串流尚未執行，需要轉換為 Collectable 以進行終端操作
```

#### 串流終端操作

| 方法 | 回傳型別 | 描述 | 效能特性 |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | 轉換為有序集合 | 排序操作，效能較低 |
| `toUnordered()` | `UnorderedCollectable<E>` | 轉換為無序集合 | 最快，無排序 |
| `toWindow()` | `WindowCollectable<E>` | 轉換為視窗集合 | 排序操作，效能較低 |
| `toNumericStatistics()` | `Statistics<E, number>` | 數值統計分析 | 排序操作，效能較低 |
| `toBigintStatistics()` | `Statistics<E, bigint>` | 大整數統計分析 | 排序操作，效能較低 |
| `sorted()` | `OrderedCollectable<E>` | 自然排序 | 覆寫重新導向結果 |
| `sorted(comparator)` | `OrderedCollectable<E>` | 自訂排序 | 覆寫重新導向結果 |

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// 轉換為有序集合（效能較低）
const ordered = semanticStream.toOrdered();

// 轉換為無序集合（最快）
const unordered = semanticStream.toUnordered();

// 自然排序
const sortedNatural = semanticStream.sorted();

// 自訂排序
const sortedCustom = semanticStream.sorted((a, b) => b - a); // 降序排序

// 轉換為統計物件
const stats = semanticStream.toNumericStatistics();

// 注意：必須透過 Semantic 實例呼叫上述方法以獲取 Collectable，然後才能使用終端方法
```

### Collector<E, A, R> - 資料收集器

收集器用於將串流資料聚合為特定結構。

| 方法 | 描述 | 使用場景 |
|------|------|----------|
| `collect(generator)` | 執行資料收集 | 串流終端操作 |
| `static full(identity, accumulator, finisher)` | 建立完整收集器 | 需要完整處理 |
| `static shortable(identity, interruptor, accumulator, finisher)` | 建立可中斷收集器 | 可能提前終止 |

**程式碼範例補充：**
```typescript
import { Collector } from 'semantic-typescript';

// 建立自訂收集器
const sumCollector = Collector.full(
    () => 0, // 初始值
    (acc, value) => acc + value, // 累加器
    result => result // 完成函數
);

// 使用收集器（需要先從 Semantic 轉換為 Collectable）
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - 可收集資料抽象類別

提供豐富的資料聚合和轉換方法。**注意：必須先透過 Semantic 實例呼叫 sorted()、toOrdered() 等方法獲取 Collectable 實例，然後才能使用以下方法。**

#### 資料查詢操作

| 方法 | 回傳型別 | 描述 | 範例 |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | 是否有任何元素匹配 | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | 是否所有元素匹配 | `allMatch(x => x > 0)` |
| `count()` | `bigint` | 元素數量統計 | `count()` → `5n` |
| `isEmpty()` | `boolean` | 串流是否為空 | `isEmpty()` |
| `findAny()` | `Optional<E>` | 尋找任意元素 | `findAny()` |
| `findFirst()` | `Optional<E>` | 尋找第一個元素 | `findFirst()` |
| `findLast()` | `Optional<E>` | 尋找最後一個元素 | `findLast()` |

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// 必須先轉換為 Collectable 才能使用終端方法
const collectable = numbers.toUnordered();

// 資料查詢操作
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // 任意元素
```

#### 資料聚合操作

| 方法 | 回傳型別 | 描述 | 複雜度 |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | 按分類器分組 | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | 按鍵值提取器分組 | O(n) |
| `join()` | `string` | 連接為字串 | O(n) |
| `join(delimiter)` | `string` | 使用分隔符連接 | O(n) |
| `partition(count)` | `E[][]` | 按數量分割 | O(n) |
| `partitionBy(classifier)` | `E[][]` | 按分類器分割 | O(n) |
| `reduce(accumulator)` | `Optional<E>` | 歸約操作 | O(n) |
| `reduce(identity, accumulator)` | `E` | 帶初始值的歸約 | O(n) |
| `toArray()` | `E[]` | 轉換為陣列 | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | 轉換為 Map | O(n) |
| `toSet()` | `Set<E>` | 轉換為 Set | O(n) |

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// 必須先轉換為 Collectable 才能使用聚合操作
const collectable = people.toUnordered();

// 分組操作
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// 轉換為集合
const array = collectable.toArray(); // 原始陣列
const set = collectable.toSet(); // Set 集合
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// 歸約操作
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### 特定收集器實作

#### UnorderedCollectable<E>
- **特性**：最快的收集器，無排序
- **使用場景**：順序不重要，需要最高效能
- **方法**：繼承所有 Collectable 方法

#### OrderedCollectable<E>
- **特性**：保證元素順序，效能較低
- **使用場景**：需要排序結果
- **特殊方法**：繼承所有方法，維持內部排序狀態

#### WindowCollectable<E>
- **特性**：支援滑動視窗操作
- **使用場景**：時間序列資料分析
- **特殊方法**：
  - `slide(size, step)` - 滑動視窗
  - `tumble(size)` - 翻滾視窗

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 無序收集器（最快）
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // 可能維持原始順序 [1, 2, 3, ...]

// 有序收集器
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // 保證排序 [1, 2, 3, ...]

// 視窗收集器
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // 視窗大小 3，步長 2
// 視窗 1: [1, 2, 3], 視窗 2: [3, 4, 5], 視窗 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // 翻滾視窗大小 4
// 視窗 1: [1, 2, 3, 4], 視窗 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - 統計分析

統計分析基礎類別，提供豐富的統計計算方法。**注意：必須先透過 Semantic 實例呼叫 toNumericStatistics() 或 toBigIntStatistics() 獲取 Statistics 實例，然後才能使用以下方法。**

#### 統計計算操作

| 方法 | 回傳型別 | 描述 | 演算法複雜度 |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | 最大值 | O(n) |
| `minimum()` | `Optional<E>` | 最小值 | O(n) |
| `range()` | `D` | 範圍（最大值-最小值） | O(n) |
| `variance()` | `D` | 變異數 | O(n) |
| `standardDeviation()` | `D` | 標準差 | O(n) |
| `mean()` | `D` | 平均值 | O(n) |
| `median()` | `D` | 中位數 | O(n log n) |
| `mode()` | `D` | 眾數 | O(n) |
| `frequency()` | `Map<D, bigint>` | 頻率分佈 | O(n) |
| `summate()` | `D` | 總和 | O(n) |
| `quantile(quantile)` | `D` | 分位數 | O(n log n) |
| `interquartileRange()` | `D` | 四分位距 | O(n log n) |
| `skewness()` | `D` | 偏度 | O(n) |
| `kurtosis()` | `D` | 峰度 | O(n) |

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 必須先轉換為統計物件才能使用統計方法
const stats = numbers.toNumericStatistics();

// 基礎統計
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// 進階統計
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // 任意值（因為每個都出現一次）
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// 頻率分佈
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### 特定統計實作類別

**NumericStatistics<E>**
- 處理 number 型別的統計分析
- 所有統計計算回傳 number 型別

**BigIntStatistics<E>**
- 處理 bigint 型別的統計分析
- 所有統計計算回傳 bigint 型別

**程式碼範例補充：**
```typescript
import { from } from 'semantic-typescript';

// 數值統計
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// 大整數統計
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// 使用對映函數的統計
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

## 完整使用範例

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. 建立資料流
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. 串流處理管道
const processedStream = semanticStream
    .filter(val => validate(val)) // 過濾掉 null 和 undefined
    .map(val => val! * 2) // 每個值乘以 2（使用 ! 因為 validate 確保不為空）
    .distinct(); // 移除重複項

// 3. 轉換為 Collectable 並使用終端操作
const collectable = processedStream.toUnordered();

// 4. 資料驗證和使用
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // 再次過濾
        .toArray(); // 轉換為陣列

    console.log("處理結果:", results); // [16, 18, 14, 8, 12]

    // 統計資訊
    const stats = processedStream.toNumericStatistics();
    console.log("平均值:", stats.mean()); // 11.2
    console.log("總和:", stats.summate()); // 56
}

// 5. 處理潛在的無效資料
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("有效資料:", validData); // [1, 3, 4]
console.log("無效資料:", invalidData); // [null, null]
```

## 重要使用規則總結

1. **建立串流**：使用 `from()`、`range()`、`fill()` 等工廠方法建立 Semantic 實例
2. **串流轉換**：在 Semantic 實例上呼叫 `map()`、`filter()`、`distinct()` 等方法
3. **轉換為 Collectable**：必須透過 Semantic 實例呼叫以下方法之一：
   - `toOrdered()` - 有序收集器
   - `toUnordered()` - 無序收集器（最快）
   - `toWindow()` - 視窗收集器
   - `toNumericStatistics()` - 數值統計
   - `toBigIntStatistics()` - 大整數統計
   - `sorted()` - 自然排序
   - `sorted(comparator)` - 自訂排序
4. **終端操作**：在 Collectable 實例上呼叫 `toArray()`、`count()`、`summate()` 等終端方法
5. **資料驗證**：使用 `validate()` 確保資料不為 null/undefined，使用 `invalidate()` 檢查無效資料

這種設計確保了型別安全性和效能最佳化，同時提供豐富的串流處理功能。