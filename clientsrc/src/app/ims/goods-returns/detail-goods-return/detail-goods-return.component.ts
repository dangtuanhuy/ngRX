import { Component, OnInit, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ReportService } from 'src/app/shared/services/report.service';
import { ProductListModel, VariantModel } from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { StockTypeModel } from '../../goods-inwards/goods-inward.model';
import { InventoryTransactionGoodsReturnViewModel, InventoryTransactionGoodsReturnProductModel } from '../goods-return.model';
import * as goodsReturnActions from '../state/goods-return.action';
import * as goodsReturnSelector from '../../goods-returns/state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';
import { Guid } from 'src/app/shared/utils/guid.util';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-detail-goods-return',
  templateUrl: './detail-goods-return.component.html',
  styleUrls: ['./detail-goods-return.component.scss']
})
export class DetailGoodsReturnComponent extends ComponentBase {
  detailValueForm: FormGroup = new FormGroup({});
  public componentActive = true;
  public isProductsLoading = true;
  public isStockTypesLoading = true;
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public inventoryTransactionGoodsReturn: InventoryTransactionGoodsReturnViewModel;
  public inventoryTransactionGoodsReturns: Array<InventoryTransactionGoodsReturnViewModel> = [];
  public inventoryTransactionGoodsReturnProducts: Array<InventoryTransactionGoodsReturnProductModel> = [];
  constructor(
    private store: Store<any>,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.detailValueForm = this.formBuilder.group({
      toVendor: [''],
      fromWareHouse: [''],
      goodsReturnCode: [''],
      createdDate: [''],
    });

    this.handleSubscription(this.store.pipe(
      select(goodsReturnSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.getInventoryTransaction(id);
        }
      ));
  }

  onDestroy() {

  }

  getInventoryTransaction(id: string) {
    this.store.pipe(select(goodsReturnSelector.getGoodsReturns), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionGoodsReturns: Array<InventoryTransactionGoodsReturnViewModel>) => {
        if (inventoryTransactionGoodsReturns == null) {
          return;
        }
        const inventoryTransactionGoodsReturn = inventoryTransactionGoodsReturns.find(x => x.id === id);
        if (inventoryTransactionGoodsReturn != null) {
          this.detailValueForm.patchValue({
            toVendor: inventoryTransactionGoodsReturn.toLocationName,
            fromWareHouse: inventoryTransactionGoodsReturn.fromLocationName,
            goodsReturnCode: inventoryTransactionGoodsReturn.code,
            createdDate: inventoryTransactionGoodsReturn.createdDate,
          });
          this.inventoryTransactionGoodsReturn = inventoryTransactionGoodsReturn;
          this.getInventoryTransactionProducts(inventoryTransactionGoodsReturn.items);
        }
      });
  }

  private getInventoryTransactionProducts(inventoryTransactionGoodReturnItems:
    Array<InventoryTransactionGoodsReturnProductModel>) {
    this.inventoryTransactionGoodsReturnProducts = [];
    inventoryTransactionGoodReturnItems.forEach(inventoryTransactionGoodReturnItem => {
      const inventoryTransactionProduct: InventoryTransactionGoodsReturnProductModel = {
        id: inventoryTransactionGoodReturnItem.id,
        productId: inventoryTransactionGoodReturnItem.productId !== Guid.empty()
          ? inventoryTransactionGoodReturnItem.productId
          : null,
        variantId: inventoryTransactionGoodReturnItem.variantId !== Guid.empty()
          ? inventoryTransactionGoodReturnItem.variantId
          : null,
        stockTypeId: Guid.empty(),
        quantity: inventoryTransactionGoodReturnItem.quantity,
        stockTransactionRefId: inventoryTransactionGoodReturnItem.stockTransactionRefId,
        transactionRefId: inventoryTransactionGoodReturnItem.transactionRefId,
        variants: null,
        isVariantsLoading: true
      };
      if (inventoryTransactionGoodReturnItem.productId && inventoryTransactionGoodReturnItem.productId !== Guid.empty()) {
        this.productService.getById(inventoryTransactionGoodReturnItem.productId).subscribe(res => {
          const variants = this.convertVariants(res.variants);
          inventoryTransactionProduct.variants = variants;
          const productModel: ProductListModel = {
            id: res.id,
            name: res.name
          };
          this.products = [...this.products, productModel];
          inventoryTransactionProduct.isVariantsLoading = false;
        });
      } else {
        inventoryTransactionProduct.isVariantsLoading = false;
      }
      this.inventoryTransactionGoodsReturnProducts.push(inventoryTransactionProduct);
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

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }


}
