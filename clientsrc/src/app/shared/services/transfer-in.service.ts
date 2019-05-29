import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import {  AddTransferInRequestModel, InventoryTransactionTransferInViewModel } from 'src/app/ims/transfer-in/transfer-in.model';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { FilterRequestModel } from 'src/app/ims/goods-inwards/goods-inward.model';
import { QueryString } from '../base-model/query-string';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransferInService extends ServiceBase {

    getInventoryTransactionTransferIns(page: number = 1, numberItemsPerPage: number = 10,
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
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/transferin`,
        queryStrings,
        new PagingFilterCriteria(page, numberItemsPerPage));
    }

    add(request: AddTransferInRequestModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/transferin`, request);
    }

    getBy(id: string): Observable<InventoryTransactionTransferInViewModel> {
        return this.get(`${environment.app.ims.apiUrl}/api/transferin/${id}`);
    }
}
