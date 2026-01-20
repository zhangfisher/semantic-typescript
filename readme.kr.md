# 시맨틱 타입스크립트 스트림 처리 라이브러리

## 소개

시맨틱 타입스크립트는 자바스크립트의 제너레이터 함수, 자바 스트림, 그리고 MySQL 인덱스에서 영감을 받은 현대적인 스트림 처리 라이브러리입니다. 그 핵심 설계 철학은 데이터 인덱싱을 사용하여 효율적인 데이터 처리 파이프라인을 구축하는 것에 기반을 두고 있으며, 프론트엔드 개발을 위한 타입 안전하고 함수형 스타일의 스트리밍 작업 경험을 제공합니다.

전통적인 동기 처리와 달리, 시맨틱은 비동기 처리 모델을 사용합니다. 데이터 스트림을 생성할 때, 터미널이 데이터를 수신하는 시간은 업스트림이 `accept`와 `interrupt` 콜백 함수를 호출하는 시점에 전적으로 의존합니다. 이러한 디자인은 라이브러리가 실시간 데이터 스트림, 대규모 데이터 세트 및 비동기 데이터 소스를 우아하게 처리할 수 있게 해줍니다.

## 설치

```bash
npm install semantic-typescript
```

## 기본 타입

| 타입 | 설명 |
|------|-------------|
| `Invalid<T>` | `null` 또는 `undefined`에서 확장된 타입 |
| `Valid<T>` | `null`과 `undefined`를 제외한 타입 |
| `MaybeInvalid<T>` | `null` 또는 `undefined`일 수 있는 타입 |
| `Primitive` | 기본 타입의 집합 |
| `MaybePrimitive<T>` | 기본 타입일 수 있는 타입 |
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

## 함수 지향 인터페이스

| 인터페이스 | 설명 |
|-----------|-------------|
| `Runnable` | 매개변수가 없고 반환값도 없는 함수 |  
| `Supplier<R>` | 매개변수가 없고 `R`을 반환하는 함수 |  
| `Functional<T, R>` | 단일 매개변수 변환 함수 |
| `BiFunctional<T, U, R>` | 두 개의 매개변수 변환 함수 |
| `TriFunctional<T, U, V, R>` | 세 개의 매개변수 변환 함수 |
| `Predicate<T>` | 단일 매개변수 조건 함수 |
| `BiPredicate<T, U>` | 두 개의 매개변수 조건 함수 |
| `TriPredicate<T, U, V>` | 세 개의 매개변수 조건 함수 |
| `Consumer<T>` | 단일 매개변수 소비자 함수 |
| `BiConsumer<T, U>` | 두 개의 매개변수 소비자 함수 |
| `TriConsumer<T, U, V>` | 세 개의 매개변수 소비자 함수 |
| `Comparator<T>` | 두 개의 매개변수 비교 함수 |
| `Generator<T>` | 생성자 함수(핵심 및 기반) |

```typescript
// 타입 사용 예
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## 타입 가드

| 함수 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | 값이 null이나 undefined가 아닌지 검증 | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | 값이 null이나 undefined인지 검증 | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | boolean인지 확인 | O(1) | O(1) |
| `isString(t: unknown): t is string` | 문자열인지 확인 | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | 숫자인지 확인 | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | 함수인지 확인 | O(1) | O(1) |
| `isObject(t: unknown): t is object` | 객체인지 확인 | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | 심볼인지 확인 | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | BigInt인지 확인 | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | 기본 타입인지 확인 | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | 반복 가능한 객체인지 확인 | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Optional 인스턴스인지 확인 | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Semantic 인스턴스인지 확인 | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Collector 인스턴스인지 확인 | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Collectable 인스턴스인지 확인 | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | OrderedCollectable 인스턴스인지 확인 | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | WindowCollectable 인스턴스인지 확인 | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | UnorderedCollectable 인스턴스인지 확인 | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Statistics 인스턴스인지 확인 | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | NumericStatistics 인스턴스인지 확인 | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | BigIntStatistics 인스턴스인지 확인 | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | Promise 객체인지 확인 | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | AsyncFunction인지 확인 | O(1) | O(1) |

```typescript
// 타입 가드 사용 예
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // 타입 안전, value는 문자열로 추론됩니다.
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // 타입 안전, 이제 반복 가능한 객체입니다.
    for(let item of value){
        console.log(item);
    }
}
```

## 유틸리티 함수

| 함수 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | 일반 비교 함수 | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | 의사 난수 생성기 | O(log n) | O(1) |

```typescript
// 유틸리티 함수 사용 예
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // 시드 기반 난수
```

## 팩토리 메소드

### 옵셔널 팩토리 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `Optional.empty<T>()` | 빈 옵셔널을 생성 | O(1) | O(1) |
| `Optional.of<T>(value)` | 값을 포함하는 옵셔널을 생성 | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | 비어있을 수 있는 옵셔널을 생성 | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | 비어있지 않은 옵셔널을 생성 | O(1) | O(1) |

```typescript
// 옵셔널 사용 예
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((val: number): void => console.log(val)); // 42 출력
console.log(emptyOpt.get(100)); // 100 출력
```

### 컬렉터 팩토리 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | 완전한 컬렉터를 생성 | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | 중단 가능한 컬렉터를 생성 | O(1) | O(1) |

```typescript
// 컬렉터 변환 예
let numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// 성능 우선: 순서가 보장되지 않는 컬렉터 사용
let unordered = numbers
    .filter((n: number): boolean => n > 3)
    .toUnordered(); // 최고의 성능

// 정렬 필요: 순서가 보장되는 컬렉터 사용
let ordered = numbers.sorted();

// 요소 수 계산
let count = Collector.full(
    (): number => 0, // 초기값
    (accumulator: number, element: number): number => accumulator + element, // 누적
    (accumulator: number): number => accumulator // 완료
);
count.collect(from([1,2,3,4,5])); // 스트림에서 카운트
count.collect([1,2,3,4,5]); // 반복 가능한 객체에서 카운트

let find = Collector.shortable(
    (): Optional<number> => Optional.empty(), // 초기값
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // 중단
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // 누적
    (accumulator: Optional<number>): Optional<number> => accumulator // 완료
);
find.collect(from([1,2,3,4,5])); // 첫 번째 요소 찾기
find.collect([1,2,3,4,5]); // 첫 번째 요소 찾기
```

### 시맨틱 팩토리 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | 시간 기반 애니메이션 프레임 스트림을 생성 | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Blob에서 스트림을 생성 | O(n) | O(chunkSize) |
| `empty<E>()` | 빈 스트림을 생성 | O(1) | O(1) |
| `fill<E>(element, count)` | 채워진 스트림을 생성 | O(n) | O(1) |
| `from<E>(iterable)` | 반복 가능한 객체에서 스트림을 생성 | O(1) | O(1) |
| `interval(period, delay?)` | 시간 기반 인터벌 스트림을 생성 | O(1)* | O(1) |
| `iterate<E>(generator)` | 생성자에서 스트림을 생성 | O(1) | O(1) |
| `range(start, end, step)` | 숫자 범위 스트림을 생성 | O(n) | O(1) |
| `websocket(websocket)` | WebSocket에서 스트림을 생성 | O(1) | O(1) |

```typescript
// 시맨틱 팩토리 메소드 사용 예

// Blob에서 스트림을 생성(청크 읽기)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // 스트림 쓰기 성공
    .catch(callback); // 스트림 쓰기 실패

// 빈 스트림을 생성, 다른 스트림과 연결될 때까지 실행되지 않음
empty<string>()
    .toUnordered()
    .join(); // []

// 채워진 스트림을 생성
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// 초기 지연 2초, 실행 주기 5초의 시간 기반 스트림을 생성, 타이머 메커니즘에 기반하여 구현됩니다. 시스템 스케줄링의 정확도 제한으로 인해 시간 드리프트가 발생할 수 있습니다.
const intervalStream = interval(5000, 2000);

// 반복 가능한 객체에서 스트림을 생성
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// 숫자 범위 스트림을 생성
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket 이벤트 스트림
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message") // 메시지 이벤트만 듣기
  .toUnordered() // 이벤트는 일반적으로 순서가 없음
  .forEach((event): void => receive(event)); // 메시지 받기
```

## 시맨틱 클래스 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `concat(other)` | 두 개의 스트림을 연결 | O(n) | O(1) |
| `distinct()` | 중복을 제거 | O(n) | O(n) |
| `distinct(comparator)` | 비교자를 사용하여 중복을 제거 | O(n²) | O(n) |
| `dropWhile(predicate)` | 조건을 만족하는 요소를 버림 | O(n) | O(1) |
| `filter(predicate)` | 요소를 필터링 | O(n) | O(1) |
| `flat(mapper)` | 평탄화 맵 | O(n × m) | O(1) |
| `flatMap(mapper)` | 새로운 타입으로 평탄화 맵 | O(n × m) | O(1) |
| `limit(n)` | 요소 수 제한 | O(n) | O(1) |
| `map(mapper)` | 맵 변환 | O(n) | O(1) |
| `peek(consumer)` | 요소를 엿보기 | O(n) | O(1) |
| `redirect(redirector)` | 인덱스 리디렉션 | O(n) | O(1) |
| `reverse()` | 스트림 반전 | O(n) | O(1) |
| `shuffle()` | 무작위로 섞기 | O(n) | O(1) |
| `shuffle(mapper)` | 매퍼를 사용하여 섞기 | O(n) | O(1) |
| `skip(n)` | 처음 n개 요소 건너뛰기 | O(n) | O(1) |
| `sorted()` | 정렬 | O(n log n) | O(n) |
| `sorted(comparator)` | 비교자를 사용하여 정렬 | O(n log n) | O(n) |
| `sub(start, end)` | 서브스트림 가져오기 | O(n) | O(1) |
| `takeWhile(predicate)` | 조건을 만족하는 요소 가져오기 | O(n) | O(1) |
| `translate(offset)` | 인덱스 변환 | O(n) | O(1) |
| `translate(translator)` | 변환자를 사용하여 인덱스 변환 | O(n) | O(1) |

```typescript
// 시맨틱 작업 예
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0) // 짝수 필터링
    .map((n: number): number => n * 2) // 2배
    .skip(1) // 첫 번째 건너뛰기
    .limit(3) // 3개 요소 제한
    .toUnordered() // 순서가 보장되지 않는 컬렉터로 변환
    .toArray(); // 배열로 변환
// 결과: [8, 12, 20]

// 복잡한 작업 예
const complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // 각 요소를 두 개로 매핑
    .distinct() // 중복 제거
    .shuffle() // 순서 섞기
    .takeWhile((n: number): boolean => n < 50) // 50 미만 요소 가져오기
    .toOrdered() // 순서가 보장되는 컬렉터로 변환
    .toArray(); // 배열로 변환
```

## 시맨틱 변환 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------------|------------|------------|------------|
| `sorted()` | 순서가 보장되는 컬렉터로 변환 | O(n log n) | O(n) |
| `toUnordered()` | 순서가 보장되지 않는 컬렉터로 변환 | O(1) | O(1) |
| `toOrdered()` | 순서가 보장되는 컬렉터로 변환 | O(1) | O(1) |
| `toNumericStatistics()` | 숫자 통계로 변환 | O(n) | O(1) |
| `toBigintStatistics()` | BigInt 통계로 변환 | O(n) | O(1) |
| `toWindow()` | 윈도우 컬렉터로 변환 | O(1) | O(1) |
| `toCollectable()` | `UnorderdCollectable`로 변환 | O(n) | O(1) |
| `toCollectable(mapper)` | 커스텀 컬렉터로 변환 | O(n) | O(1) |

```typescript
// 오름차순으로 정렬된 배열로 변환
from([6,4,3,5,2]) // 스트림 생성
    .sorted() // 스트림을 오름차순으로 정렬
    .toArray(); // [2, 3, 4, 5, 6]

// 내림차순으로 정렬된 배열로 변환
from([6,4,3,5,2]) // 스트림 생성
    .soted((a: number, b: number): number => b - a) // 스트림을 내림차순으로 정렬
    .toArray(); // [6, 5, 4, 3, 2]

// 역순의 배열로 리다이렉트
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // 역순으로 리다이렉트
    .toOrderd() // 리다이렉트된 순서 유지
    .toArray(); // [2, 5, 3, 4, 6]

// 리다이렉션을 무시하고 역순의 배열을 얻음
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // 역순으로 리다이렉트
    .toUnorderd() // 리다이렉션된 순서 무시. 이 작업은 `redirect`, `reverse`, `shuffle` 및 `translate` 작업을 무시합니다
    .toArray(); // [2, 5, 3, 4, 6]

// 스트림을 역순으로 배열로 변환
from([6, 4, 3, 5, 2])
    .reverse() // 스트림을 역순으로 함
    .toOrdered() // 역순을 보장함
    .toArray(); // [2, 5, 3, 4, 6]

// 섞인 스트림을 배열로 덮어쓰기
from([6, 4, 3, 5, 2])
    .shuffle() // 스트림을 섞음
    .sorted() // 섞인 순서를 덮어씀. 이 작업은 `redirect`, `reverse`, `shuffle` 및 `translate` 작업을 덮어씀
    .toArray(); // [2, 5, 3, 4, 6]

// 윈도우 컬렉터로 변환
from([6, 4, 3, 5, 2]).toWindow();

// 숫자 통계로 변환
from([6, 4, 3, 5, 2]).toNumericStatistics();

// BigInt 통계로 변환
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// 데이터 수집을 위한 커스텀 컬렉터 정의
let customizedCollector = from([1, 2, 3, 4, 5])
    .toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable의 수집 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `anyMatch(predicate)` | 임의의 요소가 일치하는지 여부 | O(n) | O(1) |
| `allMatch(predicate)` | 모든 요소가 일치하는지 여부 | O(n) | O(1) |
| `count()` | 요소 수 | O(n) | O(1) |
| `isEmpty()` | 비어 있는지 여부 | O(1) | O(1) |
| `findAny()` | 임의의 요소 찾기 | O(n) | O(1) |
| `findFirst()` | 첫 번째 요소 찾기 | O(n) | O(1) |
| `findLast()` | 마지막 요소 찾기 | O(n) | O(1) |
| `forEach(action)` | 모든 요소 반복 | O(n) | O(1) |
| `group(classifier)` | 분류자로 그룹화 | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | 키-값 추출자로 그룹화 | O(n) | O(n) |
| `join()` | 문자열로 결합 | O(n) | O(n) |
| `join(delimiter)` | 구분자를 사용하여 결합 | O(n) | O(n) |
| `nonMatch(predicate)` | 일치하지 않는 요소가 있는지 여부 | O(n) | O(1) |
| `partition(count)` | 수로 분할 | O(n) | O(n) |
| `partitionBy(classifier)` | 분류자로 분할 | O(n) | O(n) |
| `reduce(accumulator)` | 축소 작업 | O(n) | O(1) |
| `reduce(identity, accumulator)` | 초기값을 가진 축소 | O(n) | O(1) |
| `toArray()` | 배열로 변환 | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | 맵으로 변환 | O(n) | O(n) |
| `toSet()` | 세트로 변환 | O(n) | O(n) |
| `write(stream)` | 스트림에 쓰기 | O(n) | O(1) |

```typescript
// Collectable 작업 예
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// 일치 여부 확인
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// 찾기 작업
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // 임의의 요소

// 그룹화 작업
const grouped = data.groupBy(
    (n: number): string => (n > 5 ? "큰" : "작은"),
    (n: number): number => n * 2
); // {작은: [4, 8], 큰: [12, 16, 20]}

// 축소 작업
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// 출력 작업
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## 통계 분석 메소드

### NumericStatistics 메소드

| 메소드 | 설명 | 시간 복잡도 | 공간 복잡도 |
|------|------|------------|------------|
| `range()` | 범위 | O(n) | O(1) |
| `variance()` | 분산 | O(n) | O(1) |
| `standardDeviation()` | 표준 편차 | O(n) | O(1) |
| `mean()` | 평균 | O(n) | O(1) |
| `median()` | 중앙값 | O(n log n) | O(n) |
| `mode()` | 최빈값 | O(n) | O(n) |
| `frequency()` | 빈도 분포 | O(n) | O(n) |
| `summate()` | 합계 | O(n) | O(1) |
| `quantile(quantile)` | 사분위수 | O(n log n) | O(n) |
| `interquartileRange()` | 사분위수 범위 | O(n log n) | O(n) |
| `skewness()` | 왜도 | O(n) | O(1) |
| `kurtosis()` | 첨도 | O(n) | O(1) |

```typescript
// 통계 분석 예
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("평균:", numbers.mean()); // 5.5
console.log("중앙값:", numbers.median()); // 5.5
console.log("표준 편차:", numbers.standardDeviation()); // ~2.87
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

### 순서 보장이 필요 없는 Collector 선택(성능 우선)
```typescript
// 순서 보장이 필요 없는 경우, 최고의 성능을 위해 순서가 보장되지 않는 Collector 사용
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // 최고의 성능
```

### 순서가 필요한 Collector 선택(순서 필요)
```typescript
// 요소의 순서를 유지해야 하는 경우, 순서가 보장되는 Collector 사용
let ordered = data.sorted(comparator);
```

### 윈도우 작업이 필요한 Collector 선택(윈도우 작업)
```typescript
// 윈도우 작업이 필요한 경우
let windowed: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // 슬라이딩 윈도우
```

### 수치 계산이 필요한 통계 분석 선택(수치 계산)
```typescript
// 통계 분석이 필요한 경우
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // 수치 통계

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // 큰 정수 통계
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## 중요한 참고 사항

1. **정렬 작업의 영향**: 순서가 보장되는 컬렉터에서 `sorted()` 작업은 `redirect`, `translate`, `shuffle`, `reverse`의 효과를 무시합니다.
2. **성능 고려 사항**: 순서 보장이 필요하지 않은 경우, `toUnordered()`를 사용하여 성능을 향상시키는 것이 좋습니다.
3. **메모리 사용량**: 정렬 작업에는 추가적인 O(n)의 메모리가 필요합니다.
4. **실시간 데이터**: 시맨틱 스트림은 실시간 데이터 처리에 적합하며 비동기 데이터 소스를 지원합니다.

이 라이브러리는 타입스크립트 개발자에게 강력하고 유연한 스트리밍 기능을 제공하며, 함수형 프로그래밍의 이점과 타입 안전성 보장을 결합합니다.