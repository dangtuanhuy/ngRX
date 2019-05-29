import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { CategoryModel } from 'src/app/ims/categories/category.model';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class CategoryService extends ServiceBase {
  getAllWithoutPaging() {
    return this.list(`${environment.app.ims.apiUrl}/api/all`);
  }

  getAll(page: number = 1, numberItemsPerPage: number = 10, queryText = '') {
    return this.pageWithSearchText(
      `${environment.app.ims.apiUrl}/api/categories`,
      new PagingFilterCriteria(page, numberItemsPerPage), queryText
    );
  }

  getAllCategory() {
    return this.get<CategoryModel[]>(`${environment.app.ims.apiUrl}/api/categories/all`);
  }

  getBy(id: string): Observable<CategoryModel> {
    return this.get(`${environment.app.ims.apiUrl}/api/categories/${id}`);
  }

  add(category: CategoryModel): Observable<CategoryModel> {
    return this.post(`${environment.app.ims.apiUrl}/api/categories`, category);
  }

  update(category: CategoryModel): Observable<CategoryModel> {
    return this.put(
      `${environment.app.ims.apiUrl}/api/categories/${category.id}`,
      category
    );
  }

  remove(id: string) {
    return this.delete(`${environment.app.ims.apiUrl}/api/categories/${id}`);
  }
}
