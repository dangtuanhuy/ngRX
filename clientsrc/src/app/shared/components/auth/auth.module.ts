import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, OAuthResourceServerErrorHandler, OAuthStorage } from 'angular-oauth2-oidc';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/user.reducer';
import { AuthResourceServerErrorHandler } from './auth.errorhandler';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [`${environment.app.ims.apiUrl}`,
        `${environment.app.purchaseOrder.apiUrl}`,
        `${environment.app.retail.apiUrl}`,
        `${environment.app.promotion.apiUrl}`],
        sendAccessToken: true
      }
    }),
    StoreModule.forFeature('auth', reducer)
  ],
  exports: [
  ],
  providers: [
    { provide: OAuthResourceServerErrorHandler, useClass: AuthResourceServerErrorHandler },
    { provide: OAuthStorage, useValue: localStorage },
  ],
})
export class AuthModule {
}
