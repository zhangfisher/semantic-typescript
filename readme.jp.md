# 📘 semantic-typescript

TypeScript における**意味論的なデータ処理**のための、強力で型安全なユーティリティライブラリです。  
コレクション、ストリーム、シーケンスを扱うための関数的スタイルの構成要素を提供し、ソート、フィルタリング、グループ化、統計分析などをサポートします。

**順序付きまたは順序なしのデータ**を処理する場合でも、**統計分析**を行う場合でも、単に**演算を流れるようにチェーンしたい**場合でも、本ライブラリが対応します。

---

## 🧩 特徴

- ✅ 全面的に**型安全なジェネリクス**
- ✅ **関数型プログラミング**スタイル（map、filter、reduce など）
- ✅ **意味論的データストリーム**（`Semantic<E>`）による遅延評価
- ✅ ストリームを具体的な構造に変換するための**コレクター**
- ✅ **順序付き＆順序なしコレクション** — `toUnordered()` は**最速**（ソートなし）
- ✅ `sorted()`、`toOrdered()`、比較器による**ソート機能**
- ✅ **統計分析**（`Statistics`、`NumericStatistics`、`BigIntStatistics`）
- ✅ 安全な null 値処理のための **`Optional<T>` モナド**
- ✅ **イテレータとジェネレーター**ベースの設計 — 大規模・非同期データにも適応

---

## 📦 インストール

```bash
npm install semantic-typescript
```

---

## 🧠 コア概念

### 1. `Optional<T>` – 安全な null 値処理

`null` または `undefined` になり得る値を格納するモナディックコンテナです。

#### メソッド：

| メソッド | 説明 | 例 |
|----------|------|-----|
| `of(value)` | 値をラップ（nullish も可） | `Optional.of(null)` |
| `ofNullable(v)` | ラップ（nullish を許容） | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | ラップ（null/undefined なら例外） | `Optional.ofNonNull(5)` |
| `get()` | 値を取得（空なら例外） | `opt.get()` |
| `getOrDefault(d)` | 値を取得、空ならデフォルト値 | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | 値があれば副作用を実行 | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | 値があれば変換 | `opt.map(x => x + 1)` |
| `filter(fn)` | 述語を満たす場合のみ値を保持 | `opt.filter(x => x > 0)` |
| `isEmpty()` | 空かどうかを確認 | `opt.isEmpty()` |
| `isPresent()` | 値を持つかどうかを確認 | `opt.isPresent()` |

#### 例：

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 または 0
```

---

### 2. `Semantic<E>` – 遅延データストリーム

要素の**遅延評価可能な合成可能シーケンス**です。Java Streams や Kotlin Sequences のような関数的ストリームに似ています。

`from()`、`range()`、`iterate()`、`fill()` などのヘルパーで `Semantic` を作成できます。

#### 作成メソッド：

| 関数 | 説明 | 例 |
|------|------|-----|
| `from(iterable)` | Array/Set/Iterable から作成 | `from([1, 2, 3])` |
| `range(start, end, step?)` | 数値範囲を生成 | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | 要素を N 回繰り返す | `fill('a', 3n)` |
| `iterate(gen)` | カスタムジェネレーター関数を使用 | `iterate(genFn)` |

#### 主な演算子：

| メソッド | 説明 | 例 |
|----------|------|-----|
| `map(fn)` | 各要素を変換 | `.map(x => x * 2)` |
| `filter(fn)` | 述語を満たす要素を保持 | `.filter(x => x > 10)` |
| `limit(n)` | 最初の N 要素に制限 | `.limit(5)` |
| `skip(n)` | 最初の N 要素をスキップ | `.skip(2)` |
| `distinct()` | 重複を除去（デフォルトで Set を使用） | `.distinct()` |
| `sorted()` | 要素をソート（自然順） | `.sorted()` |
| `sorted(comparator)` | カスタムソート | `.sorted((a, b) => a - b)` |
| `toOrdered()` | ソートして `OrderedCollectable` を返す | `.toOrdered()` |
| `toUnordered()` | **ソートなし** – 最速のコレクション | `.toUnordered()` ✅ |
| `collect(collector)` | コレクターで集約 | `.collect(Collector.full(...))` |
| `toArray()` | 配列に変換 | `.toArray()` |
| `toSet()` | Set に変換 | `.toSet()` |
| `toMap(keyFn, valFn)` | Map に変換 | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` – 🚀 最速、ソートなし

**順序を必要とせず**、**最高のパフォーマンス**を求める場合は、以下を使用してください：

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **ソートアルゴリズムは適用されません。**  
順序が関係なく、最大の速度が必要な場合に理想的です。

---

### 4. `toOrdered()` および `sorted()` – ソート済み出力

**ソート済み出力**が必要な場合は、以下を使用してください：

```typescript
const ordered = semanticStream.sorted(); // 自然順
const customSorted = semanticStream.sorted((a, b) => a - b); // カスタム比較器
const orderedCollectable = semanticStream.toOrdered(); // こちらもソート
```

⚠️ これらのメソッドは、自然順または指定された比較器を使用して要素を**ソートします**。

---

### 5. `Collector<E, A, R>` – データ集約

コレクターにより、ストリームを**単一または複雑な構造に縮約**できます。

組み込みの静的ファクトリー：

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

通常、`Collectable` クラスの高水準ヘルパーを通じて使用されます。

---

### 6. `Collectable<E>`（抽象クラス）

以下のクラスの基底クラスです：

- `OrderedCollectable<E>` – ソート済み出力
- `UnorderedCollectable<E>` – ソートなし、最速
- `WindowCollectable<E>` – スライディングウィンドウ
- `Statistics<E, D>` – 統計集約

#### 共通メソッド（継承経由）：

| メソッド | 説明 | 例 |
|----------|------|-----|
| `count()` | 要素をカウント | `.count()` |
| `toArray()` | 配列に変換 | `.toArray()` |
| `toSet()` | Set に変換 | `.toSet()` |
| `toMap(k, v)` | Map に変換 | `.toMap(x => x.id, x => x)` |
| `group(k)` | キーでグループ化 | `.group(x => x.category)` |
| `findAny()` | 任意の一致要素（Optional） | `.findAny()` |
| `findFirst()` | 最初の要素（Optional） | `.findFirst()` |
| `reduce(...)` | カスタム縮約 | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` – ソート済みデータ

要素を**自動的にソート**したい場合は、このクラスを使用してください。

**カスタム比較器**を受け入れるか、自然順を使用します。

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **ソート済み出力が保証されます。**

---

### 8. `UnorderedCollectable<E>` – ソートなし（🚀 最速）

**順序を必要とせず**、**最高のパフォーマンス**を求める場合は、以下を使用してください：

```typescript
const unordered = new UnorderedCollectable(stream);
// または
const fastest = semanticStream.toUnordered();
```

✅ **ソートアルゴリズムは実行されません**  
✅ **順序が無関係な場合の最高パフォーマンス**

---

### 9. `Statistics<E, D>` – 統計分析

数値データを分析するための抽象基底クラスです。

#### サブクラス：

- `NumericStatistics<E>` – `number` 型用
- `BigIntStatistics<E>` – `bigint` 型用

##### 主な統計メソッド：

| メソッド | 説明 | 例 |
|----------|------|-----|
| `mean()` | 算術平均 | `.mean()` |
| `median()` | 中央値 | `.median()` |
| `mode()` | 最頻値 | `.mode()` |
| `minimum()` | 最小要素 | `.minimum()` |
| `maximum()` | 最大要素 | `.maximum()` |
| `range()` | 最大 − 最小 | `.range()` |
| `variance()` | 分散 | `.variance()` |
| `standardDeviation()` | 標準偏差 | `.standardDeviation()` |
| `summate()` | 要素の合計 | `.summate()` |
| `quantile(q)` | q パーセンタイル（0–1）の値 | `.quantile(0.5)` → 中央値 |
| `frequency()` | 頻度マップ | `.frequency()` |

---

## 🧪 完全な例

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// サンプルデータ
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 最速：ソートなし
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // 例: [10, 2, 8, 4, 5, 6]（元の順序）

// 🔢 自然順でソート
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 統計分析を実行
const stats = new NumericStatistics(numbers);
console.log('平均:', stats.mean());
console.log('中央値:', stats.median());
console.log('最頻値:', stats.mode());
console.log('範囲:', stats.range());
console.log('標準偏差:', stats.standardDeviation());
```

---

## 🛠️ ユーティリティ関数

本ライブラリは多数の**型ガード**と**比較ユーティリティ**もエクスポートしています：

| 関数 | 用途 |
|------|------|
| `isString(x)` | `string` の型ガード |
| `isNumber(x)` | `number` の型ガード |
| `isBoolean(x)` | `boolean` の型ガード |
| `isIterable(x)` | オブジェクトがイテラブルか確認 |
| `useCompare(a, b)` | 汎用比較関数 |
| `useRandom(x)` | 疑似乱数ジェネレーター（楽しい） |

---

## 🧩 発展：カスタムジェネレーターとウィンドウ

無限または制御されたデータストリーム用のカスタム**ジェネレーター**を作成できます：

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

または**スライディングウィンドウ**を使用：

```typescript
const windowed = ordered.slide(3n, 2n); // サイズ 3、ステップ 2 のウィンドウ
```

---

## 📄 ライセンス

本プロジェクトは **MIT ライセンス**の下で公開されており、商用および個人的利用が自由です。

---

## 🙌 貢献

プルリクエスト、イシュー、提案を歓迎します！

---

## 🚀 クイックスタート概要

| タスク | メソッド |
|-------|----------|
| null を安全に処理 | `Optional<T>` |
| ストリームを作成 | `from([...])`、`range()`、`fill()` |
| データを変換 | `map()`、`filter()` |
| データをソート | `sorted()`、`toOrdered()` |
| ソートなし（最速） | `toUnordered()` ✅ |
| グループ化／集約 | `toMap()`、`group()`、`Collector` |
| 統計 | `NumericStatistics`、`mean()`、`median()` など |

---

## 🔗 リンク

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 ドキュメント: ソースコード／型定義を参照

---

**TypeScript での合成可能で型安全、関数的なデータ処理をお楽しみください。** 🚀

--- 

✅ **覚えておいてください：**  
- `toUnordered()` → **ソートなし、最速**  
- その他すべて（例: `sorted()`、`toOrdered()`）→ **データをソート**