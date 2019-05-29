// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  app:
  {
    ims: {
      url: 'http://localhost:4100',
      apiUrl: 'http://localhost:5001'
    },
    purchaseOrder: {
      url: 'http://localhost:4200',
      apiUrl: 'http://localhost:5002'
    },
    retail: {
      url: 'http://localhost:4400',
      apiUrl: 'http://localhost:5004'
    },
    promotion: {
      url: 'http://localhost:4300',
      apiUrl: 'http://localhost:5003'
    },
    report: {
      apiUrl: 'http://localhost:5009'
    }
  },
  idsApiUrl: 'http://localhost:61555',
  loggingApiUrl: 'http://localhost:6001',
  authorizeDeviceUrl: 'http://localhost:61555/device',
  ids: {
    issuer: 'http://harvey-ids',
    loadDocumentUrl: 'http://localhost:61555/.well-known/openid-configuration',
    requireHttps: false,
    url: 'http://localhost:61555',
    clientId: 'harvey-rims-page',
    scope: 'openid profile email phone harvey.rims.api roles'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
