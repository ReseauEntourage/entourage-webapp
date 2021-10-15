export const constants = {
  AUTH_TOKEN_KEY: 'authToken',
  SENSITIZATION_POPUP_KEY: 'hasSeenSensitizationPopup',
  AUTH_TOKEN_TTL: 30 * 24 * 60 * 60, // unit: seconds
  MARKER_DIAMETER: 250, // unit: meters
  MAIL_TO_REPORT: 'guillaume@entourage.social',
  FB_APP_ID: '280727035774134',
  DEFAULT_LOCATION: {
    DISPLAY_ADDRESS: 'Paris',
    CENTER: {
      lat: 48.856491799999986,
      lng: 2.334808400000014,
    },
    ZOOM: 14,
  },
  POI_DISTANCE: 1,
  CHARTER_LINK: 'https://blog.entourage.social/charte-ethique-grand-public',
  WORKSHOP_LINK_POPUP: 'https://bit.ly/2O7naY7',
  WORKSHOP_LINK_CARD: 'https://bit.ly/3shEwjc',
  WORKSHOP_LINK_MOBILE: 'http://bit.ly/2YIFPvl',
  ADMIN_ASSO_URL: 'organization_admin_redirect?token=',
  POI_FORM_LINK: 'links/propose-poi/redirect?token=',
  FEED_ITEM_CACHE_TTL_SECONDS: 1000 * 60,
  GEOLOCATION_TTL: 1000 * 60,
  GEOLOCATION_TIMEOUT: 1000 * 5,
  SOLIGUIDE_URL: 'https://soliguide.fr/',
  GUS_LYON_2019_URL:
    'https://www.lyon.fr/sites/lyonfr/files/content/documents/2019-01/Guide%20de%20l%20urgence%20sociale%202019_0.pdf',
  GUS_LYON_2021_URL: 'https://www.lyon.fr/sites/lyonfr/files/content/documents/2021-01/LYON_GUS_2021.pdf',
  WEBAPP_PROD_LINK: 'https://app.entourage.social/actions',
  IOS_LINK: 'https://apps.apple.com/fr/app/entourage-r%C3%A9seau-solidaire/id1072244410',
  ANDROID_LINK: 'https://play.google.com/store/apps/details?id=social.entourage.android',
  PASSWORD_TIMEOUT: 30, // unit: seconds
  NOTIFICATIONS_QUEUE_MAX: 50,
}
