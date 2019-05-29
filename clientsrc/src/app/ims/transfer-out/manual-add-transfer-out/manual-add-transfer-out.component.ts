import { Component, OnInit, Output, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { LocationModel, LocationType } from '../../locations/location.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store } from '@ngrx/store';
import { LocationService } from 'src/app/shared/services/location.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductListModel, VariantModel } from '../../products/product';
import { TransferOutItemViewModel, AllocationTransferOutProductModel, AddTransferOutRequestModel } from '../transfer-out.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import { TransferOutService } from 'src/app/shared/services/transfer-out.service';
import { Subject } from 'rxjs';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-add-transfer-out',
  templateUrl: './manual-add-transfer-out.component.html',
  styleUrls: ['./manual-add-transfer-out.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManualAddTransferOutComponent extends ComponentBase {
  locationForm: FormGroup = new FormGroup({});
  @Output() onclickBackButton: EventEmitter<any> = new EventEmitter();
  @Output() onclickSubtmitButton: EventEmitter<any> = new EventEmitter();
  public locations: Array<LocationModel> = [];
  public isLocationsLoading = true;
  public componentActive = true;
  public products: Array<ProductListModel> = [];
  public transferOutViewModel: Array<TransferOutItemViewModel> = [];
  public variants = [];
  public isProductsLoading = true;
  public isVariantsLoading = true;
  public isValidData = true;
  public manualTransferFromDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  public manualTransferToDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };
  public selectedFromLocation: any;
  public selectedToLocation: any;
  public searchText = new Subject<string>();
  public variantBySearch: VariantModel;

  constructor(
    private store: Store<any>,
    private locationService: LocationService,
    private productService: ProductService,
    private transferOutService: TransferOutService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
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
      this.isProductsLoading = false;
    });
  }

  onInit() {
    this.getLocations();
    this.locationForm = this.formBuilder.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
    });
  }

  onDestroy() {
  }

  private getProducts() {
    this.isProductsLoading = true;
    this.productService.getAllWithoutPaging().subscribe(res => {
      this.products = res;
      this.isProductsLoading = false;
    });
  }
  public onClickAddButton() {
    const transferOutViewModel: TransferOutItemViewModel = {
      id: null,
      productId: null,
      variant: null,
      variants: [],
      isVariantsLoading: false,
      variantId: null,
      quantity: 0,
      stockOnHand: 0
    };
    this.transferOutViewModel.push(transferOutViewModel);
  }

  public onSelectedProductChange(index: number) {
    this.clearAllocationProduct(index);
    const productId = this.transferOutViewModel[index].productId;
    if (productId) {
      this.transferOutViewModel[index].isVariantsLoading = true;
      if (this.variantBySearch) {
        const variants = this.convertVariants([this.variantBySearch]);
        this.transferOutViewModel[index].variantId = this.variantBySearch.id;
        this.transferOutViewModel[index].variants = variants;
        this.transferOutViewModel[index].variant = null;
        this.transferOutViewModel[index].isVariantsLoading = false;
      } else {
        this.productService.getById(productId).subscribe(res => {
          const variants = this.convertVariants(res.variants);
          this.transferOutViewModel[index].variants = variants;
          this.transferOutViewModel[index].variant = null;
          this.transferOutViewModel[index].isVariantsLoading = false;
        });
      }
    }
  }

  public onSelectedVariantChange(index: number, variantId: string) {
    this.transferOutViewModel[index].quantity = 0;
    if (variantId) {
      this.transferOutViewModel[index].variantId = variantId;
      this.transferOutViewModel[index].variant = this.transferOutViewModel[index].variants.find(x => x.id === variantId);
      const fromLocation = this.locationForm.get('fromLocation').value;
      this.transferOutService.getTransferOutProductStockOnhand(fromLocation, variantId).subscribe(
        stockOnHand => {
          this.transferOutViewModel[index].stockOnHand = stockOnHand;
        }
      );
    }
  }

  public onQuantityChange(index: number) {
    this.transferOutViewModel[index].quantity = this.transferOutViewModel[index].quantity > 0
      ? this.transferOutViewModel[index].quantity : 0;
  }
  deleteTransferOutItem(index: number) {
    this.transferOutViewModel.splice(index, 1);
  }

  public onSelecteddeliveryDateChange(event) {
  }

  private clearAllocationProduct(index: number) {
    this.transferOutViewModel[index].variants = [];
    this.transferOutViewModel[index].variantId = null;
    this.transferOutViewModel[index].quantity = 0;
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

  public onClickBackButton() {
    this.onclickBackButton.emit(false);
  }

  public onSelectedFromLocation() {
    this.selectedToLocation = null;
    this.transferOutViewModel = [];
  }

  private getLocations() {
    this.isLocationsLoading = true;
    this.locationService.getAllWithoutPaging().subscribe(res => {
      this.locations = res;
      this.isLocationsLoading = false;
    });
  }

  checkValidRequestItems() {
    let result = true;
    this.transferOutViewModel.forEach(item => {
      if (!item.variants || item.quantity === 0) {
        result = false;
      }
    });
    return result;
  }

  checkIsDisableAddItemButton() {
    let result = true;
    if (this.transferOutViewModel.length > 0) {
      result = this.checkValidRequestItems();
    }
    return result;
  }

  private convertDataRequest() {
    const _allocationTransferOutProducts: Array<AllocationTransferOutProductModel> = [];

    this.transferOutViewModel.forEach(element => {
      if (element.quantity > 0) {
        const existProduct = _allocationTransferOutProducts.find(x => x.productId === element.productId &&
          x.variantId === element.variantId);
        if (existProduct !== null && existProduct !== undefined) {
          _allocationTransferOutProducts.find(x => x.productId === element.productId &&
            x.variantId === element.variantId).quantity =
            _allocationTransferOutProducts.find(x => x.productId === element.productId &&
              x.variantId === element.variantId).quantity + element.quantity;
        } else {
          const item: AllocationTransferOutProductModel = {
            stockTransactionRefId: Guid.empty(),
            transactionRefId: Guid.empty(),
            productId: element.productId,
            variantId: element.variantId,
            quantity: element.quantity
          };
          _allocationTransferOutProducts.push(item);
        }
      }
    });

    const fromLocation = this.locationForm.get('fromLocation').value;
    const toLocation = this.locationForm.get('toLocation').value;

    const data: AddTransferOutRequestModel = {
      fromLocationId: fromLocation,
      toLocationId: toLocation,
      allocationTransferOutProducts: _allocationTransferOutProducts
    };

    return data;
  }

  public openVariantModal(index: number, item: TransferOutItemViewModel) {
    if (this.transferOutViewModel[index].productId) {
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

  public onClickSubmitButton() {
    const request = this.convertDataRequest();

    if (request.allocationTransferOutProducts.length <= 0) {
      this.isValidData = false;
    } else {
      request.allocationTransferOutProducts.forEach(item => {
        if (!item.variantId || !item.productId || item.quantity === 0) {
          this.isValidData = false;
        }
      });
    }

    if (this.isValidData) {
      this.transferOutService.add(request).subscribe(res => {
        this.notificationService.success('Add Transfer Out Successful');
        this.onclickSubtmitButton.emit(false);
      });
    } else {
      this.notificationService.error('Please input all required fields!');
      this.isValidData = true;
    }
  }
}
