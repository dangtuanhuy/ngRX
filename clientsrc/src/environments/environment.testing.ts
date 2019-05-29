export const environment = {
  production: true,
  app:
  {
    ims: {
      url: 'http://192.168.70.170:4100',
      apiUrl: 'http://192.168.70.170:5001',
    },
    purchaseOrder: {
      url: 'http://192.168.70.170:4200',
      apiUrl: 'http://192.168.70.170:5002'
    },
    retail: {
      url: 'http://192.168.70.170:4400',
      apiUrl: 'http://192.168.70.170:5004'
    },
    promotion: {
      url: 'http://192.168.70.170:4300',
      apiUrl: 'http://192.168.70.170:5003'
    },
    report: {
      apiUrl: 'http://192.168.70.170:5009'
    }
  },
  idsApiUrl: 'http://192.168.70.170:61555',
  loggingApiUrl: 'http://192.168.70.170:6001',
  authorizeDeviceUrl: 'http://192.168.70.170:61555/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'http://192.168.70.170:61555/.well-known/openid-configuration',
    requireHttps: false,
    url: 'http://192.168.70.170:61555',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};
