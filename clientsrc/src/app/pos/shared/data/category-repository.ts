import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { Category } from '../models/category';
import { PagingExtension } from '../helpers/paging.extension';
import { CategoryPagingModel } from '../view-models/category-paging.model';

@Injectable({ providedIn: 'root' })
export class CategoryRepository extends RepositoryBase<Category> {
  Map(obj: any): Category {
    const result: Category = {
      id: obj.id,
      name: obj.name,
      description: obj.description,
      isDelete: obj.isDelete ? obj.isDelete : false
    };
    return result;
  }
  constructor(protected appContextManager: AppContextManager) {
    super(appContextManager, 'Categories');
  }

  getPaging(pageIndex: number, pageSize: number): CategoryPagingModel {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).filtered(`isDelete = false`);
    const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);

    const result = new CategoryPagingModel();

    result.pageNumber = pageIndex;
    result.pageSize = pageSize;
    result.totalItem = data.length;
    result.categories = [];

    if (!pagedData.length) {
      return result;
    }
    pagedData.forEach(element => {
      result.categories.push(this.Map(element));
    });

    context.close();
    return result;
  }
}
