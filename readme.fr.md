# Bibliothèque de Traitement de Flux Semantic-TypeScript

## Introduction

Semantic-TypeScript est une bibliothèque moderne de traitement de flux inspirée par JavaScript GeneratorFunction, Java Stream et MySQL Index. La conception centrale de la bibliothèque repose sur la construction de pipelines efficaces de traitement de données utilisant des index de données, offrant aux développeurs frontend une expérience de traitement de flux avec sécurité de type et style fonctionnel.

Contrairement au traitement synchrone traditionnel, Semantic adopte un mode de traitement asynchrone. Lors de la création de flux de données, le moment où le terminal reçoit les données dépend entièrement du moment où la source en amont appelle les fonctions de callback `accept` et `interrupt`. Cette conception permet à la bibliothèque de gérer élégamment les flux de données en temps réel, les grands ensembles de données et les sources de données asynchrones.

## Installation

```bash
npm install semantic-typescript
```

## Types de base

| Type | Description |
|------|-------------|
| `Invalid<T>` | Type étendant `null` ou `undefined` |
| `Valid<T>` | Type excluant `null` et `undefined` |
| `MaybeInvalid<T>` | Type pouvant être `null` ou `undefined` |
| `Primitive` | Ensemble des types primitifs |
| `MaybePrimitive<T>` | Type pouvant être un type primitif |
| `OptionalSymbol` | Symbole identifiant de la classe `Optional` |
| `SemanticSymbol` | Symbole identifiant de la classe `Semantic` |
| `CollectorsSymbol` | Symbole identifiant de la classe `Collector` |
| `CollectableSymbol` | Symbole identifiant de la classe `Collectable` |
| `OrderedCollectableSymbol` | Symbole identifiant de la classe `OrderedCollectable` |
| `WindowCollectableSymbol` | Symbole identifiant de la classe `WindowCollectable` |
| `StatisticsSymbol` | Symbole identifiant de la classe `Statistics` |
| `NumericStatisticsSymbol` | Symbole identifiant de la classe `NumericStatistics` |
| `BigIntStatisticsSymbol` | Symbole identifiant de la classe `BigIntStatistics` |
| `UnorderedCollectableSymbol` | Symbole identifiant de la classe `UnorderedCollectable` |

## Interfaces fonctionnelles

| Interface | Description |
|-----------|-------------|
| `Runnable` | Fonction sans paramètre ni valeur de retour |  
| `Supplier<R>` | Fonction sans paramètre retournant `R` |  
| `Functional<T, R>` | Fonction de transformation à un seul paramètre |
| `BiFunctional<T, U, R>` | Fonction de transformation à deux paramètres |
| `TriFunctional<T, U, V, R>` | Fonction de transformation à trois paramètres |
| `Predicate<T>` | Fonction de prédicat à un seul paramètre |
| `BiPredicate<T, U>` | Fonction de prédicat à deux paramètres |
| `TriPredicate<T, U, V>` | Fonction de prédicat à trois paramètres |
| `Consumer<T>` | Fonction de consommation à un seul paramètre |
| `BiConsumer<T, U>` | Fonction de consommation à deux paramètres |
| `TriConsumer<T, U, V>` | Fonction de consommation à trois paramètres |
| `Comparator<T>` | Fonction de comparaison à deux paramètres |
| `Generator<T>` | Fonction génératrice (noyau et base) |

```typescript
// Exemples d'utilisation des types
const predicate: Predicate<number> = (n) => n > 0;
const mapper: Functional<string, number> = (str) => str.length;
const comparator: Comparator<number> = (a, b) => a - b;
```

## Gardes de Type

| Fonction | Description | Complexité Temporelle | Complexité Spatiale |
|----------|-------------|----------------------|---------------------|
| `validate<T>(t: MaybeInvalid<T>): t is T` | Valide que la valeur n'est pas null ou undefined | O(1) | O(1) |
| `invalidate<T>(t: MaybeInvalid<T>): t is null \| undefined` | Valide que la valeur est null ou undefined | O(1) | O(1) |
| `isBoolean(t: unknown): t is boolean` | Vérifie si c'est un booléen | O(1) | O(1) |
| `isString(t: unknown): t is string` | Vérifie si c'est une chaîne | O(1) | O(1) |
| `isNumber(t: unknown): t is number` | Vérifie si c'est un nombre | O(1) | O(1) |
| `isFunction(t: unknown): t is Function` | Vérifie si c'est une fonction | O(1) | O(1) |
| `isObject(t: unknown): t is object` | Vérifie si c'est un objet | O(1) | O(1) |
| `isSymbol(t: unknown): t is symbol` | Vérifie si c'est un symbole | O(1) | O(1) |
| `isBigint(t: unknown): t is bigint` | Vérifie si c'est un BigInt | O(1) | O(1) |
| `isPrimitive(t: unknown): t is Primitive` | Vérifie si c'est un type primitif | O(1) | O(1) |
| `isIterable(t: unknown): t is Iterable<unknown>` | Vérifie si c'est itérable | O(1) | O(1) |
| `isOptional(t: unknown): t is Optional<unknown>` | Vérifie si c'est une instance d'Optional | O(1) | O(1) |
| `isSemantic(t: unknown): t is Semantic<unknown>` | Vérifie si c'est une instance de Semantic | O(1) | O(1) |
| `isCollector(t: unknown): t is Collector<unknown, unknown, unknown>` | Vérifie si c'est une instance de Collector | O(1) | O(1) |
| `isCollectable(t: unknown): t is Collectable<unknown>` | Vérifie si c'est une instance de Collectable | O(1) | O(1) |
| `isOrderedCollectable(t: unknown): t is OrderedCollectable<unknown>` | Vérifie si c'est une instance d'OrderedCollectable | O(1) | O(1) |
| `isWindowCollectable(t: unknown): t is WindowCollectable<unknown>` | Vérifie si c'est une instance de WindowCollectable | O(1) | O(1) |
| `isUnorderedCollectable(t: unknown): t is UnorderedCollectable<unknown>` | Vérifie si c'est une instance d'UnorderedCollectable | O(1) | O(1) |
| `isStatistics(t: unknown): t is Statistics<unknown, number \| bigint>` | Vérifie si c'est une instance de Statistics | O(1) | O(1) |
| `isNumericStatistics(t: unknown): t is NumericStatistics<unknown>` | Vérifie si c'est une instance de NumericStatistics | O(1) | O(1) |
| `isBigIntStatistics(t: unknown): t is BigIntStatistics<unknown>` | Vérifie si c'est une instance de BigIntStatistics | O(1) | O(1) |

```typescript
// Exemples d'utilisation des gardes de type
const value: unknown = "hello";

if (isString(value)) {
    console.log(value.length); // Sécurité de type, value est inféré comme string
}

if (isOptional(someValue)) {
    someValue.ifPresent(val => console.log(val));
}
```

## Fonctions Utilitaires

| Fonction | Description | Complexité Temporelle | Complexité Spatiale |
|----------|-------------|----------------------|---------------------|
| `useCompare<T>(t1: T, t2: T): number` | Fonction de comparaison universelle | O(1) | O(1) |
| `useRandom<T = number \| bigint>(index: T): T` | Générateur de nombres pseudo-aléatoires | O(log n) | O(1) |

```typescript
// Exemples d'utilisation des fonctions utilitaires
const numbers = [3, 1, 4, 1, 5];
numbers.sort(useCompare); // [1, 1, 3, 4, 5]

const randomNum = useRandom(42); // Nombre aléatoire basé sur seed
const randomBigInt = useRandom(1000n); // Nombre BigInt aléatoire
```

## Méthodes d'Usine

### Méthodes d'Usine d'Optional

| Méthode | Description | Complexité Temporelle | Complexité Spatiale |
|---------|-------------|----------------------|---------------------|
| `Optional.empty<T>()` | Crée un Optional vide | O(1) | O(1) |
| `Optional.of<T>(value)` | Crée un Optional avec valeur | O(1) | O(1) |
| `Optional.ofNullable<T>(value)` | Crée un Optional pouvant être null | O(1) | O(1) |
| `Optional.ofNonNull<T>(value)` | Crée un Optional non null | O(1) | O(1) |

```typescript
// Exemples d'utilisation d'Optional
const emptyOpt = Optional.empty<number>();
const presentOpt = Optional.of(42);
const nullableOpt = Optional.ofNullable<string>(null);
const nonNullOpt = Optional.ofNonNull("hello");

presentOpt.ifPresent(val => console.log(val)); // Affiche 42
console.log(emptyOpt.orElse(100)); // Affiche 100
```

### Méthodes d'Usine de Collector

| Méthode | Description | Complexité Temporelle | Complexité Spatiale |
|---------|-------------|----------------------|---------------------|
| `Collector.full(identity, accumulator, finisher)` | Crée un collecteur complet | O(1) | O(1) |
| `Collector.shortable(identity, interruptor, accumulator, finisher)` | Crée un collecteur interruptible | O(1) | O(1) |

```typescript
// Exemples de conversion de collecteurs
const numbers = from([3, 1, 4, 1, 5, 9, 2, 6, 5]);

// Priorité à la performance : utiliser un collecteur non ordonné
const unordered = numbers
    .filter(n => n > 3)
    .toUnoredered();

// Besoin de tri : utiliser un collecteur ordonné  
const ordered = numbers.sorted();

// Compte le nombre d'éléments
let count = Collector.full(
    () => 0, // Valeur initiale
    (accumulator, element) => accumulator + element, // Accumuler
    (accumulator) => accumulator // Terminer
);
count.collect(from([1,2,3,4,5])); // Compte depuis un flux
count.collect([1,2,3,4,5]); // Compte depuis un objet itérable

let find = Collector.shortable(
    () => Optional.empty(), // Valeur initiale
    (element, index, accumulator) => accumulator.isPresent(), // Interrompre
    (accumulator, element, index) => Optional.of(element), // Accumuler
    (accumulator) => accumulator // Terminer
);
find.collect(from([1,2,3,4,5])); // Trouve le premier élément
find.collect([1,2,3,4,5]); // Trouve le premier élément
```

### Méthodes d'usine de Semantic

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|---------|-------------|----------------------|----------------------|
| `blob(blob, chunkSize)` | Crée un flux depuis un Blob | O(n) | O(chunkSize) |
| `empty<E>()` | Crée un flux vide | O(1) | O(1) |
| `fill<E>(element, count)` | Crée un flux rempli | O(n) | O(1) |
| `from<E>(iterable)` | Crée un flux depuis un objet itérable | O(1) | O(1) |
| `generate<E>(element, interrupt)` | Crée un flux générateur | O(1) | O(1) |
| `interval(period, delay?)` | Crée un flux d'intervalle régulier | O(1)* | O(1) |
| `iterate<E>(generator)` | Crée un flux depuis un générateur | O(1) | O(1) |
| `range(start, end, step)` | Crée un flux de plage numérique | O(n) | O(1) |
| `websocket(websocket)` | Crée un flux depuis un WebSocket | O(1) | O(1) |

```typescript
// Exemple d'utilisation des méthodes d'usine de Semantic

// Créer un flux depuis un Blob (lecture par blocs)
blob(someBlob, 1024n)
  .toUnordered()
  .write(WritableStream)
  .then(callback) // Écriture de flux réussie
  .catch(writeFi); // Échec de l'écriture de flux

// Créer un flux vide qui ne s'exécutera qu'après concaténation avec d'autres flux
empty<string>()
  .toUnordered()
  .join(); //[]

// Créer un flux rempli
const filledStream = fill("hello", 3); // "hello", "hello", "hello"

// Créer un flux temporel avec délai initial de 2 secondes et cycle de 5 secondes,
// implémenté via un mécanisme de temporisation, dérives temporelles possibles
// dues aux limitations de planification du système.
const intervalStream = interval(5000, 2000);

// Créer un flux depuis un objet itérable
const numberStream = from([1, 2, 3, 4, 5]);
const stringStream = from(new Set(["Alex", "Bob"]));

// Créer un flux de plage
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Flux d'événements WebSocket
const ws = new WebSocket("ws://localhost:8080");
websocket(ws)
  .filter((event)=> event.type === "message") // Surveiller uniquement les événements de message
  .toUnordered() // Pour les événements généralement non triés
  .forEach((event)=> receive(event)); // Recevoir les messages
```

## Méthodes de Classe Semantic

| Méthode | Description | Complexité Temporelle | Complexité Spatiale |
|---------|-------------|----------------------|---------------------|
| `concat(other)` | Concatène deux flux | O(n) | O(1) |
| `distinct()` | Supprime les doublons | O(n) | O(n) |
| `distinct(comparator)` | Supprime les doublons avec comparateur | O(n²) | O(n) |
| `dropWhile(predicate)` | Ignore les éléments satisfaisant le prédicat | O(n) | O(1) |
| `filter(predicate)` | Filtre les éléments | O(n) | O(1) |
| `flat(mapper)` | Aplatissement de mapping | O(n × m) | O(1) |
| `flatMap(mapper)` | Aplatissement vers nouveau type | O(n × m) | O(1) |
| `limit(n)` | Limite le nombre d'éléments | O(n) | O(1) |
| `map(mapper)` | Transformation par mapping | O(n) | O(1) |
| `peek(consumer)` | Inspecte les éléments | O(n) | O(1) |
| `redirect(redirector)` | Redirection d'index | O(n) | O(1) |
| `reverse()` | Inverse le flux | O(n) | O(1) |
| `shuffle()` | Mélange aléatoire | O(n) | O(1) |
| `shuffle(mapper)` | Mélange avec mapper | O(n) | O(1) |
| `skip(n)` | Saute les n premiers éléments | O(n) | O(1) |
| `sorted()` | Trie | O(n log n) | O(n) |
| `sorted(comparator)` | Trie avec comparateur | O(n log n) | O(n) |
| `sub(start, end)` | Obtient un sous-flux | O(n) | O(1) |
| `takeWhile(predicate)` | Prend les éléments satisfaisant le prédicat | O(n) | O(1) |
| `translate(offset)` | Translation d'index | O(n) | O(1) |
| `translate(translator)` | Translation avec traducteur | O(n) | O(1) |

```typescript
// Exemples d'opérations Semantic
const result = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)        // Filtre les nombres pairs
    .map(n => n * 2)                 // Multiplie par 2
    .skip(1)                         // Saute le premier
    .limit(3)                        // Limite à 3 éléments
    .toUnordered()                    // Convertit en collecteur non ordonné
    .toArray();                      // Convertit en tableau
// Résultat: [8, 12, 20]

// Exemple d'opération complexe
const complexResult = range(1, 100, 1)
    .flatMap(n => from([n, n * 2])) // Map chaque élément vers deux éléments
    .distinct()                      // Supprime les doublons
    .shuffle()                       // Mélange aléatoirement
    .takeWhile(n => n < 50)         // Prend les éléments < 50
    .toOrdered()                     // Convertit en collecteur ordonné
    .toArray();                      // Convertit en tableau
```

## Méthodes de conversion sémantique

| Méthode | Description | Complexité temporelle | Complexité spatiale |
|------------|------------|------------|------------|
| `sorted()` | Convertir en collecteur ordonné | O(n log n) | O(n) |
| `toUnordered()` | Convertir en collecteur non ordonné | O(1) | O(1) |
| `toOrdered()` | Convertir en collecteur ordonné | O(1) | O(1) |
| `toNumericStatistics()` | Convertir en statistiques numériques | O(n) | O(1) |
| `toBigintStatistics()` | Convertir en statistiques bigint | O(n) | O(1) |
| `toWindow()` | Convertir en collecteur de fenêtres | O(1) | O(1) |
| `toCollectable()` | Convertir en `UnorderdCollectable` | O(n) | O(1) |
| `toCollectable(mapper)` | Convertir en collectable personnalisé | O(n) | O(1) |

```typescript
// Convertir en tableau trié par ordre croissant
from([6,4,3,5,2]) // Crée un flux
    .sorted() // Trie le flux par ordre croissant
    .toArray(); // [2, 3, 4, 5, 6]

// Convertir en tableau trié par ordre décroissant
from([6,4,3,5,2]) // Crée un flux
    .soted((a, b) => b - a) // Trie le flux par ordre décroissant
    .toArray(); // [6, 5, 4, 3, 2]

// Rediriger vers un tableau inversé
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Redirige en ordre inversé
    .toOrderd() // Conserve l’ordre redirigé
    .toArray(); // [2, 5, 3, 4, 6]

// Ignorer les redirections pour inverser le tableau
from([6,4,3,5,2])
    .redirect((element, index) => -index) // Redirige en ordre inversé
    .toUnorderd() // Supprime l’ordre redirigé. Cette opération ignore les opérations `redirect`, `reverse`, `shuffle` et `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Inverser le flux en tableau
from([6, 4, 3, 5, 2])
    .reverse() // Inverse le flux
    .toOrdered() // Garantit l’ordre inversé
    .toArray(); // [2, 5, 3, 4, 6]

// Écraser le flux mélangé dans un tableau
from([6, 4, 3, 5, 2])
    .shuffle() // Mélange le flux
    .sorted() // Écrase l’ordre mélangé. Cette opération écrase les opérations `redirect`, `reverse`, `shuffle` et `translate`
    .toArray(); // [2, 5, 3, 4, 6]

// Convertir en collecteur de fenêtres
from([6, 4, 3, 5, 2]).toWindow();

// Convertir en statistiques numériques
from([6, 4, 3, 5, 2]).toNumericStatistics();

// Convertir en statistiques bigint
from([6n, 4n, 3n, 5n, 2n]).toBigintStatistics();

// Définit un collecteur personnalisé pour collecter les données
let customizedCollector = from([1, 2, 3, 4, 5]).toCollectable((generator: Generator<E>) => new CustomizedCollector(generator));
```

## Méthodes de Collecte de Collectable

| Méthode | Description | Complexité Temporelle | Complexité Spatiale |
|---------|-------------|----------------------|---------------------|
| `anyMatch(predicate)` | Vérifie s'il existe une correspondance | O(n) | O(1) |
| `allMatch(predicate)` | Vérifie si tous correspondent | O(n) | O(1) |
| `count()` | Compte les éléments | O(n) | O(1) |
| `isEmpty()` | Vérifie si vide | O(1) | O(1) |
| `findAny()` | Trouve n'importe quel élément | O(n) | O(1) |
| `findFirst()` | Trouve le premier élément | O(n) | O(1) |
| `findLast()` | Trouve le dernier élément | O(n) | O(1) |
| `forEach(action)` | Itère sur tous les éléments | O(n) | O(1) |
| `group(classifier)` | Groupe par classificateur | O(n) | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | Groupe par extracteurs clé-valeur | O(n) | O(n) |
| `join()` | Joint en chaîne | O(n) | O(n) |
| `join(delimiter)` | Joint avec séparateur | O(n) | O(n) |
| `nonMatch(predicate)` | Vérifie s'il n'y a pas de correspondance | O(n) | O(1) |
| `partition(count)` | Partitionne par quantité | O(n) | O(n) |
| `partitionBy(classifier)` | Partitionne par classificateur | O(n) | O(n) |
| `reduce(accumulator)` | Opération de réduction | O(n) | O(1) |
| `reduce(identity, accumulator)` | Réduction avec valeur initiale | O(n) | O(1) |
| `toArray()` | Convertit en tableau | O(n) | O(n) |
| `toMap(keyExtractor, valueExtractor)` | Convertit en Map | O(n) | O(n) |
| `toSet()` | Convertit en Set | O(n) | O(n) |
| `write(stream)` | Écrit dans le flux | O(n) | O(1) |

```typescript
// Exemples d'opérations Collectable
const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .filter(n => n % 2 === 0)
    .toOrdered();

// Vérifications de correspondance
console.log(data.anyMatch(n => n > 5)); // true
console.log(data.allMatch(n => n < 20)); // true

// Opérations de recherche
data.findFirst().ifPresent(n => console.log(n)); // 2
data.findAny().ifPresent(n => console.log(n)); // Élément quelconque

// Opérations de groupement
const grouped = data.groupBy(
    n => n > 5 ? "large" : "small",
    n => n * 2
);
// {small: [4, 8], large: [12, 16, 20]}

// Opérations de réduction
const sum = data.reduce(0, (acc, n) => acc + n); // 30

// Opérations de sortie
data.join(", "); // "2, 4, 6, 8, 10"
```

## Méthodes d'Analyse Statistique

### Méthodes de NumericStatistics

| Méthode | Description | Complexité Temporelle | Complexité Spatiale |
|---------|-------------|----------------------|---------------------|
| `range()` | Plage | O(n) | O(1) |
| `variance()` | Variance | O(n) | O(1) |
| `standardDeviation()` | Écart-type | O(n) | O(1) |
| `mean()` | Moyenne | O(n) | O(1) |
| `median()` | Médiane | O(n log n) | O(n) |
| `mode()` | Mode | O(n) | O(n) |
| `frequency()` | Distribution de fréquence | O(n) | O(n) |
| `summate()` | Sommation | O(n) | O(1) |
| `quantile(quantile)` | Quantile | O(n log n) | O(n) |
| `interquartileRange()` | Intervalle interquartile | O(n log n) | O(n) |
| `skewness()` | Asymétrie | O(n) | O(1) |
| `kurtosis()` | Aplatissement | O(n) | O(1) |

```typescript
// Exemples d'analyse statistique
const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .toNumericStatistics();

console.log("Moyenne:", numbers.mean()); // 5.5
console.log("Médiane:", numbers.median()); // 5.5
console.log("Écart-type:", numbers.standardDeviation()); // ~2.87
console.log("Somme:", numbers.summate()); // 55

// Analyse statistique avec mapper
const objects = from([
    { value: 10 },
    { value: 20 }, 
    { value: 30 }
]).toNumericStatistics();

console.log("Moyenne mappée:", objects.mean(obj => obj.value)); // 20
```

## Guide de Sélection des Performances

### Sélectionner Collecteur Non Ordonné (Priorité Performance)
```typescript
// Quand aucune garantie d'ordre n'est nécessaire
const highPerformance = data
    .filter(predicate)
    .map(mapper)
    .toUnoredered(); // Meilleure performance
```

### Sélectionner Collecteur Ordonné (Nécessite un Ordre)
```typescript
// Quand l'ordre des éléments doit être préservé
const ordered = data
    .sorted(comparator) // Le tri écrase les effets de redirection
    .toOrdered(); // Maintient l'ordre
```

### Sélectionner Collecteur de Fenêtre (Opérations de Fenêtre)
```typescript
// Quand des opérations de fenêtre sont nécessaires
const windowed = data
    .toWindow()
    .slide(5n, 2n); // Fenêtre glissante
```

### Sélectionner Analyse Statistique (Calculs Numériques)
```typescript
// Quand une analyse statistique est nécessaire
const stats = data
    .toNumericStatistics(); // Statistiques numériques

const bigIntStats = data
    .toBigintStatistics(); // Statistiques BigInt
```

[GitHub](https://github.com/eloyhere/semantic-typescript)
[NPMJS](https://www.npmjs.com/package/semantic-typescript)

## Considérations Importantes

1. **Impact des opérations de tri**: Dans les collecteurs ordonnés, `sorted()` écrase les effets de `redirect`, `translate`, `shuffle`, `reverse`
2. **Considérations de performance**: Si aucune garantie d'ordre n'est nécessaire, prioriser `toUnoredered()` pour de meilleures performances
3. **Utilisation de la mémoire**: Les opérations de tri nécessitent un espace supplémentaire O(n)
4. **Données en temps réel**: Les flux Semantic sont idéaux pour les données en temps réel et prennent en charge les sources de données asynchrones

Cette bibliothèque offre aux développeurs TypeScript des capacités puissantes et flexibles de traitement de flux, combinant les avantages de la programmation fonctionnelle avec la sécurité de type.