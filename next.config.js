// eslint-disable-next-line
require('dotenv').config()

module.exports = {
  webpack(config) {
    config.resolve.modules.push(__dirname)
    return config
  },
  env: {
    API_V1_URL: process.env.API_V1_URL,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
  },
}
