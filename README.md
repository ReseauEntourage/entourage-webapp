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
...

# Architecture
...

# API

Le schéma de l'api est défini dans [src/api/schema](src/api/schema.ts) et utilise le format [request-schema](https://github.com/GuillaumeJasmin/request-schema).

Utilisation de l'API:
```js
import { api } from 'src/network/api'

const users = await api.request({
  routeName: 'GET users',
  urlParams: {
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

## Lancer le styleguide
```
yarn storybook
```

:warning: Next écrase la configuration du fichier tsconfig.json de storybook. Il faut changer la variable suivante:
```diff
- "jsx": "preserve",
+ "jsx": "react",
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
