import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { Observable } from 'rxjs';
import { StockTypeModel } from 'src/app/ims/goods-inwards/goods-inward.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockTypeService extends ServiceBase {

  getAllWithoutPaging(): Observable<Array<StockTypeModel>> {
    return this.list(`${environment.app.ims.apiUrl}/api/{stocktypes}`);
  }

  getAllPurchaseStockType(): Observable<Array<StockTypeModel>> {
    return this.list(`${environment.app.purchaseOrder.apiUrl}/api/stocktypes/all`);
  }
}
