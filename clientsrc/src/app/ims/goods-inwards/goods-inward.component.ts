import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as goodsInwardActions from './state/goods-inward.action';
import * as goodsInwardSelector from '../goods-inwards/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { LocationService } from 'src/app/shared/services/location.service';
import * as moment from 'moment';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { InventoryTransactionGoodsInwardViewModel, GIWStatus, FilterRequestModel } from './goods-inward.model';
import { DetailGoodsInwardComponent } from './detail-goods-inward/detail-goods-inward.component';
import { InventoryTransactionStatusEnum } from 'src/app/shared/constant/inventory-transaction.constant';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { LocationType } from '../locations/location.model';

const wareHouseType = LocationType.wareHouse;

@Component({
  selector: 'app-goods-inwards',
  templateUrl: './goods-inward.component.html',
  styleUrls: ['./goods-inward.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GoodsInwardsComponent extends ComponentBase {
  constructor(
    private store: Store<any>,
    private locationService: LocationService,
    private vendorService: VendorService,
    public injector: Injector) {
    super(injector);
  }

  public pageSize = 10;
  public addSuccessMessage = '';
  public updateSuccessMessage = '';
  public deleteSuccessMessage = '';

  public componentActive = true;
  public datasource: Array<InventoryTransactionGoodsInwardViewModel> = [];
  public listButton: Button[] = [];
  public title = '';
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userInventoryTransactionDefinedColumnSetting: UserDefinedColumnSetting;
  public isHiddenSearchBox = false;
  public isShowGoodsInwardListing = false;
  public isShowAddGoodsInward = false;
  public queryText = '';

  public isMassAllocation = false;
  public inventoryTransactionId: string;
  public fromLocationId: string;
  public disableBtn = true;
  public statusPlaceholder = 'Select Status';
  public fromLocationPlaceholder = 'Select From Location';
  public toLocationPlaceholder = 'Select To Location';
  public fromLocationDropdownList = [];
  public toLocationDropdownList = [];
  public statusDropdownList = [];
  public fromLocationSelected = [];
  public toLocationSelected = [];
  public statusSelected = [];
  public isOnClickMassAllocation = false;
  public allowShowMassAllocationBtn = false;

  public userRole: string;
  public roleMass = ['Administrator', 'InventoryManager'];
  onInit() {
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userInventoryTransactionDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsGoodsInward`,
            'id,goodsInwardNumber,status',
            environment.app.ims.apiUrl
          );
          this.getVendors();
          this.getWareHouse();
          this.datasource = [];
          this.getDefaultInventoryTransaction();
        }
      ));
    this.handleSubscription(this.store.pipe(
            select(fromAuths.getUserRole), takeWhile(() => this.componentActive))
            .subscribe((role: string) => {
              if (role == null ) {
                return;
              }
              this.userRole = role;
              this.setButtonsConfiguration();
            }));
    this.handleSubscription(this.store.pipe(
      select(goodsInwardSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (id) {
            this.inventoryTransactionId = id;
            this.disableBtn = false;
            this.changeListButton(false);
          } else {
            this.changeListButton(true);
          }
        }
      ));
  }

  onDestroy() {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
  }

  private getVendors() {
    this.vendorService.getAllVendorFromPIM().subscribe(vendors => {
      const locations = [];
      vendors.map(vendor => {
        locations.push({
          id: vendor.id, itemName: vendor.name
        });
      });
      this.fromLocationDropdownList = locations;
    });
  }

  private getWareHouse() {
    this.locationService.getByType(wareHouseType).subscribe(wareHouses => {
      const locations = [];
      wareHouses.map(wareHouse => {
        locations.push({
          id: wareHouse.id, itemName: wareHouse.name
        });
      });
      this.toLocationDropdownList = locations;
    });
  }

  public getDefaultInventoryTransaction() {
    this.datasource = [];
    const page = 1;
    this.getInventoryTransactions(page, this.getGoodsInwardRequestModel());
  }

  changeSelectedPage(page: number) {
    this.datasource = [];
    const nextPage = page + 1;
    this.getInventoryTransactions(nextPage, this.getGoodsInwardRequestModel());
  }

  getInventoryTransactions(page: number, goodsInwardRequestModel: FilterRequestModel) {
    this.store.dispatch(new goodsInwardActions.GetGoodsInwards(new PagingFilterCriteria(page, this.pageSize), goodsInwardRequestModel));
    this.store.pipe(select(goodsInwardSelector.GetGoodsInwards), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionGoodInWards: Array<InventoryTransactionGoodsInwardViewModel>) => {
        inventoryTransactionGoodInWards = inventoryTransactionGoodInWards.sort(
          function (a, b) { return (a.createdDate < b.createdDate) ? 1 : ((b.createdDate < a.createdDate) ? -1 : 0); }
        );
        this.datasource = inventoryTransactionGoodInWards.map(item => {
          const inventoryTransactionGoodInWard = new InventoryTransactionGoodsInwardViewModel(item);
          inventoryTransactionGoodInWard.status = this.getGIWStatus(item.status);
          return inventoryTransactionGoodInWard;
        });
      });
    this.getAllStatusGoodsInward();
  }

  onClickGoodsInwardButton() {
    this.isShowAddGoodsInward = true;
  }

  onclickBackToListingButton(event) {
    this.getDefaultInventoryTransaction();
    this.isShowAddGoodsInward = event;
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 1,
        title: 'Add Goods Inward',
        action: ActionType.onScreen,
        onClick: () => this.onClickGoodsInwardButton()
      }),
      new Button({
        id: 0,
        title: 'Detail',
        component: DetailGoodsInwardComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
    this.roleMass.forEach(role => { if (this.userRole.includes(role)) {
                                          this.allowShowMassAllocationBtn = true;
                                        }});
    if (this.allowShowMassAllocationBtn) {
      this.listButton.push(new Button({
                                      id: 2,
                                      title: 'Mass Allocation',
                                      action: ActionType.onScreen,
                                      onClick: () => this.onClickMassAllocation(),
                                      disable: this.disableBtn
                                      }));
    }
  }

  handleOnClick(event: any) {
    event.onClick();
  }

  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Detail') {
        btn.disable = isDisabled;
      }
      if (btn.id === 2) {
        btn.disable = this.disableBtn;
      }
    });
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getInventoryTransactions(1, this.getGoodsInwardRequestModel());
  }

  onClickMassAllocation() {
    this.isOnClickMassAllocation = true;
    this.store.dispatch(new goodsInwardActions.GetGoodsInward(this.inventoryTransactionId));
    this.store.pipe(select(goodsInwardSelector.GetGoodsInward), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionGoodsInward: InventoryTransactionGoodsInwardViewModel) => {
        if (inventoryTransactionGoodsInward != null && this.isOnClickMassAllocation === true) {
          this.isMassAllocation = true;
          this.fromLocationId = inventoryTransactionGoodsInward.toLocationId;
        }
      });
  }

  onMassAllocation(event) {
    this.isMassAllocation = event;
    this.isOnClickMassAllocation = event;
    this.disableBtn = true;
  }

  displaydropDownListStatus(dropDownListStatus) {
    this.statusSelected = dropDownListStatus;
    this.getInventoryTransactions(1, this.getGoodsInwardRequestModel());
  }

  displaydropDownListToLocation(toLocationDropdownList) {
    this.toLocationSelected = toLocationDropdownList;
    this.getInventoryTransactions(1, this.getGoodsInwardRequestModel());
  }

  displaydropDownListFromLocation(fromLocationDropdownList) {
    this.fromLocationSelected = fromLocationDropdownList;
    this.getInventoryTransactions(1, this.getGoodsInwardRequestModel());
  }

  getGIWStatus(status: any) {
    return Object.values(GIWStatus).includes(+status)
      ? Object.keys(GIWStatus).find(function (item, key) { return key === (+status - 1); })
      : (status === 0 ? 'StockInitial' : status);
  }

  private getAllStatusGoodsInward() {
    this.statusDropdownList = [
      { id: InventoryTransactionStatusEnum.Pending, itemName: this.getGIWStatus(InventoryTransactionStatusEnum.Pending) },
      { id: InventoryTransactionStatusEnum.Partial, itemName: this.getGIWStatus(InventoryTransactionStatusEnum.Partial) },
      { id: InventoryTransactionStatusEnum.Allocated, itemName: this.getGIWStatus(InventoryTransactionStatusEnum.Allocated) }
    ];
  }

  getGoodsInwardRequestModel() {
    const fromLocationIdList = [];
    this.fromLocationSelected.map(item => {
      fromLocationIdList.push(item.id);
    });

    const toLocationIdList = [];
    this.toLocationSelected.map(item => {
      toLocationIdList.push(item.id);
    });

    const statusIdList = [];
    this.statusSelected.map(item => {
      statusIdList.push(item.itemName);
    });
    const goodsInwardRequestModel: FilterRequestModel = {
      fromLocationIds: fromLocationIdList,
      toLocationIds: toLocationIdList,
      statusIds: statusIdList,
      queryString: this.queryText
    };
    return goodsInwardRequestModel;
  }
}
