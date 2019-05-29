import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { VendorModel, VendorFilterRequestModel } from 'src/app/purchaseorder/vendors/vendor.model';
import { QueryString } from '../base-model/query-string';


@Injectable({ providedIn: 'root' })
export class VendorService extends ServiceBase {
  getAllWithoutPaging() {
    return this.list(`${environment.app.purchaseOrder.apiUrl}/api/all`);
  }

  getAll(page: number = 1, numberItemsPerPage: number = 10,
     vendorFilterRequestModel: VendorFilterRequestModel) {

    const queryStrings = [];
    let paymentTermIds = '';
    let currencyIds = '';
    let taxTypeIds = '';
    let queryString = '';

    vendorFilterRequestModel.paymentTermIds.map(item => {
      paymentTermIds += item + '|';
    });

    vendorFilterRequestModel.currencyIds.map(item => {
      currencyIds += item + '|';
    });

    vendorFilterRequestModel.taxTypeIds.map(item => {
      taxTypeIds += item + '|';
    });

    if (vendorFilterRequestModel.queryString) {
      queryString = vendorFilterRequestModel.queryString;
    }

    queryStrings.push(new QueryString('paymentTermIds', paymentTermIds));
    queryStrings.push(new QueryString('currencyIds', currencyIds));
    queryStrings.push(new QueryString('taxTypeIds', taxTypeIds));
    queryStrings.push(new QueryString('queryString', queryString));

    return this.pageWithQueryString(
      `${environment.app.purchaseOrder.apiUrl}/api/vendors`,
      queryStrings,
      new PagingFilterCriteria(page, numberItemsPerPage)
    )
  }

  getAllVendor() {
    return this.get<VendorModel[]>(`${environment.app.purchaseOrder.apiUrl}/api/vendors/all`);
  }

  getAllVendorFromPIM() {
    return this.get<VendorModel[]>(`${environment.app.ims.apiUrl}/api/vendors/all`);
  }

  getBy(id: string): Observable<VendorModel> {
    return this.get(`${environment.app.purchaseOrder.apiUrl}/api/vendors/${id}`);
  }

  add(vendor: VendorModel): Observable<VendorModel> {
    return this.post(`${environment.app.purchaseOrder.apiUrl}/api/vendors`, vendor);
  }

  update(vendor: VendorModel): Observable<VendorModel> {
    return this.put(
      `${environment.app.purchaseOrder.apiUrl}/api/vendors/${vendor.id}`,
      vendor
    );
  }

  remove(id: string) {
    return this.delete(`${environment.app.purchaseOrder.apiUrl}/api/vendors/${id}`);
  }

  getPaymentTerms() {
    return this.list(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/paymentTerms`);
  }

  getCurrencies() {
    return this.list(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/currencies`);
  }

  getTaxTypes() {
    return this.list(`${environment.app.purchaseOrder.apiUrl}/api/purchase-order/taxTypes`);
  }

  rebuildVendors() {
    return this.get<any>(`${environment.app.purchaseOrder.apiUrl}/api/vendors/rebuild-vendors`);
  }
}
