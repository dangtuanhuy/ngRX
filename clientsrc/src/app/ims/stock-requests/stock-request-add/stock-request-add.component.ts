import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromStockRequest from '../state/stock-request.reducer';
import * as stockRequestActions from '../state/stock-request.action';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationModel, LocationType } from '../../locations/location.model';
import {
  StockRequestItemViewModel,
  StockRequestModelAddRequest,
  StockRequestItemModelRequest
} from '../stock-request.model';
import { ProductListModel, VariantModel } from '../../products/product';
import { Guid } from 'src/app/shared/utils/guid.util';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LocationService } from 'src/app/shared/services/location.service';
import { Subject } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';

@Component({
  selector: 'app-stock-request-add',
  templateUrl: './stock-request-add.component.html',
  styleUrls: ['./stock-request-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockRequestAddComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  public warehouses: LocationModel[] = [];
  public stores: LocationModel[] = [];
  public isWarehousesLoading = true;
  public isStoresLoading = true;
  public stockRequestItemsViewModel: StockRequestItemViewModel[] = [];
  public today = new Date();
  public products: ProductListModel[] = [];
  public searchText = new Subject<string>();
  public variantBySearch: VariantModel;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromStockRequest.StockRequestState>,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private locationService: LocationService,
    private productService: ProductService,
    private modalService: NgbModal,
    public injector: Injector) {
    super(injector);
    this.productService.getProductsByQueryText(this.searchText).subscribe(result => {
      if (result && result.length > 0) {
        const productModel = result[0];
        if (productModel.variant && productModel.variant.id !== Guid.empty()) {
          productModel.name = `${productModel.name} - Code: ${productModel.variant.code}`;
          this.products = [productModel];
          this.variantBySearch = productModel.variant;
          return;
        }
      }
      this.variantBySearch = null;
      this.products = result;
    });
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      subject: [''],
      warehouse: [null, Validators.required],
      store: [null, Validators.required],
      description: [''],
      date: [new NgbDate(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate()), Validators.required]
    });
    this.getLocations();
  }

  onDestroy() {

  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  getLocations() {
    this.getWarehouses();
    this.getStores();
  }

  private getWarehouses() {
    this.isWarehousesLoading = true;
    this.locationService.getByType(LocationType.wareHouse).subscribe((warehouses: LocationModel[]) => {
      this.warehouses = warehouses;
      this.isWarehousesLoading = false;
    });
  }

  private getStores() {
    this.isStoresLoading = true;
    this.locationService.getByType(LocationType.store).subscribe((stores: LocationModel[]) => {
      this.stores = stores;
      this.isStoresLoading = false;
    });
  }

  onClickAddButton() {
    const stockRequestItem: StockRequestItemViewModel = {
      id: Guid.empty(),
      product: {
        id: null,
        name: null,
        variant: null
      },
      variant: null,
      variants: [],
      quantity: 0,
      isVariantsLoading: false
    };
    this.stockRequestItemsViewModel.push(stockRequestItem);
  }

  deleteStockRequestItem(index: number) {
    this.stockRequestItemsViewModel.splice(index, 1);
  }

  onSelectedProductChange(index: number) {
    this.clearStockRequestItem(index);
    const productId = this.stockRequestItemsViewModel[index].product.id;
    if (productId) {
      this.stockRequestItemsViewModel[index].isVariantsLoading = true;
      if (this.variantBySearch) {
        this.stockRequestItemsViewModel[index].variant = this.variantBySearch;
        this.stockRequestItemsViewModel[index].variants = [this.variantBySearch];
        this.stockRequestItemsViewModel[index].isVariantsLoading = false;
      } else {
        this.productService.getById(productId).subscribe(product => {
          this.stockRequestItemsViewModel[index].variants = product.variants;
          this.stockRequestItemsViewModel[index].isVariantsLoading = false;
        });
      }
    }
  }

  openVariantModal(index: number, item: StockRequestItemViewModel) {
    if (this.stockRequestItemsViewModel[index].product.id) {
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

  onSelectedVariantChange(index: number, variantId: string) {
    if (variantId) {
      this.stockRequestItemsViewModel[index].variant
        = this.stockRequestItemsViewModel[index].variants.find(x => x.id === variantId);
      this.stockRequestItemsViewModel[index].variant.id = variantId;
    }
  }

  onQuantityChange(index: number) {
    this.stockRequestItemsViewModel[index].quantity = this.stockRequestItemsViewModel[index].quantity > 0
      ? this.stockRequestItemsViewModel[index].quantity : 0;
  }

  onSave() {
    const request = this.generatedRequest();
    if (this.checkIsValidToSave()) {
      this.store.dispatch(new stockRequestActions.AddStockRequest(request));
    } else {
      this.notificationService.error('Please input all required fields!');
    }
  }

  private generatedRequest() {
    const stockRequestItems: StockRequestItemModelRequest[] = [];
    this.stockRequestItemsViewModel.forEach(x => {
      if (x.variant) {
        const item: StockRequestItemModelRequest = {
          variant: x.variant,
          quantity: x.quantity
        };
        stockRequestItems.push(item);
      }
    });
    const date = this.addValueForm.get('date').value;
    const request: StockRequestModelAddRequest = {
      id: Guid.empty(),
      subject: this.addValueForm.get('subject').value,
      fromLocationId: this.addValueForm.get('warehouse').value.id,
      toLocationId: this.addValueForm.get('store').value.id,
      description: this.addValueForm.get('description').value,
      dateRequest: new Date(date.year, date.month - 1, date.day, 23, 59, 59),
      stockRequestItems: stockRequestItems
    };
    return request;
  }

  private checkIsValidToSave() {
    let result = true;
    if (this.stockRequestItemsViewModel.length <= 0) {
      result = false;
    } else {
      result = this.checkValidRequestItems();
    }
    return result;
  }

  private checkValidRequestItems() {
    let result = true;
    this.stockRequestItemsViewModel.forEach(item => {
      if (!item.variant || item.quantity === 0) {
        result = false;
      }
    });
    return result;
  }

  private clearStockRequestItem(index: number) {
    this.stockRequestItemsViewModel[index].variants = [];
    this.stockRequestItemsViewModel[index].variant = null;
    this.stockRequestItemsViewModel[index].quantity = 0;
  }
}
