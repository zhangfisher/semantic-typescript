# Semantic-TypeScript
フローにインデックスを。データを精密に制御。

---

### 概要

Semantic-TypeScriptは、JavaScriptの`GeneratorFunction`、Java Streams、MySQLスタイルのインデックスといった最も効果的な概念を統合し、ストリーム処理技術において大きな飛躍を遂げました。その中核にある哲学はシンプルかつ強力です。それは、力任せの反復処理ではなく、インテリジェントなインデックス付けを通じて、非常に効率的なデータ処理パイプラインを構築することです。

従来のライブラリが同期的なループや扱いにくいPromiseチェーンを強いる場面で、Semantic-TypeScriptは、モダンなフロントエンド開発の要求に応える、完全非同期、関数型的に純粋、厳密なタイプセーフを備えた体験を提供します。

その洗練されたモデルでは、データは上流のパイプラインが明示的に`accept`（およびオプションで`interrupt`）コールバックを呼び出した時にのみ、コンシューマーに到達します。必要な**正確なタイミング**において、完全な制御をあなたが握ります。

---

### 開発者が選ぶ理由

・**ボイラープレートなしのインデックス付け** — あらゆる要素が、自然または独自のインデックスを保持します。

・**純粋関数型スタイル** — 完全なTypeScriptの型推論を伴います。

・**リーク対策済みイベントストリーム** — `useWindow`、`useDocument`、`useHTMLElement`、`useWebSocket`は安全性を考慮して構築されています。`limit(n)`、`sub(start, end)`、`takeWhile(predicate)`を使って境界を定義すれば、ライブラリがクリーンアップを管理します。残存するリスナーもメモリリークもありません。

・**組み込み統計機能** — 平均、中央値、最頻値、分散、歪度、尖度を含む、包括的な数値（`number`/`bigint`）分析。

・**予測可能なパフォーマンス** — 要件に基づいて、順序付きまたは順序なしのコレクターを選択できます。

・**メモリ効率** — ストリームは遅延評価されるため、メモリの懸念を軽減します。

・**未定義動作なし** — TypeScriptが型安全性とnull安全性を保証します。入力データは、コールバック関数内で明示的に変更されない限り、変更されません。

---

### インストール

```bash
npm install semantic-typescript
```
または
```bash
yarn add semantic-typescript
```

---

### クイックスタート

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// 数値の統計
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // 終端操作の前に必須
  .summate();             // 200

// Bigintの統計
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // 終端操作の前に必須
  .summate();             // 200n

// インデックスでストリームを逆順に
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // 負のインデックスで逆順
  .toOrdered() // toOrdered() を呼び出してインデックス順を維持
  .toArray(); // [5, 4, 3, 2, 1]

// ストリームをシャッフル
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // 例: [2, 5, 1, 4, 3]

// ストリーム内の要素を平行移動
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // 要素を2位置右にシフト
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // 要素を2位置左にシフト
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// 早期終了付きの無限レンジ
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // 10要素で停止
  .toUnordered()
  .toArray();

// リアルタイムウィンドウリサイズ (5イベント後に自動停止)
useWindow("resize")
  .limit(5n)          // イベントストリームでは重要
  .toUnordered()
  .forEach((ev, idx) => console.log(`リサイズ #${idx}`));

// HTML要素のリスニング
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 複数要素とイベントのリスニング
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// WebSocketのリスニング
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // WebSocketのライフサイクルは手動で管理
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// 文字列をコードポイントでイテレート
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // 文字列を出力

// 循環参照を含むオブジェクトを安全に文字列化
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // 循環参照
};
// let text: string = JSON.stringify(o); // エラーをスロー
let text: string = useStringify(o); // 安全に `{a: 1, b: "text", c: []}` を生成
```

---

### コアコンセプト

| 概念 | 目的 | 使用する場面 |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | 非同期ストリーム、イベント、遅延パイプラインのためのコアビルダー。 | リアルタイムイベント、WebSockets、DOMリスナー、長時間実行または無限ストリーム。 |
| `SynchronousSemantic` | 同期、インメモリ、ループベースのストリームのビルダー。 | 静的なデータ、レンジ、即時イテレーション。 |
| `toUnordered()` | 最速の終端コレクター（マップベースのインデックス付け）。 | パフォーマンスが重要なパス（O(n) 時間 & 空間、ソートなし）。 |
| `toOrdered()` | ソート済み、インデックス安定のコレクター。 | 安定した順序付けまたはインデックス付きアクセスが必要な場合。 |
| `toNumericStatistics()` | 豊富な数値統計分析（平均、中央値、分散、歪度、尖度など）。 | データ分析と統計計算。 |
| `toBigIntStatistics()` | 豊富なbigint統計分析。 | 大きな整数に対するデータ分析と統計計算。 |
| `toWindow()` | スライディングおよびタンブリングウィンドウのサポート。 | 時系列処理、バッチ処理、ウィンドウ操作。 |

---

重要な使用ルール

1.  イベントストリーム（`useWindow`、`useDocument`、`useHTMLElement`、`useWebSocket`、…）は `AsynchronousSemantic` を返します。
    → リスニングを停止するには、`.limit(n)`、`.sub(start, end)`、または `.takeWhile()` を呼び出す**必須**です。そうしないと、リスナーはアクティブなままになります。

2.  終端操作（`.toArray()`、`.count()`、`.average()`、`.reduce()`、`.findFirst()` など）は、コレクターに変換した後にのみ利用可能です：
    ```typescript
    .toUnordered()   // O(n) 時間 & 空間、ソートなし
    // または
    .toOrdered()     // ソート済み、順序を維持
    ```

---

### パフォーマンス特性

| コレクター | 時間計算量 | 空間計算量 | ソート済み？ | 最適な用途 |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | いいえ | 生の速度、順序が不要な場合。 |
| `toOrdered()` | O(2n) | O(n) | はい | 安定した順序付け、インデックス付きアクセス、分析。 |
| `toNumericStatistics()` | O(2n) | O(n) | はい | ソート済みデータを必要とする統計操作。 |
| `toBigIntStatistics()` | O(2n) | O(n) | はい | bigintに対する統計操作。 |
| `toWindow()` | O(2n) | O(n) | はい | 時間ベースのウィンドウ操作。 |

速度が最優先の場合は `toUnordered()` を選択してください。安定した順序付けやソート済みデータに依存する統計メソッドが必要な場合にのみ `toOrdered()` を使用してください。

---

他のフロントエンドストリームプロセッサとの比較

| 特徴 | Semantic-TypeScript | RxJS | ネイティブ非同期イテレータ/ジェネレータ | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| **TypeScript統合** | 第一級、ネイティブなインデックス認識を伴う深い型付け。 | 優れているが、複雑なジェネリクスを伴う。 | 良好、手動での型付けが必要。 | 強い、関数型ファーストスタイル。 |
| **組み込み統計分析** | `number` と `bigint` に対する包括的なネイティブサポート。 | ネイティブでは利用不可（カスタムオペレータが必要）。 | なし。 | なし。 |
| **インデックス付け & 位置認識** | ネイティブ、あらゆる要素に対する強力なbigintインデックス付け。 | カスタムオペレータが必要（`scan`、`withLatestFrom`）。 | 手動のカウンタが必要。 | 基本的、組み込みインデックスなし。 |
| **イベントストリーム管理** | 明示的な早期停止制御を備えた、専用の型安全ファクトリ。 | 強力だが、手動のサブスクリプション管理が必要。 | 手動イベントリスナー + キャンセル。 | 良好な `fromEvent`、軽量。 |
| **パフォーマンス & メモリ効率** | 卓越 – 最適化された `toUnordered()` および `toOrdered()` コレクター。 | 非常に良好、だがオペレータチェーンはオーバーヘッドを加える。 | 卓越（オーバーヘッドゼロ）。 | 卓越。 |
| **バンドルサイズ** | 非常に軽量。 | 大きい（ツリーシェイキング後も）。 | ゼロ（ネイティブ）。 | 小さい。 |
| **API設計思想** | 明示的なインデックス付けを伴う関数型コレクターパターン。 | リアクティブObservableパターン。 | イテレータ/ジェネレータパターン。 | 関数型、ポイントフリー。 |
| **早期終了 & 制御** | 明示的（`interrupt`、`.limit()`、`.takeWhile()`、`.sub()`）。 | 良好（`take`、`takeUntil`、`first`）。 | 手動（`for await…of` 内の `break`）。 | 良好（`take`、`until`）。 |
| **同期 & 非同期サポート** | 統一されたAPI – 両方を第一級サポート。 | 主に非同期。 | 両方、だが手動。 | 主に非同期。 |
| **学習曲線** | 関数型およびインデックス付きパイプラインに慣れた開発者にとって緩やか。 | 急（多くのオペレータ、hot/coldオブザーバブル）。 | 低い。 | 中程度。 |

**Semantic-TypeScriptの主な利点**

・   独自の組み込み統計およびインデックス機能により、手動での `reduce` や外部ライブラリが不要。

・   イベントストリームに対する明示的な制御により、RxJSで一般的なメモリリークを防止。

・   統一された同期/非同期設計により、多様なユースケースに対して単一で一貫したAPIを提供。

この比較は、伝統的なリアクティブライブラリの煩雑さなしに、パフォーマンス、型安全性、豊富な分析機能を要求するモダンなTypeScriptフロントエンドアプリケーションに、Semantic-TypeScriptが特に適している理由を示しています。

---

### 探求を始めましょうか？

Semantic-TypeScriptは、複雑なデータフローを、読みやすく、合成可能で、高性能なパイプラインへと変えます。リアルタイムUIイベントの処理、大規模データセットの処理、分析ダッシュボードの構築のいずれにおいても、データベースレベルのインデックス付けの力を関数型プログラミングのエレガンスと共に提供します。

次のステップ：

・   IDE内で完全に型付けされたAPIを参照してください（すべてのエクスポートはメインパッケージから）。

・   複雑な非同期イテレータをクリーンなSemanticパイプラインに置き換えた開発者の成長するコミュニティに参加してください。

Semantic-TypeScript — ストリームが構造と出会う場所。

今日から構築を始め、考え抜かれたインデックス付けがもたらす違いを体験してください。

明確さをもって構築し、確信をもって進み、意図をもってデータを変革しましょう。