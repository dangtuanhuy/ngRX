import { ViewEncapsulation, Component, Input, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import * as fromApproval from '../state/approval.reducer';
import * as approvalSelector from '../state/index';
import * as approvalActions from '../state/approval.action';
import { takeWhile } from 'rxjs/operators';
import {
  PurchaseOrderModel, PurchaseOrderItemViewModel, CurrencyModel,
  PurchaseOrderItem,
  VariantModel
} from '../../purchase-orders/purchase-order.model';
import { ApprovalModel } from '../approval.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Guid } from 'src/app/shared/utils/guid.util';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { VendorModel } from '../../vendors/vendor.model';
import { PurchaseOrderService } from 'src/app/shared/services/purchase-order.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-purchase-order',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DetailPurchaseOrderComponent extends ComponentBase {

  detailValueForm: FormGroup = new FormGroup({});
  public componentActive = true;
  public purchaseOrderId: string;

  public currencySelected: any;
  public optionSelected: any;
  public vendorSelected: any;

  public vendors = [];
  public currencies = [];
  public products = [];
  public stockTypes = [];

  public isLocationsLoading = true;
  public isProductsLoading = true;
  public isStockTypesLoading = true;

  public purchaseOrder: PurchaseOrderModel;
  public purchaseOrderItemViewModel: Array<PurchaseOrderItemViewModel> = [];

  public isDetail = true;

  constructor(private store: Store<fromApproval.ApprovalState>, public injector: Injector,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private vendorService: VendorService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseProductService: ProductService,
    private purchaseStockTypeService: StockTypeService) {
    super(injector);
  }

  onInit() {
    this.getVendor();
    this.getCurrency();
    this.getStockType();
    this.detailValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      vendor: ['']
    });
    this.handleSubscription(this.store.pipe(
      select(approvalSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (id) {
            this.getSelectPurchaseOrder(id);
          }
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(approvalSelector.getPurchaseOrder), takeWhile(() => this.componentActive))
      .subscribe(
        (purchaseOrder: PurchaseOrderModel) => {
          if (purchaseOrder == null) {
            return;
          }
          this.purchaseOrder = purchaseOrder;
          this.currencySelected = this.purchaseOrder.currencyId;
          this.detailValueForm.patchValue({
            name: this.purchaseOrder.name,
            description: this.purchaseOrder.description,
            vendor: this.purchaseOrder.vendorId !== Guid.empty() ? this.purchaseOrder.vendorId : null
          });

          if (purchaseOrder.purchaseOrderItems && purchaseOrder.purchaseOrderItems.length > 0) {
            this.getPurchaseOrderItemView(purchaseOrder.purchaseOrderItems);
          }
        }));
  }

  onDestroy() {

  }

  getSelectPurchaseOrder(id) {
    this.store.pipe(select(approvalSelector.getApprovals),
      takeWhile(() => this.componentActive))
      .subscribe(
        (approvals: Array<ApprovalModel>) => {
          if (approvals.length > 0) {
            this.purchaseOrderId = approvals.find(x => x.id === id).purchaseOrderId;
            this.store.dispatch(new approvalActions.GetPurchaseOrder(this.purchaseOrderId));
          }
        }
      );
  }

  private getStockType() {
    this.isStockTypesLoading = true;
    this.purchaseStockTypeService.getAllPurchaseStockType().subscribe(res => {
      this.stockTypes = res;
      this.isStockTypesLoading = false;
    });
  }
  private getVendor() {
    this.vendorService.getAllVendor().subscribe((vendors: Array<VendorModel>) => {
      this.vendors = vendors;
    });
  }

  private getCurrency() {
    this.purchaseOrderService.getCurrencies().subscribe((res: Array<CurrencyModel>) => {
      this.currencies = res;
    });
  }

  private getPurchaseOrderItemView(purchaseOrderItems: Array<PurchaseOrderItem>) {
    this.purchaseOrderItemViewModel = [];
    purchaseOrderItems.forEach(purchaseOrderItem => {
      const purchaseOrderItemView: PurchaseOrderItemViewModel = {
        id: purchaseOrderItem.id,
        productId: purchaseOrderItem.product.id !== Guid.empty() ? purchaseOrderItem.product.id : null,
        stockTypeId: purchaseOrderItem.stockTypeId !== Guid.empty() ? purchaseOrderItem.stockTypeId : null,
        quantity: purchaseOrderItem.quantity,
        costValue: purchaseOrderItem.costValue,
        variants: null,
        variant: null,
        isVariantsLoading: true,
        currencyId: purchaseOrderItem.currencyId,
        isDuplicate: false
      };
      if (purchaseOrderItem.product.id && purchaseOrderItem.product.id !== Guid.empty()) {
        this.purchaseProductService.getPurchaseProductById(purchaseOrderItem.product.id).subscribe(res => {
          const variants = this.convertVariants(res.variants);
          const productModel = {
            id: res.id,
            name: res.name
          };
          this.products = [...this.products, productModel];
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
}
