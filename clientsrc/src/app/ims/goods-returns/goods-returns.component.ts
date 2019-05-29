import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import { InventoryTransactionGoodsReturnViewModel, InventoryTransactionGoodsReturnListViewModel } from './goods-return.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import * as goodsReturnActions from './state/goods-return.action';
import * as goodsReturnSelector from '../goods-returns/state/index';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { takeWhile } from 'rxjs/operators';
import * as moment from 'moment';
import * as fromAuths from '../../shared/components/auth/state/index';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { environment } from 'src/environments/environment';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { DetailGoodsReturnComponent } from './detail-goods-return/detail-goods-return.component';
import { FilterRequestModel } from '../goods-inwards/goods-inward.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { LocationType } from '../locations/location.model';
import { VendorService } from 'src/app/shared/services/vendor.service';

const wareHouseType = LocationType.wareHouse;
@Component({
  selector: 'app-goods-returns',
  templateUrl: './goods-returns.component.html',
  styleUrls: ['./goods-returns.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GoodsReturnsComponent extends ComponentBase {
  public pageSize = 10;
  public componentActive = true;
  public datasource: Array<InventoryTransactionGoodsReturnListViewModel> = [];
  public listButton: Button[] = [];
  public title = '';
  public actionType = ActionType.dialog;
  public isShowAddGoodsReturn = false;
  public isHiddenSearchBox = false;
  public queryText = '';
  public userInventoryTransactionDefinedColumnSetting: UserDefinedColumnSetting;
  public fromLocationPlaceholder = 'Select From Location';
  public fromLocationDropdownList = [];
  public fromLocationSelected = [];
  public toLocationPlaceholder = 'Select To Location';
  public toLocationDropdownList = [];
  public toLocationSelected = [];
  constructor(
    private store: Store<any>,
    private locationService: LocationService,
    private vendorService: VendorService,
    public injector: Injector) {
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
          this.userInventoryTransactionDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsGoodsReturn`,
            'id,transferNumber',
            environment.app.ims.apiUrl
          );
          this.setButtonsConfiguration();
          this.datasource = [];
          this.getDefaultInventoryTransaction();
        }
      ));
    this.handleSubscription(this.store.pipe(
      select(goodsReturnSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (id) {
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

  changeSelectedPage(page: number) {
    this.datasource = [];
    const nextPage = page + 1;
    this.getInventoryTransactions(nextPage, this.getTransferFilterRequestModel());
  }

  displaydropDownListToLocation(toLocationDropdownList) {
    this.toLocationSelected = toLocationDropdownList;
    this.getInventoryTransactions(1, this.getTransferFilterRequestModel());
  }

  displaydropDownListFromLocation(fromLocationDropdownList) {
    this.fromLocationSelected = fromLocationDropdownList;
    this.getInventoryTransactions(1, this.getTransferFilterRequestModel());
  }

  getInventoryTransactions(page: number, goodsReturnRequestModel: FilterRequestModel) {
    this.store.dispatch(new goodsReturnActions.GetGoodsReturns(new PagingFilterCriteria(page, this.pageSize), goodsReturnRequestModel));
    this.store.pipe(select(goodsReturnSelector.getGoodsReturns), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionsViewModel: Array<InventoryTransactionGoodsReturnViewModel>) => {
        this.datasource = inventoryTransactionsViewModel.map(item => {
          const inventoryTransactions = new InventoryTransactionGoodsReturnListViewModel(item);
          return inventoryTransactions;
        });
      });
      this.getLocations();
  }

  private getLocations() {
    this.vendorService.getAllVendorFromPIM().subscribe(vendors => {
      const locations = [];
      vendors.map(vendor => {
        locations.push({
          id: vendor.id, itemName: vendor.name
        });
      });
      this.toLocationDropdownList = locations;
    });
    this.locationService.getByType(wareHouseType).subscribe(wareHouses => {
      const locations = [];
      wareHouses.map(wareHouse => {
        locations.push({
          id: wareHouse.id, itemName: wareHouse.name
        });
      });
      this.fromLocationDropdownList = locations;
    });
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 1,
        title: 'Add Goods Return',
        action: ActionType.onScreen,
        onClick: () => this.onClickGoodsReturnButton(),
        disable: false
      }),
      new Button({
        id: 0,
        title: 'Detail',
        component: DetailGoodsReturnComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
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
    });
  }

  public getDefaultInventoryTransaction() {
    this.datasource = [];
    const page = 1;
    this.getInventoryTransactions(page, this.getTransferFilterRequestModel());
  }

  onclickBackToListingButton(event) {
    this.getDefaultInventoryTransaction();
    this.isShowAddGoodsReturn = event;
  }

  onClickGoodsReturnButton() {
    this.isShowAddGoodsReturn = true;
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getInventoryTransactions(1, this.getTransferFilterRequestModel());
  }

  getTransferFilterRequestModel () {

    const fromLocationIdList = [];
    this.fromLocationSelected.map( item => {
      fromLocationIdList.push(item.id);
    });

    const toLocationIdList = [];
    this.toLocationSelected.map( item => {
      toLocationIdList.push(item.id);
    });

    const filterRequestModel: FilterRequestModel = {
      fromLocationIds: fromLocationIdList,
      toLocationIds: toLocationIdList,
      statusIds: [],
      queryString: this.queryText
    };
    return filterRequestModel;
  }
}
