export const environment = {
  production: true,
  app:
  {
    ims: {
      url: 'https://pim.app.dev.toyorgame.com.sg',
      apiUrl: 'https://api.pim.dev.toyorgame.com.sg',
    },
    purchaseOrder: {
      url: 'https://po.app.dev.toyorgame.com.sg',
      apiUrl: 'https://api.po.dev.toyorgame.com.sg'
    },
    retail: {
      url: 'https://retail.app.dev.toyorgame.com.sg',
      apiUrl: 'https://api.retail.dev.toyorgame.com.sg'
    },
    promotion: {
      url: 'https://promotion.app.dev.toyorgame.com.sg',
      apiUrl: 'https://api.promotion.dev.toyorgame.com.sg'
    },
    report: {
      apiUrl: 'https://report.app.dev.toyorgame.com.sg'
    }
  },
  idsApiUrl: 'https://ids.dev.toyorgame.com.sg',
  loggingApiUrl: 'https://api.logging.dev.toyorgame.com.sg',
  authorizeDeviceUrl: 'https://ids.dev.toyorgame.com.sg/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'https://ids.dev.toyorgame.com.sg/.well-known/openid-configuration',
    requireHttps: false,
    url: 'https://ids.dev.toyorgame.com.sg',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};
