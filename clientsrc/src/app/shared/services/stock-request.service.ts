import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import {
    StockRequestModel,
    StockRequestModelAddRequest,
    StockRequestListModel,
    StockRequestModelUpdateRequest
} from 'src/app/ims/stock-requests/stock-request.model';
import { QueryString } from '../base-model/query-string';
import { FilterRequestModel } from 'src/app/ims/goods-inwards/goods-inward.model';

const stockRequestApi = 'api/stockrequest';
@Injectable({ providedIn: 'root' })
export class StockRequestService extends ServiceBase {

    getAll(page: number = 1, numberItemsPerPage: number = 10,
                                        goodsInwardRequestModel: FilterRequestModel) {
        const queryStrings = [];
        let statusIdString = '';
        let toLocationIdString = '';
        let fromLocationIdString = '';

        goodsInwardRequestModel.statusIds.map( statusId => {
        statusIdString += statusId + '|';
        });

        goodsInwardRequestModel.fromLocationIds.map( locationId => {
        fromLocationIdString += locationId + '|';
        });

        goodsInwardRequestModel.toLocationIds.map( locationId => {
        toLocationIdString += locationId + '|';
        });

        queryStrings.push(new QueryString('statusIdString', statusIdString));
        queryStrings.push(new QueryString('toLocationIdString', toLocationIdString));
        queryStrings.push(new QueryString('fromLocationIdString', fromLocationIdString));
        queryStrings.push(new QueryString('queryString', goodsInwardRequestModel.queryString));
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/${stockRequestApi}`,
          queryStrings,
          new PagingFilterCriteria(page, numberItemsPerPage));
    }

    getById(id: string) {
        return this.get<StockRequestModel>(`${environment.app.ims.apiUrl}/${stockRequestApi}/${id}`);
    }

    add(stockRequest: StockRequestModelAddRequest) {
        return this.post<any>(`${environment.app.ims.apiUrl}/${stockRequestApi}`, stockRequest);
    }

    edit(stockRequest: StockRequestModelUpdateRequest) {
        return this.put<any>(`${environment.app.ims.apiUrl}/${stockRequestApi}/${stockRequest.id}`, stockRequest);
    }
}
