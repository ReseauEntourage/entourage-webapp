# webapp (entourage-webapp) — overview

> Added by the `entourage_specs` meta-repo. The submodule's own canonical README lives at `README.md`.

The Next.js 12 web client for the LOCAL product. Lets users browse and join community actions, view points of interest, manage neighbourhoods, send messages and access their profile from a desktop or mobile browser. Renders responsively (mobile/desktop variants per component), uses Material-UI v4, and ships a Storybook component library. Hosted on Heroku behind a custom Express wrapper (`server.js`) that handles CORS and SSL redirect in production.

## Interactions

- **Backend**: REST calls to the Rails API at `API_V1_URL` (typically `https://api.entourage.social/api/v1/` or its preprod counterpart).
- **Firebase**: full SDK integration for auth + analytics via the `FIREBASE_*` env vars (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId).
- **Google Maps**: `GOOGLE_MAP_API_KEY` for map rendering via `google-map-react`.
- **Sentry**: error tracking via `SENTRY_DSN` and the Sentry Webpack plugin (auto-uploads sourcemaps when `HEROKU_APP_ID` is present).
- **Heroku**: deployment target, with build metadata exposed via `HEROKU_APP_ID`, `HEROKU_APP_NAME`, `HEROKU_RELEASE_VERSION`, `HEROKU_RELEASE_COMMIT`.
- **Admin panel**: separate URL referenced via `ADMIN_ASSO_URL`.
- **Papertrail**: optional log aggregation via `PAPERTRAIL_API_TOKEN`.

## Installing / scripts

Yarn-managed. Custom Express server wrapper in `server.js`.

```bash
yarn install
yarn dev                 # node server.js
yarn build               # next build
yarn start               # NODE_ENV=production node server.js

yarn test                # ts-check + eslint + jest (full)
yarn test:ts-check       # tsc --noEmit
yarn test:eslint         # eslint .
yarn test:jest           # jest
yarn test:jest:watch

yarn storybook           # Storybook dev server
yarn deploy-storybook    # publish Storybook to GitHub Pages
```

`next.config.js` ships ~20 redirect rules for legacy URLs, security headers (CSP, HSTS, XSS protection), and conditionally activates the Sentry Webpack plugin when `HEROKU_APP_ID` is set.

## External libraries

- **Framework**: `next@12.0.7`, `react@17.0.2`, `react-dom@17.0.2`.
- **State**: `redux@4.0.5`, `react-redux@7.2.2`, `redux-saga@1.1.3`, `redux-persist@6.0.0`, `react-query@0.3.23`.
- **Forms**: `react-hook-form@6.8.2`.
- **UI**: `@material-ui/core@4.12.3`, `@material-ui/icons@4.11.2`, `styled-components@5.1.1`.
- **Maps**: `google-map-react@1.1.5`.
- **HTTP**: `axios@0.22.0`.
- **Validation**: `joi@17.2.1`.
- **Utils**: `lodash@4.17.21`, `date-fns@2.8.1`, `geolib@3.3.1`.
- **Tooling**: TypeScript 4.6.4, Jest, Storybook 5.3.14, ESLint 8.15.0.

## Used technologies

- **Language**: TypeScript 4.6.4.
- **Framework**: Next.js 12 + React 17 (custom Express server).
- **Styling**: styled-components, Material-UI v4, SCSS.
- **State**: Redux + Redux-Saga + Redux-Persist + react-query.
- **Testing**: Jest + ESLint + TypeScript type-checking; Storybook for component docs.
- **Error tracking**: Sentry (with Webpack plugin for sourcemaps).
- **Deployment**: Heroku.

## Secrets (`.env.dist`)

`ADMIN_ASSO_URL`, `API_KEY`, `API_V1_URL`,
`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_MEASUREMENT_ID`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_APP_ID`,
`GOOGLE_MAP_API_KEY`,
`HEROKU_APP_ID`, `HEROKU_APP_NAME`, `HEROKU_RELEASE_VERSION`, `HEROKU_RELEASE_COMMIT`,
`PAPERTRAIL_API_TOKEN`,
`SENTRY_AUTH_TOKEN`, `SENTRY_DSN`,
`SERVER_URL`.

`NEXT_PUBLIC_*` and inlined Firebase config are bundled at build time. There is no runtime secret store other than Heroku config vars.
