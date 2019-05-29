import { Component, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromTransferIn from '../transfer-in/state/transfer-in.reducer';
import * as transferInActions from '../transfer-in/state/transfer-in.action';
import * as transferInSelector from '../transfer-in/state/index';
import { Store, select } from '@ngrx/store';
import { LocationService } from 'src/app/shared/services/location.service';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { LocationModel, LocationType } from '../locations/location.model';
import { InventoryTransactionTransferInViewModel, TransferInRequestModel } from './transfer-in.model';
import { takeWhile } from 'rxjs/operators';
import * as fromAuths from '../../shared/components/auth/state/index';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { Button } from 'src/app/shared/base-model/button.model';
import { DetailTransferInComponent } from './detail-transfer-in/detail-transfer-in.component';
import { FilterRequestModel } from '../goods-inwards/goods-inward.model';
import { Action } from 'rxjs/internal/scheduler/Action';

const wareHouseType = LocationType.wareHouse;
const storeType = LocationType.store;
@Component({
  selector: 'app-transfer-in',
  templateUrl: './transfer-in.component.html',
  styleUrls: ['./transfer-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferInComponent extends ComponentBase {
  searchByLocationForm: FormGroup = new FormGroup({});
  constructor(
    private store: Store<any>,
    private locationService: LocationService,
    private formBuilder: FormBuilder,
    public injector: Injector) {
    super(injector);
  }

  public pageSize = 10;
  public addSuccessMessage = '';
  public updateSuccessMessage = '';
  public deleteSuccessMessage = '';

  public componentActive = true;
  public datasource: Array<InventoryTransactionTransferInViewModel> = [];
  public listButton: Button[] = [];
  public title = '';
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userInventoryTransactionTransferInDefinedColumnSetting: UserDefinedColumnSetting;
  public isHiddenSearchBox = false;
  public isShowTransferIn = false;
  public isAddTransferIn = false;
  public fromLocationPlaceholder = 'Select From Location';
  public fromLocationDropdownList = [];
  public fromLocationSelected = [];
  public toLocationPlaceholder = 'Select To Location';
  public toLocationDropdownList = [];
  public toLocationSelected = [];


  public queryText = '';

  onInit() {
    this.title = '';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userInventoryTransactionTransferInDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsTransferIn`,
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
      select(transferInSelector.getSelectedItem), takeWhile(() => this.componentActive))
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


  getInventoryTransactions(page: number, transferRequestModel: FilterRequestModel) {
    this.store.dispatch(new transferInActions.GetTransferIns(new PagingFilterCriteria(page, this.pageSize), transferRequestModel));
    this.store.pipe(select(transferInSelector.getInventoryTransactionTransferIns), takeWhile(() => this.componentActive))
      .subscribe((inventoryTransactionTransferIns: Array<InventoryTransactionTransferInViewModel>) => {
        this.datasource = inventoryTransactionTransferIns.map(item => {
          const inventoryTransactionTransferIn = new InventoryTransactionTransferInViewModel(item);
          return inventoryTransactionTransferIn;
        });
      });
  }

  onClickTransferInButton() {
    this.isShowTransferIn = true;
  }

  onclickBackToListingButton(event) {
    this.getDefaultInventoryTransaction();
    this.isShowTransferIn = event;
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 1,
        title: 'Transfer In',
        action: ActionType.onScreen,
        onClick: () => this.onClickTransferInButton()        
      }),
      new Button({
        id: 0,
        title: 'Detail',
        component: DetailTransferInComponent,
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

  getTransferFilterRequestModel() {

    const fromLocationIdList = [];
    this.fromLocationSelected.map(item => {
      fromLocationIdList.push(item.id);
    });

    const toLocationIdList = [];
    this.toLocationSelected.map(item => {
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
