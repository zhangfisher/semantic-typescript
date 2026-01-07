# Semantic-TypeScript Stream-Verarbeitungsbibliothek

## Einführung

Semantic-TypeScript ist eine moderne Stream-Verarbeitungsbibliothek, die von JavaScript GeneratorFunction, Java Stream und MySQL Index inspiriert wurde. Der Kernentwurf der Bibliothek basiert auf der Erstellung effizienter Datenverarbeitungspipelines mittels Datenindizes, um TypeScript-Entwicklern eine typsichere, funktionale Stream-Verarbeitungserfahrung zu bieten.

Im Gegensatz zur traditionellen synchronen Verarbeitung verwendet Semantic einen asynchronen Verarbeitungsmodus. Beim Erstellen von Datenströmen hängt der Zeitpunkt des Datenempfangs vollständig davon ab, wann die Upstream-Quelle die `accept`- und `interrupt`-Callback-Funktionen aufruft. Dieser Entwurf ermöglicht der Bibliothek die elegante Verarbeitung von Echtzeit-Datenströmen, großen Datensätzen und asynchronen Datenquellen.

## Installation

```bash
npm install semantic-typescript
```

## Grundtypen

| Typ | Beschreibung |
|------|-------------|
| `Invalid<T>` | Ein Typ, der null oder undefined erweitert |
| `Valid<T>` | Ein Typ, der null und undefined ausschließt |
| `MaybeInvalid<T>` | Ein Typ, der null oder undefined sein kann |
| `Primitive` | Sammlung von primitiven Typen |
| `MaybePrimitive<T>` | Ein Typ, der ein primitiver Typ sein kann |
| `OptionalSymbol` | Symbolkennung der Klasse Optional |
| `SemanticSymbol` | Symbolkennung der Klasse Semantic |
| `CollectorsSymbol` | Symbolkennung der Klasse Collector |
| `CollectableSymbol` | Symbolkennung der Klasse Collectable |
| `OrderedCollectableSymbol` | Symbolkennung der Klasse OrderedCollectable |
| `WindowCollectableSymbol` | Symbolkennung der Klasse WindowCollectable |
| `StatisticsSymbol` | Symbolkennung der Klasse Statistics |
| `NumericStatisticsSymbol` | Symbolkennung der Klasse NumericStatistics |
| `BigIntStatisticsSymbol` | Symbolkennung der Klasse BigIntStatistics |
| `UnorderedCollectableSymbol` | Symbolkennung der Klasse UnorderedCollectable |

## Funktionale Schnittstellen

| Schnittstelle | Beschreibung |
|---------------|-------------|
| `Runnable` | Funktion ohne Parameter und Rückgabewert |  
| `Supplier<R>` | Funktion ohne Parameter, gibt R zurück |  
| `Functional<T, R>` | Einzelparameter-Konvertierungsfunktion |
| `BiFunctional<T, U, R>` | Zweiparameter-Konvertierungsfunktion |
| `TriFunctional<T, U, V, R>` | Dreiparameter-Konvertierungsfunktion |
| `Predicate<T>` | Einzelparameter-Auswahlfunktion |
| `BiPredicate<T, U>` | Zweiparameter-Auswahlfunktion |
| `TriPredicate<T, U, V>` | Dreiparameter-Auswahlfunktion |
| `Consumer<T>` | Einzelparameter-Verarbeitungsfunktion |
| `BiConsumer<T, U>` | Zweiparameter-Verarbeitungsfunktion |
| `TriConsumer<T, U, V>` | Dreiparameter-Verarbeitungsfunktion |
| `Comparator<T>` | Zweiparameter-Vergleichsfunktion |
| `Generator<T>` | Generatorfunktion (Kern und Basis) |

```typescript
// Typverwendungsbeispiele
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## Typwächter (Type Guards)

| Funktion | Beschreibung | Zeitkomplexität | Raumkomplexität |
|----------|-------------|-----------------|-----------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Prüft, ob Wert nicht null oder undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Prüft, ob Wert null oder undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Prüft auf Boolean | O(1) | O(1) |
| `isString(t: unknown): t is string` | Prüft auf String | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Prüft auf Number | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Prüft auf Function | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Prüft auf Object | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Prüft auf Symbol | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Prüft auf BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Prüft auf Primitivtyp | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Prüft auf Iterierbarkeit | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Prüft auf Optional-Instanz | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Prüft auf Semantic-Instanz | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Prüft auf Collector-Instanz | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Prüft auf Collectable-Instanz | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Prüft auf OrderedCollectable-Instanz | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Prüft auf WindowCollectable-Instanz | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Prüft auf UnorderedCollectable-Instanz | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Prüft auf Statistics-Instanz | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Prüft auf NumericStatistics-Instanz | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Prüft auf BigIntStatistics-Instanz | O(1) | O(1) |

```typescript
// Typwächter-Verwendungsbeispiele
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Typsicher, value wird als string inferiert
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## Hilfsfunktionen

| Funktion | Beschreibung | Zeitkomplexität | Raumkomplexität |
|----------|-------------|-----------------|-----------------|
| `useCompare<T>(t1: T, t2: T): number` | Allgemeine Vergleichsfunktion | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Pseudozufallszahlengenerator | O(log n) | O(1) |

```typescript
// Hilfsfunktions-Verwendungsbeispiele
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // Seed-basierte Zufallszahl
const randomBigInt = useRandom(1000n); // BigInt-Zufallszahl
```

## Fabrikmethoden

### Optional-Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|-------------|-----------------|-----------------|
| `Optional.empty<T>()` | Erstellt leeres Optional | O(1) | O(1) |
| `Optional.of<T>(value)` | Erstellt Optional mit Wert | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Erstellt Optional, das null sein kann | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Erstellt nicht-null Optional | O(1) | O(1) |

```typescript
// Optional-Verwendungsbeispiele
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // Gibt 42 aus
console.log(emptyOpt.orElse(100)); // Gibt 100 aus
```

### Collector-Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|-------------|-----------------|-----------------|
| `Collector.full(identity, accumulator, finisher)` | Erstellt vollständigen Collector | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Erstellt unterbrechbaren Collector | O(1) | O(1) |

```typescript
// Beispiele für Collector-Konvertierung
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Leistung zuerst: Verwende ungeordneten Collector
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// Sortierung benötigt: Verwende geordneten Collector  
const ordered = numbers.sorted();

// Zählt die Anzahl der Elemente
let count = Collector.full(
    () => 0, // Anfangswert
    (accumulator, element) => accumulator + element, // Akkumulieren
    (accumulator) => accumulator // Abschluss
);
count.collect(from([1,2,3,4,5])); // Zählt aus einem Stream
count.collect([1,2,3,4,5]); // Zählt aus einem Iterable-Objekt

let find = Collector.shortable(
    () => Optional.empty(), // Anfangswert
    (element, index, accumulator) => accumulator.isPresent(), // Unterbrechen
    (accumulator, element, index) => Optional.of(element), // Akkumulieren
    (accumulator) => accumulator // Abschluss
);
find.collect(from([1,2,3,4,5])); // Findet das erste Element
find.collect([1,2,3,4,5]); // Findet das erste Element
```

### Semantic-Fabrikmethoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|--------------|-----------------|-----------------|
| `blob(blob, chunkSize)` | Erzeugt Stream aus Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Erzeugt leeren Stream | O(1) | O(1) |
| `fill<E>(element, count)` | Erzeugt gefüllten Stream | O(n) | O(1) |
| `from<E>(iterable)` | Erzeugt Stream aus iterierbarem Objekt | O(1) | O(1) |
| `generate<E>(element, interrupt)` | Erzeugt Stream mit Generatorfunktion | O(1) | O(1) |
| `interval(period, delay?)` | Erzeugt regelmäßigen Intervall-Stream | O(1)* | O(1) |
| `iterate<E>(generator)` | Erzeugt Stream aus Generator | O(1) | O(1) |
| `range(start, end, step)` | Erzeugt numerischen Bereichs-Stream | O(n) | O(1) |
| `websocket(websocket)` | Erzeugt Stream aus WebSocket | O(1) | O(1) |

```typescript
// Beispiel zur Verwendung der Semantic-Fabrikmethoden

// Stream aus Blob erzeugen (chunkweises Lesen)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Stream-Schreibvorgang erfolgreich
  .catch(writeFi); // Stream-Schreibvorgang fehlgeschlagen

// Leeren Stream erzeugen, der erst nach Verknüpfung mit anderen Streams ausgeführt wird
empty<string>()
  .toUnordered()
  .join(); //[]

// Gefüllten Stream erzeugen
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Zeitgesteuerten Stream mit 2 Sekunden anfänglicher Verzögerung und 5 Sekunden Zyklus erzeugen, 
// implementiert über Timer-Mechanismus, mögliche Zeitabweichungen aufgrund von System-Schedulereinschränkungen.
const intervalStream = interval(5000, 2000);

// Stream aus iterierbarem Objekt erzeugen
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Bereichs-Stream erzeugen
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// WebSocket-Ereignisstream
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // Nur Nachrichtenereignisse überwachen
  .toUnordered() // Für Ereignisse normalerweise ungeordnet
  .forEach((event)=> receive(event)); // Nachrichten empfangen
```

## Semantic-Klassenmethoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|-------------|-----------------|-----------------|
| `concat(other)` | Verbindet zwei Streams | O(n) | O(1) |
| `distinct()` | Entfernt Duplikate | O(n) | O(n) |
| `distinct(comparator)` | Entfernt Duplikate mit Comparator | O(n²) | O(n) |
| `dropWhile(predicate)` | Verwirft Elemente, die Prädikat erfüllen | O(n) | O(1) |
| `filter(predicate)` | Filtert Elemente | O(n) | O(1) |
| `flat(mapper)` | Flache Abbildung | O(n × m) | O(1) |
| `flatMap(mapper)` | Flache Abbildung auf neuen Typ | O(n × m) | O(1) |
| `limit(n)` | Begrenzt Elementanzahl | O(n) | O(1) |
| `map(mapper)` | Transformationsabbildung | O(n) | O(1) |
| `peek(consumer)` | Zeigt Elemente an | O(n) | O(1) |
| `redirect(redirector)` | Index-Umleitung | O(n) | O(1) |
| `reverse()` | Kehrt Stream um | O(n) | O(1) |
| `shuffle()` | Zufällige Neuanordnung | O(n) | O(1) |
| `shuffle(mapper)` | Neuanordnung mit Mapper | O(n) | O(1) |
| `skip(n)` | Überspringt erste n Elemente | O(n) | O(1) |
| `sorted()` | Sortiert | O(n log n) | O(n) |
| `sorted(comparator)` | Sortiert mit Comparator | O(n log n) | O(n) |
| `sub(start, end)` | Erstellt Substream | O(n) | O(1) |
| `takeWhile(predicate)` | Nimmt Elemente, die Prädikat erfüllen | O(n) | O(1) |
| `translate(offset)` | Index-Translation | O(n) | O(1) |
| `translate(translator)` | Index-Translation mit Translator | O(n) | O(1) |

```typescript
// Semantic-Operationsbeispiele
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // Filtert gerade Zahlen
    .map(n => n * 2)                 // Multipliziert mit 2
    .skip(1)                         // Überspringt erstes Element
    .limit(3)                        // Begrenzt auf 3 Elemente
    .toUnordered()                    // Ungeordneten Collector verwenden
    .toArray();                      // Konvertiert zu Array
// Ergebnis: [8, 12, 20]

// Komplexe Operationsbeispiele
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Abbildet jedes Element zu zwei Elementen
    .distinct()                      // Entfernt Duplikate
    .shuffle()                       // Mischt zufällig
    .takeWhile(n => n < 50)         // Nimmt Elemente < 50
    .toOrdered()                     // Konvertiert zu geordnetem Collector
    .toArray();                      // Konvertiert zu Array
```

## Semantische Konversionsmethoden

| Methode | Beschreibung | Zeitkomplexität | Platzkomplexität |
|------------|------------|------------|------------|
| `sorted()` | In geordneten Collector umwandeln | O(n log n) | O(n) |
| `toUnordered()` | In ungeordneten Collector umwandeln | O(1) | O(1) |
| `toOrdered()` | In geordneten Collector umwandeln | O(1) | O(1) |
| `toNumericStatistics()` | In numerische Statistik umwandeln | O(n) | O(1) |
| `toBigintStatistics()` | In BigInt-Statistik umwandeln | O(n) | O(1) |
| `toWindow()` | In Window-Collector umwandeln | O(1) | O(1) |
| `toCollectable()` | In `UnorderedCollectable` umwandeln | O(n) | O(1) |
| `toCollectable(mapper)` | In benutzerdefinierten Collectable umwandeln | O(n) | O(1) |

```typescript
// In ein aufsteigend sortiertes Array umwandeln
from([6,4,3,5,2]) // Erstellt einen Stream
    .sorted() // Sortiert den Stream in aufsteigender Reihenfolge
    .toArray(); // [2, 3, 4, 5, 6]

// In ein absteigend sortiertes Array umwandeln
from([6,4,3,5,2]) // Erstellt einen Stream
    .soted((a, b) => b - a) // Sortiert den Stream in absteigender Reihenfolge
    .toArray(); // [6, 5, 4, 3, 2]

// Umleiten zu einem umgekehrten Array
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Leitet in umgekehrter Reihenfolge um
    .toOrderd() // Behält die umgeleitete Reihenfolge bei
    .toArray(); // [2, 5, 3, 4, 6]

// Umleitungen zum Umkehren des Arrays ignorieren
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Leitet in umgekehrter Reihenfolge um
    .toUnorderd() // Verwirft die umgeleitete Reihenfolge. Diese Operation ignoriert die Operationen `redirect`, `reverse`, `shuffle` und `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Den Stream umkehren und in ein Array umwandeln
from([6, 4, 3, 5, 2])
    .reverse() // Kehrt den Stream um
    .toOrdered() // Garantiert die umgekehrte Reihenfolge
    .toArray(); // [2, 5, 3, 4, 6]

// Den gemischten Stream überschreiben und in ein Array umwandeln
from([6, 4, 3, 5, 2])
    .shuffle() // Mischt den Stream
    .sorted() // Überschreibt die gemischte Reihenfolge. Diese Operation überschreibt die Operationen `redirect`, `reverse`, `shuffle` und `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// In Window-Collector umwandeln
from([6, 4, 3, 5, 2]).toWindow();

// In numerische Statistik umwandeln
from([6, 4, 3, 5, 2]).toNumericStatistics();

// In BigInt-Statistik umwandeln
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// Definiert einen benutzerdefinierten Collector zur Datensammlung
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Collectable-Sammelmethoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|-------------|-----------------|-----------------|
| `anyMatch(predicate)` | Prüft auf existierende Übereinstimmung | O(n) | O(1) |
| `allMatch(predicate)` | Prüft auf vollständige Übereinstimmung | O(n) | O(1) |
| `count()` | Elementzählung | O(n) | O(1) |
| `isEmpty()` | Prüft auf Leerheit | O(1) | O(1) |
| `findAny()` | Findet beliebiges Element | O(n) | O(1) |
| `findFirst()` | Findet erstes Element | O(n) | O(1) |
| `findLast()` | Findet letztes Element | O(n) | O(1) |
| `forEach(action)` | Iteriert über alle Elemente | O(n) | O(1) |
| `group(classifier)` | Gruppiert nach Klassifikator | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Gruppiert nach Schlüssel-Wert-Extraktor | O(n) | O(n) |
| `join()` | Verbindet zu String | O(n) | O(n) |
| `join(delimiter)` | Verbindet mit Trennzeichen | O(n) | O(n) |
| `nonMatch(predicate)` | Prüft auf keine Übereinstimmung | O(n) | O(1) |
| `partition(count)` | Partitioniert nach Anzahl | O(n) | O(n) |
| `partitionBy(classifier)` | Partitioniert nach Klassifikator | O(n) | O(n) |
| `reduce(accumulator)` | Reduktionsoperation | O(n) | O(1) |
| `reduce(identity, accumulator)` | Reduktion mit Initialwert | O(n) | O(1) |
| `toArray()` | Konvertiert zu Array | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Konvertiert zu Map | O(n) | O(n) |
| `toSet()` | Konvertiert zu Set | O(n) | O(n) |
| `write(stream)` | Schreibt in Stream | O(n) | O(1) |

```typescript
// Collectable-Operationsbeispiele
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Übereinstimmungsprüfungen
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Suchoperationen
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Beliebiges Element

// Gruppierungsoperationen
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Reduktionsoperationen
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Ausgabeoperationen
data.join(", "); // "2, 4, 6, 8, 10"
```

## Statistische Analysemethoden

### NumericStatistics-Methoden

| Methode | Beschreibung | Zeitkomplexität | Raumkomplexität |
|---------|-------------|-----------------|-----------------|
| `range()` | Spannweite | O(n) | O(1) |
| `variance()` | Varianz | O(n) | O(1) |
| `standardDeviation()` | Standardabweichung | O(n) | O(1) |
| `mean()` | Mittelwert | O(n) | O(1) |
| `median()` | Median | O(n log n) | O(n) |
| `mode()` | Modus | O(n) | O(n) |
| `frequency()` | Häufigkeitsverteilung | O(n) | O(n) |
| `summate()` | Summierung | O(n) | O(1) |
| `quantile(quantile)` | Quantil | O(n log n) | O(n) |
| `interquartileRange()` | Interquartilsabstand | O(n log n) | O(n) |
| `skewness()` | Schiefe | O(n) | O(1) |
| `kurtosis()` | Wölbung | O(n) | O(1) |

```typescript
// Statistische Analysebeispiele
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Mittelwert:", numbers.mean()); // 5.5
console.log("Median:", numbers.median()); // 5.5
console.log("Standardabweichung:", numbers.standardDeviation()); // ~2.87
console.log("Summe:", numbers.summate()); // 55

// Statistische Analyse mit Mapper
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Gemappter Mittelwert:", objects.mean(obj => obj.value)); // 20
```

## Leistungsauswahlleitfaden

### Ungeordneten Collector wählen (Leistungspriorität)
```typescript
// Wenn keine Reihenfolgegarantie benötigt wird
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Beste Leistung
```

### Geordneten Collector wählen (Reihenfolge benötigt)
```typescript
// Wenn Elementreihenfolge beibehalten werden muss
const ordered = data
    .sorted(comparator) // Sortierung überschreibt Umleitungseffekte
    .toOrdered(); // Beibehaltung der Reihenfolge
```

### Fenster-Collector wählen (Fensteroperationen)
```typescript
// Bei Fensteroperationsbedarf
const windowed = data
    .toWindow()
    .slide(5n, 2n); // Gleitendes Fenster
```

### Statistische Analyse wählen (Numerische Berechnungen)
```typescript
// Bei statistischem Analysebedarf
const stats = data
    .toNumericStatistics(); // Numerische Statistik

const bigIntStats = data
    .toBigintStatistics(); // BigInt-Statistik
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Wichtige Hinweise

1. **Auswirkungen von Sortieroperationen**: In geordneten Collectors überschreibt `sorted()` die Effekte von `redirect`, `translate`, `shuffle`, `reverse`
2. **Leistungsüberlegungen**: Bei fehlender Reihenfolgeanforderung priorisiert `toUnoredered()` verwenden
3. **Speichernutzung**: Sortieroperationen benötigen O(n) zusätzlichen Speicher
4. **Echtzeitdaten**: Semantic-Streams eignen sich für Echtzeitdaten und unterstützen asynchrone Datenquellen

Diese Bibliothek bietet TypeScript-Entwicklern leistungsstarke und flexible Stream-Verarbeitungsfähigkeiten, die die Vorteile der funktionalen Programmierung mit Typsicherheit kombinieren.