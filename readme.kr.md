# Semantic-TypeScript
Flow, Indexed. 당신의 데이터, 정밀한 제어 아래에.

---

### 개요

Semantic-TypeScript는 스트림 처리 기술의 중요한 도약을 의미하며, JavaScript `GeneratorFunction`, Java Streams, 그리고 MySQL 스타일 인덱싱에서 가장 효과적인 개념들을 종합합니다. 그 핵심 철학은 단순하면서도 강력합니다: 무차별 반복이 아닌, 지능적인 인덱싱을 통해 매우 효율적인 데이터 처리 파이프라인을 구축하는 것입니다.

기존 라이브러리들이 동기 루프나 다루기 힘든 프로미스 체인을 부과하는 곳에서, Semantic-TypeScript는 완전히 비동기적이고, 순수 함수형이며, 엄격한 타입 안전성을 제공하는 경험을 제공합니다. 이것은 현대 프론트엔드 개발의 요구에 맞게 설계되었습니다.

우아한 이 모델에서, 데이터는 업스트림 파이프라인이 명시적으로 `accept` (그리고 선택적으로 `interrupt`) 콜백을 호출할 때만 소비자에게 전달됩니다. 당신은 데이터가 필요한 정확한 순간, 즉 타이밍을 완벽히 제어할 수 있습니다.

---

### 개발자들이 선호하는 이유

• **보일러플레이트 없는 인덱싱** — 모든 요소가 고유 또는 맞춤형 인덱스를 가지고 있습니다.

• **순수 함수형 스타일** — 완전한 타입스크립트 타입 추론과 함께.

• **메모리 누수 방지 이벤트 스트림** — `useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`은 안전을 염두에 두고 구축되었습니다. `limit(n)`, `sub(start, end)`, `takeWhile(predicate)`를 사용해 경계를 정의하면, 라이브러리가 정리를 관리합니다. 잔여 리스너나 메모리 누수 없음.

• **내장 통계 분석** — 평균, 중앙값, 최빈값, 분산, 왜도, 첨도를 포함한 포괄적인 number 및 bigint 분석.

• **예측 가능한 성능** — 요구사항에 따라 정렬된 또는 비정렬 수집기(collector) 중 선택 가능.

• **메모리 효율적** — 스트림은 지연 평가(Lazy Evaluation) 방식으로 처리되며, 메모리 문제를 완화합니다.

• **정의되지 않은 동작 없음** — 타입스크립트가 타입 안전성과 null 가능성을 보장합니다. 콜백 함수 내에서 명시적으로 변경하지 않는 한, 입력 데이터는 수정되지 않습니다.

---

### 설치

```bash
npm install semantic-typescript
```
또는
```bash
yarn add semantic-typescript
```

---

### 빠른 시작

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// 숫자 통계
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // 최종 연산 전 필수 호출
  .summate();             // 200

// Bigint 통계
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // 최종 연산 전 필수 호출
  .summate();             // 200n

// 인덱스로 스트림 뒤집기
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // 뒤집기를 위한 음수 인덱스
  .toOrdered() // 인덱스 순서를 유지하려면 toOrdered() 호출
  .toArray(); // [5, 4, 3, 2, 1]

// 스트림 섞기(Shuffle)
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // 예: [2, 5, 1, 4, 3]

// 스트림 내 요소 이동(Translate)
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // 요소를 오른쪽으로 2칸 이동
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // 요소를 왼쪽으로 2칸 이동
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// 조기 종료와 함께하는 무한 범위
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // 10개 요소 후 중지
  .toUnordered()
  .toArray();

// 실시간 윈도우 크기 조정 이벤트 (5번 이벤트 후 자동 중지)
useWindow("resize")
  .limit(5n)          // 이벤트 스트림에 필수적
  .toUnordered()
  .forEach((ev, idx) => console.log(`Resize #${idx}`));

// HTML 요소 청취
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// 여러 요소 및 이벤트 청취
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// WebSocket 청취
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // WebSocket 생명주기를 수동으로 관리
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// 문자열을 코드 포트(code point) 단위로 순회
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // 문자열을 출력

// 순환 참조가 있는 객체를 안전하게 문자열로 변환(Stringify)
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // 순환 참조
};
// let text: string = JSON.stringify(o); // 오류 발생
let text: string = useStringify(o); // 안전하게 `{a: 1, b: "text", c: []}` 반환
```

---

### 핵심 개념

| 개념 | 목적 | 언제 사용하는가 |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | 비동기 스트림, 이벤트, 지연 평가 파이프라인을 위한 핵심 빌더. | 실시간 이벤트, WebSocket, DOM 리스너, 장기 실행 또는 무한 스트림. |
| `SynchronousSemantic` | 동기식, 메모리 내 또는 루프 기반 스트림을 위한 빌더. | 정적 데이터, 범위, 즉시 반복. |
| `toUnordered()` | 가장 빠른 최종 수집기 (맵 기반 인덱싱). | 성능이 중요한 경로 (O(n) 시간 및 공간 복잡도, 정렬 없음). |
| `toOrdered()` | 정렬된, 인덱스 안정적인 수집기. | 안정적인 순서 또는 인덱싱된 접근이 필요할 때. |
| `toNumericStatistics()` | 풍부한 숫자 통계 분석 (평균, 중앙값, 분산, 왜도, 첨도 등). | 데이터 분석 및 통계 계산. |
| `toBigIntStatistics()` | 풍부한 bigint 통계 분석. | 큰 정수에 대한 데이터 분석 및 통계 계산. |
| `toWindow()` | 슬라이딩 및 텀블링 윈도우 지원. | 시계열 처리, 배치 처리, 윈도우 기반 연산. |

---

중요 사용 규칙

1.  이벤트 스트림 (`useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`, …)은 `AsynchronousSemantic`을 반환합니다.
    → 청취를 중지하려면 `.limit(n)`, `.sub(start, end)`, 또는 `.takeWhile()`을 **반드시 호출해야 합니다.** 그렇지 않으면 리스너가 계속 활성 상태로 유지됩니다.

2.  최종 연산 (`.toArray()`, `.count()`, `.average()`, `.reduce()`, `.findFirst()` 등)은 수집기로 변환한 후에만 사용 가능합니다:
    ```typescript
    .toUnordered()   // O(n) 시간 및 공간 복잡도, 정렬 없음
    // 또는
    .toOrdered()     // 정렬됨, 순서 유지
    ```

---

### 성능 특성

| 수집기 | 시간 복잡도 | 공간 복잡도 | 정렬 여부 | 최적 용도 |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | 아니요 | 원시 속도, 순서가 필요하지 않은 경우. |
| `toOrdered()` | O(2n) | O(n) | 예 | 안정적인 순서, 인덱싱된 접근, 분석. |
| `toNumericStatistics()` | O(2n) | O(n) | 예 | 정렬된 데이터가 필요한 통계 연산. |
| `toBigIntStatistics()` | O(2n) | O(n) | 예 | bigint에 대한 통계 연산. |
| `toWindow()` | O(2n) | O(n) | 예 | 시간 기반 윈도우 연산. |

속도가 가장 중요할 때는 `toUnordered()`를 선택하세요. 안정적인 순서나 정렬된 데이터에 의존하는 통계 메서드가 필요할 때만 `toOrdered()`를 사용하세요.

---

다른 프론트엔드 스트림 프로세서와의 비교

| 기능 | Semantic-TypeScript | RxJS | 네이티브 Async Iterators / Generators | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| 타입스크립트 통합 | 일급, 네이티브 인덱스 인식과 함께 깊은 타입 지원. | 뛰어나나, 복잡한 제네릭이 포함됨. | 좋음, 수동 타이핑 필요. | 강함, 함수형 우선 스타일. |
| 내장 통계 분석 | `number` 및 `bigint`에 대한 포괄적인 네이티브 지원. | 네이티브로 사용 불가 (사용자 정의 연산자 필요). | 없음. | 없음. |
| 인덱싱 & 위치 인식 | 네이티브, 모든 요소에 강력한 bigint 인덱싱. | 사용자 정의 연산자 필요 (`scan`, `withLatestFrom`). | 수동 카운터 필요. | 기본적, 내장 인덱스 없음. |
| 이벤트 스트림 관리 | 명시적인 조기 중단 제어와 함께 전용, 타입 안전 팩토리. | 강력하지만 수동 구독 관리 필요. | 수동 이벤트 리스너 + 취소. | 좋은 `fromEvent`, 경량. |
| 성능 & 메모리 효율성 | 뛰어남 – 최적화된 `toUnordered()` 및 `toOrdered()` 수집기. | 매우 좋음, 하지만 연산자 체인이 오버헤드 추가. | 탁월함 (오버헤드 없음). | 탁월함. |
| 번들 크기 | 매우 가벼움. | 큼 (트리 쉐이킹 사용 시에도). | 제로 (네이티브). | 작음. |
| API 설계 철학 | 명시적 인덱싱을 가진 함수형 수집기 패턴. | 반응형 Observable 패턴. | Iterator / Generator 패턴. | 함수형, 포인트 프리(Point-free). |
| 조기 종료 및 제어 | 명시적 (`interrupt`, `.limit()`, `.takeWhile()`, `.sub()`). | 좋음 (`take`, `takeUntil`, `first`). | 수동 (`for await…of` 안의 `break`). | 좋음 (`take`, `until`). |
| 동기 및 비동기 지원 | 통합 API – 양쪽 모두에 대한 일급 지원. | 주로 비동기. | 둘 다, 그러나 수동. | 주로 비동기. |
| 학습 곡선 | 함수형 및 인덱싱된 파이프라인에 익숙한 개발자에게 완만함. | 가파름 (많은 연산자, 핫/콜드 Observable). | 낮음. | 중간. |

Semantic-TypeScript의 주요 장점

•   고유한 내장 통계 및 인덱싱 기능으로, 수동 `reduce` 또는 외부 라이브러리의 필요성을 없앱니다.

•   이벤트 스트림에 대한 명시적 제어로 RxJS에서 흔히 발생하는 메모리 누수를 방지합니다.

•   통합된 동기/비동기 설계로 다양한 사용 사례에 대해 단일하고 일관된 API를 제공합니다.

이 비교는 Semantic-TypeScript가 기존의 반응형 라이브러리의 번잡함 없이도 성능, 타입 안전성, 풍부한 분석 기능을 요구하는 현대 타입스크립트 프론트엔드 애플리케이션에 특히 적합한 이유를 보여줍니다.

---

### 탐구할 준비가 되셨나요?

Semantic-TypeScript는 복잡한 데이터 흐름을 가독성 있고 구성 가능하며 고성능 파이프라인으로 변환합니다. 실시간 UI 이벤트를 처리하든, 대규모 데이터 세트를 처리하든, 분석 대시보드를 구축하든, 데이터베이스 수준의 인덱싱의 힘과 함수형 프로그래밍의 우아함을 동시에 제공합니다.

다음 단계:

•   IDE에서 완전한 타이핑된 API를 탐색하세요 (모든 내보내기는 메인 패키지에서 제공됩니다).

•   복잡한 비동기 이터레이터를 깨끗한 Semantic 파이프라인으로 대체한 개발자 커뮤니티에 합류하세요.

Semantic-TypeScript — 스트림이 구조를 만나는 곳.

오늘부터 구축을 시작하고 사려 깊은 인덱싱이 제공하는 차이를 경험해 보세요.

명확하게 구축하고, 자신 있게 나아가며, 의도를 가지고 데이터를 변형하세요.

MIT © Eloy Kim