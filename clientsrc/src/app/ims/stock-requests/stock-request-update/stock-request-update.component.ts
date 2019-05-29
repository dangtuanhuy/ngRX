import { Component, Injector } from '@angular/core';
import * as fromStockRequest from '../state/stock-request.reducer';
import * as stockRequestActions from '../state/stock-request.action';
import * as stockRequestSelector from '../state/index';
import { LocationModel, LocationType } from '../../locations/location.model';
import {
  StockRequestModel,
  StockRequestItemViewModel,
  StockRequestItemModel,
  VariantField,
  StockRequestModelAddRequest,
  StockRequestItemModelRequest,
  StockRequestModelUpdateRequest
} from '../stock-request.model';
import { ProductListModel, ProductModel, VariantModel } from '../../products/product';
import { NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { StockRequestStatus } from 'src/app/shared/constant/stock-request-status';
import { ProductService } from 'src/app/shared/services/product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LocationService } from 'src/app/shared/services/location.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { VariantFieldSelectComponent } from 'src/app/shared/components/variant-field-select/variant-field-select.component';
import { Guid } from 'src/app/shared/utils/guid.util';

@Component({
  selector: 'app-stock-request-update',
  templateUrl: './stock-request-update.component.html',
  styleUrls: ['./stock-request-update.component.scss']
})
export class StockRequestUpdateComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  public fromLocations: Array<LocationModel> = [];
  public locations: Array<LocationModel> = [];
  public isLocationsLoading = true;
  public stockRequestItems: Array<StockRequestItemViewModel> = [];
  public stockRequestId: string;
  public componentActive = true;
  public searchText = new Subject<string>();
  public statuses = [
    {
      id: StockRequestStatus.Opened,
      name: 'Opened'
    },
    {
      id: StockRequestStatus.Submitted,
      name: 'Submitted'
    },
    {
      id: StockRequestStatus.Approved,
      name: 'Approved'
    },
    {
      id: StockRequestStatus.Rejected,
      name: 'Rejected'
    },
    {
      id: StockRequestStatus.Canceled,
      name: 'Canceled'
    },
    {
      id: StockRequestStatus.Closed,
      name: 'Closed'
    },
    {
      id: StockRequestStatus.PartialAllocated,
      name: 'Partial Allocated'
    },
    {
      id: StockRequestStatus.Allocated,
      name: 'Allocated'
    }
  ];
  public products: ProductListModel[] = [];
  constructor(private activeModal: NgbActiveModal,
    private store: Store<fromStockRequest.StockRequestState>,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private locationService: LocationService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    public injector: Injector) {
    super(injector);
    this.productService.getProductsByQueryText(this.searchText).subscribe(result => {
      this.products = result;
    });
  }

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      subject: ['', Validators.required],
      warehouse: [null, Validators.required],
      store: [null, Validators.required],
      description: [''],
      date: [null, Validators.required],
      status: ['']
    });
    this.getLocations();
    this.handleSubscription(this.store.pipe(
      select(stockRequestSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new stockRequestActions.GetStockRequest(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(stockRequestSelector.getStockRequest), takeWhile(() => this.componentActive))
      .subscribe(
        (stockRequest: StockRequestModel) => {
          if (stockRequest == null) {
            return;
          }
          const dateRequest = new Date(moment.utc(stockRequest.dateRequest).local().toDate());
          this.stockRequestId = stockRequest.id;
          this.updateValueForm.patchValue({
            subject: stockRequest.subject,
            warehouse: stockRequest.fromLocationId,
            store: stockRequest.toLocationId,
            description: stockRequest.description,
            date: new NgbDate(dateRequest.getFullYear(), dateRequest.getMonth() + 1, dateRequest.getDate()),
            status: this.statuses.find(x => x.id === stockRequest.stockRequestStatus).name
          });
          if (stockRequest.stockRequestItems.length > 0) {
            this.getStockRequestItem(stockRequest.stockRequestItems);
          }

        }));
  }

  onDestroy() {
    this.store.dispatch(new stockRequestActions.CancelUpdateSuccess());
  }

  getStockRequestItem(items: StockRequestItemModel[]) {
    this.stockRequestItems = [];
    items.forEach(item => {
      this.productService.getById(item.productId).subscribe(product => {
        const productViewModel: ProductListModel = {
          id: product.id,
          name: product.name,
          variant: null
        };
        this.products.push(productViewModel);
        const stockRequestItem: StockRequestItemViewModel = {
          id: item.id,
          product: productViewModel,
          variant: product.variants.find(x => x.id === item.variant.id),
          isVariantsLoading: false,
          quantity: item.quantity,
          variants: product.variants
        };
        this.stockRequestItems.push(stockRequestItem);
      });
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
    this.stockRequestItems.push(stockRequestItem);
  }

  onSave() {
    const request = this.generatedRequest();
    if (this.checkIsValidToSave(request)) {
      this.store.dispatch(new stockRequestActions.EditStockRequest(request));
    } else {
      this.notificationService.error('Something went wrong. Please try again!');
    }
  }

  checkIsValidToSave(request: StockRequestModelAddRequest) {
    let result = true;
    if (!request.stockRequestItems
      || request.stockRequestItems.length <= 0) {
      result = false;
    }
    request.stockRequestItems.forEach(x => {
      if (!x.variant || x.quantity === 0) {
        result = false;
      }
    });
    return result;
  }

  checkValidRequestItems() {
    let result = true;
    this.stockRequestItems.forEach(item => {
      if (!item.variant || item.quantity === 0) {
        result = false;
      }
    });
    return result;
  }

  checkIsDisableAddItemButton() {
    let result = true;
    if (this.stockRequestItems.length > 0) {
      result = this.checkValidRequestItems();
    }
    return result;
  }


  generatedRequest() {
    const stockRequestItems: StockRequestItemModelRequest[] = [];
    this.stockRequestItems.forEach(x => {
      const item: StockRequestItemModelRequest = {
        variant: x.variant,
        quantity: x.quantity
      };
      stockRequestItems.push(item);
    });
    const date = this.updateValueForm.get('date').value;
    const request: StockRequestModelUpdateRequest = {
      id: this.stockRequestId,
      subject: this.updateValueForm.get('subject').value,
      fromLocationId: this.updateValueForm.get('warehouse').value,
      toLocationId: this.updateValueForm.get('store').value,
      description: this.updateValueForm.get('description').value,
      stockRequestItems: stockRequestItems,
      dateRequest: new Date(date.year, date.month - 1, date.day, 23, 59, 59),
      IsDeleteRequest: false
    };
    return request;
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  getLocations() {
    this.isLocationsLoading = true;
    const storeType = LocationType.store;
    this.store.dispatch(new stockRequestActions.GetLocationsByType(storeType));
    this.store.pipe(select(stockRequestSelector.getLocations))
      .subscribe((locations: LocationModel[]) => {
        this.locations = locations;
        this.isLocationsLoading = false;
      });
    this.locationService.getByType(LocationType.wareHouse)
      .subscribe((locations: LocationModel[]) =>
        this.fromLocations = locations
      );
  }

  onSelectedProductChange(index: number) {
    const productId = this.stockRequestItems[index].product.id;
    this.stockRequestItems[index].variant = null;
    this.stockRequestItems[index].variants = [];
    if (productId) {
      this.stockRequestItems[index].isVariantsLoading = true;
      this.store.dispatch(new stockRequestActions.GetProductById(productId));
      this.store.pipe(select(stockRequestSelector.getProduct))
        .subscribe((product: ProductModel) => {
          const variants = this.convertVariants(product.variants);
          this.stockRequestItems[index].variants = variants;
          this.stockRequestItems[index].isVariantsLoading = false;
        });
    }
  }

  public onCheckNumberQuantityChange(index: number) {
    if (this.stockRequestItems[index].quantity < 0) {
      this.stockRequestItems[index].quantity = 0;
    }
  }

  removeItem(index: number) {
    this.stockRequestItems.splice(index, 1);
  }

  addItem() {
    const item: StockRequestItemViewModel = {
      id: null,
      product: null,
      variants: [],
      quantity: 0,
      isVariantsLoading: false,
      variant: null
    };
    this.stockRequestItems.push(item);
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
      name += `${item.name}: `;
      item.value.forEach(element => {
        name += `${element}, `;
      });
      name += `; `;
    });

    return name;
  }

  openVariantModal(index: number, item: StockRequestItemViewModel) {
    if (this.stockRequestItems[index].product.id) {
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
      this.stockRequestItems[index].variant
        = this.stockRequestItems[index].variants.find(x => x.id === variantId);
      this.stockRequestItems[index].variant.id = variantId;
    }
  }

  removeExistedItem(index: number, item: StockRequestItemViewModel) {
    this.stockRequestItems.forEach(x => {
      if (x.variant.id === item.variant.id
        && this.stockRequestItems.indexOf(x) !== index) {
        this.removeItem(index);
        this.notificationService.warning('Auto remove existed item!');
      }
    });
  }
}
