import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authConfig: AuthConfig = {
  loginUrl: environment.ids.url + '/connect/authorize',
  logoutUrl: environment.ids.url + '/connect/endsession',
  requireHttps: environment.ids.requireHttps,
  issuer: environment.ids.issuer,
  skipIssuerCheck: true,
  redirectUri: window.location.origin + '/index.html',
  strictDiscoveryDocumentValidation: false,
  clientId: environment.ids.clientId,
  scope: environment.ids.scope,
  postLogoutRedirectUri: window.location.origin
};


