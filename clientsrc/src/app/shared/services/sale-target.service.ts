import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { UpdateSaleTargetModel, SaleTargetModel } from 'src/app/retail/sale-target/sale-target.model';
import { QueryString } from '../base-model/query-string';
import { Guid } from '../utils/guid.util';

@Injectable({ providedIn: 'root' })
export class SaleTargetService extends ServiceBase {

    public getAll(page: number = 1, numberItemsPerPage: number = 10) {
        return this.page(`${environment.app.retail.apiUrl}/api/sale-target`, new PagingFilterCriteria(page, numberItemsPerPage));
    }

    public getReport(page: number = 1, numberItemsPerPage: number = 10, channelId: string, date: string) {
        const queryStrings = [];
        queryStrings.push(new QueryString('channelId', channelId ? channelId : Guid.empty() ));
        queryStrings.push(new QueryString('date', date));
        return this.pageWithQueryString(`${environment.app.retail.apiUrl}/api/sale-target/report`,
                                        queryStrings, new PagingFilterCriteria(page, numberItemsPerPage));
    }

    public getOrderItems(storeId: string, fromDate: string, toDate: string) {
        return this.get(`${environment.app.retail.apiUrl}/api/OrderItems?locationId=${storeId}&fromDate=${fromDate}&toDate=${toDate}`);
    }

    public addSaleTarget(data: SaleTargetModel) {
        return this.post(`${environment.app.retail.apiUrl}/api/sale-target`, data);
    }

    public update(data: UpdateSaleTargetModel) {
        return this.put(`${environment.app.retail.apiUrl}/api/sale-target`, data);
    }

    public deleteSaleTarget(saleTargetId: string) {
        return this.delete(`${environment.app.retail.apiUrl}/api/sale-target?Id=${saleTargetId}`);
    }
}
