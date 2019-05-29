import { ServiceBase } from 'src/app/shared/services/service-base';
import { Injectable } from '@angular/core';
import { posEnvironment } from '../../pos-environments/pos-environment';
import { DeviceHubRequest } from '../models/device-hub/device-hub-request';

@Injectable({ providedIn: 'root' })
export class DeviceHubService extends ServiceBase {
    public printEpson(request: DeviceHubRequest) {
        return this.post(`${posEnvironment.app.deviceHub.apiUrl}`, request);
    }

    public openCashDrawer(printerShareName: string) {
        return this.get(`${posEnvironment.app.deviceHub.apiUrl}/cash-drawer?printerShareName=${printerShareName}`);
    }
}
