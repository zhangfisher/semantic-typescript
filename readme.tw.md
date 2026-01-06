# Semantic-TypeScript 流處理庫

## 簡介

Semantic-TypeScript 是一個受到 JavaScript GeneratorFunction、Java Stream 和 MySQL Index 啟發而設計的現代化流處理庫。該庫的核心設計理念是基於數據索引建構高效的數據處理管道，為前端開發提供類型安全、函數式風格的流式操作體驗。

與傳統的同步處理不同，Semantic 採用非同步處理模式。在創建數據流時，終端接收數據的時間完全取決於上游何時調用 `accept` 和 `interrupt` 回調函數，這種設計使得庫能夠優雅地處理實時數據流、大型數據集和非同步數據源。

## 安裝

```bash
npm install semantic-typescript
```

## 基礎類型

| 類型 | 描述 |
|------|------|
| `Invalid<T>` | 擴展 null 或 undefined 的類型 |
| `Valid<T>` | 排除 null 和 undefined 的類型 |
| `MaybeInvalid<T>` | 可能為 null 或 undefined 的類型 |
| `Primitive` | 原始類型集合 |
| `MaybePrimitive<T>` | 可能為原始類型的類型 |
| `OptionalSymbol` | Optional 類的符號標識 |
| `SemanticSymbol` | Semantic 類的符號標識 |
| `CollectorsSymbol` | Collector 類的符號標識 |
| `CollectableSymbol` | Collectable 類的符號標識 |
| `OrderedCollectableSymbol` | OrderedCollectable 類的符號標識 |
| `WindowCollectableSymbol` | WindowCollectable 類的符號標識 |
| `StatisticsSymbol` | Statistics 類的符號標識 |
| `NumericStatisticsSymbol` | NumericStatistics 類的符號標識 |
| `BigIntStatisticsSymbol` | BigIntStatistics 類的符號標識 |
| `UnorderedCollectableSymbol` | UnorderedCollectable 類的符號標識 |
| `Runnable` | 無參數無返回值的函數 |
| `Supplier<R>` | 無參數返回 R 的函數 |
| `Functional<T, R>` | 單參數轉換函數 |
| `Predicate<T>` | 單參數判斷函數 |
| `BiFunctional<T, U, R>` | 雙參數轉換函數 |
| `BiPredicate<T, U>` | 雙參數判斷函數 |
| `Comparator<T>` | 比較函數 |
| `TriFunctional<T, U, V, R>` | 三參數轉換函數 |
| `Consumer<T>` | 單參數消費函數 |
| `BiConsumer<T, U>` | 雙參數消費函數 |
| `TriConsumer<T, U, V>` | 三參數消費函數 |
| `Generator<T>` | 生成器函數 |

```typescript
// 類型使用示例
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## 類型守衛

| 函數 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 驗證值不為 null 或 undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 驗證值為 null 或 undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | 檢查是否為布林值 | O(1) | O(1) |
| `isString(t: unknown): t is string` | 檢查是否為字串 | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 檢查是否為數字 | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 檢查是否為函數 | O(1) | O(1) |
| `isObject(t: unknown): t is object` | 檢查是否為物件 | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | 檢查是否為 Symbol | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | 檢查是否為 BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | 檢查是否為原始類型 | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 檢查是否為可迭代物件 | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | 檢查是否為 Optional 實例 | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | 檢查是否為 Semantic 實例 | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | 檢查是否為 Collector 實例 | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | 檢查是否為 Collectable 實例 | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | 檢查是否為 OrderedCollectable 實例 | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | 檢查是否為 WindowCollectable 實例 | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | 檢查是否為 UnorderedCollectable 實例 | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | 檢查是否為 Statistics 實例 | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | 檢查是否為 NumericStatistics 實例 | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | 檢查是否為 BigIntStatistics 實例 | O(1) | O(1) |

```typescript
// 類型守衛使用示例
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 類型安全，value 被推斷為 string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## 工具函數

| 函數 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 通用比較函數 | O(1) | O(1) |
| `useRandom<T = number | bigint>(index: T): T` | 偽隨機數生成器 | O(log n) | O(1) |

```typescript
// 工具函數使用示例
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // 基於種子的隨機數
const randomBigInt = useRandom(1000n); // BigInt 隨機數
```

## 工廠方法

### Optional 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 創建空的 Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | 創建包含值的 Optional | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 創建可能為空的 Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 創建非空的 Optional | O(1) | O(1) |

```typescript
// Optional 使用示例
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // 輸出 42
console.log(emptyOpt.orElse(100)); // 輸出 100
```

### Collector 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 創建完整收集器 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 創建可中斷收集器 | O(1) | O(1) |

```typescript
// Collector 使用示例
const sumCollector = Collector.full(
    () => 0,
    (sum, num) => sum + num,
    result => result
);

const numbers = from([1, 2, 3, 4, 5]);
const total = numbers.toUnoredered().collect(sumCollector); // 15
```

### Semantic 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `blob(blob, chunkSize)` | 從 Blob 建立串流 | O(n) | O(chunkSize) |
| `empty<E>()` | 建立空串流 | O(1) | O(1) |
| `fill<E>(element, count)` | 建立填充串流 | O(n) | O(1) |
| `from<E>(iterable)` | 從可迭代物件建立串流 | O(1) | O(1) |
| `interval(period, delay?)` | 建立定時間隔串流 | O(1)* | O(1) |
| `iterate<E>(generator)` | 從產生器建立串流 | O(1) | O(1) |
| `range(start, end, step)` | 建立數值範圍串流 | O(n) | O(1) |
| `websocket(websocket)` | 從 WebSocket 建立串流 | O(1) | O(1) |

```typescript
// Semantic 工廠方法使用範例

// 從 Blob 建立串流（分塊讀取）
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // 串流寫入成功
  .catch(writeFi); // 串流寫入失敗

// 建立空串流，僅在與其他串流連接後才會執行
empty<string>()
  .toUnordered()
  .join(); //[]

// 建立填充串流
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 建立初始延遲2秒、執行週期5秒的時序串流，
// 基於計時器機制實現，因系統排程限制可能產生時間漂移
const intervalStream = interval(5000, 2000);

// 從可迭代物件建立串流
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// 建立範圍串流
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 事件串流
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // 僅監聽訊息事件
  .toUnordered() // 事件通常不排序
  .forEach((event)=> receive(event)); // 接收訊息
```

## Semantic 類方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `concat(other)` | 連接兩個流 | O(n) | O(1) |
| `distinct()` | 去重 | O(n) | O(n) |
| `distinct(comparator)` | 使用比較器去重 | O(n²) | O(n) |
| `dropWhile(predicate)` | 丟棄滿足條件的元素 | O(n) | O(1) |
| `filter(predicate)` | 過濾元素 | O(n) | O(1) |
| `flat(mapper)` | 扁平化映射 | O(n × m) | O(1) |
| `flatMap(mapper)` | 扁平化映射到新型別 | O(n × m) | O(1) |
| `limit(n)` | 限制元素數量 | O(n) | O(1) |
| `map(mapper)` | 映射轉換 | O(n) | O(1) |
| `peek(consumer)` | 查看元素 | O(n) | O(1) |
| `redirect(redirector)` | 重定向索引 | O(n) | O(1) |
| `reverse()` | 反轉流 | O(n) | O(1) |
| `shuffle()` | 隨機打亂 | O(n) | O(1) |
| `shuffle(mapper)` | 使用映射器打亂 | O(n) | O(1) |
| `skip(n)` | 跳過前n個元素 | O(n) | O(1) |
| `sorted()` | 排序 | O(n log n) | O(n) |
| `sorted(comparator)` | 使用比較器排序 | O(n log n) | O(n) |
| `sub(start, end)` | 獲取子流 | O(n) | O(1) |
| `takeWhile(predicate)` | 獲取滿足條件的元素 | O(n) | O(1) |
| `translate(offset)` | 平移索引 | O(n) | O(1) |
| `translate(translator)` | 使用轉換器平移索引 | O(n) | O(1) |

```typescript
// Semantic 操作示例
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // 過濾偶數
    .map(n => n * 2)                 // 乘以2
    .skip(1)                         // 跳過第一個
    .limit(3)                        // 限制3個元素
    .toArray();                      // 轉換為陣列
// 結果: [8, 12, 20]

// 複雜操作示例
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // 每個元素映射為兩個
    .distinct()                      // 去重
    .shuffle()                       // 打亂順序
    .takeWhile(n => n < 50)         // 取小於50的元素
    .toOrdered()                     // 轉換為有序收集器
    .toArray();                      // 轉換為陣列
```

## 收集器轉換方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `toUnoredered()` | 轉換為無序收集器（效能優先） | O(1) | O(1) |
| `toOrdered()` | 轉換為有序收集器 | O(1) | O(1) |
| `sorted()` | 排序並轉換為有序收集器 | O(n log n) | O(n) |
| `toWindow()` | 轉換為視窗收集器 | O(1) | O(1) |
| `toNumericStatistics()` | 轉換為數值統計 | O(1) | O(1) |
| `toBigintStatistics()` | 轉換為大數統計 | O(1) | O(1) |

```typescript
// 收集器轉換示例
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 效能優先：使用無序收集器
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// 需要排序：使用有序收集器  
const ordered = numbers.sorted();

// 統計分析：使用統計收集器
const stats = numbers
    .toNumericStatistics();

console.log(stats.mean());        // 平均值
console.log(stats.median());      // 中位數
console.log(stats.standardDeviation()); // 標準差

// 視窗操作
const windowed = numbers
    .toWindow()
    .tumble(3n); // 每3個元素一個視窗

windowed.forEach(window => {
    console.log(window.toArray()); // 每個視窗的內容
});
```

## Collectable 收集方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 是否存在匹配元素 | O(n) | O(1) |
| `allMatch(predicate)` | 是否所有元素匹配 | O(n) | O(1) |
| `count()` | 元素計數 | O(n) | O(1) |
| `isEmpty()` | 是否為空 | O(1) | O(1) |
| `findAny()` | 查找任意元素 | O(n) | O(1) |
| `findFirst()` | 查找第一個元素 | O(n) | O(1) |
| `findLast()` | 查找最後一個元素 | O(n) | O(1) |
| `forEach(action)` | 遍歷所有元素 | O(n) | O(1) |
| `group(classifier)` | 按分類器分組 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 按鍵值提取器分組 | O(n) | O(n) |
| `join()` | 連接為字串 | O(n) | O(n) |
| `join(delimiter)` | 使用分隔符連接 | O(n) | O(n) |
| `nonMatch(predicate)` | 是否沒有元素匹配 | O(n) | O(1) |
| `partition(count)` | 按數量分區 | O(n) | O(n) |
| `partitionBy(classifier)` | 按分類器分區 | O(n) | O(n) |
| `reduce(accumulator)` | 歸約操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 帶初始值的歸約 | O(n) | O(1) |
| `toArray()` | 轉換為陣列 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 轉換為Map | O(n) | O(n) |
| `toSet()` | 轉換為Set | O(n) | O(n) |
| `write(stream)` | 寫入流 | O(n) | O(1) |

```typescript
// Collectable 操作示例
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// 匹配檢查
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// 查找操作
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // 任意元素

// 分組操作
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// 歸約操作
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 輸出操作
data.join(", "); // "2, 4, 6, 8, 10"
```

## 統計分析方法

### NumericStatistics 方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `range()` | 極差 | O(n) | O(1) |
| `variance()` | 方差 | O(n) | O(1) |
| `standardDeviation()` | 標準差 | O(n) | O(1) |
| `mean()` | 平均值 | O(n) | O(1) |
| `median()` | 中位數 | O(n log n) | O(n) |
| `mode()` | 眾數 | O(n) | O(n) |
| `frequency()` | 頻率分佈 | O(n) | O(n) |
| `summate()` | 求和 | O(n) | O(1) |
| `quantile(quantile)` | 分位數 | O(n log n) | O(n) |
| `interquartileRange()` | 四分位距 | O(n log n) | O(n) |
| `skewness()` | 偏度 | O(n) | O(1) |
| `kurtosis()` | 峰度 | O(n) | O(1) |

```typescript
// 統計分析示例
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("平均值:", numbers.mean()); // 5.5
console.log("中位數:", numbers.median()); // 5.5
console.log("標準差:", numbers.standardDeviation()); // ~2.87
console.log("總和:", numbers.summate()); // 55

// 使用映射器的統計分析
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("映射平均值:", objects.mean(obj => obj.value)); // 20
```

## 效能選擇指南

### 選擇無序收集器（效能優先）
```typescript
// 當不需要順序保證時，使用無序收集器獲得最佳效能
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 最佳效能
```

### 選擇有序收集器（需要順序）
```typescript
// 當需要保持元素順序時，使用有序收集器
const ordered = data
    .sorted(comparator) // 排序操作會覆蓋重定向效果
```

### 選擇視窗收集器（視窗操作）
```typescript
// 需要進行視窗操作時
const windowed = data
    .toWindow()
    .slide(5n, 2n); // 滑動視窗
```

### 選擇統計分析（數值計算）
```typescript
// 需要進行統計分析時
const stats = data
    .toNumericStatistics(); // 數值統計

const bigIntStats = data
    .toBigintStatistics(); // 大數統計
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 注意事項

1. **排序操作的影響**：在有序收集器中，`sorted()` 操作會覆蓋 `redirect`、`translate`、`shuffle`、`reverse` 的效果
2. **效能考慮**：如果不需要順序保證，優先使用 `toUnoredered()` 獲得更好效能
3. **記憶體使用**：排序操作需要 O(n) 的額外空間
4. **實時數據**：Semantic 流適合處理實時數據，支援非同步數據源

這個庫為 TypeScript 開發者提供了強大而靈活的流式處理能力，結合了函數式編程的優點和類型安全的保障。