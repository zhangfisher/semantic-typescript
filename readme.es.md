# 📘 semantic-typescript

Una poderosa biblioteca de utilidades para **procesamiento semántico de datos** en TypeScript, completamente **segura y tipada**.  
Proporciona construcciones funcionales compuestas para trabajar con colecciones, flujos y secuencias — con soporte para ordenar, filtrar, agrupar, realizar análisis estadísticos y más.

Ya sea que estés procesando **datos ordenados o no ordenados**, realizando **análisis estadísticos**, o simplemente **encadenando operaciones de forma fluida**, esta biblioteca está diseñada para cubrir todas tus necesidades.

---

## 🧩 Características

- ✅ **Genéricos tipados de forma segura** en toda la biblioteca
- ✅ Estilo **funcional** (map, filter, reduce, etc.)
- ✅ **Flujos de datos semánticos** (`Semantic<E>`) para evaluación diferida (lazy)
- ✅ **Coleccionadores (Collectors)** para transformar flujos en estructuras concretas
- ✅ **Collectables ordenados y no ordenados** — `toUnordered()` es **el más rápido (sin ordenar)**
- ✅ **Soporte para ordenar** mediante `sorted()`, `toOrdered()`, y comparadores personalizados
- ✅ **Análisis estadístico** (`Statistics`, `NumericStatistics`, `BigIntStatistics`)
- ✅ **Optional<T>** — monada para manejar valores nulos de forma segura
- ✅ Diseño basado en **iteradores y generadores** — ideal para grandes volúmenes o datos asíncronos

---

## 📦 Instalación

```bash
npm install semantic-typescript
```

---

## 🧠 Conceptos clave

### 1. `Optional<T>` — Manejo seguro de valores nulos

Un contenedor monádico para valores que pueden ser `null` o `undefined`.

#### Métodos:

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `of(value)` | Envolver un valor (puede ser nulo) | `Optional.of(null)` |
| `ofNullable(v)` | Envolver, permite valores nulos | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | Envolver, lanza excepción si es nulo/undefined | `Optional.ofNonNull(5)` |
| `get()` | Obtener el valor (o lanzar excepción si está vacío) | `opt.get()` |
| `getOrDefault(d)` | Obtener el valor o un valor por defecto | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | Ejecutar un efecto secundario si hay valor | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | Transformar el valor si existe | `opt.map(x => x + 1)` |
| `filter(fn)` | Conservar el valor solo si cumple el predicado | `opt.filter(x => x > 0)` |
| `isEmpty()` | Verificar si está vacío | `opt.isEmpty()` |
| `isPresent()` | Verificar si tiene un valor | `opt.isPresent()` |

#### Ejemplo:

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 o 0
```

---

### 2. `Semantic<E>` — Flujo de datos diferido

Un **flujo secuencial diferido y compuesto**. Similar a Java Streams o Kotlin Sequences.

Puedes crear un `Semantic` usando funciones como `from()`, `range()`, `iterate()` o `fill()`.

#### Creadores:

| Función | Descripción | Ejemplo |
|--------|-------------|---------|
| `from(iterable)` | Crear desde un Array, Set, Iterable | `from([1, 2, 3])` |
| `range(start, end, step?)` | Generar una secuencia de números | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | Repetir un elemento N veces | `fill('a', 3n)` |
| `iterate(gen)` | Usar una función generadora personalizada | `iterate(genFn)` |

#### Operadores comunes:

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `map(fn)` | Transformar cada elemento | `.map(x => x * 2)` |
| `filter(fn)` | Conservar elementos que cumplen el predicado | `.filter(x => x > 10)` |
| `limit(n)` | Limitar a los primeros N elementos | `.limit(5)` |
| `skip(n)` | Saltar los primeros N elementos | `.skip(2)` |
| `distinct()` | Eliminar duplicados (usa Set por defecto) | `.distinct()` |
| `sorted()` | Ordenar elementos (orden natural) | `.sorted()` |
| `sorted(comparator)` | Ordenar con un comparador personalizado | `.sorted((a, b) => a - b)` |
| `toOrdered()` | Ordenar y devolver un `OrderedCollectable` | `.toOrdered()` |
| `toUnordered()` | **Sin ordenar** — el más rápido | `.toUnordered()` ✅ |
| `collect(collector)` | Agregar usando un `Collector` | `.collect(Collector.full(...))` |
| `toArray()` | Convertir a Array | `.toArray()` |
| `toSet()` | Convertir a Set | `.toSet()` |
| `toMap(keyFn, valFn)` | Convertir a Map | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` — 🚀 El más rápido, sin ordenar

Si **no necesitas orden** y quieres el **máximo rendimiento**, utiliza:

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **No se aplica ningún algoritmo de ordenamiento.**  
Ideal cuando el orden no importa y la velocidad es prioritaria.

---

### 4. `toOrdered()` y `sorted()` — Resultados ordenados

Si necesitas un **resultado ordenado**, puedes usar:

```typescript
const ordered = semanticStream.sorted(); // Orden natural
const customSorted = semanticStream.sorted((a, b) => a - b); // Comparador personalizado
const orderedCollectable = semanticStream.toOrdered(); // También ordenado
```

⚠️ Estos métodos **ordenarán los elementos**, usando orden natural o el comparador dado.

---

### 5. `Collector<E, A, R>` — Agregación de datos

Los **colectores** te permiten **reducir un flujo a una estructura única o compleja**.

Existen fábricas estáticas como:

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

Pero normalmente los usarás a través de métodos de alto nivel en las clases `Collectable`.

---

### 6. `Collectable<E>` (clase abstracta)

Clase base para:

- `OrderedCollectable<E>` — Resultados ordenados
- `UnorderedCollectable<E>` — Sin ordenar, el más rápido
- `WindowCollectable<E>` — Ventanas deslizantes
- `Statistics<E, D>` — Estadísticas agregadas

#### Métodos comunes (heredados):

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `count()` | Contar elementos | `.count()` |
| `toArray()` | Convertir a Array | `.toArray()` |
| `toSet()` | Convertir a Set | `.toSet()` |
| `toMap(k, v)` | Convertir a Map | `.toMap(x => x.id, x => x)` |
| `group(k)` | Agrupar por clave | `.group(x => x.category)` |
| `findAny()` | Encontrar cualquier elemento (Optional) | `.findAny()` |
| `findFirst()` | Encontrar el primer elemento (Optional) | `.findFirst()` |
| `reduce(...)` | Reducción personalizada | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` — Datos ordenados

Si deseas que los elementos estén **ordenados automáticamente**, usa esta clase.

Acepta un **comparador personalizado** o el orden natural.

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **El orden está garantizado.**

---

### 8. `UnorderedCollectable<E>` — Sin ordenar (🚀 Más rápido)

Si **no te importa el orden** y buscas el **mejor rendimiento**, usa:

```typescript
const unordered = new UnorderedCollectable(stream);
// O
const fastest = semanticStream.toUnordered();
```

✅ **No se ejecuta ningún algoritmo de ordenamiento**  
✅ **Mejor rendimiento cuando el orden no importa**

---

### 9. `Statistics<E, D>` — Análisis estadístico

Clase abstracta para analizar datos numéricos.

#### Subclases:

- `NumericStatistics<E>` — Para valores `number`
- `BigIntStatistics<E>` — Para valores `bigint`

##### Métodos estadísticos comunes:

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `mean()` | Media | `.mean()` |
| `median()` | Mediana | `.median()` |
| `mode()` | Moda (valor más frecuente) | `.mode()` |
| `minimum()` | Mínimo | `.minimum()` |
| `maximum()` | Máximo | `.maximum()` |
| `range()` | Rango (máximo - mínimo) | `.range()` |
| `variance()` | Varianza | `.variance()` |
| `standardDeviation()` | Desviación estándar | `.standardDeviation()` |
| `summate()` | Suma total | `.summate()` |
| `quantile(q)` | Valor en el percentil q (0–1) | `.quantile(0.5)` → mediana |
| `frequency()` | Frecuencia como Map | `.frequency()` |

---

## 🧪 Ejemplo completo

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// Datos de ejemplo
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 Más rápido: sin ordenar
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // Ej: [10, 2, 8, 4, 5, 6] (orden original)

// 🔢 Orden natural
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 Estadísticas
const stats = new NumericStatistics(numbers);
console.log('Media:', stats.mean());
console.log('Mediana:', stats.median());
console.log('Moda:', stats.mode());
console.log('Rango:', stats.range());
console.log('Desviación estándar:', stats.standardDeviation());
```

---

## 🛠️ Funciones útiles

La librería también exporta varias **guardas de tipo (type guards)** y **herramientas de comparación**:

| Función | Propósito |
|--------|-----------|
| `isString(x)` | Guarda de tipo para `string` |
| `isNumber(x)` | Guarda de tipo para `number` |
| `isBoolean(x)` | Guarda de tipo para `boolean` |
| `isIterable(x)` | Comprueba si un objeto es iterable |
| `useCompare(a, b)` | Función de comparación universal |
| `useRandom(x)` | Generador de números aleatorios (divertido) |

---

## 🧩 Avanzado: Generadores personalizados y ventanas

Puedes crear **generadores personalizados** para flujos controlados o infinitos:

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

O usar **ventanas deslizantes (sliding windows)**:

```typescript
const windowed = ordered.slide(3n, 2n); // Ventanas de tamaño 3, salto de 2
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT** — libre para uso comercial y personal.

---

## 🙌 Contribuir

¡Pull requests, issues y sugerencias son bienvenidos!

---

## 🚀 Resumen rápido

| Tarea | Método |
|-------|--------|
| Manejar nulos con seguridad | `Optional<T>` |
| Crear un flujo | `from([...])`, `range()`, `fill()` |
| Transformar datos | `map()`, `filter()` |
| Ordenar datos | `sorted()`, `toOrdered()` |
| Sin ordenar (más rápido) | `toUnordered()` ✅ |
| Agrupar / Agregar | `toMap()`, `group()`, `Collector` |
| Estadísticas | `NumericStatistics`, `mean()`, `median()`, etc. |

---

## 🔗 Enlaces

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 Documentación: Ver código fuente / definiciones de tipo

---

**Disfruta del procesamiento de datos funcional, seguro y compuesto en TypeScript.** 🚀

--- 

✅ **Recuerda:**  
- `toUnordered()` → **Sin ordenar, más rápido**  
- Los demás (`sorted()`, `toOrdered()`, etc.) → **Ordenan los datos**