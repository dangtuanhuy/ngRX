export const environment = {
  production: true,
  app:
  {
    ims: {
      url: 'https://pim.app.harvey.demo.retaildds.net',
      apiUrl: 'https://api.pim.harvey.demo.retaildds.net',
    },
    purchaseOrder: {
      url: 'https://po.app.harvey.demo.retaildds.net',
      apiUrl: 'https://api.po.harvey.demo.retaildds.net'
    },
    retail: {
      url: 'https://retail.app.harvey.demo.retaildds.net',
      apiUrl: 'https://api.retail.dev.retaildds.net'
    },
    promotion: {
      url: 'https://promotion.app.dev.retaildds.net',
      apiUrl: 'https://api.promotion.harvey.demo.retaildds.net'
    },
    report: {
      apiUrl: 'https://report.app.harvey.demo.retaildds.net'
    }
  },
  idsApiUrl: 'https://ids.harvey.demo.retaildds.net',
  loggingApiUrl: 'https://api.logging.harvey.demo.retaildds.net',
  authorizeDeviceUrl: 'https://ids.harvey.demo.retaildds.net/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'https://ids.harvey.demo.retaildds.net/.well-known/openid-configuration',
    requireHttps: false,
    url: 'https://ids.harvey.demo.retaildds.net',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};
