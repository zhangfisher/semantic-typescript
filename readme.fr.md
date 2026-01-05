# Cadre de Traitement de Flux Semantic-TypeScript

## Introduction

Semantic-TypeScript est une bibliothèque moderne de traitement de flux inspirée par GeneratorFunction de JavaScript, Java Stream et MySQL Index. La philosophie de conception centrale repose sur la construction de pipelines efficaces de traitement de données grâce à l'indexation des données, offrant une expérience d'opération de flux de type fonctionnel et sécurisée par les types pour le développement frontend.

Contrairement au traitement synchrone traditionnel, Semantic utilise un modèle de traitement asynchrone. Lors de la création de flux de données, le moment de la réception des données terminales dépend entièrement du moment où l'amont appelle les fonctions de rappel `accept` et `interrupt`. Cette conception permet à la bibliothèque de gérer élégamment les flux de données en temps réel, les grands ensembles de données et les sources de données asynchrones.

## Caractéristiques Principales

| Caractéristique | Description | Avantage |
|------|------|------|
| **Génériques Type-Safe** | Support complet des types TypeScript | Détection d'erreurs à la compilation, meilleure expérience de développement |
| **Programmation Fonctionnelle** | Structures de données immuables et fonctions pures | Code plus prévisible, tests et maintenance plus faciles |
| **Évaluation Paresseuse** | Calcul à la demande, optimisation des performances | Haute efficacité mémoire lors du traitement de grands ensembles de données |
| **Traitement de Flux Asynchrone** | Flux de données asynchrones basés sur les générateurs | Adapté aux données en temps réel et scénarios pilotés par événements |
| **Collecteurs Multi-Paradigmes** | Stratégies de collecte ordonnées, non ordonnées, statistiques | Sélection de stratégie optimale basée sur différents scénarios |
| **Analyse Statistique** | Fonctions de calcul statistique complètes intégrées | Génération intégrée d'analyse de données et de rapports |

## Considérations de Performance

**Note Importante**: Les méthodes suivantes sacrifient les performances pour collecter et trier les données, entraînant des collections de données ordonnées:
- `toOrdered()`
- `toWindow()`
- `toNumericStatistics()`
- `toBigIntStatistics()`
- `sorted()`
- `sorted(comparator)`

Particulièrement important à noter: `sorted()` et `sorted(comparator)` écraseront les résultats des méthodes suivantes:
- `redirect(redirector)`
- `translate(translator)` 
- `shuffle(mapper)`

## Méthodes d'Usine

### Usines de Création de Flux

| Méthode | Signature | Description | Exemple |
|------|------|------|------|
| `blob` | `(blob: Blob, chunk?: bigint) => Semantic<Uint8Array>` | Convertir Blob en flux d'octets | `blob(fileBlob, 1024n)` |
| `empty` | `<E>() => Semantic<E>` | Créer un flux vide | `empty<number>()` |
| `fill` | `<E>(element: E, count: bigint) => Semantic<E>` | Remplir avec un nombre spécifié d'éléments | `fill("hello", 5n)` |
| `from` | `<E>(iterable: Iterable<E>) => Semantic<E>` | Créer un flux à partir d'un objet itérable | `from([1, 2, 3])` |
| `range` | `<N extends number\|bigint>(start: N, end: N, step?: N) => Semantic<N>` | Créer un flux de plage numérique | `range(1, 10, 2)` |
| `iterate` | `<E>(generator: Generator<E>) => Semantic<E>` | Créer un flux à partir d'une fonction génératrice | `iterate(myGenerator)` |
| `websocket` | `(websocket: WebSocket) => Semantic<MessageEvent>` | Créer un flux d'événements à partir de WebSocket | `websocket(socket)` |

**Supplément d'Exemple de Code:**
```typescript
import { from, range, fill, empty } from 'semantic-typescript';

// Créer un flux à partir d'un tableau
const numberStream = from([1, 2, 3, 4, 5]);

// Créer un flux de plage numérique
const rangeStream = range(1, 10, 2); // 1, 3, 5, 7, 9

// Remplir avec des éléments répétés
const filledStream = fill("hello", 3n); // "hello", "hello", "hello"

// Créer un flux vide
const emptyStream = empty<number>();
```

### Usines de Fonctions Utilitaires

| Méthode | Signature | Description | Exemple |
|------|------|------|------|
| `validate` | `<T>(t: MaybeInvalid<T>) => t is T` | Valider si la valeur est valide | `validate(null)` → `false` |
| `invalidate` | `<T>(t: MaybeInvalid<T>) => t is null\|undefined` | Valider si la valeur est invalide | `invalidate(0)` → `false` |
| `useCompare` | `<T>(t1: T, t2: T) => number` | Fonction de comparaison générique | `useCompare("a", "b")` → `-1` |
| `useRandom` | `<T = number\|bigint>(index: T) => T` | Générateur de nombres pseudo-aléatoires | `useRandom(5)` → nombre aléatoire |

**Supplément d'Exemple de Code:**
```typescript
import { validate, invalidate, useCompare, useRandom } from 'semantic-typescript';

// Valider la validité des données
const data: string | null = "hello";
if (validate(data)) {
    console.log(data.toUpperCase()); // Appel sécurisé car validate garantit que data n'est pas null
}

const nullData: string | null = null;
if (invalidate(nullData)) {
    console.log("Données invalides"); // S'exécutera car invalidate a détecté null
}

// Comparer des valeurs
const comparison = useCompare("apple", "banana"); // -1

// Générer un nombre aléatoire
const randomNum = useRandom(42); // Nombre aléatoire basé sur la graine 42
```

## Détails de la Classe Principale

### Optional<T> - Gestion Sécurisée des Valeurs Nulles

La classe Optional fournit une approche fonctionnelle pour gérer en toute sécurité les valeurs pouvant être nulles ou non définies.

| Méthode | Type de Retour | Description | Complexité Temporelle |
|------|----------|------|------------|
| `filter(predicate: Predicate<T>)` | `Optional<T>` | Filtrer les valeurs satisfaisant la condition | O(1) |
| `get()` | `T` | Obtenir la valeur, lance une erreur si vide | O(1) |
| `getOrDefault(defaultValue: T)` | `T` | Obtenir la valeur ou la valeur par défaut | O(1) |
| `ifPresent(action: Consumer<T>)` | `void` | Exécuter l'action si la valeur existe | O(1) |
| `isEmpty()` | `boolean` | Vérifier si vide | O(1) |
| `isPresent()` | `boolean` | Vérifier si la valeur existe | O(1) |
| `map<R>(mapper: Functional<T, R>)` | `Optional<R>` | Mapper et transformer la valeur | O(1) |
| `static of<T>(value: MaybeInvalid<T>)` | `Optional<T>` | Créer une instance Optional | O(1) |
| `static ofNullable<T>(value?)` | `Optional<T>` | Créer une Optional nullable | O(1) |
| `static ofNonNull<T>(value: T)` | `Optional<T>` | Créer une Optional non nulle | O(1) |

**Supplément d'Exemple de Code:**
```typescript
import { Optional } from 'semantic-typescript';

// Créer une instance Optional
const optionalValue = Optional.ofNullable<string>(Math.random() > 0.5 ? "hello" : null);

// Opérations en chaîne
const result = optionalValue
    .filter(val => val.length > 3) // Filtrer les valeurs plus longues que 3
    .map(val => val.toUpperCase()) // Convertir en majuscules
    .getOrDefault("default"); // Obtenir la valeur ou la valeur par défaut

console.log(result); // "HELLO" ou "default"

// Opérations sécurisées
optionalValue.ifPresent(val => {
    console.log(`La valeur existe: ${val}`);
});

// Vérifier le statut
if (optionalValue.isPresent()) {
    console.log("A une valeur");
} else if (optionalValue.isEmpty()) {
    console.log("Est vide");
}
```

### Semantic<E> - Flux de Données Paresseux

Semantic est la classe principale de traitement de flux, offrant de riches opérateurs de flux.

#### Opérations de Transformation de Flux

| Méthode | Type de Retour | Description | Impact sur les Performances |
|------|----------|------|----------|
| `concat(other: Semantic<E>)` | `Semantic<E>` | Concaténer deux flux | O(n+m) |
| `distinct()` | `Semantic<E>` | Supprimer les doublons (en utilisant Set) | O(n) |
| `distinct(comparator)` | `Semantic<E>` | Déduplication avec comparateur personnalisé | O(n²) |
| `dropWhile(predicate)` | `Semantic<E>` | Supprimer les éléments de début satisfaisant la condition | O(n) |
| `filter(predicate)` | `Semantic<E>` | Filtrer les éléments | O(n) |
| `flat(mapper)` | `Semantic<E>` | Aplatir les flux imbriqués | O(n×m) |
| `flatMap(mapper)` | `Semantic<R>` | Mapper et aplatir | O(n×m) |
| `limit(n)` | `Semantic<E>` | Limiter le nombre d'éléments | O(n) |
| `map(mapper)` | `Semantic<R>` | Mapper et transformer les éléments | O(n) |
| `peek(consumer)` | `Semantic<E>` | Voir les éléments sans modification | O(n) |
| `redirect(redirector)` | `Semantic<E>` | Rediriger les indices | O(n) |
| `reverse()` | `Semantic<E>` | Inverser l'ordre du flux | O(n) |
| `shuffle()` | `Semantic<E>` | Mélanger aléatoirement l'ordre | O(n) |
| `shuffle(mapper)` | `Semantic<E>` | Logique de mélange personnalisée | O(n) |
| `skip(n)` | `Semantic<E>` | Sauter les n premiers éléments | O(n) |
| `sub(start, end)` | `Semantic<E>` | Obtenir un sous-flux | O(n) |
| `takeWhile(predicate)` | `Semantic<E>` | Obtenir les éléments de début satisfaisant la condition | O(n) |
| `translate(offset)` | `Semantic<E>` | Traduire les indices | O(n) |
| `translate(translator)` | `Semantic<E>` | Transformation d'indice personnalisée | O(n) |

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const stream = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Exemples d'opérations de transformation de flux
const processedStream = stream
    .filter(x => x % 2 === 0) // Filtrer les nombres pairs
    .map(x => x * 2) // Multiplier chaque élément par 2
    .distinct() // Supprimer les doublons
    .limit(3) // Limiter aux 3 premiers éléments
    .peek((val, index) => console.log(`Élément ${val} à l'indice ${index}`)); // Voir les éléments

// Note: Le flux ne s'est pas encore exécuté, doit être converti en Collectable pour les opérations terminales
```

#### Opérations Terminales de Flux

| Méthode | Type de Retour | Description | Caractéristiques de Performance |
|------|----------|------|----------|
| `toOrdered()` | `OrderedCollectable<E>` | Convertir en collection ordonnée | Opération de tri, performance inférieure |
| `toUnordered()` | `UnorderedCollectable<E>` | Convertir en collection non ordonnée | Plus rapide, pas de tri |
| `toWindow()` | `WindowCollectable<E>` | Convertir en collection de fenêtre | Opération de tri, performance inférieure |
| `toNumericStatistics()` | `Statistics<E, number>` | Analyse statistique numérique | Opération de tri, performance inférieure |
| `toBigintStatistics()` | `Statistics<E, bigint>` | Analyse statistique en grand entier | Opération de tri, performance inférieure |
| `sorted()` | `OrderedCollectable<E>` | Tri naturel | Écrase les résultats de redirection |
| `sorted(comparator)` | `OrderedCollectable<E>` | Tri personnalisé | Écrase les résultats de redirection |

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const semanticStream = from([5, 2, 8, 1, 9, 3, 7, 4, 6]);

// Convertir en collection ordonnée (performance inférieure)
const ordered = semanticStream.toOrdered();

// Convertir en collection non ordonnée (plus rapide)
const unordered = semanticStream.toUnordered();

// Tri naturel
const sortedNatural = semanticStream.sorted();

// Tri personnalisé
const sortedCustom = semanticStream.sorted((a, b) => b - a); // Tri décroissant

// Convertir en objet statistique
const stats = semanticStream.toNumericStatistics();

// Note: Doit appeler les méthodes ci-dessus via une instance Semantic pour obtenir Collectable avant d'utiliser les méthodes terminales
```

### Collector<E, A, R> - Collecteur de Données

Les collecteurs sont utilisés pour agréger les données de flux dans des structures spécifiques.

| Méthode | Description | Scénario d'Utilisation |
|------|------|----------|
| `collect(generator)` | Exécuter la collecte de données | Opération terminale de flux |
| `static full(identity, accumulator, finisher)` | Créer un collecteur complet | Nécessite un traitement complet |
| `static shortable(identity, interruptor, accumulator, finisher)` | Créer un collecteur interruptible | Peut se terminer prématurément |

**Supplément d'Exemple de Code:**
```typescript
import { Collector } from 'semantic-typescript';

// Créer un collecteur personnalisé
const sumCollector = Collector.full(
    () => 0, // Valeur initiale
    (acc, value) => acc + value, // Accumulateur
    result => result // Fonction de finition
);

// Utiliser le collecteur (nécessite une conversion de Semantic en Collectable d'abord)
const numbers = from([1, 2, 3, 4, 5]);
const sum = numbers.toUnordered().collect(sumCollector); // 15
```

### Collectable<E> - Classe Abstraite de Données Collectables

Fournit des méthodes riches d'agrégation et de transformation de données. **Note: Doit d'abord obtenir une instance Collectable en appelant sorted(), toOrdered() etc. via une instance Semantic avant d'utiliser les méthodes suivantes.**

#### Opérations de Requête de Données

| Méthode | Type de Retour | Description | Exemple |
|------|----------|------|------|
| `anyMatch(predicate)` | `boolean` | Si un élément correspond | `anyMatch(x => x > 0)` |
| `allMatch(predicate)` | `boolean` | Si tous les éléments correspondent | `allMatch(x => x > 0)` |
| `count()` | `bigint` | Statistiques de nombre d'éléments | `count()` → `5n` |
| `isEmpty()` | `boolean` | Si le flux est vide | `isEmpty()` |
| `findAny()` | `Optional<E>` | Trouver n'importe quel élément | `findAny()` |
| `findFirst()` | `Optional<E>` | Trouver le premier élément | `findFirst()` |
| `findLast()` | `Optional<E>` | Trouver le dernier élément | `findLast()` |

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5]);

// Doit convertir en Collectable avant d'utiliser les méthodes terminales
const collectable = numbers.toUnordered();

// Opérations de requête de données
const hasEven = collectable.anyMatch(x => x % 2 === 0); // true
const allPositive = collectable.allMatch(x => x > 0); // true
const count = collectable.count(); // 5n
const isEmpty = collectable.isEmpty(); // false
const firstElement = collectable.findFirst(); // Optional.of(1)
const anyElement = collectable.findAny(); // N'importe quel élément
```

#### Opérations d'Aggrégation de Données

| Méthode | Type de Retour | Description | Complexité |
|------|----------|------|--------|
| `group(classifier)` | `Map<K, E[]>` | Grouper par classifieur | O(n) |
| `groupBy(keyExtractor, valueExtractor)` | `Map<K, V[]>` | Grouper par extracteurs clé-valeur | O(n) |
| `join()` | `string` | Joindre en chaîne | O(n) |
| `join(delimiter)` | `string` | Joindre avec délimiteur | O(n) |
| `partition(count)` | `E[][]` | Partitionner par compte | O(n) |
| `partitionBy(classifier)` | `E[][]` | Partitionner par classifieur | O(n) |
| `reduce(accumulator)` | `Optional<E>` | Opération de réduction | O(n) |
| `reduce(identity, accumulator)` | `E` | Réduction avec identité | O(n) |
| `toArray()` | `E[]` | Convertir en tableau | O(n) |
| `toMap(keyExtractor, valueExtractor)` | `Map<K, V>` | Convertir en Map | O(n) |
| `toSet()` | `Set<E>` | Convertir en Set | O(n) |

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const people = from([
    { name: "Alice", age: 25, city: "New York" },
    { name: "Bob", age: 30, city: "London" },
    { name: "Charlie", age: 25, city: "New York" }
]);

// Doit convertir en Collectable avant d'utiliser les opérations d'agrégation
const collectable = people.toUnordered();

// Opérations de regroupement
const byCity = collectable.group(person => person.city);
// Map { "New York" => [{name: "Alice", ...}, {name: "Charlie", ...}], "London" => [{name: "Bob", ...}] }

const byAge = collectable.groupBy(
    person => person.age,
    person => person.name
);
// Map { 25 => ["Alice", "Charlie"], 30 => ["Bob"] }

// Convertir en collections
const array = collectable.toArray(); // Tableau original
const set = collectable.toSet(); // Collection Set
const map = collectable.toMap(
    person => person.name,
    person => person.age
); // Map { "Alice" => 25, "Bob" => 30, "Charlie" => 25 }

// Opérations de réduction
const totalAge = collectable.reduce(0, (acc, person) => acc + person.age); // 80
const oldest = collectable.reduce((a, b) => a.age > b.age ? a : b); // Optional.of({name: "Bob", age: 30, ...})
```

### Implémentations Spécifiques de Collecteurs

#### UnorderedCollectable<E>
- **Caractéristiques**: Collecteur le plus rapide, pas de tri
- **Scénarios d'Utilisation**: Ordre non important, performance maximale souhaitée
- **Méthodes**: Hérite de toutes les méthodes Collectable

#### OrderedCollectable<E> 
- **Caractéristiques**: Garantit l'ordre des éléments, performance inférieure
- **Scénarios d'Utilisation**: Requiert des résultats triés
- **Méthodes Spéciales**: Hérite de toutes les méthodes, maintient l'état de tri interne

#### WindowCollectable<E>
- **Caractéristiques**: Prend en charge les opérations de fenêtre glissante
- **Scénarios d'Utilisation**: Analyse de données de séries temporelles
- **Méthodes Spéciales**:
  - `slide(size, step)` - Fenêtre glissante
  - `tumble(size)` - Fenêtre tumble

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const data = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Collecteur non ordonné (plus rapide)
const unordered = data.toUnordered();
const unorderedArray = unordered.toArray(); // Peut maintenir l'ordre original [1, 2, 3, ...]

// Collecteur ordonné
const ordered = data.toOrdered();
const orderedArray = ordered.toArray(); // Tri garanti [1, 2, 3, ...]

// Collecteur de fenêtre
const windowed = data.toWindow();
const slidingWindows = windowed.slide(3n, 2n); // Taille de fenêtre 3, pas 2
// Fenêtre 1: [1, 2, 3], Fenêtre 2: [3, 4, 5], Fenêtre 3: [5, 6, 7], ...

const tumblingWindows = windowed.tumble(4n); // Taille de fenêtre tumble 4
// Fenêtre 1: [1, 2, 3, 4], Fenêtre 2: [5, 6, 7, 8], ...
```

### Statistics<E, D> - Analyse Statistique

Classe de base d'analyse statistique fournissant de riches méthodes de calcul statistique. **Note: Doit d'abord obtenir une instance Statistics en appelant toNumericStatistics() ou toBigIntStatistics() via une instance Semantic avant d'utiliser les méthodes suivantes.**

#### Opérations de Calcul Statistique

| Méthode | Type de Retour | Description | Complexité de l'Algorithme |
|------|----------|------|------------|
| `maximum()` | `Optional<E>` | Valeur maximale | O(n) |
| `minimum()` | `Optional<E>` | Valeur minimale | O(n) |
| `range()` | `D` | Plage (max-min) | O(n) |
| `variance()` | `D` | Variance | O(n) |
| `standardDeviation()` | `D` | Écart type | O(n) |
| `mean()` | `D` | Valeur moyenne | O(n) |
| `median()` | `D` | Valeur médiane | O(n log n) |
| `mode()` | `D` | Valeur modale | O(n) |
| `frequency()` | `Map<D, bigint>` | Distribution de fréquence | O(n) |
| `summate()` | `D` | Sommation | O(n) |
| `quantile(quantile)` | `D` | Quantile | O(n log n) |
| `interquartileRange()` | `D` | Intervalle interquartile | O(n log n) |
| `skewness()` | `D` | Asymétrie | O(n) |
| `kurtosis()` | `D` | Aplatissement | O(n) |

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Doit convertir en objet statistique avant d'utiliser les méthodes statistiques
const stats = numbers.toNumericStatistics();

// Statistiques de base
const count = stats.count(); // 10n
const max = stats.maximum(); // Optional.of(10)
const min = stats.minimum(); // Optional.of(1)
const range = stats.range(); // 9
const mean = stats.mean(); // 5.5
const median = stats.median(); // 5.5
const sum = stats.summate(); // 55

// Statistiques avancées
const variance = stats.variance(); // 8.25
const stdDev = stats.standardDeviation(); // 2.872
const mode = stats.mode(); // N'importe quelle valeur (puisque toutes apparaissent une fois)
const q1 = stats.quantile(0.25); // 3.25
const q3 = stats.quantile(0.75); // 7.75
const iqr = stats.interquartileRange(); // 4.5

// Distribution de fréquence
const freq = stats.frequency(); // Map {1 => 1n, 2 => 1n, ...}
```

#### Classes d'Implémentation Statistique Spécifiques

**NumericStatistics<E>**
- Gère l'analyse statistique de type nombre
- Tous les calculs statistiques retournent le type nombre

**BigIntStatistics<E>**  
- Gère l'analyse statistique de type bigint
- Tous les calculs statistiques retournent le type bigint

**Supplément d'Exemple de Code:**
```typescript
import { from } from 'semantic-typescript';

// Statistiques numériques
const numberData = from([10, 20, 30, 40, 50]);
const numericStats = numberData.toNumericStatistics();

console.log(numericStats.mean()); // 30
console.log(numericStats.summate()); // 150

// Statistiques en grand entier
const bigintData = from([100n, 200n, 300n, 400n, 500n]);
const bigintStats = bigintData.toBigIntStatistics();

console.log(bigintStats.mean()); // 300n
console.log(bigintStats.summate()); // 1500n

// Statistiques utilisant des fonctions de mappage
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

## Exemple Complet d'Utilisation

```typescript
import { from, validate, invalidate } from 'semantic-typescript';

// 1. Créer un flux de données
const rawData = [5, 2, 8, 1, null, 9, 3, undefined, 7, 4, 6];
const semanticStream = from(rawData);

// 2. Pipeline de traitement de flux
const processedStream = semanticStream
    .filter(val => validate(val)) // Filtrer les null et undefined
    .map(val => val! * 2) // Multiplier chaque valeur par 2 (en utilisant ! car validate garantit non vide)
    .distinct(); // Supprimer les doublons

// 3. Convertir en Collectable et utiliser les opérations terminales
const collectable = processedStream.toUnordered();

// 4. Validation et utilisation des données
if (!collectable.isEmpty()) {
    const results = collectable
        .filter(x => x > 5) // Filtrer à nouveau
        .toArray(); // Convertir en tableau
    
    console.log("Résultats du traitement:", results); // [16, 18, 14, 8, 12]
    
    // Informations statistiques
    const stats = processedStream.toNumericStatistics();
    console.log("Valeur moyenne:", stats.mean()); // 11.2
    console.log("Somme totale:", stats.summate()); // 56
}

// 5. Gérer les données potentiellement invalides
const potentiallyInvalidData: Array<number | null> = [1, null, 3, 4, null];
const validData = potentiallyInvalidData.filter(validate);
const invalidData = potentiallyInvalidData.filter(invalidate);

console.log("Données valides:", validData); // [1, 3, 4]
console.log("Données invalides:", invalidData); // [null, null]
```

## Règles d'Utilisation Importantes Résumées

1. **Créer un Flux**: Utiliser les méthodes d'usine `from()`, `range()`, `fill()` etc. pour créer des instances Semantic
2. **Transformation de Flux**: Appeler les méthodes `map()`, `filter()`, `distinct()` etc. sur les instances Semantic
3. **Convertir en Collectable**: Doit appeler l'une des méthodes suivantes via une instance Semantic:
   - `toOrdered()` - Collecteur ordonné
   - `toUnordered()` - Collecteur non ordonné (plus rapide)
   - `toWindow()` - Collecteur de fenêtre  
   - `toNumericStatistics()` - Statistiques numériques
   - `toBigIntStatistics()` - Statistiques en grand entier
   - `sorted()` - Tri naturel
   - `sorted(comparator)` - Tri personnalisé
4. **Opérations Terminales**: Appeler les méthodes terminales `toArray()`, `count()`, `summate()` etc. sur les instances Collectable
5. **Validation des Données**: Utiliser `validate()` pour garantir que les données ne sont pas nulles/non définies, utiliser `invalidate()` pour vérifier les données invalides

Cette conception garantit la sécurité des types et l'optimisation des performances tout en fournissant une fonctionnalité riche de traitement de flux.