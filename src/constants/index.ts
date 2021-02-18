export const constants = {
  AUTH_TOKEN_KEY: 'authToken',
  SENSITIZATION_POPUP_KEY: 'hasSeenSensitizationPopup',
  AUTH_TOKEN_TTL: 30 * 24 * 60 * 60, // unit: seconds
  MARKER_DIAMETER: 250, // unit: meters
  MAX_FEED_ITEM_UPDATED_AT_HOURS: 24 * 30, // unit: hours
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
  POI_MAX_DISTANCE: 5,
  POI_MIN_DISTANCE: 1,
  POI_DISTANCE_BREAKPOINT: 15,
  CHARTER_LINK: 'https://blog.entourage.social/charte-ethique-grand-public',
  WORKSHOP_LINK: 'https://bit.ly/2O7naY7',
  ADMIN_ASSO_LINK: 'https://entourage-back.herokuapp.com/organization_admin',
  FEED_ITEM_CACHE_TTL_SECONDS: 1000 * 60,
  SOLIGUIDE_URL: 'https://soliguide.fr/',
  GUS_LYON_2019_URL:
    'https://www.lyon.fr/sites/lyonfr/files/content/documents/2019-01/Guide%20de%20l%20urgence%20sociale%202019_0.pdf',
  GUS_LYON_2021_URL: 'https://www.lyon.fr/sites/lyonfr/files/content/documents/2021-01/LYON_GUS_2021.pdf',
}
