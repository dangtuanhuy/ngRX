import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { ApprovalService } from 'src/app/shared/services/approval.service';
import * as approvalActions from '../state/approval.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { ApprovalModel, SubmitPurchaseOrderModel, RejectPurchaseOrderModel } from '../approval.model';
import { PurchaseOrderModel } from '../../purchase-orders/purchase-order.model';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable()
export class ApprovalEffects {
    private approveSuccess = 'Approve Purchase Order Success';
    private rejectSuccess = 'Reject Purchase Order Success';
    private confirmSuccess = 'Confirm Purchase Order Success';
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private approvalService: ApprovalService,
        private purchaseOrderService: PurchaseOrderService,
        private notificationService: NotificationService,
        private modalService: NgbModal,
    ) { }

    @Effect()
    getApprovals$: Observable<Action> = this.action$
        .pipe(
            ofType(approvalActions.ApprovalActionTypes.GetApprovals),
            mergeMap((action: approvalActions.GetApprovals) =>
                this.approvalService
                    .getAll(action.payload.userId, action.payload.paging.page, action.payload.paging.numberItemsPerPage, action.queryText)
                    .pipe(map((approvals: PagedResult<ApprovalModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(approvals));
                        return new approvalActions.GetApprovalsSuccess(approvals);
                    })
                    )
            )
        );

    @Effect()
    approvePO$: Observable<Action> = this.action$.pipe(
        ofType(approvalActions.ApprovalActionTypes.ApprovePO),
        map((action: approvalActions.ApprovePurchaseOrder) => action.payload),
        mergeMap((approval: SubmitPurchaseOrderModel) =>
            this.approvalService.approve(approval.id, approval.managerId).pipe(
                map((newApproval: any) => {
                    this.showNofitication(this.approveSuccess);
                    return new approvalActions.ApprovePurchaseOrderSuccess(newApproval);
                }),
                catchError(error => of(new approvalActions.ApprovePurchaseOrderFail(error)))
            )
        )
    );

    @Effect()
    rejectPO$: Observable<Action> = this.action$.pipe(
        ofType(approvalActions.ApprovalActionTypes.RejectPO),
        map((action: approvalActions.RejectPurchaseOrder) => action.payload),
        mergeMap((purchaseOrder: RejectPurchaseOrderModel) =>
            this.approvalService.reject(purchaseOrder).pipe(
                map((newApproval: any) => {
                    this.showNofitication(this.rejectSuccess);
                    return new approvalActions.RejectPurchaseOrderSuccess(newApproval);
                }),
                catchError(error => of(new approvalActions.RejectPurchaseOrderFail(error)))
            )
        )
    );

    @Effect()
    confirmPO$: Observable<Action> = this.action$.pipe(
        ofType(approvalActions.ApprovalActionTypes.ConfirmPO),
        map((action: approvalActions.ConfirmPurchaseOrder) => action.payload),
        mergeMap((approval: SubmitPurchaseOrderModel) =>
            this.approvalService.confirm(approval.id, approval.managerId).pipe(
                map((newApproval: any) => {
                    this.showNofitication(this.confirmSuccess);
                    return new approvalActions.ConfirmPurchaseOrderSuccess(newApproval);
                }),
                catchError(error => of(new approvalActions.ConfirmPurchaseOrderFail(error)))
            )
        )
    );

    @Effect()
    getPurchaseOrder$: Observable<Action> = this.action$
        .pipe(
            ofType(approvalActions.ApprovalActionTypes.GetPurchaseOrder),
            mergeMap((action: approvalActions.GetPurchaseOrder) =>
                this.purchaseOrderService
                    .getBy(action.payload)
                    .pipe(map((purchaseOrder: PurchaseOrderModel) => {
                        return new approvalActions.GetPurchaseOrderSuccess(purchaseOrder);
                    })
                    )
            )
        );

    private showNofitication(text: string) {
        this.notificationService.success(text);
        this.store.dispatch(new listViewManagementActions.ChangeSelectedItemAction(null));
        this.modalService.dismissAll();
    }
}
