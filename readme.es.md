# Framework de Procesamiento de Flujos Semantic-TypeScript

## Introducción

Semantic-TypeScript es una librería moderna de procesamiento de flujos inspirada en GeneratorFunction de JavaScript, Java Stream e Índices de MySQL. La filosofía de diseño central se basa en construir pipelines eficientes de procesamiento de datos mediante indexación de datos, proporcionando una experiencia de operación de streaming en estilo funcional y type-safe para el desarrollo frontend.

A diferencia del procesamiento sincrónico tradicional, Semantic emplea un modelo de procesamiento asíncrono. Al crear flujos de datos, el momento de recepción de datos terminales depende completamente de cuándo la corriente superior llama a las funciones callback `accept` e `interrupt`. Este diseño permite que la librería maneje elegantemente flujos de datos en tiempo real, grandes conjuntos de datos y fuentes de datos asíncronas.

## Características Principales

| Característica | Descripción | Ventaja |
|------|------|------|
| **Genéricos Type-Safe** | Soporte completo de tipos TypeScript | Detección de errores en tiempo de compilación, mejor experiencia de desarrollo |
| **Programación Funcional** | Estructuras de datos inmutables y funciones puras | Código más predecible, más fácil de probar y mantener |
| **Evaluación Perezosa** | Cálculo bajo demanda, optimización de rendimiento | Alta eficiencia de memoria al procesar grandes conjuntos de datos |
| **Procesamiento Asíncrono de Flujos** | Flujos de datos asíncronos basados en generadores | Adecuado para datos en tiempo real y escenarios orientados a eventos |
| **Colectores Multi-Paradigma** | Estrategias de recolección ordenadas, desordenadas y estadísticas | Selección de estrategia óptima basada en diferentes escenarios |
| **Análisis Estadístico** | Funciones completas integradas de cálculo estadístico | Generación integrada de análisis de datos e informes |

## Consideraciones de Rendimiento

**Nota Importante**: Los siguientes métodos sacrifican rendimiento para recolectar y ordenar datos, resultando en colecciones de datos ordenadas:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

Especialmente importante notar: `sorted()` y `sorted(comparator)` anularán los resultados de los siguientes métodos:
- `redirect(redirector)`
- `translate(translator)` 
- `shuffle(mapper)`

## Métodos de Fábrica

### Fábricas de Creación de Flujos

| Método | Firma | Descripción | Ejemplo |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Convertir Blob a flujo de bytes | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | Crear flujo vacío | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | Llenar con número especificado de elementos | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | Crear flujo desde objeto iterable | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | Crear flujo de rango numérico | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | Crear flujo desde función generadora | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | Crear flujo de eventos desde WebSocket | `websocket(socket)` |

**Suplemento de Ejemplo de Código:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// Crear flujo desde array
const numberStream = from([1, 2, 3, 4, 5]);

// Crear flujo de rango numérico
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Llenar con elementos repetidos
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// Crear flujo vacío
const emptyStream = empty<number>();
```

### Fábricas de Funciones de Utilidad

| Método | Firma | Descripción | Ejemplo |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | Validar si el valor es válido | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | Validar si el valor es inválido | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | Función de comparación genérica | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | Generador de números pseudoaleatorios | `useRandom(5)` → número aleatorio |

**Suplemento de Ejemplo de Código:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// Validar validez de datos
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // Llamada segura porque validate asegura que data no es null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("Datos inválidos"); // Se ejecutará porque invalidate detectó null
}

// Comparar valores
const comparison = useCompare("apple", "banana"); // -1

// Generar número aleatorio
const randomNum = useRandom(42); // Número aleatorio basado en semilla 42
```

## Detalles de la Clase Principal

### Optional<T> - Manejo Seguro de Valores Nulos

La clase Optional proporciona un enfoque funcional para manejar seguramente valores que pueden ser null o undefined.

| Método | Tipo de Retorno | Descripción | Complejidad Temporal |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | Filtrar valores que satisfacen condición | O(1) |
| `get()` | `T` | Obtener valor, lanza error si está vacío | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | Obtener valor o valor por defecto | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | Ejecutar acción si existe valor | O(1) |
| `isEmpty()` | `boolean` | Verificar si está vacío | O(1) |
| `isPresent()` | `boolean` | Verificar si existe valor | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | Mapear y transformar valor | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Crear instancia Optional | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | Crear Optional nullable | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | Crear Optional no nulo | O(1) |

**Suplemento de Ejemplo de Código:**
```typescript
import { Optional } from 'semantic-typescript';

// Crear instancia Optional
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// Operaciones en cadena
const result = optionalValue
    .filter(val => val.length > 3) // Filtrar valores más largos que 3
    .map(val => val.toUpperCase()) // Convertir a mayúsculas
    .getOrDefault("default"); // Obtener valor o por defecto

console.log(result); // "HELLO" o "default"

// Operaciones seguras
optionalValue.ifPresent(val => {
    console.log(`Valor existe: ${val}`);
});

// Verificar estado
if (optionalValue.isPresent()) {
    console.log("Tiene valor");
} else if (optionalValue.isEmpty()) {
    console.log("Está vacío");
}
```

### Semantic<E> - Flujo de Datos Perezoso

Semantic es la clase principal de procesamiento de flujos, que proporciona operadores ricos de flujos.

#### Operaciones de Transformación de Flujos

| Método | Tipo de Retorno | Descripción | Impacto en Rendimiento |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | Concatenar dos flujos | O(n+m) |
| `distinct()` | `Semantic<E>` | Eliminar duplicados (usando Set) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | Eliminación de duplicados con comparador personalizado | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | Descartar elementos iniciales que satisfacen condición | O(n) |
| `filter(predicate)` | `Semantic<E>` | Filtrar elementos | O(n) |
| `flat(mapper)` | `Semantic<E>` | Aplanar flujos anidados | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | Mapear y aplanar | O(n×m) |
| `limit(n)` | `Semantic<E>` | Limitar número de elementos | O(n) |
| `map(mapper)` | `Semantic<R>` | Mapear y transformar elementos | O(n) |
| `peek(consumer)` | `Semantic<E>` | Ver elementos sin modificación | O(n) |
| `redirect(redirector)` | `Semantic<E>` | Redirigir índices | O(n) |
| `reverse()` | `Semantic<E>` | Invertir orden del flujo | O(n) |
| `shuffle()` | `Semantic<E>` | Barajar orden aleatoriamente | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | Lógica de barajado personalizada | O(n) |
| `skip(n)` | `Semantic<E>` | Saltar primeros n elementos | O(n) |
| `sub(start, end)` | `Semantic<E>` | Obtener subflujo | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | Obtener elementos iniciales que satisfacen condición | O(n) |
| `translate(offset)` | `Semantic<E>` | Traducir índices | O(n) |
| `translate(translator)` | `Semantic<E>` | Transformación de índices personalizada | O(n) |

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Ejemplos de operaciones de transformación de flujos
const processedStream = stream
    .filter(x => x % 2 === 0) // Filtrar números pares
    .map(x => x * 2) // Multiplicar cada elemento por 2
    .distinct() // Eliminar duplicados
    .limit(3) // Limitar a primeros 3 elementos
    .peek((val, index) => console.log(`Elemento ${val} en índice ${index}`)); // Ver elementos

// Nota: El flujo aún no se ha ejecutado, necesita conversión a Collectable para operaciones terminales
```

#### Operaciones Terminales de Flujos

| Método | Tipo de Retorno | Descripción | Características de Rendimiento |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | Convertir a colección ordenada | Operación de ordenación, menor rendimiento |
| `toUnordered()` | `UnorderedCollectable<E>` | Convertir a colección desordenada | Más rápido, sin ordenación |
| `toWindow()` | `WindowCollectable<E>` | Convertir a colección de ventana | Operación de ordenación, menor rendimiento |
| `toNumericStatistics()` | `Statistics<E, number>` | Análisis estadístico numérico | Operación de ordenación, menor rendimiento |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Análisis estadístico de big integer | Operación de ordenación, menor rendimiento |
| `sorted()` | `OrderedCollectable<E>` | Ordenación natural | Anula resultados de redirección |
| `sorted(comparator)` | `OrderedCollectable<E>` | Ordenación personalizada | Anula resultados de redirección |

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// Convertir a colección ordenada (menor rendimiento)
const ordered = semanticStream.toOrdered();

// Convertir a colección desordenada (más rápido)
const unordered = semanticStream.toUnordered();

// Ordenación natural
const sortedNatural = semanticStream.sorted();

// Ordenación personalizada
const sortedCustom = semanticStream.sorted((a, b) => b - a); // Orden descendente

// Convertir a objeto estadístico
const stats = semanticStream.toNumericStatistics();

// Nota: Debe llamar a los métodos anteriores a través de la instancia Semantic para obtener Collectable antes de usar métodos terminales
```

### Collector<E, A, R> - Colector de Datos

Los colectores se utilizan para agregar datos de flujos en estructuras específicas.

| Método | Descripción | Escenario de Uso |
|------|------|----------|
| `collect(generator)` | Ejecutar recolección de datos | Operación terminal de flujo |
| `static full(identity, accumulator, finisher)` | Crear colector completo | Requiere procesamiento completo |
| `static shortable(identity, interruptor, accumulator, finisher)` | Crear colector interrumpible | Puede terminar temprano |

**Suplemento de Ejemplo de Código:**
```typescript
import { Collector } from 'semantic-typescript';

// Crear colector personalizado
const sumCollector = Collector.full(
    () => 0, // Valor inicial
    (acc, value) => acc + value, // Acumulador
    result => result // Función finalizadora
);

// Usar colector (requiere conversión de Semantic a Collectable primero)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - Clase Abstracta de Datos Colectables

Proporciona métodos ricos de agregación y transformación de datos. **Nota: Primero debe obtener una instancia Collectable llamando a sorted(), toOrdered(), etc. a través de la instancia Semantic antes de usar los siguientes métodos.**

#### Operaciones de Consulta de Datos

| Método | Tipo de Retorno | Descripción | Ejemplo |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | Si algún elemento coincide | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | Si todos los elementos coinciden | `allMatch(x => x > 0)` |
| `count()` | `bigint` | Estadísticas de conteo de elementos | `count()` → `5n` |
| `isEmpty()` | `boolean` | Si el flujo está vacío | `isEmpty()` |
| `findAny()` | `Optional<E>` | Encontrar cualquier elemento | `findAny()` |
| `findFirst()` | `Optional<E>` | Encontrar primer elemento | `findFirst()` |
| `findLast()` | `Optional<E>` | Encontrar último elemento | `findLast()` |

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// Debe convertir a Collectable antes de usar métodos terminales
const collectable = numbers.toUnordered();

// Operaciones de consulta de datos
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // Cualquier elemento
```

#### Operaciones de Agregación de Datos

| Método | Tipo de Retorno | Descripción | Complejidad |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | Agrupar por clasificador | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | Agrupar por extractores de clave-valor | O(n) |
| `join()` | `string` | Unir como cadena | O(n) |
| `join(delimiter)` | `string` | Unir con delimitador | O(n) |
| `partition(count)` | `E[][]` | Particionar por conteo | O(n) |
| `partitionBy(classifier)` | `E[][]` | Particionar por clasificador | O(n) |
| `reduce(accumulator)` | `Optional<E>` | Operación de reducción | O(n) |
| `reduce(identity, accumulator)` | `E` | Reducción con identidad | O(n) |
| `toArray()` | `E[]` | Convertir a array | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Convertir a Map | O(n) |
| `toSet()` | `Set<E>` | Convertir a Set | O(n) |

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// Debe convertir a Collectable antes de usar operaciones de agregación
const collectable = people.toUnordered();

// Operaciones de agrupación
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// Convertir a colecciones
const array = collectable.toArray(); // Array original
const set = collectable.toSet(); // Colección Set
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// Operaciones de reducción
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### Implementaciones Específicas de Colectores

#### UnorderedCollectable<E>
- **Características**: Colector más rápido, sin ordenación
- **Escenarios de Uso**: Orden no importante, máximo rendimiento deseado
- **Métodos**: Hereda todos los métodos de Collectable

#### OrderedCollectable<E> 
- **Características**: Garantiza orden de elementos, menor rendimiento
- **Escenarios de Uso**: Requieren resultados ordenados
- **Métodos Especiales**: Hereda todos los métodos, mantiene estado de orden interno

#### WindowCollectable<E>
- **Características**: Soporta operaciones de ventana deslizante
- **Escenarios de Uso**: Análisis de datos de series temporales
- **Métodos Especiales**:
  - `slide(size, step)` - Ventana deslizante
  - `tumble(size)` - Ventana de tumble

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Colector desordenado (más rápido)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // Puede mantener orden original [1, 2, 3, ...]

// Colector ordenado
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // Orden garantizado [1, 2, 3, ...]

// Colector de ventana
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // Tamaño de ventana 3, paso 2
// Ventana 1: [1, 2, 3], Ventana 2: [3, 4, 5], Ventana 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // Ventana de tumble tamaño 4
// Ventana 1: [1, 2, 3, 4], Ventana 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - Análisis Estadístico

Clase base de análisis estadístico que proporciona métodos ricos de cálculo estadístico. **Nota: Primero debe obtener una instancia Statistics llamando a toNumericStatistics() o toBigIntStatistics() a través de la instancia Semantic antes de usar los siguientes métodos.**

#### Operaciones de Cálculo Estadístico

| Método | Tipo de Retorno | Descripción | Complejidad de Algoritmo |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | Valor máximo | O(n) |
| `minimum()` | `Optional<E>` | Valor mínimo | O(n) |
| `range()` | `D` | Rango (max-min) | O(n) |
| `variance()` | `D` | Varianza | O(n) |
| `standardDeviation()` | `D` | Desviación estándar | O(n) |
| `mean()` | `D` | Valor medio | O(n) |
| `median()` | `D` | Valor mediano | O(n log n) |
| `mode()` | `D` | Valor modal | O(n) |
| `frequency()` | `Map<D, bigint>` | Distribución de frecuencia | O(n) |
| `summate()` | `D` | Sumatoria | O(n) |
| `quantile(quantile)` | `D` | Cuantil | O(n log n) |
| `interquartileRange()` | `D` | Rango intercuartílico | O(n log n) |
| `skewness()` | `D` | Asimetría | O(n) |
| `kurtosis()` | `D` | Curtosis | O(n) |

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Debe convertir a objeto estadístico antes de usar métodos estadísticos
const stats = numbers.toNumericStatistics();

// Estadísticas básicas
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// Estadísticas avanzadas
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // Cualquier valor (ya que todos aparecen una vez)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// Distribución de frecuencia
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### Clases Específicas de Implementación Estadística

**NumericStatistics<E>**
- Maneja análisis estadístico de tipo number
- Todos los cálculos estadísticos retornan tipo number

**BigIntStatistics<E>**  
- Maneja análisis estadístico de tipo bigint
- Todos los cálculos estadísticos retornan tipo bigint

**Suplemento de Ejemplo de Código:**
```typescript
import { from } from 'semantic-typescript';

// Estadísticas numéricas
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Estadísticas de big integer
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// Estadísticas usando funciones mapeadoras
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

## Ejemplo Completo de Uso

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. Crear flujo de datos
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. Pipeline de procesamiento de flujo
const processedStream = semanticStream
    .filter(val => validate(val)) // Filtrar null y undefined
    .map(val => val! * 2) // Multiplicar cada valor por 2 (usando ! porque validate asegura no vacío)
    .distinct(); // Eliminar duplicados

// 3. Convertir a Collectable y usar operaciones terminales
const collectable = processedStream.toUnordered();

// 4. Validación de datos y uso
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // Filtrar nuevamente
        .toArray(); // Convertir a array
    
    console.log("Resultados del procesamiento:", results); // [16, 18, 14, 8, 12]
    
    // Información estadística
    const stats = processedStream.toNumericStatistics();
    console.log("Valor medio:", stats.mean()); // 11.2
    console.log("Suma total:", stats.summate()); // 56
}

// 5. Manejar datos potencialmente inválidos
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("Datos válidos:", validData); // [1, 3, 4]
console.log("Datos inválidos:", invalidData); // [null, null]
```

## Resumen de Reglas Importantes de Uso

1. **Crear Flujo**: Usar métodos de fábrica `from()`, `range()`, `fill()`, etc. para crear instancias Semantic
2. **Transformación de Flujo**: Llamar métodos `map()`, `filter()`, `distinct()`, etc. en instancias Semantic
3. **Convertir a Collectable**: Debe llamar a uno de los siguientes métodos a través de la instancia Semantic:
   - `toOrdered()` - Colector ordenado
   - `toUnordered()` - Colector desordenado (más rápido)
   - `toWindow()` - Colector de ventana  
   - `toNumericStatistics()` - Estadísticas numéricas
   - `toBigIntStatistics()` - Estadísticas de big integer
   - `sorted()` - Ordenación natural
   - `sorted(comparator)` - Ordenación personalizada
4. **Operaciones Terminales**: Llamar métodos terminales `toArray()`, `count()`, `summate()`, etc. en instancias Collectable
5. **Validación de Datos**: Usar `validate()` para asegurar que los datos no son null/undefined, usar `invalidate()` para verificar datos inválidos

Este diseño garantiza seguridad de tipos y optimización de rendimiento mientras proporciona funcionalidad rica de procesamiento de flujos.