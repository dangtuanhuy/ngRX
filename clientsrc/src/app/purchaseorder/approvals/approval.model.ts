import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ApprovalStatusEnum } from 'src/app/shared/constant/approval.constant';

export class ApprovalModel {
    public id: string;
    public purchaseOrderId: string;
    public purchaseOrderName: string;
    public status: ApprovalStatusEnum;
    public managerId: string;
    public createdDate: Date;
    public updatedDate: Date;
    public updatedBy: string;
    public createdBy: string;
    public poNumber: string;
    constructor(data: any) {
        this.id = data.id;
        this.purchaseOrderId = data.purchaseOrderId;
        this.purchaseOrderName = data.purchaseOrderName;
        this.status = data.status;
        this.managerId = data.managerId;
        this.createdDate = data.createdDate;
        this.poNumber = data.poNumber;
        this.createdBy = data.createdBy;
        this.updatedBy = data.updatedBy;
        this.updatedDate = data.updatedDate;
    }
}

export class GetApprovalRequestModel {
    userId: string;
    paging: PagingFilterCriteria;
    constructor(userId: string, paging: PagingFilterCriteria) {
      this.userId = userId;
      this.paging = paging;
    }
}

export class SubmitPurchaseOrderModel {
    id: string;
    managerId: string;
    constructor(id: string, managerId: string) {
        this.id = id;
        this.managerId = managerId;
    }
}

export class RejectPurchaseOrderModel {
    id: string;
    managerId: string;
    reason: string;
    constructor(id: string, managerId: string, reason: string) {
        this.id = id;
        this.managerId = managerId;
        this.reason = reason;
    }
}

export const ApprovalStatus = {
    'Pending': ApprovalStatusEnum.pending,
    'Approved': ApprovalStatusEnum.approved,
    'Rejected': ApprovalStatusEnum.rejected,
    'Confirmed': ApprovalStatusEnum.confirmed
};
