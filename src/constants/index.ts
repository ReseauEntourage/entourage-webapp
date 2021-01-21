export const constants = {
  AUTH_TOKEN_KEY: 'authToken',
  LOCALE_KEY: 'locale',
  AUTH_TOKEN_TTL: 30 * 24 * 60 * 60, // unit: seconds
  MARKER_DIAMETER: 250, // unit: meters
  // MAX_FEED_ITEM_UPDATED_AT_HOURS: 24 * 30, // unit: hours
  MAX_FEED_ITEM_UPDATED_AT_HOURS: 10000,
  MAIL_TO_REPORT: 'guillaume@entourage.social',
  FB_APP_ID: '280727035774134',
  DEFAULT_LOCATION: {
    CITY_NAME: 'Paris',
    CENTER: {
      lat: 48.856491799999986,
      lng: 2.334808400000014,
    },
    ZOOM: 13,
  },
  CHARTER_LINK: 'https://blog.entourage.social/charte-ethique-grand-public',
  ADMIN_ASSO_LINK: 'https://entourage-back.herokuapp.com/organization_admin',
  FEED_ITEM_CACHE_TTL_SECONDS: 1000 * 60,
  LEGACY_WEB_APP_URL: 'https://entourage.social/app',

}
