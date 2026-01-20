# Semantic-TypeScript Stream Processing Library

## Einleitung

Semantic-TypeScript ist eine moderne Stream-Verarbeitungsbibliothek, inspiriert von JavaScript GeneratorFunction, Java Stream und MySQL Index. Seine Kernphilosophie basiert auf dem Aufbau effizienter Datenverarbeitungspipelines mit Hilfe von Datenindizierung und bietet eine typsichere, funktionsbasierte Streaming-Benutzererfahrung für Frontend-Entwicklung.

Im Gegensatz zur traditionellen synchronen Verarbeitung verwendet Semantic ein asynchrones Verarbeitungsmodell. Beim Erstellen eines Datenstroms hängt die Zeit, zu der das Terminal Daten empfängt, vollständig davon ab, wann der Upstream die `accept`- und `interrupt`-Callback-Funktionen aufruft. Dieses Design ermöglicht es der Bibliothek, Echtzeitdatenströme, große Datensätze und asynchrone Datenquellen elegant zu verarbeiten.

## Installation

```bash
npm install semantic-typescript
```

## Grundlegende Typen

| Typ | Beschreibung |
|------|-------------|
| `Invalid<T>` | Typ, der sich von `null` oder `undefined` ableitet |
| `Valid<T>` | Typ, der `null` und `undefined` ausschließt |
| `MaybeInvalid<T>` | Typ, der `null` oder `undefined` sein kann |
| `Primitive` | Sammlung primitiver Typen |
| `MaybePrimitive<T>` | Typ, der ein primitiver Typ sein kann |
| `OptionalSymbol` | Symbolbezeichner der `Optional`-Klasse |
| `SemanticSymbol` | Symbolbezeichner der `Semantic`-Klasse |
| `CollectorsSymbol` | Symbolbezeichner der `Collector`-Klasse |
| `CollectableSymbol` | Symbolbezeichner der `Collectable`-Klasse |
| `OrderedCollectableSymbol` | Symbolbezeichner der `OrderedCollectable`-Klasse |
| `WindowCollectableSymbol` | Symbolbezeichner der `WindowCollectable`-Klasse |
| `StatisticsSymbol` | Symbolbezeichner der `Statistics`-Klasse |
| `NumericStatisticsSymbol` | Symbolbezeichner der `NumericStatistics`-Klasse |
| `BigIntStatisticsSymbol` | Symbolbezeichner der `BigIntStatistics`-Klasse |
| `UnorderedCollectableSymbol` | Symbolbezeichner der `UnorderedCollectable`-Klasse |

## Funktionsorientierte Schnittstellen

| Schnittstelle | Beschreibung |
|-----------|-------------|
| `Runnable` | Funktion ohne Parameter und ohne Rückgabewert |  
| `Supplier<R>` | Funktion ohne Parameter, die `R` zurückgibt |  
| `Functional<T, R>` | Einzelparameter-Transformationsfunktion |
| `BiFunctional<T, U, R>` | Zweiparameter-Transformationsfunktion |
| `TriFunctional<T, U, V, R>` | Dreiparameter-Transformationsfunktion |
| `Predicate<T>` | Einzelparameter-Prädikatfunktion |
| `BiPredicate<T, U>` | Zweiparameter-Prädikatfunktion |
| `TriPredicate<T, U, V>` | Dreiparameter-Prädikatfunktion |
| `Consumer<T>` | Einzelparameter-Consumerfunktion |
| `BiConsumer<T, U>` | Zweiparameter-Consumerfunktion |
| `TriConsumer<T, U, V>` | Dreiparameter-Consumerfunktion |
| `Comparator<T>` | Zweiparameter-Vergleichsfunktion |
| `Generator<T>` | Generatorfunktion (Kern und Basis) |

```typescript
// Beispiel für die Verwendung von Typen
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## Typguards

| Funktion | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Überprüft, ob der Wert nicht null oder undefined ist | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Überprüft, ob der Wert null oder undefined ist | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Überprüft, ob es sich um einen booleschen Wert handelt | O(1) | O(1) |
| `isString(t: unknown): t is string` | Überprüft, ob es sich um einen String handelt | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Überprüft, ob es sich um eine Zahl handelt | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Überprüft, ob es sich um eine Funktion handelt | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Überprüft, ob es sich um ein Objekt handelt | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Überprüft, ob es sich um ein Symbol handelt | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Überprüft, ob es sich um ein BigInt handelt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Überprüft, ob es sich um einen primitiven Typ handelt | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Überprüft, ob es sich um ein iterierbares Objekt handelt | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Überprüft, ob es sich um eine Optional-Instanz handelt | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Überprüft, ob es sich um eine Semantic-Instanz handelt | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Überprüft, ob es sich um eine Collector-Instanz handelt | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Überprüft, ob es sich um eine Collectable-Instanz handelt | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Überprüft, ob es sich um eine OrderedCollectable-Instanz handelt | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Überprüft, ob es sich um eine WindowCollectable-Instanz handelt | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Überprüft, ob es sich um eine UnorderedCollectable-Instanz handelt | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Überprüft, ob es sich um eine Statistics-Instanz handelt | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Überprüft, ob es sich um eine NumericStatistics-Instanz handelt | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Überprüft, ob es sich um eine BigIntStatistics-Instanz handelt | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | Überprüft, ob es sich um ein Promise-Objekt handelt | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | Überprüft, ob es sich um eine AsyncFunction handelt | O(1) | O(1) |

```typescript
// Beispiel für die Verwendung von Typguards
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Typsicher, value wird als string abgeleitet
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // Typsicher, jetzt ist es ein iterierbares Objekt.
    for(let item of value){
        console.log(item);
    }
}
```

## Hilfsfunktionen

| Funktion | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Allgemeine Vergleichsfunktion | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Pseudozufallszahlengenerator | O(log n) | O(1) |

```typescript
// Beispiel für die Verwendung von Hilfsfunktionen
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // Saat-basierter Zufallszahl
```

## Fabrikmethoden

### Optionale Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `Optional.empty<T>()` | Erstellt eine leere Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | Erstellt eine Optional, die einen Wert enthält | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Erstellt eine potenziell leere Optional | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Erstellt eine nicht-null Optional | O(1) | O(1) |

```typescript
// Beispiele für die Verwendung von Optional
let empty: Optional<number> = Optional.empty();
let present: Optional<number> = Optional.of(42);
let nullable: Optional<string> = Optional.ofNullable<string>(null);
let nonNull: Optional<string> = Optional.ofNonNull("hello");

present.ifPresent((value: number): void => console.log(value)); // Gibt 42 aus
console.log(empty.get(100)); // Gibt 100 aus
```

### Collector Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Erstellt einen vollständigen Collector | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Erstellt einen unterbrechbaren Collector | O(1) | O(1) |

```typescript
// Beispiele für die Konvertierung von Collectors
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Leistung zuerst: verwenden Sie den ungeordneten Collector
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnordered();

// Sortierung erforderlich: verwenden Sie den geordneten Collector  
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// Zählt die Anzahl der Elemente
let count: Collector<number, number, number> = Collector.full(
    (): number => 0, // Anfangswert
    (accumulator: number, element: number): number => accumulator + element, // Akkumulieren
    (accumulator: number): number => accumulator // Fertigstellen
);
count.collect(from([1,2,3,4,5])); // Zählt aus einem Stream
count.collect([1,2,3,4,5]); // Zählt aus einem iterierbaren Objekt

let find: Optional<number> = Collector.shortable(
    (): Optional<number> => Optional.empty(), // Anfangswert
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // Unterbrechen
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // Akkumulieren
    (accumulator: Optional<number>): Optional<number> => accumulator // Fertigstellen
);
find.collect(from([1,2,3,4,5])); // Findet das erste Element
find.collect([1,2,3,4,5]); // Findet das erste Element
```

### Semantic Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | Erstellt einen zeitgesteuerten Animationsframe-Stream | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Erstellt einen Stream aus einem Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Erstellt einen leeren Stream | O(1) | O(1) |
| `fill<E>(element, count)` | Erstellt einen gefüllten Stream | O(n) | O(1) |
| `from<E>(iterable)` | Erstellt einen Stream aus einem iterierbaren Objekt | O(1) | O(1) |
| `interval(period, delay?)` | Erstellt einen zeitgesteuerten Intervall-Stream | O(1)* | O(1) |
| `iterate<E>(generator)` | Erstellt einen Stream aus einem Generator | O(1) | O(1) |
| `range(start, end, step)` | Erstellt einen numerischen Bereichs-Stream | O(n) | O(1) |
| `websocket(websocket)` | Erstellt einen Stream aus einem WebSocket | O(1) | O(1) |

```typescript
// Beispiele für die Verwendung von Semantic Fabrikmethoden

// Erstellt einen Stream aus einem zeitgesteuerten Animationsframe
animationFrame(1000)
    .toUnordered()
    .forEach(frame => console.log(frame));

// Erstellt einen Stream aus einem Blob (chunked reading)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // Schreiben des Streams erfolgreich
    .catch(callback); // Schreiben des Streams fehlgeschlagen

// Erstellt einen leeren Stream, der erst ausgeführt wird, wenn er mit anderen Streams verkettet wird
empty<string>()
    .toUnordered()
    .join(); //[]

// Erstellt einen gefüllten Stream
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Erstellt einen zeitgesteuerten Stream mit einer anfänglichen Verzögerung von 2 Sekunden und einer Ausführungsperiode von 5 Sekunden, implementiert auf der Grundlage eines Timer-Mechanismus; kann aufgrund von Systemplanungsgenauigkeitsbeschränkungen zu Zeitdrift führen.
let intervalStream = interval(5000, 2000);

// Erstellt einen Stream aus einem iterierbaren Objekt
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// Erstellt einen Bereichs-Stream
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket-Ereignis-Stream
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message"); // Nur Nachrichtenereignisse abhören
  .toUnordered() // Ereignisse sind in der Regel nicht geordnet
  .forEach((event): void => receive(event)); // Nachrichten empfangen
```

## Semantic Klassenmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `concat(other)` | Verbindet zwei Streams | O(n) | O(1) |
| `distinct()` | Entfernt Duplikate | O(n) | O(n) |
| `distinct(comparator)` | Entfernt Duplikate mit einem Vergleichsoperator | O(n²) | O(n) |
| `dropWhile(predicate)` | Verwirft Elemente, die die Bedingung erfüllen | O(n) | O(1) |
| `filter(predicate)` | Filtert Elemente | O(n) | O(1) |
| `flat(mapper)` | Flachemapping | O(n × m) | O(1) |
| `flatMap(mapper)` | Flachemapping in einen neuen Typ | O(n × m) | O(1) |
| `limit(n)` | Begrenzt die Anzahl der Elemente | O(n) | O(1) |
| `map(mapper)` | Zuordnungstransformation | O(n) | O(1) |
| `peek(consumer)` | Blickt auf Elemente | O(n) | O(1) |
| `redirect(redirector)` | Leitet den Index um | O(n) | O(1) |
| `reverse()` | Umkehrt den Stream | O(n) | O(1) |
| `shuffle()` | Mischt zufällig | O(n) | O(1) |
| `shuffle(mapper)` | Mischt mit einem Mapper | O(n) | O(1) |
| `skip(n)` | Überspringt die ersten n Elemente | O(n) | O(1) |
| `sorted()` | Sortiert | O(n log n) | O(n) |
| `sorted(comparator)` | Sortiert mit einem Vergleichsoperator | O(n log n) | O(n) |
| `sub(start, end)` | Holt einen Substream | O(n) | O(1) |
| `takeWhile(predicate)` | Holt Elemente, die die Bedingung erfüllen | O(n) | O(1) |
| `translate(offset)` | Übersetzt den Index | O(n) | O(1) |
| `translate(translator)` | Übersetzt den Index mit einem Translator | O(n) | O(1) |

```typescript
// Beispiele für Semantic-Operationen
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)        // Filtert gerade Zahlen
    .map((n: number): number => n * 2)                 // Multipliziert mit 2
    .skip(1)                         // Überspringt das erste
    .limit(3)                        // Begrenzt auf 3 Elemente
    .toUnordered()                   // Konvertiert in einen ungeordneten Collector
    .toArray();                      // Konvertiert in ein Array
// Ergebnis: [8, 12, 20]

// Komplexes Operationsexample
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // Mappt jedes Element auf zwei
    .distinct()                      // Entfernt Duplikate
    .shuffle()                       // Mischt die Reihenfolge
    .takeWhile((n: number): boolean => n < 50)         // Nimmt Elemente kleiner als 50
    .toOrdered()                     // Konvertiert in einen geordneten Collector
    .toArray();                      // Konvertiert in ein Array
```

## Semantic Konvertierungsmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------------|------------|------------|------------|
| `sorted()` | Konvertiert in einen geordneten Collector | O(n log n) | O(n) |
| `toUnordered()` | Konvertiert in einen ungeordneten Collector | O(1) | O(1) |
| `toOrdered()` | Konvertiert in einen geordneten Collector | O(1) | O(1) |
| `toNumericStatistics()` | Konvertiert in numerische Statistiken | O(n) | O(1) |
| `toBigintStatistics()` | Konvertiert in BigInt-Statistiken | O(n) | O(1) |
| `toWindow()` | Konvertiert in einen Fenstercollector | O(1) | O(1) |
| `toCollectable()` | Konvertiert in `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Konvertiert in einen benutzerdefinierten Collectable | O(n) | O(1) |

```typescript
// Konvertiert in ein aufsteigend sortiertes Array
from([6,4,3,5,2]) // Erstellt einen Stream
    .sorted() // Sortiert den Stream in aufsteigender Reihenfolge
    .toArray(); // [2, 3, 4, 5, 6]

// Konvertiert in ein absteigend sortiertes Array
from([6,4,3,5,2]) // Erstellt einen Stream
    .soted((a: number, b: number): number => b - a) // Sortiert den Stream in absteigender Reihenfolge
    .toArray(); // [6, 5, 4, 3, 2]

// Leitet um in ein umgekehrtes Array
from([6,4,3,5,2])
    .redirect((element, index): bigint => -index) // Leitet um in umgekehrter Reihenfolge
    .toOrderd() // Behält die umgeleitete Reihenfolge bei
    .toArray(); // [2, 5, 3, 4, 6]

// Ignoriert Umleitungen, um ein umgekehrtes Array zu erhalten
from([6,4,3,5,2])
    .redirect((element: number, index: bigint) => -index) // Leitet um in umgekehrter Reihenfolge
    .toUnorderd() // Ignoriert die umgeleitete Reihenfolge. Diese Operation ignoriert `redirect`, `reverse`, `shuffle` und `translate` Operationen
    .toArray(); // [2, 5, 3, 4, 6]

// Kehrt den Stream in ein Array um
from([6, 4, 3, 5, 2])
    .reverse() // Kehrt den Stream um
    .toOrdered() // Garantiert die umgekehrte Reihenfolge
    .toArray(); // [2, 5, 3, 4, 6]

// Überschreibt den gemischten Stream in ein Array
from([6, 4, 3, 5, 2])
    .shuffle() // Mischt den Stream
    .sorted() // Überschreibt die gemischte Reihenfolge. Diese Operation überschreibt `redirect`, `reverse`, `shuffle` und `translate` Operationen
    .toArray(); // [2, 5, 3, 4, 6]

// Konvertiert in einen Fenstercollector
from([6, 4, 3, 5, 2]).toWindow();

// Konvertiert in numerische Statistiken
from([6, 4, 3, 5, 2]).toNumericStatistics();

// Konvertiert in BigInt-Statistiken
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// Definiert einen benutzerdefinierten Collector zum Sammeln von Daten
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable Auflistungsmethoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `anyMatch(predicate)` | Ob irgendein Element übereinstimmt | O(n) | O(1) |
| `allMatch(predicate)` | Ob alle Elemente übereinstimmen | O(n) | O(1) |
| `count()` | Elementanzahl | O(n) | O(1) |
| `isEmpty()` | Ob es leer ist | O(1) | O(1) |
| `findAny()` | Finde ein beliebiges Element | O(n) | O(1) |
| `findFirst()` | Finde das erste Element | O(n) | O(1) |
| `findLast()` | Finde das letzte Element | O(n) | O(1) |
| `forEach(action)` | Durchlaufe alle Elemente | O(n) | O(1) |
| `group(classifier)` | Gruppiere nach Klassifizierer | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Gruppiere nach Schlüssel-Wert-Extraktor | O(n) | O(n) |
| `join()` | Verbinde als Zeichenkette | O(n) | O(n) |
| `join(delimiter)` | Verbinde mit einem Trennzeichen | O(n) | O(n) |
| `nonMatch(predicate)` | Ob kein Element übereinstimmt | O(n) | O(1) |
| `partition(count)` | Partitioniere nach Anzahl | O(n) | O(n) |
| `partitionBy(classifier)` | Partitioniere nach Klassifizierer | O(n) | O(n) |
| `reduce(accumulator)` | Reduktionsoperation | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reduzierung mit Anfangswert | O(n) | O(1) |
| `toArray()` | Konvertiere in ein Array | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Konvertiere in eine Map | O(n) | O(n) |
| `toSet()` | Konvertiere in eine Menge | O(n) | O(n) |
| `write(stream)` | Schreibe in einen Stream | O(n) | O(1) |

```typescript
// Collectable Operationsexamples
let data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// Übereinstimmungsüberprüfungen
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// Suchvorgänge
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // Ein beliebiges Element

// Gruppierungsvorgänge
let grouped = data.groupBy(
    (n: number): string => (n > 5 ? "groß" : "klein"),
    (n: number): number => n * 2
); // {klein: [4, 8], groß: [12, 16, 20]}

// Reduktionsvorgänge
let sum = data.reduce(0, (acc, n) => acc + n); // 30

// Ausgabeoperationen
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Statistische Analysemethode

### NumericStatistics Methoden

| Methode | Beschreibung | Zeitkomplexität | Speicherplatzkomplexität |
|------|------|------------|------------|
| `range()` | Bereich | O(n) | O(1) |
| `variance()` | Varianz | O(n) | O(1) |
| `standardDeviation()` | Standardabweichung | O(n) | O(1) |
| `mean()` | Mittelwert | O(n) | O(1) |
| `median()` | Median | O(n log n) | O(n) |
| `mode()` | Modus | O(n) | O(n) |
| `frequency()` | Häufigkeitsverteilung | O(n) | O(n) |
| `summate()` | Summation | O(n) | O(1) |
| `quantile(quantile)` | Quantil | O(n log n) | O(n) |
| `interquartileRange()` | Interquartilsabstand | O(n log n) | O(n) |
| `skewness()` | Schiefe | O(n) | O(1) |
| `kurtosis()` | Wölbung | O(n) | O(1) |

```typescript
// Statistische Analysebeispiele
let numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Mittelwert:", numbers.mean()); // 5.5
console.log("Median:", numbers.median()); // 5.5
console.log("Standardabweichung:", numbers.standardDeviation()); // ~2.87
console.log("Summe:", numbers.summate()); // 55

// Mit Mappern statistische Analyse durchführen
let objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();
console.log("Gemappter Mittelwert:", objects.mean(obj => obj.value)); // 20
```

## Leistungsauswahlhandbuch

### Wählen Sie einen ungeordneten Collector (Leistung zuerst)
```typescript
// Wenn keine Reihenfolgegarantie benötigt wird, verwenden Sie einen ungeordneten Collector für beste Leistung
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // Beste Leistung
```

### Wählen Sie einen geordneten Collector (Reihenfolge erforderlich)
```typescript
// Wenn die Reihenfolge der Elemente beibehalten werden muss, verwenden Sie einen geordneten Collector
let ordered = data.sorted(comparator);
```

### Wählen Sie einen Fenstercollector (Fensteroperationen)
```typescript
// Wenn Fensteroperationen benötigt werden
let window: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // Gleitender Fenster
```

### Wählen Sie eine statistische Analyse (numerische Berechnungen)
```typescript
// Wenn eine statistische Analyse benötigt wird
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // Numerische Statistiken

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // Große Ganzzahlstatistiken
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Wichtige Hinweise

1. **Auswirkungen von Sortiervorgängen**: In geordneten Collectors überschreibt der `sorted()`-Vorgang die Effekte von `redirect`, `translate`, `shuffle`, `reverse`.
2. **Leistungserwägungen**: Wenn keine Reihenfolgegarantie benötigt wird, bevorzugen Sie die Verwendung von `toUnordered()` für eine bessere Leistung.
3. **Speicherverwendung**: Sortiervorgänge erfordern zusätzlichen Speicherplatz von O(n).
4. **Echtzeitdaten**: Semantic-Streams eignen sich für die Verarbeitung von Echtzeitdaten und unterstützen asynchrone Datenquellen.

Diese Bibliothek bietet TypeScript-Entwicklern leistungsstarke und flexible Streaming-Fähigkeiten und kombiniert die Vorteile der funktionalen Programmierung mit Typsicherheitsgarantien.