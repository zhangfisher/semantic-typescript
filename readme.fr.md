# 📘 semantic-typescript

Une bibliothèque TypeScript puissante et typée en toute sécurité, conçue pour le **traitement sémantique de données**.  
Elle fournit des constructions fonctionnelles composites pour travailler avec des collections, des flux et des séquences — avec prise en charge du tri, du filtrage, du regroupement, des statistiques et bien plus encore.

Que vous traitiez des **données ordonnées ou non ordonnées**, effectuiez des **analyses statistiques**, ou que vous souhaitiez simplement **chaîner des opérations de manière fluide**, cette bibliothèque est faite pour vous.

---

## 🧩 Caractéristiques

- ✅ **Génériques typés en toute sécurité** dans toute la bibliothèque
- ✅ Style **programmation fonctionnelle** (map, filter, reduce, etc.)
- ✅ **Flux de données sémantiques** (`Semantic<E>`) pour une **évaluation paresseuse**
- ✅ **Collecteurs** pour transformer des flux en structures concrètes
- ✅ **Collectables ordonnés et non ordonnés** — `toUnordered()` est **le plus rapide (pas de tri)**
- ✅ **Tri** via `sorted()`, `toOrdered()`, comparateurs personnalisés
- ✅ **Analyse statistique** (`Statistics`, `NumericStatistics`, `BigIntStatistics`)
- ✅ **Optional<T>** — monade pour manipuler en toute sécurité les valeurs nulles
- ✅ Conception basée sur les **itérateurs et générateurs** — adaptée aux gros volumes ou données asynchrones

---

## 📦 Installation

```bash
npm install semantic-typescript
```

---

## 🧠 Concepts clés

### 1. `Optional<T>` — Gestion sûre des valeurs nulles

Un conteneur monadique pour des valeurs pouvant être `null` ou `undefined`.

#### Méthodes :

| Méthode | Description | Exemple |
|--------|-------------|---------|
| `of(value)` | Envelopper une valeur (peut être nulle) | `Optional.of(null)` |
| `ofNullable(v)` | Envelopper, autorise les valeurs nulles | `Optional.ofNullable(someVar)` |
| `ofNonNull(v)` | Envelopper, lève une erreur si null/undefined | `Optional.ofNonNull(5)` |
| `get()` | Obtenir la valeur (ou lever une exception si vide) | `opt.get()` |
| `getOrDefault(d)` | Obtenir la valeur ou une valeur par défaut | `opt.getOrDefault(0)` |
| `ifPresent(fn)` | Exécuter un effet de bord si la valeur existe | `opt.ifPresent(x => console.log(x))` |
| `map(fn)` | Transformer la valeur si elle existe | `opt.map(x => x + 1)` |
| `filter(fn)` | Conserver la valeur seulement si le prédicat est vrai | `opt.filter(x => x > 0)` |
| `isEmpty()` | Vérifie si la valeur est absente | `opt.isEmpty()` |
| `isPresent()` | Vérifie si une valeur est présente | `opt.isPresent()` |

#### Exemple :

```typescript
import { Optional } from 'semantic-typescript';

const value: number | null = Math.random() > 0.5 ? 10 : null;

const opt = Optional.ofNullable(value);

const result = opt
  .filter(v => v > 5)
  .map(v => v * 2)
  .getOrDefault(0);

console.log(result); // 20 ou 0
```

---

### 2. `Semantic<E>` — Flux de données paresseux

Un **flux séquentiel paresseux et composite**. Similaire aux Java Streams ou aux Kotlin Sequences.

Créez un `Semantic` à l’aide d’assistants comme `from()`, `range()`, `iterate()` ou `fill()`.

#### Créateurs :

| Fonction | Description | Exemple |
|----------|-------------|---------|
| `from(iterable)` | Créer à partir d’un Array, Set, Iterable | `from([1, 2, 3])` |
| `range(start, end, step?)` | Générer une plage de nombres | `range(0, 5)` → 0,1,2,3,4 |
| `fill(element, count)` | Répéter un élément N fois | `fill('a', 3n)` |
| `iterate(gen)` | Utiliser une fonction générateur personnalisée | `iterate(genFn)` |

#### Opérateurs courants :

| Méthode | Description | Exemple |
|--------|-------------|---------|
| `map(fn)` | Transformer chaque élément | `.map(x => x * 2)` |
| `filter(fn)` | Conserver les éléments répondant au prédicat | `.filter(x => x > 10)` |
| `limit(n)` | Limiter aux N premiers éléments | `.limit(5)` |
| `skip(n)` | Ignorer les N premiers éléments | `.skip(2)` |
| `distinct()` | Supprimer les doublons (utilise Set par défaut) | `.distinct()` |
| `sorted()` | Trier les éléments (ordre naturel) | `.sorted()` |
| `sorted(comparator)` | Trier avec un comparateur personnalisé | `.sorted((a, b) => a - b)` |
| `toOrdered()` | Trier et retourner un `OrderedCollectable` | `.toOrdered()` |
| `toUnordered()` | **Pas de tri** — le plus rapide | `.toUnordered()` ✅ |
| `collect(collector)` | Aggréger avec un `Collector` | `.collect(Collector.full(...))` |
| `toArray()` | Convertir en tableau | `.toArray()` |
| `toSet()` | Convertir en Set | `.toSet()` |
| `toMap(keyFn, valFn)` | Convertir en Map | `.toMap(x => x.id, x => x)` |

---

### 3. `toUnordered()` — 🚀 Le plus rapide, sans tri

Si vous **n’avez pas besoin d’ordre** et que vous souhaitez les **meilleures performances possibles**, utilisez :

```typescript
const fastest = semanticStream.toUnordered();
```

🔥 **Aucun algorithme de tri n’est appliqué.**  
Parfait lorsque l’ordre n’a pas d’importance et que la vitesse est cruciale.

---

### 4. `toOrdered()` et `sorted()` — Résultats triés

Si vous avez besoin d’un **résultat trié**, utilisez :

```typescript
const ordered = semanticStream.sorted(); // Tri naturel
const customSorted = semanticStream.sorted((a, b) => a - b); // Comparateur personnalisé
const orderedCollectable = semanticStream.toOrdered(); // Aussi trié
```

⚠️ Ces méthodes **trient les éléments**, en utilisant l’ordre naturel ou un comparateur fourni.

---

### 5. `Collector<E, A, R>` — Agrégation de données

Les collecteurs vous permettent de **réduire un flux en une structure unique ou complexe**.

Des factories statiques sont disponibles :

```typescript
Collector.full(identity, accumulator, finisher)
Collector.shortable(identity, interruptor, accumulator, finisher)
```

Mais vous utiliserez surtout les méthodes haut niveau fournies par les classes `Collectable`.

---

### 6. `Collectable<E>` (classe abstraite)

Classe de base pour :

- `OrderedCollectable<E>` — Résultats triés
- `UnorderedCollectable<E>` — Pas de tri, le plus rapide
- `WindowCollectable<E>` — Fenêtres glissantes
- `Statistics<E, D>` — Statistiques agrégées

#### Méthodes communes (via héritage) :

| Méthode | Description | Exemple |
|--------|-------------|---------|
| `count()` | Compter les éléments | `.count()` |
| `toArray()` | Convertir en tableau | `.toArray()` |
| `toSet()` | Convertir en Set | `.toSet()` |
| `toMap(k, v)` | Convertir en Map | `.toMap(x => x.id, x => x)` |
| `group(k)` | Regrouper par clé | `.group(x => x.category)` |
| `findAny()` | Trouver un élément quelconque (Optional) | `.findAny()` |
| `findFirst()` | Trouver le premier élément (Optional) | `.findFirst()` |
| `reduce(...)` | Réduction personnalisée | `.reduce((a,b) => a + b, 0)` |

---

### 7. `OrderedCollectable<E>` — Données triées

Si vous souhaitez que les éléments soient **triés automatiquement**, utilisez cette classe.

Elle accepte un **comparateur personnalisé** ou utilise l’ordre naturel.

```typescript
const sorted = new OrderedCollectable(stream);
const customSorted = new OrderedCollectable(stream, (a, b) => b - a);
```

🔒 **Le tri est garanti.**

---

### 8. `UnorderedCollectable<E>` — Pas de tri (🚀 Le plus rapide)

Si vous **n’avez pas besoin de tri** et que vous voulez les **meilleures performances**, utilisez :

```typescript
const unordered = new UnorderedCollectable(stream);
// OU
const fastest = semanticStream.toUnordered();
```

✅ **Aucun algorithme de tri n’est exécuté**  
✅ **Meilleure performance lorsque l’ordre n’a pas d’importance**

---

### 9. `Statistics<E, D>` — Analyse statistique

Classe abstraite pour analyser des données numériques.

#### Sous-classes :

- `NumericStatistics<E>` — Pour des valeurs de type `number`
- `BigIntStatistics<E>` — Pour des valeurs de type `bigint`

##### Méthodes statistiques courantes :

| Méthode | Description | Exemple |
|--------|-------------|---------|
| `mean()` | Moyenne | `.mean()` |
| `median()` | Médiane | `.median()` |
| `mode()` | Mode (valeur la plus fréquente) | `.mode()` |
| `minimum()` | Minimum | `.minimum()` |
| `maximum()` | Maximum | `.maximum()` |
| `range()` | Écart (max - min) | `.range()` |
| `variance()` | Variance | `.variance()` |
| `standardDeviation()` | Écart-type | `.standardDeviation()` |
| `summate()` | Somme | `.summate()` |
| `quantile(q)` | Valeur au quantile q (0–1) | `.quantile(0.5)` → médiane |
| `frequency()` | Fréquence sous forme de Map | `.frequency()` |

---

## 🧪 Exemple complet

```typescript
import { from, toUnordered, toOrdered, sorted, NumericStatistics } from 'semantic-typescript';

// Données d'exemple
const numbers = from([10, 2, 8, 4, 5, 6]);

// 🚀 Le plus rapide : pas de tri
const fastest = numbers.toUnordered();
console.log(fastest.toArray()); // ex: [10, 2, 8, 4, 5, 6] (ordre d'origine)

// 🔢 Tri naturel
const ordered = numbers.sorted();
console.log(ordered.toArray()); // [2, 4, 5, 6, 8, 10]

// 📊 Statistiques
const stats = new NumericStatistics(numbers);
console.log('Moyenne:', stats.mean());
console.log('Médiane:', stats.median());
console.log('Mode:', stats.mode());
console.log('Écart:', stats.range());
console.log('Écart-type:', stats.standardDeviation());
```

---

## 🛠️ Fonctions utilitaires

La bibliothèque exporte aussi plusieurs **tests de type (type guards)** et **outils de comparaison** :

| Fonction | But |
|----------|-----|
| `isString(x)` | Test de type pour `string` |
| `isNumber(x)` | Test de type pour `number` |
| `isBoolean(x)` | Test de type pour `boolean` |
| `isIterable(x)` | Vérifie si un objet est itérable |
| `useCompare(a, b)` | Fonction de comparaison universelle |
| `useRandom(x)` | Générateur de nombre aléatoire (divertissant) |

---

## 🧩 Avancé : Générateurs personnalisés et fenêtres

Vous pouvez créer des **générateurs personnalisés** pour des flux de données contrôlés ou infinis :

```typescript
const gen = (accept: BiConsumer<number, bigint>, interrupt: Predicate<number>) => {
  for (let i = 0; i < 10; i++) {
    accept(i, BigInt(i));
    if (i === 5) interrupt(i);
  }
};

const s = new Semantic(gen);
```

Ou utiliser des **fenêtres glissantes** :

```typescript
const windowed = ordered.slide(3n, 2n); // fenêtres de taille 3, pas de 2
```

---

## 📄 Licence

Ce projet est sous **licence MIT** — libre pour un usage commercial ou personnel.

---

## 🙌 Contribution

Les pull requests, problèmes (issues) et idées sont les bienvenus !

---

## 🚀 Résumé du démarrage rapide

| Tâche | Méthode |
|-------|---------|
| Gérer les valeurs nulles | `Optional<T>` |
| Créer un flux | `from([...])`, `range()`, `fill()` |
| Transformer des données | `map()`, `filter()` |
| Trier des données | `sorted()`, `toOrdered()` |
| Pas de tri (le plus rapide) | `toUnordered()` ✅ |
| Regrouper / Aggréger | `toMap()`, `group()`, `Collector` |
| Statistiques | `NumericStatistics`, `mean()`, `median()`, etc. |

---

## 🔗 Liens

- 📦 npm: https://www.npmjs.com/package/semantic-typescript
- 🐙 GitHub: https://github.com/eloyhere/semantic-typescript
- 📘 Documentation : voir le code source / définitions de type

---

**Profitez d’un traitement de données fonctionnel, typé et composable en TypeScript.** 🚀

--- 

✅ **À retenir :**  
- `toUnordered()` → **Pas de tri, le plus rapide**  
- Les autres (`sorted()`, `toOrdered()`, etc.) → **Tri des données**