import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FieldTemplateModel } from 'src/app/ims/field-templates/field-template.model';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { ServiceBase } from './service-base';


@Injectable({ providedIn: 'root' })
export class FieldTemplateService extends ServiceBase {

    getAllFieldTemplates() {
        return this.list(`${environment.app.ims.apiUrl}/api/fields/alltemplates`);
    }

    getAll(page: number = 1, numberItemsPerPage: number = 10, queryText: string = '') {
        return this.pageWithSearchText<FieldTemplateModel>(`${environment.app.ims.apiUrl}/api/fields/templates`,
                                                            new PagingFilterCriteria(page, numberItemsPerPage), queryText);
    }

    getBy(id: string): Observable<FieldTemplateModel> {
        return this.get(`${environment.app.ims.apiUrl}/api/fields/templates/${id}`);
    }

    add(field: FieldTemplateModel): Observable<FieldTemplateModel> {
        return this.post<FieldTemplateModel>(`${environment.app.ims.apiUrl}/api/fields/templates`, field);
    }

    update(field: FieldTemplateModel): Observable<FieldTemplateModel> {
        return this.put<FieldTemplateModel>(`${environment.app.ims.apiUrl}/api/fields/templates/${field.id}`, field);
    }

    remove(id: string) {
        return this.delete(`${environment.app.ims.apiUrl}/api/fields/templates/${id}`);
    }

    getTypes(): Observable<Array<string>> {
        return this.get<Array<string>>(`${environment.app.ims.apiUrl}/api/fields/templates/types`);
    }
}
