# Semantic-TypeScript 流處理庫

## 簡介

Semantic-TypeScript 是一個現代化的流處理庫，受到 JavaScript GeneratorFunction、Java Stream 和 MySQL Index 的啟發。它的核心設計哲學是基於數據索引來構建高效的數據處理管道，為前端開發提供類型安全、函數式風格的流式操作體驗。

與傳統的同步處理不同，Semantic 使用異步處理模型。在創建數據流時，終端接收數據的時間完全取決於上游何時調用 `accept` 和 `interrupt` 回調函數。這種設計使得庫能夠優雅地處理實時數據流、大數據集和異步數據源。

## 安裝

```bash
npm install semantic-typescript
```

## 基本類型

| 類型 | 描述 |
|------|------|
| `Invalid<T>` | 擴展自 `null` 或 `undefined` 的類型 |
| `Valid<T>` | 排除 `null` 和 `undefined` 的類型 |
| `MaybeInvalid<T>` | 可能是 `null` 或 `undefined` 的類型 |
| `Primitive` | 原始類型的集合 |
| `MaybePrimitive<T>` | 可能是原始類型的類型 |
| `OptionalSymbol` | `Optional` 類的 Symbol 標識符 |
| `SemanticSymbol` | `Semantic` 類的 Symbol 標識符 |
| `CollectorsSymbol` | `Collector` 類的 Symbol 標識符 |
| `CollectableSymbol` | `Collectable` 類的 Symbol 標識符 |
| `OrderedCollectableSymbol` | `OrderedCollectable` 類的 Symbol 標識符 |
| `WindowCollectableSymbol` | `WindowCollectable` 類的 Symbol 標識符 |
| `StatisticsSymbol` | `Statistics` 類的 Symbol 標識符 |
| `NumericStatisticsSymbol` | `NumericStatistics` 類的 Symbol 標識符 |
| `BigIntStatisticsSymbol` | `BigIntStatistics` 類的 Symbol 標識符 |
| `UnorderedCollectableSymbol` | `UnorderedCollectable` 類的 Symbol 標識符 |

## 函數式接口

| 介面 | 描述 |
|------|------|
| `Runnable` | 無參數且無返回值的函數 |
| `Supplier<R>` | 無參數並返回 `R` 的函數 |
| `Functional<T, R>` | 單參數轉換函數 |
| `BiFunctional<T, U, R>` | 雙參數轉換函數 |
| `TriFunctional<T, U, V, R>` | 三參數轉換函數 |
| `Predicate<T>` | 單參數斷言函數 |
| `BiPredicate<T, U>` | 雙參數斷言函數 |
| `TriPredicate<T, U, V>` | 三參數斷言函數 |
| `Consumer<T>` | 單參數消費函數 |
| `BiConsumer<T, U>` | 雙參數消費函數 |
| `TriConsumer<T, U, V>` | 三參數消費函數 |
| `Comparator<T>` | 雙參數比較函數 |
| `Generator<T>` | 生成器函數（核心與基礎） |

```typescript
// 類型使用範例
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## 類型守衛

| 函數 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 驗證值不是 null 或 undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 驗證值是 null 或 undefined | O(1) | O(1) |
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
| `isPromise(t: unknown): t is Promise<unknown>` | 檢查是否為 Promise 物件 | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | 檢查是否為 AsyncFunction | O(1) | O(1) |

```typescript
// 類型守衛使用範例
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 類型安全，value 被推斷為字串
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // 類型安全，現在它是可迭代物件
    for(let item of value){
        console.log(item);
    }
}
```

## 工具函數

| 函數 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 泛型比較函數 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 偽隨機數產生器 | O(log n) | O(1) |

```typescript
// 工具函數使用範例
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // 基於種子的隨機數
```

## 工廠方法

### Optional 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 建立一個空的 Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | 建立一個包含值的 Optional | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 建立一個可能為空的 Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 建立一個非空的 Optional | O(1) | O(1) |

```typescript
// Optional 使用範例
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

presentO.ifPresent((value: number): void => console.log(value)); // 輸出 42
console.log(empty.get(100)); // 輸出 100
```

### Collector 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 建立一個完整的收集器 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 建立一個可中斷的收集器 | O(1) | O(1) |

```typescript
// Collector 轉換範例
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 效能優先：使用無序收集器
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnordered();

// 需要排序：使用有序收集器  
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// 統計元素數量
let count: Collector<number, number, number> = Collector.full(
    (): number => 0, // 初始值
    (accumulator: number, element: number): number => accumulator + element, // 累積
    (accumulator: number): number => accumulator // 完成
);
count.collect(from([1,2,3,4,5])); // 從流中統計
count.collect([1,2,3,4,5]); // 從可迭代物件統計

let find: Optional<number> = Collector.shortable(
    (): Optional<number> => Optional.empty(), // 初始值
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // 中斷
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // 累積
    (accumulator: Optional<number>): Optional<number> => accumulator // 完成
);
find.collect(from([1,2,3,4,5])); // 查找第一個元素
find.collect([1,2,3,4,5]); // 查找第一個元素
```

### Semantic 工廠方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | 建立定時動畫幀流 | O(1)* | O(1) |
| `blob(blob, chunkSize)` | 從 Blob 建立流 | O(n) | O(chunkSize) |
| `empty<E>()` | 建立空流 | O(1) | O(1) |
| `fill<E>(element, count)` | 建立填充流 | O(n) | O(1) |
| `from<E>(iterable)` | 從可迭代物件建立流 | O(1) | O(1) |
| `interval(period, delay?)` | 建立定時間隔流 | O(1)* | O(1) |
| `iterate<E>(generator)` | 從生成器建立流 | O(1) | O(1) |
| `range(start, end, step)` | 建立數值範圍流 | O(n) | O(1) |
| `websocket(websocket)` | 從 WebSocket 建立流 | O(1) | O(1) |

```typescript
// Semantic 工廠方法使用範例

// 從定時動畫幀建立流
animationFrame(1000)
    .toUnordered()
    .forEach(frame => console.log(frame));

// 從 Blob 建立流（分塊讀取）
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // 寫入流成功
    .catch(callback); // 寫入流失敗

// 建立空流，需與其他流連接後才會執行
empty<string>()
    .toUnordered()
    .join(); //[]

// 建立填充流
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 建立初始延遲 2 秒、執行週期 5 秒的定時流，基於定時器機制實現；可能因系統排程精確度限制產生時間漂移。
let intervalStream = interval(5000, 2000);

// 從可迭代物件建立流
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// 從已解析的 Promise 建立流
let promisedStream: Semantic<Array<number>> = Promise.resolve([1, 2, 3, 4, 5]);

// 建立範圍流
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 事件流
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message"); // 僅監聽訊息事件
  .toUnordered() // 事件通常無序
  .forEach((event): void => receive(event)); // 接收訊息
```

## Semantic 類別方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `concat(other)` | 連接兩個流 | O(n) | O(1) |
| `distinct()` | 移除重複項 | O(n) | O(n) |
| `distinct(comparator)` | 使用比較器移除重複項 | O(n²) | O(n) |
| `dropWhile(predicate)` | 丟棄滿足條件的元素 | O(n) | O(1) |
| `filter(predicate)` | 過濾元素 | O(n) | O(1) |
| `flat(mapper)` | 平坦化映射 | O(n × m) | O(1) |
| `flatMap(mapper)` | 平坦化映射到新類型 | O(n × m) | O(1) |
| `limit(n)` | 限制元素數量 | O(n) | O(1) |
| `map(mapper)` | 映射轉換 | O(n) | O(1) |
| `peek(consumer)` | 查看元素 | O(n) | O(1) |
| `redirect(redirector)` | 重定向索引 | O(n) | O(1) |
| `reverse()` | 反轉流 | O(n) | O(1) |
| `shuffle()` | 隨機洗牌 | O(n) | O(1) |
| `shuffle(mapper)` | 使用映射器洗牌 | O(n) | O(1) |
| `skip(n)` | 跳過前 n 個元素 | O(n) | O(1) |
| `sorted()` | 排序 | O(n log n) | O(n) |
| `sorted(comparator)` | 使用比較器排序 | O(n log n) | O(n) |
| `sub(start, end)` | 取得子流 | O(n) | O(1) |
| `takeWhile(predicate)` | 取得滿足條件的元素 | O(n) | O(1) |
| `translate(offset)` | 平移索引 | O(n) | O(1) |
| `translate(translator)` | 使用翻譯器平移索引 | O(n) | O(1) |

```typescript
// Semantic 操作範例
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)        // 過濾偶數
    .map((n: number): number => n * 2)                 // 乘以 2
    .skip(1)                         // 跳過第一個
    .limit(3)                        // 限制為 3 個元素
    .toUnordered()                   // 轉換為無序收集器
    .toArray();                      // 轉換為陣列
// 結果: [8, 12, 20]

// 複雜操作範例
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // 將每個元素映射為兩個
    .distinct()                      // 移除重複項
    .shuffle()                       // 隨機洗牌
    .takeWhile((n: number): boolean => n < 50)         // 取小於 50 的元素
    .toOrdered()                     // 轉換為有序收集器
    .toArray();                      // 轉換為陣列
```

## Semantic 轉換方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------------|------------|------------|------------|
| `sorted()` | 轉換為有序收集器 | O(n log n) | O(n) |
| `toUnordered()` | 轉換為無序收集器 | O(1) | O(1) |
| `toOrdered()` | 轉換為有序收集器 | O(1) | O(1) |
| `toNumericStatistics()` | 轉換為數值統計 | O(n) | O(1) |
| `toBigintStatistics()` | 轉換為 BigInt 統計 | O(n) | O(1) |
| `toWindow()` | 轉換為視窗收集器 | O(1) | O(1) |
| `toCollectable()` | 轉換為 `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | 轉換為自訂收集器 | O(n) | O(1) |

```typescript
// 轉換為升序陣列
from([6,4,3,5,2]) // 建立流
    .sorted() // 按升序排序
    .toArray(); // [2, 3, 4, 5, 6]

// 轉換為降序陣列
from([6,4,3,5,2]) // 建立流
    .soted((a: number, b: number): number => b - a) // 按降序排序
    .toArray(); // [6, 5, 4, 3, 2]

// 重定向為倒序陣列
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // 重定向為倒序
    .toOrderd() // 保持重定向順序
    .toArray(); // [2, 5, 3, 4, 6]

// 忽略重定向以倒序陣列
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // 重定向為倒序
    .toUnorderd() // 丟棄重定向順序。此操作將忽略 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 反轉流為陣列
from([6, 4, 3, 5, 2])
    .reverse() // 反轉流
    .toOrdered() // 保證反轉順序
    .toArray(); // [2, 5, 3, 4, 6]

// 覆蓋洗牌的流為陣列
from([6, 4, 3, 5, 2])
    .shuffle() // 洗牌流
    .sorted() // 覆蓋洗牌順序。此操作將覆蓋 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 轉換為視窗收集器
from([6, 4, 3, 5, 2]).toWindow();

// 轉換為數值統計
from([6, 4, 3, 5, 2]).toNumericStatistics();

// 轉換為 BigInt 統計
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// 定義自訂收集器來收集資料
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable 集合方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 是否有任何元素符合 | O(n) | O(1) |
| `allMatch(predicate)` | 是否所有元素都符合 | O(n) | O(1) |
| `count()` | 元素計數 | O(n) | O(1) |
| `isEmpty()` | 是否為空 | O(1) | O(1) |
| `findAny()` | 查找任何元素 | O(n) | O(1) |
| `findFirst()` | 查找第一個元素 | O(n) | O(1) |
| `findLast()` | 查找最後一個元素 | O(n) | O(1) |
| `forEach(action)` | 遍歷所有元素 | O(n) | O(1) |
| `group(classifier)` | 按分類器分組 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 按鍵值提取器分組 | O(n) | O(n) |
| `join()` | 將元素連接為字串 | O(n) | O(n) |
| `join(delimiter)` | 使用分隔符連接元素 | O(n) | O(n) |
| `nonMatch(predicate)` | 是否沒有任何元素符合 | O(n) | O(1) |
| `partition(count)` | 按計數分區 | O(n) | O(n) |
| `partitionBy(classifier)` | 按分類器分區 | O(n) | O(n) |
| `reduce(accumulator)` | 歸約操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 使用初始值的歸約操作 | O(n) | O(1) |
| `toArray()` | 轉換為陣列 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 轉換為 Map | O(n) | O(n) |
| `toSet()` | 轉換為 Set | O(n) | O(n) |
| `write(stream)` | 寫入流 | O(n) | O(1) |

```typescript
// Collectable 操作範例
let data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// 符合檢查
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// 查找操作
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // 任何元素

// 分組操作
let grouped = data.groupBy(
    (n: number): string => (n > 5 ? "large" : "small"),
    (n: number): number => n * 2
); // {small: [4, 8], large: [12, 16, 20]}

// 歸約操作
let sum = data.reduce(0, (accumulator: number, n: number): number => accumulator + n); // 30

// 輸出操作
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## 統計分析方法

### NumericStatistics 方法

| 方法 | 描述 | 時間複雜度 | 空間複雜度 |
|------|------|------------|------------|
| `range()` | 範圍 | O(n) | O(1) |
| `variance()` | 變異數 | O(n) | O(1) |
| `standardDeviation()` | 標準差 | O(n) | O(1) |
| `mean()` | 平均 | O(n) | O(1) |
| `median()` | 中位數 | O(n log n) | O(n) |
| `mode()` | 眾數 | O(n) | O(n) |
| `frequency()` | 頻率分佈 | O(n) | O(n) |
| `summate()` | 總和 | O(n) | O(1) |
| `quantile(quantile)` | 分位數 | O(n log n) | O(n) |
| `interquartileRange()` | 四分位距 | O(n log n) | O(n) |
| `skewness()` | 偏態 | O(n) | O(1) |
| `kurtosis()` | 峰態 | O(n) | O(1) |

```typescript
// 統計分析範例
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("平均:", numbers.mean()); // 5.5
console.log("中位數:", numbers.median()); // 5.5
console.log("標準差:", numbers.standardDeviation()); // ~2.87
console.log("總和:", numbers.summate()); // 55

// 使用映射器的統計分析
let objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();
console.log("映射後的平均:", objects.mean(obj => obj.value)); // 20
```

## 效能選擇指南

### 選擇無序收集器（效能優先）

```typescript
// 當不需要順序保證時，使用無序收集器以獲得最佳效能
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // 最佳效能
```

### 選擇有序收集器（需要順序）

```typescript
// 當需要維持元素順序時，使用有序收集器
let ordered = data.sorted(comparator);
```

### 選擇視窗收集器（視窗操作）

```typescript
// 當需要視窗操作時
let window: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // 滑動視窗
```

### 選擇統計分析（數值計算）

```typescript
// 當需要統計分析時
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // 數值統計
let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // 大整數統計
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 重要注意事項

1. **排序操作的影響**：在有序收集器中，`sorted()` 操作會覆蓋 `redirect`、`translate`、`shuffle`、`reverse` 的效果。
2. **效能考量**：如果不需要順序保證，優先使用 `toUnordered()` 以獲得更好的效能。
3. **記憶體使用**：排序操作需要額外的 O(n) 空間。
4. **即時資料**：Semantic 流適用於處理即時資料，並支援異步資料來源。

這個庫為 TypeScript 開發者提供了強大而靈活的流處理能力，結合了函數式程式設計的好處和類型安全的保證。