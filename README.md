Entourage Web App
---

[![Build Status](https://travis-ci.org/ReseauEntourage/entourage-webapp.svg?branch=master)](https://travis-ci.org/ReseauEntourage/entourage-webapp)

* [Technologies](#technologies)
    * [Outils](#outils)
    * [Bibliothèques internes](#bibliothèques-internes)
* [Installation](#installation)
* [Architecture](#architecture)
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

## Modules principaux & versions

| App             | Version |
|-----------------|---------|
| **Node**        | 14.18.x |
| **NPM**         | 6.14.x  |
| **YARN**        | 1.22.x  |
| **Next.js**     | 12.0.7  |
| **React**       | 17.0.2  |
| **Redux**       | 7.2.2   |
| **Redux-Saga**  | 1.1.3   |
| **React-Query** | 0.3.23  |
| **Webpack**     | 4.41.2  |
| **esLint**      | 8.15.0  |


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

## Build dependencies

```
yarn dev
```

## Variable d'environnement

```
ADMIN_ASSO_URL=
API_KEY=
API_V1_URL= // utiliser l'URL de l'API en preprod
FIREBASE_API_KEY=
FIREBASE_APP_ID=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_MEASUREMENT_ID=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
GOOGLE_MAP_API_KEY=
HEROKU_APP_ID=
HEROKU_APP_NAME=
HEROKU_RELEASE_CREATED_AT=
HEROKU_RELEASE_VERSION=
HEROKU_SLUG_COMMIT=
HEROKU_SLUG_DESCRIPTION=
PAPERTRAIL_API_TOKEN=
SENTRY_AUTH_TOKEN=
SENTRY_DSN=
SERVER_URL=
```

# Architecture

* [`components`](#components)
* [`containers`](#containers)
* [`core`](#core)
  * [`api`](#api)
  * [`events`](#events)
  * [`store`](#store)
  * [`services`](#services)
  * [`useCases`](#use-cases)
* [`i18n`](#i18n)
* [`pages`](#pages)
* [`styles`](#styles)
* [`utils`](#utils)
  * [`hooks`](#hooks)
  * [`types`](#types)
  * [`misc`](#misc)
    * [`plateform`](#plateformes)

## components
Composants React purement UI, sans manimulation de données. Ces composant sont visibles dans la documentation [Storybook](#storybook)  

Dépendances: `components` `styles` `utils`

## containers
Composant React qui manupule des données. Ils sont en charge fetcher les données et de les afficher. Un composant de type "container" peut inclure d'autres containers ainsi que des composants UI.  

## core
Logique métier

### api
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

Les valeur de `name` seront autocompletées, ainsi que les valeurs requises pour `params`, `data`, etc.  
L'objet `api` est une instance axios.

#### routes
* `/anonymous_users POST`
* `/entourages POST`
* `/entourages/:entourageId/users GET`
* `/entourages/:entourageId/users POST`
* `/entourages/:entourageId/chat_messages GET`
* `/entourages/:entourageId/chat_messages POST`
* `/entourages/:entourageId/users/:userId PUT`
* `/entourages/:entourageId/users/:userId DELETE`
* `/feeds GET`
* `/login POST`
* `/myfeeds GET`
* `/pois GET`
* `/users POST`
* `/users/me GET`
* `/users/me PATCH`
* `/users/me/address POST`
* `/users/me/presigned_avatar_upload/ POST`
* `/users/lookup POST`

### events
Il s'agit d'un système de listener / dispatch utilisant RxJS. On y trouvera des hooks pour écouter l'évenement `onLogin`, `onLogout` par exemple.

#### Liste des évènements

* `onLogin`
* `onLogout`

#### Exemple

```ts
import { useOnLogin } from 'src/core/events'

function MyComponent() {

  useOnLogin((user) => {
    // code
  })

  // ...
}
```


### Store Redux
Persistance des données via [react-redux](https://react-redux.js.org)
Ordonnancement des actions via [redux-saga](https://redux-saga.js.org)

#### Use-Cases
* `authUser`
* `feed`
* `firebase`
* `location`
* `messages`
* `notifications`
* `pois`

#### Détails des uses-cases

Chaque use case possède 
* un fichier d'action `xxx.actions.ts`
* un fichier saga `xxx.saga.ts`
* un fichier de test `xxx.spec.ts`
* un fichier de type `xxx.types.ts`
* un fichier d'interface pour définir les méthode de l'API `IXXXGateway.ts`
* un fichier de mock de l'API pour moquer l'interface `TestXXXGateway.ts`
* éventuellement un fichier de mocks `__mocks__.ts`

#### Tests
Chaque use-case possède un fichier de test dans le dossier `xxx.spec.ts`. 

Ce fichier permet de tester toute la logique métier du use-case, sans se soucier de l'interface.

### Store legacy React-Query (à remplacer)
Persistance des données via [react-query](https://github.com/tannerlinsley/react-query)

Ce store était utilisé avant, mais il faut le remplacer par le store Redux.

Il reste quelques use-cases à remplacer par le store Redux.

#### Queries
* `useQueryEntouragesWithMembers`
* `useQueryEntourageUsers`
* `useQueryMembersPending`
* `useQueryUser`

#### Mutations
* `useMutateAcceptEntourageUser`
* `useMutateDeleteEntourageUser`

## i18n
Contenu textuel  

Dépendances: aucune

## pages
Composant React servant de Page NextJS. [Plus d'infos](https://nextjs.org/docs#routing)

Dépendances: toutes

### Actions
`/actions`: les actions ou événements autour d'une zone par défaut

`/actions/[actionId]`: les détails d'une action ou d'un événement, et les actions ou événements autour de l'élément en question

### POIs
`/pois`: les POIs autour d'une zone par défaut

`/pois/[poiId]`: les détails d'un POI et les POIs autour de l'élément en question

### Routes spéciales
`/actions/[cityId]`: les actions ou événements de la ville en question 
`/pois/[cityId]`: les POIs de la ville en question

***cityId*** peut prendre une des valeurs suivantes :

```'paris' | 'lyon' | 'rennes' | 'lille' | 'hauts-de-seine' | 'seine-saint-denis'```

#### Liste des routes "statiques" existantes
- https://app.entourage.social/actions
- https://app.entourage.social/actions/paris
- https://app.entourage.social/actions/lyon
- https://app.entourage.social/actions/rennes
- https://app.entourage.social/actions/lille
- https://app.entourage.social/actions/hauts-de-seine
- https://app.entourage.social/actions/seine-saint-denis
- https://app.entourage.social/pois
- https://app.entourage.social/pois/paris
- https://app.entourage.social/pois/lyon
- https://app.entourage.social/pois/rennes
- https://app.entourage.social/pois/lille
- https://app.entourage.social/pois/hauts-de-seine
- https://app.entourage.social/pois/seine-saint-denis

## styles
Données relatives au style de l'application: thème Matérial UI, liste des couleurs utilisé, etc...  

### Breakpoints & Responsive design

```js
import React from 'react'
import styled from 'styled-components'
import { devices } from 'src/styles'

export const Container = styled.div`
  @media ${devices.mobile} {
    // CSS for mobile
  }

  @media ${devices.desktop} {
    // CSS for desktop
  }
`
```


## utils
Liste d'utilitaires JavaScript et TypeScript

### Plateformes

Il arrive souvent d'avoir besoin de créer un composant spécique par plateforme (mobile / tablette / desktop). Exemple:

`src/components/Header/index.ts`

```js
import { plateform } from 'src/utils/misc'
import { Header as Desktop } from './Header.desktop'
import { Header as Mobile } from './Header.mobile'

export const Header = plateform({
  Mobile,
  Desktop,
})
```

`App.tsx`

```js
import { Header } from 'src/components/Header'

export function App() {
  return (
    <Header />
    ...
  )
}
```

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
