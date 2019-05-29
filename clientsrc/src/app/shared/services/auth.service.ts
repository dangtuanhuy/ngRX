import { Injectable } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { User } from 'src/app/shared/base-model/user.model';
import { authConfig } from 'src/app/shared/components/auth/auth.config';
import * as fromUserActions from '../components/auth/state/user.actions';
import * as appActions from '../state/app.action';
import { Store } from '@ngrx/store';
import * as fromRoot from '../state/app.state';
import { environment } from 'src/environments/environment';
import { CommonConstants } from '../constant/common.constant';
import { AccountService } from './account.service';

@Injectable()
export class AuthService {
    constructor(private oauthService: OAuthService,
        private store: Store<fromRoot.State>,
        private accountService: AccountService) { }

    public currentUser: User;
    public intervalCheckValidToken: any;

    public login() {
        this.oauthService.requestAccessToken = true;
        this.oauthService.loadDiscoveryDocument(environment.ids.loadDocumentUrl).then((doc) => {
            this.oauthService.tryLogin({ customHashFragment: location.hash }).then(() => {
                this.loggedInHanlder();
            });
        });
    }

    public logout() {
        this.clearIntervalCheckValidToken();
        this.oauthService.logOut();
    }

    public getAccessToken() {
        return this.oauthService.getAccessToken();
    }

    public configureWithNewConfigApi() {
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    }

    private loggedInHanlder() {
        const isAuthenticated = this.checkAuthenticated();
        if (isAuthenticated) {
            this.setIntervalCheckValidToken();
            this.redirectToPreviousUrl();
            const userClaims = this.oauthService.loadUserProfile()
                .then((userProfile: User) => {
                    if (userProfile) {
                        this.currentUser = userProfile;
                    }
                });
            this.getUsers();
        } else {
            this.setPreviousUrl();
            this.oauthService.initImplicitFlow();
        }
    }

    public checkAuthenticated() {
        return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
    }

    private setPreviousUrl() {
        localStorage.setItem(CommonConstants.previousLoginUrl, window.location.href);
    }

    private redirectToPreviousUrl() {
        const previousUrl = localStorage.getItem(CommonConstants.previousLoginUrl);
        if (previousUrl) {
            localStorage.removeItem(CommonConstants.previousLoginUrl);
            window.location.href = previousUrl;
        }
    }

    public setIntervalCheckValidToken(): void {
        const now = new Date();
        const accessTokenExpiration = this.oauthService.getAccessTokenExpiration() ? this.oauthService.getAccessTokenExpiration() : 0;
        const timeInterval = accessTokenExpiration - now.getTime();
        if (timeInterval > 0) {
            this.intervalCheckValidToken = setInterval(() => {
                this.logout();
            }, timeInterval);
        } else {
            this.logout();
        }
    }

    public clearIntervalCheckValidToken() {
        if (this.intervalCheckValidToken) {
            clearInterval(this.intervalCheckValidToken);
        }
    }

    getUsers() {
        this.accountService.getAll().subscribe(result => {
            if (result) {
                this.store.dispatch(new appActions.GetUsersSuccessAction(result));
            }
        });
    }
}
