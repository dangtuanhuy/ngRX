import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppSettingModel } from '../base-model/appsetting.model';
import { ServiceBase } from './service-base';


@Injectable({ providedIn: 'root' })
export class AppSettingService extends ServiceBase {
    getAll(apiUrl: string) {
        return this.list(`${apiUrl}/api/appsettings`);
    }

    getBy(id: string, apiUrl: string): Observable<AppSettingModel> {
        return this.get(`${apiUrl}/api/appsettings/${id}`);
    }

    add(appsetting: AppSettingModel, apiUrl: string): Observable<AppSettingModel> {
        return this.post(`${apiUrl}/api/appsettings`, appsetting);
    }

    update(appsetting: AppSettingModel, apiUrl: string): Observable<AppSettingModel> {
        return this.put(`${apiUrl}/api/appsettings/${appsetting.key}`, appsetting);
    }

    remove(id: string, apiUrl: string) {
        return this.delete(`${apiUrl}/api/appsettings/${id}`);
    }
}
