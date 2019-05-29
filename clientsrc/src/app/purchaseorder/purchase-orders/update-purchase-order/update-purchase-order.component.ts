import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import { Guid } from 'src/app/shared/utils/guid.util';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as purchaseSelector from '../state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import {
    PurchaseOrderItem, PurchaseOrderModel,
    PurchaseOrderItemViewModel, UpdatePurchaseOrderModel, CurrencyModel, UpdatePurchaseOrderDateModel
} from '../purchase-order.model';
import { VendorModel } from '../../vendors/vendor.model';
import { VariantModel } from 'src/app/ims/products/product';
import { takeWhile } from 'rxjs/operators';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { PurchaseOrderStatusEnum, PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';
import { ApprovalStatusEnum } from 'src/app/shared/constant/approval.constant';
import { ApprovalService } from 'src/app/shared/services/approval.service';
import { Subject } from 'rxjs';
import { ReportService } from 'src/app/shared/services/report.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-update-purchase-order',
    templateUrl: './update-purchase-order.component.html',
    styleUrls: ['./update-purchase-order.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UpdatePurchaseOrderComponent extends ComponentBase {
    updateValueForm: FormGroup = new FormGroup({});
    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private store: Store<fromPurchaseOrder.PurchaseOrderState>,
        private purchaseProductService: ProductService,
        private purchaseStockTypeService: StockTypeService,
        private modalService: NgbModal,
        private approvalService: ApprovalService,
        private reportService: ReportService,
        private notificationService: NotificationService,
        public injector: Injector
    ) {
        super(injector);
        this.purchaseProductService.getPurchaseProductsByQueryText(this.searchText).subscribe(products => {
            this.products = products;
            this.isProductsLoading = false;
        });
    }
    public title: string;
    public purchaseOrder: PurchaseOrderModel;
    public purchaseOrderItemViewModel: Array<PurchaseOrderItemViewModel> = [];

    public products = [];

    public variants = [];
    public stockTypes = [];
    public purchaseOrderItems: Array<PurchaseOrderItem> = [];
    public componentActive = true;
    public vendors = [];
    public selectedVendorId: any;
    public stockTypeSelected: any;
    public isLocationsLoading = true;
    public isProductsLoading = true;
    public isStockTypesLoading = true;
    public isEditMode = true;

    public currencies = [];
    public currencySelected: any;
    public optionSelected: any;
    public vendorSelected: any;
    public isUpdating = true;

    public reasonReject: string;
    public purchaseOrderType: string;
    searchText = new Subject<string>();
    onInit() {
        this.getStockType();
        this.updateValueForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            vendor: [''],
            date: [null, Validators.required]
        });

        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getPurchaseOrderType))
                .subscribe(
                    (type: string) => {
                        this.purchaseOrderType = type;
                        if (type === 'PurchaseOrder') {
                            this.title = 'Purchase Order';
                        }
                        if (type === 'ReturnedOrder') {
                            this.title = 'Return Order';
                        }
                    }
                )
        );

        this.handleSubscription(this.store.pipe(
            select(purchaseSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.store.dispatch(new purchaseOrderActions.GetPurchaseOrder(id));
                }
            ));

        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getCurrencies))
                .subscribe(
                    (currencies: Array<CurrencyModel>) => {
                        this.currencies = currencies;
                    }
                )
        );
        this.store.dispatch(new purchaseOrderActions.GetCurrencies());

        this.handleSubscription(this.store.pipe(
            select(purchaseSelector.getPurchaseOrder), takeWhile(() => this.componentActive))
            .subscribe(
                (purchaseOrder: PurchaseOrderModel) => {
                    if (purchaseOrder == null) {
                        return;
                    }
                    this.purchaseOrder = purchaseOrder;
                    this.currencySelected = this.purchaseOrder.currencyId;
                    const date = new Date(this.purchaseOrder.date);
                    this.updateValueForm.patchValue({
                        name: this.purchaseOrder.name,
                        description: this.purchaseOrder.description,
                        vendor: this.purchaseOrder.vendorId !== Guid.empty() ? this.purchaseOrder.vendorId : null,
                        date: new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()),
                    });

                    if (this.purchaseOrder.approvalStatus === ApprovalStatusEnum.rejected) {
                        this.approvalService.getReason(this.purchaseOrder.id).subscribe(
                            result => {
                                this.reasonReject = result.reason;
                            });
                    }

                    this.isEditMode = this.purchaseOrder.status === PurchaseOrderStatusEnum.draft
                        || this.purchaseOrder.approvalStatus === ApprovalStatusEnum.rejected;

                    if (purchaseOrder.purchaseOrderItems && purchaseOrder.purchaseOrderItems.length > 0) {
                        this.purchaseOrderItems = purchaseOrder.purchaseOrderItems;
                        this.getPurchaseOrderItemView(purchaseOrder.purchaseOrderItems);
                    }
                }));

        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getAllVendors))
                .subscribe(
                    (vendors: Array<VendorModel>) => {
                        this.vendors = vendors;
                    }
                )
        );

        this.store.dispatch(new purchaseOrderActions.GetAllVendors());
    }

    onDestroy() { }


    onClose(): void {
        this.activeModal.close('closed');
    }

    onOptionSelected(event) {
        this.currencySelected = event.id;
        this.purchaseOrderItems.forEach(item => {
            item.currencyId = this.currencySelected;
        });
    }

    private getStockType() {
        this.isStockTypesLoading = true;
        this.purchaseStockTypeService.getAllPurchaseStockType().subscribe(res => {
            this.stockTypes = res;
            this.isStockTypesLoading = false;
        });
    }

    onClickAddButton() {
        const purchaseOrderItemView: PurchaseOrderItemViewModel = {
            id: null,
            productId: null,
            variants: [],
            isVariantsLoading: false,
            variant: null,
            stockTypeId: this.stockTypeSelected ? this.stockTypeSelected : null,
            quantity: 0,
            costValue: 0,
            currencyId: null,
            isDuplicate: false
        };
        this.purchaseOrderItemViewModel.push(purchaseOrderItemView);

        if (this.purchaseOrderItems.length > 0 && !this.currencySelected) {
            this.currencySelected = this.purchaseOrderItems[0].currencyId;
        }

        const purchaseOrderItem: PurchaseOrderItem = {
            id: Guid.empty(),
            product: null,
            variantId: Guid.empty(),
            stockTypeId: this.stockTypeSelected ? this.stockTypeSelected : Guid.empty(),
            quantity: 0,
            purchaseOrderId: Guid.empty(),
            costValue: 0,
            currencyId: this.currencySelected
        };
        this.purchaseOrderItems.push(purchaseOrderItem);
    }

    onSelectedProductChange(index: number) {
        this.clearPurchaseOrderItem(index);
        const productId = this.purchaseOrderItemViewModel[index].productId;
        if (productId && productId !== Guid.empty()) {
            this.purchaseOrderItemViewModel[index].isVariantsLoading = true;

            this.purchaseProductService.getPurchaseProductById(productId).subscribe(res => {
                const variants = this.convertVariants(res.variants);
                this.purchaseOrderItemViewModel[index].variants = variants;
                this.purchaseOrderItemViewModel[index].isVariantsLoading = false;
            });
        }
    }

    onSelectedVariantChange(index: number, variantId: string) {
        this.purchaseOrderItemViewModel[index].quantity = 0;
        this.purchaseOrderItems[index].quantity = 0;
        if (variantId) {
            this.purchaseOrderItemViewModel[index].variant
                = this.purchaseOrderItemViewModel[index].variants.find(x => x.id === variantId);
            this.purchaseOrderItems[index].variantId = variantId;
            this.checkDuplicateCurrentPOItem(index);
            this.checkDuplicatePurchaseOrder(this.purchaseOrderItemViewModel);
        }
    }

    public onSelectedStockTypeChange(index: number) {
        this.purchaseOrderItems[index].stockTypeId = this.purchaseOrderItemViewModel[index].stockTypeId;
        this.checkDuplicateCurrentPOItem(index);
        this.checkDuplicatePurchaseOrder(this.purchaseOrderItemViewModel);
    }

    public onQuantityChange(index: number) {
        this.purchaseOrderItems[index].quantity = this.purchaseOrderItemViewModel[index].quantity > 0
            ? this.purchaseOrderItemViewModel[index].quantity : 0;
    }

    public onCostChange(index: number) {
        this.purchaseOrderItems[index].costValue = this.purchaseOrderItemViewModel[index].costValue > 0
            ? this.purchaseOrderItemViewModel[index].costValue : 0;
    }

    private clearPurchaseOrderItem(index: number) {
        this.purchaseOrderItemViewModel[index].variants = [];
        this.purchaseOrderItemViewModel[index].variant = null;
        this.purchaseOrderItemViewModel[index].quantity = 0;
    }

    private getPurchaseOrderItemView(purchaseOrderItems: Array<PurchaseOrderItem>) {
        this.purchaseOrderItemViewModel = [];
        this.products = [];
        purchaseOrderItems.forEach(purchaseOrderItem => {
            let productId = null;
            if (purchaseOrderItem.product) {
                productId = purchaseOrderItem.product.id;
            }
            const purchaseOrderItemView: PurchaseOrderItemViewModel = {
                id: purchaseOrderItem.id,
                productId: productId,
                stockTypeId: purchaseOrderItem.stockTypeId !== Guid.empty() ? purchaseOrderItem.stockTypeId : null,
                quantity: purchaseOrderItem.quantity,
                costValue: purchaseOrderItem.costValue,
                variants: null,
                variant: null,
                isVariantsLoading: true,
                currencyId: purchaseOrderItem.currencyId,
                isDuplicate: false
            };
            if (productId) {
                this.products.push(purchaseOrderItem.product);
                this.purchaseProductService.getPurchaseProductById(purchaseOrderItem.product.id).subscribe(res => {
                    const variants = this.convertVariants(res.variants);
                    purchaseOrderItemView.variants = variants;
                    purchaseOrderItemView.variant = variants.find(x => x.id === purchaseOrderItem.variantId);
                    purchaseOrderItemView.isVariantsLoading = false;
                });
            } else {
                purchaseOrderItemView.isVariantsLoading = false;
            }
            this.purchaseOrderItemViewModel.push(purchaseOrderItemView);
        });
    }

    private convertVariants(variants: Array<VariantModel>) {
        variants.forEach(item => {
            item.name = this.generatedVariantName(item);
        });
        return variants;
    }

    private generatedVariantName(variant: VariantModel) {
        let name = '';
        variant.fieldValues.forEach(item => {
            name += `${item.name}: ${item.value};`;
        });

        return name;
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    onSave() {
        const isDupclicatePOItem = this.checkDuplicatePurchaseOrder(this.purchaseOrderItemViewModel);
        if (isDupclicatePOItem) {
            this.showNofiticationDuplicate();
        } else {
            const name = this.updateValueForm.get('name').value;
            const description = this.updateValueForm.get('description').value;
            const vendorId = this.updateValueForm.get('vendor').value;
            const date = this.updateValueForm.get('date').value;
            const purchaseOrder: UpdatePurchaseOrderModel = {
                id: this.purchaseOrder.id,
                name: name,
                description: description,
                vendorId: vendorId ? vendorId : Guid.empty(),
                vendor: this.getVendorName(vendorId),
                type: this.purchaseOrder.type,
                status: this.purchaseOrder.status,
                approvalStatus: this.purchaseOrder.approvalStatus,
                date: new Date(date.year, date.month - 1, date.day).toDateString(),
                purchaseOrderItems: this.purchaseOrderItems,
                currencyId: this.currencySelected
            };
            this.store.dispatch(new purchaseOrderActions.UpdatePurchaseOrder(purchaseOrder, this.purchaseOrderType));
        }
    }

    saveDate() {
        const date = this.updateValueForm.get('date').value;
        const purchaseOrder: UpdatePurchaseOrderDateModel = {
            id: this.purchaseOrder.id,
            date: new Date(date.year, date.month - 1, date.day).toDateString(),
        };
        this.store.dispatch(new purchaseOrderActions.UpdatePurchaseOrderDate(purchaseOrder, this.purchaseOrderType));
    }

    getVendorName(vendorId: string): string {
        if (vendorId && vendorId !== Guid.empty()) {
            const vendor = this.vendors.find(x => x.id === vendorId);
            return vendor.name;
        }
        return '';
    }

    deletePurchaseOrderItem(index: number) {
        this.purchaseOrderItemViewModel.splice(index, 1);
        this.purchaseOrderItems.splice(index, 1);
        if (this.purchaseOrderItems.length === 0) {
            this.isUpdating = false;
        }
    }

    onSelectedVendorChange(event: any) {
        this.currencySelected = event.currencyId;
    }

    openVariantModal(index: number, item: PurchaseOrderItemViewModel) {
        if (this.purchaseOrderItemViewModel[index].productId) {
            const dialogRef = this.modalService.open(VariantFieldSelectComponent, { size: 'lg', centered: true, backdrop: 'static' });
            const instance = dialogRef.componentInstance;
            instance.variants = item.variants;
            instance.variant = item.variants[0];
            instance.isVariantsLoading = item.isVariantsLoading;
            return dialogRef.result.then((result) => {
                this.onSelectedVariantChange(index, result.id);
            }, (reason) => {
            });
        }
    }

    onStockTypeChange(event: any) {
        this.stockTypeSelected = event.id;
        this.purchaseOrderItemViewModel.forEach(item => {
            item.stockTypeId = this.stockTypeSelected;
        });
        this.purchaseOrderItems.forEach(item => {
            item.stockTypeId = this.stockTypeSelected;
        });
        const isDupclicatePOItem = this.checkDuplicatePurchaseOrder(this.purchaseOrderItemViewModel);
        if (isDupclicatePOItem) {
            this.showNofiticationDuplicate();
        }
    }

    onPrintOrder() {
        const name = this.updateValueForm.get('name').value;
        const description = this.updateValueForm.get('description').value;
        const vendorId = this.updateValueForm.get('vendor').value;
        const date = this.updateValueForm.get('date').value;
        const purchaseOrder: UpdatePurchaseOrderModel = {
            id: this.purchaseOrder.id,
            name: name,
            description: description,
            vendorId: vendorId ? vendorId : Guid.empty(),
            vendor: this.getVendorName(vendorId),
            type: this.purchaseOrder.type,
            status: this.purchaseOrder.status,
            approvalStatus: this.purchaseOrder.approvalStatus,
            date: new Date(date.year, date.month - 1, date.day).toDateString(),
            purchaseOrderItems: this.purchaseOrderItems,
            currencyId: this.currencySelected
        };
        const redirectWindow = window.open(environment.app.purchaseOrder.url + '/report-loading', '_blank');
        if (purchaseOrder.type === PurchaseOrderTypeEnum.purchaseOrder) {
            this.reportService.printPurchaseOrderReport(purchaseOrder).subscribe(
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
        } else if (purchaseOrder.type === PurchaseOrderTypeEnum.returnedOrder) {
            this.reportService.printPurchaseReturnReport(purchaseOrder).subscribe(
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

    checkDuplicatePurchaseOrder (purchaseOrderItems: PurchaseOrderItemViewModel[]): boolean {
        let result = false;
        purchaseOrderItems.map(x => x.isDuplicate = false);
        purchaseOrderItems.forEach(purchaseOrderItem => {
            if (!purchaseOrderItem.isDuplicate) {
                const purchaseOrderItemsDuplicate = purchaseOrderItems
                                                    .filter(x => (x.variant != null && purchaseOrderItem.variant != null
                                                                                    && x.stockTypeId != null
                                                                                    && purchaseOrderItem.stockTypeId != null
                                                                ? (x.variant.id === purchaseOrderItem.variant.id
                                                                    && x.stockTypeId === purchaseOrderItem.stockTypeId)
                                                                : false));
                if (purchaseOrderItemsDuplicate.length > 1) {
                    purchaseOrderItemsDuplicate.forEach(x => x.isDuplicate = true);
                    result = true;
                }
            }
        });
        return result;
    }

    checkDuplicateCurrentPOItem(index: number) {
        const purchaseOrderItemsDuplicate = this.purchaseOrderItemViewModel
                                            .filter(x => (x.variant != null && this.purchaseOrderItemViewModel[index].variant
                                                                            && x.stockTypeId != null
                                                                            && this.purchaseOrderItemViewModel[index].stockTypeId != null
                                                ? (x.variant.id === this.purchaseOrderItemViewModel[index].variant.id
                                                    && x.stockTypeId === this.purchaseOrderItemViewModel[index].stockTypeId)
                                                : false));
        if (purchaseOrderItemsDuplicate.length > 1) {
            this.showNofiticationDuplicate();
        }
    }

    showNofiticationDuplicate() {
        this.notificationService.error('Duplicate Puchase Order Item');
    }
}
