import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import {
    PurchaseOrderModel, RequestPurchaseOrderModel,
    PurchaseOrderViewModel,
    PimPurchaseOrderListModel,
    PimPurchaseOrderModel,
    GetPurchaseOrderModel,
    UpdatePurchaseOrderModel,
    UpdatePurchaseOrderDateModel
} from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { QueryString } from '../base-model/query-string';

@Injectable({ providedIn: 'root' })


export class PurchaseOrderService extends ServiceBase {

    private users = [];
    getAllWithoutPaging() {
        return this.list(`${environment.app.purchaseOrder.apiUrl}/api/all`);
    }

    getAll(page: number = 1, numberItemsPerPage: number = 10, purchaseOrder: GetPurchaseOrderModel) {
        const queryStrings = [];
        queryStrings.push(new QueryString('queryText', purchaseOrder.queryText));
        queryStrings.push(new QueryString('status', purchaseOrder.status ? purchaseOrder.status : ''));
        queryStrings.push(new QueryString('stages', purchaseOrder.stages ? purchaseOrder.stages : ''));
        queryStrings.push(new QueryString('type', purchaseOrder.type ? purchaseOrder.type : ''));
        return this.pageWithQueryString(
            `${environment.app.purchaseOrder.apiUrl}/api/purchase-order`,
            queryStrings,
            new PagingFilterCriteria(page, numberItemsPerPage)
        );
    }

    getAllPurchaseOrder() {
        return this.get(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/all`);
    }

    getBy(id: string): Observable<PurchaseOrderModel> {
        return this.get(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${id}`);
    }

    add(purchaseOrder: RequestPurchaseOrderModel): Observable<any> {
        return this.post(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order`, purchaseOrder);
    }

    update(purchaseOrder: UpdatePurchaseOrderModel): Observable<UpdatePurchaseOrderModel> {
        return this.put(
            `${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${purchaseOrder.id}`,
            purchaseOrder
        );
    }

    updatePODate(purchaseOrder: UpdatePurchaseOrderDateModel) {
        return this.put(
            `${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${purchaseOrder.id}/date`,
            purchaseOrder
        );
    }

    remove(id: string) {
        return this.delete(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${id}`);
    }

    getCurrencies() {
        return this.list(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/currencies`);
    }

    getUsersManager(userRoles: string[]) {
        userRoles.forEach(userRole => {
            this.users.push(this.list(`${environment.idsApiUrl}/api/users?role=${userRole}`));
        });

        return forkJoin(this.users);
    }

    convert(id: string) {
        return this.put(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${id}/convert`);
    }

    bypass(id: string) {
        return this.put(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${id}/bypass`);
    }

    submit(id: string, managerId: string) {
        return this.put(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/${id}/submit?managerId=${managerId}`);
    }

    getByVendor(vendorId: string) {
        return this.get<PurchaseOrderViewModel[]>(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/vendor/${vendorId}`);
    }

    getByIds(ids: string[]) {
        let request = '';
        if (ids == null) {
            request = null;
        } else {
            ids.forEach(x => {
                request += `ids=${x}`;
                if (ids.indexOf(x) < (ids.length - 1)) {
                    request += '&';
                }
            });
        }
        return this.get<PurchaseOrderModel[]>(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/giw?${request}`);
    }

    // PIM
    getByVendorFromPIM(vendorId: string) {
        return this.get<PimPurchaseOrderListModel[]>(`${environment.app.ims.apiUrl}/api/purchase-order/vendor/${vendorId}`);
    }

    getByIdsFromPIM(ids: string[]) {
        let request = '';
        if (ids == null) {
            request = null;
        } else {
            ids.forEach(x => {
                request += `ids=${x}`;
                if (ids.indexOf(x) < (ids.length - 1)) {
                    request += '&';
                }
            });
        }
        return this.get<PimPurchaseOrderModel[]>(`${environment.app.ims.apiUrl}/api/purchase-order/giw?${request}`);
    }
}
