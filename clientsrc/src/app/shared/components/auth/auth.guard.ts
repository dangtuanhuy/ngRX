import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as userActions from './state/user.actions';
import * as fromRoot from '../../state/app.state';
import { environment } from 'src/environments/environment';
import { UserRole } from '../../constant/user-role.constant';

@Injectable()
export class AuthGuard implements CanActivate {

    purchaserPermission = ['/vendors', '/purchase-orders', '/return-orders', '/approvals', '/report', '/report-sale-performance'];

    purchaseManagerPermission = ['/vendors', '/purchase-orders', '/return-orders',
                                '/approvals', '/report', '/products', '/categories', '/brands', '/fields', '/field-templates',
                                 '/report-sale-performance'];

    inventoryManagerPermission =  ['/vendors', '/purchase-orders', '/return-orders',
                                    '/approvals', '/products', '/categories', '/brands', '/fields', '/field-templates',
                                    '/assortments', '/locations', '/dashboard', '/stock-initial', '/goods-inward',
                                    '/goods-return', '/stock-allocation', '/transfer-outs', '/transfer-ins', '/reasons',
                                    '/report', '/report-sale-performance'];

    warehouseKeeperPermission = ['/dashboard', '/goods-inward', '/goods-return',
                                '/transfer-outs', '/transfer-ins', '/stock-request', '/report', '/report-sale-performance'];

    saleManagerPermission = ['/discount-promotion', '/retail', '/report', '/report-sale-performance'];

    adminStaffPermission = ['/dashboard', '/transfer-outs', '/transfer-ins', '/reasons', '/stock-request'];

    constructor(
        private oauthService: OAuthService,
        private store: Store<fromRoot.State>) {
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        let canActive = false;
        await this.oauthService
            .loadDiscoveryDocument(environment.ids.loadDocumentUrl)
            .then(doc => {
                canActive = this.oauthService.hasValidAccessToken();
                if (this.oauthService.hasValidAccessToken()) {
                    this.oauthService.loadUserProfile()
                        .then((userProfile: any) => {
                            if (userProfile) {
                                this.store.dispatch(new userActions.LoginSuccessul(userProfile));
                                if (!userProfile.role.includes(UserRole.Administrator)) {
                                  canActive = this.checkRolePermission(userProfile);
                                }
                            }
                        }).catch(error => {
                            if (error.status === 401) {
                                this.oauthService.initImplicitFlow();
                            }
                        });
                }
            });
        return canActive;
    }

    public checkRolePermission(userProfile: any): boolean {
        if (userProfile.role.includes(UserRole.Purchaser)) {
            if (window.location.origin === environment.app.purchaseOrder.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.purchaseOrder.url}/vendors`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }


        if (userProfile.role.includes(UserRole.PurchaseManager)) {
            if (window.location.origin === environment.app.purchaseOrder.url) {
                if (!this.purchaseManagerPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.purchaseOrder.url}/vendors`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.ims.url) {
                if (!this.purchaseManagerPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.ims.url}/products`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }

        if (userProfile.role.includes(UserRole.InventoryManager)) {
            if (window.location.origin === environment.app.purchaseOrder.url) {
                if (!this.inventoryManagerPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.purchaseOrder.url}/vendors`;
                } else {
                    return true;
                }
            }

            if (window.location.origin === environment.app.ims.url) {
                if (!this.inventoryManagerPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.ims.url}/products`;
                } else {
                    return true;
                }
            }

            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }

        if (userProfile.role.includes(UserRole.WarehouseStaff)) {
            if (window.location.origin === environment.app.ims.url) {
                if (!this.warehouseKeeperPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.ims.url}/dashboard`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }

        if (userProfile.role.includes(UserRole.SalesManager)) {
            if (window.location.origin === environment.app.promotion.url) {
                if (!this.saleManagerPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.promotion.url}`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }

        if (userProfile.role.includes(UserRole.AdminStaff)) {
            if (window.location.origin === environment.app.ims.url) {
                if (!this.adminStaffPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.ims.url}/transfer-outs`;
                } else {
                    return true;
                }
            }
            if (window.location.origin === environment.app.retail.url) {
                if (!this.purchaserPermission.includes(window.location.pathname)) {
                    window.location.href = `${environment.app.retail.url}/report`;
                } else {
                    return true;
                }
            }
        }

        return false;
    }
}
