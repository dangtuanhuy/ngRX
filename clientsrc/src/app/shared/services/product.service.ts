import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ProductModel,
  ProductModelRequest,
  ProductListModel
} from 'src/app/ims/products/product';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable({ providedIn: 'root' })
export class ProductService extends ServiceBase {
  getAllWithoutPaging() {
    return this.list<ProductListModel>(
      `${environment.app.ims.apiUrl}/api/products/all`
    );
  }

  getProductsByQueryText(queryText: Observable<string>) {
    return queryText.debounceTime(500).distinctUntilChanged().switchMap(searchQuery =>
      this.list<ProductListModel>(
        `${environment.app.ims.apiUrl}/api/products/total?querySearch=${searchQuery}`
      ));
  }

  getAll(page: number = 1, numberItemsPerPage: number = 10, queryText = '') {
    return this.pageWithSearchText(
      `${environment.app.ims.apiUrl}/api/products`,
      new PagingFilterCriteria(page, numberItemsPerPage),
      queryText
    );
  }

  createProductFromTemplate(templateId: string) {
    return this.get<ProductModel>(
      `${environment.app.ims.apiUrl}/api/products/template/${templateId}`
    );
  }

  getById(id: string) {
    return this.get<ProductModel>(
      `${environment.app.ims.apiUrl}/api/products/${id}`
    );
  }

  add(product: any) {
    return this.post<ProductListModel>(
      `${environment.app.ims.apiUrl}/api/products`,
      product
    );
  }

  update(product: ProductModelRequest) {
    return this.put(
      `${environment.app.ims.apiUrl}/api/products/${product.id}`,
      product
    );
  }

  remove(id: string) {
    return this.delete(`${environment.app.ims.apiUrl}/api/products/${id}`);
  }

  uploadCSV(file: File | null) {
    const formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file, file.name);
    }

    return this.uploadFile(
      `${environment.app.ims.apiUrl}/api/products/deployment`,
      formdata,
      {
        reportProgress: true,
        responseType: 'text'
      }
    );
  }

  formatCSVs(files: File[] | null) {
    const formdata: FormData = new FormData();
    files.forEach(file => {
      formdata.append('file', file, file.name);
    });

    return this
      .post<any>(`${environment.app.ims.apiUrl}/api/products/format-csv`,
        formdata, { responseType: 'text/csv' });

    return this.uploadFile(
      `${environment.app.ims.apiUrl}/api/products/format-csv`,
      formdata,
      {
        responseType: 'text/csv'
      }
    );
  }

  getAllPurchaseProductWithPaging(page: number = 1, numberItemsPerPage: number = 10, queryText = '') {
    return this.pageWithSearchText(
      `${environment.app.purchaseOrder.apiUrl}/api/products`,
      new PagingFilterCriteria(page, numberItemsPerPage),
      queryText
    );
  }

  getPurchaseProductsByQueryText(queryText: Observable<string>) {
    return queryText.debounceTime(500).distinctUntilChanged().switchMap(term =>
      this.list<ProductListModel>(
        `${environment.app.purchaseOrder.apiUrl}/api/products?queryText=${term}`
      ));
  }

  getAllPurchaseProductWithoutPaging() {
    return this.list<ProductListModel>(`${environment.app.purchaseOrder.apiUrl}/api/products/all`);
  }

  getPurchaseProductById(id: string) {
    return this.get<ProductModel>(`${environment.app.purchaseOrder.apiUrl}/api/products/${id}`);
  }
}
