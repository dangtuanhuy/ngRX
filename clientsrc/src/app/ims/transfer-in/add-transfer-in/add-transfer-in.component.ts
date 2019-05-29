import { Component, OnInit, Output, EventEmitter, Injector } from '@angular/core';
import * as fromTransferIn from '../../transfer-in/state/transfer-in.reducer';
import * as transferInActions from '../../transfer-in/state/transfer-in.action';
import * as transferInSelector from '../../transfer-in/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ProductListModel, VariantModel } from '../../products/product';
import { StockTypeModel } from '../../allocation-transaction/allocation-transaction.model';
import { Store, select } from '@ngrx/store';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
  InventoryTransactionTransferInViewModel,
  InventoryTransactionTransferInItemViewModel,
  AddTransferInRequestModel,
  InventoryTransactionTransferInRequestModel
} from '../transfer-in.model';
import { takeWhile } from 'rxjs/operators';
import { Guid } from 'src/app/shared/utils/guid.util';
import { TransferInService } from 'src/app/shared/services/transfer-in.service';

@Component({
  selector: 'app-add-transfer-in',
  templateUrl: './add-transfer-in.component.html',
  styleUrls: ['./add-transfer-in.component.scss']
})
export class AddTransferInComponent extends ComponentBase {
  public componentActive = true;
  public datasourceWithProduct: Array<InventoryTransactionTransferInViewModel> = [];
  public selectedInventoryTransactions: Array<InventoryTransactionTransferInViewModel> = [];
  public inventoryTransactionTransferInItemViewModel: Array<InventoryTransactionTransferInItemViewModel> = [];
  public inventoryTransactionTransferInItemRequest: Array<InventoryTransactionTransferInItemViewModel> = [];
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public variants = [];
  public isProductsLoading = true;
  public isVariantsLoading = true;
  public isStockTypesLoading = true;


  @Output() onclickSubtmitButton: EventEmitter<any> = new EventEmitter();
  @Output() onclickBackButton: EventEmitter<any> = new EventEmitter();


  constructor(
    private store: Store<fromTransferIn.TransferInState>,
    private productService: ProductService,
    private stockTypeService: StockTypeService,
    private transferInService: TransferInService,
    private notificationService: NotificationService,
    public injector: Injector) {
      super(injector);
  }

  onInit() {
    this.getSelectedInventoryTransaction();
  }

  onDestroy() {
  }

  getSelectedInventoryTransaction() {
    this.store.pipe(select(transferInSelector.getInventoryTransactionTransferIns), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionTransferIns: Array<InventoryTransactionTransferInViewModel>) => {
        this.datasourceWithProduct = inventoryTransactionTransferIns.map(item => {
          const inventoryTransactionTransferIn = item;
          return inventoryTransactionTransferIn;
        });
      });

    this.handleSubscription(this.store.pipe(
      select(transferInSelector.getSelectedItems), takeWhile(() => this.componentActive))
      .subscribe(selectedItems => {
        this.selectedInventoryTransactions = [];
        selectedItems.forEach(item => {
          const inventoryTransaction = this.datasourceWithProduct.find(x => x.id === item);
          this.selectedInventoryTransactions.push(inventoryTransaction);
        });
        this.selectedInventoryTransactions.forEach(selectedInventoryTransactionItem => {
          selectedInventoryTransactionItem.inventoryTransactionTransferProducts.forEach(inventoryTransactionTransferInProduct => {
            const inventoryTransactionTransferInItem: InventoryTransactionTransferInItemViewModel = {
              id: inventoryTransactionTransferInProduct.id,
              productId: inventoryTransactionTransferInProduct.productId !== Guid.empty()
                ? inventoryTransactionTransferInProduct.productId
                : null,
              variantId: inventoryTransactionTransferInProduct.variantId !== Guid.empty()
                ? inventoryTransactionTransferInProduct.variantId
                : null,
              stockTypeId: inventoryTransactionTransferInProduct.stockTypeId !== Guid.empty()
                ? inventoryTransactionTransferInProduct.stockTypeId : null,
              quantity: inventoryTransactionTransferInProduct.quantity,
              maxQuantity: inventoryTransactionTransferInProduct.quantity,
              variants: null,
              isVariantsLoading: true,
              stockTransactionRefId: inventoryTransactionTransferInProduct.stockTransactionRefId,
              transactionRefId: inventoryTransactionTransferInProduct.transactionRefId,
              inventoryTransactionFromLocation: selectedInventoryTransactionItem.fromLocationId,
              inventoryTransactionToLocation: selectedInventoryTransactionItem.toLocationId,
              inventorytransactionRefId: selectedInventoryTransactionItem.inventoryTransactionRefId,
              inventoryTransactionTransferNumber: selectedInventoryTransactionItem.transferNumber,
              inventoryTransactionId: selectedInventoryTransactionItem.id,
            };
            if (inventoryTransactionTransferInProduct.productId && inventoryTransactionTransferInProduct.productId !== Guid.empty()) {
              this.productService.getById(inventoryTransactionTransferInProduct.productId).subscribe(res => {
                const variants = this.convertVariants(res.variants);
                inventoryTransactionTransferInItem.variants = variants;
                const productModel: ProductListModel = {
                  id: res.id,
                  name: res.name,
                  variant: null
                };
                this.products = [...this.products, productModel];
                inventoryTransactionTransferInItem.isVariantsLoading = false;
              });
            } else {
              inventoryTransactionTransferInItem.isVariantsLoading = false;
            }
            this.inventoryTransactionTransferInItemRequest.push(Object.assign({}, inventoryTransactionTransferInItem));

            const existVariant = this.inventoryTransactionTransferInItemViewModel
              .find(x => x.variantId === inventoryTransactionTransferInItem.variantId);

            if (existVariant !== null && existVariant !== undefined) {
              this.inventoryTransactionTransferInItemViewModel.find(x => x.variantId ===
                inventoryTransactionTransferInItem.variantId).quantity +=
                inventoryTransactionTransferInItem.quantity;

              this.inventoryTransactionTransferInItemViewModel.find(x => x.variantId ===
                inventoryTransactionTransferInItem.variantId).maxQuantity +=
                inventoryTransactionTransferInItem.maxQuantity;
            } else {
              this.inventoryTransactionTransferInItemViewModel.push(inventoryTransactionTransferInItem);
            }
          });
        });
      }));
  }

  public convertVariants(variants: Array<VariantModel>) {
    variants.forEach(item => {
      item.name = this.generatedVariantName(item);
    });
    return variants;
  }

  public generatedVariantName(variant: VariantModel) {
    let name = '';
    variant.fieldValues.forEach(item => {
      name += `${item.name}: ${item.value};`;
    });

    return name;
  }

  public onClickSubmitButton() {
    const request = this.convertDataRequest();
    this.transferInService.add(request).subscribe(res => {
      this.notificationService.success('Add Transfer In Successful');
      this.inventoryTransactionTransferInItemViewModel = [];
      this.inventoryTransactionTransferInItemRequest = [];
      this.onclickSubtmitButton.emit(false);
    });
  }

  public onClickBackButton() {
    this.onclickBackButton.emit(false);
  }

  public convertDataRequest() {
    const _addTransferInRequestModel = new AddTransferInRequestModel();
    _addTransferInRequestModel.inventoryTransactionTransferInsModel = [];
    this.inventoryTransactionTransferInItemRequest.forEach(element => {
      if (element.quantity > 0) {
        const item: InventoryTransactionTransferInRequestModel = {
          id: element.id,
          productId: element.productId,
          variantId: element.variantId,
          stockTypeId: Guid.empty(),
          quantity: element.quantity,
          stockTransactionRefId: element.stockTransactionRefId,
          transactionRefId: element.transactionRefId,
          inventoryTransactionId: element.inventoryTransactionId,
          inventoryTransactionToLocation: element.inventoryTransactionToLocation,
          inventoryTransactionTransferNumber: element.inventoryTransactionTransferNumber,
          inventoryTransactionFromLocation: element.inventoryTransactionFromLocation,
          inventorytransactionRefId: element.inventorytransactionRefId
        };
        _addTransferInRequestModel.inventoryTransactionTransferInsModel.push(item);
      }
    });

    return _addTransferInRequestModel;
  }
}
