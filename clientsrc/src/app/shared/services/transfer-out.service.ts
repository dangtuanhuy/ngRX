import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { AddTransferOutRequestModel, InventoryTransactionTransferOutViewModel } from 'src/app/ims/transfer-out/transfer-out.model';
import { TransferInRequestModel } from 'src/app/ims/transfer-in/transfer-in.model';
import { QueryString } from '../base-model/query-string';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { Guid } from '../utils/guid.util';
import { FilterRequestModel } from 'src/app/ims/goods-inwards/goods-inward.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransferOutService extends ServiceBase {

    add(request: AddTransferOutRequestModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/transferout`, request);
    }

    getInventoryTransactionTransferOuts(page: number = 1, numberItemsPerPage: number = 10,
        goodsReturnRequestModel: FilterRequestModel) {

        const queryStrings = [];
        let statusIdString = '';
        let toLocationIdString = '';
        let fromLocationIdString = '';

        goodsReturnRequestModel.statusIds.map( statusId => {
        statusIdString += statusId + '|';
        });

        goodsReturnRequestModel.fromLocationIds.map( locationId => {
        fromLocationIdString += locationId + '|';
        });

        goodsReturnRequestModel.toLocationIds.map( locationId => {
        toLocationIdString += locationId + '|';
        });

        queryStrings.push(new QueryString('statusIdString', statusIdString));
        queryStrings.push(new QueryString('toLocationIdString', toLocationIdString));
        queryStrings.push(new QueryString('fromLocationIdString', fromLocationIdString));
        queryStrings.push(new QueryString('queryString', goodsReturnRequestModel.queryString));
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/transferout`,
        queryStrings,
        new PagingFilterCriteria(page, numberItemsPerPage));
    }

    getBy(id: string): Observable<InventoryTransactionTransferOutViewModel> {
        return this.get(`${environment.app.ims.apiUrl}/api/transferout/${id}`);
    }

    getTransferOutProductStockOnhand(fromLocationId: Guid, variantId: Guid) {
        return this.get<number>(`${environment.app.ims.apiUrl}/api/transferout/stockOnHand?fromLocationId=
                                                        ${fromLocationId}&variantId=${variantId}`);
    }

    getInventoryTransactionTransferOutsByLocation(page: number = 1,
        numberItemsPerPage: number = 10, transferInRequestModel: TransferInRequestModel) {
        const queryStrings = [];
        queryStrings.push(new QueryString('fromLocationId', transferInRequestModel.fromLocationId));
        queryStrings.push(new QueryString('toLocationId', transferInRequestModel.toLocationId));
        queryStrings.push(new QueryString('fromDate', transferInRequestModel.fromDate));
        queryStrings.push(new QueryString('toDate', transferInRequestModel.toDate));
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/transferout/location`,
          queryStrings,
          new PagingFilterCriteria(page, numberItemsPerPage));
      }
}
