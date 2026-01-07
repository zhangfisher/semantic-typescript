# Semantic-TypeScript ストリーム処理ライブラリ

## 概要

Semantic-TypeScriptは、JavaScript GeneratorFunction、Java Stream、MySQL Indexにインスパイアされたモダンなストリーム処理ライブラリです。このライブラリのコア設計は、データインデックスに基づいた効率的なデータ処理パイプラインの構築にあり、型安全で関数型スタイルのストリーム操作体験をフロントエンド開発者に提供します。

従来の同期処理とは異なり、Semanticは非同期処理モードを採用しています。データストリームを作成する際、端末がデータを受信するタイミングは、アップストリームが`accept`および`interrupt`コールバック関数をいつ呼び出すかに完全に依存します。この設計により、ライブラリはリアルタイムデータストリーム、大規模データセット、非同期データソースを優雅に処理できます。

## インストール

```bash
npm install semantic-typescript
```

## 基本型

| 型 | 説明 |
|------|-------------|
| `Invalid<T>` | `null` または `undefined` を拡張する型 |
| `Valid<T>` | `null` および `undefined` を除外する型 |
| `MaybeInvalid<T>` | `null` または `undefined` になり得る型 |
| `Primitive` | プリミティブ型の集合 |
| `MaybePrimitive<T>` | プリミティブ型になり得る型 |
| `OptionalSymbol` | `Optional` クラスのシンボル識別子 |
| `SemanticSymbol` | `Semantic` クラスのシンボル識別子 |
| `CollectorsSymbol` | `Collector` クラスのシンボル識別子 |
| `CollectableSymbol` | `Collectable` クラスのシンボル識別子 |
| `OrderedCollectableSymbol` | `OrderedCollectable` クラスのシンボル識別子 |
| `WindowCollectableSymbol` | `WindowCollectable` クラスのシンボル識別子 |
| `StatisticsSymbol` | `Statistics` クラスのシンボル識別子 |
| `NumericStatisticsSymbol` | `NumericStatistics` クラスのシンボル識別子 |
| `BigIntStatisticsSymbol` | `BigIntStatistics` クラスのシンボル識別子 |
| `UnorderedCollectableSymbol` | `UnorderedCollectable` クラスのシンボル識別子 |

## 関数型インターフェース

| インターフェース | 説明 |
|------------------|-------------|
| `Runnable` | 引数も戻り値も持たない関数 |  
| `Supplier<R>` | 引数なしで `R` を返す関数 |  
| `Functional<T, R>` | 単一引数の変換関数 |
| `BiFunctional<T, U, R>` | 二引数の変換関数 |
| `TriFunctional<T, U, V, R>` | 三引数の変換関数 |
| `Predicate<T>` | 単一引数の述語関数 |
| `BiPredicate<T, U>` | 二引数の述語関数 |
| `TriPredicate<T, U, V>` | 三引数の述語関数 |
| `Consumer<T>` | 単一引数の消費関数 |
| `BiConsumer<T, U>` | 二引数の消費関数 |
| `TriConsumer<T, U, V>` | 三引数の消費関数 |
| `Comparator<T>` | 二引数の比較関数 |
| `Generator<T>` | ジェネレーター関数（コアおよび基盤） |

```typescript
// 型使用例
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## 型ガード

| 関数 | 説明 | 時間計算量 | 空間計算量 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 値がnullまたはundefinedでないことを検証 | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 値がnullまたはundefinedであることを検証 | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | ブーリアンかどうかチェック | O(1) | O(1) |
| `isString(t: unknown): t is string` | 文字列かどうかチェック | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 数値かどうかチェック | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 関数かどうかチェック | O(1) | O(1) |
| `isObject(t: unknown): t is object` | オブジェクトかどうかチェック | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | シンボルかどうかチェック | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | BigIntかどうかチェック | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | プリミティブ型かどうかチェック | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 反復可能かどうかチェック | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Optionalインスタンスかどうかチェック | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Semanticインスタンスかどうかチェック | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Collectorインスタンスかどうかチェック | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Collectableインスタンスかどうかチェック | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | OrderedCollectableインスタンスかどうかチェック | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | WindowCollectableインスタンスかどうかチェック | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | UnorderedCollectableインスタンスかどうかチェック | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Statisticsインスタンスかどうかチェック | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | NumericStatisticsインスタンスかどうかチェック | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | BigIntStatisticsインスタンスかどうかチェック | O(1) | O(1) |

```typescript
// 型ガード使用例
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 型安全、valueはstringと推論
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## ユーティリティ関数

| 関数 | 説明 | 時間計算量 | 空間計算量 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 汎用比較関数 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 擬似乱数生成器 | O(log n) | O(1) |

```typescript
// ユーティリティ関数使用例
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // シードベースの乱数
const randomBigInt = useRandom(1000n); // BigInt乱数
```

## ファクトリメソッド

### Optionalファクトリメソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `Optional.empty<T>()` | 空のOptionalを作成 | O(1) | O(1) |
| `Optional.of<T>(value)` | 値を持つOptionalを作成 | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | null許容Optionalを作成 | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 非nullOptionalを作成 | O(1) | O(1) |

```typescript
// Optional使用例
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // 42を出力
console.log(emptyOpt.orElse(100)); // 100を出力
```

### Collectorファクトリメソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 完全なコレクターを作成 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 中断可能なコレクターを作成 | O(1) | O(1) |

```typescript
// コレクター変換の例
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// パフォーマンス優先：非順序コレクターを使用
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// ソートが必要：順序付きコレクターを使用  
const ordered = numbers.sorted();

// 要素数をカウント
let count = Collector.full(
    () => 0, // 初期値
    (accumulator, element) => accumulator + element, // 蓄積
    (accumulator) => accumulator // 完了
);
count.collect(from([1,2,3,4,5])); // ストリームからカウント
count.collect([1,2,3,4,5]); // イテラブルオブジェクトからカウント

let find = Collector.shortable(
    () => Optional.empty(), // 初期値
    (element, index, accumulator) => accumulator.isPresent(), // 中断
    (accumulator, element, index) => Optional.of(element), // 蓄積
    (accumulator) => accumulator // 完了
);
find.collect(from([1,2,3,4,5])); // 最初の要素を検索
find.collect([1,2,3,4,5]); // 最初の要素を検索
```

### Semanticファクトリメソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `blob(blob, chunkSize)` | Blobからストリームを生成 | O(n) | O(chunkSize) |
| `empty<E>()` | 空のストリームを生成 | O(1) | O(1) |
| `fill<E>(element, count)` | 埋め尽くされたストリームを生成 | O(n) | O(1) |
| `from<E>(iterable)` | 反復可能オブジェクトからストリームを生成 | O(1) | O(1) |
| `generate<E>(element, interrupt)` | ジェネレータからストリームを生成 | O(1) | O(1) |
| `interval(period, delay?)` | 定期的なインターバルストリームを生成 | O(1)* | O(1) |
| `iterate<E>(generator)` | ジェネレータからストリームを生成 | O(1) | O(1) |
| `range(start, end, step)` | 数値範囲ストリームを生成 | O(n) | O(1) |
| `websocket(websocket)` | WebSocketからストリームを生成 | O(1) | O(1) |

```typescript
// Semanticファクトリメソッドの使用例

// Blobからストリームを作成（チャンク読み込み）
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // ストリーム書き込み成功
  .catch(writeFi); // ストリーム書き込み失敗

// 他のストリームと連結されるまで実行されない空ストリームを作成
empty<string>()
  .toUnordered()
  .join(); //[]

// 埋め尽くされたストリームを作成
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 初期遅延2秒、実行周期5秒の時系列ストリームを作成
// タイマーメカニズムで実装、システムスケジューリング制限による時間変動の可能性あり
const intervalStream = interval(5000, 2000);

// 反復可能オブジェクトからストリームを作成
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// 範囲ストリームを作成
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocketイベントストリーム
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // メッセージイベントのみ監視
  .toUnordered() // イベントは通常ソート不要
  .forEach((event)=> receive(event)); // メッセージ受信
```

## Semanticクラスメソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `concat(other)` | 二つのストリームを連結 | O(n) | O(1) |
| `distinct()` | 重複排除 | O(n) | O(n) |
| `distinct(comparator)` | コンパレーターを使用した重複排除 | O(n²) | O(n) |
| `dropWhile(predicate)` | 条件を満たす要素を破棄 | O(n) | O(1) |
| `filter(predicate)` | 要素のフィルタリング | O(n) | O(1) |
| `flat(mapper)` | フラットマッピング | O(n × m) | O(1) |
| `flatMap(mapper)` | 新しい型へのフラットマッピング | O(n × m) | O(1) |
| `limit(n)` | 要素数の制限 | O(n) | O(1) |
| `map(mapper)` | マッピング変換 | O(n) | O(1) |
| `peek(consumer)` | 要素の検査 | O(n) | O(1) |
| `redirect(redirector)` | インデックスのリダイレクト | O(n) | O(1) |
| `reverse()` | ストリームの反転 | O(n) | O(1) |
| `shuffle()` | ランダムシャッフル | O(n) | O(1) |
| `shuffle(mapper)` | マッパーを使用したシャッフル | O(n) | O(1) |
| `skip(n)` | 最初のn要素をスキップ | O(n) | O(1) |
| `sorted()` | ソート | O(n log n) | O(n) |
| `sorted(comparator)` | コンパレーターを使用したソート | O(n log n) | O(n) |
| `sub(start, end)` | サブストリームの取得 | O(n) | O(1) |
| `takeWhile(predicate)` | 条件を満たす要素を取得 | O(n) | O(1) |
| `translate(offset)` | インデックスの平行移動 | O(n) | O(1) |
| `translate(translator)` | トランスレーターを使用した平行移動 | O(n) | O(1) |

```typescript
// Semantic操作例
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // 偶数のフィルタリング
    .map(n => n * 2)                 // 2倍に変換
    .skip(1)                         // 最初の要素をスキップ
    .limit(3)                        // 3要素に制限
    .toUnordered()                    // 非順序コレクターに変換
    .toArray();                      // 配列に変換
// 結果: [8, 12, 20]

// 複雑な操作例
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // 各要素を2要素にマッピング
    .distinct()                      // 重複排除
    .shuffle()                       // ランダムシャッフル
    .takeWhile(n => n < 50)         // 50未満の要素を取得
    .toOrdered()                     // 順序付きコレクターに変換
    .toArray();                      // 配列に変換
```

## 意味論的変換メソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|------------|------------|------------|------------|
| `sorted()` | 順序付きコレクターに変換 | O(n log n) | O(n) |
| `toUnordered()` | 順序なしコレクターに変換 | O(1) | O(1) |
| `toOrdered()` | 順序付きコレクターに変換 | O(1) | O(1) |
| `toNumericStatistics()` | 数値統計に変換 | O(n) | O(1) |
| `toBigintStatistics()` | bigint 統計に変換 | O(n) | O(1) |
| `toWindow()` | ウィンドウコレクターに変換 | O(1) | O(1) |
| `toCollectable()` | `UnorderdCollectable` に変換 | O(n) | O(1) |
| `toCollectable(mapper)` | カスタムコレクターに変換 | O(n) | O(1) |

```typescript
// 昇順ソート配列に変換
from([6,4,3,5,2]) // ストリーム作成
    .sorted() // ストリームを昇順でソート
    .toArray(); // [2, 3, 4, 5, 6]

// 降順ソート配列に変換
from([6,4,3,5,2]) // ストリーム作成
    .soted((a, b) => b - a) // ストリームを降順でソート
    .toArray(); // [6, 5, 4, 3, 2]

// 反転配列へリダイレクト
from([6,4,3,5,2])
    .redirect((element, index) => -index) // 反転順にリダイレクト
    .toOrderd() // リダイレクト後の順序を保持
    .toArray(); // [2, 5, 3, 4, 6]

// 反転配列へのリダイレクトを無視
from([6,4,3,5,2])
    .redirect((element, index) => -index) // 反転順にリダイレクト
    .toUnorderd() // リダイレクト順を破棄。この操作は `redirect`、`reverse`、`shuffle`、`translate` を無視する
    .toArray(); // [2, 5, 3, 4, 6]

// ストリームを反転して配列化
from([6, 4, 3, 5, 2])
    .reverse() // ストリームを反転
    .toOrdered() // 反転順を保証
    .toArray(); // [2, 5, 3, 4, 6]

// シャッフルしたストリームを上書きして配列化
from([6, 4, 3, 5, 2])
    .shuffle() // ストリームをシャッフル
    .sorted() // シャッフル順を上書き。この操作は `redirect`、`reverse`、`shuffle`、`translate` を上書きする
    .toArray(); // [2, 5, 3, 4, 6]

// ウィンドウコレクターに変換
from([6, 4, 3, 5, 2]).toWindow();

// 数値統計に変換
from([6, 4, 3, 5, 2]).toNumericStatistics();

// bigint 統計に変換
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// データ収集用のカスタムコレクターを定義
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable収集メソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `anyMatch(predicate)` | 一致する要素が存在するかチェック | O(n) | O(1) |
| `allMatch(predicate)` | すべての要素が一致するかチェック | O(n) | O(1) |
| `count()` | 要素のカウント | O(n) | O(1) |
| `isEmpty()` | 空かどうかチェック | O(1) | O(1) |
| `findAny()` | 任意の要素を検索 | O(n) | O(1) |
| `findFirst()` | 最初の要素を検索 | O(n) | O(1) |
| `findLast()` | 最後の要素を検索 | O(n) | O(1) |
| `forEach(action)` | 全要素の反復処理 | O(n) | O(1) |
| `group(classifier)` | 分類器によるグループ化 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | キー値抽出器によるグループ化 | O(n) | O(n) |
| `join()` | 文字列への結合 | O(n) | O(n) |
| `join(delimiter)` | 区切り文字を使用した結合 | O(n) | O(n) |
| `nonMatch(predicate)` | 一致する要素がないかチェック | O(n) | O(1) |
| `partition(count)` | 数量による分割 | O(n) | O(n) |
| `partitionBy(classifier)` | 分類器による分割 | O(n) | O(n) |
| `reduce(accumulator)` | 縮約操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 初期値付き縮約 | O(n) | O(1) |
| `toArray()` | 配列への変換 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Mapへの変換 | O(n) | O(n) |
| `toSet()` | Setへの変換 | O(n) | O(n) |
| `write(stream)` | ストリームへの書き込み | O(n) | O(1) |

```typescript
// Collectable操作例
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// 一致チェック
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// 検索操作
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // 任意の要素

// グループ化操作
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// 縮約操作
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 出力操作
data.join(", "); // "2, 4, 6, 8, 10"
```

## 統計分析メソッド

### NumericStatisticsメソッド

| メソッド | 説明 | 時間計算量 | 空間計算量 |
|---------|------|------------|------------|
| `range()` | 範囲 | O(n) | O(1) |
| `variance()` | 分散 | O(n) | O(1) |
| `standardDeviation()` | 標準偏差 | O(n) | O(1) |
| `mean()` | 平均値 | O(n) | O(1) |
| `median()` | 中央値 | O(n log n) | O(n) |
| `mode()` | 最頻値 | O(n) | O(n) |
| `frequency()` | 度数分布 | O(n) | O(n) |
| `summate()` | 合計 | O(n) | O(1) |
| `quantile(quantile)` | 分位数 | O(n log n) | O(n) |
| `interquartileRange()` | 四分位範囲 | O(n log n) | O(n) |
| `skewness()` | 歪度 | O(n) | O(1) |
| `kurtosis()` | 尖度 | O(n) | O(1) |

```typescript
// 統計分析例
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("平均値:", numbers.mean()); // 5.5
console.log("中央値:", numbers.median()); // 5.5
console.log("標準偏差:", numbers.standardDeviation()); // ~2.87
console.log("合計:", numbers.summate()); // 55

// マッパーを使用した統計分析
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("マップされた平均値:", objects.mean(obj => obj.value)); // 20
```

## パフォーマンス選択ガイド

### 非順序コレクターを選択（パフォーマンス優先）
```typescript
// 順序保証が不要な場合
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 最高のパフォーマンス
```

### 順序付きコレクターを選択（順序が必要）
```typescript
// 要素の順序を維持する必要がある場合
const ordered = data.sorted(comparator);
```

### ウィンドウコレクターを選択（ウィンドウ操作）
```typescript
// ウィンドウ操作が必要な場合
const windowed = data
    .toWindow()
    .slide(5n, 2n); // スライディングウィンドウ
```

### 統計分析を選択（数値計算）
```typescript
// 統計分析が必要な場合
const stats = data
    .toNumericStatistics(); // 数値統計

const bigIntStats = data
    .toBigintStatistics(); // BigInt統計
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 重要な注意点

1. **ソート操作の影響**: 順序付きコレクターでは、`sorted()`操作が`redirect`, `translate`, `shuffle`, `reverse`の効果を上書きします
2. **パフォーマンス考慮**: 順序保証が不要な場合は、`toUnoredered()`を優先してより良いパフォーマンスを得てください
3. **メモリ使用量**: ソート操作にはO(n)の追加スペースが必要です
4. **リアルタイムデータ**: Semanticストリームはリアルタイムデータに適しており、非同期データソースをサポートします

このライブラリは、TypeScript開発者に強力で柔軟なストリーム処理能力を提供し、関数型プログラミングの利点と型安全性を組み合わせています。