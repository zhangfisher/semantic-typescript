# Semantic-TypeScript
流動，索引。您的數據，精確掌控。

---

### 概述

Semantic-TypeScript 標誌著串流處理技術的重大飛躍，它綜合了 JavaScript `GeneratorFunction`、Java Streams 和 MySQL 風格索引中最有效的概念。其核心理念簡單而強大：透過智能索引，而非暴力迭代，來構建極其高效的數據處理管道。

當傳統函式庫強加同步迴圈或笨重的 Promise 鏈時，Semantic-TypeScript 提供了一個完全非同步、函數純粹且嚴格型別安全的體驗，專為現代前端開發的需求而設計。

在其優雅的模型中，數據僅在上游管道明確呼叫 `accept`（及可選的 `interrupt`）回調時，才會送達消費者。您能完全掌控時機——就在需要的那一刻。

---

### 開發者為何青睞它

• 零樣板索引 — 每個元素都帶有其自然或自訂的索引。

• 純函數式風格 — 具備完整的 TypeScript 型別推論。

• 防洩漏事件串流 — `useWindow`、`useDocument`、`useHTMLElement` 和 `useWebSocket` 的設計以安全為本。您定義邊界（使用 `limit(n)`、`sub(start, end)` 或 `takeWhile(predicate)`），函式庫則負責清理。沒有殘留的監聽器，沒有記憶體洩漏。

• 內建統計功能 — 全面的 `number` 與 `bigint` 分析，包括平均值、中位數、眾數、變異數、偏度和峰度。

• 可預測的性能 — 根據需求選擇有序或無序收集器。

• 記憶體高效 — 串流採用延遲求值，減輕記憶體負擔。

• 無未定義行為 — TypeScript 保證型別安全與可空性。輸入數據保持不變，除非在您的回調函數中明確修改。

---

### 安裝

```bash
npm install semantic-typescript
```
或
```bash
yarn add semantic-typescript
```

---

### 快速開始

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// 數值統計
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // 終端操作前必需
  .summate();             // 200

// 大整數統計
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // 終端操作前必需
  .summate();             // 200n

// 透過索引反轉串流
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // 使用負索引以反轉
  .toOrdered() // 呼叫 toOrdered() 以保持索引順序
  .toArray(); // [5, 4, 3, 2, 1]

// 隨機打亂串流
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // 例如：[2, 5, 1, 4, 3]

// 平移串流中的元素
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // 將元素向右平移 2 個位置
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // 將元素向左平移 2 個位置
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// 無限範圍並提前終止
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // 在 10 個元素後停止
  .toUnordered()
  .toArray();

// 即時視窗大小調整事件（在 5 個事件後自動停止）
useWindow("resize")
  .limit(5n)          // 對事件串流至關重要
  .toUnordered()
  .forEach((ev, idx) => console.log(`調整大小事件 #${idx}`));

// 監聽 HTML 元素
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 監聽多個元素和事件
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 監聽 WebSocket
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // 手動管理 WebSocket 生命週期
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// 依碼點遍歷字串
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // 輸出字串

// 安全地將具有循環參考的物件序列化
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // 循環參考
};
// let text: string = JSON.stringify(o); // 拋出錯誤
let text: string = useStringify(o); // 安全地產生 `{a: 1, b: "text", c: []}`
```

---

### 核心概念

| 概念 | 目的 | 使用時機 |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | 非同步串流、事件和延遲管道的核心建構器。 | 即時事件、WebSockets、DOM 監聽器、長時間執行或無限串流。 |
| `SynchronousSemantic` | 同步、記憶體內或基於迴圈的串流建構器。 | 靜態數據、範圍、立即迭代。 |
| `toUnordered()` | 最快的終端收集器（基於 Map 索引）。 | 效能關鍵路徑（O(n) 時間與空間複雜度，無排序）。 |
| `toOrdered()` | 已排序、索引穩定的收集器。 | 需要穩定順序或索引存取時。 |
| `toNumericStatistics()` | 豐富的數值統計分析（平均值、中位數、變異數、偏度、峰度等）。 | 數據分析與統計計算。 |
| `toBigIntStatistics()` | 豐富的大整數統計分析。 | 大整數的數據分析與統計計算。 |
| `toWindow()` | 滑動視窗與翻轉視窗支援。 | 時間序列處理、批次處理和視窗化操作。 |

---

重要使用規則

1.  事件串流（`useWindow`、`useDocument`、`useHTMLElement`、`useWebSocket`…）回傳 `AsynchronousSemantic`。
    → 您必須呼叫 `.limit(n)`、`.sub(start, end)` 或 `.takeWhile()` 來停止監聽。否則，監聽器將保持活動狀態。

2.  終端操作（`.toArray()`、`.count()`、`.average()`、`.reduce()`、`.findFirst()` 等）僅在轉換為收集器後可用：
    ```typescript
    .toUnordered()   // O(n) 時間與空間複雜度，無排序
    // 或
    .toOrdered()     // 已排序，保持順序
    ```

---

### 效能特性

| 收集器 | 時間複雜度 | 空間複雜度 | 已排序？ | 最適合用於 |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | 否 | 原始速度，順序非必需。 |
| `toOrdered()` | O(2n) | O(n) | 是 | 穩定排序，索引存取，分析。 |
| `toNumericStatistics()` | O(2n) | O(n) | 是 | 需要已排序數據的統計操作。 |
| `toBigIntStatistics()` | O(2n) | O(n) | 是 | 大整數的統計操作。 |
| `toWindow()` | O(2n) | O(n) | 是 | 基於時間的視窗化操作。 |

當速度至關重要時，選擇 `toUnordered()`。僅在需要穩定排序或依賴已排序數據的統計方法時，才使用 `toOrdered()`。

---

與其他前端串流處理器比較

| 特性 | Semantic-TypeScript | RxJS | 原生非同步迭代器 / 產生器 | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| TypeScript 整合 | 一流的深度型別整合，具備原生索引感知。 | 優秀，但涉及複雜的泛型。 | 良好，需要手動定義型別。 | 強大，函數優先風格。 |
| 內建統計分析 | 對 `number` 和 `bigint` 提供全面的原生支援。 | 非原生提供（需要自訂操作符）。 | 無。 | 無。 |
| 索引與位置感知 | 原生、強大的大整數索引，適用於每個元素。 | 需要自訂操作符（`scan`、`withLatestFrom`）。 | 需要手動計數器。 | 基本，無內建索引。 |
| 事件串流管理 | 專用、型別安全的工廠函數，具備明確的提前停止控制。 | 強大，但需要手動管理訂閱。 | 手動事件監聽器 + 取消。 | 良好的 `fromEvent`，輕量。 |
| 效能與記憶體效率 | 卓越 – 優化的 `toUnordered()` 和 `toOrdered()` 收集器。 | 非常好，但操作符鏈會增加開銷。 | 優秀（零開銷）。 | 優秀。 |
| 套件大小 | 非常輕量。 | 大（即使進行 tree-shaking）。 | 零（原生）。 | 小。 |
| API 設計理念 | 函數式收集器模式，具備明確索引。 | 響應式 Observable 模式。 | 迭代器 / 產生器模式。 | 函數式，無參數風格。 |
| 提前終止與控制 | 明確（`interrupt`、`.limit()`、`.takeWhile()`、`.sub()`）。 | 良好（`take`、`takeUntil`、`first`）。 | 手動（`for await…of` 中的 `break`）。 | 良好（`take`、`until`）。 |
| 同步與非同步支援 | 統一的 API – 對兩者提供一流的支援。 | 主要為非同步。 | 兩者皆可，但需手動處理。 | 主要為非同步。 |
| 學習曲線 | 對於熟悉函數式和索引管道的開發者來說較平緩。 | 較陡峭（許多操作符，熱/冷 Observable）。 | 低。 | 中等。 |

Semantic-TypeScript 的主要優勢

•   獨特的內建統計與索引功能，無需手動編寫 `reduce` 或依賴外部函式庫。

•   對事件串流的明確控制，防止了 RxJS 中常見的記憶體洩漏。

•   統一的同步/非同步設計，為多樣化的使用場景提供了單一、一致的 API。

此比較闡明了為何 Semantic-TypeScript 特別適合現代 TypeScript 前端應用程式，這些應用程式要求在不需要傳統響應式函式庫的繁瑣儀式下，仍能獲得高效能、型別安全和豐富的分析能力。

---

### 準備好探索了嗎？

Semantic-TypeScript 將複雜的數據流轉化為可讀、可組合且高效能的管道。無論您是處理即時 UI 事件、處理大型資料集，還是建置分析儀表板，它都提供資料庫級索引的威力與函數式編程的優雅。

下一步：

•   在您的 IDE 中瀏覽完全型別化的 API（所有匯出皆來自主套件）。

•   加入日益壯大的開發者社群，他們已用簡潔的 Semantic 管道取代了繁瑣的非同步迭代器。

---

Semantic-TypeScript — 串流與結構相遇之處。

立即開始構建，體驗深思熟慮的索引所帶來的不同。

清晰構建，自信前行，並有目的地轉化數據。

MIT © Eloy Kim