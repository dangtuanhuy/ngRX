import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { BarCodeProductViewModel } from 'src/app/ims/products/product';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BarCodeService extends ServiceBase {
    getByProduct(productId: string) {
        return this.get<BarCodeProductViewModel>(`${environment.app.ims.apiUrl}/api/barcode/${productId}`);
    }
}
