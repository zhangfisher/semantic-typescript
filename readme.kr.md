# Semantic-TypeScript 스트림 처리 라이브러리

## 소개

Semantic-TypeScript는 JavaScript GeneratorFunction, Java Stream 및 MySQL Index에서 영감을 받은 현대적인 스트림 처리 라이브러리입니다. 이 라이브러리의 핵심 설계는 데이터 인덱스를 기반으로 효율적인 데이터 처리 파이프라인을 구축하여 프론트엔드 개발자에게 타입 안전성과 함수형 스타일의 스트림 조작 경험을 제공합니다.

기존의 동기식 처리와 달리 Semantic은 비동기 처리 모드를 채택합니다. 데이터 스트림을 생성할 때, 터미널이 데이터를 수신하는 시점은 업스트림이 `accept` 및 `interrupt` 콜백 함수를 언제 호출하는지에 전적으로 의존합니다. 이 설계는 라이브러리가 실시간 데이터 스트림, 대규모 데이터 세트 및 비동기 데이터 소스를 우아하게 처리할 수 있도록 합니다.

## 설치

```bash
npm install semantic-typescript
```

## 기본 타입

| 타입 | 설명 |
|------|-------------|
| `Invalid<T>` | `null` 또는 `undefined`를 확장하는 타입 |
| `Valid<T>` | `null` 및 `undefined`를 제외한 타입 |
| `MaybeInvalid<T>` | `null` 또는 `undefined`가 될 수 있는 타입 |
| `Primitive` | 원시 타입들의 집합 |
| `MaybePrimitive<T>` | 원시 타입이 될 수 있는 타입 |
| `OptionalSymbol` | `Optional` 클래스의 심볼 식별자 |
| `SemanticSymbol` | `Semantic` 클래스의 심볼 식별자 |
| `CollectorsSymbol` | `Collector` 클래스의 심볼 식별자 |
| `CollectableSymbol` | `Collectable` 클래스의 심볼 식별자 |
| `OrderedCollectableSymbol` | `OrderedCollectable` 클래스의 심볼 식별자 |
| `WindowCollectableSymbol` | `WindowCollectable` 클래스의 심볼 식별자 |
| `StatisticsSymbol` | `Statistics` 클래스의 심볼 식별자 |
| `NumericStatisticsSymbol` | `NumericStatistics` 클래스의 심볼 식별자 |
| `BigIntStatisticsSymbol` | `BigIntStatistics` 클래스의 심볼 식별자 |
| `UnorderedCollectableSymbol` | `UnorderedCollectable` 클래스의 심볼 식별자 |

## 함수형 인터페이스

| 인터페이스 | 설명 |
|-----------|-------------|
| `Runnable` | 매개변수 없고 반환값도 없는 함수 |  
| `Supplier<R>` | 매개변수 없이 `R`을 반환하는 함수 |  
| `Functional<T, R>` | 단일 매개변수 변환 함수 |
| `BiFunctional<T, U, R>` | 두 매개변수 변환 함수 |
| `TriFunctional<T, U, V, R>` | 세 매개변수 변환 함수 |
| `Predicate<T>` | 단일 매개변수 조건 함수 |
| `BiPredicate<T, U>` | 두 매개변수 조건 함수 |
| `TriPredicate<T, U, V>` | 세 매개변수 조건 함수 |
| `Consumer<T>` | 단일 매개변수 소비 함수 |
| `BiConsumer<T, U>` | 두 매개변수 소비 함수 |
| `TriConsumer<T, U, V>` | 세 매개변수 소비 함수 |
| `Comparator<T>` | 두 매개변수 비교 함수 |
| `Generator<T>` | 제너레이터 함수 (핵심 및 기반) |

```typescript
// 타입 사용 예제
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## 타입 가드

| 함수 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 값이 null 또는 undefined가 아님을 검증 | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 값이 null 또는 undefined임을 검증 | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | 불리언 여부 확인 | O(1) | O(1) |
| `isString(t: unknown): t is string` | 문자열 여부 확인 | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 숫자 여부 확인 | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 함수 여부 확인 | O(1) | O(1) |
| `isObject(t: unknown): t is object` | 객체 여부 확인 | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | 심볼 여부 확인 | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | BigInt 여부 확인 | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | 기본 타입 여부 확인 | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 반복 가능 여부 확인 | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Optional 인스턴스 여부 확인 | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Semantic 인스턴스 여부 확인 | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Collector 인스턴스 여부 확인 | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Collectable 인스턴스 여부 확인 | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | OrderedCollectable 인스턴스 여부 확인 | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | WindowCollectable 인스턴스 여부 확인 | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | UnorderedCollectable 인스턴스 여부 확인 | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Statistics 인스턴스 여부 확인 | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | NumericStatistics 인스턴스 여부 확인 | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | BigIntStatistics 인스턴스 여부 확인 | O(1) | O(1) |

```typescript
// 타입 가드 사용 예제
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 타입 안전, value는 string으로 추론
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## 유틸리티 함수

| 함수 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 범용 비교 함수 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 의사 난수 생성기 | O(log n) | O(1) |

```typescript
// 유틸리티 함수 사용 예제
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // 시드 기반 난수
const randomBigInt = useRandom(1000n); // BigInt 난수
```

## 팩토리 메서드

### Optional 팩토리 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|--------|------|------------|------------|
| `Optional.empty<T>()` | 빈 Optional 생성 | O(1) | O(1) |
| `Optional.of<T>(value)` | 값을 가진 Optional 생성 | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | null 허용 Optional 생성 | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | null이 아닌 Optional 생성 | O(1) | O(1) |

```typescript
// Optional 사용 예제
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // 42 출력
console.log(emptyOpt.orElse(100)); // 100 출력
```

### Collector 팩토리 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|--------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 완전한 수집기 생성 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 중단 가능한 수집기 생성 | O(1) | O(1) |

```typescript
// 컬렉터 변환 예제
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 성능 우선: 비정렬 컬렉터 사용
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// 정렬 필요: 정렬 컬렉터 사용  
const ordered = numbers.sorted();

// 요소 개수 세기
let count = Collector.full(
    () => 0, // 초기값
    (accumulator, element) => accumulator + element, // 누적
    (accumulator) => accumulator // 완료
);
count.collect(from([1,2,3,4,5])); // 스트림에서 카운트
count.collect([1,2,3,4,5]); // 이터러블 객체에서 카운트

let find = Collector.shortable(
    () => Optional.empty(), // 초기값
    (element, index, accumulator) => accumulator.isPresent(), // 중단
    (accumulator, element, index) => Optional.of(element), // 누적
    (accumulator) => accumulator // 완료
);
find.collect(from([1,2,3,4,5])); // 첫 번째 요소 찾기
find.collect([1,2,3,4,5]); // 첫 번째 요소 찾기
```

### Semantic 팩토리 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|-------|------|-------------|-------------|
| `blob(blob, chunkSize)` | Blob으로부터 스트림 생성 | O(n) | O(chunkSize) |
| `empty<E>()` | 빈 스트림 생성 | O(1) | O(1) |
| `fill<E>(element, count)` | 채워진 스트림 생성 | O(n) | O(1) |
| `from<E>(iterable)` | 반복 가능 객체로부터 스트림 생성 | O(1) | O(1) |
| `generate<E>(element, interrupt)` | 생성기를 사용한 스트림 생성 | O(1) | O(1) |
| `interval(period, delay?)` | 정기적 간격 스트림 생성 | O(1)* | O(1) |
| `iterate<E>(generator)` | 생성기로부터 스트림 생성 | O(1) | O(1) |
| `range(start, end, step)` | 숫자 범위 스트림 생성 | O(n) | O(1) |
| `websocket(websocket)` | WebSocket으로부터 스트림 생성 | O(1) | O(1) |

```typescript
// Semantic 팩토리 메서드 사용 예시

// Blob으로부터 스트림 생성 (청크 읽기)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // 스트림 쓰기 성공
  .catch(writeFi); // 스트림 쓰기 실패

// 다른 스트림과 연결될 때까지 실행되지 않는 빈 스트림 생성
empty<string>()
  .toUnordered()
  .join(); //[]

// 채워진 스트림 생성
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 초기 지연 2초, 실행 주기 5초의 시계열 스트림 생성
// 타이머 메커니즘으로 구현, 시스템 스케줄링 제한으로 인한 시간 변동 가능성 있음
const intervalStream = interval(5000, 2000);

// 반복 가능 객체로부터 스트림 생성
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// 범위 스트림 생성
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 이벤트 스트림
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // 메시지 이벤트만 모니터링
  .toUnordered() // 이벤트는 일반적으로 정렬되지 않음
  .forEach((event)=> receive(event)); // 메시지 수신
```

## Semantic 클래스 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|--------|------|------------|------------|
| `concat(other)` | 두 스트림 연결 | O(n) | O(1) |
| `distinct()` | 중복 제거 | O(n) | O(n) |
| `distinct(comparator)` | 비교기를 사용한 중복 제거 | O(n²) | O(n) |
| `dropWhile(predicate)` | 조건을 만족하는 요소 버리기 | O(n) | O(1) |
| `filter(predicate)` | 요소 필터링 | O(n) | O(1) |
| `flat(mapper)` | 평면화 매핑 | O(n × m) | O(1) |
| `flatMap(mapper)` | 새로운 타입으로 평면화 매핑 | O(n × m) | O(1) |
| `limit(n)` | 요소 수 제한 | O(n) | O(1) |
| `map(mapper)` | 매핑 변환 | O(n) | O(1) |
| `peek(consumer)` | 요소 검사 | O(n) | O(1) |
| `redirect(redirector)` | 인덱스 리디렉션 | O(n) | O(1) |
| `reverse()` | 스트림 반전 | O(n) | O(1) |
| `shuffle()` | 무작위 셔플 | O(n) | O(1) |
| `shuffle(mapper)` | 매퍼를 사용한 셔플 | O(n) | O(1) |
| `skip(n)` | 처음 n개 요소 건너뛰기 | O(n) | O(1) |
| `sorted()` | 정렬 | O(n log n) | O(n) |
| `sorted(comparator)` | 비교기를 사용한 정렬 | O(n log n) | O(n) |
| `sub(start, end)` | 서브 스트림 가져오기 | O(n) | O(1) |
| `takeWhile(predicate)` | 조건을 만족하는 요소 가져오기 | O(n) | O(1) |
| `translate(offset)` | 인덱스 변환 | O(n) | O(1) |
| `translate(translator)` | 변환기를 사용한 인덱스 변환 | O(n) | O(1) |

```typescript
// Semantic 작업 예제
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // 짝수 필터링
    .map(n => n * 2)                 // 2배 변환
    .skip(1)                         // 첫 번째 요소 건너뛰기
    .limit(3)                        // 3개 요소로 제한
    .toUnordered()                    // 비정렬 수집기로 변환
    .toArray();                      // 배열로 변환
// 결과: [8, 12, 20]

// 복잡한 작업 예제
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // 각 요소를 2개 요소로 매핑
    .distinct()                      // 중복 제거
    .shuffle()                       // 무작위 셔플
    .takeWhile(n => n < 50)         // 50 미만 요소 가져오기
    .toOrdered()                     // 정렬된 수집기로 변환
    .toArray();                      // 배열로 변환
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

## Collectable 수집 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|--------|------|------------|------------|
| `anyMatch(predicate)` | 일치하는 요소 존재 여부 확인 | O(n) | O(1) |
| `allMatch(predicate)` | 모든 요소 일치 여부 확인 | O(n) | O(1) |
| `count()` | 요소 개수 세기 | O(n) | O(1) |
| `isEmpty()` | 비어 있는지 확인 | O(1) | O(1) |
| `findAny()` | 아무 요소 찾기 | O(n) | O(1) |
| `findFirst()` | 첫 번째 요소 찾기 | O(n) | O(1) |
| `findLast()` | 마지막 요소 찾기 | O(n) | O(1) |
| `forEach(action)` | 모든 요소 반복 | O(n) | O(1) |
| `group(classifier)` | 분류기로 그룹화 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 키-값 추출기로 그룹화 | O(n) | O(n) |
| `join()` | 문자열로 결합 | O(n) | O(n) |
| `join(delimiter)` | 구분자로 결합 | O(n) | O(n) |
| `nonMatch(predicate)` | 일치하는 요소 없음 확인 | O(n) | O(1) |
| `partition(count)` | 개수로 분할 | O(n) | O(n) |
| `partitionBy(classifier)` | 분류기로 분할 | O(n) | O(n) |
| `reduce(accumulator)` | 축소 작업 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 초기값을 사용한 축소 | O(n) | O(1) |
| `toArray()` | 배열로 변환 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Map으로 변환 | O(n) | O(n) |
| `toSet()` | Set으로 변환 | O(n) | O(n) |
| `write(stream)` | 스트림에 쓰기 | O(n) | O(1) |

```typescript
// Collectable 작업 예제
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// 일치 확인
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// 검색 작업
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // 아무 요소

// 그룹화 작업
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// 축소 작업
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 출력 작업
data.join(", "); // "2, 4, 6, 8, 10"
```

## 통계 분석 메서드

### NumericStatistics 메서드

| 메서드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|--------|------|------------|------------|
| `range()` | 범위 | O(n) | O(1) |
| `variance()` | 분산 | O(n) | O(1) |
| `standardDeviation()` | 표준편차 | O(n) | O(1) |
| `mean()` | 평균 | O(n) | O(1) |
| `median()` | 중앙값 | O(n log n) | O(n) |
| `mode()` | 최빈값 | O(n) | O(n) |
| `frequency()` | 빈도 분포 | O(n) | O(n) |
| `summate()` | 합계 | O(n) | O(1) |
| `quantile(quantile)` | 분위수 | O(n log n) | O(n) |
| `interquartileRange()` | 사분위 범위 | O(n log n) | O(n) |
| `skewness()` | 왜도 | O(n) | O(1) |
| `kurtosis()` | 첨도 | O(n) | O(1) |

```typescript
// 통계 분석 예제
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("평균:", numbers.mean()); // 5.5
console.log("중앙값:", numbers.median()); // 5.5
console.log("표준편차:", numbers.standardDeviation()); // ~2.87
console.log("합계:", numbers.summate()); // 55

// 매퍼를 사용한 통계 분석
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("매핑된 평균:", objects.mean(obj => obj.value)); // 20
```

## 성능 선택 가이드

### 비정렬 수집기 선택 (성능 우선)
```typescript
// 순서 보장이 필요하지 않은 경우
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 최고 성능
```

### 정렬된 수집기 선택 (순서 필요)
```typescript
// 요소 순서를 유지해야 하는 경우
const ordered = data.sorted(comparator);
```

### 윈도우 수집기 선택 (윈도우 작업)
```typescript
// 윈도우 작업이 필요한 경우
const windowed = data
    .toWindow()
    .slide(5n, 2n); // 슬라이딩 윈도우
```

### 통계 분석 선택 (숫자 계산)
```typescript
// 통계 분석이 필요한 경우
const stats = data
    .toNumericStatistics(); // 숫자 통계

const bigIntStats = data
    .toBigintStatistics(); // BigInt 통계
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 중요한 주의사항

1. **정렬 작업의 영향**: 정렬된 수집기에서 `sorted()` 작업은 `redirect`, `translate`, `shuffle`, `reverse` 효과를 덮어씁니다
2. **성능 고려사항**: 순서 보장이 필요하지 않으면 `toUnoredered()`를 우선하여 더 나은 성능을 얻으세요
3. **메모리 사용량**: 정렬 작업에는 O(n)의 추가 공간이 필요합니다
4. **실시간 데이터**: Semantic 스트림은 실시간 데이터에 적합하며 비동기 데이터 소스를 지원합니다

이 라이브러리는 TypeScript 개발자에게 강력하고 유연한 스트림 처리 기능을 제공하며 함수형 프로그래밍의 이점과 타입 안전성을 결합합니다.