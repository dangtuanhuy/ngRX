import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import {
  AllocationTransactionModel,
  UpdateStatusAllocationTransactionModel
} from 'src/app/ims/allocation-transaction/allocation-transaction.model';
import { QueryString } from '../base-model/query-string';
import { TransferOutRequestModel, AllocationTransactionByListIdModel } from 'src/app/ims/transfer-out/transfer-out.model';
import { FilterRequestModel } from 'src/app/ims/goods-inwards/goods-inward.model';


@Injectable({ providedIn: 'root' })
export class AllocationTransactionService extends ServiceBase {
  // getAll(page: number = 1, numberItemsPerPage: number = 10, queryText: string = '') {
  //   return this.pageWithSearchText(`${environment.app.ims.apiUrl}/api/allocation/transaction`,
  //                                          new PagingFilterCriteria(page, numberItemsPerPage), queryText);
  // }

  getAll(page: number = 1, numberItemsPerPage: number = 10,
    stockAllcationFilterRequestModel: FilterRequestModel) {

    const queryStrings = [];
    let statusIdString = '';
    let toLocationIdString = '';
    let fromLocationIdString = '';

    stockAllcationFilterRequestModel.statusIds.map( statusId => {
      statusIdString += statusId + '|';
    });

    stockAllcationFilterRequestModel.fromLocationIds.map( locationId => {
      fromLocationIdString += locationId + '|';
    });

    stockAllcationFilterRequestModel.toLocationIds.map( locationId => {
      toLocationIdString += locationId + '|';
    });

    queryStrings.push(new QueryString('statusIdString', statusIdString));
    queryStrings.push(new QueryString('toLocationIdString', toLocationIdString));
    queryStrings.push(new QueryString('fromLocationIdString', fromLocationIdString));
    queryStrings.push(new QueryString('queryString', stockAllcationFilterRequestModel.queryString));
    return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/allocation/transaction`,
    queryStrings,
    new PagingFilterCriteria(page, numberItemsPerPage));
  }


  getAllocationTransactionsByLocation(page: number = 1, numberItemsPerPage: number = 10, transferOutRequestModel: TransferOutRequestModel) {
    const queryStrings = [];
    queryStrings.push(new QueryString('fromLocationId', transferOutRequestModel.fromLocationId));
    queryStrings.push(new QueryString('toLocationId', transferOutRequestModel.toLocationId));
    queryStrings.push(new QueryString('fromDate', transferOutRequestModel.fromDate));
    queryStrings.push(new QueryString('toDate', transferOutRequestModel.toDate));
    return this.pageWithQueryString(`${environment.app.ims.apiUrl}/api/allocation/transaction/location`,
      queryStrings,
      new PagingFilterCriteria(page, numberItemsPerPage));
  }

  getAllocationTransactionsByListId(allocationTransactionByListIdModel: AllocationTransactionByListIdModel)
    : Observable<AllocationTransactionByListIdModel> {
    return this.post(`${environment.app.ims.apiUrl}/api/allocation/transaction/bylistid`, allocationTransactionByListIdModel);
  }

  getBy(id: string): Observable<AllocationTransactionModel> {
    return this.get(`${environment.app.ims.apiUrl}/api/allocation/transaction/${id}`);
  }

  getMassAllocation(inventoryTransactionId: string) {
    return this.get(`${environment.app.ims.apiUrl}/api/allocation/transaction/mass?inventoryTransactionId=${inventoryTransactionId}`);
  }

  getMassAllocationByDate(fromDate: string, toDate: string, fromLocationId: string) {
    // tslint:disable-next-line:max-line-length
    return this.list(`${environment.app.ims.apiUrl}/api/allocation/transaction/outlet?FromDate=${fromDate}&ToDate=${toDate}&FromLocationId=${fromLocationId}`);
  }

  add(allocationTransactionModel: AllocationTransactionModel): Observable<AllocationTransactionModel> {
    return this.post(`${environment.app.ims.apiUrl}/api/allocation/transaction`, allocationTransactionModel);
  }

  addMulti(allocationTransactionModel: Array<AllocationTransactionModel>, fromDate: string, toDate: string)
  : Observable<Array<AllocationTransactionModel>> {
    return this.post(`${environment.app.ims.apiUrl}/api/allocation/transaction/multi?FromDate=${fromDate}&ToDate=${toDate}`,
                        allocationTransactionModel);
  }

  update(allocationTransactionModel: AllocationTransactionModel): Observable<AllocationTransactionModel> {
    return this.put(`${environment.app.ims.apiUrl}/api/allocation/transaction/${allocationTransactionModel.id}`,
      allocationTransactionModel);
  }

  remove(id: string) {
    return this.delete(`${environment.app.ims.apiUrl}/api/allocation/transaction/${id}`);
  }

  updateStatus(updateStatusAllocationTransactionModel: UpdateStatusAllocationTransactionModel) {
    return this.put(`${environment.app.ims.apiUrl}/api/allocation/transaction/updateStatus/${updateStatusAllocationTransactionModel.id}`,
      updateStatusAllocationTransactionModel);
  }
}
