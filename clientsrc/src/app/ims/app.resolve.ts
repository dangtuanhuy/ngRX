import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/constant/user-role.constant';

@Injectable()
export class Resolver {

    constructor(
        private oauthService: OAuthService,
        private router: Router) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.oauthService
            .loadDiscoveryDocument(environment.ids.loadDocumentUrl)
            .then(() => {
                this.oauthService.loadUserProfile()
                    .then((userProfile: any) => {
                        if (userProfile) {
                            if (userProfile.role.includes(UserRole.Administrator)
                                    || userProfile.role.includes('PurchaseManager')
                                    || userProfile.role.includes('InventoryManager')) {
                                window.location.href = `${environment.app.ims.url}/products`;
                            }
                            if (userProfile.role.includes(UserRole.WarehouseStaff)) {
                                window.location.href = `${environment.app.ims.url}/dashboard`;
                            }
                            if (userProfile.role.includes(UserRole.AdminStaff)) {
                                window.location.href = `${environment.app.ims.url}/transfer-outs`;
                            }
                        }
                    }).catch(error => {
                        if (error.status === 401) {
                            this.oauthService.initImplicitFlow();
                        }
                    });
            });

    }
}
