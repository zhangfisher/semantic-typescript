# **Semantic-TypeScript**
**Flujos, Indexados.** Sus datos, bajo control preciso.

---

### Descripción general

Semantic-TypeScript marca un avance significativo en la tecnología de procesamiento de flujos, **sintetizando** los conceptos más efectivos de `GeneratorFunction` de JavaScript, Java Streams e indexación de estilo MySQL. Su filosofía central es a la vez simple y poderosa: construir pipelines de procesamiento de datos excepcionalmente eficientes mediante indexación inteligente, no a través de iteración de fuerza bruta.

Donde las librerías convencionales imponen bucles síncronos o cadenas de promesas incómodas, Semantic-TypeScript ofrece una experiencia **completamente asíncrona**, funcionalmente pura y rigurosamente segura en tipos, diseñada para las demandas del desarrollo front-end moderno.

En su modelo elegante, los datos solo llegan al consumidor cuando el pipeline ascendente invoca explícitamente las devoluciones de llamada `accept` (y, opcionalmente, `interrupt`). Usted tiene control total sobre el momento exacto en que se necesita.

---

### Por qué los desarrolladores lo prefieren

-   **Indexación Cero-Boilerplate** — cada elemento lleva su índice natural o personalizado.
-   **Estilo Puramente Funcional** — con inferencia completa de TypeScript.
-   **Flujos de Eventos a Prueba de Fugas** — `useWindow`, `useDocument`, `useHTMLElement` y `useWebSocket` están construidos con la seguridad en mente. Usted define el límite (usando `limit(n)`, `sub(start, end)` o `takeWhile(predicate)`) y la librería gestiona la limpieza. Sin oyentes persistentes, sin fugas de memoria.
-   **Estadísticas Integradas** — análisis numérico y de bigint integral que incluye promedios, medianas, modas, varianza, asimetría y curtosis.
-   **Rendimiento Predecible** — elija entre recolectores ordenados o desordenados según sus requisitos.
-   **Eficiencia de Memoria** — los flujos se evalúan de forma perezosa, aliviando las preocupaciones de memoria.
-   **Sin Comportamiento Indefinido** — TypeScript garantiza seguridad de tipos y nulabilidad. Los datos de entrada permanecen sin modificar a menos que se alteren explícitamente dentro de sus funciones de devolución de llamada.

---

### Instalación

```bash
npm install semantic-typescript
```
o
```bash
yarn add semantic-typescript
```

---

### Comienzo rápido

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// Estadísticas numéricas
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // Requerido antes de la operación terminal
  .summate();             // 200

// Estadísticas de BigInt
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // Requerido antes de la operación terminal
  .summate();             // 200n

// Invertir un flujo por índice
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // Índice negativo para inversión
  .toOrdered() // Llamar a toOrdered() para preservar el orden del índice
  .toArray(); // [5, 4, 3, 2, 1]

// Mezclar un flujo
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // ej., [2, 5, 1, 4, 3]

// Trasladar elementos dentro de un flujo
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // Desplazar elementos 2 posiciones a la derecha
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // Desplazar elementos 2 posiciones a la izquierda
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// Rango infinito con terminación temprana
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // Detenerse después de 10 elementos
  .toUnordered()
  .toArray();

// Redimensión de ventana en tiempo real (se detiene automáticamente tras 5 eventos)
useWindow("resize")
  .limit(5n)          // Crucial para flujos de eventos
  .toUnordered()
  .forEach((ev, idx) => console.log(`Redimensión #${idx}`));

// Escuchar un elemento HTML
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Escuchar múltiples elementos y eventos
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Escuchar un WebSocket
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // Gestionar el ciclo de vida del WebSocket manualmente
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// Iterar sobre una cadena por punto de código
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // Imprime la cadena

// Convertir a cadena de forma segura un objeto con referencias circulares
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // Referencia circular
};
// let text: string = JSON.stringify(o); // Lanza un error
let text: string = useStringify(o); // Produce de forma segura `{a: 1, b: "text", c: []}`
```

---

### Conceptos centrales

| Concepto | Propósito | Cuándo usarlo |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | Constructor central para flujos asíncronos, eventos y pipelines perezosos. | Eventos en tiempo real, WebSockets, oyentes DOM, flujos de larga duración o infinitos. |
| `SynchronousSemantic` | Constructor para flujos síncronos, en memoria o basados en bucle. | Datos estáticos, rangos, iteración inmediata. |
| `toUnordered()` | Recolector terminal más rápido (indexación basada en Map). | Rutas críticas de rendimiento (tiempo y espacio O(n), sin ordenación). |
| `toOrdered()` | Recolector ordenado, estable en índices. | Cuando se requiere orden estable o acceso indexado. |
| `toNumericStatistics()` | Análisis estadístico numérico rico (media, mediana, varianza, asimetría, curtosis, etc.). | Análisis de datos y cálculos estadísticos. |
| `toBigIntStatistics()` | Análisis estadístico de bigint. | Análisis de datos y cálculos estadísticos para enteros grandes. |
| `toWindow()` | Soporte para ventanas deslizantes y fijas. | Procesamiento de series temporales, procesamiento por lotes y operaciones con ventanas. |

---

**Reglas de uso importantes**

1.  **Flujos de eventos** (`useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`, …) devuelven un `AsynchronousSemantic`.
    → **Debe** llamar a `.limit(n)`, `.sub(start, end)` o `.takeWhile()` para dejar de escuchar. De lo contrario, el oyente permanece activo.

2.  **Operaciones terminales** (`.toArray()`, `.count()`, `.average()`, `.reduce()`, `.findFirst()`, etc.) **solo están disponibles después** de la conversión a un recolector:
    ```typescript
    .toUnordered()   // Tiempo y espacio O(n), sin ordenación
    // o
    .toOrdered()     // Ordenado, mantiene el orden
    ```

---

### Características de rendimiento

| Recolector | Complejidad Temporal | Complejidad Espacial | ¿Ordenado? | Mejor para |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | No | Velocidad bruta, orden no requerido. |
| `toOrdered()` | O(2n) | O(n) | Sí | Orden estable, acceso indexado, análisis. |
| `toNumericStatistics()` | O(2n) | O(n) | Sí | Operaciones estadísticas que requieren datos ordenados. |
| `toBigIntStatistics()` | O(2n) | O(n) | Sí | Operaciones estadísticas para bigint. |
| `toWindow()` | O(2n) | O(n) | Sí | Operaciones de ventana basadas en tiempo. |

Opte por `toUnordered()` cuando la velocidad sea primordial. Use `toOrdered()` solo cuando necesite un orden estable o métodos estadísticos que dependan de datos ordenados.

---

**Comparación con otros procesadores de flujo para Front-End**

| Característica | Semantic-TypeScript | RxJS | Iteradores/Generadores Asíncronos Nativos | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| **Integración con TypeScript** | De primer nivel, profundamente tipado con consciencia nativa de índices. | Excelente, pero involucra genéricos complejos. | Buena, requiere tipado manual. | Estilo funcional fuerte. |
| **Análisis Estadístico Integrado** | Soporte nativo integral para `number` y `bigint`. | No disponible de forma nativa (requiere operadores personalizados). | Ninguno. | Ninguno. |
| **Indexación y Conciencia de Posición** | Indexación nativa y potente de bigint en cada elemento. | Requiere operadores personalizados (`scan`, `withLatestFrom`). | Se requiere contador manual. | Básica, sin índice incorporado. |
| **Gestión de Flujos de Eventos** | Fábricas dedicadas y seguras en tipos con control explícito de parada temprana. | Potente pero requiere gestión manual de suscripciones. | Oyente de eventos manual + cancelación. | Buena `fromEvent`, ligero. |
| **Rendimiento y Eficiencia de Memoria** | Excepcional – recolectores optimizados `toUnordered()` y `toOrdered()`. | Muy buena, pero las cadenas de operadores añaden sobrecarga. | Excelente (sobrecarga cero). | Excelente. |
| **Tamaño del Paquete** | Muy ligero. | Grande (incluso con tree-shaking). | Cero (nativo). | Pequeño. |
| **Filosofía de Diseño de API** | Patrón de recolector funcional con indexación explícita. | Patrón Observable Reactivo. | Patrón Iterador / Generador. | Funcional, point-free. |
| **Terminación Temprana y Control** | Explícito (`interrupt`, `.limit()`, `.takeWhile()`, `.sub()`). | Bueno (`take`, `takeUntil`, `first`). | Manual (`break` en `for await…of`). | Bueno (`take`, `until`). |
| **Soporte Síncrono y Asíncrono** | API unificada – soporte de primer nivel para ambos. | Principalmente asíncrono. | Ambos, pero manual. | Principalmente asíncrono. |
| **Curva de Aprendizaje** | Suave para desarrolladores familiarizados con pipelines funcionales e indexados. | Más pronunciada (muchos operadores, observables fríos/calientes). | Baja. | Moderada. |

**Ventajas clave de Semantic-TypeScript**

*   Capacidades únicas de estadística e indexación integradas, eliminando la necesidad de `reduce` manual o librerías externas.
*   Control explícito sobre los flujos de eventos previene las fugas de memoria comunes en RxJS.
*   Un diseño síncrono/asíncrono unificado proporciona una única API consistente para diversos casos de uso.

Esta comparación ilustra por qué Semantic-TypeScript es particularmente adecuado para aplicaciones front-end modernas con TypeScript que exigen rendimiento, seguridad de tipos y análisis ricos sin la ceremonia de las librerías reactivas tradicionales.

---

### ¿Listo para explorar?

Semantic-TypeScript transforma flujos de datos complejos en pipelines legibles, componibles y de alto rendimiento. Ya sea que esté manejando eventos de UI en tiempo real, procesando grandes conjuntos de datos o construyendo paneles de análisis, proporciona el poder de la indexación a nivel de base de datos con la elegancia de la programación funcional.

**Próximos pasos:**

*   Explore la API completamente tipada en su IDE (todas las exportaciones son del paquete principal).
*   Únase a la creciente comunidad de desarrolladores que han reemplazado iteradores asíncronos complejos con pipelines Semantic limpios.

**Semantic-TypeScript** — donde los flujos se encuentran con la estructura.

Comience a construir hoy y experimente la diferencia que proporciona una indexación bien pensada.

**Construya con claridad, proceda con confianza y transforme los datos con intención.**

MIT © Eloy Kim