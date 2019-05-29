import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { Observable } from 'rxjs';
import { IndexModel } from 'src/app/ims/search/search.model';
import { IndexType } from 'src/app/ims/search/index.constant';

@Injectable({ providedIn: 'root' })
export class SearchService extends ServiceBase {
    rebuildIndex(type: IndexType): Observable<any> {
        return this.post(`${environment.app.ims.apiUrl}/api/search/indexes/${type}/rebuild-index`);
    }
}
