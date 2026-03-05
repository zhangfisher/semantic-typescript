# **Semantic-TypeScript**
**Flow, Indexed.** Ihre Daten unter präziser Kontrolle.

---

### Übersicht

Semantic-TypeScript stellt einen bedeutenden Fortschritt in der Stream-Verarbeitungstechnologie dar, indem es die effektivsten Konzepte von JavaScript-`GeneratorFunction`, Java Streams und MySQL-ähnlicher Indexierung **synthetisiert**. Die Kernphilosophie ist ebenso einfach wie mächtig: Konstruieren Sie außergewöhnlich effiziente Datenverarbeitungspipelines durch intelligente Indexierung, nicht durch rohe Iteration.

Während konventionelle Bibliotheken synchrone Schleifen oder umständliche Promise-Ketten aufzwingen, bietet Semantic-TypeScript ein **vollständig asynchrones**, funktional reines und rigoros typsicheres Erlebnis, das für die Anforderungen moderner Frontend-Entwicklung konzipiert ist.

In seinem eleganten Modell erreichen Daten den Consumer nur dann, wenn die vorgelagerte Pipeline explizit die `accept`- (und optional `interrupt`-) Callbacks aufruft. Sie haben die vollständige Kontrolle über den Zeitpunkt – genau dann, wenn er benötigt wird.

---

### Warum Entwickler es bevorzugen

-   **Zero-Boilerplate-Indexierung** – jedes Element trägt seinen natürlichen oder individuellen Index.
-   **Rein funktionaler Stil** — mit vollständiger TypeScript-Inferenz.
-   **Speicherleck-sichere Event-Streams** – `useWindow`, `useDocument`, `useHTMLElement` und `useWebSocket` sind mit Sicherheit im Hinterkopf entwickelt. Sie definieren die Grenze – mittels `limit(n)`, `sub(start, end)` oder `takeWhile(predicate)` – und die Bibliothek übernimmt die Aufräumarbeit. Keine hängen gebliebenen Listener, keine Speicherlecks.
-   **Integrierte Statistik** – umfassende numerische und BigInt-Analysen inklusive Mittelwerten, Medianen, Modus, Varianz, Schiefe und Kurtosis.
-   **Vorhersehbare Performance** – wählen Sie basierend auf Ihren Anforderungen zwischen geordneten und ungeordneten Kollektoren.
-   **Speichereffizient** – Streams werden lazy evaluiert, was Speicherbedenken mindert.
-   **Kein undefiniertes Verhalten** – TypeScript garantiert Typsicherheit und Null-Sicherheit. Eingabedaten bleiben unverändert, es sei denn, sie werden explizit in Ihren Callback-Funktionen modifiziert.

---

### Installation

```bash
npm install semantic-typescript
```
oder
```bash
yarn add semantic-typescript
```

---

### Schnellstart

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// Numerische Statistiken
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // Erforderlich vor Terminal-Operation
  .summate();             // 200

// BigInt-Statistiken
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // Erforderlich vor Terminal-Operation
  .summate();             // 200n

// Einen Stream per Index umkehren
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // Negativer Index zur Umkehrung
  .toOrdered() // toOrdered() aufrufen, um die Indexreihenfolge zu erhalten
  .toArray(); // [5, 4, 3, 2, 1]

// Einen Stream mischen
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // z.B. [2, 5, 1, 4, 3]

// Elemente innerhalb eines Streams verschieben
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // Elemente um 2 Positionen nach rechts verschieben
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // Elemente um 2 Positionen nach links verschieben
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// Unendlicher Bereich mit frühem Abbruch
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // Nach 10 Elementen stoppen
  .toUnordered()
  .toArray();

// Echtzeit-Fenster-Größenänderung (stoppt automatisch nach 5 Events)
useWindow("resize")
  .limit(5n)          // Entscheidend für Event-Streams
  .toUnordered()
  .forEach((ev, idx) => console.log(`Größenänderung #${idx}`));

// Auf ein HTML-Element hören
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Auf mehrere Elemente und Events hören
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Auf einen WebSocket hören
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // WebSocket-Lebenszyklus manuell verwalten
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// Über einen String Code-Punkt für Code-Punkt iterieren
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // Gibt den String aus

// Ein Objekt mit Zirkelbezügen sicher in einen String umwandeln
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // Zirkelbezug
};
// let text: string = JSON.stringify(o); // Wirft einen Fehler
let text: string = useStringify(o); // Ergibt sicher `{a: 1, b: "text", c: []}`
```

---

### Kernkonzepte

| Konzept | Zweck | Wann zu verwenden |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | Kern-Builder für asynchrone Streams, Events und faule Pipelines. | Echtzeit-Events, WebSockets, DOM-Listener, lang laufende oder unendliche Streams. |
| `SynchronousSemantic` | Builder für synchrone, im Speicher basierte oder schleifenbasierte Streams. | Statische Daten, Bereiche, sofortige Iteration. |
| `toUnordered()` | Schnellster Terminal-Kollektor (Map-basierte Indexierung). | Leistungskritische Pfade (O(n) Zeit & Speicher, keine Sortierung). |
| `toOrdered()` | Sortierter, indexstabiler Kollektor. | Wenn stabile Ordnung oder indexbasierter Zugriff erforderlich ist. |
| `toNumericStatistics()` | Umfangreiche numerische statistische Analyse (Mittelwert, Median, Varianz, Schiefe, Kurtosis etc.). | Datenanalyse und statistische Berechnungen. |
| `toBigIntStatistics()` | Umfangreiche BigInt-Statistikanalyse. | Datenanalyse und statistische Berechnungen für große Integer. |
| `toWindow()` | Unterstützung für gleitende und fallende Fenster. | Zeitreihenverarbeitung, Batching und Fensteroperationen. |

---

**Wichtige Nutzungsregeln**

1.  **Event-Streams** (`useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`, …) geben ein `AsynchronousSemantic` zurück.
    → Sie **müssen** `.limit(n)`, `.sub(start, end)` oder `.takeWhile()` aufrufen, um das Lauschen zu beenden. Andernfalls bleibt der Listener aktiv.

2.  **Terminale Operationen** (`.toArray()`, `.count()`, `.average()`, `.reduce()`, `.findFirst()`, etc.) sind **nur verfügbar nach** der Konvertierung in einen Kollektor:
    ```typescript
    .toUnordered()   // O(n) Zeit & Speicher, keine Sortierung
    // oder
    .toOrdered()     // Sortiert, behält die Reihenfolge bei
    ```

---

### Leistungsmerkmale

| Kollektor | Zeitkomplexität | Speicherkomplexität | Sortiert? | Am besten für |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | Nein | Rohgeschwindigkeit, Reihenfolge nicht erforderlich. |
| `toOrdered()` | O(2n) | O(n) | Ja | Stabile Ordnung, indexierter Zugriff, Analysen. |
| `toNumericStatistics()` | O(2n) | O(n) | Ja | Statistische Operationen, die sortierte Daten erfordern. |
| `toBigIntStatistics()` | O(2n) | O(n) | Ja | Statistische Operationen für BigInt. |
| `toWindow()` | O(2n) | O(n) | Ja | Zeitbasierte Fensteroperationen. |

Setzen Sie auf `toUnordered()`, wenn Geschwindigkeit oberste Priorität hat. Verwenden Sie `toOrdered()` nur, wenn Sie eine stabile Ordnung oder statistische Methoden benötigen, die von sortierten Daten abhängen.

---

**Vergleich mit anderen Frontend-Stream-Prozessoren**

| Feature | Semantic-TypeScript | RxJS | Native Async Iteratoren / Generatoren | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| **TypeScript-Integration** | Erstklassig, tief typisiert mit nativer Index-Awareness. | Ausgezeichnet, aber mit komplexen Generics. | Gut, erfordert manuelle Typisierung. | Starker, funktionaler Stil. |
| **Integrierte statistische Analyse** | Umfassende native Unterstützung für `number` und `bigint`. | Nicht nativ verfügbar (benötigt benutzerdefinierte Operatoren). | Keine. | Keine. |
| **Indexierung & Positionsbewusstsein** | Native, mächtige BigInt-Indexierung für jedes Element. | Benötigt benutzerdefinierte Operatoren (`scan`, `withLatestFrom`). | Manueller Zähler erforderlich. | Grundlegend, kein eingebauter Index. |
| **Event-Stream-Management** | Dedizierte, typsichere Fabriken mit expliziter Frühstopp-Kontrolle. | Leistungsstark, aber erfordert manuelles Abonnement-Management. | Manueller Event-Listener + Abbruch. | Gute `fromEvent`, leichtgewichtig. |
| **Leistung & Speichereffizienz** | Hervorragend – optimierte `toUnordered()`- und `toOrdered()`-Kollektoren. | Sehr gut, aber Operator-Ketten verursachen Overhead. | Ausgezeichnet (kein Overhead). | Ausgezeichnet. |
| **Bundle-Größe** | Sehr leichtgewichtig. | Groß (auch mit Tree-Shaking). | Null (nativ). | Klein. |
| **API-Design-Philosophie** | Funktionales Kollektor-Muster mit expliziter Indexierung. | Reaktives Observable-Muster. | Iterator- / Generator-Muster. | Funktional, point-free. |
| **Frühe Beendigung & Kontrolle** | Explizit (`interrupt`, `.limit()`, `.takeWhile()`, `.sub()`). | Gut (`take`, `takeUntil`, `first`). | Manuell (`break` in `for await…of`). | Gut (`take`, `until`). |
| **Synchroner & asynchroner Support** | Vereinheitlichte API – erstklassiger Support für beides. | Hauptsächlich asynchron. | Beides, aber manuell. | Hauptsächlich asynchron. |
| **Lernkurve** | Flach für Entwickler, die mit funktionalen und indizierten Pipelines vertraut sind. | Steiler (viele Operatoren, heiße/kalte Observables). | Niedrig. | Mittel. |

**Hauptvorteile von Semantic-TypeScript**

*   Einzigartige, eingebaute statistische und Indexierungs-Fähigkeiten, die manuelles `reduce` oder externe Bibliotheken überflüssig machen.
*   Explizite Kontrolle über Event-Streams verhindert die bei RxJS häufigen Speicherlecks.
*   Ein einheitliches, synchrones/asynchrones Design bietet eine einzige, konsistente API für diverse Anwendungsfälle.

Dieser Vergleich veranschaulicht, warum Semantic-TypeScript besonders gut für moderne TypeScript-Frontend-Anwendungen geeignet ist, die Leistung, Typsicherheit und umfangreiche Analysen ohne den Aufwand traditioneller reaktiver Bibliotheken fordern.

---

### Bereit zu erkunden?

Semantic-TypeScript verwandelt komplexe Datenflüsse in lesbare, komponierbare und hochperformante Pipelines. Egal, ob Sie Echtzeit-UI-Events verarbeiten, große Datensätze verarbeiten oder Analyse-Dashboards erstellen – es bietet die Leistungsfähigkeit von Datenbank-gradiger Indexierung mit der Eleganz der funktionalen Programmierung.

**Nächste Schritte:**

*   Durchsuchen Sie die vollständig typisierte API in Ihrer IDE (alle Exporte stammen aus dem Hauptpaket).
*   Treten Sie der wachsenden Community von Entwicklern bei, die verschachtelte asynchrone Iteratoren durch saubere Semantic-Pipelines ersetzt haben.

**Semantic-TypeScript** – wo Streams auf Struktur treffen.

Beginnen Sie noch heute mit der Entwicklung und erleben Sie den Unterschied, den durchdachte Indexierung bewirkt.

**Erstellen Sie mit Klarheit, agieren Sie mit Zuversicht und transformieren Sie Daten mit Absicht.**

MIT © Eloy Kim