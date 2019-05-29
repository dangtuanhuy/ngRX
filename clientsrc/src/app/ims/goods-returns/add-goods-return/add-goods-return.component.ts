import { Component, Injector, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import * as fromGoodsReturn from '../../goods-returns/state/goods-return.reducer';
import * as fromAuths from '../../../shared/components/auth/state/index';
import * as goodsReturnActions from '../../goods-returns/state/goods-return.action';
import * as goodsReturnSelector from '../../goods-returns/state/index';
import { LocationService } from 'src/app/shared/services/location.service';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { Store, select } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationType, LocationModel } from '../../locations/location.model';
import { VendorModel } from 'src/app/purchaseorder/vendors/vendor.model';
import { takeWhile } from 'rxjs/operators';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { environment } from 'src/environments/environment';

import { ReturnOrderListModel, ReturnOrderItemViewModel, ReturnOrderModel, GRTItemModel, GRTModel } from '../goods-return.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { StockTransaction } from '../../goods-inwards/goods-inward.model';
import { StockTransactionService } from 'src/app/shared/services/stock-transaction.service';
import { GoodsReturnService } from 'src/app/shared/services/goods-return.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-add-goods-return',
  templateUrl: './add-goods-return.component.html',
  styleUrls: ['./add-goods-return.component.scss']
})
export class AddGoodsReturnComponent extends ComponentBase {
  @Output() onclickBackToListingButton: EventEmitter<any> = new EventEmitter();
  public warehouses: LocationModel[] = [];
  public vendors: VendorModel[] = [];
  public returnOrders: ReturnOrderListModel[] = [];
  public returnOrdersSelected: ReturnOrderItemViewModel[] = [];
  public stockTransactions: StockTransaction[] = [];
  public selectItems: string[] = [];

  public isWarehousesLoading = true;
  public isVendorsLoading = true;
  public isProductsLoading = true;
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
  constructor(
    private locationService: LocationService,
    private stockTransactionService: StockTransactionService,
    private goodsReturnService: GoodsReturnService,
    private notificationService: NotificationService,
    private vendorService: VendorService,
    private store: Store<fromGoodsReturn.GoodsReturnState>,
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
            `${id}_UserDefinedColumnsAddGoodsReturn`,
            'name,description,vendor',
            environment.app.ims.apiUrl
          );
          this.getLocations();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(goodsReturnSelector.getSelectedItems), takeWhile(() => this.componentActive))
      .subscribe(selectedItems => {
        this.selectItems = selectedItems;
      }));

    this.handleSubscription(this.store.pipe(select(goodsReturnSelector.getReturnOrders),
      takeWhile(() => this.componentActive))
      .subscribe((res: ReturnOrderModel[]) => {
        res.forEach(element => {
          element.items.forEach(item => {
            const roItem: ReturnOrderItemViewModel = {
              roId: element.id,
              roName: element.name,
              roItemId: item.Id,
              productName: item.productName,
              stockTypeId: item.stockTypeId,
              stockTypeName: item.stockTypeName,
              variant: item.variant,
              quantity: item.quantity
            };
            this.returnOrdersSelected.push(roItem);
          });
        });
        this.buildReturnOrderItemsView();
      }));
  }

  onDestroy() {
    this.store.dispatch(new goodsReturnActions.ResetState());
  }

  private getLocations() {
    this.isWarehousesLoading = true;
    this.isVendorsLoading = true;
    this.locationService.getByType(LocationType.wareHouse).subscribe(res => {
      this.warehouses = res;
      this.isWarehousesLoading = false;
    });
    this.vendorService.getAllVendorFromPIM().subscribe(res => {
      this.vendors = res;
      this.isVendorsLoading = false;
    });
  }

  public selectVendor(e: VendorModel) {
    this.returnOrders = [];
    this.isAdd = false;
    this.getReturnOrdersByVendor(e.id);
  }

  private getReturnOrdersByVendor(vendorId: string) {
    this.store.dispatch(new goodsReturnActions.GetReturnOrdersByVendor(vendorId));

    this.store.pipe(select(goodsReturnSelector.getReturnOrdersByVendor),
      takeWhile(() => this.componentActive))
      .subscribe((returnOrders: ReturnOrderListModel[]) => {
        this.returnOrders = returnOrders;
      });
  }

  public onCheckNumberQuantityChange(index: number) {
    this.returnOrdersSelected[index].quantity =
      this.returnOrdersSelected[index].quantity > 0
        ? this.returnOrdersSelected[index].quantity : 0;
  }

  private buildReturnOrderItemsView() {
    this.stockTransactionService.getByReturnOrders(this.selectItems).subscribe(res => {
      if (this.returnOrdersSelected.length > 0) {
      }
    });
  }

  private clearPage() {
    this.selectItems = [];
    this.returnOrders = [];
    this.returnOrdersSelected = [];
    this.selectedVendor = null;
    this.selectedWarehouse = null;
    this.isAdd = false;
  }

  public onClickNext() {
    this.isAdd = true;
    this.store.dispatch(new goodsReturnActions.GetReturnOrdersByIds(this.selectItems));
  }

  public onClickBack() {
    this.clearPage();
  }

  private buildDataRequest() {
    const stockAllocations: GRTItemModel[] = [];

    if (this.returnOrdersSelected.length > 0) {
      this.returnOrdersSelected.forEach(item => {
        if (item.quantity && item.quantity > 0) {
          const stockItem: GRTItemModel = {
            returnOrderId: item.roId,
            variantId: item.variant.id,
            stockTypeId: item.stockTypeId,
            quantity: item.quantity
          };
          stockAllocations.push(stockItem);
        }
      });
    }

    const request: GRTModel = {
      name: '',
      description: '',
      fromLocationId: this.selectedWarehouse.id,
      toLocationId: this.selectedVendor.id,
      items: stockAllocations
    };

    return request;
  }

  public onClickSave() {
    const request = this.buildDataRequest();
    this.goodsReturnService.add(request).subscribe(res => {
      this.notificationService.success('Successful');
      this.clearPage();
    });
  }

  public onClickBackToListingButton() {
    this.onclickBackToListingButton.emit(false);
  }

}
