import { Component, ViewEncapsulation, Injector, Input } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import * as fromPurchaseOrder from './state/purchase-order.reducer';
import * as purchaseOrderActions from './state/purchase-order.action';
import * as purchaseSelector from './state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { Store, select } from '@ngrx/store';
import { PurchaseOrderModel, PurchaseOrderTypes,
    PurchaseOrderStatus, ApprovalStatus, GetPurchaseOrderModel, SalesInvoiceViewModel, InvoiceInfo } from './purchase-order.model';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import { environment } from 'src/environments/environment';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { DeletePurchaseOrderComponent } from './delete-purchase-order/delete-purchase-order.component';
import { UpdatePurchaseOrderComponent } from './update-purchase-order/update-purchase-order.component';
import { PurchaseOrderTypeEnum, PurchaseOrderStatusEnum } from 'src/app/shared/constant/purchase-order.constant';
import { ConvertPurchaseOrderComponent } from './convert-purchase-order/convert-purchase-order.component';
import { SubmitPurchaseOrderComponent } from './submit-purchase-order/submit-purchase-order.component';
import { ApprovalStatusEnum } from 'src/app/shared/constant/approval.constant';
import { ByPassPurchaseOrderComponent } from './bypass-purchase-order/bypass-purchase-order.component';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/shared/services/report.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ConfirmInformationInvoiceComponent } from './confirm-information-invoice/confirm-information-invoice.component';

@Component({
    selector: 'app-purchase-order',
    templateUrl: './purchase-order.component.html',
    styleUrls: ['./purchase-order.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PurchaseOrderComponent extends ComponentBase {

    purchaseOrderType: PurchaseOrderTypeEnum = PurchaseOrderTypeEnum.purchaseOrder;
    title = 'Purchase Order Management';
    public pageSize = 10;
    public addSuccessMessage = 'Purchase Order is added.';
    public updateSuccessMessage = 'Purchase Order is updated.';
    public deleteSuccessMessage = 'Purchase Order is deleted.';

    public componentActive = true;
    public datasource: Array<PurchaseOrderModel> = [];
    public purchaseOrder: PurchaseOrderModel;
    public listButton;
    public actionType = ActionType.dialog;
    public selectedId = null;
    public userDefinedColumnSetting: UserDefinedColumnSetting;
    public queryText = '';
    public isHiddenSearchBox = false;

    public selectedStatus = null;
    public selectedStages = null;

    public status = ['OpenOrder', 'Received', 'Invoiced', 'Canceled', 'Pending'];
    public stages = ['Pending', 'Approved', 'Rejected', 'Confirmed'];

    constructor(private store: Store<fromPurchaseOrder.PurchaseOrderState>,
        private route: ActivatedRoute,
        public injector: Injector,
        private reportService: ReportService) {
        super(injector);
    }
    onInit() {
        this.route.data.subscribe(data => {
            this.purchaseOrderType = data.purchaseOrderType ? data.purchaseOrderType : this.purchaseOrderType;
            this.title = data.title ? data.title : this.title;

            this.store.dispatch(new purchaseOrderActions.PurchaseOrderType(this.getPurchaseOrderType(this.purchaseOrderType)));
        });
        this.handleSubscription(this.store.pipe(
            select(fromAuths.getUserId), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    // tslint:disable-next-line:max-line-length
                    this.userDefinedColumnSetting = new UserDefinedColumnSetting(`${id}_UserDefinedColumnsPurchaseOrder`, 'name,description,vendor,type,status,approvalStatus',
                        environment.app.purchaseOrder.apiUrl);
                    this.getPurchaseOrders(this.queryText, this.selectedStatus, this.selectedStages,
                        this.getPurchaseOrderType(this.purchaseOrderType));
                    this.setButtonsConfiguration();
                }
            ));

        this.handleSubscription(this.store.pipe(
            select(purchaseSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string | null) => {
                    if (id) {
                        this.getSelectPurchaseOrder(id);
                    } else {
                        this.changeListButton(true);
                    }
                }
            ));

            this.handleSubscription(this.store.pipe(
                select(purchaseSelector.getInvoiceInfo), takeWhile(() => this.componentActive))
                .subscribe(
                    (result: InvoiceInfo | null) => {
                        if (result) {
                            this.generateInvoice(result.soDo);
                        }
                    }
                ));
    }

    onDestroy() { }

    getPurchaseOrders(searchText: string, status: string, stages: string, type: string) {
        this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(1, this.pageSize),
            new GetPurchaseOrderModel(searchText, status, stages, type)));
        this.store.pipe(select(purchaseSelector.getPurchaseOrders),
            takeWhile(() => this.componentActive))
            .subscribe(
                (purchaseOrders: Array<PurchaseOrderModel>) => {
                    this.datasource = purchaseOrders.map(item => {
                        const purchaseOrder = new PurchaseOrderModel(item);
                        purchaseOrder.type = this.getPurchaseOrderType(item.type);
                        purchaseOrder.status = this.getPurchaseOrderStatus(item.status);
                        purchaseOrder.approvalStatus = item.approvalStatus !== 0 ? this.getApprovalStatus(item.approvalStatus) : '';
                        return purchaseOrder;
                    });
                }
            );
    }

    getSelectPurchaseOrder(id) {
        this.store.dispatch(new purchaseOrderActions.SelectPurchaseOrder(id));
        this.store.pipe(select(purchaseSelector.getPurchaseOrder),
            takeWhile(() => this.componentActive))
            .subscribe(
                (purchaseOrder: PurchaseOrderModel) => {
                    if (purchaseOrder !== null) {
                        this.purchaseOrder = purchaseOrder;
                        this.changeDisableButton(false, this.purchaseOrder);
                    }
                }
            );
    }

    changeSelectedPage(page: number) {
        this.store.dispatch(new purchaseOrderActions.GetPurchaseOrders(new PagingFilterCriteria(page + 1, this.pageSize),
            new GetPurchaseOrderModel(this.queryText, this.selectedStatus, this.selectedStages,
                this.getPurchaseOrderType(this.purchaseOrderType))));
    }

    setButtonsConfiguration() {
        this.listButton = [
            new Button({
                id: 0,
                title: 'Add',
                component: AddPurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
            }),
            new Button({
                id: 1,
                title: 'Edit',
                component: UpdatePurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            }),
            new Button({
                id: 2,
                title: 'Convert',
                component: ConvertPurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            }),
            new Button({
                id: 3,
                title: 'Submit',
                component: SubmitPurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            }),
            new Button({
                id: 4,
                title: 'ByPass',
                component: ByPassPurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            }),
            new Button({
                id: 5,
                title: 'Delete',
                component: DeletePurchaseOrderComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            })
        ];
    }


    changeListButton(isDisabled: boolean) {
        if (!this.listButton) {
            return;
        }
        this.listButton.forEach(btn => {
            if (btn.title === 'Edit' || btn.title === 'Convert' || btn.title === 'Submit'
                || btn.title === 'ByPass') {
                btn.disable = isDisabled;
            }
        });
    }

    changeDisableButton(isDisabled: boolean, purchaseOrder: PurchaseOrderModel) {

        this.listButton.forEach(btn => {
            if (btn.title === 'Edit' || btn.title === 'Convert' || btn.title === 'ByPass') {
                btn.disable = isDisabled;
            }
            if (btn.id === 1 && purchaseOrder.status !== PurchaseOrderStatusEnum.draft) {
                btn.title = 'Detail';
                btn.disable = isDisabled;
            }
            if (btn.id === 1 &&
                (purchaseOrder.status === PurchaseOrderStatusEnum.draft || purchaseOrder.approvalStatus === ApprovalStatusEnum.rejected)) {
                btn.title = 'Edit';
            }
            if ((btn.id === 2 || btn.id === 4) && ((purchaseOrder.type !== PurchaseOrderTypeEnum.draftPO) &&
                (purchaseOrder.type !== PurchaseOrderTypeEnum.draftRO))) {
                btn.disable = true;
            }
            if (btn.id === 3) {
                btn.disable = true;
            }
            // tslint:disable-next-line:max-line-length
            if (btn.id === 3 && ((purchaseOrder.status === PurchaseOrderStatusEnum.openOrder) || (purchaseOrder.approvalStatus === ApprovalStatusEnum.rejected))) {
                btn.disable = false;
            }

            if (btn.id === 5) {
                btn.disable = true;
            }
            if (btn.id === 5 && (purchaseOrder.status === PurchaseOrderStatusEnum.draft)) {
                btn.disable = false;
            }
            if (btn.id === 6) {
                if (purchaseOrder.status === PurchaseOrderStatusEnum.received) {
                    btn.disable = false;
                } else {
                    btn.disable = true;
                }
            }
        });
    }

    getPurchaseOrderType(type: any) {
        return Object.values(PurchaseOrderTypes).includes(+type)
            ? Object.keys(PurchaseOrderTypes).find(function (item, key) { return key === (+type - 1); })
            : type;
    }

    getPurchaseOrderStatus(status: any) {
        return Object.values(PurchaseOrderStatus).includes(+status)
            ? Object.keys(PurchaseOrderStatus).find(function (item, key) { return key === (+status - 1); })
            : status;
    }

    getApprovalStatus(status: any) {
        return Object.values(ApprovalStatus).includes(+status)
            ? Object.keys(ApprovalStatus).find(function (item, key) { return key === (+status - 1); })
            : status;
    }

    eventSearchQuery(event: any) {
        this.queryText = event;
        this.getPurchaseOrders(this.queryText, this.selectedStatus, this.selectedStages, this.getPurchaseOrderType(this.purchaseOrderType));
    }

    onChangeFilter() {
        this.getPurchaseOrders(this.queryText, this.selectedStatus, this.selectedStages, this.getPurchaseOrderType(this.purchaseOrderType));
    }

    generateInvoice (soDo: string) {
        if (soDo && this.purchaseOrder) {
            const salesInvoice: SalesInvoiceViewModel = {
                id: Guid.empty(),
                purchaseOrderId: this.purchaseOrder.id,
                vendorId: this.purchaseOrder.vendorId,
                invoiceDate: new Date(this.purchaseOrder.date),
                purchaseOrderItems: [],
                soDo: soDo
              };
              const redirectWindow = window.open(environment.app.purchaseOrder.url + '/report-loading', '_blank');
              this.reportService.printSalesInvoiceReport(salesInvoice).subscribe(
                data => {
                  if (data.status === 1) {
                    const reportRedirect: any = ((environment.app.report.apiUrl + '/reports?' + data.endPoint).replace(/["]/g, ''));
                    redirectWindow.location = reportRedirect;
                 } else {
                   const reportErrorRedirect: any = ((environment.app.purchaseOrder.url + '/report-error').replace(/["]/g, ''));
                   redirectWindow.location = reportErrorRedirect;
                 }
                }
              );
        }
    }
}
