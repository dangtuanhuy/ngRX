import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import { Guid } from 'src/app/shared/utils/guid.util';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as purchaseSelector from '../state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { RequestPurchaseOrderModel, PurchaseOrderItem, PurchaseOrderItemViewModel, CurrencyModel } from '../purchase-order.model';
import { VendorModel } from '../../vendors/vendor.model';
import { VariantModel, ProductListModel } from 'src/app/ims/products/product';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';
import { Subject } from 'rxjs';
import { PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-add-purchase-order',
    templateUrl: './add-purchase-order.component.html',
    styleUrls: ['./add-purchase-order.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPurchaseOrderComponent extends ComponentBase {
    addValueForm: FormGroup = new FormGroup({});

    public title: string;
    public products: Array<ProductListModel> = [];
    public purchaseOrderItemViewModel: Array<PurchaseOrderItemViewModel> = [];
    public variants = [];
    public stockTypes = [];
    public purchaseOrderItems: Array<PurchaseOrderItem> = [];
    public componentActive = true;
    public vendors = [];
    public selectedVendor: any;
    public selectedVariant: any;

    public isLocationsLoading = true;
    public isProductsLoading = true;
    public isStockTypesLoading = true;

    public currencies = [];
    public currencySelected: any;
    public stockTypeSelected: any;
    public isAdding: Boolean = false;
    public optionSelected: any;
    public today = new Date();
    public types: PurchaseOrderTypeEnum;
    public variantBySearch: VariantModel;
    public purchaseOrderType: string;

    public searchText = new Subject<string>();

    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private store: Store<fromPurchaseOrder.PurchaseOrderState>,
        private purchaseProductService: ProductService,
        private purchaseStockTypeService: StockTypeService,
        public injector: Injector,
        private modalService: NgbModal,
        private notificationService: NotificationService
    ) {
        super(injector);
        this.purchaseProductService.getPurchaseProductsByQueryText(this.searchText).subscribe(products => {
            if (products && products.length > 0) {
                const productModel = products[0];
                if (productModel.variant && productModel.variant.id !== Guid.empty()) {
                    productModel.name = `${productModel.name} - Code: ${productModel.variant.code}`;
                    this.products = [productModel];
                    this.variantBySearch = productModel.variant;
                    return;
                }
            }
            this.products = products;
            this.variantBySearch = null;
            this.isProductsLoading = false;
        });
    }

    onInit() {
        this.getStockType();
        this.addValueForm = this.formBuilder.group({
            name: [''],
            description: [''],
            vendor: [null],
            type: [1, Validators.required],
            date: [new NgbDate(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate()), Validators.required]
        });
        this.store.dispatch(new purchaseOrderActions.GetAllVendors());
        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getAllVendors))
                .subscribe(
                    (vendors: Array<VendorModel>) => {
                        this.vendors = vendors;
                    }
                )
        );

        this.store.dispatch(new purchaseOrderActions.GetCurrencies());
        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getCurrencies))
                .subscribe(
                    (currencies: Array<CurrencyModel>) => {
                        this.currencies = currencies;
                    }
                )
        );

        this.handleSubscription(
            this.store.pipe(select(purchaseSelector.getPurchaseOrderType))
                .subscribe(
                    (type: string) => {
                        this.purchaseOrderType = type;
                        if (type === 'PurchaseOrder') {
                            this.types = PurchaseOrderTypeEnum.draftPO;
                            this.title = 'Add Purchase Order';
                        }
                        if (type === 'ReturnedOrder') {
                            this.types = PurchaseOrderTypeEnum.draftRO;
                            this.title = 'Add Return Order';
                        }
                    }
                )
        );
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
            variant: null,
            isVariantsLoading: false,
            stockTypeId: this.stockTypeSelected ? this.stockTypeSelected : null,
            quantity: 0,
            costValue: 0,
            currencyId: null,
            isDuplicate: false,
        };
        this.purchaseOrderItemViewModel.push(purchaseOrderItemView);
        const purchaseOrderItem: PurchaseOrderItem = {
            id: Guid.empty(),
            product: null,
            variantId: Guid.empty(),
            stockTypeId: this.stockTypeSelected ? this.stockTypeSelected : Guid.empty(),
            quantity: 0,
            costValue: 0,
            purchaseOrderId: Guid.empty(),
            currencyId: this.currencySelected,
        };
        this.purchaseOrderItems.push(purchaseOrderItem);
        this.isAdding = true;
    }

    onSelectedProductChange(index: number) {
        this.clearPurchaseOrderItem(index);
        const productId = this.purchaseOrderItemViewModel[index].productId;
        if (productId) {
            this.purchaseOrderItemViewModel[index].isVariantsLoading = true;
            this.selectedVariant = null;
            if (this.variantBySearch) {
                this.purchaseOrderItemViewModel[index].variant = this.variantBySearch;
                this.purchaseOrderItemViewModel[index].variants = [this.variantBySearch];
                this.purchaseOrderItemViewModel[index].isVariantsLoading = false;
                this.purchaseOrderItemViewModel[index].isDuplicate = false;
            } else {
                this.purchaseProductService.getPurchaseProductById(productId).subscribe(res => {
                    const variants = this.convertVariants(res.variants);
                    this.purchaseOrderItemViewModel[index].variants = variants;
                    this.purchaseOrderItemViewModel[index].isVariantsLoading = false;
                    this.purchaseOrderItemViewModel[index].isDuplicate = false;
                });
            }
        }
    }

    public onSelectedVariantChange(index: number, variantId: string) {
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

    private convertVariants(variants: Array<VariantModel>) {
        variants.forEach(item => {
            item.name = this.generatedVariantName(item);
        });
        return variants;
    }

    private generatedVariantName(variant: VariantModel) {
        let name = '';
        variant.fieldValues.forEach(item => {
            name += `${item.name}: ${item.value}; `;
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
            const name = this.addValueForm.get('name').value;
            const description = this.addValueForm.get('description').value;
            const vendorId = this.addValueForm.get('vendor').value;
            const date = this.addValueForm.get('date').value;
            const purchaseOrder: RequestPurchaseOrderModel = {
                id: Guid.empty(),
                name: name,
                description: description,
                vendorId: vendorId ? vendorId : Guid.empty(),
                type: this.types,
                date: new Date(date.year, date.month - 1, date.day).toDateString(),
                currencyId: this.currencySelected,
                purchaseOrderItems: this.purchaseOrderItems,
            };
            this.store.dispatch(new purchaseOrderActions.AddPurchaseOrder(purchaseOrder, this.purchaseOrderType));
        }
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

    deletePurchaseOrderItem(index: number) {
        this.purchaseOrderItemViewModel.splice(index, 1);
        this.purchaseOrderItems.splice(index, 1);
        this.isAdding = false;
    }

    onSelectedVendorChange(event: any) {
        this.currencySelected = event.currencyId;
        this.purchaseOrderItems.forEach(item => {
            item.currencyId = this.currencySelected;
        });
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

    checkDuplicatePurchaseOrder (purchaseOrderItems: PurchaseOrderItemViewModel[]): boolean {
        let result = false;
        purchaseOrderItems.map(x => x.isDuplicate = false);
        purchaseOrderItems.forEach(purchaseOrderItem => {
            if (!purchaseOrderItem.isDuplicate) {
                const purchaseOrderItemsDuplicate = purchaseOrderItems
                                                    .filter(x => (x.variant != null && purchaseOrderItem.variant != null
                                                                                    && x.stockTypeId != null
                                                                                    && purchaseOrderItem.stockTypeId != null
                                                                ? x.variant.id === purchaseOrderItem.variant.id
                                                                    && x.stockTypeId === purchaseOrderItem.stockTypeId
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
                                                ? x.variant.id === this.purchaseOrderItemViewModel[index].variant.id
                                                    && x.stockTypeId === this.purchaseOrderItemViewModel[index].stockTypeId
                                                : false));
        if (purchaseOrderItemsDuplicate.length > 1) {
            this.showNofiticationDuplicate();
        }
    }

    showNofiticationDuplicate() {
        this.notificationService.error('Duplicate Puchase Order Item');
    }
}
