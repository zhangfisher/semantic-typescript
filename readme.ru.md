# Библиотека потоковой обработки Semantic-TypeScript

## Введение

Semantic-TypeScript — это современная библиотека для обработки потоков, вдохновленная JavaScript GeneratorFunction, Java Stream и MySQL Index. Основной дизайн библиотеки основан на построении эффективных конвейеров обработки данных с использованием индексов данных, предоставляя фронтенд-разработчикам типобезопасный, функциональный опыт работы с потоками.

В отличие от традиционной синхронной обработки, Semantic использует асинхронный режим обработки. При создании потоков данных время получения данных терминалом полностью зависит от того, когда вышестоящий источник вызывает функции обратного вызова `accept` и `interrupt`. Этот дизайн позволяет библиотеке изящно обрабатывать потоки данных в реальном времени, большие наборы данных и асинхронные источники данных.

## Установка

```bash
npm install semantic-typescript
```

## Базовые типы

| Тип | Описание |
|------|-------------|
| `Invalid<T>` | Тип, расширяющий `null` или `undefined` |
| `Valid<T>` | Тип, исключающий `null` и `undefined` |
| `MaybeInvalid<T>` | Тип, который может быть `null` или `undefined` |
| `Primitive` | Набор примитивных типов |
| `MaybePrimitive<T>` | Тип, который может быть примитивным |
| `OptionalSymbol` | Символьный идентификатор класса `Optional` |
| `SemanticSymbol` | Символьный идентификатор класса `Semantic` |
| `CollectorsSymbol` | Символьный идентификатор класса `Collector` |
| `CollectableSymbol` | Символьный идентификатор класса `Collectable` |
| `OrderedCollectableSymbol` | Символьный идентификатор класса `OrderedCollectable` |
| `WindowCollectableSymbol` | Символьный идентификатор класса `WindowCollectable` |
| `StatisticsSymbol` | Символьный идентификатор класса `Statistics` |
| `NumericStatisticsSymbol` | Символьный идентификатор класса `NumericStatistics` |
| `BigIntStatisticsSymbol` | Символьный идентификатор класса `BigIntStatistics` |
| `UnorderedCollectableSymbol` | Символьный идентификатор класса `UnorderedCollectable` |

## Функциональные интерфейсы

| Интерфейс | Описание |
|-----------|-------------|
| `Runnable` | Функция без параметров и без возвращаемого значения |  
| `Supplier<R>` | Функция без параметров, возвращающая `R` |  
| `Functional<T, R>` | Функция преобразования с одним параметром |
| `BiFunctional<T, U, R>` | Функция преобразования с двумя параметрами |
| `TriFunctional<T, U, V, R>` | Функция преобразования с тремя параметрами |
| `Predicate<T>` | Предикатная функция с одним параметром |
| `BiPredicate<T, U>` | Предикатная функция с двумя параметрами |
| `TriPredicate<T, U, V>` | Предикатная функция с тремя параметрами |
| `Consumer<T>` | Функция-потребитель с одним параметром |
| `BiConsumer<T, U>` | Функция-потребитель с двумя параметрами |
| `TriConsumer<T, U, V>` | Функция-потребитель с тремя параметрами |
| `Comparator<T>` | Функция сравнения с двумя параметрами |
| `Generator<T>` | Генераторная функция (ядро и основа) |

```typescript
// Примеры использования типов
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## Защитники типов (Type Guards)

| Функция | Описание | Временная сложность | Пространственная сложность |
|---------|----------|-------------------|--------------------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Проверяет, что значение не null или undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Проверяет, что значение null или undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Проверяет boolean | O(1) | O(1) |
| `isString(t: unknown): t is string` | Проверяет string | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Проверяет number | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Проверяет function | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Проверяет object | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Проверяет symbol | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Проверяет BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Проверяет примитивный тип | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Проверяет итерируемость | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Проверяет экземпляр Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Проверяет экземпляр Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Проверяет экземпляр Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Проверяет экземпляр Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Проверяет экземпляр OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Проверяет экземпляр WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Проверяет экземпляр UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Проверяет экземпляр Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Проверяет экземпляр NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Проверяет экземпляр BigIntStatistics | O(1) | O(1) |

```typescript
// Примеры использования защитников типов
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Типобезопасно, value выводится как string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## Утилитные функции

| Функция | Описание | Временная сложность | Пространственная сложность |
|---------|----------|-------------------|--------------------------|
| `useCompare<T>(t1: T, t2: T): number` | Универсальная функция сравнения | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Генератор псевдослучайных чисел | O(log n) | O(1) |

```typescript
// Примеры использования утилитных функций
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // Случайное число на основе seed
const randomBigInt = useRandom(1000n); // Случайное BigInt число
```

## Фабричные методы

### Фабричные методы Optional

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|-------------------|--------------------------|
| `Optional.empty<T>()` | Создает пустой Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | Создает Optional со значением | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Создает Optional, допускающий null | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Создает не-null Optional | O(1) | O(1) |

```typescript
// Примеры использования Optional
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // Выводит 42
console.log(emptyOpt.orElse(100)); // Выводит 100
```

### Фабричные методы Collector

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|-------------------|--------------------------|
| `Collector.full(identity, accumulator, finisher)` | Создает полный сборщик | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Создает прерываемый сборщик | O(1) | O(1) |

```typescript
// Примеры преобразования коллекторов
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Производительность в приоритете: используем неупорядоченный коллектор
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// Нужна сортировка: используем упорядоченный коллектор  
const ordered = numbers.sorted();

// Подсчитывает количество элементов
let count = Collector.full(
    () => 0, // Начальное значение
    (accumulator, element) => accumulator + element, // Аккумулировать
    (accumulator) => accumulator // Завершить
);
count.collect(from([1,2,3,4,5])); // Считает из потока
count.collect([1,2,3,4,5]); // Считает из итерируемого объекта

let find = Collector.shortable(
    () => Optional.empty(), // Начальное значение
    (element, index, accumulator) => accumulator.isPresent(), // Прервать
    (accumulator, element, index) => Optional.of(element), // Аккумулировать
    (accumulator) => accumulator // Завершить
);
find.collect(from([1,2,3,4,5])); // Находит первый элемент
find.collect([1,2,3,4,5]); // Находит первый элемент
```

### Фабричные методы Semantic

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|---------------------|----------------------------|
| `blob(blob, chunkSize)` | Создает поток из Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Создает пустой поток | O(1) | O(1) |
| `fill<E>(element, count)` | Создает заполненный поток | O(n) | O(1) |
| `from<E>(iterable)` | Создает поток из итерируемого объекта | O(1) | O(1) |
| `generate<E>(element, interrupt)` | Создает поток из генератора | O(1) | O(1) |
| `interval(period, delay?)` | Создает регулярный интервальный поток | O(1)* | O(1) |
| `iterate<E>(generator)` | Создает поток из генератора | O(1) | O(1) |
| `range(start, end, step)` | Создает числовой диапазонный поток | O(n) | O(1) |
| `websocket(websocket)` | Создает поток из WebSocket | O(1) | O(1) |

```typescript
// Пример использования фабричных методов Semantic

// Создать поток из Blob (чтение частями)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Запись потока успешна
  .catch(writeFi); // Запись потока не удалась

// Создать пустой поток, который не будет выполняться до конкатенации с другими потоками
empty<string>()
  .toUnordered()
  .join(); //[]

// Создать заполненный поток
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Создать временной поток с начальной задержкой 2 секунды и циклом выполнения 5 секунд,
// реализованный через механизм таймера, возможны временные отклонения
// из-за ограничений системного планирования.
const intervalStream = interval(5000, 2000);

// Создать поток из итерируемого объекта
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Создать поток диапазона
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Поток событий WebSocket
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // Отслеживать только события сообщений
  .toUnordered() // Для событий обычно без сортировки
  .forEach((event)=> receive(event)); // Получать сообщения
```

## Методы класса Semantic

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|-------------------|--------------------------|
| `concat(other)` | Объединяет два потока | O(n) | O(1) |
| `distinct()` | Удаляет дубликаты | O(n) | O(n) |
| `distinct(comparator)` | Удаляет дубликаты с компаратором | O(n²) | O(n) |
| `dropWhile(predicate)` | Отбрасывает элементы, удовлетворяющие предикату | O(n) | O(1) |
| `filter(predicate)` | Фильтрует элементы | O(n) | O(1) |
| `flat(mapper)` | Плоское отображение | O(n × m) | O(1) |
| `flatMap(mapper)` | Плоское отображение в новый тип | O(n × m) | O(1) |
| `limit(n)` | Ограничивает количество элементов | O(n) | O(1) |
| `map(mapper)` | Преобразование отображения | O(n) | O(1) |
| `peek(consumer)` | Просматривает элементы | O(n) | O(1) |
| `redirect(redirector)` | Перенаправление индексов | O(n) | O(1) |
| `reverse()` | Обращает поток | O(n) | O(1) |
| `shuffle()` | Случайное перемешивание | O(n) | O(1) |
| `shuffle(mapper)` | Перемешивание с маппером | O(n) | O(1) |
| `skip(n)` | Пропускает первые n элементов | O(n) | O(1) |
| `sorted()` | Сортирует | O(n log n) | O(n) |
| `sorted(comparator)` | Сортирует с компаратором | O(n log n) | O(n) |
| `sub(start, end)` | Получает подпоток | O(n) | O(1) |
| `takeWhile(predicate)` | Берет элементы, удовлетворяющие предикату | O(n) | O(1) |
| `translate(offset)` | Сдвиг индексов | O(n) | O(1) |
| `translate(translator)` | Сдвиг с транслятором | O(n) | O(1) |

```typescript
// Примеры операций Semantic
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // Фильтрует четные числа
    .map(n => n * 2)                 // Умножает на 2
    .skip(1)                         // Пропускает первый
    .limit(3)                        // Ограничивает 3 элементами
    .toUnordered()                    // Преобразует в неупорядоченный сборщик
    .toArray();                      // Преобразует в массив
// Результат: [8, 12, 20]

// Пример сложной операции
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Отображает каждый элемент в два элемента
    .distinct()                      // Удаляет дубликаты
    .shuffle()                       // Случайно перемешивает
    .takeWhile(n => n < 50)         // Берет элементы < 50
    .toOrdered()                     // Преобразует в упорядоченный сборщик
    .toArray();                      // Преобразует в массив
```

## Семантические методы преобразования

| Метод | Описание | Временная сложность | Пространственная сложность |
|------------|------------|------------|------------|
| `sorted()` | Преобразовать в упорядоченный коллектор | O(n log n) | O(n) |
| `toUnordered()` | Преобразовать в неупорядоченный коллектор | O(1) | O(1) |
| `toOrdered()` | Преобразовать в упорядоченный коллектор | O(1) | O(1) |
| `toNumericStatistics()` | Преобразовать в числовую статистику | O(n) | O(1) |
| `toBigintStatistics()` | Преобразовать в статистику BigInt | O(n) | O(1) |
| `toWindow()` | Преобразовать в коллектор окон | O(1) | O(1) |
| `toCollectable()` | Преобразовать в `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Преобразовать в пользовательский коллектор | O(n) | O(1) |

```typescript
// Преобразовать в массив, отсортированный по возрастанию
from([6,4,3,5,2]) // Создаёт поток
    .sorted() // Сортирует поток по возрастанию
    .toArray(); // [2, 3, 4, 5, 6]

// Преобразовать в массив, отсортированный по убыванию
from([6,4,3,5,2]) // Создаёт поток
    .soted((a, b) => b - a) // Сортирует поток по убыванию
    .toArray(); // [6, 5, 4, 3, 2]

// Перенаправить в обратный массив
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Перенаправляет в обратном порядке
    .toOrderd() // Сохраняет перенаправленный порядок
    .toArray(); // [2, 5, 3, 4, 6]

// Игнорировать перенаправления для обращения массива
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Перенаправляет в обратном порядке
    .toUnorderd() // Удаляет перенаправленный порядок. Эта операция игнорирует `redirect`, `reverse`, `shuffle` и `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Обратить поток в массив
from([6, 4, 3, 5, 2])
    .reverse() // Обращает поток
    .toOrdered() // Гарантирует обращённый порядок
    .toArray(); // [2, 5, 3, 4, 6]

// Перезаписать перетасованный поток в массив
from([6, 4, 3, 5, 2])
    .shuffle() // Перемешивает поток
    .sorted() // Перезаписывает перетасованный порядок. Эта операция перезаписывает `redirect`, `reverse`, `shuffle` и `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Преобразовать в коллектор окон
from([6, 4, 3, 5, 2]).toWindow();

// Преобразовать в числовую статистику
from([6, 4, 3, 5, 2]).toNumericStatistics();

// Преобразовать в статистику BigInt
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// Определить пользовательский коллектор для сбора данных
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Методы сбора Collectable

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|-------------------|--------------------------|
| `anyMatch(predicate)` | Проверяет наличие совпадающих элементов | O(n) | O(1) |
| `allMatch(predicate)` | Проверяет совпадение всех элементов | O(n) | O(1) |
| `count()` | Подсчитывает элементы | O(n) | O(1) |
| `isEmpty()` | Проверяет пустоту | O(1) | O(1) |
| `findAny()` | Находит любой элемент | O(n) | O(1) |
| `findFirst()` | Находит первый элемент | O(n) | O(1) |
| `findLast()` | Находит последний элемент | O(n) | O(1) |
| `forEach(action)` | Перебирает все элементы | O(n) | O(1) |
| `group(classifier)` | Группирует по классификатору | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Группирует по экстракторам ключ-значение | O(n) | O(n) |
| `join()` | Объединяет в строку | O(n) | O(n) |
| `join(delimiter)` | Объединяет с разделителем | O(n) | O(n) |
| `nonMatch(predicate)` | Проверяет отсутствие совпадений | O(n) | O(1) |
| `partition(count)` | Разделяет по количеству | O(n) | O(n) |
| `partitionBy(classifier)` | Разделяет по классификатору | O(n) | O(n) |
| `reduce(accumulator)` | Операция свертки | O(n) | O(1) |
| `reduce(identity, accumulator)` | Свертка с начальным значением | O(n) | O(1) |
| `toArray()` | Преобразует в массив | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Преобразует в Map | O(n) | O(n) |
| `toSet()` | Преобразует в Set | O(n) | O(n) |
| `write(stream)` | Записывает в поток | O(n) | O(1) |

```typescript
// Примеры операций Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Проверки совпадения
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Операции поиска
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Любой элемент

// Операции группировки
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Операции свертки
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Операции вывода
data.join(", "); // "2, 4, 6, 8, 10"
```

## Методы статистического анализа

### Методы NumericStatistics

| Метод | Описание | Временная сложность | Пространственная сложность |
|-------|----------|-------------------|--------------------------|
| `range()` | Размах | O(n) | O(1) |
| `variance()` | Дисперсия | O(n) | O(1) |
| `standardDeviation()` | Стандартное отклонение | O(n) | O(1) |
| `mean()` | Среднее значение | O(n) | O(1) |
| `median()` | Медиана | O(n log n) | O(n) |
| `mode()` | Мода | O(n) | O(n) |
| `frequency()` | Распределение частот | O(n) | O(n) |
| `summate()` | Суммирование | O(n) | O(1) |
| `quantile(quantile)` | Квантиль | O(n log n) | O(n) |
| `interquartileRange()` | Интерквартильный размах | O(n log n) | O(n) |
| `skewness()` | Асимметрия | O(n) | O(1) |
| `kurtosis()` | Эксцесс | O(n) | O(1) |

```typescript
// Примеры статистического анализа
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Среднее значение:", numbers.mean()); // 5.5
console.log("Медиана:", numbers.median()); // 5.5
console.log("Стандартное отклонение:", numbers.standardDeviation()); // ~2.87
console.log("Сумма:", numbers.summate()); // 55

// Статистический анализ с маппером
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Отображенное среднее:", objects.mean(obj => obj.value)); // 20
```

## Руководство по выбору производительности

### Выбор неупорядоченного сборщика (Приоритет производительности)
```typescript
// Когда гарантия порядка не требуется
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Лучшая производительность
```

### Выбор упорядоченного сборщика (Требуется порядок)
```typescript
// Когда порядок элементов должен сохраняться
const ordered = data.sorted(comparator);
```

### Выбор оконного сборщика (Оконные операции)
```typescript
// Когда требуются оконные операции
const windowed = data
    .toWindow()
    .slide(5n, 2n); // Скользящее окно
```

### Выбор статистического анализа (Численные вычисления)
```typescript
// Когда требуется статистический анализ
const stats = data
    .toNumericStatistics(); // Численная статистика

const bigIntStats = data
    .toBigintStatistics(); // BigInt статистика
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Важные замечания

1. **Влияние операций сортировки**: В упорядоченных сборщиках операция `sorted()` перезаписывает эффекты `redirect`, `translate`, `shuffle`
2. **Соображения производительности**: Если гарантия порядка не требуется, отдавайте приоритет `toUnoredered()` для лучшей производительности
3. **Использование памяти**: Операции сортировки требуют O(n) дополнительного пространства
4. **Данные реального времени**: Потоки Semantic идеально подходят для данных реального времени и поддерживают асинхронные источники данных

Эта библиотека предоставляет TypeScript-разработчикам мощные и гибкие возможности обработки потоков, сочетая преимущества функционального программирования с типобезопасностью.