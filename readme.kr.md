# Semantic-TypeScript 스트림 처리 프레임워크

## 소개

Semantic-TypeScript는 JavaScript GeneratorFunction, Java Stream 및 MySQL Index에서 영감을 받은 현대적인 스트림 처리 라이브러리입니다. 핵심 설계 철학은 데이터 인덱싱을 통해 효율적인 데이터 처리 파이프라인을 구축하는 데 있으며, 프론트엔드 개발을 위해 타입 안전적이고 함수형 스타일의 스트리밍 작업 경험을 제공합니다.

기존의 동기식 처리와 달리 Semantic은 비동기 처리 모델을 채택합니다. 데이터 스트림을 생성할 때 최종 데이터 수신 시점은 전적으로 업스트림이 `accept` 및 `interrupt` 콜백 함수를 호출하는 시점에 따라 결정됩니다. 이 설계는 라이브러리가 실시간 데이터 스트림, 대용량 데이터 세트 및 비동기 데이터 소스를 우아하게 처리할 수 있게 합니다.

## 핵심 기능

| 기능 | 설명 | 장점 |
|------|------|------|
| **타입 안전 제네릭** | 완전한 TypeScript 타입 지원 | 컴파일 타임 오류 감지, 더 나은 개발 경험 |
| **함수형 프로그래밍** | 불변 데이터 구조 및 순수 함수 | 예측 가능한 코드, 쉬운 테스트 및 유지보수 |
| **지연 평가** | 주문형 계산, 성능 최적화 | 대용량 데이터 처리 시 높은 메모리 효율 |
| **비동기 스트림 처리** | 제너레이터 기반 비동기 데이터 스트림 | 실시간 데이터 및 이벤트 기반 시나리오에 적합 |
| **다중 패러다임 수집기** | 정렬, 비정렬, 통계적 수집 전략 | 다양한 시나리오에 따른 최적 전략 선택 |
| **통계 분석** | 내장된 완전한 통계 계산 함수 | 통합 데이터 분석 및 보고서 생성 |

## 성능 고려 사항

**중요 참고**: 다음 메서드들은 데이터를 수집하고 정렬하기 위해 성능을 희생합니다:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

특히 중요: `sorted()` 및 `sorted(comparator)`는 다음 메서드들의 결과를 재정의합니다:
- `redirect(redirector)`
- `translate(translator)`
- `shuffle(mapper)`

## 팩토리 메서드

### 스트림 생성 팩토리

| 메서드 | 시그니처 | 설명 | 예시 |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Blob을 바이트 스트림으로 변환 | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | 빈 스트림 생성 | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | 지정된 수의 요소로 채움 | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | 반복 가능 객체로부터 스트림 생성 | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | 숫자 범위 스트림 생성 | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | 제너레이터 함수로부터 스트림 생성 | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | WebSocket으로부터 이벤트 스트림 생성 | `websocket(socket)` |

**코드 예시 보충:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// 배열로부터 스트림 생성
const numberStream = from([1, 2, 3, 4, 5]);

// 숫자 범위 스트림 생성
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// 반복 요소로 채움
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// 빈 스트림 생성
const emptyStream = empty<number>();
```

### 유틸리티 함수 팩토리

| 메서드 | 시그니처 | 설명 | 예시 |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | 값이 유효한지 검증 | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | 값이 무효한지 검증 | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | 일반 비교 함수 | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | 의사 난수 생성기 | `useRandom(5)` → 난수 |

**코드 예시 보충:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// 데이터 유효성 검증
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // validate가 데이터가 null이 아님을 보장하므로 안전한 호출
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("데이터 무효"); // invalidate가 null을 감지했으므로 실행됨
}

// 값 비교
const comparison = useCompare("apple", "banana"); // -1

// 난수 생성
const randomNum = useRandom(42); // 시드 42 기반 난수
```

## 핵심 클래스 상세

### Optional<T> - 안전한 Null 값 처리

Optional 클래스는 null 또는 undefined일 수 있는 값을 안전하게 처리하기 위한 함수형 접근 방식을 제공합니다.

| 메서드 | 반환 타입 | 설명 | 시간 복잡도 |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | 조건을 만족하는 값 필터링 | O(1) |
| `get()` | `T` | 값 가져오기, 비어있으면 오류 발생 | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | 값 또는 기본값 가져오기 | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | 값이 존재하면 액션 실행 | O(1) |
| `isEmpty()` | `boolean` | 비어있는지 확인 | O(1) |
| `isPresent()` | `boolean` | 값이 존재하는지 확인 | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | 값 매핑 및 변환 | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Optional 인스턴스 생성 | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | nullable Optional 생성 | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | non-null Optional 생성 | O(1) |

**코드 예시 보충:**
```typescript
import { Optional } from 'semantic-typescript';

// Optional 인스턴스 생성
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// 연쇄 연산
const result = optionalValue
    .filter(val => val.length > 3) // 길이가 3보다 큰 값 필터링
    .map(val => val.toUpperCase()) // 대문자로 변환
    .getOrDefault("default"); // 값 또는 기본값 가져오기

console.log(result); // "HELLO" 또는 "default"

// 안전한 연산
optionalValue.ifPresent(val => {
    console.log(`값 존재: ${val}`);
});

// 상태 확인
if (optionalValue.isPresent()) {
    console.log("값 있음");
} else if (optionalValue.isEmpty()) {
    console.log("비어 있음");
}
```

### Semantic<E> - 지연 데이터 스트림

Semantic은 풍부한 스트림 연산자를 제공하는 핵심 스트림 처리 클래스입니다.

#### 스트림 변환 연산

| 메서드 | 반환 타입 | 설명 | 성능 영향 |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | 두 스트림 연결 | O(n+m) |
| `distinct()` | `Semantic<E>` | 중복 제거 (Set 사용) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | 사용자 정의 비교자 중복 제거 | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | 조건을 만족하는 시작 요소 버림 | O(n) |
| `filter(predicate)` | `Semantic<E>` | 요소 필터링 | O(n) |
| `flat(mapper)` | `Semantic<E>` | 중첩 스트림 평탄화 | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | 매핑 및 평탄화 | O(n×m) |
| `limit(n)` | `Semantic<E>` | 요소 수 제한 | O(n) |
| `map(mapper)` | `Semantic<R>` | 요소 매핑 및 변환 | O(n) |
| `peek(consumer)` | `Semantic<E>` | 요소 확인 (수정 없음) | O(n) |
| `redirect(redirector)` | `Semantic<E>` | 인덱스 재지정 | O(n) |
| `reverse()` | `Semantic<E>` | 스트림 순서 반전 | O(n) |
| `shuffle()` | `Semantic<E>` | 무작위 셔플 | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | 사용자 정의 셔플 로직 | O(n) |
| `skip(n)` | `Semantic<E>` | 처음 n개 요소 건너뜀 | O(n) |
| `sub(start, end)` | `Semantic<E>` | 부분 스트림 가져오기 | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | 조건을 만족하는 시작 요소 가져오기 | O(n) |
| `translate(offset)` | `Semantic<E>` | 인덱스 변환 | O(n) |
| `translate(translator)` | `Semantic<E>` | 사용자 정의 인덱스 변환 | O(n) |

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 스트림 변환 연산 예시
const processedStream = stream
    .filter(x => x % 2 === 0) // 짝수 필터링
    .map(x => x * 2) // 각 요소에 2 곱하기
    .distinct() // 중복 제거
    .limit(3) // 처음 3개 요소로 제한
    .peek((val, index) => console.log(`인덱스 ${index}의 요소 ${val}`)); // 요소 확인

// 참고: 스트림은 아직 실행되지 않음, 터미널 연산을 위해 Collectable로 변환 필요
```

#### 스트림 터미널 연산

| 메서드 | 반환 타입 | 설명 | 성능 특성 |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | 정렬된 컬렉션으로 변환 | 정렬 연산, 낮은 성능 |
| `toUnordered()` | `UnorderedCollectable<E>` | 비정렬 컬렉션으로 변환 | 가장 빠름, 정렬 없음 |
| `toWindow()` | `WindowCollectable<E>` | 윈도우 컬렉션으로 변환 | 정렬 연산, 낮은 성능 |
| `toNumericStatistics()` | `Statistics<E, number>` | 숫자 통계 분석 | 정렬 연산, 낮은 성능 |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Big integer 통계 분석 | 정렬 연산, 낮은 성능 |
| `sorted()` | `OrderedCollectable<E>` | 자연 정렬 | 재지정 결과 재정의 |
| `sorted(comparator)` | `OrderedCollectable<E>` | 사용자 정의 정렬 | 재지정 결과 재정의 |

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// 정렬된 컬렉션으로 변환 (낮은 성능)
const ordered = semanticStream.toOrdered();

// 비정렬 컬렉션으로 변환 (가장 빠름)
const unordered = semanticStream.toUnordered();

// 자연 정렬
const sortedNatural = semanticStream.sorted();

// 사용자 정의 정렬
const sortedCustom = semanticStream.sorted((a, b) => b - a); // 내림차순 정렬

// 통계 객체로 변환
const stats = semanticStream.toNumericStatistics();

// 참고: 위 메서드들은 Semantic 인스턴스를 통해 호출하여 Collectable을 얻은 후 터미널 메서드 사용 필요
```

### Collector<E, A, R> - 데이터 수집기

수집기는 스트림 데이터를 특정 구조로 집계하는 데 사용됩니다.

| 메서드 | 설명 | 사용 시나리오 |
|------|------|----------|
| `collect(generator)` | 데이터 수집 실행 | 스트림 터미널 연산 |
| `static full(identity, accumulator, finisher)` | 완전한 수집기 생성 | 완전한 처리 필요 |
| `static shortable(identity, interruptor, accumulator, finisher)` | 중단 가능 수집기 생성 | 조기 종료 가능 |

**코드 예시 보충:**
```typescript
import { Collector } from 'semantic-typescript';

// 사용자 정의 수집기 생성
const sumCollector = Collector.full(
    () => 0, // 초기 값
    (acc, value) => acc + value, // 누산기
    result => result // 완료 함수
);

// 수집기 사용 (Semantic에서 Collectable로 변환 필요)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - 수집 가능 데이터 추상 클래스

풍부한 데이터 집계 및 변환 메서드를 제공합니다. **참고: 반드시 Semantic 인스턴스를 통해 sorted(), toOrdered() 등을 먼저 호출하여 Collectable 인스턴스를 얻은 후 다음 메서드들을 사용해야 합니다.**

#### 데이터 쿼리 연산

| 메서드 | 반환 타입 | 설명 | 예시 |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | 어떤 요소라도 일치하는지 여부 | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | 모든 요소가 일치하는지 여부 | `allMatch(x => x > 0)` |
| `count()` | `bigint` | 요소 수 통계 | `count()` → `5n` |
| `isEmpty()` | `boolean` | 스트림이 비어 있는지 여부 | `isEmpty()` |
| `findAny()` | `Optional<E>` | 아무 요소 찾기 | `findAny()` |
| `findFirst()` | `Optional<E>` | 첫 번째 요소 찾기 | `findFirst>` |
| `findLast()` | `Optional<E>` | 마지막 요소 찾기 | `findLast>` |

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// 터미널 메서드 사용 전 반드시 Collectable로 변환
const collectable = numbers.toUnordered();

// 데이터 쿼리 연산
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // 아무 요소
```

#### 데이터 집계 연산

| 메서드 | 반환 타입 | 설명 | 복잡도 |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | 분류자에 따른 그룹화 | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | 키-값 추출기에 따른 그룹화 | O(n) |
| `join()` | `string` | 문자열로 결합 | O(n) |
| `join(delimiter)` | `string` | 구분자로 결합 | O(n) |
| `partition(count)` | `E[][]` | 개수에 따른 분할 | O(n) |
| `partitionBy(classifier)` | `E[][]` | 분류자에 따른 분할 | O(n) |
| `reduce(accumulator)` | `Optional<E>` | 축소 연산 | O(n) |
| `reduce(identity, accumulator)` | `E` | 식별자를 사용한 축소 | O(n) |
| `toArray()` | `E[]` | 배열로 변환 | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Map으로 변환 | O(n) |
| `toSet()` | `Set<E>` | Set으로 변환 | O(n) |

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// 집계 연산 사용 전 반드시 Collectable로 변환
const collectable = people.toUnordered();

// 그룹화 연산
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// 컬렉션으로 변환
const array = collectable.toArray(); // 원본 배열
const set = collectable.toSet(); // Set 컬렉션
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// 축소 연산
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### 특정 수집기 구현

#### UnorderedCollectable<E>
- **특징**: 가장 빠른 수집기, 정렬 없음
- **사용 시나리오**: 순서 중요하지 않음, 최대 성능 원할 때
- **메서드**: 모든 Collectable 메서드 상속

#### OrderedCollectable<E>
- **특징**: 요소 순서 보장, 낮은 성능
- **사용 시나리오**: 정렬된 결과 필요
- **특별 메서드**: 모든 메서드 상속, 내부 정렬 상태 유지

#### WindowCollectable<E>
- **특징**: 슬라이딩 윈도우 연산 지원
- **사용 시나리오**: 시계열 데이터 분석
- **특별 메서드**:
  - `slide(size, step)` - 슬라이딩 윈도우
  - `tumble(size)` - 텀블링 윈도우

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 비정렬 수집기 (가장 빠름)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // 원본 순서 유지 가능 [1, 2, 3, ...]

// 정렬 수집기
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // 정렬 보장 [1, 2, 3, ...]

// 윈도우 수집기
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // 윈도우 크기 3, 단계 2
// 윈도우 1: [1, 2, 3], 윈도우 2: [3, 4, 5], 윈도우 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // 텀블링 윈도우 크기 4
// 윈도우 1: [1, 2, 3, 4], 윈도우 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - 통계 분석

통계 분석 기본 클래스로 풍부한 통계 계산 메서드를 제공합니다. **참고: 반드시 Semantic 인스턴스를 통해 toNumericStatistics() 또는 toBigIntStatistics()를 호출하여 Statistics 인스턴스를 얻은 후 다음 메서드들을 사용해야 합니다.**

#### 통계 계산 연산

| 메서드 | 반환 타입 | 설명 | 알고리즘 복잡도 |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | 최대값 | O(n) |
| `minimum()` | `Optional<E>` | 최소값 | O(n) |
| `range()` | `D` | 범위 (최대-최소) | O(n) |
| `variance()` | `D` | 분산 | O(n) |
| `standardDeviation()` | `D` | 표준 편차 | O(n) |
| `mean()` | `D` | 평균값 | O(n) |
| `median()` | `D` | 중앙값 | O(n log n) |
| `mode()` | `D` | 최빈값 | O(n) |
| `frequency()` | `Map<D, bigint>` | 빈도 분포 | O(n) |
| `summate()` | `D` | 합계 | O(n) |
| `quantile(quantile)` | `D` | 분위수 | O(n log n) |
| `interquartileRange()` | `D` | 사분위 범위 | O(n log n) |
| `skewness()` | `D` | 왜도 | O(n) |
| `kurtosis()` | `D` | 첨도 | O(n) |

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 통계 메서드 사용 전 반드시 통계 객체로 변환
const stats = numbers.toNumericStatistics();

// 기본 통계
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// 고급 통계
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // 어떤 값 (모두 한 번씩 나타나므로)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// 빈도 분포
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### 특정 통계 구현 클래스

**NumericStatistics<E>**
- number 타입 통계 분석 처리
- 모든 통계 계산이 number 타입 반환

**BigIntStatistics<E>**
- bigint 타입 통계 분석 처리
- 모든 통계 계산이 bigint 타입 반환

**코드 예시 보충:**
```typescript
import { from } from 'semantic-typescript';

// 숫자 통계
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Big integer 통계
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// 매퍼 함수를 사용한 통계
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

## 완전한 사용 예시

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. 데이터 스트림 생성
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. 스트림 처리 파이프라인
const processedStream = semanticStream
    .filter(val => validate(val)) // null 및 undefined 필터링
    .map(val => val! * 2) // 각 값에 2 곱하기 (validate가 비어있지 않음을 보장하므로 ! 사용)
    .distinct(); // 중복 제거

// 3. Collectable로 변환 및 터미널 연산 사용
const collectable = processedStream.toUnordered();

// 4. 데이터 검증 및 사용
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // 다시 필터링
        .toArray(); // 배열로 변환
    
    console.log("처리 결과:", results); // [16, 18, 14, 8, 12]
    
    // 통계 정보
    const stats = processedStream.toNumericStatistics();
    console.log("평균값:", stats.mean()); // 11.2
    console.log("총합:", stats.summate()); // 56
}

// 5. 잠재적으로 무효한 데이터 처리
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("유효한 데이터:", validData); // [1, 3, 4]
console.log("무효한 데이터:", invalidData); // [null, null]
```

## 중요한 사용 규칙 요약

1. **스트림 생성**: `from()`, `range()`, `fill()` 등 팩토리 메서드를 사용하여 Semantic 인스턴스 생성
2. **스트림 변환**: Semantic 인스턴스에서 `map()`, `filter()`, `distinct()` 등 메서드 호출
3. **Collectable로 변환**: 반드시 Semantic 인스턴스를 통해 다음 메서드 중 하나 호출:
   - `toOrdered()` - 정렬 수집기
   - `toUnordered()` - 비정렬 수집기 (가장 빠름)
   - `toWindow()` - 윈도우 수집기
   - `toNumericStatistics()` - 숫자 통계
   - `toBigIntStatistics()` - Big integer 통계
   - `sorted()` - 자연 정렬
   - `sorted(comparator)` - 사용자 정의 정렬
4. **터미널 연산**: Collectable 인스턴스에서 `toArray()`, `count()`, `summate()` 등 터미널 메서드 호출
5. **데이터 검증**: `validate()`를 사용하여 데이터가 null/undefined가 아님을 보장, `invalidate()`를 사용하여 무효한 데이터 확인

이 설계는 타입 안전성과 성능 최적화를 보장하면서 풍부한 스트림 처리 기능을 제공합니다.