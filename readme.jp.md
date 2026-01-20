# Semantic-TypeScript ストリーム処理ライブラリ

## 序論

Semantic-TypeScriptは、JavaScriptのGeneratorFunction、JavaのStream、MySQLのIndexに触発された現代的なストリーム処理ライブラリです。その中心的な設計哲学は、データインデックスを使用して効率的なデータ処理パイプラインを構築することに基づいており、フロントエンド開発のための型安全で関数型のストリーミング操作体験を提供します。

従来の同期処理とは異なり、Semanticは非同期処理モデルを採用しています。データストリームを作成する際、ターミナルがデータを受信するタイミングは、アップストリームが`accept`と`interrupt`コールバック関数を呼び出すタイミングに完全に依存します。この設計により、ライブラリはリアルタイムデータストリーム、大規模なデータセット、非同期データソースを洗練された方法で処理することができます。

## インストール

```bash
npm install semantic-typescript
```

## 基本的な型

| 型 | 説明 |
|------|-------------|
| `Invalid<T>` | `null`または`undefined`から派生した型 |
| `Valid<T>` | `null`と`undefined`を除外した型 |
| `MaybeInvalid<T>` | `null`または`undefined`である可能性がある型 |
| `Primitive` | プリミティブ型の集合 |
| `MaybePrimitive<T>` | プリミティブ型である可能性がある型 |
| `OptionalSymbol` | `Optional`クラスのシンボル識別子 |
| `SemanticSymbol` | `Semantic`クラスのシンボル識別子 |
| `CollectorsSymbol` | `Collector`クラスのシンボル識別子 |
| `CollectableSymbol` | `Collectable`クラスのシンボル識別子 |
| `OrderedCollectableSymbol` | `OrderedCollectable`クラスのシンボル識別子 |
| `WindowCollectableSymbol` | `WindowCollectable`クラスのシンボル識別子 |
| `StatisticsSymbol` | `Statistics`クラスのシンボル識別子 |
| `NumericStatisticsSymbol` | `NumericStatistics`クラスのシンボル識別子 |
| `BigIntStatisticsSymbol` | `BigIntStatistics`クラスのシンボル識別子 |
| `UnorderedCollectableSymbol` | `UnorderedCollectable`クラスのシンボル識別子 |

## 関数指向のインターフェース

| インターフェース | 説明 |
|-----------|-------------|
| `Runnable` | パラメータがなく戻り値もない関数 |  
| `Supplier<R>` | パラメータがなく`R`を返す関数 |  
| `Functional<T, R>` | 単一パラメータの変換関数 |
| `BiFunctional<T, U, R>` | 二つのパラメータの変換関数 |
| `TriFunctional<T, U, V, R>` | 三つのパラメータの変換関数 |
| `Predicate<T>` | 単一パラメータの述語関数 |
| `BiPredicate<T, U>` | 二つのパラメータの述語関数 |
| `TriPredicate<T, U, V>` | 三つのパラメータの述語関数 |
| `Consumer<T>` | 単一パラメータのコンシューマ関数 |
| `BiConsumer<T, U>` | 二つのパラメータのコンシューマ関数 |
| `TriConsumer<T, U, V>` | 三つのパラメータのコンシューマ関数 |
| `Comparator<T>` | 二つのパラメータの比較関数 |
| `Generator<T>` | ジェネレータ関数（コアと基盤） |

```typescript
// 型の使用例
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## 型ガード

| 関数 | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 値がnullまたはundefinedではないかを検証 | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 値がnullまたはundefinedかを検証 | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | 値がbooleanかをチェック | O(1) | O(1) |
| `isString(t: unknown): t is string` | 値が文字列かをチェック | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 値が数値かをチェック | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 値が関数かをチェック | O(1) | O(1) |
| `isObject(t: unknown): t is object` | 値がオブジェクトかをチェック | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | 値がシンボルかをチェック | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | 値がBigIntかをチェック | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | 値がプリミティブ型かをチェック | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 値が反復可能オブジェクトかをチェック | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | 値がOptionalインスタンスかをチェック | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | 値がSemanticインスタンスかをチェック | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | 値がCollectorインスタンスかをチェック | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | 値がCollectableインスタンスかをチェック | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | 値がOrderedCollectableインスタンスかをチェック | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | 値がWindowCollectableインスタンスかをチェック | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | 値がUnorderedCollectableインスタンスかをチェック | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | 値がStatisticsインスタンスかをチェック | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | 値がNumericStatisticsインスタンスかをチェック | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | 値がBigIntStatisticsインスタンスかをチェック | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | 値がPromiseオブジェクトかをチェック | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | 値がAsyncFunctionかをチェック | O(1) | O(1) |

```typescript
// 型ガードの使用例
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 型安全、valueはstringと推論される
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // 型安全、今やそれは反復可能なオブジェクトです。
    for(let item of value){
        console.log(item);
    }
}
```

## ユーティリティ関数

| 関数 | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 一般的な比較関数 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 疑似乱数生成器 | O(log n) | O(1) |

```typescript
// ユーティリティ関数の使用例
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // シードベースの乱数
```

## ファクトリメソッド

### Optionalのファクトリメソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 空のOptionalを作成 | O(1) | O(1) |
| `Optional.of<T>(value)` | 値を含むOptionalを作成 | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 可能に空のOptionalを作成 | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | nullでないOptionalを作成 | O(1) | O(1) |

```typescript
// Optionalの使用例
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((val: number): void => console.log(val)); // 42を出力
console.log(emptyOpt.get(100)); // 100を出力
```

### Collectorのファクトリメソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 完全なCollectorを作成 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 中断可能なCollectorを作成 | O(1) | O(1) |

```typescript
// Collectorの変換例
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 性能優先: 未順序のCollectorを使用
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnordered(); // 最高の性能

// 順序が必要: 順序付けられたCollectorを使用
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// 要素数をカウント
let count: Collector<number, number, number> = Collector.full(
    (): number => 0, // 初期値
    (accumulator: number, element: number): number => accumulator + element, // 累積
    (accumulator: number): number => accumulator // 完了
);
count.collect(from([1,2,3,4,5])); // ストリームからカウント
count.collect([1,2,3,4,5]); // 反復可能オブジェクトからカウント

let find: Optional<number> = Collector.shortable(
    (): Optional<number> => Optional.empty(), // 初期値
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // 中断
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // 累積
    (accumulator: Optional<number>): Optional<number> => accumulator // 完了
);
find.collect(from([1,2,3,4,5])); // 最初の要素を見つける
find.collect([1,2,3,4,5]); // 最初の要素を見つける
```

### Semanticのファクトリメソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | 時間ベースのアニメーションフレームストリームを作成 | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Blobからストリームを作成 | O(n) | O(chunkSize) |
| `empty<E>()` | 空のストリームを作成 | O(1) | O(1) |
| `fill<E>(element, count)` | 埋められたストリームを作成 | O(n) | O(1) |
| `from<E>(iterable)` | 反復可能オブジェクトからストリームを作成 | O(1) | O(1) |
| `interval(period, delay?)` | 時間ベースのインターバルストリームを作成 | O(1)* | O(1) |
| `iterate<E>(generator)` | ジェネレータからストリームを作成 | O(1) | O(1) |
| `range(start, end, step)` | 数値範囲のストリームを作成 | O(n) | O(1) |
| `websocket(websocket)` | WebSocketからストリームを作成 | O(1) | O(1) |

```typescript
// Semanticのファクトリメソッドの使用例

// 時間ベースのアニメーションフレームからストリームを作成
animationFrame(1000)
    .toUnordered()
    .forEach(frame => console.log(frame));

// Blobからストリームを作成（チャンク読み取り）
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // ストリームの書き込み成功
    .catch(callback); // ストリームの書き込み失敗

// 結合されるまで実行されない空のストリームを作成
empty<string>()
    .toUnordered()
    .join(); // []

// 埋められたストリームを作成
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 初期遅延2秒、実行周期5秒の時間ベースのストリームを作成、タイマーメカニズムに基づいて実装されています。システムスケジュールの精度制限により時間のドリフトが発生する可能性があります。
let intervalStream = interval(5000, 2000);

// 反復可能オブジェクトからストリームを作成
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// 数値範囲のストリームを作成
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocketイベントストリーム
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message") // メッセージイベントのみをリッスン
  .toUnordered() // イベントは通常順序付けられていません
  .forEach((event): void => receive(event)); // メッセージを受信
```

## Semanticクラスメソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `concat(other)` | 二つのストリームを結合 | O(n) | O(1) |
| `distinct()` | 重複を削除 | O(n) | O(n) |
| `distinct(comparator)` | 比較子を使用して重複を削除 | O(n²) | O(n) |
| `dropWhile(predicate)` | 条件を満たす要素を破棄 | O(n) | O(1) |
| `filter(predicate)` | 要素をフィルター | O(n) | O(1) |
| `flat(mapper)` | フラットマッピング | O(n × m) | O(1) |
| `flatMap(mapper)` | 新しい型にフラットマッピング | O(n × m) | O(1) |
| `limit(n)` | 要素数を制限 | O(n) | O(1) |
| `map(mapper)` | マッピング変換 | O(n) | O(1) |
| `peek(consumer)` | 要素を覗く | O(n) | O(1) |
| `redirect(redirector)` | インデックスをリダイレクト | O(n) | O(1) |
| `reverse()` | ストリームを逆転 | O(n) | O(1) |
| `shuffle()` | ランダムにシャッフル | O(n) | O(1) |
| `shuffle(mapper)` | マッパーを使用してシャッフル | O(n) | O(1) |
| `skip(n)` | 最初のn要素をスキップ | O(n) | O(1) |
| `sorted()` | ソート | O(n log n) | O(n) |
| `sorted(comparator)` | 比較子を使用してソート | O(n log n) | O(n) |
| `sub(start, end)` | サブストリームを取得 | O(n) | O(1) |
| `takeWhile(predicate)` | 条件を満たす要素を取得 | O(n) | O(1) |
| `translate(offset)` | インデックスを変換 | O(n) | O(1) |
| `translate(translator)` | 変換子を使用してインデックスを変換 | O(n) | O(1) |

```typescript
// Semantic操作の例
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)        // 偶数をフィルター
    .map((n: number): number => n * 2)                 // 2倍にする
    .skip(1)                         // 最初のものをスキップ
    .limit(3)                        // 3要素に制限
    .toUnordered()                   // 順序付けられていないCollectorに変換
    .toArray();                      // 配列に変換
// 結果: [8, 12, 20]

// 複雑な操作の例
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // 各要素を二つにマッピング
    .distinct()                      // 重複を削除
    .shuffle()                       // 順序をシャッフル
    .takeWhile((n: number): boolean => n < 50)         // 50未満の要素を取る
    .toOrdered()                     // 順序付けられたCollectorに変換
    .toArray();                      // 配列に変換
```

## Semanticの変換メソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------------|------------|------------|------------|
| `sorted()` | 順序付けられたCollectorに変換 | O(n log n) | O(n) |
| `toUnordered()` | 順序付けられていないCollectorに変換 | O(1) | O(1) |
| `toOrdered()` | 順序付けられたCollectorに変換 | O(1) | O(1) |
| `toNumericStatistics()` | 数値統計に変換 | O(n) | O(1) |
| `toBigintStatistics()` | BigInt統計に変換 | O(n) | O(1) |
| `toWindow()` | ウィンドウコレクターに変換 | O(1) | O(1) |
| `toCollectable()` | `UnorderdCollectable`に変換 | O(n) | O(1) |
| `toCollectable(mapper)` | カスタマイズされたCollectableに変換 | O(n) | O(1) |

```typescript
// 昇順に並べ替えられた配列に変換
from([6,4,3,5,2]) // ストリームを作成
    .sorted() // ストリームを昇順に並べ替え
    .toArray(); // [2, 3, 4, 5, 6]

// 降順に並べ替えられた配列に変換
from([6,4,3,5,2]) // ストリームを作成
    .soted((a: number, b: number): number => b - a) // ストリームを降順に並べ替え
    .toArray(); // [6, 5, 4, 3, 2]

// 逆順の配列にリダイレクト
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // 逆順にリダイレクト
    .toOrderd() // リダイレクトされた順序を保持
    .toArray(); // [2, 5, 3, 4, 6]

// リダイレクトを無視して逆順の配列を得る
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // 逆順にリダイレクト
    .toUnorderd() // リダイレクトされた順序を無視します。この操作は`redirect`、`reverse`、`shuffle`、`translate`の操作を無視します
    .toArray(); // [2, 5, 3, 4, 6]

// ストリームを逆順に配列に変換
from([6, 4, 3, 5, 2])
    .reverse() // ストリームを逆順にする
    .toOrdered() // 逆順を保証する
    .toArray(); // [2, 5, 3, 4, 6]

// シャッフルされたストリームを上書きして配列に変換
from([6, 4, 3, 5, 2])
    .shuffle() // ストリームをシャッフルする
    .sorted() // シャッフルされた順序を上書きする。この操作は`redirect`、`reverse`、`shuffle`、`translate`の操作を上書きする
    .toArray(); // [2, 5, 3, 4, 6]

// ウィンドウコレクターに変換
from([6, 4, 3, 5, 2]).toWindow();

// 数値統計に変換
from([6, 4, 3, 5, 2]).toNumericStatistics();

// BigInt統計に変換
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// データ収集のためのカスタムコレクターを定義
let customizedCollector = from([1, 2, 3, 4, 5])
    .toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectableの集約メソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 任意の要素が一致するかどうか | O(n) | O(1) |
| `allMatch(predicate)` | すべての要素が一致するかどうか | O(n) | O(1) |
| `count()` | 要素数 | O(n) | O(1) |
| `isEmpty()` | 空かどうか | O(1) | O(1) |
| `findAny()` | 任意の要素を見つける | O(n) | O(1) |
| `findFirst()` | 最初の要素を見つける | O(n) | O(1) |
| `findLast()` | 最後の要素を見つける | O(n) | O(1) |
| `forEach(action)` | すべての要素を反復する | O(n) | O(1) |
| `group(classifier)` | クラスファイヤーでグループ化 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | キー・バリュー抽出子でグループ化 | O(n) | O(n) |
| `join()` | 文字列として結合 | O(n) | O(n) |
| `join(delimiter)` | 区切り文字を使用して結合 | O(n) | O(n) |
| `nonMatch(predicate)` | 一致しない要素があるかどうか | O(n) | O(1) |
| `partition(count)` | 数でパーティション分割 | O(n) | O(n) |
| `partitionBy(classifier)` | クラスファイヤーでパーティション分割 | O(n) | O(n) |
| `reduce(accumulator)` | 減少操作 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 初期値を持つ減少 | O(n) | O(1) |
| `toArray()` | 配列に変換 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Mapに変換 | O(n) | O(n) |
| `toSet()` | Setに変換 | O(n) | O(n) |
| `write(stream)` | ストリームに書き込む | O(n) | O(1) |

```typescript
// Collectableの操作例
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// 一致チェック
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// 検索操作
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // 任意の要素

// グループ化操作
const grouped = data.groupBy(
    (n: number): string => (n > 5 ? "大" : "小"),
    (n: number): number => n * 2
); // {小: [4, 8], 大: [12, 16, 20]}

// 減少操作
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 出力操作
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## 統計分析メソッド

### NumericStatisticsメソッド

| メソッド | 説明 | 時間複雑度 | 空間複雑度 |
|------|------|------------|------------|
| `range()` | 範囲 | O(n) | O(1) |
| `variance()` | 分散 | O(n) | O(1) |
| `standardDeviation()` | 標準偏差 | O(n) | O(1) |
| `mean()` | 平均 | O(n) | O(1) |
| `median()` | 中央値 | O(n log n) | O(n) |
| `mode()` | 最頻値 | O(n) | O(n) |
| `frequency()` | 頻度分布 | O(n) | O(n) |
| `summate()` | 合計 | O(n) | O(1) |
| `quantile(quantile)` | 分位数 | O(n log n) | O(n) |
| `interquartileRange()` | 四分位範囲 | O(n log n) | O(n) |
| `skewness()` | 歪度 | O(n) | O(1) |
| `kurtosis()` | 尖度 | O(n) | O(1) |

```typescript
// 統計分析の例
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("平均:", numbers.mean()); // 5.5
console.log("中央値:", numbers.median()); // 5.5
console.log("標準偏差:", numbers.standardDeviation()); // ~2.87
console.log("合計:", numbers.summate()); // 55

// マッパーを使用した統計分析
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();
console.log("マッピングされた平均:", objects.mean(obj => obj.value)); // 20
```

## パフォーマンス選択ガイド

### 順序を保証しないCollectorを選択（パフォーマンス優先）
```typescript
// 順序の保証が不要な場合、最高のパフォーマンスを得るために順序付けられていないCollectorを使用します
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // 最高のパフォーマンス
```

### 順序が必要なCollectorを選択（順序が必要）
```typescript
// 要素の順序を維持する必要がある場合、順序付けられたCollectorを使用します
let ordered = data.sorted(comparator);
```

### ウィンドウ操作が必要なCollectorを選択（ウィンドウ操作）
```typescript
// ウィンドウ操作が必要な場合
let window: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // スライディングウィンドウ
```

### 数値計算が必要な統計分析を選択（統計分析）
```typescript
// 統計分析が必要な場合
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // 数値統計

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // 大きな整数統計
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 重要な注意事項

1. **ソート操作の影響**：順序付けられたCollectorでは、`sorted()`操作は`redirect`、`translate`、`shuffle`、`reverse`の効果を上書きします。
2. **パフォーマンスの考慮**：順序の保証が不要な場合は、`toUnordered()`を使用してパフォーマンスを向上させることをお勧めします。
3. **メモリ使用量**：ソート操作には追加のO(n)のメモリが必要です。
4. **リアルタイムデータ**：Semanticストリームはリアルタイムデータの処理に適しており、非同期データソースをサポートしています。

このライブラリは、TypeScript開発者に強力で柔軟なストリーミング機能を提供し、関数型プログラミングの利点と型安全性の保証を組み合わせています。