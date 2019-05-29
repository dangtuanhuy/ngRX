import { Component, Injector, EventEmitter, Output, Input } from '@angular/core';
import { LocationModel, LocationType } from '../../locations/location.model';
import {
  StockTypeModel,
  GIWModel,
  GIWItemModel,
  StockTransaction,
  GenerateBarCodeCommand
} from '../goods-inward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { GoodsInwardService } from 'src/app/shared/services/goods-inward.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorModel } from 'src/app/purchaseorder/vendors/vendor.model';
import { VendorService } from 'src/app/shared/services/vendor.service';
import {
  PimPurchaseOrderListModel,
  PimPurchaseOrderModel,
  PimPurchaseOrderItemViewModel
} from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import * as fromGoodsInward from '../../goods-inwards/state/goods-inward.reducer';
import * as fromAuths from '../../../shared/components/auth/state/index';
import * as goodsInwardActions from '../../goods-inwards/state/goods-inward.action';
import * as goodsInwardSelector from '../../goods-inwards/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { StockTransactionService } from 'src/app/shared/services/stock-transaction.service';

const wareHouseType = LocationType.wareHouse;

@Component({
  selector: 'app-add-goods-inward',
  templateUrl: './add-goods-inward.component.html',
  styleUrls: ['./add-goods-inward.component.scss']
})
export class AddGoodsInwardComponent extends ComponentBase {
  @Input() allowShowMassAllocationBtn = false;
  @Output() onclickBackToListingButton: EventEmitter<any> = new EventEmitter();
  public warehouses: LocationModel[] = [];
  public vendors: VendorModel[] = [];
  public stockTypes: StockTypeModel[] = [];
  public purchaseOrders: PimPurchaseOrderListModel[] = [];
  public purchaseOrdersSelected: PimPurchaseOrderItemViewModel[] = [];
  public stockTransactions: StockTransaction[] = [];
  public selectItems: string[] = [];

  public isWarehousesLoading = true;
  public isVendorsLoading = true;
  public isStockTypesLoading = true;
  public selectedWarehouse = null;
  public selectedVendor = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public actionType = ActionType.dialog;
  public listButton: Button[] = [];
  public isAdd = false;
  componentActive = true;
  isHiddenSearchBox = true;
  isMultiSelect = true;
  public isMassAllocation = false;
  public inventoryTransactionId: string;
  public isDisableGenerateBarCode = false;
  constructor(
    private locationService: LocationService,
    private vendorService: VendorService,
    private stockTransactionService: StockTransactionService,
    private goodsInwardService: GoodsInwardService,
    private notificationService: NotificationService,
    private store: Store<fromGoodsInward.GoodsInwardState>,
    private modalService: NgbModal,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsAllocation`,
            'name,description,vendor',
            environment.app.ims.apiUrl
          );
          this.getLocations();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(goodsInwardSelector.getSelectedItems), takeWhile(() => this.componentActive))
      .subscribe(selectedItems => {
        this.selectItems = selectedItems;
      }));

    this.handleSubscription(this.store.pipe(select(goodsInwardSelector.getPurchaseOrders),
      takeWhile(() => this.componentActive))
      .subscribe((res: PimPurchaseOrderModel[]) => {
        res.forEach(element => {
          element.purchaseOrderItems.forEach(item => {
            const poItem: PimPurchaseOrderItemViewModel = {
              poId: element.id,
              poName: element.name,
              poItemId: item.Id,
              productName: item.productName,
              stockTypeId: item.stockTypeId,
              stockTypeName: item.stockTypeName,
              variant: item.variant,
              barCodes: item.barCodes,
              isDisableBarCode: item.barCodes ? true : false,
              quantity: item.quantity
            };
            this.purchaseOrdersSelected.push(poItem);
          });
        });
        this.buildPurchaseOrderItemsView();
      }));
  }

  onDestroy() { this.store.dispatch(new goodsInwardActions.ResetAllocationState()); }

  private getLocations() {
    this.isWarehousesLoading = true;
    this.isVendorsLoading = true;
    this.locationService.getByType(wareHouseType).subscribe(res => {
      this.warehouses = res;
      this.isWarehousesLoading = false;
    });
    this.vendorService.getAllVendorFromPIM().subscribe(res => {
      this.vendors = res;
      this.isVendorsLoading = false;
    });
  }

  private getPurchaseOrdersByVendor(vendorId: string) {
    this.store.dispatch(new goodsInwardActions.GetPurchaseOrdersByVendor(vendorId));

    this.store.pipe(select(goodsInwardSelector.getPurchaseOrdersViewModel),
      takeWhile(() => this.componentActive))
      .subscribe((purchaseOrders: PimPurchaseOrderListModel[]) => {
        this.purchaseOrders = purchaseOrders;
      });
  }

  public onCheckNumberQuantityChange(index: number) {
    this.purchaseOrdersSelected[index].quantity =
      this.purchaseOrdersSelected[index].quantity > 0
        ? this.purchaseOrdersSelected[index].quantity : 0;
  }

  public selectVendor(e: VendorModel) {
    this.purchaseOrders = [];
    this.isAdd = false;
    this.getPurchaseOrdersByVendor(e.id);
  }

  private buildDataRequest() {
    const stockAllocations: GIWItemModel[] = [];

    if (this.purchaseOrdersSelected.length > 0) {
      this.purchaseOrdersSelected.forEach(item => {
        if (item.quantity && item.quantity > 0) {
          const stockItem: GIWItemModel = {
            purchaseOrderId: item.poId,
            variantId: item.variant.id,
            stockTypeId: item.stockTypeId,
            barCodes: item.barCodes,
            quantity: item.quantity
          };
          stockAllocations.push(stockItem);
        }
      });
    }

    const request: GIWModel = {
      gIWDName: '',
      gIWDDescription: '',
      fromLocationId: this.selectedVendor.id,
      toLocationId: this.selectedWarehouse.id,
      gIWItems: stockAllocations
    };

    return request;
  }

  private clearPage() {
    this.selectItems = [];
    this.purchaseOrders = [];
    this.purchaseOrdersSelected = [];
    this.selectedVendor = null;
    this.selectedWarehouse = null;
    this.isAdd = false;
  }

  private buildPurchaseOrderItemsView() {
    this.stockTransactionService.getByPurchaseOrders(this.selectItems).subscribe(res => {
      if (this.purchaseOrdersSelected.length > 0) {
        this.onAddNewBarCodes();
      }
    });
  }

  public onClickNext() {
    this.isAdd = true;
    this.store.dispatch(new goodsInwardActions.GetPurchaseOrdersByIds(this.selectItems));
  }

  public onClickSave() {
    const request = this.buildDataRequest();
    this.goodsInwardService.add(request).subscribe(res => {
      this.notificationService.success('Successful');
      if (this.allowShowMassAllocationBtn) {
        this.isMassAllocation = true;
        this.inventoryTransactionId = res;
      } else {
        this.onClickBackToListingButton();
      }
    });
  }

  public onClickBack() {
    this.clearPage();
  }

  public onClickBackToListingButton() {
    this.onclickBackToListingButton.emit(false);
  }

  public onAddNewBarCodes () {
    let checkDisableBtn = false;
    this.purchaseOrdersSelected.forEach(item => {
      if (item.barCodes.length === 0) {
        checkDisableBtn = false;
      } else {
        checkDisableBtn = true;
      }
    });
    this.isDisableGenerateBarCode = checkDisableBtn;
  }

  public onClickGenerateBarCode() {
    const variantIds: string[] = [];
    this.purchaseOrdersSelected.forEach(item => {
      variantIds.push(item.variant.id);
    });
    const request: GenerateBarCodeCommand = {
      variantIds: variantIds
    };

    this.goodsInwardService.generateBarCode(request).subscribe(res => {
      this.purchaseOrdersSelected.forEach(po => {
        const barCodes = res.filter(x => x.variantId === po.variant.id);
        barCodes.forEach(item => {
          if (!po.barCodes.includes(item.code)) {
            po.barCodes = [...po.barCodes, item.code];
          }
        });
      });
      this.onAddNewBarCodes();
    });
  }

  public onMassAllocation(event) {
    this.isMassAllocation = event;
    this.clearPage();
  }
}
