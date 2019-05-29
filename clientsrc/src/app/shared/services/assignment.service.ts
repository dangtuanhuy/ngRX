import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from './service-base';
import { AddAssignmentModel } from '../base-model/assignment.model';


@Injectable({ providedIn: 'root' })
export class AssignmentService extends ServiceBase {
    getByName(name: string) {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/assortment?text=${name}`);
    }

    getAllAssortmentAssignemt() {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/assortments`);
    }

    getAssortmentAssignemtSelected(assortmentId: string) {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/assortment/Id=${assortmentId}`);
    }

    getChannelAssignmentByName(name: string) {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/channel?text=${name}`);
    }

    getAllChannelAssignemt() {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/channels`);
    }

    getChannelAssignemtSelected(channelId: string) {
        return this.get(`${environment.app.ims.apiUrl}/api/assignments/channel/Id=${channelId}`);
    }

    addAssortmentAssignment(data: AddAssignmentModel[], id: string) {
        return this.post(`${environment.app.ims.apiUrl}/api/assignments/assortment/${id}`, data);
    }

    addChannelAssignment(data: AddAssignmentModel[], id: string) {
        return this.post(`${environment.app.ims.apiUrl}/api/assignments/channel/${id}`, data);
    }
}
