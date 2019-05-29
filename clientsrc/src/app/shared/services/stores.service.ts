import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { SaleTransactionModel, StoreModel } from 'src/app/retail/stores/stores.component';
import { Observable } from 'rxjs';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class StoreService extends ServiceBase {
    exportSaleTransactions(deviceCode: string, model: SaleTransactionModel) {
        const options = {
            headers: new HttpHeaders({
                'x-device-code': deviceCode,
            }),
            responseType: 'text/csv'
        };

        return this.post<any>(`${environment.app.retail.apiUrl}/api/syncs/catalog/saleTransactions`, model, options);
    }

    getStoreWithPaging(page: number = 1, numberItemsPerPage: number = 10) {
        return this.page(`${environment.app.retail.apiUrl}/api/stores`, new PagingFilterCriteria(page, numberItemsPerPage));
    }

    getAll() {
        return this.get(`${environment.app.retail.apiUrl}/api/stores/all`);
    }

    update(storeModel: StoreModel): Observable<StoreModel> {
        return this.put(
            `${environment.app.retail.apiUrl}/api/stores/${storeModel.id}`,
            storeModel
        );
    }

    getBy(id: string): Observable<StoreModel> {
        return this.get(`${environment.app.retail.apiUrl}/api/stores/${id}`);
    }

    getById(id: string): Observable<StoreModel> {
        return this.get(`${environment.app.retail.apiUrl}/api/stores/management/${id}`);
    }

    generateStoreSettings(): Observable<StoreModel> {
        return this.post(`${environment.app.retail.apiUrl}/api/stores/storeSettings/generation`);
    }
}

