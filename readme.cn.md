# Semantic-TypeScript 流处理库

## 简介

Semantic-TypeScript 是一个受到 JavaScript GeneratorFunction、Java Stream 和 MySQL Index 启发而设计的现代化流处理库。该库的核心设计理念是基于数据索引构建高效的数据处理管道，为前端开发提供类型安全、函数式风格的流式操作体验。

与传统的同步处理不同，Semantic 采用异步处理模式。在创建数据流时，终端接收数据的时间完全取决于上游何时调用 `accept` 和 `interrupt` 回调函数，这种设计使得库能够优雅地处理实时数据流、大型数据集和异步数据源。

## 安装

```bash
npm install semantic-typescript
```

## 基础类型

| 类型 | 描述 |
|------|------|
| `Invalid<T>` | 扩展 null 或 undefined 的类型 |
| `Valid<T>` | 排除 null 和 undefined 的类型 |
| `MaybeInvalid<T>` | 可能为 null 或 undefined 的类型 |
| `Primitive` | 原始类型集合 |
| `MaybePrimitive<T>` | 可能为原始类型的类型 |
| `OptionalSymbol` | Optional 类的符号标识 |
| `SemanticSymbol` | Semantic 类的符号标识 |
| `CollectorsSymbol` | Collector 类的符号标识 |
| `CollectableSymbol` | Collectable 类的符号标识 |
| `OrderedCollectableSymbol` | OrderedCollectable 类的符号标识 |
| `WindowCollectableSymbol` | WindowCollectable 类的符号标识 |
| `StatisticsSymbol` | Statistics 类的符号标识 |
| `NumericStatisticsSymbol` | NumericStatistics 类的符号标识 |
| `BigIntStatisticsSymbol` | BigIntStatistics 类的符号标识 |
| `UnorderedCollectableSymbol` | UnorderedCollectable 类的符号标识 |
| `Runnable` | 无参数无返回值的函数 |
| `Supplier<R>` | 无参数返回 R 的函数 |
| `Functional<T, R>` | 单参数转换函数 |
| `Predicate<T>` | 单参数判断函数 |
| `BiFunctional<T, U, R>` | 双参数转换函数 |
| `BiPredicate<T, U>` | 双参数判断函数 |
| `Comparator<T>` | 比较函数 |
| `TriFunctional<T, U, V, R>` | 三参数转换函数 |
| `Consumer<T>` | 单参数消费函数 |
| `BiConsumer<T, U>` | 双参数消费函数 |
| `TriConsumer<T, U, V>` | 三参数消费函数 |
| `Generator<T>` | 生成器函数 |

```typescript
// 类型使用示例
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## 类型守卫

| 函数 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 验证值不为 null 或 undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 验证值为 null 或 undefined | O(1) | O(1) |
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

```typescript
// 类型守卫使用示例
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 类型安全，value 被推断为 string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## 工具函数

| 函数 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 通用比较函数 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 伪随机数生成器 | O(log n) | O(1) |

```typescript
// 工具函数使用示例
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // 基于种子的随机数
const randomBigInt = useRandom(1000n); // BigInt 随机数
```

## 工厂方法

### Optional 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 创建空的 Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | 创建包含值的 Optional | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 创建可能为空的 Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 创建非空的 Optional | O(1) | O(1) |

```typescript
// Optional 使用示例
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // 输出 42
console.log(emptyOpt.orElse(100)); // 输出 100
```

### Collector 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 创建完整收集器 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 创建可中断收集器 | O(1) | O(1) |

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

### Semantic 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
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

// 从 Blob 创建流（分块读取）
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // 写入流成功
  .catch(writeFi); // 写入流失败

// 创建空流，在拼接其它流之前不会执行
empty<string>()
  .toUnordered()
  .join(); //[]

// 创建填充流
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 创建初始延迟2秒、执行周期5秒的时序流，基于计时器机制实现，因系统调度精度限制可能存在时间漂移。
const intervalStream = interval(5000, 2000);

// 从可迭代对象创建流
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// 创建范围流
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 事件流
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message"); //只监听消息事件
  .toUnordered() // 对于事件一般不排序
  .forEach((event)=> receive(event)); //接收消息
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
| `skip(n)` | 跳过前n个元素 | O(n) | O(1) |
| `sorted()` | 排序 | O(n log n) | O(n) |
| `sorted(comparator)` | 使用比较器排序 | O(n log n) | O(n) |
| `sub(start, end)` | 获取子流 | O(n) | O(1) |
| `takeWhile(predicate)` | 获取满足条件的元素 | O(n) | O(1) |
| `translate(offset)` | 平移索引 | O(n) | O(1) |
| `translate(translator)` | 使用转换器平移索引 | O(n) | O(1) |

```typescript
// Semantic 操作示例
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // 过滤偶数
    .map(n => n * 2)                 // 乘以2
    .skip(1)                         // 跳过第一个
    .limit(3)                        // 限制3个元素
    .toArray();                      // 转换为数组
// 结果: [8, 12, 20]

// 复杂操作示例
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // 每个元素映射为两个
    .distinct()                      // 去重
    .shuffle()                       // 打乱顺序
    .takeWhile(n => n < 50)         // 取小于50的元素
    .toOrdered()                     // 转换为有序收集器
    .toArray();                      // 转换为数组
```

## 收集器转换方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `toUnoredered()` | 转换为无序收集器（性能优先） | O(1) | O(1) |
| `toOrdered()` | 转换为有序收集器 | O(1) | O(1) |
| `sorted()` | 排序并转换为有序收集器 | O(n log n) | O(n) |
| `toWindow()` | 转换为窗口收集器 | O(1) | O(1) |
| `toNumericStatistics()` | 转换为数值统计 | O(1) | O(1) |
| `toBigintStatistics()` | 转换为大数统计 | O(1) | O(1) |

```typescript
// 收集器转换示例
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 性能优先：使用无序收集器
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// 需要排序：使用有序收集器  
const ordered = numbers
    .sorted()
    .toOrdered();

// 统计分析：使用统计收集器
const stats = numbers
    .toNumericStatistics();

console.log(stats.mean());        // 平均值
console.log(stats.median());      // 中位数
console.log(stats.standardDeviation()); // 标准差

// 窗口操作
const windowed = numbers
    .toWindow()
    .tumble(3n); // 每3个元素一个窗口

windowed.forEach(window => {
    console.log(window.toArray()); // 每个窗口的内容
});
```

## Collectable 收集方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 是否存在匹配元素 | O(n) | O(1) |
| `allMatch(predicate)` | 是否所有元素匹配 | O(n) | O(1) |
| `count()` | 元素计数 | O(n) | O(1) |
| `isEmpty()` | 是否为空 | O(1) | O(1) |
| `findAny()` | 查找任意元素 | O(n) | O(1) |
| `findFirst()` | 查找第一个元素 | O(n) | O(1) |
| `findLast()` | 查找最后一个元素 | O(n) | O(1) |
| `forEach(action)` | 遍历所有元素 | O(n) | O(1) |
| `group(classifier)` | 按分类器分组 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 按键值提取器分组 | O(n) | O(n) |
| `join()` | 连接为字符串 | O(n) | O(n) |
| `join(delimiter)` | 使用分隔符连接 | O(n) | O(n) |
| `nonMatch(predicate)` | 是否没有元素匹配 | O(n) | O(1) |
| `partition(count)` | 按数量分区 | O(n) | O(n) |
| `partitionBy(classifier)` | 按分类器分区 | O(n) | O(n) |
| `reduce(accumulator)` | 归约操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 带初始值的归约 | O(n) | O(1) |
| `toArray()` | 转换为数组 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 转换为Map | O(n) | O(n) |
| `toSet()` | 转换为Set | O(n) | O(n) |
| `write(stream)` | 写入流 | O(n) | O(1) |

```typescript
// Collectable 操作示例
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// 匹配检查
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// 查找操作
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // 任意元素

// 分组操作
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// 归约操作
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 输出操作
data.join(", "); // "2, 4, 6, 8, 10"
```

## 统计分析方法

### NumericStatistics 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `range()` | 极差 | O(n) | O(1) |
| `variance()` | 方差 | O(n) | O(1) |
| `standardDeviation()` | 标准差 | O(n) | O(1) |
| `mean()` | 平均值 | O(n) | O(1) |
| `median()` | 中位数 | O(n log n) | O(n) |
| `mode()` | 众数 | O(n) | O(n) |
| `frequency()` | 频率分布 | O(n) | O(n) |
| `summate()` | 求和 | O(n) | O(1) |
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

console.log("映射平均值:", objects.mean(obj => obj.value)); // 20
```

## 性能选择指南

### 选择无序收集器（性能优先）
```typescript
// 当不需要顺序保证时，使用无序收集器获得最佳性能
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 最佳性能
```

### 选择有序收集器（需要顺序）
```typescript
// 当需要保持元素顺序时，使用有序收集器
const ordered = data.sorted(comparator);
```

### 选择窗口收集器（窗口操作）
```typescript  
// 需要进行窗口操作时
const windowed = data
    .toWindow()
    .slide(5n, 2n); // 滑动窗口
```

### 选择统计分析（数值计算）
```typescript  
// 需要进行统计分析时
const stats = data
    .toNumericStatistics(); // 数值统计

const bigIntStats = data
    .toBigintStatistics(); // 大数统计
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 注意事项

1. **排序操作的影响**：在有序收集器中，`sorted()` 操作会覆盖 `redirect`、`translate`、`shuffle`、`reverse` 的效果
2. **性能考虑**：如果不需要顺序保证，优先使用 `toUnoredered()` 获得更好性能
3. **内存使用**：排序操作需要 O(n) 的额外空间
4. **实时数据**：Semantic 流适合处理实时数据，支持异步数据源

这个库为 TypeScript 开发者提供了强大而灵活的流式处理能力，结合了函数式编程的优点和类型安全的保障。