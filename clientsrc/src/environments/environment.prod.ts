export const environment = {
  production: true,
  app:
  {
    ims: {
      url: 'https://pim.app.toyorgame.com.sg',
      apiUrl: 'https://api.pim.toyorgame.com.sg',
    },
    purchaseOrder: {
      url: 'https://po.app.toyorgame.com.sg',
      apiUrl: 'https://api.po.toyorgame.com.sg'
    },
    retail: {
      url: 'https://retail.app.toyorgame.com.sg',
      apiUrl: 'https://api.retail.toyorgame.com.sg'
    },
    promotion: {
      url: 'https://promotion.app.toyorgame.com.sg',
      apiUrl: 'https://api.promotion.toyorgame.com.sg'
    },
    report: {
      apiUrl: 'https://report.app.toyorgame.com.sg'
    }
  },
  idsApiUrl: 'https://ids.toyorgame.com.sg',
  loggingApiUrl: 'https://api.logging.toyorgame.com.sg',
  authorizeDeviceUrl: 'https://ids.toyorgame.com.sg/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'https://ids.toyorgame.com.sg/.well-known/openid-configuration',
    requireHttps: false,
    url: 'https://ids.toyorgame.com.sg',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};
