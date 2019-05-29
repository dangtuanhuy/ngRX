import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { ReturnOrderListModel, ReturnOrderModel } from 'src/app/ims/goods-returns/goods-return.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })


export class ReturnOrderService extends ServiceBase {
    getByVendor(vendorId: string) {
        return this.get<ReturnOrderListModel[]>(`${environment.app.ims.apiUrl}/api/return-order/vendor/${vendorId}`);
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
        return this.get<ReturnOrderModel[]>(`${environment.app.ims.apiUrl}/api/return-order/grt?${request}`);
    }
}
