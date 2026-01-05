# Фреймворк для потоковой обработки Semantic-TypeScript

## Введение

Semantic-TypeScript — это современная библиотека для потоковой обработки данных, вдохновленная JavaScript GeneratorFunction, Java Stream и MySQL Index. Основная философия дизайна основана на построении эффективных конвейеров обработки данных через индексацию данных, предоставляя типобезопасный, функциональный опыт потоковых операций для фронтенд-разработки.

В отличие от традиционной синхронной обработки, Semantic использует асинхронную модель обработки. При создании потоков данных время получения терминальных данных полностью зависит от того, когда вышестоящий код вызовет функции обратного вызова `accept` и `interrupt`. Этот дизайн позволяет библиотеке изящно обрабатывать потоки данных в реальном времени, большие наборы данных и асинхронные источники данных.

## Основные возможности

| Возможность | Описание | Преимущество |
|------|------|------|
| **Типобезопасные дженерики** | Полная поддержка типов TypeScript | Обнаружение ошибок на этапе компиляции, лучший опыт разработки |
| **Функциональное программирование** | Неизменяемые структуры данных и чистые функции | Более предсказуемый код, легкое тестирование и сопровождение |
| **Ленивые вычисления** | Вычисления по требованию, оптимизация производительности | Высокая эффективность использования памяти при обработке больших наборов данных |
| **Асинхронная потоковая обработка** | Асинхронные потоки данных на основе генераторов | Подходит для сценариев с данными в реальном времени и событийно-ориентированных сценариев |
| **Мультипарадигменные коллекторы** | Стратегии сбора с упорядочиванием, без упорядочивания, статистические | Выбор оптимальной стратегии на основе разных сценариев |
| **Статистический анализ** | Встроенные полные функции статистических вычислений | Интегрированный анализ данных и генерация отчетов |

## Соображения производительности

**Важное примечание**: Следующие методы жертвуют производительностью для сбора и сортировки данных, что приводит к упорядоченным коллекциям данных:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

Особенно важно отметить: `sorted()` и `sorted(comparator)` переопределяют результаты следующих методов:
- `redirect(redirector)`
- `translate(translator)`
- `shuffle(mapper)`

## Фабричные методы

### Фабрики создания потоков

| Метод | Сигнатура | Описание | Пример |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Преобразовать Blob в поток байтов | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | Создать пустой поток | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | Заполнить указанным количеством элементов | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | Создать поток из итерируемого объекта | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | Создать поток числового диапазона | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | Создать поток из функции-генератора | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | Создать поток событий из WebSocket | `websocket(socket)` |

**Дополнение с примером кода:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// Создать поток из массива
const numberStream = from([1, 2, 3, 4, 5]);

// Создать поток числового диапазона
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Заполнить повторяющимися элементами
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// Создать пустой поток
const emptyStream = empty<number>();
```

### Фабрики служебных функций

| Метод | Сигнатура | Описание | Пример |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | Проверить, является ли значение валидным | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | Проверить, является ли значение невалидным | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | Универсальная функция сравнения | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | Генератор псевдослучайных чисел | `useRandom(5)` → случайное число |

**Дополнение с примером кода:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// Проверить валидность данных
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // Безопасный вызов, так как validate гарантирует, что data не null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("Данные невалидны"); // Выполнится, потому что invalidate обнаружил null
}

// Сравнить значения
const comparison = useCompare("apple", "banana"); // -1

// Сгенерировать случайное число
const randomNum = useRandom(42); // Случайное число на основе сида 42
```

## Детали основного класса

### Optional<T> - Безопасная обработка нулевых значений

Класс Optional предоставляет функциональный подход для безопасной обработки значений, которые могут быть null или undefined.

| Метод | Тип возврата | Описание | Сложность по времени |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | Отфильтровать значения, удовлетворяющие условию | O(1) |
| `get()` | `T` | Получить значение, выбросить ошибку если пустое | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | Получить значение или значение по умолчанию | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | Выполнить действие, если значение существует | O(1) |
| `isEmpty()` | `boolean` | Проверить, пусто ли | O(1) |
| `isPresent()` | `boolean` | Проверить, существует ли значение | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | Отобразить и преобразовать значение | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Создать экземпляр Optional | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | Создать nullable Optional | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | Создать не-null Optional | O(1) |

**Дополнение с примером кода:**
```typescript
import { Optional } from 'semantic-typescript';

// Создать экземпляр Optional
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// Цепочка операций
const result = optionalValue
    .filter(val => val.length > 3) // Отфильтровать значения длиннее 3
    .map(val => val.toUpperCase()) // Преобразовать в верхний регистр
    .getOrDefault("default"); // Получить значение или значение по умолчанию

console.log(result); // "HELLO" или "default"

// Безопасные операции
optionalValue.ifPresent(val => {
    console.log(`Значение существует: ${val}`);
});

// Проверить статус
if (optionalValue.isPresent()) {
    console.log("Есть значение");
} else if (optionalValue.isEmpty()) {
    console.log("Пустое");
}
```

### Semantic<E> - Ленивый поток данных

Semantic - это основной класс потоковой обработки, предоставляющий богатый набор операторов потоков.

#### Операции преобразования потоков

| Метод | Тип возврата | Описание | Влияние на производительность |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | Объединить два потока | O(n+m) |
| `distinct()` | `Semantic<E>` | Удалить дубликаты (используя Set) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | Дедубликация с пользовательским компаратором | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | Отбросить начальные элементы, удовлетворяющие условию | O(n) |
| `filter(predicate)` | `Semantic<E>` | Отфильтровать элементы | O(n) |
| `flat(mapper)` | `Semantic<E>` | Развернуть вложенные потоки | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | Отобразить и развернуть | O(n×m) |
| `limit(n)` | `Semantic<E>` | Ограничить количество элементов | O(n) |
| `map(mapper)` | `Semantic<R>` | Отобразить и преобразовать элементы | O(n) |
| `peek(consumer)` | `Semantic<E>` | Просмотреть элементы без модификации | O(n) |
| `redirect(redirector)` | `Semantic<E>` | Перенаправить индексы | O(n) |
| `reverse()` | `Semantic<E>` | Обратить порядок потока | O(n) |
| `shuffle()` | `Semantic<E>` | Случайно перемешать порядок | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | Пользовательская логика перемешивания | O(n) |
| `skip(n)` | `Semantic<E>` | Пропустить первые n элементов | O(n) |
| `sub(start, end)` | `Semantic<E>` | Получить подпоток | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | Получить начальные элементы, удовлетворяющие условию | O(n) |
| `translate(offset)` | `Semantic<E>` | Транслировать индексы | O(n) |
| `translate(translator)` | `Semantic<E>` | Пользовательское преобразование индексов | O(n) |

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Примеры операций преобразования потока
const processedStream = stream
    .filter(x => x % 2 === 0) // Отфильтровать четные числа
    .map(x => x * 2) // Умножить каждый элемент на 2
    .distinct() // Удалить дубликаты
    .limit(3) // Ограничить первыми 3 элементами
    .peek((val, index) => console.log(`Элемент ${val} по индексу ${index}`)); // Просмотреть элементы

// Примечание: Поток еще не выполнен, требуется преобразование в Collectable для терминальных операций
```

#### Терминальные операции потоков

| Метод | Тип возврата | Описание | Характеристики производительности |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | Преобразовать в упорядоченную коллекцию | Операция сортировки, низкая производительность |
| `toUnordered()` | `UnorderedCollectable<E>` | Преобразовать в неупорядоченную коллекцию | Самый быстрый, без сортировки |
| `toWindow()` | `WindowCollectable<E>` | Преобразовать в оконную коллекцию | Операция сортировки, низкая производительность |
| `toNumericStatistics()` | `Statistics<E, number>` | Численный статистический анализ | Операция сортировки, низкая производительность |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Статистический анализ для больших целых чисел | Операция сортировки, низкая производительность |
| `sorted()` | `OrderedCollectable<E>` | Естественная сортировка | Переопределяет результаты перенаправления |
| `sorted(comparator)` | `OrderedCollectable<E>` | Пользовательская сортировка | Переопределяет результаты перенаправления |

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// Преобразовать в упорядоченную коллекцию (низкая производительность)
const ordered = semanticStream.toOrdered();

// Преобразовать в неупорядоченную коллекцию (самый быстрый)
const unordered = semanticStream.toUnordered();

// Естественная сортировка
const sortedNatural = semanticStream.sorted();

// Пользовательская сортировка
const sortedCustom = semanticStream.sorted((a, b) => b - a); // Сортировка по убыванию

// Преобразовать в статистический объект
const stats = semanticStream.toNumericStatistics();

// Примечание: Необходимо вызывать указанные выше методы через экземпляр Semantic, чтобы получить Collectable, перед использованием терминальных методов
```

### Collector<E, A, R> - Сборщик данных

Коллекторы используются для агрегации потоковых данных в определенные структуры.

| Метод | Описание | Сценарий использования |
|------|------|----------|
| `collect(generator)` | Выполнить сбор данных | Терминальная операция потока |
| `static full(identity, accumulator, finisher)` | Создать полный коллектор | Требует полной обработки |
| `static shortable(identity, interruptor, accumulator, finisher)` | Создать прерываемый коллектор | Может завершиться досрочно |

**Дополнение с примером кода:**
```typescript
import { Collector } from 'semantic-typescript';

// Создать пользовательский коллектор
const sumCollector = Collector.full(
    () => 0, // Начальное значение
    (acc, value) => acc + value, // Аккумулятор
    result => result // Функция завершения
);

// Использовать коллектор (требуется преобразование из Semantic в Collectable сначала)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - Абстрактный класс собираемых данных

Предоставляет богатые методы агрегации и преобразования данных. **Примечание: Сначала необходимо получить экземпляр Collectable, вызвав sorted(), toOrdered() и т.д. через экземпляр Semantic, перед использованием следующих методов.**

#### Операции запроса данных

| Метод | Тип возврата | Описание | Пример |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | Соответствует ли любой элемент | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | Соответствуют ли все элементы | `allMatch(x => x > 0)` |
| `count()` | `bigint` | Статистика количества элементов | `count()` → `5n` |
| `isEmpty()` | `boolean` | Является ли поток пустым | `isEmpty()` |
| `findAny()` | `Optional<E>` | Найти любой элемент | `findAny()` |
| `findFirst()` | `Optional<E>` | Найти первый элемент | `findFirst()` |
| `findLast()` | `Optional<E>` | Найти последний элемент | `findLast()` |

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// Необходимо преобразовать в Collectable перед использованием терминальных методов
const collectable = numbers.toUnordered();

// Операции запроса данных
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // Любой элемент
```

#### Операции агрегации данных

| Метод | Тип возврата | Описание | Сложность |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | Группировать по классификатору | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | Группировать по экстракторам ключ-значение | O(n) |
| `join()` | `string` | Объединить в строку | O(n) |
| `join(delimiter)` | `string` | Объединить с разделителем | O(n) |
| `partition(count)` | `E[][]` | Разделить по количеству | O(n) |
| `partitionBy(classifier)` | `E[][]` | Разделить по классификатору | O(n) |
| `reduce(accumulator)` | `Optional<E>` | Операция редукции | O(n) |
| `reduce(identity, accumulator)` | `E` | Редукция с начальным значением | O(n) |
| `toArray()` | `E[]` | Преобразовать в массив | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Преобразовать в Map | O(n) |
| `toSet()` | `Set<E>` | Преобразовать в Set | O(n) |

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// Необходимо преобразовать в Collectable перед использованием операций агрегации
const collectable = people.toUnordered();

// Операции группировки
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// Преобразовать в коллекции
const array = collectable.toArray(); // Исходный массив
const set = collectable.toSet(); // Коллекция Set
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// Операции редукции
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### Конкретные реализации коллекторов

#### UnorderedCollectable<E>
- **Характеристики**: Самый быстрый коллектор, без сортировки
- **Сценарии использования**: Порядок не важен, желательна максимальная производительность
- **Методы**: Наследует все методы Collectable

#### OrderedCollectable<E>
- **Характеристики**: Гарантирует порядок элементов, низкая производительность
- **Сценарии использования**: Требуются отсортированные результаты
- **Специальные методы**: Наследует все методы, сохраняет внутреннее состояние сортировки

#### WindowCollectable<E>
- **Характеристики**: Поддерживает операции скользящего окна
- **Сценарии использования**: Анализ временных рядов
- **Специальные методы**:
  - `slide(size, step)` - Скользящее окно
  - `tumble(size)` - Тумблинг-окно

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Неупорядоченный коллектор (самый быстрый)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // Может сохранять исходный порядок [1, 2, 3, ...]

// Упорядоченный коллектор
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // Гарантированно отсортирован [1, 2, 3, ...]

// Оконный коллектор
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // Размер окна 3, шаг 2
// Окно 1: [1, 2, 3], Окно 2: [3, 4, 5], Окно 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // Размер тумблинг-окна 4
// Окно 1: [1, 2, 3, 4], Окно 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - Статистический анализ

Базовый класс статистического анализа, предоставляющий богатые методы статистических вычислений. **Примечание: Сначала необходимо получить экземпляр Statistics, вызвав toNumericStatistics() или toBigIntStatistics() через экземпляр Semantic, перед использованием следующих методов.**

#### Операции статистических вычислений

| Метод | Тип возврата | Описание | Сложность алгоритма |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | Максимальное значение | O(n) |
| `minimum()` | `Optional<E>` | Минимальное значение | O(n) |
| `range()` | `D` | Размах (макс-мин) | O(n) |
| `variance()` | `D` | Дисперсия | O(n) |
| `standardDeviation()` | `D` | Стандартное отклонение | O(n) |
| `mean()` | `D` | Среднее значение | O(n) |
| `median()` | `D` | Медиана | O(n log n) |
| `mode()` | `D` | Мода | O(n) |
| `frequency()` | `Map<D, bigint>` | Распределение частот | O(n) |
| `summate()` | `D` | Суммирование | O(n) |
| `quantile(quantile)` | `D` | Квантиль | O(n log n) |
| `interquartileRange()` | `D` | Интерквартильный размах | O(n log n) |
| `skewness()` | `D` | Асимметрия | O(n) |
| `kurtosis()` | `D` | Эксцесс | O(n) |

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Необходимо преобразовать в статистический объект перед использованием статистических методов
const stats = numbers.toNumericStatistics();

// Базовая статистика
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// Продвинутая статистика
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // Любое значение (так как все встречаются по одному разу)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// Распределение частот
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### Конкретные классы статистических реализаций

**NumericStatistics<E>**
- Обрабатывает статистический анализ числового типа
- Все статистические вычисления возвращают числовой тип

**BigIntStatistics<E>**
- Обрабатывает статистический анализ типа bigint
- Все статистические вычисления возвращают тип bigint

**Дополнение с примером кода:**
```typescript
import { from } from 'semantic-typescript';

// Числовая статистика
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Статистика больших целых чисел
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// Статистика с использованием функций-мапперов
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

## Полный пример использования

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. Создать поток данных
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. Конвейер обработки потока
const processedStream = semanticStream
    .filter(val => validate(val)) // Отфильтровать null и undefined
    .map(val => val! * 2) // Умножить каждое значение на 2 (используется !, так как validate гарантирует не пустое)
    .distinct(); // Удалить дубликаты

// 3. Преобразовать в Collectable и использовать терминальные операции
const collectable = processedStream.toUnordered();

// 4. Проверка данных и использование
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // Снова отфильтровать
        .toArray(); // Преобразовать в массив
    
    console.log("Результаты обработки:", results); // [16, 18, 14, 8, 12]
    
    // Статистическая информация
    const stats = processedStream.toNumericStatistics();
    console.log("Среднее значение:", stats.mean()); // 11.2
    console.log("Общая сумма:", stats.summate()); // 56
}

// 5. Обработать потенциально невалидные данные
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("Валидные данные:", validData); // [1, 3, 4]
console.log("Невалидные данные:", invalidData); // [null, null]
```

## Важные правила использования - итог

1. **Создать поток**: Используйте фабричные методы `from()`, `range()`, `fill()` и т.д. для создания экземпляров Semantic
2. **Преобразование потока**: Вызывайте методы `map()`, `filter()`, `distinct()` и т.д. на экземплярах Semantic
3. **Преобразовать в Collectable**: Необходимо вызвать один из следующих методов через экземпляр Semantic:
   - `toOrdered()` - Упорядоченный коллектор
   - `toUnordered()` - Неупорядоченный коллектор (самый быстрый)
   - `toWindow()` - Оконный коллектор
   - `toNumericStatistics()` - Числовая статистика
   - `toBigIntStatistics()` - Статистика больших целых чисел
   - `sorted()` - Естественная сортировка
   - `sorted(comparator)` - Пользовательская сортировка
4. **Терминальные операции**: Вызывайте терминальные методы `toArray()`, `count()`, `summate()` и т.д. на экземплярах Collectable
5. **Проверка данных**: Используйте `validate()` для гарантии, что данные не null/undefined, используйте `invalidate()` для проверки невалидных данных

Этот дизайн обеспечивает типобезопасность и оптимизацию производительности, предоставляя при этом богатый функционал потоковой обработки.