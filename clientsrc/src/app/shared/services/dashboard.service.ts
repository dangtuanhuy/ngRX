import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DashboardModel, DashboardRequestModel } from 'src/app/ims/dashboard/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends ServiceBase {

    getByLocation(request: DashboardRequestModel) {
        return this.get<DashboardModel>
            (`${environment.app.ims.apiUrl}/api/dashboard?locationId=${request.locationId}&queryText=${request.queryText}`);
    }

}
