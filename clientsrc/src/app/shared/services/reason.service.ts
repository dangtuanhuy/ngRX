import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { ReasonModel } from 'src/app/ims/reasons/reason.model';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class ReasonService extends ServiceBase {
    getAll(page: number = 1, numberItemsPerPage: number = 10, queryText: string) {
        return this.pageWithSearchText(`${environment.app.ims.apiUrl}/api/reasons`,
                                        new PagingFilterCriteria(page, numberItemsPerPage), queryText);
    }

    getBy(id: string): Observable<ReasonModel> {
        return this.get(`${environment.app.ims.apiUrl}/api/reasons/${id}`);
    }

    add(reason: ReasonModel): Observable<ReasonModel> {
        return this.post(`${environment.app.ims.apiUrl}/api/reasons`, reason);
    }

    update(reason: ReasonModel): Observable<ReasonModel> {
        return this.put(`${environment.app.ims.apiUrl}/api/reasons/${reason.id}`, reason);
    }

    remove(id: string) {
        return this.delete(`${environment.app.ims.apiUrl}/api/reasons/${id}`);
    }
}
