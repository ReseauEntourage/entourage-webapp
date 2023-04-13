// eslint-disable-next-line
require('dotenv').config()

const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'unsafe-inline';
  child-src 'self';
  style-src 'self';
  font-src 'self';
  img-src 'self';
};
`;

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin',
  },
  /* {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  }, */
];

module.exports = {
  cssLoaderOptions: {
    url: false
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react';
    }

    config.resolve.modules.push(__dirname)

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    if (!dev && process.env.HEROKU_APP_ID) {
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.HEROKU_APP_NAME,
          project: process.env.HEROKU_APP_NAME,

          include: '.',
          ignore: [
            'node_modules',
            'next.config.js',
            'jest.config.js',
            'jest.setupTests.js',
            'public'
          ],
        })
      );
    }

    return config
  },
  env: {
    API_V1_URL: process.env.API_V1_URL,
    API_KEY: process.env.API_KEY,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ADMIN_ASSO_URL: process.env.ADMIN_ASSO_URL,
    SERVER_URL: process.env.SERVER_URL,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/profile/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/users/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/groups/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/contents/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/contributions/new/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/solicitations/new/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/outings/new/:path*',
        destination: '/actions',
        permanent: false,
      },
      {
        source: '/contributions/:id/:path*',
        destination: '/actions/:id',
        permanent: false,
      },
      {
        source: '/solicitations/:id/:path*',
        destination: '/actions/:id',
        permanent: false,
      },
      {
        source: '/outings/:id/:path*',
        destination: '/actions/:id',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
}
