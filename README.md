Entourage Web App
---

* [Technologies](#technologies)
    * [Outils](#outils)
    * [Bibliothèques internes](#bibliothèques-internes)
* [Installation](#installation)
* [Architecture](#architecture)
* [API](#api)
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
* Styles - [styled-components](https://www.styled-components.com)
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
import { api } from 'src/api'

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

Le store permet de stocker les données à un seul endroit dans l'application afin de respect le principe de [`source de confiance (single source of truth)`](https://en.wikipedia.org/wiki/Single_source_of_truth).

Ici, le store utilisé est redux, avec un wrapper spécifique pour NextJS.

## Fetch et lecture des données

```js
import { api } from 'src/api'
import { actions, useReadResource } from 'src/store'

interface Props {
  requestKey: string
}

function MyPage(props) {
  const { requestKey } = props

  const [feeds] = useReadResource('feeds', requestKey)

  return (
    <div>
      {feeds.map(feed => (
        ...
      ))}
    </div>
  )
}

MyPage.getInitialProps = async (ctx) => {
  const feedsResponse = await api.ssr(ctx).request({
    routeName: 'GET feeds',
  })
  
  const action = actions.fetchResources('feeds', feedsResponse)
  const { requestKey } = ctx.store.dispatch(action)

  return {
    requestKey,
  }
}
```

`feedsResponse` correspond à un object `AxiosResponse`.

`fetchResources()`  va utiliser les informations de la requête (url, method, params) pour stocker les informations dans le store de la resource `feeds`  
L'objet `action` va contenir `requestKey` qui est un identifiant unique de la requête, généré à partir des information de la requête `url`, `method` et `params` (optionnel).  

Nous avons besoin d'envoyer `requestKey` en paramètre à notre Page pour que celle-ci puisse récupérer les données tout en s'abonnant aux modifications futures. Nous pourrions directement retourner les données de `feedsResponse` mais nous ne bénéficerions pas des mises à jours du store.


## Ecriture de données

```js
import React, { useCallback } from 'react';
import { api } from 'src/api';
import { actions, useReadResource, useLazyRequest } from 'src/store'

function MyPage(props) {
  const { requestKey } = props

  const [feeds] = useReadResource('feeds', requestKey)
  const [createFeed] = useLazyRequest('feeds', 'create');

  const onClickAdd = useCallback(() => {
    createFeed({
      ...
    })
  }, [])

  return (
    <div>
      {feeds.map(feed => (
        ...
      ))}
      <button onClick={onClickAdd}>Ajouter</button>
    </div>
  )
}
```

# Storybook

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
