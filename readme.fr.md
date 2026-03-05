# **Semantic-TypeScript**
**Flux, Indexés.** Vos données, sous contrôle précis.

---

### Aperçu

Semantic-TypeScript marque un bond en avant significatif dans la technologie de traitement des flux, **synthétisant** les concepts les plus efficaces de `GeneratorFunction` JavaScript, Java Streams et de l'indexation de style MySQL. Sa philosophie centrale est à la fois simple et puissante : construire des pipelines de traitement de données exceptionnellement efficaces grâce à une indexation intelligente, et non par itération de force brute.

Là où les bibliothèques conventionnelles imposent des boucles synchrones ou des chaînes de promesses maladroites, Semantic-TypeScript offre une expérience **entièrement asynchrone**, fonctionnellement pure et rigoureusement sûre au niveau des types, conçue pour répondre aux exigences du développement front-end moderne.

Dans son modèle élégant, les données n'atteignent le consommateur que lorsque le pipeline en amont invoque explicitement les callbacks `accept` (et optionnellement `interrupt`). Vous avez un contrôle total sur le timing - exactement quand c'est nécessaire.

---

### Pourquoi les développeurs le préfèrent

- **Indexation Zéro-Boilerplate** — chaque élément porte son index naturel ou sur mesure.
- **Style Purement Fonctionnel** — avec une inférence TypeScript complète.
- **Flux d'Événements Étanches** — `useWindow`, `useDocument`, `useHTMLElement` et `useWebSocket` sont conçus avec la sécurité à l'esprit. Vous définissez la limite (en utilisant `limit(n)`, `sub(start, end)` ou `takeWhile(predicate)`) et la bibliothèque gère le nettoyage. Aucun écouteur résiduel, aucune fuite de mémoire.
- **Statistiques Intégrées** — analyses numériques et bigint complètes incluant moyennes, médianes, modes, variance, asymétrie et kurtosis.
- **Performances Prédictibles** — choisissez entre des collecteurs ordonnés ou non ordonnés selon vos besoins.
- **Efficacité Mémoire** — les flux sont évalués paresseusement, atténuant les préoccupations de mémoire.
- **Pas de Comportement Indéfini** — TypeScript garantit la sûreté des types et la nullabilité. Les données d'entrée restent inchangées sauf si elles sont explicitement modifiées dans vos fonctions de callback.

---

### Installation

```bash
npm install semantic-typescript
```
ou
```bash
yarn add semantic-typescript
```

---

### Démarrage Rapide

```typescript
import { useOf, useFrom, useRange, useWindow, useHTMLElement, useWebSocket, useText, useStringify } from "semantic-typescript";

// Statistiques numériques
let summate: number = useOf(10, 20, 30, 40)
  .map((n: number): number => n * 2)
  .toNumericStatistics()  // Requis avant l'opération terminale
  .summate();             // 200

// Statistiques BigInt
let summate: bigint = useOf(10n, 20n, 30n, 40n)
  .map((n: bigint): bigint => n * 2)
  .toBigIntStatistics()   // Requis avant l'opération terminale
  .summate();             // 200n

// Inverser un flux par index
useFrom([1, 2, 3, 4, 5])
  .redirect((element: E, index: bigint): bigint => -index) // Index négatif pour inversion
  .toOrdered() // Appeler toOrdered() pour préserver l'ordre des index
  .toArray(); // [5, 4, 3, 2, 1]

// Mélanger un flux
useFrom([1, 2, 3, 4, 5])
  .shuffle()
  .toOrdered()
  .toArray(); // ex. [2, 5, 1, 4, 3]

// Translater des éléments dans un flux
useFrom([1, 2, 3, 4, 5])
  .translate(2)  // Décaler les éléments de 2 positions vers la droite
  .toOrdered()
  .toArray(); // [4, 5, 1, 2, 3]

useFrom([1, 2, 3, 4, 5])
  .translate(-2) // Décaler les éléments de 2 positions vers la gauche
  .toOrdered()
  .toArray(); // [3, 4, 5, 1, 2]

// Plage infinie avec terminaison anticipée
useRange(0n, 1_000_000n)
  .filter(n => n % 17n === 0n)
  .limit(10n)          // S'arrêter après 10 éléments
  .toUnordered()
  .toArray();

// Redimensionnement de fenêtre en temps réel (s'arrête automatiquement après 5 événements)
useWindow("resize")
  .limit(5n)          // Crucial pour les flux d'événements
  .toUnordered()
  .forEach((ev, idx) => console.log(`Redimensionnement #${idx}`));

// Écouter un élément HTML
// <input id="input" type="text"/>
useHTMLElement("#input", "change")
  .limit(1)
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Écouter plusieurs éléments et événements
useHTMLElement("input", ["change", "keyup"])
  .takeWhile((event: Event): boolean => validate(event))
  .toUnordered()
  .forEach((event: Event) => submit(event));

// Écouter un WebSocket
let webSocket = new WebSocket("ws://localhost:8080");
webSocket.addEventListener("close", (): void => {
  webSocket.close();  // Gérer le cycle de vie du WebSocket manuellement
});
useWebSocket(webSocket, "message")
  .limit(1)
  .toUnordered()
  .forEach((message: MessageEvent) => console.log(message.data));

// Itérer sur une chaîne par point de code
useText("My emotion now is: 😊, and semantic is 👍")
  .toUnordered()
  .log(); // Affiche la chaîne

// Sérialiser en toute sécurité un objet avec références circulaires
let o = {
  a: 1,
  b: "text",
  c: [o.a, o.b, o.c] // Référence circulaire
};
// let text: string = JSON.stringify(o); // Lance une erreur
let text: string = useStringify(o); // Produit en toute sécurité `{a: 1, b: "text", c: []}`
```

---

### Concepts Fondamentaux

| Concept | Objectif | Quand l'utiliser |
| :--- | :--- | :--- |
| `AsynchronousSemantic` | Constructeur principal pour les flux asynchrones, événements et pipelines paresseux. | Événements temps réel, WebSockets, écouteurs DOM, flux de longue durée ou infinis. |
| `SynchronousSemantic` | Constructeur pour les flux synchrones, en mémoire ou basés sur des boucles. | Données statiques, plages, itération immédiate. |
| `toUnordered()` | Collecteur terminal le plus rapide (indexation basée sur Map). | Chemins critiques en performance (temps et espace O(n), pas de tri). |
| `toOrdered()` | Collecteur trié, stable en index. | Lorsqu'un ordre stable ou un accès indexé est requis. |
| `toNumericStatistics()` | Analyse statistique numérique riche (moyenne, médiane, variance, asymétrie, kurtosis, etc.). | Analyse de données et calculs statistiques. |
| `toBigIntStatistics()` | Analyse statistique bigint riche. | Analyse de données et calculs statistiques pour grands entiers. |
| `toWindow()` | Prise en charge des fenêtres glissantes et fixes. | Traitement de séries temporelles, traitement par lots et opérations avec fenêtres. |

---

**Règles d'Utilisation Importantes**

1.  **Flux d'événements** (`useWindow`, `useDocument`, `useHTMLElement`, `useWebSocket`, …) renvoient un `AsynchronousSemantic`.
    → Vous **devez** appeler `.limit(n)`, `.sub(start, end)` ou `.takeWhile()` pour cesser l'écoute. Sinon, l'écouteur reste actif.

2.  **Opérations terminales** (`.toArray()`, `.count()`, `.average()`, `.reduce()`, `.findFirst()`, etc.) sont **uniquement disponibles après** conversion en collecteur :
    ```typescript
    .toUnordered()   // Temps et espace O(n), pas de tri
    // ou
    .toOrdered()     // Trié, maintient l'ordre
    ```

---

### Caractéristiques de Performance

| Collecteur | Complexité Temporelle | Complexité Spatiale | Trié ? | Le meilleur pour |
| :--- | :--- | :--- | :--- | :--- |
| `toUnordered()` | O(n) | O(n) | Non | Vitesse brute, ordre non requis. |
| `toOrdered()` | O(2n) | O(n) | Oui | Ordre stable, accès indexé, analyses. |
| `toNumericStatistics()` | O(2n) | O(n) | Oui | Opérations statistiques nécessitant des données triées. |
| `toBigIntStatistics()` | O(2n) | O(n) | Oui | Opérations statistiques pour bigint. |
| `toWindow()` | O(2n) | O(n) | Oui | Opérations de fenêtrage basées sur le temps. |

Optez pour `toUnordered()` lorsque la vitesse est primordiale. Utilisez `toOrdered()` uniquement lorsque vous avez besoin d'un ordre stable ou de méthodes statistiques dépendant de données triées.

---

**Comparaison avec d'autres Processeurs de Flux Front-End**

| Fonctionnalité | Semantic-TypeScript | RxJS | Itérateurs/Générateurs Async Natifs | Most.js |
| :--- | :--- | :--- | :--- | :--- |
| **Intégration TypeScript** | De première classe, fortement typé avec conscience native de l'index. | Excellente, mais implique des génériques complexes. | Bonne, nécessite un typage manuel. | Style fonctionnel fort. |
| **Analyse Statistique Intégrée** | Prise en charge native complète pour `number` et `bigint`. | Non disponible nativement (nécessite des opérateurs personnalisés). | Aucune. | Aucune. |
| **Indexation et Conscience de Position** | Indexation bigint native et puissante sur chaque élément. | Nécessite des opérateurs personnalisés (`scan`, `withLatestFrom`). | Compteur manuel requis. | Basique, pas d'index intégré. |
| **Gestion des Flux d'Événements** | Usines dédiées et sûres au niveau des types avec contrôle explicite d'arrêt anticipé. | Puissante mais nécessite une gestion manuelle des abonnements. | Écouteur d'événements manuel + annulation. | Bonne `fromEvent`, léger. |
| **Performance et Efficacité Mémoire** | Exceptionnelle – collecteurs optimisés `toUnordered()` et `toOrdered()`. | Très bonne, mais les chaînes d'opérateurs ajoutent de la surcharge. | Excellente (surcharge nulle). | Excellente. |
| **Taille du Bundle** | Très léger. | Grand (même avec tree-shaking). | Zéro (natif). | Petit. |
| **Philosophie de Conception d'API** | Modèle de collecteur fonctionnel avec indexation explicite. | Modèle Observable Réactif. | Modèle Itérateur / Générateur. | Fonctionnel, point-free. |
| **Terminaison Anticipée et Contrôle** | Explicite (`interrupt`, `.limit()`, `.takeWhile()`, `.sub()`). | Bon (`take`, `takeUntil`, `first`). | Manuel (`break` dans `for await…of`). | Bon (`take`, `until`). |
| **Support Synchrone et Asynchrone** | API unifiée – support de première classe pour les deux. | Principalement asynchrone. | Les deux, mais manuel. | Principalement asynchrone. |
| **Courbe d'Apprentissage** | Douce pour les développeurs familiarisés avec les pipelines fonctionnels et indexés. | Plus raide (nombreux opérateurs, observables chauds/froids). | Faible. | Modérée. |

**Avantages Clés de Semantic-TypeScript**

*   Capacités statistiques et d'indexation intégrées uniques, éliminant le besoin d'un `reduce` manuel ou de bibliothèques externes.
*   Contrôle explicite des flux d'événements prévient les fuites de mémoire courantes avec RxJS.
*   Une conception synchrone/asynchrone unifiée fournit une API unique et cohérente pour divers cas d'usage.

Cette comparaison illustre pourquoi Semantic-TypeScript est particulièrement bien adapté aux applications front-end TypeScript modernes qui exigent performance, sûreté des types et analyses riches sans le cérémonial des bibliothèques réactives traditionnelles.

---

### Prêt à Explorer ?

Semantic-TypeScript transforme les flux de données complexes en pipelines lisibles, composables et haute performance. Que vous manipuliez des événements UI en temps réel, traitiez de grands ensembles de données ou construisiez des tableaux de bord analytiques, il fournit la puissance de l'indexation de niveau base de données avec l'élégance de la programmation fonctionnelle.

**Prochaines Étapes :**

*   Parcourez l'API entièrement typée dans votre IDE (toutes les exportations proviennent du package principal).
*   Rejoignez la communauté grandissante de développeurs qui ont remplacé des itérateurs async alambiqués par des pipelines Semantic propres.

**Semantic-TypeScript** — où les flux rencontrent la structure.

Commencez à construire dès aujourd'hui et expérimentez la différence qu'apporte une indexation bien pensée.

**Construisez avec clarté, agissez avec confiance, et transformez les données avec intention.**