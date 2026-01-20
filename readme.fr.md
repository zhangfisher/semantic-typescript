# Bibliothèque de traitement de flux Semantic-TypeScript

## Introduction

Semantic-TypeScript est une bibliothèque moderne de traitement de flux inspirée par les fonctions génératrices de JavaScript, les flux Java et l'index de MySQL. Sa philosophie de conception centrale repose sur la construction de pipelines efficaces de traitement de données en utilisant l'indexation des données, offrant une expérience d'opération de flux fonctionnelle avec sécurité de types pour le développement front-end.

Contrairement au traitement synchrone traditionnel, Semantic utilise un modèle de traitement asynchrone. Lors de la création d'un flux de données, le moment où le terminal reçoit les données dépend entièrement de quand l'amont appelle les fonctions de rappel `accept` et `interrupt`. Ce design permet à la bibliothèque de gérer élégamment les flux de données en temps réel, les grands ensembles de données et les sources de données asynchrones.

## Installation

```bash
npm install semantic-typescript
```

## Types de base

| Type | Description |
|------|-------------|
| `Invalid<T>` | Type qui étend `null` ou `undefined` |
| `Valid<T>` | Type qui exclut `null` et `undefined` |
| `MaybeInvalid<T>` | Type qui peut être `null` ou `undefined` |
| `Primitive` | Collection de types primitifs |
| `MaybePrimitive<T>` | Type qui peut être un type primitif |
| `OptionalSymbol` | Identificateur de symbole de la classe `Optional` |
| `SemanticSymbol` | Identificateur de symbole de la classe `Semantic` |
| `CollectorsSymbol` | Identificateur de symbole de la classe `Collector` |
| `CollectableSymbol` | Identificateur de symbole de la classe `Collectable` |
| `OrderedCollectableSymbol` | Identificateur de symbole de la classe `OrderedCollectable` |
| `WindowCollectableSymbol` | Identificateur de symbole de la classe `WindowCollectable` |
| `StatisticsSymbol` | Identificateur de symbole de la classe `Statistics` |
| `NumericStatisticsSymbol` | Identificateur de symbole de la classe `NumericStatistics` |
| `BigIntStatisticsSymbol` | Identificateur de symbole de la classe `BigIntStatistics` |
| `UnorderedCollectableSymbol` | Identificateur de symbole de la classe `UnorderedCollectable` |

## Interfaces fonctionnelles

| Interface | Description |
|-----------|-------------|
| `Runnable` | Fonction sans paramètres et sans valeur de retour |  
| `Supplier<R>` | Fonction sans paramètres retournant `R` |  
| `Functional<T, R>` | Fonction de transformation à un seul paramètre |
| `BiFunctional<T, U, R>` | Fonction de transformation à deux paramètres |
| `TriFunctional<T, U, V, R>` | Fonction de transformation à trois paramètres |
| `Predicate<T>` | Fonction de prédicat à un seul paramètre |
| `BiPredicate<T, U>` | Fonction de prédicat à deux paramètres |
| `TriPredicate<T, U, V>` | Fonction de prédicat à trois paramètres |
| `Consumer<T>` | Fonction de consommateur à un seul paramètre |
| `BiConsumer<T, U>` | Fonction de consommateur à deux paramètres |
| `TriConsumer<T, U, V>` | Fonction de consommateur à trois paramètres |
| `Comparator<T>` | Fonction de comparaison à deux paramètres |
| `Generator<T>` | Fonction génératrice (noyau et base) |

```typescript
// Exemples d'utilisation des types
let predicate: Predicate<number> = (n: number): boolean => n > 0;
let mapper: Functional<string, number> = (text: string): number => text.length;
let comparator: Comparator<number> = (a: number, b: number): number => a - b;
```

## Gardiens de type

| Fonction | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Vérifie que la valeur n'est pas null ou undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Vérifie que la valeur est null ou undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Vérifie si c'est un booléen | O(1) | O(1) |
| `isString(t: unknown): t is string` | Vérifie si c'est une chaîne | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Vérifie si c'est un nombre | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Vérifie si c'est une fonction | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Vérifie si c'est un objet | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Vérifie si c'est un symbole | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Vérifie si c'est un BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Vérifie si c'est un type primitif | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Vérifie si c'est un objet itérable | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Vérifie si c'est une instance d'Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Vérifie si c'est une instance de Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Vérifie si c'est une instance de Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Vérifie si c'est une instance de Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Vérifie si c'est une instance de OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Vérifie si c'est une instance de WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Vérifie si c'est une instance de UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Vérifie si c'est une instance de Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Vérifie si c'est une instance de NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Vérifie si c'est une instance de BigIntStatistics | O(1) | O(1) |
| `isPromise(t: unknown): t is Promise<unknown>` | Vérifie si c'est un objet Promise | O(1) | O(1) |
| `isAsync(t: unknown): t is AsyncFunction` | Vérifie si c'est une AsyncFunction | O(1) | O(1) |

```typescript
// Exemples d'utilisation des gardiens de type
let value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Sécurité de type, value est inféré comme une chaîne
}

if (isOptional(someValue)) {
    someValue.ifPresent((value): void => console.log(val));
}

if(isIterable(value)){
    // Sécurité de type, maintenant c'est un objet itérable.
    for(let item of value){
        console.log(item);
    }
}
```

## Fonctions utilitaires

| Fonction | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `useCompare<T>(t1: T, t2: T): number` | Fonction de comparaison générique | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Générateur de nombres pseudo-aléatoires | O(log n) | O(1) |

```typescript
// Exemples d'utilisation des fonctions utilitaires
let numbers: Array<number> = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

let randomNum = useRandom(42); // Nombre aléatoire basé sur une graine
```

## Méthodes de fabrique

### Méthodes de fabrique d'Optional

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `Optional.empty<T>()` | Crée un Optional vide | O(1) | O(1) |
| `Optional.of<T>(value)` | Crée un Optional contenant une valeur | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Crée un Optional potentiellement vide | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Crée un Optional non vide | O(1) | O(1) |

```typescript
// Exemples d'utilisation d'Optional
let emptyOpt: Optional<number> = Optional.empty();
let presentOpt: Optional<number> = Optional.of(42);
let nullableOpt: Optional<string> = Optional.ofNullable<string>(null);
let nonNullOpt: Optional<string> = Optional.ofNonNull("hello");

presentOpt.ifPresent((value: number): void => console.log(value)); // Affiche 42
console.log(emptyOpt.get(100)); // Affiche 100
```

### Méthodes de fabrique de Collector

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `Collector.full(identity, accumulator, finisher)` | Crée un Collector complet | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Crée un Collector interruptible | O(1) | O(1) |

```typescript
// Exemples de conversion de Collector
let numbers: Semantic<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Priorité de performance : utilisez un Collector non ordonné pour obtenir la meilleure performance
let unordered: UnorderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .filter((n: number): boolean => n > 3)
    .toUnordered(); // Meilleure performance

// Tri nécessaire : utilisez un Collector ordonné
let ordered: OrderedCollectable<number> = from([3, 1, 4, 1, 5, 9, 2, 6, 5])
    .sorted();

// Compte le nombre d'éléments
let count: Collector<number, number, number> = Collector.full(
    (): number => 0, // Valeur initiale
    (accumulator: number, element: number): number => accumulator + element, // Accumuler
    (accumulator: number): number => accumulator // Terminer
);
count.collect(from([1,2,3,4,5])); // Compte depuis un flux
count.collect([1,2,3,4,5]); // Compte depuis un objet itérable

let find: Optional<number> = Collector.shortable(
    (): Optional<number> => Optional.empty(), // Valeur initiale
    (element: number, index: bigint, accumulator: Optional<number>): Optional<number> => accumulator.isPresent(), // Interruption
    (accumulator: Optional<number>, element: number, index: bigint): Optional<number> => Optional.of(element), // Accumuler
    (accumulator: Optional<number>): Optional<number> => accumulator // Terminer
);
find.collect(from([1,2,3,4,5])); // Trouve le premier élément
find.collect([1,2,3,4,5]); // Trouve le premier élément
```

### Méthodes de fabrique de Semantic

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `animationFrame(period: number, delay: number = 0)` | Crée un flux de trames d'animation basé sur le temps | O(1)* | O(1) |
| `blob(blob, chunkSize)` | Crée un flux à partir d'un Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Crée un flux vide | O(1) | O(1) |
| `fill<E>(element, count)` | Crée un flux rempli | O(n) | O(1) |
| `from<E>(iterable)` | Crée un flux à partir d'un objet itérable | O(1) | O(1) |
| `interval(period, delay?)` | Crée un flux d'intervalle de temps | O(1)* | O(1) |
| `iterate<E>(generator)` | Crée un flux à partir d'un générateur | O(1) | O(1) |
| `range(start, end, step)` | Crée un flux de plage numérique | O(n) | O(1) |
| `websocket(websocket)` | Crée un flux à partir d'un WebSocket | O(1) | O(1) |

```typescript
// Exemples de méthodes de fabrique de Semantic

// Crée un flux à partir d'un Blob (lecture par morceaux)
blob(someBlob, 1024n)
    .toUnordered()
    .write(WritableStream)
    .then(callback) // Écriture du flux réussie
    .catch(callback); // Échec de l'écriture du flux

// Crée un flux vide, ne sera exécuté qu'une fois concaténé avec d'autres flux
empty<string>()
    .toUnordered()
    .join(); // []

// Crée un flux rempli
let filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Crée un flux d'intervalle avec un délai initial de 2 secondes et une période d'exécution de 5 secondes, implémenté sur un mécanisme de minuterie ; peut subir un décalage temporel en raison des limites de précision de la planification système.
let intervalStream = interval(5000, 2000);

// Crée un flux à partir d'un objet itérable
let numberStream = from([1, 2, 3, 4, 5]);
let stringStream = from(new Set(["Alex", "Bob"]));

// Crée un flux de plage
let rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Flux d'événements WebSocket
let ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event): boolean => event.type === "message") // Écoute uniquement les événements de message
  .toUnordered() // Les événements sont généralement non ordonnés
  .forEach((event): void => receive(event)); // Réception des messages
```

## Méthodes de classe Semantic

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `concat(other)` | Concatène deux flux | O(n) | O(1) |
| `distinct()` | Supprime les doublons | O(n) | O(n) |
| `distinct(comparator)` | Supprime les doublons en utilisant un comparateur | O(n²) | O(n) |
| `dropWhile(predicate)` | Abandonne les éléments satisfaisant la condition | O(n) | O(1) |
| `filter(predicate)` | Filtre les éléments | O(n) | O(1) |
| `flat(mapper)` | Aplatissement de la carte | O(n × m) | O(1) |
| `flatMap(mapper)` | Aplatissement de la carte vers un nouveau type | O(n × m) | O(1) |
| `limit(n)` | Limite le nombre d'éléments | O(n) | O(1) |
| `map(mapper)` | Transformation de la carte | O(n) | O(1) |
| `peek(consumer)` | Jeter un œil aux éléments | O(n) | O(1) |
| `redirect(redirector)` | Rediriger l'index | O(n) | O(1) |
| `reverse()` | Inverse le flux | O(n) | O(1) |
| `shuffle()` | Mélange aléatoirement | O(n) | O(1) |
| `shuffle(mapper)` | Mélange en utilisant un mappeur | O(n) | O(1) |
| `skip(n)` | Ignore les n premiers éléments | O(n) | O(1) |
| `sorted()` | Trie | O(n log n) | O(n) |
| `sorted(comparator)` | Trie en utilisant un comparateur | O(n log n) | O(n) |
| `sub(start, end)` | Obtient un sous-flux | O(n) | O(1) |
| `takeWhile(predicate)` | Prend les éléments satisfaisant la condition | O(n) | O(1) |
| `translate(offset)` | Traduire l'index | O(n) | O(1) |
| `translate(translator)` | Traduire l'index à l'aide d'un traducteur | O(n) | O(1) |

```typescript
// Exemples d'opérations Semantic
let result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0) // Filtre les nombres pairs
    .map((n: number): number => n * 2) // Multiplie par 2
    .skip(1) // Ignore le premier
    .limit(3) // Limite à 3 éléments
    .toUnordered() // Convertit en collecteur non ordonné
    .toArray(); // Convertit en tableau
// Résultat: [8, 12, 20]

// Exemple d'opération complexe
let complexResult = range(1, 100, 1)
    .flatMap((n: number): Semantics<number> => from([n, n * 2])) // Mappe chaque élément à deux
    .distinct() // Supprime les doublons
    .shuffle() // Mélange l'ordre
    .takeWhile((n: number): boolean => n < 50) // Prend les éléments inférieurs à 50
    .toOrdered() // Convertit en collecteur ordonné
    .toArray(); // Convertit en tableau
```

## Méthodes de conversion Semantic

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------------|------------|------------|------------|
| `sorted()` | Convertit en collecteur ordonné | O(n log n) | O(n) |
| `toUnordered()` | Convertit en collecteur non ordonné | O(1) | O(1) |
| `toOrdered()` | Convertit en collecteur ordonné | O(1) | O(1) |
| `toNumericStatistics()` | Convertit en statistiques numériques | O(n) | O(1) |
| `toBigintStatistics()` | Convertit en statistiques BigInt | O(n) | O(1) |
| `toWindow()` | Convertit en collecteur de fenêtre | O(1) | O(1) |
| `toCollectable()` | Convertit en `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Convertit en collecteur personnalisé | O(n) | O(1) |

```typescript
// Convertit en un tableau trié ascendant
from([6, 4, 3, 5, 2]) // Crée un flux
    .sorted() // Trie le flux dans l'ordre croissant
    .toArray(); // [2, 3, 4, 5, 6]

// Convertit en un tableau trié décroissant
from([6, 4, 3, 5, 2]) // Crée un flux
    .soted((a: number, b: number): number => b - a) // Trie le flux dans l'ordre décroissant
    .toArray(); // [6, 5, 4, 3, 2]

// Redirige vers un tableau inversé
from([6, 4, 3, 5, 2])
    .redirect((element, index): bigint => -index) // Redirige vers l'ordre inverse
    .toOrderd() // Garde l'ordre redirigé
    .toArray(); // [2, 5, 3, 4, 6]

// Ignore les redirections pour inverser le tableau
from([6, 4, 3, 5, 2])
    .redirect((element, index): bigint => -index) // Redirige vers l'ordre inverse
    .toUnorderd() // Ignore l'ordre redirigé. Cette opération ignorera `redirect`, `reverse`, `shuffle` et `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Inverse le flux dans un tableau
from([6, 4, 3, 5, 2])
    .reverse() // Inverse le flux
    .toOrdered() // Garantit l'ordre inversé
    .toArray(); // [2, 5, 3, 4, 6]

// Remplace le flux mélangé dans un tableau
from([6, 4, 3, 5, 2])
    .shuffle() // Mélange le flux
    .sorted() // Remplace l'ordre mélangé. Cette opération écrasera `redirect`, `reverse`, `shuffle` et `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Convertit en collecteur de fenêtre
from([6, 4, 3, 5, 2])
    .toWindow();

// Convertit en statistiques numériques
from([6, 4, 3, 5, 2])
    .toNumericStatistics();

// Convertit en statistiques BigInt
from([6n, 4n, 3n, 5n, 2n])
    .toBigintStatistics();

// Définit un collecteur personnalisé pour collecter des données
let customizedCollector = from([1, 2, 3, 4, 5])
    .toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Méthodes de collection Collectable

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `anyMatch(predicate)` | Si un élément quelconque correspond | O(n) | O(1) |
| `allMatch(predicate)` | Si tous les éléments correspondent | O(n) | O(1) |
| `count()` | Comptage des éléments | O(n) | O(1) |
| `isEmpty()` | Si c'est vide | O(1) | O(1) |
| `findAny()` | Trouve n'importe quel élément | O(n) | O(1) |
| `findFirst()` | Trouve le premier élément | O(n) | O(1) |
| `findLast()` | Trouve le dernier élément | O(n) | O(1) |
| `forEach(action)` | Itère sur tous les éléments | O(n) | O(1) |
| `group(classifier)` | Regroupe par classifieur | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Regroupe par extracteurs de clé-valeur | O(n) | O(n) |
| `join()` | Jointure en tant que chaîne | O(n) | O(n) |
| `join(delimiter)` | Jointure en utilisant un délimiteur | O(n) | O(n) |
| `nonMatch(predicate)` | Si aucun élément ne correspond | O(n) | O(1) |
| `partition(count)` | Partitionne par nombre | O(n) | O(n) |
| `partitionBy(classifier)` | Partitionne par classifieur | O(n) | O(n) |
| `reduce(accumulator)` | Opération de réduction | O(n) | O(1) |
| `reduce(identity, accumulator)` | Réduction avec valeur initiale | O(n) | O(1) |
| `toArray()` | Convertit en tableau | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convertit en Map | O(n) | O(n) |
| `toSet()` | Convertit en Set | O(n) | O(n) |
| `write(stream)` | Écrit dans le flux | O(n) | O(1) |

```typescript
// Exemples d'opérations Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter((n: number): boolean => n % 2 === 0)
    .toOrdered();

// Vérifications de correspondance
console.log(data.anyMatch((n: number): boolean => n > 5)); // true
console.log(data.allMatch((n: number): boolean => n < 20)); // true

// Opérations de recherche
data.findFirst().ifPresent((n: number): void => console.log(n)); // 2
data.findAny().ifPresent((n: number): void => console.log(n)); // N'importe quel élément

// Opérations de regroupement
const grouped = data.groupBy(
    (n: number): string => (n > 5 ? "grand" : "petit"),
    (n: number): number => n * 2
); // {petit: [4, 8], grand: [12, 16, 20]}

// Opérations de réduction
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Opérations de sortie
data.join(", "); // "[2, 4, 6, 8, 10]"
```

## Méthodes d'analyse statistique

### Méthodes de NumericStatistics

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------|------|------------|------------|
| `range()` | Plage | O(n) | O(1) |
| `variance()` | Variance | O(n) | O(1) |
| `standardDeviation()` | Écart-type | O(n) | O(1) |
| `mean()` | Moyenne | O(n) | O(1) |
| `median()` | Médiane | O(n log n) | O(n) |
| `mode()` | Mode | O(n) | O(n) |
| `frequency()` | Distribution de fréquence | O(n) | O(n) |
| `summate()` | Somme | O(n) | O(1) |
| `quantile(quantile)` | Quantile | O(n log n) | O(n) |
| `interquartileRange()` | Intervalle interquartile | O(n log n) | O(n) |
| `skewness()` | Asymétrie | O(n) | O(1) |
| `kurtosis()` | Curtosis | O(n) | O(1) |

```typescript
// Exemples d'analyse statistique
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Moyenne:", numbers.mean()); // 5.5
console.log("Médiane:", numbers.median()); // 5.5
console.log("Écart-type:", numbers.standardDeviation()); // ~2.87
console.log("Somme:", numbers.summate()); // 55

// Analyse statistique utilisant des mappers
const objects = from([
    { value: 10 },
    { value: 20 },
    { value: 30 }
]).toNumericStatistics();
console.log("Moyenne mappée:", objects.mean(obj => obj.value)); // 20
```

## Guide de sélection des performances

### Choisissez un collecteur non ordonné (performance prioritaire)

```typescript
// Lorsque la garantie d'ordre n'est pas nécessaire, utilisez un collecteur non ordonné pour obtenir la meilleure performance
let highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnordered(); // Meilleure performance
```

### Choisissez un collecteur ordonné (ordre requis)

```typescript
// Lorsque l'ordre des éléments doit être maintenu, utilisez un collecteur ordonné
let ordered = data.sorted(comparator);
```

### Choisissez un collecteur de fenêtre (opérations de fenêtre)

```typescript
// Lorsque des opérations de fenêtre sont nécessaires
let windowed: WindowCollectable<number> = data
    .toWindow()
    .slide(5n, 2n); // Fenêtre coulissante
```

### Choisissez une analyse statistique (calculs numériques)

```typescript
// Lorsqu'une analyse statistique est nécessaire
let statistics: NumericStatistics<number> = data
    .toNumericStatistics(); // Statistiques numériques

let bigIntStatistics: BigintStatistics<bigint> = data
    .toBigintStatistics(); // Statistiques BigInt
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Notes importantes

1. **Impact des opérations de tri**: Dans les collecteurs ordonnés, l'opération `sorted()` remplace les effets de `redirect`, `translate`, `shuffle`, `reverse`.
2. **Considérations de performance**: Si la garantie d'ordre n'est pas nécessaire, privilégiez l'utilisation de `toUnordered()` pour une meilleure performance.
3. **Utilisation de la mémoire**: Les opérations de tri nécessitent un espace supplémentaire de O(n).
4. **Données en temps réel**: Les flux Semantic conviennent pour le traitement de données en temps réel et prennent en charge les sources de données asynchrones.

Cette bibliothèque offre aux développeurs TypeScript des capacités de streaming puissantes et flexibles, combinant les avantages de la programmation fonctionnelle avec des garanties de sécurité de types.
