# Biblioteca de Procesamiento de Secuencias Semantic-TypeScript

## Introducción

Semantic-TypeScript es una biblioteca moderna de procesamiento de secuencias inspirada en la función generadora de JavaScript, Java Stream y el índice de MySQL. Su filosofía de diseño central se basa en construir pipelines eficientes de procesamiento de datos utilizando la indexación de datos, proporcionando una experiencia de operación de secuencia funcional con seguridad de tipos para el desarrollo del frontend.

A diferencia del procesamiento sincrónico tradicional, Semantic emplea un modelo de procesamiento asíncrono. Al crear un flujo de datos, el tiempo en que el terminal recibe los datos depende completamente de cuándo el upstream llama a las funciones de devolución de llamada `accept` y `interrupt`. Este diseño permite que la biblioteca maneje elegantemente flujos de datos en tiempo real, grandes conjuntos de datos y fuentes de datos asíncronas.

## Instalación

```bash
npm install semantic-typescript
```

## Tipos Básicos

| Tipo | Descripción |
|------|-------------|
| `Invalid<T>` | Tipo que extiende `null` o `undefined` |
| `Valid<T>` | Tipo que excluye `null` y `undefined` |
| `MaybeInvalid<T>` | Tipo que puede ser `null` o `undefined` |
| `Primitive` | Colección de tipos primitivos |
| `MaybePrimitive<T>` | Tipo que puede ser un tipo primitivo |
| `OptionalSymbol` | Identificador de símbolo de la clase `Optional` |
| `SemanticSymbol` | Identificador de símbolo de la clase `Semantic` |
| `CollectorsSymbol` | Identificador de símbolo de la clase `Collector` |
| `CollectableSymbol` | Identificador de símbolo de la clase `Collectable` |
| `OrderedCollectableSymbol` | Identificador de símbolo de la clase `OrderedCollectable` |
| `WindowCollectableSymbol` | Identificador de símbolo de la clase `WindowCollectable` |
| `StatisticsSymbol` | Identificador de símbolo de la clase `Statistics` |
| `NumericStatisticsSymbol` | Identificador de símbolo de la clase `NumericStatistics` |
| `BigIntStatisticsSymbol` | Identificador de símbolo de la clase `BigIntStatistics` |
| `UnorderedCollectableSymbol` | Identificador de símbolo de la clase `UnorderedCollectable` |

## Interfaces Funcionales

| Interfaz | Descripción |
|-----------|-------------|
| `Runnable` | Función sin parámetros y sin valor de retorno |  
| `Supplier<R>` | Función sin parámetros que devuelve `R` |  
| `Functional<T, R>` | Función de transformación de un solo parámetro |
| `BiFunctional<T, U, R>` | Función de transformación de dos parámetros |
| `TriFunctional<T, U, V, R>` | Función de transformación de tres parámetros |
| `Predicate<T>` | Función de predicado de un solo parámetro |
| `BiPredicate<T, U>` | Función de predicado de dos parámetros |
| `TriPredicate<T, U, V>` | Función de predicado de tres parámetros |
| `Consumer<T>` | Función de consumidor de un solo parámetro |
| `BiConsumer<T, U>` | Función de consumidor de dos parámetros |
| `TriConsumer<T, U, V>` | Función de consumidor de tres parámetros |
| `Comparator<T>` | Función de comparación de dos parámetros |
| `Generator<T>` | Función generadora (núcleo y base) |

```typescript
// Ejemplos de uso de tipos
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## Guardias de Tipo

| Función | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Valida que el valor no sea null ni undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Valida que el valor sea null o undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Comprueba si es un booleano | O(1) | O(1) |
| `isString(t: unknown): t is string` | Comprueba si es una cadena | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Comprueba si es un número | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Comprueba si es una función | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Comprueba si es un objeto | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Comprueba si es un símbolo | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Comprueba si es un BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Comprueba si es un tipo primitivo | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Comprueba si es un objeto iterable | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Comprueba si es una instancia de Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Comprueba si es una instancia de Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Comprueba si es una instancia de Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Comprueba si es una instancia de Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Comprueba si es una instancia de OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Comprueba si es una instancia de WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Comprueba si es una instancia de UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Comprueba si es una instancia de Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Comprueba si es una instancia de NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Comprueba si es una instancia de BigIntStatistics | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | Comprueba si es un objeto Promise | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | Comprueba si es una AsyncFunction | O(1) | O(1) |

```typescript
// Ejemplos de uso de guardias de tipo
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Seguro para tipos, value inferido como string
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // Seguro para tipos, ahora es un objeto iterable.
    for(let item of value){
        console.log(item);
    }
}
```

## Funciones Utilitarias

| Función | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Función de comparación genérica | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Generador de números pseudoaleatorios | O(log n) | O(1) |

```typescript
// Ejemplos de uso de funciones utilitarias
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // Número aleatorio basado en semilla
```

## Métodos de Fábrica

### Métodos de Fábrica de Optional

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `Optional.empty<T>()` | Crea un Optional vacío | O(1) | O(1) |
| `Optional.of<T>(value)` | Crea un Optional que contiene un valor | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Crea un Optional que podría estar vacío | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Crea un Optional que no está vacío | O(1) | O(1) |

```typescript
// Ejemplos de uso de Optional
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((val: number): void => console.log(val)); // Salida: 42
console.log(emptyOpt.get(100)); // Salida: 100
```

### Métodos de Fábrica de Collector

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Crea un Collector completo | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Crea un Collector interrumpible | O(1) | O(1) |

```typescript
// Ejemplos de conversión de Collector
let numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Prioridad de rendimiento: usa un Collector no ordenado para obtener el mejor rendimiento
let unordered = numbers
    .filter((n: number): boolean => n > 3)
    .toUnordered(); // Mejor rendimiento

// Necesita ordenación: usa un Collector ordenado
let ordered = numbers.sorted();

// Operaciones de recuento de elementos
let count = Collector.full(
    (): number => 0, // Valor inicial
    (accumulator: number, element: number): number => accumulator + element, // Acumular
    (accumulator: number): number => accumulator // Finalizar
);
count.collect(from([1, 2, 3, 4, 5])); // Recuento desde un flujo
count.collect([1, 2, 3, 4, 5]); // Recuento desde un objeto iterable

let find = Collector.shortable(
    (): Optional<number> => Optional.empty(), // Valor inicial
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // Interrumpir
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // Acumular
    (accumulator: Optional<number>): Optional<number> => accumulator // Finalizar
);
find.collect(from([1, 2, 3, 4, 5])); // Encuentra el primer elemento
find.collect([1, 2, 3, 4, 5]); // Encuentra el primer elemento
```

### Métodos de Fábrica de Semantic

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | Crea un flujo de fotogramas de animación basado en tiempo | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Crea un flujo a partir de un Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Crea un flujo vacío | O(1) | O(1) |
| `fill<E>(element, count)` | Crea un flujo lleno | O(n) | O(1) |
| `from<E>(iterable)` | Crea un flujo a partir de un objeto iterable | O(1) | O(1) |
| `interval(period, delay?)` | Crea un flujo de intervalo de tiempo | O(1)* | O(1) |
| `iterate<E>(generator)` | Crea un flujo a partir de un generador | O(1) | O(1) |
| `range(start, end, step)` | Crea un flujo de rango numérico | O(n) | O(1) |
| `websocket(websocket)` | Crea un flujo a partir de un WebSocket | O(1) | O(1) |

```typescript
// Ejemplos de métodos de fábrica de Semantic

// Crea un flujo a partir de un Blob (lectura por partes)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // Escritura del flujo exitosa
    .catch(callback); // Escritura del flujo fallida

// Crea un flujo vacío, no se ejecutará hasta concatenarse con otros flujos
empty<string>()
    .toUnordered()
    .join(); // []

// Crea un flujo lleno
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Crea un flujo de intervalo con un retraso inicial de 2 segundos y un período de ejecución de 5 segundos, implementado sobre un mecanismo de temporizador; puede experimentar deriva temporal debido a las limitaciones de precisión de la programación del sistema.
const intervalStream = interval(5000, 2000);

// Crea un flujo a partir de un objeto iterable
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Crea un flujo de rango
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Flujo de eventos WebSocket
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message") // Solo escucha eventos de mensaje
  .toUnordered() // Los eventos generalmente no están ordenados
  .forEach((event): void => receive(event)); // Recibe mensajes
```

## Métodos de Clase Semantic

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `concat(other)` | Concatena dos flujos | O(n) | O(1) |
| `distinct()` | Elimina duplicados | O(n) | O(n) |
| `distinct(comparator)` | Elimina duplicados usando un comparador | O(n²) | O(n) |
| `dropWhile(predicate)` | Descarta elementos que satisfacen la condición | O(n) | O(1) |
| `filter(predicate)` | Filtra elementos | O(n) | O(1) |
| `flat(mapper)` | Aplicación plana de mapa | O(n × m) | O(1) |
| `flatMap(mapper)` | Aplicación plana de mapa a un nuevo tipo | O(n × m) | O(1) |
| `limit(n)` | Limita el número de elementos | O(n) | O(1) |
| `map(mapper)` | Transformación de asignación | O(n) | O(1) |
| `peek(consumer)` | Mirar elementos | O(n) | O(1) |
| `redirect(redirector)` | Redirigir índice | O(n) | O(1) |
| `reverse()` | Invierte el flujo | O(n) | O(1) |
| `shuffle()` | Mezcla al azar | O(n) | O(1) |
| `shuffle(mapper)` | Mezcla usando un mapeador | O(n) | O(1) |
| `skip(n)` | Omite los primeros n elementos | O(n) | O(1) |
| `sorted()` | Ordena | O(n log n) | O(n) |
| `sorted(comparator)` | Ordena usando un comparador | O(n log n) | O(n) |
| `sub(start, end)` | Obtiene un subflujo | O(n) | O(1) |
| `takeWhile(predicate)` | Obtiene elementos que satisfacen la condición | O(n) | O(1) |
| `translate(offset)` | Traduce índice | O(n) | O(1) |
| `translate(translator)` | Traduce índice usando un traductor | O(n) | O(1) |

```typescript
// Ejemplos de operaciones Semantic
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0) // Filtra números pares
    .map((n: number): number => n * 2) // Multiplica por 2
    .skip(1) // Omite el primero
    .limit(3) // Limita a 3 elementos
    .toUnordered() // Convierte a un colector no ordenado
    .toArray(); // Convierte a arreglo
// Resultado: [8, 12, 20]

// Ejemplo de operación compleja
const complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // Asigna cada elemento a dos
    .distinct() // Elimina duplicados
    .shuffle() // Mezcla el orden
    .takeWhile((n: number): boolean => n < 50) // Toma elementos menores que 50
    .toOrdered() // Convierte a un colector ordenado
    .toArray(); // Convierte a arreglo
```

## Métodos de Conversión Semantic

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------------|------------|------------|------------|
| `sorted()` | Convierte a un colector ordenado | O(n log n) | O(n) |
| `toUnordered()` | Convierte a un colector no ordenado | O(1) | O(1) |
| `toOrdered()` | Convierte a un colector ordenado | O(1) | O(1) |
| `toNumericStatistics()` | Convierte a estadísticas numéricas | O(n) | O(1) |
| `toBigintStatistics()` | Convierte a estadísticas BigInt | O(n) | O(1) |
| `toWindow()` | Convierte a un colector de ventana | O(1) | O(1) |
| `toCollectable()` | Convierte a `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Convierte a un colector personalizado | O(n) | O(1) |

```typescript
// Convierte a un arreglo ordenado ascendente
from([6, 4, 3, 5, 2]) // Crea un flujo
    .sorted() // Ordena el flujo en orden ascendente
    .toArray(); // [2, 3, 4, 5, 6]

// Convierte a un arreglo ordenado descendente
from([6, 4, 3, 5, 2]) // Crea un flujo
    .soted((a: number, b: number): number => b - a) // Ordena el flujo en orden descendente
    .toArray(); // [6, 5, 4, 3, 2]

// Redirige a un arreglo invertido
from([6, 4, 3, 5, 2])
    .redirect((element, index): bigint => -index) // Redirige a orden inverso
    .toOrderd() // Mantiene el orden redirigido
    .toArray(); // [2, 5, 3, 4, 6]

// Ignora las redirecciones para invertir el arreglo
from([6, 4, 3, 5, 2])
    .redirect((element, index): bigint => -index) // Redirige a orden inverso
    .toUnorderd() // Descarta el orden redirigido. Esta operación ignorará `redirect`, `reverse`, `shuffle` y `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Invierte el flujo en un arreglo
from([6, 4, 3, 5, 2])
    .reverse() // Invierte el flujo
    .toOrdered() // Garantiza el orden invertido
    .toArray(); // [2, 5, 3, 4, 6]

// Sobrescribe el flujo mezclado en un arreglo
from([6, 4, 3, 5, 2])
    .shuffle() // Mezcla el flujo
    .sorted() // Sobrescribe el orden mezclado. Esta operación sobrescribirá `redirect`, `reverse`, `shuffle` y `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Convierte a un colector de ventana
from([6, 4, 3, 5, 2])
    .toWindow(); // Convierte a estadísticas numéricas

from([6, 4, 3, 5, 2])
    .toNumericStatistics(); // Convierte a estadísticas BigInt

from([6n, 4n, 3n, 5n, 2n])
    .toBigintStatistics(); // Define un colector personalizado para recopilar datos

let customizedCollector = from([1, 2, 3, 4, 5])
    .toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Métodos de Recolección Collectable

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `anyMatch(predicate)` | Si algún elemento coincide | O(n) | O(1) |
| `allMatch(predicate)` | Si todos los elementos coinciden | O(n) | O(1) |
| `count()` | Recuento de elementos | O(n) | O(1) |
| `isEmpty()` | Si está vacío | O(1) | O(1) |
| `findAny()` | Encuentra cualquier elemento | O(n) | O(1) |
| `findFirst()` | Encuentra el primer elemento | O(n) | O(1) |
| `findLast()` | Encuentra el último elemento | O(n) | O(1) |
| `forEach(action)` | Itera sobre todos los elementos | O(n) | O(1) |
| `group(classifier)` | Agrupa por clasificador | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Agrupa por extracción de clave-valor | O(n) | O(n) |
| `join()` | Únete como cadena | O(n) | O(n) |
| `join(delimiter)` | Únete usando un delimitador | O(n) | O(n) |
| `nonMatch(predicate)` | Si ningún elemento coincide | O(n) | O(1) |
| `partition(count)` | Particionar por recuento | O(n) | O(n) |
| `partitionBy(classifier)` | Particionar por clasificador | O(n) | O(n) |
| `reduce(accumulator)` | Operación de reducción | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reducción con valor inicial | O(n) | O(1) |
| `toArray()` | Convierte a arreglo | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convierte a Map | O(n) | O(n) |
| `toSet()` | Convierte a Set | O(n) | O(n) |
| `write(stream)` | Escribe en el flujo | O(n) | O(1) |

```typescript
// Ejemplos de operaciones Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// Comprobaciones de coincidencia
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// Operaciones de búsqueda
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // Cualquier elemento

// Operaciones de agrupación
const grouped = data.groupBy(
    (n: number): string => (n > 5 ? "grande" : "pequeño"),
    (n: number): number => n * 2
); // {pequeño: [4, 8], grande: [12, 16, 20]}

// Operaciones de reducción
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Operaciones de salida
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Métodos de Análisis Estadístico

### Métodos de NumericStatistics

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|------|------|------------|------------|
| `range()` | Rango | O(n) | O(1) |
| `variance()` | Varianza | O(n) | O(1) |
| `standardDeviation()` | Desviación estándar | O(n) | O(1) |
| `mean()` | Media | O(n) | O(1) |
| `median()` | Mediana | O(n log n) | O(n) |
| `mode()` | Moda | O(n) | O(n) |
| `frequency()` | Distribución de frecuencia | O(n) | O(n) |
| `summate()` | Suma | O(n) | O(1) |
| `quantile(quantile)` | Cuantil | O(n log n) | O(n) |
| `interquartileRange()` | Rango intercuartílico | O(n log n) | O(n) |
| `skewness()` | Sesgo | O(n) | O(1) |
| `kurtosis()` | Curtosis | O(n) | O(1) |

```typescript
// Ejemplos de análisis estadístico
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Media:", numbers.mean()); // 5.5
console.log("Mediana:", numbers.median()); // 5.5
console.log("Desviación estándar:", numbers.standardDeviation()); // ~2.87
console.log("Suma:", numbers.summate()); // 55

// Análisis estadístico utilizando mappers
const objects = from([
    { value: 10 },
    { value: 20 },
    { value: 30 }
]).toNumericStatistics();
console.log("Media mapeada:", objects.mean(obj => obj.value)); // 20
```

## Guía de Selección de Rendimiento

### Elija un Colector No Ordenado (Rendimiento Primero)
```typescript
// Cuando no se necesita garantizar el orden, use un colector no ordenado para obtener el mejor rendimiento
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // Mejor rendimiento
```

### Elija un Colector Ordenado (Se Requiere Orden)
```typescript
// Cuando se necesita mantener el orden de los elementos, use un colector ordenado
let ordered = data.sorted(comparator);
```

### Elija un Colector de Ventana (Operaciones de Ventana)
```typescript
// Cuando se necesitan operaciones de ventana
let windowed: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // Ventana deslizante
```

### Elija un Análisis Estadístico (Cálculos Numéricos)
```typescript
// Cuando se necesita un análisis estadístico
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // Estadísticas numéricas

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // Estadísticas de enteros grandes
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Notas Importantes

1. **Impacto de las Operaciones de Ordenación**: En colectores ordenados, la operación `sorted()` invalida los efectos de `redirect`, `translate`, `shuffle`, `reverse`.
2. **Consideraciones de Rendimiento**: Si no se necesita garantizar el orden, priorice el uso de `toUnordered()` para un mejor rendimiento.
3. **Uso de Memoria**: Las operaciones de ordenación requieren espacio adicional de O(n).
4. **Datos en Tiempo Real**: Los flujos Semantic son adecuados para procesar datos en tiempo real y admiten fuentes de datos asíncronas.

Esta biblioteca proporciona a los desarrolladores de TypeScript capacidades de streaming poderosas y flexibles, combinando los beneficios de la programación funcional con garantías de seguridad de tipos.
