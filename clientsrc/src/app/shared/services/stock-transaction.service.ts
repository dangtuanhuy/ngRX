import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { StockTransaction } from 'src/app/ims/goods-inwards/goods-inward.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StockTransactionService extends ServiceBase {
    getByPurchaseOrders(ids: string[]) {
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
        return this.get<StockTransaction[]>(`${environment.app.ims.apiUrl}/api/stock-transaction/ids?${request}`);
    }

    getByReturnOrders(ids: string[]) {
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
        return this.get<StockTransaction[]>(`${environment.app.ims.apiUrl}/api/stock-transaction/returnorders?${request}`);
    }
}
