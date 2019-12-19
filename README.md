Entourage Web App
---

* [Technologies](#technologies)
    * [Outils](#outils)
    * [Bibliothèques internes](#bibliothèques-internes)
* [Installation](#installation)
* [Architecture](#architecture)
* [API](#api)
* [Store data](#store-data)
* [Storybook](#storybook)
* [Tests](#tests)
  * [Jest](#jest)
  * [Git hooks](#git-hooks)
* [Versionning & Release](#versionning--release)
* [Ressources React](#ressources-react)
    * [Docs & blogs](#docs--blogs)
    * [Bibliothèques React](#bibliothèques-react)


# Technologies

## Outils
* [React.js](https://fr.reactjs.org)
* [Next.js](https://nextjs.org) - React Framework
* [TypeScript](https://www.typescriptlang.org) - JavaScript superset
* [ESLint](https://eslint.org) - JavaScript Linter
* [Jest](https://jestjs.io) - Tests unitaires   
* [Storybook](https://storybook.js.org) - UI Components doc
* [Sentry](https://sentry.io) - Bug tracker

## Bibliothèques internes
* Forms - [react-hook-form](https://react-hook-form.com)
* Design system - [@material-ui](https://material-ui.com/)
* Data - [react-query](https://github.com/tannerlinsley/react-query)
* HTTP client - [axios](https://github.com/axios/axios)
* WebSocket client - [socket.io-client](https://github.com/socketio/socket.io-client)

# Installation

Pour lancer le projet, vous devez installer [Yarn](#https://yarnpkg.com/en/docs/install). 

## Install dependencies

```
yarn install
```

## build dependencies

```
yarn dev
```

# Architecture

* [`components`](#components)
* [`containers`](#containers)
* [`core`](#core)
* [`events`](#events)
* [`hooks`](#hooks)
* [`i18n`](#i18n)
* [`network`](#network)
* [`pages`](#pages)
* [`styles`](#styles)
* [`types`](#types)
* [`utils`](#utils)

## components
Composants React purement UI, sans manimulation de données. Ces composant sont visibles dans la documentation [Storybook](#storybook)  

Dépendances: `components` `styles` `hooks` `utils`

## containers
Composant React qui manupule des données. Ils sont en charge fetcher les données et de les afficher. Un composant de type "container" peut inclure d'autres containers ainsi que des composants UI.  

Dépendances: toutes.

## core
Core ne contient pour le moment qu'une référence aux variables d'environnement

## events
Il s'agit d'un système de listener / dispatch utilisant RxJS. On y trouvera des fonctions pour écouter l'évenement `onLogin`, `onLogout`, etc.  

Dépendances: `network` `hooks`

## hooks
Liste pratique de hooks. Aucune dépendance.  

Dépendances: aucune

## i18n
Contenu textuel  

Dépendances: aucune

## network
Tout ce qui touche aux échanges client / serveur. `network/api` va permettre d'effectuer des requêtes serveurs avec Axios, selon un schéma de route.  

Dépendances: `core` `network` `types`

## pages
Composant React servant de Page NextJS. [Plus d'infos](https://nextjs.org/docs#routing)

Dépendances: toutes

## styles
Données relatives au style de l'application: thème Matérial UI, liste des couleurs utilisé, etc...  

Dépendance: aucune

## types
Liste d'utilitaires TypeScript (Interface et Types)

Dépendance: aucune

## utils
Liste d'utilitaires JavaScript
Dépendance: aucune

# API

Le schéma de l'api est défini dans [src/api/schema](src/api/schema.ts) et utilise le format [typescript-object-schema](https://github.com/GuillaumeJasmin/typescript-object-schema).

Utilisation de l'API:
```js
import { api } from 'src/core/api'

const users = await api.request({
  name: 'GET users',
  pathParams: {
    ...
  },
  params: {
    ...
  },
  data: {
    ...
  }
})
```

Les valeur de `routeName` seront autocompletées, ainsi que les valeurs requises pour `params`, `data`, etc.  
L'objet `api` est une instance axios.

# Store data
[react-query](https://github.com/tannerlinsley/react-query)

# Storybook

La version en ligne du storybook d'entourage est ici: [reseauentourage.github.io/entourage-webapp](https://reseauentourage.github.io/entourage-webapp)

## Lancer le styleguide en local
```
yarn storybook
```

## Créer une story

Créer un fichier `*.stories.tsx` au même endroit que le composant

```
Button.tsx
Button.stories.tsx
```

```js
import React from 'react'
import { Button } from './Button'

export default {
  title: 'Button',
}

export const BasicButton = () => <Button />
```

## Publier le styleguide sur Github Pages
```
yarn deploy-storybook
```

*Note*: d'ici quelques temps le déploiement de storybook sera automatisé avec Travis

# Tests

## Jest

Les tests unitaires sont réalisés avec [Jest](https://jestjs.io)

Architecture

```
Button.tsx
Button.styles.ts
__tests__
  Button.spec.ts
```

Exécuter les tests unitaires:

```
yarn test:jest
```

## Git hooks

[Huksy](https://github.com/typicode/husky) est utilisé pour activer les git hooks.

Git hooks actifs:
```json
"pre-commit": "yarn test:eslint",
"pre-push": "yarn test"
```

Pour contourner les git hook, vous pouvez utiliser `--no-verify`, mais à faire uniquement en cas de force majeur :wink:
```
git commit -m "votre message" --no-verify
git push --no-verify
```

# Versionning & Release

* [Conventional Commits](https://www.conventionalcommits)

# Ressources React

## Docs & blogs

* Doc officielle React - [reactjs.org](https://fr.reactjs.org)

* Doc officielle Next - [nextjs.org](https://nextjs.org)

* React Status newsletter - [react.statuscode.com](https://react.statuscode.com)

* **Resources React (docs, confs, lib, blogs)** - [github.com/enaqx/awesome-react](https://github.com/enaqx/awesome-react)

* Kent C Dodds - [kentcdodds.com/blog](https://kentcdodds.com/blog)

* Dan Abramov - [overreacted.io](https://overreacted.io)

## Bibliothèques React

* Hooks - [awesome-react-hooks](https://github.com/rehooks/awesome-react-hooks)

* Components - [awesome-react-components](https://github.com/brillout/awesome-react-components)
