Entourage Web App
---

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

## Bibliothèques internes
* Forms - [react-hook-form](https://react-hook-form.com)
* Styles - [styled-components](https://www.styled-components.com)
* HTTP client - [axios](https://github.com/axios/axios)
* WebSocket client - [socket.io-client](https://github.com/socketio/socket.io-client)

# Installation
...

# Architecture
...

# Storybook

Créer un fichier `*.stories.tsx` au même que le componsant

```
Button.tsx
Button.stories.ts
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
