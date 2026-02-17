好的，这是“Semantic-TypeScript Stream Processing Library”的简体中文翻译。我将根据文档的结构，对各个部分进行翻译。

# Semantic-TypeScript 流处理库

## 介绍

**Semantic-TypeScript：面向现代网络开发的范式转移流处理库**

Semantic-TypeScript 代表了流处理技术的一项重大进步，它融合了来自 JavaScript GeneratorFunction、Java Stream 和 MySQL 索引范式中最有效的概念。其基础设计原则围绕通过复杂的数据索引方法构建异常高效的数据处理流水线。该库专门为现代前端开发提供了一个严格类型安全、函数式纯正的流式操作体验。

与传统的同步处理架构相比，Semantic-TypeScript 实现了完全异步的处理模型。在数据流生成期间，数据在终端接收的时间完全由上流的 `accept` 和 `interrupt` 回调机制调用决定。这种深思熟虑的架构选择使该库能够优雅地处理：

*   **具有确定性延迟特性的实时数据流**
*   **通过内存高效的处理流水线处理大规模数据集**
*   **具有一致性和可靠性保证的异步数据源**

该库的创新方法从根本上重新构想了开发者与流数据的交互方式，在一个单一、连贯的包中提供了前所未有的性能和开发者人体工程学特性。

### 为什么选择 Semantic-TypeScript？

在 TypeScript 项目中选择合适的数据流处理库需要在性能、开发者体验和架构契合度之间取得平衡。Semantic-TypeScript 旨在在所有维度上都表现出色，为现代网络提供了一种范式转移的方法。以下为其脱颖而出之处：

#### 1.  **统一的、类型安全的流式范式**
Semantic-TypeScript 融合了**JavaScript GeneratorFunctions**、**Java Streams API** 和**数据库索引策略**中最有效的概念。它为处理任何数据序列（无论是静态数组、实时事件还是异步块）提供了一致的声明式 API，同时利用 TypeScript 的全部功能确保端到端的类型安全。这消除了一整类运行时错误，并将流操作转变为可预测的、编译器验证的活动。

#### 2.  **智能惰性求值带来的不妥协性能**
其核心建立在**惰性求值**之上。像 `filter`、`map` 和 `flatMap` 这样的操作仅仅组合了一个处理流水线；直到终端操作（如 `collect` 或 `toArray`）被调用时才会进行实际工作。这与**短路**能力（通过 `limit`、`anyMatch` 或自定义的 `interruptor` 函数等操作）相结合，允许在处理结果已知时提前停止，从而显著提高处理大规模或无限流的效率。

#### 3.  **架构区分：`Semantic<E>` 与 `Collectable<E>`**
该库引入了一个其他库通常缺乏的关键架构分离：
*   **`Semantic<E>`**：表示抽象的、惰性的流定义——数据转换的“蓝图”。它是不可变且可组合的。
*   **`Collectable<E>`**：表示一个物化的、可执行的流视图，提供所有终端操作。

这种分离强制了清晰的心智模型，并允许进行优化（例如，如果顺序不重要，`UnorderedCollectable` 可以跳过昂贵的排序步骤）。

#### 4.  **`Collector<E, A, R>` 模式的强大威力**
受 Java 启发，`Collector` 模式是灵活性的引擎。它将*如何累加*流元素的*规范*与流本身的*执行*解耦。库提供了一组丰富的内置收集器（`useToArray`、`useGroupBy`、`useSummate` 等）用于日常任务，同时该模式让实现您自己复杂的、可重用的归约逻辑变得简单。这比一组固定的终端方法要强大得多，也更具可组合性。

#### 5.  **对现代网络和异步数据的一流支持**
Semantic-TypeScript 专为现代前端和 Node.js 开发而设计。它为现代网络源提供了原生的工厂方法：
*   `from(iterable)`、`range()` 用于静态数据。
*   `interval()`、`animationFrame()` 用于基于时间的流。
*   `blob()` 用于分块二进制数据处理。
*   `websocket()` 用于实时消息流。
它对 `Iterable` 和 `AsyncIterable` 协议的基础支持意味着它用相同的优雅 API 处理同步和异步数据流。

#### 6.  **超越基本聚合：内置统计分析**
超越简单的求和与平均值。该库提供了专门的 `NumericStatistics` 和 `BigIntStatistics` 类，可以直接从您的流中即时访问高级统计指标——**方差、标准差、中位数、分位数、偏度、峰度**。这使复杂的数据分析变成一行代码，省去了手动实现或集成另一个专门库的麻烦。

#### 7.  **为开发者人体工程学而设计**
*   **流畅、可链式调用的 API**：将复杂的数据流水线编写为可读的、顺序的操作链。
*   **全面的实用工具套件**：开箱即用，包含必要的守卫（`isOptional`、`isSemantic`）、类型安全的实用程序（`useCompare`、`useTraverse`）和函数式接口。
*   **`Optional<T>` 集成**：安全地建模值的缺失，消除查找操作中的空指针问题。
*   **性能指南**：文档清晰地指导您何时使用 `toUnordered()`（追求最大速度）与 `toOrdered()`（当顺序重要时）。

#### 8.  **健壮、面向社区的基础**
作为一个托管在 **GitHub** 上并通过 **npm** 分发的开源库，它专为实际应用而构建。详尽的文档，附带时间和空间复杂度注解及实际示例，降低了学习曲线，并为性能敏感的应用提供了清晰性。

**总而言之，如果您寻求一个严格设计、类型安全且高性能的流处理库，它将企业级数据转换模式的力量带入 TypeScript 生态系统，同时又不妥协于现代网络开发的惯用语法和需求，请选择 Semantic-TypeScript。**

## 安装

```bash
npm install semantic-typescript
```

## 基本类型

| 类型 | 描述 |
|------|-------------|
| `Invalid<T>` | 继承自 `null` 或 `undefined` 的类型 |
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
|-----------|-------------|
| `Runnable` | 无参数无返回值的函数 |
| `Supplier<R>` | 无参数并返回 `R` 的函数 |
| `Functional<T, R>` | 单参数转换函数 |
| `BiFunctional<T, U, R>` | 双参数转换函数 |
| `TriFunctional<T, U, V, R>` | 三参数转换函数 |
| `Predicate<T>` | 单参数谓词函数 |
| `BiPredicate<T, U>` | 双参数谓词函数 |
| `TriPredicate<T, U, V>` | 三参数谓词函数 |
| `Consumer<T>` | 单参数消费者函数 |
| `BiConsumer<T, U>` | 双参数消费者函数 |
| `TriConsumer<T, U, V>` | 三参数消费者函数 |
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
| `isPromise(t: unknown): t is Promise<unknown>` | 检查是否为 Promise 对象 | O(1) | O(1) |
| `isAsyncFunction(t: unknown): t is AsyncFunction` | 检查是否为 AsyncFunction | O(1) | O(1) |
| `isGeneratorFunction(t: unknown): t is GeneratorFunction` | 检查是否为 GeneratorFunction | O(1) | O(1) |
| `isAsyncGeneratorFunction(t: unknown): t is AsyncGeneratorFunction` | 检查是否为 AsyncGeneratorFunction | O(1) | O(1) |

```typescript
// 类型守卫使用示例
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 类型安全，value 被推断为 string
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(value));
}

if(isIterable(value)){
    // 类型安全，现在它是一个可迭代对象
    for(let item of value){
        console.log(item);
    }
}
```

## 工具函数

| 函数 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 通用比较函数 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 伪随机数生成器 | O(log n) | O(1) |
| `useTraverse(t, callback)` | 深度遍历对象，不处理循环引用 | O(n) | O(1) |
| `useToNumber(t: unknown): number` | 将值转换为数字 | O(1) | O(1) |
| `useToBigInt(t: unknown): bigint` | 将值转换为 BigInt | O(1) | O(1) |

```typescript
// 工具函数使用示例
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum: number = useRandom(42); // 基于种子的随机数

let o = {
    a: 1,
    b: {
        c: 2,
        d: o
    },
    c: [1, 3, 5, o],
    e: undefined,
    f: null
};
useTraverse(o, (value, key): boolean => {
    console.log(key, value);
    /*
    a 1
    c 2
    1 3 5
    循环引用、undefined 和 null 值不会被遍历。
    */
    return true; // 返回 true 以继续遍历
});

let toBeResolved: object = {
    [Symbol.toPrimitive]: () => 5
};
let resolvedNumber: number = useToNumber(toBeResolved); // 5
let resolvedBigInt: bigint = useToBigInt(toBeResolved); // 5n
```

## 工厂方法

### Optional 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 创建一个空的 Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | 创建一个包含值的 Optional | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 创建一个可能为空的 Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 创建一个非 null 的 Optional | O(1) | O(1) |

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
| `Collector.full(identity, accumulator, finisher)` | 创建一个完整收集器 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 创建一个可中断的收集器 | O(1) | O(1) |
| `useAnyMatch<E>(predicate)` | 创建一个短路的收集器，如果任何元素匹配谓词则返回 true | O(n) | O(1) |
| `useAllMatch<E>(predicate)` | 创建一个短路的收集器，如果所有元素匹配谓词则返回 true | O(n) | O(1) |
| `useCollect<E, A, R>(identity, accumulator, finisher)` | 使用 identity、accumulator、finisher 创建一个完整收集器 | O(1) | O(1) |
| `useCollect<E, A, R>(identity, interruptor, accumulator, finisher)` | 使用 identity、interruptor、accumulator、finisher 创建一个可短路的收集器 | O(1) | O(1) |
| `useCount<E>()` | 创建一个统计元素数量的完整收集器 | O(n) | O(1) |
| `useError<E>()` | 创建一个打印错误的收集器 | O(n) | O(1) |
| `useError<E>(accumulator)` | 创建一个打印累计错误的收集器 | O(n) | O(1) |
| `useError<E>(prefix, accumulator, suffix)` | 创建一个打印带前缀和后缀累计错误的收集器 | O(n) | O(1) |
| `useFindFirst<E>()` | 创建一个返回第一个元素的短路的收集器 | O(n) | O(1) |
| `useFindAny<E>()` | 创建一个返回任意元素的短路的收集器 | O(n) | O(1) |
| `useFindLast<E>()` | 创建一个返回最后一个元素的完整收集器 | O(n) | O(1) |
| `useFindMaximum<E>()` | 创建一个返回最大元素的完整收集器 | O(n) | O(1) |
| `useFindMaximum<E>(comparator?)` | 创建一个返回最大元素的完整收集器 | O(n) | O(1) |
| `useFindMinimum<E>()` | 创建一个返回最小元素的完整收集器 | O(n) | O(1) |
| `useFindMinimum<E>(comparator?)` | 创建一个返回最小元素的完整收集器 | O(n) | O(1) |
| `useForEach<E>(action)` | 创建一个为每个元素执行操作的完整收集器 | O(n) | O(1) |
| `useNoneMatch<E>(predicate)` | 创建一个短路的收集器，如果没有元素匹配谓词则返回 true | O(n) | O(1) |
| `useGroup<E, K>(classifier)` | 创建一个按分类器键对元素分组的完整收集器 | O(n) | O(n) |
| `useGroupBy<E, K, V>(keyExtractor, valueExtractor)` | 创建一个按提取的键对元素分组，并提取值的完整收集器 | O(n) | O(n) |
| `useJoin<E>()` | 创建一个使用默认格式将元素连接成字符串的完整收集器 | O(n) | O(1) |
| `useJoin<E>(delimiter)` | 创建一个使用分隔符连接元素的完整收集器 | O(n) | O(1) |
| `useJoin<E>(prefix, delimiter, suffix)` | 创建一个使用前缀、分隔符、后缀连接元素的完整收集器 | O(n) | O(1) |
| `useJoin<E>(prefix, accumulator, suffix)` | 创建一个通过自定义累加器连接元素的完整收集器 | O(n) | O(1) |
| `useLog<E>()` | 创建一个使用默认格式将元素记录到控制台的完整收集器 | O(n) | O(1) |
| `useLog<E>(accumulator)` | 创建一个通过自定义累加器记录元素的完整收集器 | O(n) | O(1) |
| `useLog<E>(prefix, accumulator, suffix)` | 创建一个通过累加器记录元素，并带前缀/后缀的完整收集器 | O(n) | O(1) |
| `usePartition<E>(count)` | 创建一个将元素分割为指定大小块的完整收集器 | O(n) | O(n) |
| `usePartitionBy<E>(classifier)` | 创建一个按分类器结果对元素分区的完整收集器 | O(n) | O(n) |
| `useReduce<E>(accumulator)` | 创建一个无初始值归约元素的完整收集器 | O(n) | O(1) |
| `useReduce<E>(identity, accumulator)` | 创建一个带有初始值归约元素的完整收集器 | O(n) | O(1) |
| `useReduce<E, R>(identity, accumulator, finisher)` | 创建一个带有 identity、accumulator、finisher 归约元素的完整收集器 | O(n) | O(1) |
| `useToArray<E>()` | 创建一个将元素收集到数组的完整收集器 | O(n) | O(n) |
| `useToMap<E, K, V>(keyExtractor, valueExtractor)` | 创建一个将元素收集到 Map 的完整收集器 | O(n) | O(n) |
| `useToSet<E>()` | 创建一个将元素收集到 Set 的完整收集器 | O(n) | O(n) |
| `useWrite<E, S>(stream)` | 创建一个将元素写入流的完整收集器 | O(n) | O(1) |
| `useWrite<E, S>(stream, accumulator)` | 创建一个通过自定义累加器将元素写入流的完整收集器 | O(n) | O(1) |
| `useNumericAverage<E>(mapper)` | 创建一个通过映射器计算数字平均值的完整收集器 | O(n) | O(1) |
| `useNumericAverage<E>()` | 创建一个计算数字平均值的完整收集器 | O(n) | O(1) |
| `useBigIntAverage<E>(mapper)` | 创建一个通过映射器计算 BigInt 平均值的完整收集器 | O(n) | O(1) |
| `useBigIntAverage<E>()` | 创建一个计算 BigInt 平均值的完整收集器 | O(n) | O(1) |
| `useFrequency<E>()` | 创建一个统计元素频率的完整收集器 | O(n) | O(n) |
| `useNumericSummate<E>()` | 创建一个对数字元素求和的完整收集器 | O(n) | O(1) |
| `useNumericSummate<E>(mapper)` | 创建一个对映射后的数字值求和的完整收集器 | O(n) | O(1) |
| `useBigIntSummate<E>()` | 创建一个对数字元素求和的完整收集器 | O(n) | O(1) |
| `useBigIntSummate<E>(mapper)` | 创建一个对映射后的数字值求和的完整收集器 | O(n) | O(1) |
| `useNumericAverage<E>()` | 创建一个计算数字平均值的完整收集器 | O(n) | O(1) |
| `useNumericAverage<E>(mapper)` | 创建一个通过映射器计算数字平均值的完整收集器 | O(n) | O(1) |
| `useBigIntAverage<E>()` | 创建一个计算 BigInt 平均值的完整收集器 | O(n) | O(1) |
| `useBigIntAverage<E>(mapper)` | 创建一个通过映射器计算 BigInt 平均值的完整收集器 | O(n) | O(1) |
| `useFrequency<E>()` | 创建一个统计元素频率的完整收集器 | O(n) | O(n) |
| `useNumericMode<E>()` | 创建一个计算数字众数的完整收集器 | O(n) | O(n) |
| `useNumericMode<E>(mapper)` | 创建一个通过映射器计算数字众数的完整收集器 | O(n) | O(n) |
| `useBigIntMode<E>()` | 创建一个计算 BigInt 众数的完整收集器 | O(n) | O(n) |
| `useBigIntMode<E>(mapper)` | 创建一个通过映射器计算 BigInt 众数的完整收集器 | O(n) | O(n) |
| `useNumericVariance<E>()` | 创建一个计算数字方差的完整收集器 | O(n) | O(1) |
| `useNumericVariance<E>(mapper)` | 创建一个通过映射器计算数字方差的完整收集器 | O(n) | O(1) |
| `useBigIntVariance<E>()` | 创建一个计算 BigInt 方差的完整收集器 | O(n) | O(1) |
| `useBigIntVariance<E>(mapper)` | 创建一个通过映射器计算 BigInt 方差的完整收集器 | O(n) | O(1) |
| `useNumericStandardDeviation<E>()` | 创建一个计算数字标准差的完整收集器 | O(n) | O(1) |
| `useNumericStandardDeviation<E>(mapper)` | 创建一个通过映射器计算数字标准差的完整收集器 | O(n) | O(1) |
| `useBigIntStandardDeviation<E>()` | 创建一个计算 BigInt 标准差的完整收集器 | O(n) | O(1) |
| `useBigIntStandardDeviation<E>(mapper)` | 创建一个通过映射器计算 BigInt 标准差的完整收集器 | O(n) | O(1) |
| `useNumericMedian<E>()` | 创建一个计算数字中位数的完整收集器 | O(n) | O(1) |
| `useNumericMedian<E>(mapper)` | 创建一个通过映射器计算数字中位数的完整收集器 | O(n) | O(1) |
| `useBigIntMedian<E>()` | 创建一个计算 BigInt 中位数的完整收集器 | O(n) | O(1) |
| `useBigIntMedian<E>(mapper)` | 创建一个通过映射器计算 BigInt 中位数的完整收集器 | O(n) | O(1) |
| `useToGeneratorFunction<E>()` | 创建一个将流转换为生成器函数的完整收集器 | O(n) | O(1) |
| `useToAsyncGeneratorFunction<E>()` | 创建一个将流转换为异步生成器函数的完整收集器 | O(n) | O(1) |

```typescript
// 收集器转换示例
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 性能优先：使用无序收集器
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnoredered();

// 需要排序：使用有序收集器
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// 统计元素数量
let count: Collector<number, number, number> = useCount();
count.collect(from([1,2,3,4,5])); // 从流中统计
count.collect([1,2,3,4,5]); // 从可迭代对象中统计

// 查找第一个元素
let findFirst: Collector<number, number, number> = useFindFirst();
find.collect(from([1,2,3,4,5])); // 从流中查找第一个元素
find.collect([1,2,3,4,5]); // 从可迭代对象中查找第一个元素

// 计算元素总和
let summate: Collector<number, number, number> = useSummate();
summate.collect(from([1,2,3,4,5])); // 从流中求和
summate.collect([1,2,3,4,5]); // 从可迭代对象中求和

// 计算元素平均值
let average: Collector<number, number, number> = useNumericAverage();
average.collect(from([1,2,3,4,5])); // 从流中求平均
average.collect([1,2,3,4,5]); // 从可迭代对象中求平均
```

## Collector 类方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `collect(stream)` | 从流中收集元素 | O(n) | O(1) |
| `collect(iterable)` | 从可迭代对象中收集元素 | O(n) | O(1) |
| `collect(generator)` | 从生成器中收集元素 | O(n) | O(1) |
| `collect(semantic)` | 从 semantic 流中收集元素 | O(n) | O(1) |
| `collect(collectable)` | 从 collectable 流中收集元素 | O(n) | O(1) |
| `collect(start, endExelusive)` | 从范围中收集元素 | O(n) | O(1) |

### Semantic 工厂方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | 创建一个定时的动画帧流 | O(1)* | O(1) |
| `attribute(target)` | 从对象的深层属性创建流 | O(n) | O(1) |
| `blob(blob, chunkSize)` | 从 Blob 创建流 | O(n) | O(chunkSize) |
| `empty<E>()` | 创建一个空流 | O(1) | O(1) |
| `fill<E>(element, count)` | 创建一个填充流 | O(n) | O(1) |
| `from<E>(iterable)` | 从可迭代对象创建流 | O(1) | O(1) |
| `interval(period, delay?)` | 创建一个定时间隔流 | O(1)* | O(1) |
| `iterate<E>(generator)` | 从生成器创建流 | O(1) | O(1) |
| `promise<E>(promise)` | 从 Promise 创建流 | O(1) | O(1) |
| `range(start, end, step)` | 创建数值范围流 | O(n) | O(1) |
| `websocket(websocket)` | 从 WebSocket 创建流 | O(1) | O(1) |

```typescript
// Semantic 工厂方法使用示例

// 从定时动画帧创建流
animationFrame(1000)
    .toUnordered()
    .forEach((frame): void => console.log(frame));

// 从 Blob 创建流（分块读取）
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // 写入流成功
    .catch(callback); // 写入流失败

// 创建一个空流，在与其他流连接之前不会执行
empty<string>()
    .toUnordered()
    .join(); //[]

// 创建一个填充流
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 创建一个具有初始 2 秒延迟和 5 秒执行周期的定时流，基于定时器机制实现；可能因系统调度精度限制而出现时间漂移。
let intervalStream = interval(5000, 2000);

// 从可迭代对象创建流
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// 从已解析的 Promise 创建流
let promisedStream: Semantic<Array<number>> = promise(Promise.resolve([1, 2, 3, 4, 5]));

// 创建范围流
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 事件流
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message"); // 仅监听消息事件
  .toUnordered() // 通常事件不需要有序
  .forEach((event): void => receive(event)); // 接收消息
```

## Semantic 类方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `concat(semantic)` | 连接两个流 | O(n) | O(1) |
| `concat(iterable)` | 从可迭代对象连接 | O(n) | O(1) |
| `distinct()` | 去重 | O(n) | O(n) |
| `distinct(comparator)` | 使用比较器去重 | O(n²) | O(n) |
| `dropWhile(predicate)` | 丢弃满足条件的元素 | O(n) | O(1) |
| `filter(predicate)` | 过滤元素 | O(n) | O(1) |
| `flat(mapper)` | 扁平化映射 | O(n × m) | O(1) |
| `flatMap(mapper)` | 扁平化映射为新类型 | O(n × m) | O(1) |
| `limit(n)` | 限制元素数量 | O(n) | O(1) |
| `map(mapper)` | 映射转换 | O(n) | O(1) |
| `peek(consumer)` | 查看元素 | O(n) | O(1) |
| `redirect(redirector)` | 重定向索引 | O(n) | O(1) |
| `reverse()` | 反转流 | O(n) | O(1) |
| `shuffle()` | 随机洗牌 | O(n) | O(1) |
| `shuffle(mapper)` | 使用映射器洗牌 | O(n) | O(1) |
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
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // 将每个元素映射为两个
    .distinct()                      // 去重
    .shuffle()                       // 打乱顺序
    .takeWhile((n: number): boolean => n < 50)         // 取出小于 50 的元素
    .toOrdered()                     // 转换为有序收集器
    .toArray();                      // 转换为数组
```

## Semantic 转换方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `sorted()` | 转换为有序收集器 | O(n log n) | O(n) |
| `sorted(comparator)` | 使用比较器转换为有序收集器 | O(n log n) | O(n) |
| `toUnordered()` | 转换为无序收集器 | O(1) | O(1) |
| `toOrdered()` | 转换为有序收集器 | O(1) | O(1) |
| `toNumericStatistics()` | 转换为数字统计 | O(n) | O(1) |
| `toBigintStatistics()` | 转换为 BigInt 统计 | O(n) | O(1) |
| `toWindow()` | 转换为窗口收集器 | O(1) | O(1) |
| `toCollectable()` | 转换为 `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | 转换为自定义的 collectable | O(n) | O(1) |

```typescript
// 转换为升序排序数组
from([6,4,3,5,2]) // 创建流
    .sorted() // 将流按升序排序
    .toArray(); // [2, 3, 4, 5, 6]

// 转换为降序排序数组
from([6,4,3,5,2]) // 创建流
    .soted((a: number, b: number): number => b - a) // 将流按降序排序
    .toArray(); // [6, 5, 4, 3, 2]

// 重定向到反向数组
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // 重定向到反序
    .toOrderd() // 保持重定向后的顺序
    .toArray(); // [2, 5, 3, 4, 6]

// 忽略重定向以反转数组
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // 重定向到反序
    .toUnorderd() // 丢弃重定向顺序。此操作将忽略 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 反转流为数组
from([6, 4, 3, 5, 2])
    .reverse() // 反转流
    .toOrdered() // 保证反转后的顺序
    .toArray(); // [2, 5, 3, 4, 6]

// 覆盖洗牌流到数组
from([6, 4, 3, 5, 2])
    .shuffle() // 打乱流
    .sorted() // 覆盖洗牌顺序。此操作将覆盖 `redirect`、`reverse`、`shuffle` 和 `translate` 操作
    .toArray(); // [2, 5, 3, 4, 6]

// 转换为窗口收集器
from([6, 4, 3, 5, 2]).toWindow();

// 转换为数字统计
from([6, 4, 3, 5, 2]).toNumericStatistics();

// 转换为 BigInt 统计
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// 定义自定义收集器来收集数据
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable 收集方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 是否有任何元素匹配谓词 | O(n) | O(1) |
| `allMatch(predicate)` | 是否所有元素都匹配谓词 | O(n) | O(1) |
| `collect(collector)` | 使用给定的收集器收集元素 | O(n) | O(1) |
| `collect(identity, accumulator, finisher)` | 使用 identity、accumulator 和 finisher 收集元素 | O(n) | O(1) |
| `collect(identity, interruptor, accumulator, finisher)` | 使用 identity、interruptor、accumulator 和 finisher 收集元素 | O(n) | O(1) |
| `count()` | 统计元素数量 | O(n) | O(1) |
| `error()` | 使用默认错误格式将元素记录到控制台 | O(n) | O(1) |
| `error(accumulator)` | 通过自定义累加器错误格式记录元素 | O(n) | O(1) |
| `error(prefix, accumulator, suffix)` | 使用前缀、自定义累加器和后缀记录元素 | O(n) | O(1) |
| `isEmpty()` | 检查 collectable 是否为空 | O(n) | O(1) |
| `findAny()` | 在 collectable 中查找任意元素 | O(n) | O(1) |
| `findFirst()` | 在 collectable 中查找第一个元素 | O(n) | O(1) |
| `findLast()` | 在 collectable 中查找最后一个元素 | O(n) | O(1) |
| `findMaximum()` | 在 collectable 中查找最大元素 | O(n) | O(1) |
| `findMaximum(comparator)` | 使用比较器在 collectable 中查找最大元素 | O(n) | O(1) |
| `findMinimum()` | 在 collectable 中查找最小元素 | O(n) | O(1) |
| `findMinimum(comparator)` | 使用比较器在 collectable 中查找最小元素 | O(n) | O(1) |
| `forEach(action)` | 使用消费者或二元消费者遍历所有元素 | O(n) | O(1) |
| `group(classifier)` | 通过分类器函数对元素分组 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 通过键和值提取器对元素分组 | O(n) | O(n) |
| `join()` | 使用默认格式将元素连接成字符串 | O(n) | O(n) |
| `join(delimiter)` | 使用分隔符将元素连接成字符串 | O(n) | O(n) |
| `join(prefix, delimiter, suffix)` | 使用前缀、分隔符和后缀连接元素 | O(n) | O(n) |
| `join(prefix, accumulator, suffix)` | 通过自定义累加器连接元素，并带前缀和后缀 | O(n) | O(n) |
| `log()` | 使用默认格式将元素记录到控制台 | O(n) | O(1) |
| `log(accumulator)` | 通过自定义累加器记录元素 | O(n) | O(1) |
| `log(prefix, accumulator, suffix)` | 使用前缀、自定义累加器和后缀记录元素 | O(n) | O(1) |
| `nonMatch(predicate)` | 是否有任何元素不匹配谓词 | O(n) | O(1) |
| `partition(count)` | 将元素分割为指定大小的块 | O(n) | O(n) |
| `partitionBy(classifier)` | 通过分类器函数对元素分区 | O(n) | O(n) |
| `reduce(accumulator)` | 使用累加器归约元素（无初始值） | O(n) | O(1) |
| `reduce(identity, accumulator)` | 使用初始值和累加器归约元素 | O(n) | O(1) |
| `reduce(identity, accumulator, finisher)` | 使用初始值、累加器和 finisher 归约元素 | O(n) | O(1) |
| `semantic()` | 将 collectable 转换为语义对象 | O(1) | O(1) |
| `source()` | 获取 collectable 的源 | O(1) | O(1) |
| `toArray()` | 将元素转换为数组 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 通过键和值提取器将元素转换为 Map | O(n) | O(n) |
| `toSet()` | 将元素转换为 Set | O(n) | O(n) |
| `write(stream)` | 将元素写入流（默认格式） | O(n) | O(1) |
| `write(stream, accumulator)` | 通过自定义累加器将元素写入流 | O(n) | O(1) |

```typescript
// Collectable 操作示例
let data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// 匹配检查
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// 查找操作
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // 任意元素

// 分组操作
let grouped = data.groupBy(
    (n: number): string => n > 5 ? "large" : "small",
    (n: number): number => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// 归约操作
let sum = data.reduce(0, (accumulator: number, n: number): number => accumulator + n); // 30

// 输出操作
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Unordered Collectable 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |

## Ordered Collectable 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |

## 统计分析方法

### Statistics 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |
| `count()` | 统计元素数量 | O(n) | O(1) |
| `frequency()` | 频率分布 | O(n) | O(n) |

### NumericStatistics 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------|------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |
| `average()` | 计算元素平均值 | O(n) | O(1) |
| `average(mapper)` | 使用映射器计算元素平均值 | O(n) | O(1) |
| `range()` | 计算元素范围 | O(n) | O(1) |
| `range(mapper)` | 使用映射器计算元素范围 | O(n) | O(1) |
| `variance()` | 计算元素方差 | O(n) | O(1) |
| `variance(mapper)` | 使用映射器计算元素方差 | O(n) | O(1) |
| `standardDeviation()` | 计算元素标准差 | O(n) | O(1) |
| `standardDeviation(mapper)` | 使用映射器计算元素标准差 | O(n) | O(1) |
| `mean()` | 计算元素均值 | O(n) | O(1) |
| `mean(mapper)` | 使用映射器计算元素均值 | O(n) | O(1) |
| `median()` | 计算元素中位数 | O(n) | O(1) |
| `median(mapper)` | 使用映射器计算元素中位数 | O(n) | O(1) |
| `mode()` | 计算元素众数 | O(n) | O(1) |
| `mode(mapper)` | 使用映射器计算元素众数 | O(n) | O(1) |
| `summate()` | 计算元素总和 | O(n) | O(1) |
| `summate(mapper)` | 使用映射器计算元素总和 | O(n) | O(1) |
| `quantile(quantile)` | 计算元素分位数 | O(n) | O(1) |
| `quantile(quantile, mapper)` | 使用映射器计算元素分位数 | O(n) | O(1) |
| `interquartileRange()` | 计算元素四分位距 | O(n) | O(1) |
| `interquartileRange(mapper)` | 使用映射器计算元素四分位距 | O(n) | O(1) |
| `skewness()` | 计算元素偏度 | O(n) | O(1) |
| `skewness(mapper)` | 使用映射器计算元素偏度 | O(n) | O(1) |
| `kurtosis()` | 计算元素峰度 | O(n) | O(1) |
| `kurtosis(mapper)` | 使用映射器计算元素峰度 | O(n) | O(1) |

```typescript
// 统计分析示例
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("平均值:", numbers.mean()); // 5.5
console.log("中位数:", numbers.median()); // 5.5
console.log("标准差:", numbers.standardDeviation()); // ~2.87
console.log("总和:", numbers.summate()); // 55

// 使用映射器的统计分析
let objects = from([
    { value: 10 },
    { value: 20 },
    { value: 30 }
]).toNumericStatistics();

console.log("映射后的平均值:", objects.mean(obj => obj.value)); // 20
```

### BigintStatistics 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |
| `average()` | 计算元素平均值 | O(n) | O(1) |
| `average(mapper)` | 使用映射器计算元素平均值 | O(n) | O(1) |
| `range()` | 计算元素范围 | O(n) | O(1) |
| `range(mapper)` | 使用映射器计算元素范围 | O(n) | O(1) |
| `variance()` | 计算元素方差 | O(n) | O(1) |
| `variance(mapper)` | 使用映射器计算元素方差 | O(n) | O(1) |
| `standardDeviation()` | 计算元素标准差 | O(n) | O(1) |
| `standardDeviation(mapper)` | 使用映射器计算元素标准差 | O(n) | O(1) |
| `mean()` | 计算元素均值 | O(n) | O(1) |
| `mean(mapper)` | 使用映射器计算元素均值 | O(n) | O(1) |
| `median()` | 计算元素中位数 | O(n) | O(1) |
| `median(mapper)` | 使用映射器计算元素中位数 | O(n) | O(1) |
| `mode()` | 计算元素众数 | O(n) | O(1) |
| `mode(mapper)` | 使用映射器计算元素众数 | O(n) | O(1) |
| `summate()` | 计算元素总和 | O(n) | O(1) |
| `summate(mapper)` | 使用映射器计算元素总和 | O(n) | O(1) |
| `quantile(quantile)` | 计算元素分位数 | O(n) | O(1) |
| `quantile(quantile, mapper)` | 使用映射器计算元素分位数 | O(n) | O(1) |
| `interquartileRange()` | 计算元素四分位距 | O(n) | O(1) |
| `interquartileRange(mapper)` | 使用映射器计算元素四分位距 | O(n) | O(1) |
| `skewness()` | 计算元素偏度 | O(n) | O(1) |
| `skewness(mapper)` | 使用映射器计算元素偏度 | O(n) | O(1) |
| `kurtosis()` | 计算元素峰度 | O(n) | O(1) |
| `kurtosis(mapper)` | 使用映射器计算元素峰度 | O(n) | O(1) |

### Window Collectable 方法

| 方法 | 描述 | 时间复杂度 | 空间复杂度 |
|------------|------------|------------|------------|
| `*` | 遍历所有元素 | O(n) | O(1) |
| `*` | 异步遍历所有元素 | O(n) | O(1) |
| `slide(size)` | 滑动指定大小的窗口 | O(n) | O(1) |
| `slide(size, step)` | 滑动指定大小和步长的窗口 | O(n) | O(1) |
| `tumble(size)` | 滚动指定大小的窗口 | O(n) | O(1) |

## 性能选择指南

### 选择无序收集器（性能优先）
```typescript
// 当不需要顺序保证时，使用无序收集器以获得最佳性能
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 最佳性能
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
    .toNumericStatistics(); // 数字统计

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // 大整数统计
```

https://github.com/eloyhere/semantic-typescript
https://www.npmjs.com/package/semantic-typescript

## 重要说明

1.  **排序操作的影响**：在有序收集器中，`sorted()` 操作会覆盖 `redirect`、`translate`、`shuffle`、`reverse` 的效果。
2.  **性能考量**：如果不需要顺序保证，优先使用 `toUnoredered()` 以获得更好的性能。
3.  **内存使用**：排序操作需要 O(n) 的额外空间。
4.  **实时数据**：Semantic 流适用于处理实时数据，并支持异步数据源。

这个库为 TypeScript 开发者提供了强大而灵活的流式处理能力，结合了函数式编程的优势和类型安全的保证。