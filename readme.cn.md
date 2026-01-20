# Semantic-TypeScript 流式处理库

## 简介

Semantic-TypeScript 是一个受 JavaScript GeneratorFunction、Java Stream 和 MySQL 索引启发的现代流式处理库。其核心理念是基于数据索引构建高效的数据处理管道，为前端开发提供类型安全、函数式风格的流式操作体验。

与传统同步处理不同，Semantic 采用异步处理模型。在创建数据流时，终端接收到数据的时间完全取决于上游何时调用 `accept` 与 `interrupt` 回调函数。这种设计使该库能够优雅地处理实时数据流、大数据集以及异步数据源。

## 安装

```bash
npm install semantic-typescript
```

## 基础类型

| 类型 | 描述 |
|------|------|
| `Invalid<T>` | 扩展自 `null` 或 `undefined` 的类型 |
| `Valid<T>` | 排除 `null` 和 `undefined` 的类型 |
| `MaybeInvalid<T>` | 可能为 `null` 或 `undefined` 的类型 |
| `Primitive` | 原始类型的集合 |
| `MaybePrimitive<T>` | 可能是原始类型的类型 |
| `OptionalSymbol` | `Optional` 类的 Symbol 标识符 |
| `SemanticSymbol` | `Semantic` 类的 Symbol 标识符 |
| `CollectorsSymbol` | `Collector` 类的 Symbol 标识符 |
| `CollectableSymbol` | `Collectable` 类的 Symbol 标识符 |
| `OrderedCollectableSymbol` | `OrderedCollectable` 类的 Symbol 标识符 |
| `WindowCollectableSymbol` | `WindowCollectable` 类的 Symbol 标识符 |
| `StatisticsSymbol` | `Statistics` 类的 Symbol 标识符 |
| `NumericStatisticsSymbol` | `NumericStatistics` 类的 Symbol 标识符 |
| `BigIntStatisticsSymbol` | `BigIntStatistics` 类的 Symbol 标识符 |
| `UnorderedCollectableSymbol` | `UnorderedCollectable` 类的 Symbol 标识符 |

## 函数式接口

| 接口 | 描述 |
|------|------|
| `Runnable` | 无参数且无返回值的函数 |
| `Supplier<R>` | 无参数并返回 `R` 的函数 |
| `Functional<T, R>` | 单参数转换函数 |
| `BiFunctional<T, U, R>` | 双参数转换函数 |
| `TriFunctional<T, U, V, R>` | 三参数转换函数 |
| `Predicate<T>` | 单参数断言函数 |
| `BiPredicate<T, U>` | 双参数断言函数 |
| `TriPredicate<T, U, V>` | 三参数断言函数 |
| `Consumer<T>` | 单参数消费函数 |
| `BiConsumer<T, U>` | 双参数消费函数 |
| `TriConsumer<T, U, V>` | 三参数消费函数 |
| `Comparator<T>` | 双参数比较函数 |
| `Generator<T>` | 生成器函数（核心与基础） |

```typescript
// 类型使用示例
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## 类型守卫

| 函数 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 验证值不是 null 或 undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 验证值是 null 或 undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | 检查是否为布尔值 | O(1) | O(1) |
| `isString(t: unknown): t is string` | 检查是否为字符串 | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 检查是否为数字 | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 检查是否为函数 | O(1) | O(1) |
| `isObject(t: unknown): t is object` | 检查是否为对象 | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | 检查是否为 Symbol | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | 检查是否为 BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | 检查是否为原始类型 | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 检查是否为可迭代对象 | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | 检查是否为 Optional 实例 | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | 检查是否为 Semantic 实例 | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | 检查是否为 Collector 实例 | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | 检查是否为 Collectable 实例 | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | 检查是否为 OrderedCollectable 实例 | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | 检查是否为 WindowCollectable 实例 | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | 检查是否为 UnorderedCollectable 实例 | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | 检查是否为 Statistics 实例 | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | 检查是否为 NumericStatistics 实例 | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | 检查是否为 BigIntStatistics 实例 | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | 检查是否为 Promise 对象 | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | 检查是否为 AsyncFunction | O(1) | O(1) |

```typescript
// 类型守卫使用示例
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 类型安全，value 被推断为 string
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // 类型安全，现在它是可迭代对象
    for(let item of value){
        console.log(item);
    }
}
```

## 工具函数

| 函数 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 泛型比较函数 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 伪随机数生成器 | O(log n) | O(1) |

```typescript
// 工具函数使用示例
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // 基于种子的随机数
```

## 工厂方法

### Optional 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 创建一个空的 Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | 创建包含值的 Optional | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 创建可能为空的 Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 创建非空的 Optional | O(1) | O(1) |

```typescript
// Optional 使用示例
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((value: number): void => console.log(value)); // 输出 42
console.log(empty.get(100)); // 输出 100
```

### Collector 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 创建完整收集器 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 创建可中断收集器 | O(1) | O(1) |

```typescript
// Collector 转换示例
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 优先性能：使用无序收集器
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnoredered();

// 需要排序：使用有序收集器  
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// 统计元素数量
let count: Collector<number, number, number> = Collector.full(
    (): number => 0, // 初始值
    (accumulator: number, element: number): number => accumulator + element, // 累加
    (accumulator: number): number => accumulator // 完成
);
count.collect(from([1,2,3,4,5])); // 从流中计数
count.collect([1,2,3,4,5]); // 从可迭代对象计数

let find: Optional<number> = Collector.shortable(
    (): Optional<number> => Optional.empty(), // 初始值
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // 中断
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // 累加
    (accumulator: Optional<number>): Optional<number> => accumulator // 完成
);
find.collect(from([1,2,3,4,5])); // 查找第一个元素
find.collect([1,2,3,4,5]); // 查找第一个元素
```

### Semantic 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | 创建定时动画帧流 | O(1)* | O(1) |
| `blob(blob, chunkSize)` | 从 Blob 创建流 | O(n) | O(chunkSize) |
| `empty<E>()` | 创建空流 | O(1) | O(1) |
| `fill<E>(element, count)` | 创建填充流 | O(n) | O(1) |
| `from<E>(iterable)` | 从可迭代对象创建流 | O(1) | O(1) |
| `interval(period, delay?)` | 创建定时间隔流 | O(1)* | O(1) |
| `iterate<E>(generator)` | 从生成器创建流 | O(1) | O(1) |
| `range(start, end, step)` | 创建数值范围流 | O(n) | O(1) |
| `websocket(websocket)` | 从 WebSocket 创建流 | O(1) | O(1) |

```typescript
// Semantic 工厂方法使用示例

// 从定时动画帧创建流
animationFrame(1000)
    .toUnordered()
    .forEach(frame => console.log(frame));

// 从 Blob 创建流（分块读取）
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // 写入流成功
    .catch(callback); // 写入流失败

// 创建空流，需与其他流连接后才会执行
empty<string>()
    .toUnordered()
    .join(); //[]

// 创建填充流
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 创建初始延迟 2 秒、执行周期 5 秒的定时流，基于定时器机制实现；可能因系统调度精度限制产生时间漂移。
let intervalStream = interval(5000, 2000);

// 从可迭代对象创建流
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// 从已解析的 Promise 创建流
let promisedStream: Semantic<Array<number>> = Promise.resolve([1, 2, 3, 4, 5]);

// 创建范围流
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 事件流
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message"); // 仅监听消息事件
  .toUnordered() // 事件通常无序
  .forEach((event): void => receive(event)); // 接收消息
```

## Semantic 类方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `concat(other)` | 连接两个流 | O(n) | O(1) |
| `distinct()` | 去重 | O(n) | O(n) |
| `distinct(comparator)` | 使用比较器去重 | O(n²) | O(n) |
| `dropWhile(predicate)` | 丢弃满足条件的元素 | O(n) | O(1) |
| `filter(predicate)` | 过滤元素 | O(n) | O(1) |
| `flat(mapper)` | 扁平化映射 | O(n × m) | O(1) |
| `flatMap(mapper)` | 扁平化映射到新类型 | O(n × m) | O(1) |
| `limit(n)` | 限制元素数量 | O(n) | O(1) |
| `map(mapper)` | 映射转换 | O(n) | O(1) |
| `peek(consumer)` | 查看元素 | O(n) | O(1) |
| `redirect(redirector)` | 重定向索引 | O(n) | O(1) |
| `reverse()` | 反转流 | O(n) | O(1) |
| `shuffle()` | 随机打乱 | O(n) | O(1) |
| `shuffle(mapper)` | 使用映射器打乱 | O(n) | O(1) |
| `skip(n)` | 跳过前 n 个元素 | O(n) | O(1) |
| `sorted()` | 排序 | O(n log n) | O(n) |
| `sorted(comparator)` | 使用比较器排序 | O(n log n) | O(n) |
| `sub(start, end)` | 获取子流 | O(n) | O(1) |
| `takeWhile(predicate)` | 获取满足条件的元素 | O(n) | O(1) |
| `translate(offset)` | 平移索引 | O(n) | O(1) |
| `translate(translator)` | 使用翻译器平移索引 | O(n) | O(1) |

```typescript
// Semantic 操作示例
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)        // 过滤偶数
    .map((n: number): number => n * 2)                 // 乘以 2
    .skip(1)                         // 跳过第一个
    .limit(3)                        // 限制为 3 个元素
    .toUnordered()                   // 转换为无序收集器
    .toArray();                      // 转换为数组
// 结果: [8, 12, 20]

// 复杂操作示例
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // 每个元素映射为两个
    .distinct()                      // 去重
    .shuffle()                       // 打乱顺序
    .takeWhile((n: number): boolean => n < 50)         // 取小于 50 的元素
    .toOrdered()                     // 转换为有序收集器
    .toArray();                      // 转换为数组
```

## Semantic 转换方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `sorted()` | 转换为有序收集器 | O(n log n) | O(n) |
| `toUnordered()` | 转换为无序收集器 | O(1) | O(1) |
| `toOrdered()` | 转换为有序收集器 | O(1) | O(1) |
| `toNumericStatistics()` | 转换为数值统计 | O(n) | O(1) |
| `toBigintStatistics()` | 转换为 BigInt 统计 | O(n) | O(1) |
| `toWindow()` | 转换为窗口收集器 | O(1) | O(1) |
| `toCollectable()` | 转换为 `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | 转换为自定义收集器 | O(n) | O(1) |

```typescript
// 转换为升序数组
from([6,4,3,5,2]) // 创建流
    .sorted() // 按升序排序
    .toArray(); // [2, 3, 4, 5, 6]

// 转换为降序数组
from([6,4,3,5,2]) // 创建流
    .soted((a: number, b: number): number => b - a) // 按降序排序
    .toArray(); // [6, 5, 4, 3, 2]

// 重定向为倒序数组
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // 重定向为倒序
    .toOrderd() // 保持重定向顺序
    .toArray(); // [2, 5, 3, 4, 6]

// 忽略重定向以倒序数组
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // 重定向为倒序
    .toUnorderd() // 丢弃重定向顺序。此操作将忽略 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 反转流为数组
from([6, 4, 3, 5, 2])
    .reverse() // 反转流
    .toOrdered() // 保证反转顺序
    .toArray(); // [2, 5, 3, 4, 6]

// 覆盖打乱的流为数组
from([6, 4, 3, 5, 2])
    .shuffle() // 打乱流
    .sorted() // 覆盖打乱顺序。此操作将覆盖 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 转换为窗口收集器
from([6, 4, 3, 5, 2]).toWindow();

// 转换为数值统计
from([6, 4, 3, 5, 2]).toNumericStatistics();

// 转换为 BigInt 统计
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// 定义自定义收集器来收集数据
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable 集合方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 是否有任何元素匹配 | O(n) | O(1) |
| `allMatch(predicate)` | 是否所有元素都匹配 | O(n) | O(1) |
| `count()` | 元素计数 | O(n) | O(1) |
| `isEmpty()` | 是否为空 | O(1) | O(1) |
| `findAny()` | 查找任意元素 | O(n) | O(1) |
| `findFirst()` | 查找第一个元素 | O(n) | O(1) |
| `findLast()` | 查找最后一个元素 | O(n) | O(1) |
| `forEach(action)` | 遍历所有元素 | O(n) | O(1) |
| `group(classifier)` | 按分类器分组 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 按键值提取器分组 | O(n) | O(n) |
| `join()` | 将元素连接为字符串 | O(n) | O(n) |
| `join(delimiter)` | 使用分隔符连接元素 | O(n) | O(n) |
| `nonMatch(predicate)` | 是否没有任何元素匹配 | O(n) | O(1) |
| `partition(count)` | 按计数分区 | O(n) | O(n) |
| `partitionBy(classifier)` | 按分类器分区 | O(n) | O(n) |
| `reduce(accumulator)` | 归约操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 使用初始值的归约操作 | O(n) | O(1) |
| `toArray()` | 转换为数组 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 转换为 Map | O(n) | O(n) |
| `toSet()` | 转换为 Set | O(n) | O(n) |
| `write(stream)` | 写入流 | O(n) | O(1) |

```typescript
// Collectable 操作示例
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered(); // 匹配检查
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// 查找操作
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // 任意元素

// 分组操作
const grouped = data.groupBy(
    (n: number): string => (n > 5 ? "large" : "small"),
    (n: number): number => n * 2
); // {small: [4, 8], large: [12, 16, 20]}

// 归约操作
const sum = data.reduce(0, (accumulator: number, n: number): number => accumulator + n); // 30

// 输出操作
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## 统计分析方法

### NumericStatistics 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `range()` | 范围 | O(n) | O(1) |
| `variance()` | 方差 | O(n) | O(1) |
| `standardDeviation()` | 标准差 | O(n) | O(1) |
| `mean()` | 平均值 | O(n) | O(1) |
| `median()` | 中位数 | O(n log n) | O(n) |
| `mode()` | 众数 | O(n) | O(n) |
| `frequency()` | 频率分布 | O(n) | O(n) |
| `summate()` | 总和 | O(n) | O(1) |
| `quantile(quantile)` | 分位数 | O(n log n) | O(n) |
| `interquartileRange()` | 四分位距 | O(n log n) | O(n) |
| `skewness()` | 偏度 | O(n) | O(1) |
| `kurtosis()` | 峰度 | O(n) | O(1) |

```typescript
// 统计分析示例
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();
console.log("平均值:", numbers.mean()); // 5.5
console.log("中位数:", numbers.median()); // 5.5
console.log("标准差:", numbers.standardDeviation()); // ~2.87
console.log("总和:", numbers.summate()); // 55

// 使用映射器的统计分析
const objects = from([
    { value: 10 },
    { value: 20 },
    { value: 30 }
]).toNumericStatistics();
console.log("映射后的平均值:", objects.mean(obj => obj.value)); // 20
```

## 性能选择指南

### 选择无序收集器（性能优先）

```typescript
// 当不需要顺序保证时，使用无序收集器以获得最佳性能
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // 最佳性能
```

### 选择有序收集器（需要顺序）

```typescript
// 当需要保持元素顺序时，使用有序收集器
let ordered = data.sorted(comparator);
```

### 选择窗口收集器（窗口操作）

```typescript
// 当需要窗口操作时
let window: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // 滑动窗口
```

### 选择统计分析（数值计算）

```typescript
// 当需要统计分析时
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // 数值统计
let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // 大整数统计
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 重要注意事项

1. **排序操作的影响**：在有序收集器中，`sorted()` 操作会覆盖 `redirect`、`translate`、`shuffle`、`reverse` 的效果。
2. **性能考虑**：如果不需要顺序保证，优先使用 `toUnordered()` 以获得更好的性能。
3. **内存使用**：排序操作需要额外的 O(n) 空间。
4. **实时数据处理**：Semantic 流适用于处理实时数据，并支持异步数据源。

这个库为 TypeScript 开发者提供了强大而灵活的流处理能力，结合了函数式编程的优势和类型安全的保障。