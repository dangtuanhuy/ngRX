import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { Customer } from '../models/customer';
import { SchemaNames } from '../constants/schema-name.constant';
import { CustomerPagingModel } from '../view-models/customer-paging.model';
import { PagingExtension } from '../helpers/paging.extension';

@Injectable({ providedIn: 'root' })
export class CustomerRepository extends RepositoryBase<Customer> {
  Map(obj: any) {
    const result: Customer = {
      id: obj.id,
      name: obj.name,
      reward: obj.reward,
      store: obj.store,
      visit: obj.visit,
      customerCode: obj.customerCode,
      loyaltyPoint: obj.loyaltyPoint,
      walletPoint: obj.walletPoint,
      phoneNumber: obj.phoneNumber,
      isDelete: obj.isDelete ? obj.isDelete : false
    };
    return result;
  }

  constructor(protected appContextManager: AppContextManager) {
    super(appContextManager, SchemaNames.customer);
  }

  search(textSearch: string) {
    const context = this.appContextManager.GetLatestDbContext();
    const result = [];
    const data = context.objects(this.tableName)
      .filtered('isDelete = false')
      .filter(x => x.name.toUpperCase().includes(textSearch.toUpperCase())
        || x.phoneNumber.includes(textSearch)
        || x.customerCode.toUpperCase().includes(textSearch.toUpperCase())
      );
    if (!data.length) {
      context.close();
      return result;
    }
    data.forEach(element => {
      result.push(this.Map(element));
    });
    context.close();
    return result;
  }

  searchCustomersPaging(pageIndex: number, pageSize: number, textSearch: string, allowSearchWhenEmpty: boolean): CustomerPagingModel {
    const context = this.appContextManager.GetLatestDbContext();
    let data = [];
    if (textSearch || allowSearchWhenEmpty) {
      data = context.objects(this.tableName)
        .filtered('isDelete = false')
        .filter(x => x.name.toUpperCase().includes(textSearch.toUpperCase())
          || x.phoneNumber.includes(textSearch)
          || x.customerCode.toUpperCase().includes(textSearch.toUpperCase())
        );
    }
    const result = this.mapPagingData(data, pageIndex, pageSize);

    context.close();
    return result;
  }

  getCustomersPaging(pageIndex: number, pageSize: number): CustomerPagingModel {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).filtered('isDelete = false');
    const result = this.mapPagingData(data, pageIndex, pageSize);

    context.close();
    return result;
  }

  private mapPagingData(data: any[], pageIndex: number, pageSize: number): CustomerPagingModel {
    const result = new CustomerPagingModel();

    result.pageNumber = pageIndex;
    result.pageSize = pageSize;
    result.totalItem = data.length;
    result.customers = [];

    if (!data.length) {
      return result;
    }

    const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);
    pagedData.forEach(element => {
      result.customers.push(this.Map(element));
    });

    return result;
  }
}
