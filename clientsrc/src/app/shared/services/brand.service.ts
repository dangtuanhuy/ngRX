import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { BrandModel } from 'src/app/ims/brands/brand.model';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class BrandService extends ServiceBase {
    getAll(page: number = 1, numberItemsPerPage: number = 10, queryText: string = '') {
        return this.pageWithSearchText(`${environment.app.ims.apiUrl}/api/brands`,
                                        new PagingFilterCriteria(page, numberItemsPerPage), queryText);
    }

    getBy(id: string): Observable<BrandModel> {
        return this.get(`${environment.app.ims.apiUrl}/api/brands/${id}`);
    }

    add(brand: BrandModel): Observable<BrandModel> {
        return this.post(`${environment.app.ims.apiUrl}/api/brands`, brand);
    }

    update(brand: BrandModel): Observable<BrandModel> {
        return this.put(`${environment.app.ims.apiUrl}/api/brands/${brand.id}`, brand);
    }

    remove(id: string) {
        return this.delete(`${environment.app.ims.apiUrl}/api/brands/${id}`);
    }

    import(file: File | null) {
        const formdata: FormData = new FormData();
        if (file) {
          formdata.append('file', file, file.name);
        }

        return this.uploadFile(
            `${environment.app.ims.apiUrl}/api/brands/deployment`,
            formdata,
            {
              reportProgress: true,
              responseType: 'text'
            }
          );
    }
}
