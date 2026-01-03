# 📘 semantic-typescript

Eine leistungsstarke, typsichere Utility-Bibliothek für die **semantische Datenverarbeitung** in TypeScript.  
Sie bietet komponierbare, funktional-programmierende Konstrukte zur Arbeit mit Collections, Streams und Sequenzen – inklusive Unterstützung für Sortieren, Filtern, Gruppieren, Statistik und mehr.

Ob Sie **sortierte oder unsortierte Daten** verarbeiten, **statistische Analysen** durchführen oder einfach nur **operationen flüssig verketten** möchten – diese Bibliothek deckt Ihr Bedürfnis ab.

---

## 🧩 Merkmale

- ✅ Vollständig **typsichere Generics**
- ✅ **Funktionale Programmierung** (z. B. map, filter, reduce)
- ✅ **Semantische Datenströme** (`Semantic<E>`) für **Lazy Evaluation**
- ✅ **Collector** zum Umwandeln von Streams in konkrete Datenstrukturen
- ✅ **Sortierte und unsortierte Collectables** – `toUnordered()` ist **am schnellsten (kein Sortieren**
- ✅ **Sortieren** über `sorted()`, `toOrdered()`, Vergleichsfunktionen
- ✅ **Statistische Analyse** (`Statistics`, `NumericStatistics`, `BigIntStatistics`)
- ✅ **Optional<T>** – Monade für sicheres Arbeiten mit potenziell `null` oder `undefined`
- ✅ **Iteratoren & Generatoren** basiertes Design – ideal auch für große oder asynchrone Daten

---

## 📦 Installation

```bash
npm install semantic-typescript
```

---

## 🧠 Kernkonzepte

### 1. `Optional<T>` – Sicheres Arbeiten mit Nullable-Werten

Ein monadisches Container-Objekt für Werte, die `null` oder `undefined` sein können.

#### Methoden:

| Methode | Beschreibung | Beispiel |
|--------|-------------|---------|
| `of(value)` | Wert einpacken (kann null/undefined sein) | `Optional.of(null)` |
| `ofNullable(v)` | Einpacken, null/undefined erlaubt | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | Einpacken, bei null/undefined wird eine Exception geworfen | `Optional.ofNonNull(5)` |
| `get()` | Wert auslesen (bei leerem Optional: Exception) | `opt.get()` |
| `getOrDefault(d)` | Wert auslesen oder Standardwert verwenden | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | Side-Effect ausführen, wenn Wert vorhanden | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | Wert transformieren (wenn vorhanden) | `opt.map(x => x + 1)` |
| `filter(fn)` | Nur Werte behalten, die den Prädikat erfüllen | `opt.filter(x => x > 0)` |
| `isEmpty()` | Prüfen, ob das Optional leer ist | `opt.isEmpty()` |
| `isPresent()` | Prüfen, ob ein Wert vorhanden ist | `opt.isPresent()` |

#### Beispiel:

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 oder 0
```

---

### 2. `Semantic<E>` – Lazy Datenstrom

Ein **Lazy, komponierbarer Sequence-Typ**. Ähnlich wie Java Streams oder Kotlin Sequences.

Erstellen Sie einen `Semantic`-Datenstrom mit Helfern wie `from()`, `range()`, `iterate()` oder `fill()`.

#### Erzeugungsmethoden:

| Funktion | Beschreibung | Beispiel |
|----------|-------------|---------|
| `from(iterable)` | Aus Array/Set/Iterable erstellen | `from([1, 2, 3])` |
| `range(start, end, step?)` | Zahlenbereich erzeugen | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | Einen Wert N-mal wiederholen | `fill('a', 3n)` |
| `iterate(gen)` | Benutzerdefinierten Generator verwenden | `iterate(genFn)` |

#### Häufig verwendete Operatoren:

| Methode | Beschreibung | Beispiel |
|--------|-------------|---------|
| `map(fn)` | Jedes Element transformieren | `.map(x => x * 2)` |
| `filter(fn)` | Nur Elemente behalten, die den Prädikat erfüllen | `.filter(x => x > 10)` |
| `limit(n)` | Maximale Anzahl von N Elementen | `.limit(5)` |
| `skip(n)` | Erste N Elemente überspringen | `.skip(2)` |
| `distinct()` | Duplikate entfernen (nutzt intern Set) | `.distinct()` |
| `sorted()` | Elemente sortieren (natürliche Reihenfolge) | `.sorted()` |
| `sorted(comparator)` | Mit benutzerdefinierter Sortierfunktion | `.sorted((a, b) => a - b)` |
| `toOrdered()` | Sortieren und `OrderedCollectable` zurückgeben | `.toOrdered()` |
| `toUnordered()` | **Keine Sortierung** – schnellster Weg | `.toUnordered()` ✅ |
| `collect(collector)` | Mit einem Collector aggregieren | `.collect(Collector.full(...))` |
| `toArray()` | In Array umwandeln | `.toArray()` |
| `toSet()` | In Set umwandeln | `.toSet()` |
| `toMap(keyFn, valFn)` | In Map umwandeln | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` – 🚀 Am schnellsten, keine Sortierung

Wenn Sie **keine bestimmte Reihenfolge** benötigen und den **schnellsten möglichen Durchsatz** wünschen, verwenden Sie:

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **Es wird kein Sortieralgorithmus verwendet.**  
Idealerweise bei irrelevanter Reihenfolge und maximalem Performancebedarf.

---

### 4. `toOrdered()` und `sorted()` – Sortierte Ausgabe

Wenn Sie eine **sortierte Ausgabe** benötigen, verwenden Sie:

```typescript
const ordered = semanticStream.sorted(); // Natürliche Sortierung
const customSorted = semanticStream.sorted((a, b) => a - b); // Eigene Sortierlogik
const orderedCollectable = semanticStream.toOrdered(); // Auch sortiert
```

⚠️ Diese Methoden **sortieren die Elemente**, entweder nach natürlicher Ordnung oder mit einem angegebenen Comparator.

---

### 5. `Collector<E, A, R>` – Datensammlung / Aggregation

Mit Collectors können Sie Streams in **einzelne oder komplexe Strukturen** umwandeln.

Eingebaute statische Factorys:

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

In der Praxis werden Sie diese meist über die höherwertigen Methoden der `Collectable`-Klassen verwenden.

---

### 6. `Collectable<E>` (abstrakte Klasse)

Basisklasse für:

- `OrderedCollectable<E>` – Sortierte Ausgabe
- `UnorderedCollectable<E>` – Keine Sortierung, schnellster Weg
- `WindowCollectable<E>` – Gleitende Fenster
- `Statistics<E, D>` – Statistische Aggregation

#### Häufige Methoden (über Vererbung):

| Methode | Beschreibung | Beispiel |
|--------|-------------|---------|
| `count()` | Anzahl der Elemente | `.count()` |
| `toArray()` | In Array umwandeln | `.toArray()` |
| `toSet()` | In Set umwandeln | `.toSet()` |
| `toMap(k, v)` | In Map umwandeln | `.toMap(x => x.id, x => x)` |
| `group(k)` | Nach Schlüssel gruppieren | `.group(x => x.category)` |
| `findAny()` | Beliebiges passendes Element (Optional) | `.findAny()` |
| `findFirst()` | Erstes Element (Optional) | `.findFirst()` |
| `reduce(...)` | Benutzerdefiniertes Reduzieren | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` – Sortierte Daten

Wenn Sie möchten, dass die Elemente **automatisch sortiert** werden, verwenden Sie diese Klasse.

Akzeptiert einen **benutzerdefinierten Comparator** oder nutzt die natürliche Sortierung.

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **Sortierte Ausgabe garantiert.**

---

### 8. `UnorderedCollectable<E>` – Keine Sortierung (🚀 Schnellster)

Wenn Ihnen die **Reihenfolge egal** ist und Sie die **beste Performance** wünschen, verwenden Sie:

```typescript
const unordered = new UnorderedCollectable(stream);
// Oder
const fastest = semanticStream.toUnordered();
```

✅ **Kein Sortieralgorithmus wird ausgeführt**  
✅ **Beste Performance, wenn Reihenfolge keine Rolle spielt**

---

### 9. `Statistics<E, D>` – Statistische Analyse

Abstrakte Basisklasse zur Analyse numerischer Daten.

#### Unterklassen:

- `NumericStatistics<E>` – Für `number`-Werte
- `BigIntStatistics<E>` – Für `bigint`-Werte

##### Häufig verwendete statistische Methoden:

| Methode | Beschreibung | Beispiel |
|--------|-------------|---------|
| `mean()` | Mittelwert | `.mean()` |
| `median()` | Median | `.median()` |
| `mode()` | Modalwert (häufigster Wert) | `.mode()` |
| `minimum()` | Minimum | `.minimum()` |
| `maximum()` | Maximum | `.maximum()` |
| `range()` | Maximum − Minimum | `.range()` |
| `variance()` | Varianz | `.variance()` |
| `standardDeviation()` | Standardabweichung | `.standardDeviation()` |
| `summate()` | Summe aller Werte | `.summate()` |
| `quantile(q)` | Quantil bei q (0–1) | `.quantile(0.5)` → Median |
| `frequency()` | Häufigkeit als Map | `.frequency()` |

---

## 🧪 Vollständiges Beispiel

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// Beispiel-Daten
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 Schnellster Weg: keine Sortierung
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // z.B. [10, 2, 8, 4, 5, 6] (wie eingegeben)

// 🔢 Natürlich sortiert
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 Statistik auswerten
const stats = new NumericStatistics(numbers);
console.log('Mittelwert:', stats.mean());
console.log('Median:', stats.median());
console.log('Modalwert:', stats.mode());
console.log('Bereich:', stats.range());
console.log('Standardabweichung:', stats.standardDeviation());
```

---

## 🛠️ Hilfsfunktionen

Die Bibliothek exportiert auch zahlreiche **Typ-Guards** und **Vergleichsfunktionen**:

| Funktion | Zweck |
|----------|-------|
| `isString(x)` | Typ-Guard für `string` |
| `isNumber(x)` | Typ-Guard für `number` |
| `isBoolean(x)` | Typ-Guard für `boolean` |
| `isIterable(x)` | Prüft, ob ein Objekt iterierbar ist |
| `useCompare(a, b)` | Universelle Vergleichsfunktion |
| `useRandom(x)` | Pseudo-Zufallszahlengenerator (spielerisch) |

---

## 🧩 Erweitert: Eigene Generatoren & Fenster

Sie können eigene **Generatoren** für kontrollierte oder unendliche Datenströme erstellen:

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

Oder **gleitende Fenster** verwenden:

```typescript
const windowed = ordered.slide(3n, 2n); // Fenstergröße 3, Schritt 2
```

---

## 📄 Lizenz

Dieses Projekt steht unter der **MIT-Lizenz** – kostenlos für kommerzielle und private Nutzung.

---

## 🙌 Mitwirken

Pull Requests, Issues und Ideen sind willkommen!

---

## 🚀 Schnellstart-Zusammenfassung

| Aufgabe | Methode |
|--------|---------|
| Null-sicheres Arbeiten | `Optional<T>` |
| Stream erstellen | `from([...])`, `range()`, `fill()` |
| Daten transformieren | `map()`, `filter()` |
| Daten sortieren | `sorted()`, `toOrdered()` |
| Keine Sortierung (schnell) | `toUnordered()` ✅ |
| Gruppieren / Aggregieren | `toMap()`, `group()`, `Collector` |
| Statistik | `NumericStatistics`, `mean()`, `median()` usw. |

---

## 🔗 Links

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 Dokumentation: Siehe Quellcode / Typdefinitionen

---

**Genießen Sie komponierbares, typsicheres und funktionales Datenhandling in TypeScript.** 🚀

--- 

✅ **Wichtig:**  
- `toUnordered()` → **Keine Sortierung, schnellster Weg**  
- Alle anderen (z. B. `sorted()`, `toOrdered()`) → **Sortieren die Daten**