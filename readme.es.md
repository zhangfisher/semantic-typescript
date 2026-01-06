# Biblioteca de Procesamiento de Flujos Semantic-TypeScript

## Introducción

Semantic-TypeScript es una biblioteca moderna de procesamiento de flujos inspirada en JavaScript GeneratorFunction, Java Stream y MySQL Index. El diseño central de la biblioteca se basa en la construcción de pipelines eficientes de procesamiento de datos utilizando índices de datos, proporcionando a los desarrolladores frontend una experiencia de operación de flujos con seguridad de tipos y estilo funcional.

A diferencia del procesamiento sincrónico tradicional, Semantic adopta un modo de procesamiento asincrónico. Al crear flujos de datos, el momento en que el terminal recibe los datos depende completamente de cuándo la fuente ascendente llama a las funciones de callback `accept` e `interrupt`. Este diseño permite que la biblioteca maneje elegantemente flujos de datos en tiempo real, conjuntos de datos grandes y fuentes de datos asincrónicas.

## Instalación

```bash
npm install semantic-typescript
```

## Tipos Básicos

| Tipo | Descripción |
|------|-------------|
| `Invalid<T>` | Tipo que extiende null o undefined |
| `Valid<T>` | Tipo que excluye null y undefined |
| `MaybeInvalid<T>` | Tipo que puede ser null o undefined |
| `Primitive` | Colección de tipos primitivos |
| `MaybePrimitive<T>` | Tipo que puede ser un primitivo |
| `OptionalSymbol` | Identificador simbólico para la clase Optional |
| `SemanticSymbol` | Identificador simbólico para la clase Semantic |
| `CollectorsSymbol` | Identificador simbólico para la clase Collector |
| `CollectableSymbol` | Identificador simbólico para la clase Collectable |
| `OrderedCollectableSymbol` | Identificador simbólico para la clase OrderedCollectable |
| `WindowCollectableSymbol` | Identificador simbólico para la clase WindowCollectable |
| `StatisticsSymbol` | Identificador simbólico para la clase Statistics |
| `NumericStatisticsSymbol` | Identificador simbólico para la clase NumericStatistics |
| `BigIntStatisticsSymbol` | Identificador simbólico para la clase BigIntStatistics |
| `UnorderedCollectableSymbol` | Identificador simbólico para la clase UnorderedCollectable |
| `Runnable` | Función sin parámetros ni valor de retorno |
| `Supplier<R>` | Función sin parámetros que retorna R |
| `Functional<T, R>` | Función de transformación de un parámetro |
| `Predicate<T>` | Función de predicado de un parámetro |
| `BiFunctional<T, U, R>` | Función de transformación de dos parámetros |
| `BiPredicate<T, U>` | Función de predicado de dos parámetros |
| `Comparator<T>` | Función de comparación |
| `TriFunctional<T, U, V, R>` | Función de transformación de tres parámetros |
| `Consumer<T>` | Función consumidora de un parámetro |
| `BiConsumer<T, U>` | Función consumidora de dos parámetros |
| `TriConsumer<T, U, V>` | Función consumidora de tres parámetros |
| `Generator<T>` | Función generadora |

```typescript
// Ejemplos de uso de tipos
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## Guardias de Tipo

| Función | Descripción | Complejidad Temporal | Complejidad Espacial |
|---------|-------------|---------------------|---------------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Valida que el valor no sea null o undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Valida que el valor sea null o undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Verifica si es booleano | O(1) | O(1) |
| `isString(t: unknown): t is string` | Verifica si es string | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Verifica si es número | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Verifica si es función | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Verifica si es objeto | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Verifica si es símbolo | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Verifica si es BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Verifica si es tipo primitivo | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Verifica si es iterable | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Verifica si es instancia de Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Verifica si es instancia de Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Verifica si es instancia de Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Verifica si es instancia de Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Verifica si es instancia de OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Verifica si es instancia de WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Verifica si es instancia de UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Verifica si es instancia de Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Verifica si es instancia de NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Verifica si es instancia de BigIntStatistics | O(1) | O(1) |

```typescript
// Ejemplos de uso de guardias de tipo
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Seguro de tipos, value se infiere como string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## Funciones de Utilidad

| Función | Descripción | Complejidad Temporal | Complejidad Espacial |
|---------|-------------|---------------------|---------------------|
| `useCompare<T>(t1: T, t2: T): number` | Función de comparación universal | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Generador de números pseudoaleatorios | O(log n) | O(1) |

```typescript
// Ejemplos de uso de funciones de utilidad
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // Número aleatorio basado en semilla
const randomBigInt = useRandom(1000n); // Número BigInt aleatorio
```

## Métodos de Fábrica

### Métodos de Fábrica de Optional

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `Optional.empty<T>()` | Crea un Optional vacío | O(1) | O(1) |
| `Optional.of<T>(value)` | Crea un Optional con valor | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Crea un Optional que puede ser nulo | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Crea un Optional no nulo | O(1) | O(1) |

```typescript
// Ejemplos de uso de Optional
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // Output 42
console.log(emptyOpt.orElse(100)); // Output 100
```

### Métodos de Fábrica de Collector

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `Collector.full(identity, accumulator, finisher)` | Crea un colector completo | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Crea un colector interrumpible | O(1) | O(1) |

```typescript
// Ejemplos de uso de Collector
const sumCollector = Collector.full(
    () => 0,
    (sum, num) => sum + num,
    result => result
);

const numbers = from([1, 2, 3, 4, 5]);
const total = numbers.toUnoredered().collect(sumCollector); // 15
```

### Métodos de fábrica de Semantic

| Método | Descripción | Complejidad temporal | Complejidad espacial |
|--------|-------------|----------------------|----------------------|
| `blob(blob, chunkSize)` | Crea flujo desde Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Crea flujo vacío | O(1) | O(1) |
| `fill<E>(element, count)` | Crea flujo lleno | O(n) | O(1) |
| `from<E>(iterable)` | Crea flujo desde objeto iterable | O(1) | O(1) |
| `interval(period, delay?)` | Crea flujo de intervalo regular | O(1)* | O(1) |
| `iterate<E>(generator)` | Crea flujo desde generador | O(1) | O(1) |
| `range(start, end, step)` | Crea flujo de rango numérico | O(n) | O(1) |
| `websocket(websocket)` | Crea flujo desde WebSocket | O(1) | O(1) |

```typescript
// Ejemplo de uso de métodos de fábrica de Semantic

// Crear flujo desde Blob (lectura por fragmentos)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Escritura de flujo exitosa
  .catch(writeFi); // Escritura de flujo fallida

// Crear flujo vacío que no se ejecutará hasta concatenarse con otros flujos
empty<string>()
  .toUnordered()
  .join(); //[]

// Crear flujo lleno
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Crear flujo temporal con retraso inicial de 2 segundos y ciclo de 5 segundos,
// implementado mediante mecanismo de temporizador, posibles desviaciones de tiempo 
// debido a limitaciones de programación del sistema.
const intervalStream = interval(5000, 2000);

// Crear flujo desde objeto iterable
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Crear flujo de rango
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Flujo de eventos WebSocket
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // Solo monitorear eventos de mensaje
  .toUnordered() // Para eventos normalmente sin ordenar
  .forEach((event)=> receive(event)); // Recibir mensajes
```

## Métodos de Clase Semantic

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `concat(other)` | Concatena dos flujos | O(n) | O(1) |
| `distinct()` | Elimina duplicados | O(n) | O(n) |
| `distinct(comparator)` | Elimina duplicados con comparador | O(n²) | O(n) |
| `dropWhile(predicate)` | Descarta elementos que cumplen condición | O(n) | O(1) |
| `filter(predicate)` | Filtra elementos | O(n) | O(1) |
| `flat(mapper)` | Aplanamiento de mapeo | O(n × m) | O(1) |
| `flatMap(mapper)` | Aplanamiento a nuevo tipo | O(n × m) | O(1) |
| `limit(n)` | Limita cantidad de elementos | O(n) | O(1) |
| `map(mapper)` | Transformación de mapeo | O(n) | O(1) |
| `peek(consumer)` | Inspecciona elementos | O(n) | O(1) |
| `redirect(redirector)` | Redirección de índices | O(n) | O(1) |
| `reverse()` | Revierte flujo | O(n) | O(1) |
| `shuffle()` | Mezcla aleatoria | O(n) | O(1) |
| `shuffle(mapper)` | Mezcla con mapeador | O(n) | O(1) |
| `skip(n)` | Salta primeros n elementos | O(n) | O(1) |
| `sorted()` | Ordena | O(n log n) | O(n) |
| `sorted(comparator)` | Ordena con comparador | O(n log n) | O(n) |
| `sub(start, end)` | Obtiene subflujo | O(n) | O(1) |
| `takeWhile(predicate)` | Toma elementos que cumplen condición | O(n) | O(1) |
| `translate(offset)` | Traslación de índices | O(n) | O(1) |
| `translate(translator)` | Traslación con traductor | O(n) | O(1) |

```typescript
// Ejemplos de operaciones Semantic
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // Filtra números pares
    .map(n => n * 2)                 // Multiplica por 2
    .skip(1)                         // Salta el primero
    .limit(3)                        // Limita a 3 elementos
    .toArray();                      // Convierte a array
// Resultado: [8, 12, 20]

// Ejemplo de operación compleja
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Mapea cada elemento a dos elementos
    .distinct()                      // Elimina duplicados
    .shuffle()                       // Mezcla aleatoriamente
    .takeWhile(n => n < 50)         // Toma elementos < 50
    .toOrdered()                     // Convierte a colector ordenado
    .toArray();                      // Convierte a array
```

## Métodos de Transformación de Colectores

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `toUnoredered()` | Convierte a colector no ordenado (prioridad rendimiento) | O(1) | O(1) |
| `toOrdered()` | Convierte a colector ordenado | O(1) | O(1) |
| `sorted()` | Ordena y convierte a colector ordenado | O(n log n) | O(n) |
| `toWindow()` | Convierte a colector de ventana | O(1) | O(1) |
| `toNumericStatistics()` | Convierte a estadísticas numéricas | O(1) | O(1) |
| `toBigintStatistics()` | Convierte a estadísticas BigInt | O(1) | O(1) |

```typescript
// Ejemplos de transformación de colectores
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Prioridad rendimiento: Usar colector no ordenado
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// Necesita orden: Usar colector ordenado  
const ordered = numbers.sorted();

// Análisis estadístico: Usar colector estadístico
const stats = numbers
    .toNumericStatistics();

console.log(stats.mean());        // Promedio
console.log(stats.median());      // Mediana
console.log(stats.standardDeviation()); // Desviación estándar

// Operaciones de ventana
const windowed = numbers
    .toWindow()
    .tumble(3n); // Ventana de 3 elementos

windowed.forEach(window => {
    console.log(window.toArray()); // Contenido de cada ventana
});
```

## Métodos de Recolección de Collectable

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `anyMatch(predicate)` | Verifica si existe coincidencia | O(n) | O(1) |
| `allMatch(predicate)` | Verifica si todos coinciden | O(n) | O(1) |
| `count()` | Cuenta elementos | O(n) | O(1) |
| `isEmpty()` | Verifica si está vacío | O(1) | O(1) |
| `findAny()` | Encuentra cualquier elemento | O(n) | O(1) |
| `findFirst()` | Encuentra primer elemento | O(n) | O(1) |
| `findLast()` | Encuentra último elemento | O(n) | O(1) |
| `forEach(action)` | Itera sobre todos los elementos | O(n) | O(1) |
| `group(classifier)` | Agrupa por clasificador | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Agrupa por extractores de clave-valor | O(n) | O(n) |
| `join()` | Concatena a string | O(n) | O(n) |
| `join(delimiter)` | Concatena con separador | O(n) | O(n) |
| `nonMatch(predicate)` | Verifica si no hay coincidencias | O(n) | O(1) |
| `partition(count)` | Particiona por cantidad | O(n) | O(n) |
| `partitionBy(classifier)` | Particiona por clasificador | O(n) | O(n) |
| `reduce(accumulator)` | Operación de reducción | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reducción con valor inicial | O(n) | O(1) |
| `toArray()` | Convierte a array | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convierte a Map | O(n) | O(n) |
| `toSet()` | Convierte a Set | O(n) | O(n) |
| `write(stream)` | Escribe a stream | O(n) | O(1) |

```typescript
// Ejemplos de operaciones Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Verificaciones de coincidencia
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Operaciones de búsqueda
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Elemento cualquiera

// Operaciones de agrupación
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Operaciones de reducción
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Operaciones de salida
data.join(", "); // "2, 4, 6, 8, 10"
```

## Métodos de Análisis Estadístico

### Métodos de NumericStatistics

| Método | Descripción | Complejidad Temporal | Complejidad Espacial |
|--------|-------------|---------------------|---------------------|
| `range()` | Rango | O(n) | O(1) |
| `variance()` | Varianza | O(n) | O(1) |
| `standardDeviation()` | Desviación estándar | O(n) | O(1) |
| `mean()` | Media | O(n) | O(1) |
| `median()` | Mediana | O(n log n) | O(n) |
| `mode()` | Moda | O(n) | O(n) |
| `frequency()` | Distribución de frecuencia | O(n) | O(n) |
| `summate()` | Sumatoria | O(n) | O(1) |
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

// Análisis estadístico con mapeador
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Media mapeada:", objects.mean(obj => obj.value)); // 20
```

## Guía de Selección de Rendimiento

### Seleccionar Colector No Ordenado (Prioridad Rendimiento)
```typescript
// Cuando no se necesita garantía de orden
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Mejor rendimiento
```

### Seleccionar Colector Ordenado (Necesita Orden)
```typescript
// Cuando se debe mantener el orden de elementos
const ordered = data
    .sorted(comparator) // La ordenación sobrescribe efectos de redirección
    .toOrdered(); // Mantiene orden
```

### Seleccionar Colector de Ventana (Operaciones de Ventana)
```typescript
// Cuando se necesitan operaciones de ventana
const windowed = data
    .toWindow()
    .slide(5n, 2n); // Ventana deslizante
```

### Seleccionar Análisis Estadístico (Cálculos Numéricos)
```typescript
// Cuando se necesita análisis estadístico
const stats = data
    .toNumericStatistics(); // Estadísticas numéricas

const bigIntStats = data
    .toBigintStatistics(); // Estadísticas BigInt
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Consideraciones Importantes

1. **Impacto de operaciones de ordenación**: En colectores ordenados, `sorted()` sobrescribe los efectos de `redirect`, `translate`, `shuffle`, `reverse`
2. **Consideraciones de rendimiento**: Si no se necesita garantía de orden, priorizar `toUnoredered()` para mejor rendimiento
3. **Uso de memoria**: Las operaciones de ordenación requieren espacio adicional O(n)
4. **Datos en tiempo real**: Los flujos Semantic son ideales para datos en tiempo real y admiten fuentes de datos asincrónicas

Esta biblioteca proporciona a los desarrolladores de TypeScript capacidades potentes y flexibles de procesamiento de flujos, combinando las ventajas de la programación funcional con la seguridad de tipos.