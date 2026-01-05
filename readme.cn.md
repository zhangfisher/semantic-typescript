# Semantic-TypeScript 流处理框架

## 简介

Semantic-TypeScript 是一个受到 JavaScript GeneratorFunction、Java Stream 和 MySQL Index 启发而设计的现代化流处理库。该库的核心设计理念是基于数据索引构建高效的数据处理管道，为前端开发提供类型安全、函数式风格的流式操作体验。

与传统的同步处理不同，Semantic 采用异步处理模式。在创建数据流时，终端接收数据的时间完全取决于上游何时调用 `accept` 和 `interrupt` 回调函数，这种设计使得库能够优雅地处理实时数据流、大型数据集和异步数据源。

## 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **类型安全泛型** | 完整的 TypeScript 类型支持 | 编译时错误检测，更好的开发体验 |
| **函数式编程** | 不可变数据结构和纯函数 | 代码更可预测，易于测试和维护 |
| **惰性求值** | 按需计算，优化性能 | 处理大型数据集时内存效率高 |
| **异步流处理** | 基于 Generator 的异步数据流 | 适合实时数据和事件驱动场景 |
| **多范式收集器** | 有序、无序、统计等多种收集策略 | 根据不同场景选择最优策略 |
| **统计分析** | 内置完整的统计计算功能 | 数据分析和报表生成一体化 |

## 性能注意事项

**重要提醒**：以下方法会通过牺牲性能来收集和排序数据，得到有序的数据集合：
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

特别需要注意的是，`sorted()` 和 `sorted(comparator)` 会覆盖以下方法的结果：
- `redirect(redirector)`
- `translate(translator)` 
- `shuffle(mapper)`

## 工厂方法

### 流创建工厂

| 方法 | 签名 | 描述 | 示例 |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | 将 Blob 转换为字节流 | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | 创建空流 | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | 填充指定数量的元素 | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | 从可迭代对象创建流 | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | 创建数值范围流 | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | 从生成器函数创建流 | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | 从 WebSocket 创建事件流 | `websocket(socket)` |

**代码示例补充：**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// 从数组创建流
const numberStream = from([1, 2, 3, 4, 5]);

// 创建数值范围流
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// 填充重复元素
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// 创建空流
const emptyStream = empty<number>();
```

### 工具函数工厂

| 方法 | 签名 | 描述 | 示例 |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | 验证值是否有效 | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | 验证值是否无效 | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | 通用比较函数 | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | 伪随机数生成器 | `useRandom(5)` → 随机数 |

**代码示例补充：**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// 验证数据有效性
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // 安全调用，因为 validate 确保了 data 不为 null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("数据无效"); // 会执行，因为 invalidate 检测到 null
}

// 比较值
const comparison = useCompare("apple", "banana"); // -1

// 生成随机数
const randomNum = useRandom(42); // 基于种子 42 的随机数
```

## 核心类详解

### Optional<T> - 安全空值处理

Optional 类提供了一种安全处理可能为 null 或 undefined 值的函数式方法。

| 方法 | 返回类型 | 描述 | 时间复杂度 |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | 过滤满足条件的值 | O(1) |
| `get()` | `T` | 获取值，空则抛出错误 | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | 获取值或默认值 | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | 值存在时执行操作 | O(1) |
| `isEmpty()` | `boolean` | 检查是否为空 | O(1) |
| `isPresent()` | `boolean` | 检查是否有值 | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | 映射转换值 | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | 创建 Optional 实例 | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | 创建可空的 Optional | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | 创建非空 Optional | O(1) |

**代码示例补充：**
```typescript
import { Optional } from 'semantic-typescript';

// 创建 Optional 实例
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// 链式操作
const result = optionalValue
    .filter(val => val.length > 3) // 过滤长度大于3的值
    .map(val => val.toUpperCase()) // 转换为大写
    .getOrDefault("default"); // 获取值或默认值

console.log(result); // "HELLO" 或 "default"

// 安全操作
optionalValue.ifPresent(val => {
    console.log(`值存在: ${val}`);
});

// 检查状态
if (optionalValue.isPresent()) {
    console.log("有值");
} else if (optionalValue.isEmpty()) {
    console.log("为空");
}
```

### Semantic<E> - 惰性数据流

Semantic 是核心的流处理类，提供丰富的流操作符。

#### 流转换操作

| 方法 | 返回类型 | 描述 | 性能影响 |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | 连接两个流 | O(n+m) |
| `distinct()` | `Semantic<E>` | 去重（使用 Set） | O(n) |
| `distinct(comparator)` | `Semantic<E>` | 自定义比较器去重 | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | 丢弃满足条件的起始元素 | O(n) |
| `filter(predicate)` | `Semantic<E>` | 过滤元素 | O(n) |
| `flat(mapper)` | `Semantic<E>` | 扁平化嵌套流 | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | 映射并扁平化 | O(n×m) |
| `limit(n)` | `Semantic<E>` | 限制元素数量 | O(n) |
| `map(mapper)` | `Semantic<R>` | 映射转换元素 | O(n) |
| `peek(consumer)` | `Semantic<E>` | 查看元素而不修改 | O(n) |
| `redirect(redirector)` | `Semantic<E>` | 重定向索引 | O(n) |
| `reverse()` | `Semantic<E>` | 反转流顺序 | O(n) |
| `shuffle()` | `Semantic<E>` | 随机打乱顺序 | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | 自定义打乱逻辑 | O(n) |
| `skip(n)` | `Semantic<E>` | 跳过前n个元素 | O(n) |
| `sub(start, end)` | `Semantic<E>` | 获取子流 | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | 获取满足条件的起始元素 | O(n) |
| `translate(offset)` | `Semantic<E>` | 平移索引 | O(n) |
| `translate(translator)` | `Semantic<E>` | 自定义索引变换 | O(n) |

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 流转换操作示例
const processedStream = stream
    .filter(x => x % 2 === 0) // 过滤偶数
    .map(x => x * 2) // 每个元素乘以2
    .distinct() // 去重
    .limit(3) // 限制前3个元素
    .peek((val, index) => console.log(`元素 ${val} 在索引 ${index}`)); // 查看元素

// 注意：此时流还未执行，需要转换为 Collectable 才能使用终端操作
```

#### 流终止操作

| 方法 | 返回类型 | 描述 | 性能特点 |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | 转换为有序集合 | 排序操作，性能较低 |
| `toUnordered()` | `UnorderedCollectable<E>` | 转换为无序集合 | 最快，不排序 |
| `toWindow()` | `WindowCollectable<E>` | 转换为窗口集合 | 排序操作，性能较低 |
| `toNumericStatistics()` | `Statistics<E, number>` | 数值统计分析 | 排序操作，性能较低 |
| `toBigintStatistics()` | `Statistics<E, bigint>` | 大整数统计分析 | 排序操作，性能较低 |
| `sorted()` | `OrderedCollectable<E>` | 自然排序 | 覆盖重定向结果 |
| `sorted(comparator)` | `OrderedCollectable<E>` | 自定义排序 | 覆盖重定向结果 |

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// 转换为有序集合（性能较低）
const ordered = semanticStream.toOrdered();

// 转换为无序集合（最快）
const unordered = semanticStream.toUnordered();

// 自然排序
const sortedNatural = semanticStream.sorted();

// 自定义排序
const sortedCustom = semanticStream.sorted((a, b) => b - a); // 降序排序

// 转换为统计对象
const stats = semanticStream.toNumericStatistics();

// 注意：必须通过 Semantic 实例调用上述方法得到 Collectable 后才能使用终端方法
```

### Collector<E, A, R> - 数据收集器

收集器用于将流数据聚合为特定结构。

| 方法 | 描述 | 使用场景 |
|------|------|----------|
| `collect(generator)` | 执行数据收集 | 流终止操作 |
| `static full(identity, accumulator, finisher)` | 创建完整收集器 | 需要完整处理 |
| `static shortable(identity, interruptor, accumulator, finisher)` | 创建可中断收集器 | 可能提前终止 |

**代码示例补充：**
```typescript
import { Collector } from 'semantic-typescript';

// 创建自定义收集器
const sumCollector = Collector.full(
    () => 0, // 初始值
    (acc, value) => acc + value, // 累加器
    result => result // 完成函数
);

// 使用收集器（需要先通过 Semantic 转换为 Collectable）
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - 可收集数据抽象类

提供丰富的数据聚合和转换方法。**注意：必须先通过 Semantic 实例调用 sorted(), toOrdered() 等方法得到 Collectable 实例后才能使用以下方法。**

#### 数据查询操作

| 方法 | 返回类型 | 描述 | 示例 |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | 是否存在匹配元素 | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | 是否所有元素匹配 | `allMatch(x => x > 0)` |
| `count()` | `bigint` | 元素数量统计 | `count()` → `5n` |
| `isEmpty()` | `boolean` | 是否为空流 | `isEmpty()` |
| `findAny()` | `Optional<E>` | 查找任意元素 | `findAny()` |
| `findFirst()` | `Optional<E>` | 查找第一个元素 | `findFirst()` |
| `findLast()` | `Optional<E>` | 查找最后一个元素 | `findLast()` |

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// 必须先转换为 Collectable 才能使用终端方法
const collectable = numbers.toUnordered();

// 数据查询操作
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // 任意元素
```

#### 数据聚合操作

| 方法 | 返回类型 | 描述 | 复杂度 |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | 按分类器分组 | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | 按键值提取器分组 | O(n) |
| `join()` | `string` | 连接为字符串 | O(n) |
| `join(delimiter)` | `string` | 带分隔符连接 | O(n) |
| `partition(count)` | `E[][]` | 按数量分区 | O(n) |
| `partitionBy(classifier)` | `E[][]` | 按分类器分区 | O(n) |
| `reduce(accumulator)` | `Optional<E>` | 归约操作 | O(n) |
| `reduce(identity, accumulator)` | `E` | 带初始值归约 | O(n) |
| `toArray()` | `E[]` | 转换为数组 | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | 转换为Map | O(n) |
| `toSet()` | `Set<E>` | 转换为Set | O(n) |

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// 转换为 Collectable 后才能使用聚合操作
const collectable = people.toUnordered();

// 分组操作
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// 转换为集合
const array = collectable.toArray(); // 原始数组
const set = collectable.toSet(); // Set 集合
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// 归约操作
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### 具体收集器实现

#### UnorderedCollectable<E>
- **特点**：最快的收集器，不进行排序
- **使用场景**：顺序不重要，追求最大性能
- **方法**：继承 Collectable 的所有方法

#### OrderedCollectable<E> 
- **特点**：保证元素有序，性能较低
- **使用场景**：需要排序结果的场景
- **特殊方法**：继承所有方法，内部维护排序状态

#### WindowCollectable<E>
- **特点**：支持滑动窗口操作
- **使用场景**：时间序列数据分析
- **特有方法**：
  - `slide(size, step)` - 滑动窗口
  - `tumble(size)` - 翻滚窗口

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 无序收集器（最快）
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // 可能保持原顺序 [1, 2, 3, ...]

// 有序收集器
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // 保证排序 [1, 2, 3, ...]

// 窗口收集器
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // 窗口大小3，步长2
// 窗口1: [1, 2, 3], 窗口2: [3, 4, 5], 窗口3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // 翻滚窗口大小4
// 窗口1: [1, 2, 3, 4], 窗口2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - 统计分析

统计分析基类，提供丰富的统计计算方法。**注意：必须先通过 Semantic 实例调用 toNumericStatistics() 或 toBigIntStatistics() 得到 Statistics 实例后才能使用以下方法。**

#### 统计计算操作

| 方法 | 返回类型 | 描述 | 算法复杂度 |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | 最大值 | O(n) |
| `minimum()` | `Optional<E>` | 最小值 | O(n) |
| `range()` | `D` | 极差（最大值-最小值） | O(n) |
| `variance()` | `D` | 方差 | O(n) |
| `standardDeviation()` | `D` | 标准差 | O(n) |
| `mean()` | `D` | 平均值 | O(n) |
| `median()` | `D` | 中位数 | O(n log n) |
| `mode()` | `D` | 众数 | O(n) |
| `frequency()` | `Map<D, bigint>` | 频率分布 | O(n) |
| `summate()` | `D` | 求和 | O(n) |
| `quantile(quantile)` | `D` | 分位数 | O(n log n) |
| `interquartileRange()` | `D` | 四分位距 | O(n log n) |
| `skewness()` | `D` | 偏度 | O(n) |
| `kurtosis()` | `D` | 峰度 | O(n) |

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 转换为统计对象后才能使用统计方法
const stats = numbers.toNumericStatistics();

// 基本统计
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// 高级统计
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // 任何值（因为都出现一次）
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// 频率分布
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### 具体统计实现类

**NumericStatistics<E>**
- 处理 number 类型的统计分析
- 所有统计计算返回 number 类型

**BigIntStatistics<E>**  
- 处理 bigint 类型的统计分析
- 所有统计计算返回 bigint 类型

**代码示例补充：**
```typescript
import { from } from 'semantic-typescript';

// 数值统计
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// 大整数统计
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// 使用映射函数的统计
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

## 完整使用示例

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. 创建数据流
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. 流处理管道
const processedStream = semanticStream
    .filter(val => validate(val)) // 过滤掉 null 和 undefined
    .map(val => val! * 2) // 每个值乘以2（使用 ! 因为 validate 确保了不为空）
    .distinct(); // 去重

// 3. 转换为 Collectable 并使用终端操作
const collectable = processedStream.toUnordered();

// 4. 数据验证和使用
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // 再次过滤
        .toArray(); // 转换为数组
    
    console.log("处理结果:", results); // [16, 18, 14, 8, 12]
    
    // 统计信息
    const stats = processedStream.toNumericStatistics();
    console.log("平均值:", stats.mean()); // 11.2
    console.log("总和:", stats.summate()); // 56
}

// 5. 处理可能无效的数据
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("有效数据:", validData); // [1, 3, 4]
console.log("无效数据:", invalidData); // [null, null]
```

## 重要使用规则总结

1. **创建流**：使用 `from()`, `range()`, `fill()` 等工厂方法创建 Semantic 实例
2. **流转换**：在 Semantic 实例上调用 `map()`, `filter()`, `distinct()` 等方法
3. **转换为 Collectable**：必须通过 Semantic 实例调用以下方法之一：
   - `toOrdered()` - 有序收集器
   - `toUnordered()` - 无序收集器（最快）
   - `toWindow()` - 窗口收集器  
   - `toNumericStatistics()` - 数值统计
   - `toBigIntStatistics()` - 大整数统计
   - `sorted()` - 自然排序
   - `sorted(comparator)` - 自定义排序
4. **终端操作**：在 Collectable 实例上调用 `toArray()`, `count()`, `summate()` 等终端方法
5. **数据验证**：使用 `validate()` 确保数据不为 null/undefined，使用 `invalidate()` 检查无效数据

这样的设计确保了类型安全性和性能优化，同时提供了丰富的流处理功能。