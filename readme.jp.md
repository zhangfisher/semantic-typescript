# Semantic-TypeScript ストリーム処理フレームワーク

## はじめに

Semantic-TypeScriptは、JavaScriptのGeneratorFunction、Java Stream、およびMySQL Indexにインスパイアされたモダンなストリーム処理ライブラリです。コアの設計哲学は、データインデックスを通じた効率的なデータ処理パイプラインの構築に基づいており、フロントエンド開発に型安全で関数型スタイルのストリーミング操作体験を提供します。

従来の同期処理とは異なり、Semanticは非同期処理モデルを採用しています。データストリームを作成する際、終端データの受信タイミングは、アップストリームが`accept`および`interrupt`コールバック関数を呼び出すタイミングに完全に依存します。この設計により、ライブラリはリアルタイムデータストリーム、大規模データセット、非同期データソースをエレガントに扱うことができます。

## コア機能

| 機能 | 説明 | 利点 |
|------|------|------|
| **型安全ジェネリクス** | 完全なTypeScript型サポート | コンパイル時エラー検出、優れた開発体験 |
| **関数型プログラミング** | 不変データ構造と純粋関数 | 予測可能なコード、テストと保守が容易 |
| **遅延評価** | オンデマンド計算、パフォーマンス最適化 | 大規模データセット処理時の高いメモリ効率 |
| **非同期ストリーム処理** | ジェネレータベースの非同期データストリーム | リアルタイムデータとイベント駆動シナリオに適応 |
| **マルチパラダイムコレクター** | 順序付き、順序なし、統計的収集戦略 | 異なるシナリオに基づく最適な戦略選択 |
| **統計分析** | 組み込みの完全な統計計算関数 | 統合データ分析とレポート生成 |

## パフォーマンスに関する考慮事項

**重要な注意**: 以下のメソッドは、データを収集してソートするため、パフォーマンスを犠牲にして順序付きデータコレクションを生成します:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

特に重要な注意点: `sorted()`および`sorted(comparator)`は、以下のメソッドの結果を上書きします:
- `redirect(redirector)`
- `translate(translator)` 
- `shuffle(mapper)`

## ファクトリメソッド

### ストリーム作成ファクトリ

| メソッド | シグネチャ | 説明 | 例 |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Blobをバイトストリームに変換 | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | 空のストリームを作成 | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | 指定数の要素で埋め立て | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | 反復可能オブジェクトからストリーム作成 | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | 数値範囲ストリームを作成 | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | ジェネレータ関数からストリーム作成 | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | WebSocketからイベントストリーム作成 | `websocket(socket)` |

**コード例補足:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// 配列からストリーム作成
const numberStream = from([1, 2, 3, 4, 5]);

// 数値範囲ストリーム作成
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// 繰り返し要素で埋め立て
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// 空のストリーム作成
const emptyStream = empty<number>();
```

### ユーティリティ関数ファクトリ

| メソッド | シグネチャ | 説明 | 例 |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | 値が有効か検証 | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | 値が無効か検証 | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | 汎用比較関数 | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | 擬似乱数生成器 | `useRandom(5)` → 乱数 |

**コード例補足:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// データ有効性検証
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // validateがデータがnullでないことを保証するため安全な呼び出し
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("データが無効です"); // invalidateがnullを検出したため実行される
}

// 値の比較
const comparison = useCompare("apple", "banana"); // -1

// 乱数生成
const randomNum = useRandom(42); // シード42に基づく乱数
```

## コアクラス詳細

### Optional<T> - 安全なnull値処理

Optionalクラスは、nullまたはundefinedになる可能性のある値を安全に扱うための関数型アプローチを提供します。

| メソッド | 戻り値の型 | 説明 | 時間計算量 |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | 条件を満たす値をフィルタリング | O(1) |
| `get()` | `T` | 値を取得、空の場合はエラーをスロー | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | 値またはデフォルト値を取得 | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | 値が存在する場合にアクションを実行 | O(1) |
| `isEmpty()` | `boolean` | 空かどうかチェック | O(1) |
| `isPresent()` | `boolean` | 値が存在するかチェック | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | 値のマッピングと変換 | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Optionalインスタンスを作成 | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | null許容Optionalを作成 | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | non-null Optionalを作成 | O(1) |

**コード例補足:**
```typescript
import { Optional } from 'semantic-typescript';

// Optionalインスタンス作成
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// チェーン操作
const result = optionalValue
    .filter(val => val.length > 3) // 長さが3より大きい値をフィルタリング
    .map(val => val.toUpperCase()) // 大文字に変換
    .getOrDefault("default"); // 値またはデフォルト値を取得

console.log(result); // "HELLO" または "default"

// 安全な操作
optionalValue.ifPresent(val => {
    console.log(`値が存在します: ${val}`);
});

// ステータスチェック
if (optionalValue.isPresent()) {
    console.log("値があります");
} else if (optionalValue.isEmpty()) {
    console.log("空です");
}
```

### Semantic<E> - 遅延データストリーム

Semanticは、豊富なストリーム演算子を提供するコアのストリーム処理クラスです。

#### ストリーム変換操作

| メソッド | 戻り値の型 | 説明 | パフォーマンス影響 |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | 2つのストリームを連結 | O(n+m) |
| `distinct()` | `Semantic<E>` | 重複を削除（Set使用） | O(n) |
| `distinct(comparator)` | `Semantic<E>` | カスタム比較子で重複削除 | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | 条件を満たす先頭要素を破棄 | O(n) |
| `filter(predicate)` | `Semantic<E>` | 要素をフィルタリング | O(n) |
| `flat(mapper)` | `Semantic<E>` | ネストしたストリームを平坦化 | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | マッピングと平坦化 | O(n×m) |
| `limit(n)` | `Semantic<E>` | 要素数を制限 | O(n) |
| `map(mapper)` | `Semantic<R>` | 要素のマッピングと変換 | O(n) |
| `peek(consumer)` | `Semantic<E>` | 要素を変更せずに閲覧 | O(n) |
| `redirect(redirector)` | `Semantic<E>` | インデックスのリダイレクト | O(n) |
| `reverse()` | `Semantic<E>` | ストリーム順序を反転 | O(n) |
| `shuffle()` | `Semantic<E>` | ランダムにシャッフル | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | カスタムシャッフルロジック | O(n) |
| `skip(n)` | `Semantic<E>` | 最初のn要素をスキップ | O(n) |
| `sub(start, end)` | `Semantic<E>` | サブストリームを取得 | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | 条件を満たす先頭要素を取得 | O(n) |
| `translate(offset)` | `Semantic<E>` | インデックスの平行移動 | O(n) |
| `translate(translator)` | `Semantic<E>` | カスタムインデックス変換 | O(n) |

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// ストリーム変換操作の例
const processedStream = stream
    .filter(x => x % 2 === 0) // 偶数をフィルタリング
    .map(x => x * 2) // 各要素を2倍
    .distinct() // 重複を削除
    .limit(3) // 最初の3要素に制限
    .peek((val, index) => console.log(`インデックス${index}の要素${val}`)); // 要素を閲覧

// 注: ストリームはまだ実行されていない、終端操作のためにCollectableへの変換が必要
```

#### ストリーム終端操作

| メソッド | 戻り値の型 | 説明 | パフォーマンス特性 |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | 順序付きコレクションに変換 | ソート操作、パフォーマンス低い |
| `toUnordered()` | `UnorderedCollectable<E>` | 順序なしコレクションに変換 | 最速、ソートなし |
| `toWindow()` | `WindowCollectable<E>` | ウィンドウコレクションに変換 | ソート操作、パフォーマンス低い |
| `toNumericStatistics()` | `Statistics<E, number>` | 数値統計分析 | ソート操作、パフォーマンス低い |
| `toBigintStatistics()` | `Statistics<E, bigint>` | ビッグ整数統計分析 | ソート操作、パフォーマンス低い |
| `sorted()` | `OrderedCollectable<E>` | 自然順ソート | リダイレクト結果を上書き |
| `sorted(comparator)` | `OrderedCollectable<E>` | カスタムソート | リダイレクト結果を上書き |

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// 順序付きコレクションに変換（パフォーマンス低い）
const ordered = semanticStream.toOrdered();

// 順序なしコレクションに変換（最速）
const unordered = semanticStream.toUnordered();

// 自然順ソート
const sortedNatural = semanticStream.sorted();

// カスタムソート
const sortedCustom = semanticStream.sorted((a, b) => b - a); // 降順ソート

// 統計オブジェクトに変換
const stats = semanticStream.toNumericStatistics();

// 注: 上記メソッドはSemanticインスタンスを通じて呼び出し、Collectableを取得してから終端メソッドを使用する必要がある
```

### Collector<E, A, R> - データコレクター

コレクターは、ストリームデータを特定の構造に集約するために使用されます。

| メソッド | 説明 | 使用シナリオ |
|------|------|----------|
| `collect(generator)` | データ収集を実行 | ストリーム終端操作 |
| `static full(identity, accumulator, finisher)` | 完全なコレクターを作成 | 完全な処理が必要 |
| `static shortable(identity, interruptor, accumulator, finisher)` | 中断可能なコレクターを作成 | 早期終了する可能性あり |

**コード例補足:**
```typescript
import { Collector } from 'semantic-typescript';

// カスタムコレクター作成
const sumCollector = Collector.full(
    () => 0, // 初期値
    (acc, value) => acc + value, // アキュムレータ
    result => result // フィニッシャー関数
);

// コレクター使用（SemanticからCollectableへの変換が最初に必要）
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - 収集可能データ抽象クラス

豊富なデータ集約および変換メソッドを提供します。**注: 最初にSemanticインスタンスを通じてsorted()、toOrdered()などを呼び出してCollectableインスタンスを取得してから、以下のメソッドを使用する必要があります。**

#### データクエリ操作

| メソッド | 戻り値の型 | 説明 | 例 |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | いずれかの要素が条件に一致するか | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | すべての要素が条件に一致するか | `allMatch(x => x > 0)` |
| `count()` | `bigint` | 要素数の統計 | `count()` → `5n` |
| `isEmpty()` | `boolean` | ストリームが空かどうか | `isEmpty()` |
| `findAny()` | `Optional<E>` | 任意の要素を検索 | `findAny()` |
| `findFirst()` | `Optional<E>` | 最初の要素を検索 | `findFirst()` |
| `findLast()` | `Optional<E>` | 最後の要素を検索 | `findLast()` |

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// 終端メソッドを使用する前にCollectableに変換する必要がある
const collectable = numbers.toUnordered();

// データクエリ操作
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // 任意の要素
```

#### データ集約操作

| メソッド | 戻り値の型 | 説明 | 計算量 |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | 分類子でグループ化 | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | キー値抽出器でグループ化 | O(n) |
| `join()` | `string` | 文字列として結合 | O(n) |
| `join(delimiter)` | `string` | 区切り文字で結合 | O(n) |
| `partition(count)` | `E[][]` | カウントで分割 | O(n) |
| `partitionBy(classifier)` | `E[][]` | 分類子で分割 | O(n) |
| `reduce(accumulator)` | `Optional<E>` | 縮約操作 | O(n) |
| `reduce(identity, accumulator)` | `E` | 識別子付き縮約 | O(n) |
| `toArray()` | `E[]` | 配列に変換 | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Mapに変換 | O(n) |
| `toSet()` | `Set<E>` | Setに変換 | O(n) |

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// 集約操作を使用する前にCollectableに変換する必要がある
const collectable = people.toUnordered();

// グループ化操作
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// コレクションに変換
const array = collectable.toArray(); // 元の配列
const set = collectable.toSet(); // Setコレクション
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// 縮約操作
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### 特定のコレクター実装

#### UnorderedCollectable<E>
- **特性**: 最速のコレクター、ソートなし
- **使用シナリオ**: 順序が重要でない、最大のパフォーマンスが望まれる場合
- **メソッド**: すべてのCollectableメソッドを継承

#### OrderedCollectable<E> 
- **特性**: 要素の順序を保証、パフォーマンスは低い
- **使用シナリオ**: ソートされた結果が必要な場合
- **特殊メソッド**: すべてのメソッドを継承、内部ソート状態を維持

#### WindowCollectable<E>
- **特性**: スライディングウィンドウ操作をサポート
- **使用シナリオ**: 時系列データ分析
- **特殊メソッド**:
  - `slide(size, step)` - スライディングウィンドウ
  - `tumble(size)` - タンブリングウィンドウ

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 順序なしコレクター（最速）
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // 元の順序を維持する可能性あり [1, 2, 3, ...]

// 順序付きコレクター
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // ソートが保証される [1, 2, 3, ...]

// ウィンドウコレクター
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // ウィンドウサイズ3、ステップ2
// ウィンドウ1: [1, 2, 3], ウィンドウ2: [3, 4, 5], ウィンドウ3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // タンブリングウィンドウサイズ4
// ウィンドウ1: [1, 2, 3, 4], ウィンドウ2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - 統計分析

統計分析の基底クラスで、豊富な統計計算メソッドを提供します。**注: 最初にSemanticインスタンスを通じてtoNumericStatistics()またはtoBigIntStatistics()を呼び出してStatisticsインスタンスを取得してから、以下のメソッドを使用する必要があります。**

#### 統計計算操作

| メソッド | 戻り値の型 | 説明 | アルゴリズム計算量 |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | 最大値 | O(n) |
| `minimum()` | `Optional<E>` | 最小値 | O(n) |
| `range()` | `D` | 範囲（最大-最小） | O(n) |
| `variance()` | `D` | 分散 | O(n) |
| `standardDeviation()` | `D` | 標準偏差 | O(n) |
| `mean()` | `D` | 平均値 | O(n) |
| `median()` | `D` | 中央値 | O(n log n) |
| `mode()` | `D` | 最頻値 | O(n) |
| `frequency()` | `Map<D, bigint>` | 度数分布 | O(n) |
| `summate()` | `D` | 合計 | O(n) |
| `quantile(quantile)` | `D` | 分位数 | O(n log n) |
| `interquartileRange()` | `D` | 四分位範囲 | O(n log n) |
| `skewness()` | `D` | 歪度 | O(n) |
| `kurtosis()` | `D` | 尖度 | O(n) |

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 統計メソッドを使用する前に統計オブジェクトに変換する必要がある
const stats = numbers.toNumericStatistics();

// 基本統計
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// 高度な統計
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // 任意の値（すべて1回ずつ出現するため）
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// 度数分布
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### 特定の統計実装クラス

**NumericStatistics<E>**
- number型の統計分析を処理
- すべての統計計算はnumber型を返す

**BigIntStatistics<E>**  
- bigint型の統計分析を処理
- すべての統計計算はbigint型を返す

**コード例補足:**
```typescript
import { from } from 'semantic-typescript';

// 数値統計
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// ビッグ整数統計
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// マッパー関数を使用した統計
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

## 完全な使用例

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. データストリーム作成
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. ストリーム処理パイプライン
const processedStream = semanticStream
    .filter(val => validate(val)) // nullとundefinedをフィルタリング
    .map(val => val! * 2) // 各値を2倍（!を使用、validateが空でないことを保証するため）
    .distinct(); // 重複を削除

// 3. Collectableに変換して終端操作を使用
const collectable = processedStream.toUnordered();

// 4. データ検証と使用
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // 再度フィルタリング
        .toArray(); // 配列に変換
    
    console.log("処理結果:", results); // [16, 18, 14, 8, 12]
    
    // 統計情報
    const stats = processedStream.toNumericStatistics();
    console.log("平均値:", stats.mean()); // 11.2
    console.log("合計:", stats.summate()); // 56
}

// 5. 潜在的に無効なデータの処理
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("有効なデータ:", validData); // [1, 3, 4]
console.log("無効なデータ:", invalidData); // [null, null]
```

## 重要な使用ルールのまとめ

1. **ストリーム作成**: `from()`、`range()`、`fill()`などのファクトリメソッドを使用してSemanticインスタンスを作成
2. **ストリーム変換**: Semanticインスタンスで`map()`、`filter()`、`distinct()`などのメソッドを呼び出し
3. **Collectableへの変換**: Semanticインスタンスを通じて以下のいずれかのメソッドを呼び出す必要があります:
   - `toOrdered()` - 順序付きコレクター
   - `toUnordered()` - 順序なしコレクター（最速）
   - `toWindow()` - ウィンドウコレクター  
   - `toNumericStatistics()` - 数値統計
   - `toBigIntStatistics()` - ビッグ整数統計
   - `sorted()` - 自然順ソート
   - `sorted(comparator)` - カスタムソート
4. **終端操作**: Collectableインスタンスで`toArray()`、`count()`、`summate()`などの終端メソッドを呼び出し
5. **データ検証**: `validate()`を使用してデータがnull/undefinedでないことを保証、`invalidate()`を使用して無効なデータをチェック

この設計は、型安全性とパフォーマンス最適化を確保しながら、豊富なストリーム処理機能を提供します。