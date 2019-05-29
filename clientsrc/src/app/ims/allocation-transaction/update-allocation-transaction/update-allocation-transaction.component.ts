import { Component, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromAllocationTransaction from '../state/allocation-transaction.reducer';
import * as allocationTransactionActions from '../state/allocation-transaction.action';
import * as allocationTransactionSelector from '../state/index';
import { Guid } from 'src/app/shared/utils/guid.util';
import { AllocationTransactionModel,
         StockTypeModel,
         AllocationTransactionItemViewModel,
         AllocationTransactionItem
       } from '../allocation-transaction.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AllocationTransactionStatus } from '../allocation-transaction.model';
import { LocationModel, LocationType } from '../../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ProductListModel, VariantModel } from '../../products/product';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject } from 'rxjs';
import { AllocationTransactionStatusEnum } from 'src/app/shared/constant/allocation-transaction.constant';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';

@Component({
  selector: 'app-update-allocation-transaction',
  templateUrl: './update-allocation-transaction.component.html',
  styleUrls: ['./update-allocation-transaction.component.scss']
})

export class UpdateAllocationTransactionComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  public wareHouses: Array<LocationModel> = [];
  public outlets: Array<LocationModel> = [];
  public products: Array<ProductListModel> = [];
  public stockTypes: Array<StockTypeModel> = [];
  public allocationTransactionItemViewModel: Array<AllocationTransactionItemViewModel> = [];
  public allocationTransactionItems: Array<AllocationTransactionItem> = [];
  public allocationTransaction: AllocationTransactionModel;
  public componentActive = true;
  public variants = [];
  public deliveryDate: any;
  public defaultWareHouse: any;
  public defaultOutlet: any;
  public defaultDeliveryDate: any;

  public isLocationsLoading = true;
  public isProductsLoading = true;
  public isStockTypesLoading = true;
  public selectedWareHouse = null;
  public selectedOutlet = null;
  public isValidData = true;
  public isEditMode = true;

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
      this.products = result;
      this.isProductsLoading = false;
  });
  }

  onInit() {
    this.getLocations();
    this.updateValueForm = this.formBuilder.group({
      wareHouse: ['', Validators.required],
      outlet: ['', Validators.required],
      name: ['', Validators.required],
      description: ['']
    });

    this.handleSubscription(this.store.pipe(
      select(allocationTransactionSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new allocationTransactionActions.GetAllocationTransaction(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(allocationTransactionSelector.getAllocationTransaction), takeWhile(() => this.componentActive))
      .subscribe(
        (allocationTransaction: AllocationTransactionModel) => {
          if (allocationTransaction == null) {
            return;
          }
          this.allocationTransaction = allocationTransaction;
          this.updateValueForm.patchValue({
            wareHouse: this.allocationTransaction.fromLocationId,
            outlet: this.allocationTransaction.toLocationId,
            name: this.allocationTransaction.name,
            description: this.allocationTransaction.description,
          });

          if (allocationTransaction.status === AllocationTransactionStatusEnum.Complete
            || allocationTransaction.status === AllocationTransactionStatusEnum.PartialTransfer) {
            this.isEditMode = false ;
          } else {
            this.isEditMode = true ;
          }
          this.allocationTransactionItems = allocationTransaction.allocationTransactionDetails;
          this.getAllocationTransactionItemViewModel(allocationTransaction.allocationTransactionDetails);
        }));
  }

  onDestroy() { }

  private getAllocationTransactionItemViewModel(allocationTransactionItems: Array<AllocationTransactionItem>) {
    const date = moment(this.allocationTransaction.deliveryDate, 'YYYY-MM-DD').toDate();
    this.deliveryDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    this.allocationTransactionItemViewModel = [];
    this.products = [];
    allocationTransactionItems.forEach(allocationTransactionItem => {
        const allocationTransactionItemView: AllocationTransactionItemViewModel = {
            id: allocationTransactionItem.id,
            productId: allocationTransactionItem.productId !== Guid.empty() ? allocationTransactionItem.productId : null,
            variantId: allocationTransactionItem.variantId !== Guid.empty() ? allocationTransactionItem.variantId : null,
            quantity: allocationTransactionItem.quantity,
            variants: null,
            variant: null,
            isVariantsLoading: true
        };

        const product:  ProductListModel = {
          id: allocationTransactionItem.productId,
          name: allocationTransactionItem.productName,
          variant: null
        };
        this.products.push(product);

        if (allocationTransactionItem.productId && allocationTransactionItem.productId !== Guid.empty()) {
            this.productService.getById(allocationTransactionItem.productId).subscribe(res => {
                const variants = this.convertVariants(res.variants);
                allocationTransactionItemView.variants = variants;
                allocationTransactionItemView.variant = variants.find(x => x.id === allocationTransactionItem.variantId);
                allocationTransactionItemView.isVariantsLoading = false;
            });
        } else {
          allocationTransactionItemView.isVariantsLoading = false;
        }
        const existVariant = this.allocationTransactionItemViewModel.find(x => x.variantId === allocationTransactionItemView.variantId);
        if (existVariant !== null && existVariant !== undefined) {
          this.allocationTransactionItemViewModel.find(x => x.variantId === allocationTransactionItemView.variantId).quantity +=
                                                  allocationTransactionItemView.quantity;
        } else {
          this.allocationTransactionItemViewModel.push(allocationTransactionItemView);
        }
    });
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
    if (productId && productId !== Guid.empty()) {
      this.allocationTransactionItemViewModel[index].isVariantsLoading = true;
      this.allocationTransactionItems[index].productId = productId;
      this.productService.getById(productId).subscribe(res => {
        const variants = this.convertVariants(res.variants);
        this.allocationTransactionItemViewModel[index].variants = variants;
        this.allocationTransactionItemViewModel[index].variant = null;
        this.allocationTransactionItemViewModel[index].isVariantsLoading = false;
      });
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

  private clearAllocationProduct(index: number) {
    this.allocationTransactionItemViewModel[index].variants = [];
    this.allocationTransactionItemViewModel[index].variantId = null;
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

  public onSelecteddeliveryDateChange (event) {
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


  mergeAllocationTransactionItems (allocationTransactionItems: Array<AllocationTransactionItem>) {
    const listallocationTransaction = new Array<AllocationTransactionItem>();
    allocationTransactionItems.forEach( Item => {
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
    const name = this.updateValueForm.get('name').value;
    const description = this.updateValueForm.get('description').value;
    const fromLocationId = this.updateValueForm.get('wareHouse').value;
    const toLocationId = this.updateValueForm.get('outlet').value;
    const allocationTransaction: AllocationTransactionModel = {
      id: this.allocationTransaction.id,
      name: name,
      description: description,
      fromLocationId: fromLocationId ? fromLocationId : Guid.empty(),
      toLocationId: toLocationId ? toLocationId : Guid.empty(),
      deliveryDate: moment.utc(deliveryString).local().format('YYYY-MM-DD'),
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
      this.store.dispatch(new allocationTransactionActions.UpdateAllocationTransaction(allocationTransaction));
    } else {
      this.notificationService.error('Please input all required fields!');
      this.isValidData = true;
    }
  }

  getAllocationTransactionStatus(status: any) {
    return Object.values(AllocationTransactionStatus).includes(+status)
      ? Object.keys(AllocationTransactionStatus).find(function (item, key) { return key === (+status - 1); })
      : status;
  }
}
