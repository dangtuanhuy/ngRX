import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class ActivityService extends ServiceBase {
  getAll(userId: string, page: number = 1, numberItemsPerPage: number = 10) {
    return this.page(
      `${environment.app.ims.apiUrl}/api/activities/${userId}`,
      new PagingFilterCriteria(page, numberItemsPerPage)
    );
  }
}
