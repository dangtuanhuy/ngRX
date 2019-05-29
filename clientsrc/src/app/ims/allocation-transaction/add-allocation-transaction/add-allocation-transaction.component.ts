import { Component, Injector } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAllocationTransaction from '../state/allocation-transaction.reducer';
import * as allocationTransactionActions from '../state/allocation-transaction.action';
import { Guid } from 'src/app/shared/utils/guid.util';
import {
  AllocationTransactionModel,
  StockTypeModel,
  AllocationTransactionItem,
  AllocationTransactionItemViewModel
} from '../allocation-transaction.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AllocationTransactionStatus } from '../allocation-transaction.model';
import { LocationModel, LocationType } from '../../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ProductListModel, VariantModel } from '../../products/product';
import * as moment from 'moment';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject } from 'rxjs';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';

@Component({
  selector: 'app-add-allocation-transaction',
  templateUrl: './add-allocation-transaction.component.html',
  styleUrls: ['./add-allocation-transaction.component.scss']
})

export class AddAllocationTransactionComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  public wareHouses: Array<LocationModel> = [];
  public outlets: Array<LocationModel> = [];
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public allocationTransactionItemViewModel: Array<AllocationTransactionItemViewModel> = [];
  public allocationTransactionItems: Array<AllocationTransactionItem> = [];
  public variants = [];
  public deliveryDate: NgbDateStruct;

  public isLocationsLoading = true;
  public isProductsLoading = true;
  public isStockTypesLoading = true;
  public selectedWareHouse = null;
  public selectedOutlet = null;
  public isValidData = true;
  public variantBySearch: VariantModel;

  public searchText = new Subject<string>();

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private store: Store<fromAllocationTransaction.AllocationTransactionState>,
    private productService: ProductService,
    private stockTypeService: StockTypeService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    public injector: Injector
  ) {
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
      this.isProductsLoading = false;
    });
  }

  onInit() {
    this.getLocations();
    this.getStockTypes();
    this.addValueForm = this.formBuilder.group({
      wareHouse: ['', Validators.required],
      outlet: ['', Validators.required],
      name: [''],
      description: ['']
    });
  }

  onDestroy() { }

  private getStockTypes() {
    this.isStockTypesLoading = true;
    this.stockTypeService.getAllWithoutPaging().subscribe(res => {
      this.stockTypes = res;
      this.isStockTypesLoading = false;
    });
  }

  public onClickAddButton() {
    const allocationTransactionItemViewModel: AllocationTransactionItemViewModel = {
      id: null,
      productId: null,
      variants: [],
      isVariantsLoading: false,
      variantId: null,
      variant: null,
      quantity: 0
    };
    this.allocationTransactionItemViewModel.push(allocationTransactionItemViewModel);
    const allocationTransactionItem: AllocationTransactionItem = {
      id: Guid.empty(),
      productId: Guid.empty(),
      productName: '',
      variantId: Guid.empty(),
      quantity: 0,
      stockOnHand: 0,
      allocationTransactionId: Guid.empty()
    };
    this.allocationTransactionItems.push(allocationTransactionItem);
  }

  public onSelectedProductChange(index: number) {
    this.clearAllocationProduct(index);
    const productId = this.allocationTransactionItemViewModel[index].productId;
    if (productId) {
      this.allocationTransactionItemViewModel[index].isVariantsLoading = true;
      this.allocationTransactionItems[index].productId = productId;
      if (this.variantBySearch) {
        const variants = this.convertVariants([this.variantBySearch]);
        this.allocationTransactionItemViewModel[index].variantId = this.variantBySearch.id;
        this.allocationTransactionItemViewModel[index].variants = variants;
        this.allocationTransactionItemViewModel[index].variant = null;
        this.allocationTransactionItemViewModel[index].isVariantsLoading = false;
      } else {
        this.productService.getById(productId).subscribe(res => {
          const variants = this.convertVariants(res.variants);
          this.allocationTransactionItemViewModel[index].variants = variants;
          this.allocationTransactionItemViewModel[index].variant = null;
          this.allocationTransactionItemViewModel[index].isVariantsLoading = false;
        });
      }
    }
  }

  public onSelectedVariantChange(index: number, variantId: string) {
    this.allocationTransactionItemViewModel[index].quantity = 0;
    if (variantId) {
      this.allocationTransactionItemViewModel[index].variantId = variantId;
      this.allocationTransactionItemViewModel[index].variant
                            = this.allocationTransactionItemViewModel[index].variants.find(x => x.id === variantId);
    }
    this.allocationTransactionItems[index].variantId = variantId;
  }

  public onQuantityChange(index: number) {
    this.allocationTransactionItems[index].quantity = this.allocationTransactionItemViewModel[index].quantity > 0
      ? this.allocationTransactionItemViewModel[index].quantity : 0;
  }
  public onSelecteddeliveryDateChange(event) {
  }

  private clearAllocationProduct(index: number) {
    this.allocationTransactionItemViewModel[index].variants = [];
    this.allocationTransactionItemViewModel[index].variantId = null;
    this.allocationTransactionItemViewModel[index].quantity = 0;
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

  private getLocations() {
    this.isLocationsLoading = true;
    this.locationService.getByType(LocationType.wareHouse).subscribe(res => {
      this.wareHouses = res;
      this.isLocationsLoading = false;
    });
    this.locationService.getByType(LocationType.store).subscribe(res => {
      this.outlets = res;
      this.isLocationsLoading = false;
    });
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(allocationTransaction: String): void {
    this.activeModal.dismiss(allocationTransaction);
  }

  deleteAllocationTransactionItem(index: number) {
    this.allocationTransactionItemViewModel.splice(index, 1);
    this.allocationTransactionItems.splice(index, 1);
  }

  mergeAllocationTransactionItems(allocationTransactionItems: Array<AllocationTransactionItem>) {
    const listallocationTransaction = new Array<AllocationTransactionItem>();
    allocationTransactionItems.forEach(Item => {
      if (listallocationTransaction.length > 0) {
        const existProduct = listallocationTransaction.find(x => x.productId === Item.productId && x.variantId === Item.variantId);
        if (existProduct !== null && existProduct !== undefined) {
          listallocationTransaction.find(x => x.productId === Item.productId && x.variantId === Item.variantId).quantity =
            listallocationTransaction.find(x => x.productId === Item.productId && x.variantId === Item.variantId).quantity + Item.quantity;
        } else {
          const allocationTransactionItem: AllocationTransactionItem = {
            id: Item.id,
            productId: Item.productId,
            productName: Item.productName,
            variantId: Item.variantId,
            quantity: Item.quantity,
            stockOnHand: 0,
            allocationTransactionId: Item.allocationTransactionId
          };
          listallocationTransaction.push(allocationTransactionItem);
        }
      } else {
        const allocationTransactionItem: AllocationTransactionItem = {
          id: Item.id,
          productId: Item.productId,
          productName: Item.productName,
          variantId: Item.variantId,
          quantity: Item.quantity,
          stockOnHand: 0,
          allocationTransactionId: Item.allocationTransactionId
        };
        listallocationTransaction.push(allocationTransactionItem);
      }
    });
    return listallocationTransaction;
  }

  checkValidRequestItems() {
    let result = true;
    this.allocationTransactionItemViewModel.forEach(item => {
      if (!item.variants || item.quantity === 0) {
        result = false;
      }
    });
    return result;
  }

  checkIsDisableAddItemButton() {
    let result = true;
    if (this.allocationTransactionItemViewModel.length > 0) {
      result = this.checkValidRequestItems();
    }
    return result;
  }

  openVariantModal(index: number, item: AllocationTransactionItemViewModel) {
    if (this.allocationTransactionItemViewModel[index].productId) {
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

  onSave() {
    const deliveryString = this.deliveryDate !== null && this.deliveryDate !== undefined ?
      this.deliveryDate.year + '-' + this.deliveryDate.month + '-' + this.deliveryDate.day : null;
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const fromLocationId = this.addValueForm.get('wareHouse').value;
    const toLocationId = this.addValueForm.get('outlet').value;
    const allocationTransaction: AllocationTransactionModel = {
      id: Guid.empty(),
      name: name,
      description: description,
      fromLocationId: fromLocationId ? fromLocationId : Guid.empty(),
      toLocationId: toLocationId ? toLocationId : Guid.empty(),
      deliveryDate: moment.utc(deliveryString).format('YYYY-MM-DD'),
      status: AllocationTransactionStatus.Draft,
      transactionRef: Guid.empty(),
      allocationTransactionDetails: this.mergeAllocationTransactionItems(this.allocationTransactionItems)
    };

    if (allocationTransaction.allocationTransactionDetails.length <= 0 || deliveryString === null) {
      this.isValidData = false;
    } else {
      allocationTransaction.allocationTransactionDetails.forEach(item => {
        if (!item.variantId || !item.productId || item.quantity === 0) {
          this.isValidData = false;
        }
      });
    }

    if (this.isValidData) {
      this.store.dispatch(new allocationTransactionActions.AddAllocationTransaction(allocationTransaction));
    } else {
      this.notificationService.error('Please input all required fields!');
      this.isValidData = true;
    }
  }
}
