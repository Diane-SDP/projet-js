# The Legend of Babar

## Description

Ce projet est un jeu en JavaScript créé avec Phaser, inspiré par l'univers de Zelda. Le jeu se passe dans un donjon, et le joueur doit le parcourir afin de récupérer une clé puis aller au bout du labyrinthe pour combattre le boss.

## Comment exécuter le projet

Pour exécuter le projet, utilisez la commande suivante dans votre terminal:

```powershelle
cd .\Babar2\
```

```powershell
npm run dev
```

## Fonctionnalités

### Labyrinthe

L'algorithme utilisé pour générer un labyrinthe est une variante de la recherche en profondeur (DFS - Depth-First Search). Il garantit que tout le labyrinthe est accessible et qu'il est résolvable.

### Salles spéciales

Le donjon est rempli de salles spéciales avec des propriétés uniques qui peuvent influencer le cours de l'aventure:

- **Salle de vent** : pousse le joueur dans une direction spécifique.
- **Salle d'eau** : ralentit le joueur lorsqu'il se déplace à travers elle.
- **Salle de glace** : fait glisser le joueur lorsqu'il se déplace.
- **Salle de la clé** : il faut la trouver pour récupérer la clé et aller dans la salle du Boss

### Ennemis

Le donjon est peuplé d'ennemis variés, tels que des bokoblins qui chargent des coups de massue et des octoroks qui crachent des cailloux.

### Armes et améliorations

Le joueur a le choix entre deux armes principales: une épée ou une lance. De plus, il peut acheter des améliorations avec les rubis qu'il récolte en tuant des ennemis. Ces améliorations comprennent des bonus d'attaque et des bonus de vie.

### Minimap

Afin de ne pas totalement se perdre dans le labyrinthe, le joueur a accès à une minimap (en appuyant sur TAB) qui se révèle au fur et à mesure de l'exploration du donjon.

## Cheat Code

Un code de triche a été implanté dans le jeu. En tapant "kevin" dans le shop, le joueur gagne automatiquement 100 rubis.

## Évolution du jeu

Ce jeu est conçu pour évoluer facilement. Il est possible d'ajouter de nouvelles armes, de nouveaux monstres et d'autres fonctionnalités pour enrichir l'expérience de jeu.

*En cas de problème/suggestion, contactez les auteurs !*

## Auteurs

**Aymeric MAREC**  
<aymeric.marec@gmail.com>  

**Diane SAUTEREAU DU PART**  
<diane.sautereau@gmail.com>
