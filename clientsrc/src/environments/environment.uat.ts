export const environment = {
  production: true,
  app:
  {
    ims: {
      url: 'https://pim.app.dev.retaildds.net',
      apiUrl: 'https://api.pim.dev.retaildds.net',
    },
    purchaseOrder: {
      url: 'https://po.app.dev.retaildds.net',
      apiUrl: 'https://api.po.dev.retaildds.net'
    },
    retail: {
      url: 'https://retail.app.dev.retaildds.net',
      apiUrl: 'https://api.retail.dev.retaildds.net'
    },
    promotion: {
      url: 'https://promotion.app.dev.retaildds.net',
      apiUrl: 'https://api.promotion.dev.retaildds.net'
    },
    report: {
      apiUrl: 'https://report.app.dev.retaildds.net'
    }
  },
  idsApiUrl: 'https://ids.crm.dev.retaildds.net',
  loggingApiUrl: 'https://api.logging.dev.retaildds.net ',
  authorizeDeviceUrl: 'https://ids.crm.dev.retaildds.net/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'https://ids.crm.dev.retaildds.net/.well-known/openid-configuration',
    requireHttps: false,
    url: 'https://ids.crm.dev.retaildds.net',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};
