import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as transferOutActions from '../transfer-out/state/transfer-out.action';
import * as transferOutSelector from '../transfer-out/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { LocationService } from 'src/app/shared/services/location.service';
import * as moment from 'moment';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { InventoryTransactionTransferOutViewModel } from './transfer-out.model';
import { DetailTransferOutComponent } from './detail-transfer-out/detail-transfer-out.component';
import { LocationType } from '../locations/location.model';
import { FilterRequestModel } from '../goods-inwards/goods-inward.model';

const wareHouseType = LocationType.wareHouse;
const storeType = LocationType.store;
@Component({
  selector: 'app-transfer-out',
  templateUrl: './transfer-out.component.html',
  styleUrls: ['./transfer-out.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferOutComponent extends ComponentBase {
  constructor(
    private store: Store<any>,
    private locationService: LocationService,
    public injector: Injector) {
    super(injector);
  }

  public pageSize = 10;
  public addSuccessMessage = '';
  public updateSuccessMessage = '';
  public deleteSuccessMessage = '';

  public componentActive = true;
  public datasource: Array<InventoryTransactionTransferOutViewModel> = [];
  public listButton: Button[] = [];
  public title = '';
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userInventoryTransactionDefinedColumnSetting: UserDefinedColumnSetting;
  public isHiddenSearchBox = false;
  public isShowTransferOut = false;
  public isShowManualTransferOut = false;
  public isAddTransferOut = false;
  public queryText = '';
  public fromLocationPlaceholder = 'Select From Location';
  public fromLocationDropdownList = [];
  public fromLocationSelected = [];
  public toLocationPlaceholder = 'Select To Location';
  public toLocationDropdownList = [];
  public toLocationSelected = [];

  onInit() {
    this.title = '';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userInventoryTransactionDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsTransferOut`,
            'id,transferNumber',
            environment.app.ims.apiUrl
          );
          this.getLocations();
          this.setButtonsConfiguration();
          this.datasource = [];
          this.getDefaultInventoryTransaction();
        }
      ));
      this.handleSubscription(this.store.pipe(
        select(transferOutSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  public getDefaultInventoryTransaction() {
    this.datasource = [];
    const page = 1;
    this.getInventoryTransactions(page, this.getTransferFilterRequestModel());
  }

  changeSelectedPage(page: number) {
    this.datasource = [];
    const nextPage = page + 1;
    this.getInventoryTransactions(nextPage, this.getTransferFilterRequestModel());
  }


  getInventoryTransactions (page: number, transferRequestModel: FilterRequestModel) {
    this.store.dispatch(new transferOutActions.GetTransferOuts(new PagingFilterCriteria(page, this.pageSize), transferRequestModel));
    this.store.pipe(select(transferOutSelector.GetTransferOuts), takeWhile(() => this.componentActive))
    .subscribe((inventoryTransactionTransferOuts: Array<InventoryTransactionTransferOutViewModel>) => {
      this.datasource =  inventoryTransactionTransferOuts.map(item => {
        const inventoryTransactionTransferOut = new InventoryTransactionTransferOutViewModel(item);
        return inventoryTransactionTransferOut;
      });
    });
  }

  onClickTransferOutButton () {
    this.isShowTransferOut = true;
  }

  onClickManualTransferOutButton () {
    this.isShowManualTransferOut = true;
  }

  onclickBackToListingButton (event) {
    this.getDefaultInventoryTransaction();
    this.isShowTransferOut = event;
  }

  onclickBackButton (event) {
    this.getDefaultInventoryTransaction();
    this.isShowManualTransferOut = event;
  }

  onclickSubtmitButton (event) {
    this.isShowManualTransferOut = event;
    this.getDefaultInventoryTransaction();
  }

  checkShowTransfer() {
    if (this.isShowTransferOut || this.isShowManualTransferOut) {
      return true;
    }
    return false;
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 2,
        title: 'Manual Transfer Out',                
        disable: false,
        onClick: () => this.onClickManualTransferOutButton(),
        action: ActionType.onScreen
      }),
      new Button({
        id: 1,
        title: 'Transfer Out By Allocation',
        disable: false,
        onClick: () => this.onClickTransferOutButton(),
        action: ActionType.onScreen
      }),
      new Button({
        id: 0,
        title: 'Detail',
        component: DetailTransferOutComponent,
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

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getInventoryTransactions(1, this.getTransferFilterRequestModel());
  }

  private getLocations() {
    this.locationService.getAllWithoutPaging().subscribe(res => {
      const locations = [];
      res.map(wareHouse => {
        locations.push({
          id: wareHouse.id, itemName: wareHouse.name
        });
      });
      this.fromLocationDropdownList = locations;
      this.toLocationDropdownList = locations;
    });
  }

  displaydropDownListToLocation(toLocationDropdownList) {
    this.toLocationSelected = toLocationDropdownList;
    this.getInventoryTransactions(1, this.getTransferFilterRequestModel());
  }

  displaydropDownListFromLocation(fromLocationDropdownList) {
    this.fromLocationSelected = fromLocationDropdownList;
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
