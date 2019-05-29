import { Injectable } from '@angular/core';
import { ServiceBase } from './service-base';
import { DeviceModel } from 'src/app/retail/devices/device.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';

@Injectable({ providedIn: 'root' })
export class DeviceService extends ServiceBase {
    getAll(page: number = 1, numberItemsPerPage: number = 10, queryText = '') {
        return this.pageWithSearchText(
            `${environment.app.retail.apiUrl}/api/devices`,
            new PagingFilterCriteria(page, numberItemsPerPage), queryText
        );
    }

    getBy(id: string): Observable<DeviceModel> {
        return this.get(`${environment.app.retail.apiUrl}/api/devices/${id}`);
    }

    add(device: DeviceModel): Observable<DeviceModel> {
        return this.post(`${environment.app.retail.apiUrl}/api/devices`, device);
    }

    getDeviceByDeviceCode(deviceCode: string): Observable<any> {
        return this.get(`${environment.app.retail.apiUrl}/api/devices/deviceCode/${deviceCode}`);
    }

    remove(id: string) {
        return this.delete(`${environment.app.retail.apiUrl}/api/devices/${id}/soft`);
    }
}
