# 📘 semantic-typescript

TypeScript에서 **의미론적 데이터 처리(Semantic Data Processing)** 를 위한 강력하고 타입 안전한 유틸리티 라이브러리입니다.  
컬렉션, 스트림, 시퀀스를 함수형 스타일로 다룰 수 있는 구성 요소들을 제공하며, 정렬, 필터링, 그룹화, 통계 분석 등을 지원합니다.

**정렬된 데이터든 정렬되지 않은 데이터든**, **통계 분석을 하든**, 혹은 단순히 **연산을 유창하게 연결(chain)하고 싶든**, 이 라이브러리가 도와드립니다.

---

## 🧩 주요 기능

- ✅ 전체적으로 **타입 안전한 제네릭(Type-safe Generics)**
- ✅ **함수형 프로그래밍 스타일** (map, filter, reduce 등)
- ✅ **의미론적 데이터 스트림(Semantic<E>)** - 지연 평가(Lazy Evaluation) 지원
- ✅ 스트림을 구조화된 데이터로 변환하는 **컬렉터(Collectors)**
- ✅ **정렬된(Sorted) 및 비정렬된(Unordered) 컬렉터** — `toUnordered()`는 **가장 빠르며 정렬하지 않음**
- ✅ `sorted()`, `toOrdered()`, 비교자(Comparator)를 통한 **정렬 기능**
- ✅ **통계 분석(Statistics)** (`NumericStatistics`, `BigIntStatistics` 등)
- ✅ **Optional<T>** — null 또는 undefined 값을 안전하게 다루는 모나드(Monad)
- ✅ **반복자(Iterator) & 생성기(Generator)** 기반 설계 — 대규모 또는 비동기 데이터에도 적합

---

## 📦 설치

```bash
npm install semantic-typescript
```

---

## 🧠 핵심 개념

### 1. `Optional<T>` — null/undefined 값 안전하게 처리

값이 null 또는 undefined 일 수 있는 경우를 안전하게 처리할 수 있는 모나딕(Monadic) 컨테이너입니다.

#### 메서드:

| 메서드 | 설명 | 예제 |
|--------|------|------|
| `of(value)` | 값 감싸기 (null 가능) | `Optional.of(null)` |
| `ofNullable(v)` | null 허용하여 감싸기 | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | null이면 예외 발생 | `Optional.ofNonNull(5)` |
| `get()` | 값 가져오기 (없으면 예외) | `opt.get()` |
| `getOrDefault(d)` | 값 가져오기 또는 기본값 | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | 값이 있으면 부작용 실행 | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | 값이 있으면 변환 | `opt.map(x => x + 1)` |
| `filter(fn)` | 조건을 만족하는 값만 유지 | `opt.filter(x => x > 0)` |
| `isEmpty()` | 비어있는지 확인 | `opt.isEmpty()` |
| `isPresent()` | 값이 있는지 확인 | `opt.isPresent()` |

#### 예제:

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 또는 0
```

---

### 2. `Semantic<E>` — 지연 평가 데이터 스트림

요소들의 **지연 평가(Lazy), 구성 가능한 시퀀스**입니다. Java의 Streams나 Kotlin의 Sequences와 유사합니다.

`from()`, `range()`, `iterate()`, `fill()` 같은 헬퍼 함수로 `Semantic` 스트림을 생성할 수 있습니다.

#### 생성 방법:

| 함수 | 설명 | 예제 |
|------|------|------|
| `from(iterable)` | 배열, Set, 반복 가능한 객체로부터 생성 | `from([1, 2, 3])` |
| `range(start, end, step?)` | 숫자 범위 생성 | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | 요소를 N번 반복 | `fill('a', 3n)` |
| `iterate(gen)` | 사용자 정의 생성기 함수 사용 | `iterate(genFn)` |

#### 주요 연산자:

| 메서드 | 설명 | 예제 |
|--------|------|------|
| `map(fn)` | 각 요소 변환 | `.map(x => x * 2)` |
| `filter(fn)` | 조건을 만족하는 요소만 유지 | `.filter(x => x > 10)` |
| `limit(n)` | 처음 N개 요소로 제한 | `.limit(5)` |
| `skip(n)` | 처음 N개 요소 건너뛰기 | `.skip(2)` |
| `distinct()` | 중복 제거 (기본적으로 Set 사용) | `.distinct()` |
| `sorted()` | 요소 정렬 (자연 순서) | `.sorted()` |
| `sorted(comparator)` | 커스텀 정렬 | `.sorted((a, b) => a - b)` |
| `toOrdered()` | 정렬 후 `OrderedCollectable` 반환 | `.toOrdered()` |
| `toUnordered()` | **정렬 없음 – 가장 빠름** | `.toUnordered()` ✅ |
| `collect(collector)` | 컬렉터로 집계 | `.collect(Collector.full(...))` |
| `toArray()` | 배열로 변환 | `.toArray()` |
| `toSet()` | Set으로 변환 | `.toSet()` |
| `toMap(keyFn, valFn)` | Map으로 변환 | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` — 🚀 가장 빠름, 정렬 없음

**정렬이 필요 없고 최고의 성능을 원한다면** 아래와 같이 사용하세요:

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **어떠한 정렬 알고리즘도 적용되지 않습니다.**  
순서가 중요하지 않고 속도가 최우선일 때 이 방법을 사용하세요.

---

### 4. `toOrdered()` 및 `sorted()` — 정렬된 출력

**정렬된 결과가 필요한 경우** 다음을 사용할 수 있습니다:

```typescript
const ordered = semanticStream.sorted(); // 자연 정렬
const customSorted = semanticStream.sorted((a, b) => a - b); // 커스텀 비교자
const orderedCollectable = semanticStream.toOrdered(); // 정렬됨
```

⚠️ 이 메서드들은 **요소를 정렬**하며, 자연 정렬 또는 제공된 비교자를 사용합니다.

---

### 5. `Collector<E, A, R>` — 데이터 집계

컬렉터를 사용하면 스트림을 **단일 값 또는 복잡한 구조로 축약**할 수 있습니다.

내장된 정적 팩토리:

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

하지만 보통은 `Collectable` 클래스의 고수준 메서드를 통해 사용하게 됩니다.

---

### 6. `Collectable<E>` (추상 클래스)

다음 클래스들의 기반 클래스입니다:

- `OrderedCollectable<E>` — 정렬된 출력
- `UnorderedCollectable<E>` — 정렬 없음, 가장 빠름
- `WindowCollectable<E>` — 슬라이딩 윈도우
- `Statistics<E, D>` — 통계 집계

#### 공통 메서드 (상속을 통해):

| 메서드 | 설명 | 예제 |
|--------|------|------|
| `count()` | 요소 개수 | `.count()` |
| `toArray()` | 배열로 변환 | `.toArray()` |
| `toSet()` | Set으로 변환 | `.toSet()` |
| `toMap(k, v)` | Map으로 변환 | `.toMap(x => x.id, x => x)` |
| `group(k)` | 키로 그룹화 | `.group(x => x.category)` |
| `findAny()` | 임의의 요소 (Optional) | `.findAny()` |
| `findFirst()` | 첫 번째 요소 (Optional) | `.findFirst()` |
| `reduce(...)` | 커스텀 축약 | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` — 정렬된 데이터

요소들을 **자동으로 정렬**하고 싶다면 이 클래스를 사용하세요.

**커스텀 비교자**를 받거나 자연 정렬을 사용할 수 있습니다.

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **정렬된 출력이 보장됩니다.**

---

### 8. `UnorderedCollectable<E>` — 정렬 없음 (🚀 가장 빠름)

**순서가 중요하지 않고 최고의 성능이 필요한 경우** 다음을 사용하세요:

```typescript
const unordered = new UnorderedCollectable(stream);
// 또는
const fastest = semanticStream.toUnordered();
```

✅ **정렬 알고리즘이 실행되지 않음**  
✅ **순서가 중요하지 않을 때 최고의 성능**

---

### 9. `Statistics<E, D>` — 통계 분석

숫자 데이터를 분석하기 위한 추상 기반 클래스입니다.

#### 서브 클래스:

- `NumericStatistics<E>` — `number` 값용
- `BigIntStatistics<E>` — `bigint` 값용

##### 주요 통계 메서드:

| 메서드 | 설명 | 예제 |
|--------|------|------|
| `mean()` | 평균 | `.mean()` |
| `median()` | 중앙값 | `.median()` |
| `mode()` | 최빈값 | `.mode()` |
| `minimum()` | 최솟값 | `.minimum()` |
| `maximum()` | 최댓값 | `.maximum()` |
| `range()` | 최댓값 - 최솟값 | `.range()` |
| `variance()` | 분산 | `.variance()` |
| `standardDeviation()` | 표준 편차 | `.standardDeviation()` |
| `summate()` | 합계 | `.summate()` |
| `quantile(q)` | q분위수 (0~1) | `.quantile(0.5)` → 중앙값 |
| `frequency()` | 빈도 맵 | `.frequency()` |

---

## 🧪 전체 예제

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// 샘플 데이터
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 가장 빠름: 정렬 없음
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // 예: [10, 2, 8, 4, 5, 6] (원래 순서)

// 🔢 자연 정렬
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 통계 분석
const stats = new NumericStatistics(numbers);
console.log('평균:', stats.mean());
console.log('중앙값:', stats.median());
console.log('최빈값:', stats.mode());
console.log('범위:', stats.range());
console.log('표준 편차:', stats.standardDeviation());
```

---

## 🛠️ 유틸리티 함수

다양한 **타입 가드(Type Guards)** 와 **비교 도구**도 제공됩니다:

| 함수 | 용도 |
|------|------|
| `isString(x)` | `string` 타입 가드 |
| `isNumber(x)` | `number` 타입 가드 |
| `isBoolean(x)` | `boolean` 타입 가드 |
| `isIterable(x)` | 객체가 반복 가능한지 확인 |
| `useCompare(a, b)` | 범용 비교 함수 |
| `useRandom(x)` | 의사 난수 생성기 (재미삼아) |

---

## 🧩 고급: 커스텀 생성기 & 윈도우

무한 또는 제어된 데이터 스트림을 위한 **커스텀 생성기**를 만들 수 있습니다:

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

또는 **슬라이딩 윈도우**를 사용할 수도 있습니다:

```typescript
const windowed = ordered.slide(3n, 2n); // 크기 3, 스텝 2
```

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 로 제공되며, 상업적·개인적 용도로 자유롭게 사용할 수 있습니다.

---

## 🙌 기여

Pull Request, 이슈(Issue), 아이디어 제안 등 모두 환영합니다!

---

## 🚀 빠른 시작 요약

| 작업 | 메서드 |
|------|--------|
| null/undefined 안전하게 처리 | `Optional<T>` |
| 스트림 생성 | `from([...])`, `range()`, `fill()` |
| 데이터 변환 | `map()`, `filter()` |
| 데이터 정렬 | `sorted()`, `toOrdered()` |
| 정렬 없음 (가장 빠름) | `toUnordered()` ✅ |
| 그룹화 / 집계 | `toMap()`, `group()`, `Collector` |
| 통계 | `NumericStatistics`, `mean()`, `median()` 등 |

---

## 🔗 링크

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 문서: 소스 코드 / 타입 정의 참조

---

**TypeScript에서 함수형, 타입 안전하고 구성 가능한 데이터 처리를 즐겨보세요.** 🚀

--- 

✅ **참고:**  
- `toUnordered()` → **정렬 없음, 가장 빠름**  
- 그 외 (`sorted()`, `toOrdered()` 등) → **데이터를 정렬함**