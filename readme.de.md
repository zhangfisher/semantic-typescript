# Semantic-TypeScript Stream Processing Framework

## Einführung

Semantic-TypeScript ist eine moderne Stream-Processing-Bibliothek, inspiriert von JavaScript GeneratorFunction, Java Stream und MySQL Index. Die Kern-Designphilosophie basiert auf dem Aufbau effizienter Datenverarbeitungspipelines durch Datenindizierung und bietet eine typsichere, funktionale Stream-Operation-Erfahrung für die Frontend-Entwicklung.

Im Gegensatz zur traditionellen synchronen Verarbeitung verwendet Semantic ein asynchrones Verarbeitungsmodell. Beim Erstellen von Datenströmen hängt der Zeitpunkt des terminalen Datenempfangs vollständig davon ab, wann der Upstream die `accept`- und `interrupt`-Callback-Funktionen aufruft. Dieses Design ermöglicht es der Bibliothek, Echtzeit-Datenströme, große Datensätze und asynchrone Datenquellen elegant zu verarbeiten.

## Kernfunktionen

| Funktion | Beschreibung | Vorteil |
|------|------|------|
| **Typsichere Generics** | Vollständige TypeScript-Typunterstützung | Fehlererkennung zur Kompilierzeit, bessere Entwicklungserfahrung |
| **Funktionale Programmierung** | Unveränderliche Datenstrukturen und reine Funktionen | Vorhersehbarerer Code, einfachere Tests und Wartung |
| **Lazy Evaluation** | Bedarfsgerechte Berechnung, Leistungsoptimierung | Hohe Speichereffizienz bei der Verarbeitung großer Datensätze |
| **Asynchrone Stream-Verarbeitung** | Generator-basierte asynchrone Datenströme | Geeignet für Echtzeitdaten und ereignisgesteuerte Szenarien |
| **Multi-Paradigma-Sammler** | Geordnete, ungeordnete, statistische Sammlungsstrategien | Optimale Strategiewahl basierend auf verschiedenen Szenarien |
| **Statistische Analyse** | Eingebaute vollständige statistische Berechnungsfunktionen | Integrierte Datenanalyse und Berichterstellungsgenerierung |

## Leistungsüberlegungen

**Wichtiger Hinweis**: Die folgenden Methoden opfern Leistung, um Daten zu sammeln und zu sortieren, was zu geordneten Datensammlungen führt:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

Besonders wichtig zu beachten: `sorted()` und `sorted(comparator)` überschreiben die Ergebnisse der folgenden Methoden:
- `redirect(redirector)`
- `translate(translator)`
- `shuffle(mapper)`

## Factory-Methoden

### Stream-Erstellungs-Factories

| Methode | Signatur | Beschreibung | Beispiel |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Konvertiere Blob in Byte-Stream | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | Erstelle leeren Stream | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | Fülle mit angegebener Anzahl an Elementen | `fill("hallo", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | Erstelle Stream aus iterierbarem Objekt | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | Erstelle numerischen Bereichs-Stream | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | Erstelle Stream aus Generator-Funktion | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | Erstelle Ereignis-Stream aus WebSocket | `websocket(socket)` |

**Code-Beispiel-Ergänzung:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// Erstelle Stream aus Array
const numberStream = from([1, 2, 3, 4, 5]);

// Erstelle numerischen Bereichs-Stream
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Fülle mit wiederholten Elementen
const filledStream = fill("hallo", 3n); // "hallo", "hallo", "hallo"

// Erstelle leeren Stream
const emptyStream = empty<number>();
```

### Hilfsfunktions-Factories

| Methode | Signatur | Beschreibung | Beispiel |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | Validiere ob Wert gültig ist | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | Validiere ob Wert ungültig ist | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | Generische Vergleichsfunktion | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | Pseudozufallszahlengenerator | `useRandom(5)` → Zufallszahl |

**Code-Beispiel-Ergänzung:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// Validiere Datenvalidität
const data: string | null = "hallo";
if (validate(data)) {
    console.log(data.toUpperCase()); // Sichere Aufruf, da validate sicherstellt, dass Daten nicht null sind
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("Daten ungültig"); // Wird ausgeführt, da invalidate null erkannt hat
}

// Vergleiche Werte
const comparison = useCompare("Apfel", "Banane"); // -1

// Generiere Zufallszahl
const randomNum = useRandom(42); // Zufallszahl basierend auf Seed 42
```

## Kernklassen-Details

### Optional<T> - Sichere Nullwert-Behandlung

Die Optional-Klasse bietet einen funktionalen Ansatz zur sicheren Handhabung von Werten, die null oder undefined sein könnten.

| Methode | Rückgabetyp | Beschreibung | Zeitkomplexität |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | Filtere Werte, die Bedingung erfüllen | O(1) |
| `get()` | `T` | Hole Wert, wirft Fehler wenn leer | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | Hole Wert oder Standardwert | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | Führe Aktion aus wenn Wert existiert | O(1) |
| `isEmpty()` | `boolean` | Prüfe ob leer | O(1) |
| `isPresent()` | `boolean` | Prüfe ob Wert existiert | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | Mappe und transformiere Wert | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Erstelle Optional-Instanz | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | Erstelle nullable Optional | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | Erstelle Non-Null Optional | O(1) |

**Code-Beispiel-Ergänzung:**
```typescript
import { Optional } from 'semantic-typescript';

// Erstelle Optional-Instanz
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hallo" : null);

// Kettenoperationen
const result = optionalValue
    .filter(val => val.length > 3) // Filtere Werte länger als 3
    .map(val => val.toUpperCase()) // Konvertiere zu Großbuchstaben
    .getOrDefault("standard"); // Hole Wert oder Standard

console.log(result); // "HALLO" oder "standard"

// Sichere Operationen
optionalValue.ifPresent(val => {
    console.log(`Wert existiert: ${val}`);
});

// Prüfe Status
if (optionalValue.isPresent()) {
    console.log("Hat Wert");
} else if (optionalValue.isEmpty()) {
    console.log("Ist leer");
}
```

### Semantic<E> - Lazy Datenstrom

Semantic ist die Kern-Stream-Verarbeitungsklasse und bietet reichhaltige Stream-Operatoren.

#### Stream-Transformations-Operationen

| Methode | Rückgabetyp | Beschreibung | Leistungsauswirkung |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | Verkette zwei Streams | O(n+m) |
| `distinct()` | `Semantic<E>` | Entferne Duplikate (mit Set) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | Benutzerdefinierte Comparator-Deduplizierung | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | Verwerfe Startelemente, die Bedingung erfüllen | O(n) |
| `filter(predicate)` | `Semantic<E>` | Filtere Elemente | O(n) |
| `flat(mapper)` | `Semantic<E>` | Glätte verschachtelte Streams | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | Mappe und glätte | O(n×m) |
| `limit(n)` | `Semantic<E>` | Begrenze Anzahl der Elemente | O(n) |
| `map(mapper)` | `Semantic<R>` | Mappe und transformiere Elemente | O(n) |
| `peek(consumer)` | `Semantic<E>` | Betrachte Elemente ohne Modifikation | O(n) |
| `redirect(redirector)` | `Semantic<E>` | Leite Indizes um | O(n) |
| `reverse()` | `Semantic<E>` | Kehre Stream-Reihenfolge um | O(n) |
| `shuffle()` | `Semantic<E>` | Mische Reihenfolge zufällig | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | Benutzerdefinierte Shuffle-Logik | O(n) |
| `skip(n)` | `Semantic<E>` | Überspringe erste n Elemente | O(n) |
| `sub(start, end)` | `Semantic<E>` | Hole Substream | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | Hole Startelemente, die Bedingung erfüllen | O(n) |
| `translate(offset)` | `Semantic<E>` | Übersetze Indizes | O(n) |
| `translate(translator)` | `Semantic<E>` | Benutzerdefinierte Index-Transformation | O(n) |

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Stream-Transformations-Operationsbeispiele
const processedStream = stream
    .filter(x => x % 2 === 0) // Filtere gerade Zahlen
    .map(x => x * 2) // Multipliziere jedes Element mit 2
    .distinct() // Entferne Duplikate
    .limit(3) // Begrenze auf erste 3 Elemente
    .peek((val, index) => console.log(`Element ${val} an Index ${index}`)); // Betrachte Elemente

// Hinweis: Der Stream wurde noch nicht ausgeführt, muss zu Collectable konvertiert werden für Terminaloperationen
```

#### Stream-Terminaloperationen

| Methode | Rückgabetyp | Beschreibung | Leistungscharakteristiken |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | Konvertiere zu geordneter Sammlung | Sortieroperation, geringere Leistung |
| `toUnordered()` | `UnorderedCollectable<E>` | Konvertiere zu ungeordneter Sammlung | Schnellste, keine Sortierung |
| `toWindow()` | `WindowCollectable<E>` | Konvertiere zu Fenster-Sammlung | Sortieroperation, geringere Leistung |
| `toNumericStatistics()` | `Statistics<E, number>` | Numerische statistische Analyse | Sortieroperation, geringere Leistung |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Big Integer statistische Analyse | Sortieroperation, geringere Leistung |
| `sorted()` | `OrderedCollectable<E>` | Natürliche Sortierung | Überschreibt Umleitungsergebnisse |
| `sorted(comparator)` | `OrderedCollectable<E>` | Benutzerdefinierte Sortierung | Überschreibt Umleitungsergebnisse |

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// Konvertiere zu geordneter Sammlung (geringere Leistung)
const ordered = semanticStream.toOrdered();

// Konvertiere zu ungeordneter Sammlung (schnellste)
const unordered = semanticStream.toUnordered();

// Natürliche Sortierung
const sortedNatural = semanticStream.sorted();

// Benutzerdefinierte Sortierung
const sortedCustom = semanticStream.sorted((a, b) => b - a); // Absteigende Sortierung

// Konvertiere zu statistischem Objekt
const stats = semanticStream.toNumericStatistics();

// Hinweis: Muss obige Methoden durch Semantic-Instanz aufrufen, um Collectable zu erhalten, bevor Terminalmethoden verwendet werden
```

### Collector<E, A, R> - Datensammler

Collectors werden verwendet, um Stream-Daten in spezifische Strukturen zu aggregieren.

| Methode | Beschreibung | Verwendungsszenario |
|------|------|----------|
| `collect(generator)` | Führe Datensammlung aus | Stream-Terminaloperation |
| `static full(identity, accumulator, finisher)` | Erstelle vollständigen Collector | Erfordert vollständige Verarbeitung |
| `static shortable(identity, interruptor, accumulator, finisher)` | Erstelle unterbrechbaren Collector | Kann vorzeitig beendet werden |

**Code-Beispiel-Ergänzung:**
```typescript
import { Collector } from 'semantic-typescript';

// Erstelle benutzerdefinierten Collector
const sumCollector = Collector.full(
    () => 0, // Initialwert
    (acc, value) => acc + value, // Akkumulator
    result => result // Finisher-Funktion
);

// Verwende Collector (erfordert Konvertierung von Semantic zu Collectable zuerst)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - Sammelbare Daten Abstrakte Klasse

Bietet reichhaltige Datenaggregations- und Transformationsmethoden. **Hinweis: Muss zuerst Collectable-Instanz erhalten, indem sorted(), toOrdered() etc. durch Semantic-Instanz aufgerufen werden, bevor die folgenden Methoden verwendet werden können.**

#### Datenabfrage-Operationen

| Methode | Rückgabetyp | Beschreibung | Beispiel |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | Ob irgendein Element übereinstimmt | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | Ob alle Elemente übereinstimmen | `allMatch(x => x > 0)` |
| `count()` | `bigint` | Elementanzahl-Statistiken | `count()` → `5n` |
| `isEmpty()` | `boolean` | Ob Stream leer ist | `isEmpty()` |
| `findAny()` | `Optional<E>` | Finde irgendein Element | `findAny()` |
| `findFirst()` | `Optional<E>` | Finde erstes Element | `findFirst()` |
| `findLast()` | `Optional<E>` | Finde letztes Element | `findLast()` |

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// Muss zu Collectable konvertiert werden, bevor Terminalmethoden verwendet werden
const collectable = numbers.toUnordered();

// Datenabfrage-Operationen
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // Irgendein Element
```

#### Datenaggregations-Operationen

| Methode | Rückgabetyp | Beschreibung | Komplexität |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | Gruppiere nach Classifier | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | Gruppiere nach Schlüssel-Wert-Extraktoren | O(n) |
| `join()` | `string` | Verbinde als String | O(n) |
| `join(delimiter)` | `string` | Verbinde mit Trennzeichen | O(n) |
| `partition(count)` | `E[][]` | Partitioniere nach Anzahl | O(n) |
| `partitionBy(classifier)` | `E[][]` | Partitioniere nach Classifier | O(n) |
| `reduce(accumulator)` | `Optional<E>` | Reduktionsoperation | O(n) |
| `reduce(identity, accumulator)` | `E` | Reduktion mit Identität | O(n) |
| `toArray()` | `E[]` | Konvertiere zu Array | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Konvertiere zu Map | O(n) |
| `toSet()` | `Set<E>` | Konvertiere zu Set | O(n) |

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// Muss zu Collectable konvertiert werden, bevor Aggregationsoperationen verwendet werden
const collectable = people.toUnordered();

// Gruppierungsoperationen
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// Konvertiere zu Sammlungen
const array = collectable.toArray(); // Ursprüngliches Array
const set = collectable.toSet(); // Set-Sammlung
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// Reduktionsoperationen
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### Spezifische Collector-Implementierungen

#### UnorderedCollectable<E>
- **Charakteristiken**: Schnellster Collector, keine Sortierung
- **Verwendungsszenarien**: Reihenfolge unwichtig, maximale Leistung gewünscht
- **Methoden**: Erbt alle Collectable-Methoden

#### OrderedCollectable<E>
- **Charakteristiken**: Garantiert Elementreihenfolge, geringere Leistung
- **Verwendungsszenarien**: Erfordern sortierte Ergebnisse
- **Spezielle Methoden**: Erbt alle Methoden, behält internen Sortierzustand bei

#### WindowCollectable<E>
- **Charakteristiken**: Unterstützt Gleitfenster-Operationen
- **Verwendungsszenarien**: Zeitreihendatenanalyse
- **Spezielle Methoden**:
  - `slide(size, step)` - Gleitfenster
  - `tumble(size)` - Tumbling-Fenster

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Ungeordneter Collector (schnellste)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // Kann ursprüngliche Reihenfolge beibehalten [1, 2, 3, ...]

// Geordneter Collector
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // Garantiert sortiert [1, 2, 3, ...]

// Fenster-Collector
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // Fenstergröße 3, Schritt 2
// Fenster 1: [1, 2, 3], Fenster 2: [3, 4, 5], Fenster 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // Tumbling-Fenster Größe 4
// Fenster 1: [1, 2, 3, 4], Fenster 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - Statistische Analyse

Statistische Analyse-Basisklasse, die reichhaltige statistische Berechnungsmethoden bietet. **Hinweis: Muss zuerst Statistics-Instanz erhalten, indem toNumericStatistics() oder toBigIntStatistics() durch Semantic-Instanz aufgerufen werden, bevor die folgenden Methoden verwendet werden können.**

#### Statistische Berechnungs-Operationen

| Methode | Rückgabetyp | Beschreibung | Algorithmus-Komplexität |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | Maximalwert | O(n) |
| `minimum()` | `Optional<E>` | Minimalwert | O(n) |
| `range()` | `D` | Bereich (max-min) | O(n) |
| `variance()` | `D` | Varianz | O(n) |
| `standardDeviation()` | `D` | Standardabweichung | O(n) |
| `mean()` | `D` | Mittelwert | O(n) |
| `median()` | `D` | Medianwert | O(n log n) |
| `mode()` | `D` | Modalwert | O(n) |
| `frequency()` | `Map<D, bigint>` | Häufigkeitsverteilung | O(n) |
| `summate()` | `D` | Summierung | O(n) |
| `quantile(quantile)` | `D` | Quantil | O(n log n) |
| `interquartileRange()` | `D` | Interquartilsabstand | O(n log n) |
| `skewness()` | `D` | Schiefe | O(n) |
| `kurtosis()` | `D` | Kurtosis | O(n) |

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Muss zu statistischem Objekt konvertiert werden, bevor statistische Methoden verwendet werden
const stats = numbers.toNumericStatistics();

// Grundlegende Statistiken
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// Erweiterte Statistiken
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // Irgendein Wert (da alle einmal erscheinen)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// Häufigkeitsverteilung
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### Spezifische Statistische Implementierungsklassen

**NumericStatistics<E>**
- Verarbeitet number-Typ statistische Analyse
- Alle statistischen Berechnungen geben number-Typ zurück

**BigIntStatistics<E>**
- Verarbeitet bigint-Typ statistische Analyse
- Alle statistischen Berechnungen geben bigint-Typ zurück

**Code-Beispiel-Ergänzung:**
```typescript
import { from } from 'semantic-typescript';

// Numerische Statistiken
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Big Integer Statistiken
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// Statistiken mit Mapper-Funktionen
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

## Vollständiges Verwendungsbeispiel

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. Erstelle Datenstrom
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. Stream-Verarbeitungspipeline
const processedStream = semanticStream
    .filter(val => validate(val)) // Filtere null und undefined heraus
    .map(val => val! * 2) // Multipliziere jeden Wert mit 2 (verwende !, da validate sicherstellt, dass nicht leer)
    .distinct(); // Entferne Duplikate

// 3. Konvertiere zu Collectable und verwende Terminaloperationen
const collectable = processedStream.toUnordered();

// 4. Datenvalidierung und Verwendung
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // Filtere erneut
        .toArray(); // Konvertiere zu Array
    
    console.log("Verarbeitungsergebnisse:", results); // [16, 18, 14, 8, 12]
    
    // Statistische Informationen
    const stats = processedStream.toNumericStatistics();
    console.log("Mittelwert:", stats.mean()); // 11.2
    console.log("Gesamtsumme:", stats.summate()); // 56
}

// 5. Behandle potenziell ungültige Daten
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("Gültige Daten:", validData); // [1, 3, 4]
console.log("Ungültige Daten:", invalidData); // [null, null]
```

## Wichtige Verwendungsregeln Zusammenfassung

1. **Erstelle Stream**: Verwende `from()`, `range()`, `fill()` etc. Factory-Methoden, um Semantic-Instanzen zu erstellen
2. **Stream-Transformation**: Rufe `map()`, `filter()`, `distinct()` etc. Methoden auf Semantic-Instanzen auf
3. **Konvertiere zu Collectable**: Muss eine der folgenden Methoden durch Semantic-Instanz aufrufen:
   - `toOrdered()` - Geordneter Collector
   - `toUnordered()` - Ungeordneter Collector (schnellste)
   - `toWindow()` - Fenster-Collector
   - `toNumericStatistics()` - Numerische Statistiken
   - `toBigIntStatistics()` - Big Integer Statistiken
   - `sorted()` - Natürliche Sortierung
   - `sorted(comparator)` - Benutzerdefinierte Sortierung
4. **Terminaloperationen**: Rufe `toArray()`, `count()`, `summate()` etc. Terminalmethoden auf Collectable-Instanzen auf
5. **Datenvalidierung**: Verwende `validate()` um sicherzustellen, dass Daten nicht null/undefined sind, verwende `invalidate()` um ungültige Daten zu prüfen

Dieses Design gewährleistet Typsicherheit und Leistungsoptimierung, während es gleichzeitig reichhaltige Stream-Verarbeitungsfunktionalität bietet.