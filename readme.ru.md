# Библиотека потоковой обработки Semantic-TypeScript

## Введение

Semantic-TypeScript — это современная библиотека потоковой обработки, вдохновленная JavaScript GeneratorFunction, Java Stream и индексами MySQL. Её основная концепция дизайна основана на создании эффективных конвейеров обработки данных с использованием индексации данных, предоставляя типобезопасный, функциональный стиль операций потоков для разработки фронтенда.

В отличие от традиционной синхронной обработки, Semantic использует асинхронную модель обработки. При создании потока данных время, когда терминал получает данные, полностью зависит от того, когда вверх по потоку вызываются функции обратного вызова `accept` и `interrupt`. Этот дизайн позволяет библиотеке изящно обрабатывать потоки реального времени, большие наборы данных и асинхронные источники данных.

## Установка

```bash
npm install semantic-typescript
```

## Основные типы

| Тип | Описание |
|------|-------------|
| `Invalid<T>` | Тип, расширяющий `null` или `undefined` |
| `Valid<T>` | Тип, исключающий `null` и `undefined` |
| `MaybeInvalid<T>` | Тип, который может быть `null` или `undefined` |
| `Primitive` | Коллекция примитивных типов |
| `MaybePrimitive<T>` | Тип, который может быть примитивным типом |
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
| `Functional<T, R>` | Функция одного параметра для преобразования |
| `BiFunctional<T, U, R>` | Функция двух параметров для преобразования |
| `TriFunctional<T, U, V, R>` | Функция трех параметров для преобразования |
| `Predicate<T>` | Функция одного параметра для утверждения |
| `BiPredicate<T, U>` | Функция двух параметров для утверждения |
| `TriPredicate<T, U, V>` | Функция трех параметров для утверждения |
| `Consumer<T>` | Функция одного параметра для потребления |
| `BiConsumer<T, U>` | Функция двух параметров для потребления |
| `TriConsumer<T, U, V>` | Функция трех параметров для потребления |
| `Comparator<T>` | Функция двух параметров для сравнения |
| `Generator<T>` | Функция генератора (основа и фундамент) |

```typescript
// Примеры использования типов
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## Типовые защитники

| Функция | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Проверить, что значение не является null или undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Проверить, что значение является null или undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Проверить, является ли это булевым значением | O(1) | O(1) |
| `isString(t: unknown): t is string` | Проверить, является ли это строкой | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Проверить, является ли это числом | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Проверить, является ли это функцией | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Проверить, является ли это объектом | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Проверить, является ли это символом | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Проверить, является ли это BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Проверить, является ли это примитивным типом | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Проверить, является ли это итерируемым объектом | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Проверить, является ли это экземпляром Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Проверить, является ли это экземпляром Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Проверить, является ли это экземпляром Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Проверить, является ли это экземпляром Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Проверить, является ли это экземпляром OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Проверить, является ли это экземпляром WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Проверить, является ли это экземпляром UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Проверить, является ли это экземпляром Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Проверить, является ли это экземпляром NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Проверить, является ли это экземпляром BigIntStatistics | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | Проверить, является ли это объектом Promise | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | Проверить, является ли это AsyncFunction | O(1) | O(1) |

```typescript
// Примеры использования типовых защитников
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Типобезопасно, значение выводится как строка
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // Типобезопасно, теперь это итерируемый объект.
    for(let item of value){
        console.log(item);
    }
}
```

## Утилитные функции

| Функция | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Обобщенная функция сравнения | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Генератор псевдослучайных чисел | O(log n) | O(1) |

```typescript
// Примеры использования утилитных функций
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // Случайное число на основе семени
```

## Фабричные методы

### Методы фабрики Optional

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `Optional.empty<T>()` | Создание пустого Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | Создание Optional с содержимым | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Создание потенциально пустого Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Создание не-пустого Optional | O(1) | O(1) |

```typescript
// Примеры использования Optional
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

presentOpt.ifPresent((val: number): void => console.log(val)); // Выводит 42
console.log(emptyOpt.get(100)); // Выводит 100
```

### Методы фабрики Collector

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Создание полного коллектора | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Создание прерываемого коллектора | O(1) | O(1) |

```typescript
// Примеры преобразования коллекторов
let numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Приоритет производительности: использование неупорядоченного коллектора для лучшей производительности
let unordered = numbers
    .filter((n: number): boolean => n > 3)
    .toUnordered(); // Лучшая производительность

// Необходимость в сортировке: использование упорядоченного коллектора
let ordered = numbers.sorted();

// Подсчет элементов
let count = Collector.full(
    (): number => 0, // Начальное значение
    (accumulator: number, element: number): number => accumulator + element, // Аккумуляция
    (accumulator: number): number => accumulator // Завершение
);
count.collect(from([1,2,3,4,5])); // Подсчет из потока
count.collect([1,2,3,4,5]); // Подсчет из итерируемого объекта

let find = Collector.shortable(
    (): Optional<number> => Optional.empty(), // Начальное значение
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // Прерывание
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // Аккумуляция
    (accumulator: Optional<number>): Optional<number> => accumulator // Завершение
);
find.collect(from([1,2,3,4,5])); // Находит первый элемент
find.collect([1,2,3,4,5]); // Находит первый элемент
```

### Методы фабрики Semantic

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | Создание потока на основе анимационных кадров | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Создание потока из Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Создание пустого потока | O(1) | O(1) |
| `fill<E>(element, count)` | Создание заполненного потока | O(n) | O(1) |
| `from<E>(iterable)` | Создание потока из итерируемого объекта | O(1) | O(1) |
| `interval(period, delay?)` | Создание временного интервального потока | O(1)* | O(1) |
| `iterate<E>(generator)` | Создание потока из генератора | O(1) | O(1) |
| `range(start, end, step)` | Создание потока числового диапазона | O(n) | O(1) |
| `websocket(websocket)` | Создание потока из WebSocket | O(1) | O(1) |

```typescript
// Примеры использования фабричных методов Semantic

// Создание потока из Blob (чтение блоками)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // Успешная запись потока
    .catch(callback); // Ошибка записи потока

// Создание пустого потока, который не будет выполнен до объединения с другими потоками
empty<string>()
    .toUnordered()
    .join(); // []

// Создание заполненного потока
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Создание временного потока с начальной задержкой в 2 секунды и периодом выполнения в 5 секунд, реализованного на основе механизма таймера; может возникать временной дрейф из-за ограничений точности системного планирования.
const intervalStream = interval(5000, 2000);

// Создание потока из итерируемого объекта
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Создание потока числового диапазона
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Поток событий WebSocket
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message") // Слушать только сообщения
  .toUnordered() // Обычно события неупорядочены
  .forEach((event): void => receive(event)); // Получение сообщений
```

## Методы класса Semantic

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `concat(other)` | Объединение двух потоков | O(n) | O(1) |
| `distinct()` | Удаление дубликатов | O(n) | O(n) |
| `distinct(comparator)` | Удаление дубликатов с использованием компаратора | O(n²) | O(n) |
| `dropWhile(predicate)` | Отброс элементов, удовлетворяющих условию | O(n) | O(1) |
| `filter(predicate)` | Фильтрация элементов | O(n) | O(1) |
| `flat(mapper)` | Плоское отображение | O(n × m) | O(1) |
| `flatMap(mapper)` | Отображение в новый тип | O(n × m) | O(1) |
| `limit(n)` | Ограничение количества элементов | O(n) | O(1) |
| `map(mapper)` | Преобразование картой | O(n) | O(1) |
| `peek(consumer)` | Просмотр элементов | O(n) | O(1) |
| `redirect(redirector)` | Перенаправление индекса | O(n) | O(1) |
| `reverse()` | Обращение потока | O(n) | O(1) |
| `shuffle()` | Случайная перестановка | O(n) | O(1) |
| `shuffle(mapper)` | Перестановка с использованием маппера | O(n) | O(1) |
| `skip(n)` | Пропуск первых n элементов | O(n) | O(1) |
| `sorted()` | Сортировка | O(n log n) | O(n) |
| `sorted(comparator)` | Сортировка с использованием компаратора | O(n log n) | O(n) |
| `sub(start, end)` | Получение подпотока | O(n) | O(1) |
| `takeWhile(predicate)` | Получение элементов, удовлетворяющих условию | O(n) | O(1) |
| `translate(offset)` | Перевод индекса | O(n) | O(1) |
| `translate(translator)` | Перевод индекса с использованием транслятора | O(n) | O(1) |

```typescript
// Примеры операций Semantic
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0) // Фильтрация четных чисел
    .map(n => n * 2) // Умножение на 2
    .skip(1) // Пропуск первого
    .limit(3) // Ограничение до 3 элементов
    .toUnordered() // Преобразование в неупорядоченный коллектор
    .toArray(); // Преобразование в массив
// Результат: [8, 12, 20]

// Пример сложной операции
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Каждый элемент к двум
    .distinct() // Удаление дубликатов
    .shuffle() // Перемешивание порядка
    .takeWhile(n => n < 50) // Взятие элементов меньше 50
    .toOrdered() // Преобразование в упорядоченный коллектор
    .toArray(); // Преобразование в массив
```

## Методы преобразования Semantic

| Метод | Описание | Временная сложность | Пространственная сложность |
|------------|------------|------------|------------|
| `sorted()` | Преобразование в упорядоченный коллектор | O(n log n) | O(n) |
| `toUnordered()` | Преобразование в неупорядоченный коллектор | O(1) | O(1) |
| `toOrdered()` | Преобразование в упорядоченный коллектор | O(1) | O(1) |
| `toNumericStatistics()` | Преобразование в числовую статистику | O(n) | O(1) |
| `toBigintStatistics()` | Преобразование в статистику BigInt | O(n) | O(1) |
| `toWindow()` | Преобразование в оконный коллектор | O(1) | O(1) |
| `toCollectable()` | Преобразование в UnorderdCollectable | O(n) | O(1) |
| `toCollectable(mapper)` | Преобразование в настраиваемый коллектор | O(n) | O(1) |

```typescript
// Примеры преобразований
from([6, 4, 3, 5, 2]) // Создание потока
    .sorted() // Сортировка потока по возрастанию
    .toArray(); // [2, 3, 4, 5, 6]

from([6, 4, 3, 5, 2]) // Создание потока
    .soted((a, b) => b - a) // Сортировка потока по убыванию
    .toArray(); // [6, 5, 4, 3, 2]

from([6, 4, 3, 5, 2]) // Создание потока
    .redirect((element, index) => -index) // Перенаправление в обратном порядке
    .toOrderd() // Сохранение перенаправленного порядка
    .toArray(); // [2, 5, 3, 4, 6]

from([6, 4, 3, 5, 2]) // Создание потока
    .redirect((element, index) => -index) // Перенаправление в обратном порядке
    .toUnorderd() // Игнорирование перенаправления. Эта операция игнорирует `redirect`, `reverse`, `shuffle` и `translate`
    .toArray(); // [2, 5, 3, 4, 6]

from([6, 4, 3, 5, 2]) // Создание потока
    .reverse() // Обращение потока
    .toOrdered() // Гарантия обращенного порядка
    .toArray(); // [2, 5, 3, 4, 6]

from([6, 4, 3, 5, 2]) // Создание потока
    .shuffle() // Перемешивание потока
    .sorted() // Перезапись перемешанного порядка. Эта операция перезапишет `redirect`, `reverse`, `shuffle` и `translate`
    .toArray(); // [2, 5, 3, 4, 6]

from([6, 4, 3, 5, 2]) // Создание потока
    .toWindow(); // Преобразование в оконный коллектор

from([6, 4, 3, 5, 2]) // Создание потока
    .toNumericStatistics(); // Преобразование в числовую статистику

from([6n, 4n, 3n, 5n, 2n]) // Создание потока
    .toBigintStatistics(); // Преобразование в статистику BigInt

// Определение настраиваемого коллектора для сбора данных
let customizedCollector = from([1, 2, 3, 4, 5])
    .toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Методы сбора Collectable

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `anyMatch(predicate)` | Соответствие любого элемента | O(n) | O(1) |
| `allMatch(predicate)` | Соответствие всех элементов | O(n) | O(1) |
| `count()` | Подсчет элементов | O(n) | O(1) |
| `isEmpty()` | Проверка на пустоту | O(1) | O(1) |
| `findAny()` | Найти любой элемент | O(n) | O(1) |
| `findFirst()` | Найти первый элемент | O(n) | O(1) |
| `findLast()` | Найти последний элемент | O(n) | O(1) |
| `forEach(action)` | Итерация по всем элементам | O(n) | O(1) |
| `group(classifier)` | Группировка по классификатору | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Группировка по ключу-значению | O(n) | O(n) |
| `join()` | Объединение в строку | O(n) | O(n) |
| `join(delimiter)` | Объединение с использованием разделителя | O(n) | O(n) |
| `nonMatch(predicate)` | Отсутствие соответствия элементов | O(n) | O(1) |
| `partition(count)` | Разделение по количеству | O(n) | O(n) |
| `partitionBy(classifier)` | Разделение по классификатору | O(n) | O(n) |
| `reduce(accumulator)` | Операция уменьшения | O(n) | O(1) |
| `reduce(identity, accumulator)` | Уменьшение с начальным значением | O(n) | O(1) |
| `toArray()` | Преобразование в массив | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Преобразование в карту | O(n) | O(n) |
| `toSet()` | Преобразование в множество | O(n) | O(n) |
| `write(stream)` | Запись в поток | O(n) | O(1) |

```typescript
// Примеры операций Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Проверки соответствия
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Операции поиска
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Любой элемент

// Операции группировки
const grouped = data.groupBy(n => n > 5 ? "большой" : "маленький", n => n * 2); // {маленький: [4, 8], большой: [12, 16, 20]}

// Операции уменьшения
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Операции вывода
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Методы статистического анализа

### Методы NumericStatistics

| Метод | Описание | Временная сложность | Пространственная сложность |
|------|------|------------|------------|
| `range()` | Диапазон | O(n) | O(1) |
| `variance()` | Дисперсия | O(n) | O(1) |
| `standardDeviation()` | Стандартное отклонение | O(n) | O(1) |
| `mean()` | Среднее значение | O(n) | O(1) |
| `median()` | Медиана | O(n log n) | O(n) |
| `mode()` | Мода | O(n) | O(n) |
| `frequency()` | Распределение частот | O(n) | O(n) |
| `summate()` | Суммирование | O(n) | O(1) |
| `quantile(quantile)` | Квантиль | O(n log n) | O(n) |
| `interquartileRange()` | Межквартильный размах | O(n log n) | O(n) |
| `skewness()` | Асимметрия | O(n) | O(1) |
| `kurtosis()` | Эксцесс | O(n) | O(1) |

```typescript
// Примеры статистического анализа
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Среднее:", numbers.mean()); // 5.5
console.log("Медиана:", numbers.median()); // 5.5
console.log("Стандартное отклонение:", numbers.standardDeviation()); // ~2.87
console.log("Сумма:", numbers.summate()); // 55

// Статистический анализ с использованием мапперов
const objects = from([
    { value: 10 },
    { value: 20 },
    { value: 30 }
]).toNumericStatistics();
console.log("Преобразованное среднее:", objects.mean(obj => obj.value)); // 20
```

## Руководство по выбору производительности

### Выбор неупорядоченного коллектора (приоритет производительности)
```typescript
// Когда не требуется гарантия порядка, используйте неупорядоченный коллектор для лучшей производительности
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // Лучшая производительность
```

### Выбор упорядоченного коллектора (требуется порядок)
```typescript
// Когда необходимо сохранить порядок элементов, используйте упорядоченный коллектор
let ordered = data.sorted(comparator);
```

### Выбор оконного коллектора (оконные операции)
```typescript
// Когда требуются оконные операции
let windowed: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // Скользящее окно
```

### Выбор статистического анализа (числовые вычисления)
```typescript
// Когда требуется статистический анализ
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // Числовая статистика

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // Статистика больших целых чисел
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Важные замечания

1. **Влияние операций сортировки**: В упорядоченных коллекторах операция `sorted()` переопределяет эффекты `redirect`, `translate`, `shuffle`, `reverse`.
2. **Рассмотрение производительности**: Если не требуется гарантия порядка, предпочтение следует отдавать использованию `toUnordered()` для улучшения производительности.
3. **Использование памяти**: Операции сортировки требуют дополнительного пространства O(n).
4. **Реальное время**: Потоки Semantic подходят для обработки данных в реальном времени и поддерживают асинхронные источники данных.

Эта библиотека предоставляет разработчикам TypeScript мощные и гибкие возможности потоковой обработки, сочетая преимущества функционального программирования с гарантиями типобезопасности.