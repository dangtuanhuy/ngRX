import { Component, OnInit, Injector, Output, EventEmitter, Input } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import * as fromTransferOut from '../../transfer-out/state/transfer-out.reducer';
import * as transferOutSelector from '../../transfer-out/state/index';
import { AllocationTransactionModel,
         AllocationTransactionStatus,
         StockTypeModel
       } from '../../allocation-transaction/allocation-transaction.model';
import { takeWhile } from 'rxjs/operators';
import { ProductListModel, VariantModel } from '../../products/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import {
         AllocationTransactionTransferOutItemViewModel,
         AllocationTransferOutProductModel,
         AddTransferOutRequestModel
       } from '../transfer-out.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TransferOutService } from 'src/app/shared/services/transfer-out.service';

@Component({
  selector: 'app-add-transfer-out',
  templateUrl: './add-transfer-out.component.html',
  styleUrls: ['./add-transfer-out.component.scss']
})
export class AddTransferOutComponent extends ComponentBase {
  public componentActive = true;
  public datasourceWithProduct: Array<AllocationTransactionModel> = [];
  public selectedAllocationTransactions: Array<AllocationTransactionModel> = [];
  public allocationTransactionTransferOutItemsViewModel: Array<AllocationTransactionTransferOutItemViewModel> = [];
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public variants = [];
  public isProductsLoading = true;
  public isVariantsLoading = true;
  public isStockTypesLoading = true;


  @Output() onclickSubtmitButton: EventEmitter<any> = new EventEmitter();
  @Output() onclickBackButton: EventEmitter<any> = new EventEmitter();
  @Input() fromLocationId;
  @Input() toLocationId;

  constructor(
    private store: Store<fromTransferOut.TransferOutState>,
    private productService: ProductService,
    private transferOutService: TransferOutService,
    private notificationService: NotificationService,
    public injector: Injector) {
      super(injector);
  }

  onInit() {
    this.getSelectedAllocationTransaction();
  }

  onDestroy() {
  }

  getSelectedAllocationTransaction () {
    this.handleSubscription(
      this.store.pipe(select(transferOutSelector.getAllocationTransactionByListIds), takeWhile(() => this.componentActive))
      .subscribe((allocationTransactions: Array<AllocationTransactionModel>) => {
        this.allocationTransactionTransferOutItemsViewModel = [];
        this.datasourceWithProduct = allocationTransactions.map ( item => {
          item.status = this.getAllocationTransactionStatus(item.status);
          const allocationTransaction = item;
          return allocationTransaction;
        });
        this.datasourceWithProduct.forEach(selectedAllocationTransactionItem => {
          selectedAllocationTransactionItem.allocationTransactionDetails.forEach (allocationTransactionDetail => {
            const allocationTransactionTransferOutItem: AllocationTransactionTransferOutItemViewModel = {
                id: allocationTransactionDetail.id,
                stockAllocationName: selectedAllocationTransactionItem.name,
                stockAllocationId: selectedAllocationTransactionItem.id,
                productId: allocationTransactionDetail.productId !== Guid.empty() ? allocationTransactionDetail.productId : null,
                variantId: allocationTransactionDetail.variantId !== Guid.empty() ? allocationTransactionDetail.variantId : null,
                quantity: allocationTransactionDetail.quantity,
                maxQuantity: allocationTransactionDetail.quantity,
                stockOnHand: allocationTransactionDetail.stockOnHand,
                variants: null,
                isVariantsLoading: true
            };
            if (allocationTransactionDetail.productId && allocationTransactionDetail.productId !== Guid.empty()) {
                this.productService.getById(allocationTransactionDetail.productId).subscribe(res => {
                    const variants = this.convertVariants(res.variants);
                    allocationTransactionTransferOutItem.variants = variants;
                    const productModel: ProductListModel = {
                      id: res.id,
                      name: res.name,
                      variant: null
                    };
                    this.products = [...this.products, productModel];
                    allocationTransactionTransferOutItem.isVariantsLoading = false;
                });
            } else {
              allocationTransactionTransferOutItem.isVariantsLoading = false;
            }
            this.allocationTransactionTransferOutItemsViewModel.push(allocationTransactionTransferOutItem);
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

  private getProducts() {
    this.isProductsLoading = true;
    this.productService.getAllWithoutPaging().subscribe(res => {
      this.products = res;
      this.isProductsLoading = false;
    });
  }

  public onClickSubmitButton() {
    const request = this.convertDataRequest();
    this.transferOutService.add(request).subscribe(res => {
      this.notificationService.success('Add Transfer Out Successful');
      this.allocationTransactionTransferOutItemsViewModel = [];
      this.onclickSubtmitButton.emit(false);
    });
  }

  public onClickBackButton() {
    this.allocationTransactionTransferOutItemsViewModel = [];
    this.onclickBackButton.emit(false);
  }


  private convertDataRequest() {
    const _allocationTransferOutProducts: Array<AllocationTransferOutProductModel> = [];

    this.allocationTransactionTransferOutItemsViewModel.forEach(element => {
      if (element.quantity > 0) {
        const item: AllocationTransferOutProductModel = {
          stockTransactionRefId: element.id,
          transactionRefId: element.stockAllocationId,
          productId: element.productId,
          variantId: element.variantId,
          quantity: element.quantity
        };
        _allocationTransferOutProducts.push(item);
      }
    });

    const data: AddTransferOutRequestModel = {
      fromLocationId: this.fromLocationId,
      toLocationId: this.toLocationId,
      allocationTransferOutProducts: _allocationTransferOutProducts
    };

    return data;
  }

  public onQuantityChange(index: number) {
    this.allocationTransactionTransferOutItemsViewModel[index].quantity =
    this.allocationTransactionTransferOutItemsViewModel[index].quantity > 0
    ? this.allocationTransactionTransferOutItemsViewModel[index].quantity : 0;
  }

  getAllocationTransactionStatus(status: any) {
    return Object.values(AllocationTransactionStatus).includes(+status)
    ? Object.keys(AllocationTransactionStatus).find(function(item, key) { return key === (+status - 1); })
    : status;
  }
}
