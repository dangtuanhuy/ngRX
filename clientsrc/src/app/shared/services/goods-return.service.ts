import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { GRTModel } from 'src/app/ims/goods-returns/goods-return.model';
import { FilterRequestModel } from 'src/app/ims/goods-inwards/goods-inward.model';
import { QueryString } from '../base-model/query-string';

@Injectable({
    providedIn: 'root'
})
export class GoodsReturnService extends ServiceBase {

    getInventoryTransactionGoodsReturns(page: number = 1, numberItemsPerPage: number = 10,
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
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/goods-returns`,
        queryStrings,
        new PagingFilterCriteria(page, numberItemsPerPage));
    }

    add(request: GRTModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/goods-returns`, request);
    }
}
