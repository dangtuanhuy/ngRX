import { Injectable } from '@angular/core';
import {
            GIWModel,
            GenerateBarCodeCommand,
            UpdateGIWStatusModel,
            FilterRequestModel
       } from 'src/app/ims/goods-inwards/goods-inward.model';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { QueryString } from '../base-model/query-string';

@Injectable({
    providedIn: 'root'
})
export class GoodsInwardService extends ServiceBase {

    add(request: GIWModel) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/goods-inwards`, request);
    }

    generateBarCode(request: GenerateBarCodeCommand) {
        return this.post<any>(`${environment.app.ims.apiUrl}/api/goods-inwards/barcodes`, request);
    }

    getInventoryTransactionGoodsInwards(page: number = 1, numberItemsPerPage: number = 10,
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
        return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/goods-inwards`,
          queryStrings,
          new PagingFilterCriteria(page, numberItemsPerPage));
    }

    updateStatus(request: UpdateGIWStatusModel) {
        return this.put<any>(`${environment.app.ims.apiUrl}/api/goods-inwards`, request);
    }

    getGIWByInventoryTransactionId(inventoryTransactionId: string) {
        return this.get<any>(`${environment.app.ims.apiUrl}/api/goods-inwards/${inventoryTransactionId}`);
    }
}
