import { ServiceBase } from './service-base';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from '../base-model/paging-filter-criteria';
import { RejectPurchaseOrderModel } from 'src/app/purchaseorder/approvals/approval.model';

@Injectable({ providedIn: 'root' })

export class ApprovalService extends ServiceBase {

    getAll(managerId: string, page: number = 1, numberItemsPerPage: number = 10, searchText= '') {
        return this.pageWithSearchText(
            `${environment.app.purchaseOrder.apiUrl}/api/approval/${managerId}`,
            new PagingFilterCriteria(page, numberItemsPerPage), searchText
        );
    }

    approve(id: string, managerId: string) {
        return this.post(`${environment.app.purchaseOrder.apiUrl}/api/approval/${id}/approve?managerId=${managerId}`);
    }

    reject(rejectPOModel: RejectPurchaseOrderModel) {
        return this.post(`${environment.app.purchaseOrder.apiUrl}/api/approval/${rejectPOModel.id}/reject`, rejectPOModel);
    }

    confirm(id: string, managerId: string) {
        return this.post(`${environment.app.purchaseOrder.apiUrl}/api/approval/${id}/confirm?managerId=${managerId}`);
    }

    getReason(id: string) {
        return this.get<RejectPurchaseOrderModel>
        (`${environment.app.purchaseOrder.apiUrl}/api/approval/reason?purchaseOrderId=${id}`);
    }
}
