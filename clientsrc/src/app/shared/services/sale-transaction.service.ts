import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SaleTransactionService extends ServiceBase {
    exportSaleTransactionCSV(fromDate: string, toDate: string, storeIds: string[]) {
        let request = '';
        if (storeIds == null) {
            request = null;
        } else {
            storeIds.forEach(x => {
                request += `storeIds=${x}`;
                if (storeIds.indexOf(x) < (storeIds.length - 1)) {
                    request += '&';
                }
            });
        }
        return this
            .get<any>(`${environment.app.retail.apiUrl}/api/sale-transaction/exportcsv?fromDate=${fromDate}&toDate=${toDate}&${request}`,
                null, { responseType: 'text/csv' });
    }
}
