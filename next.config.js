// eslint-disable-next-line
require('dotenv').config()

const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    url: false
  },
  webpack(config) {
    config.resolve.modules.push(__dirname)
    return config
  },
  env: {
    API_V1_URL: process.env.API_V1_URL,
    API_KEY: process.env.API_KEY,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
  },
})
