import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import * as fromStockRequest from '../stock-requests/state/stock-request.reducer';
import * as stockRequestActions from '../stock-requests/state/stock-request.action';
import * as stockRequestSelector from '../stock-requests/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { Store, select } from '@ngrx/store';
import { StockRequestListModel, StockRequestStatusEnum, EnumStockRequestStatus } from './stock-request.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { takeWhile } from 'rxjs/operators';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { environment } from 'src/environments/environment';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { StockRequestAddComponent } from './stock-request-add/stock-request-add.component';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { StockRequestUpdateComponent } from './stock-request-update/stock-request-update.component';
import { FilterRequestModel } from '../goods-inwards/goods-inward.model';
import { LocationType } from '../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import * as moment from 'moment';


const AddFormIndex = 1;
const wareHouseType = LocationType.wareHouse;
const storeType = LocationType.store;

@Component({
  selector: 'app-stock-request',
  templateUrl: './stock-request.component.html',
  styleUrls: ['./stock-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockRequestComponent extends ComponentBase {
  public title = '';
  public addSuccessMessage = 'Stock request is added.';
  public updateSuccessMessage = 'Stock request is updated.';
  public pageSize = 10;
  public actionType = ActionType.dialog;
  public datasource: StockRequestListModel[] = [];
  public listButton: Button[] = [];
  public queryText = '';
  componentActive = true;
  isHiddenSearchBox = false;
  userDefinedColumnSetting: UserDefinedColumnSetting;
  public statusPlaceholder = 'Select Status';
  public fromLocationPlaceholder = 'Select From Location';
  public toLocationPlaceholder = 'Select To Location';
  public fromLocationDropdownList = [];
  public toLocationDropdownList = [];
  public statusDropdownList = [];
  public fromLocationSelected = [];
  public toLocationSelected = [];
  public statusSelected = [];

  constructor(private store: Store<fromStockRequest.StockRequestState>,
    private locationService: LocationService,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(
      this.store
        .pipe(
          select(fromAuths.getUserId),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsStockRequest`,
            'subject,description,fromLocationName,toLocationName,status',
            environment.app.ims.apiUrl
          );
          this.getLocations();
          this.getStockRequests(this.getStockRequestModel());
          this.setButtonsConfiguration();
        })
    );

    this.handleSubscription(
      this.store
        .pipe(
          select(stockRequestSelector.getSelectedItem),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string | null) => {
          if (id) {
            this.changeListButton(false);
          } else {
            this.changeListButton(true);
          }
        })
    );
  }

  onDestroy() {

  }

  getStockRequests(stockRequestModel: FilterRequestModel) {
    this.store.dispatch(new stockRequestActions.GetStockRequests(new PagingFilterCriteria(1, this.pageSize), stockRequestModel));
    this.handleSubscription(
      this.store.pipe(select(stockRequestSelector.getStockRequests),
        takeWhile(() => this.componentActive))
        .subscribe((stockRequests: StockRequestListModel[]) => {
          this.datasource = stockRequests;
        }));

    this.getAllStatusStockRequest();
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(
      new stockRequestActions.GetStockRequests(
        new PagingFilterCriteria(page + 1, this.pageSize), this.getStockRequestModel())
    );
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: AddFormIndex,
        title: 'Add',
        component: StockRequestAddComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 2,
        title: 'Edit',
        component: StockRequestUpdateComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
  }

  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Edit') {
        btn.disable = isDisabled;
      }
    });
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getStockRequests(this.getStockRequestModel());
  }

  displaydropDownListStatus(dropDownListStatus) {
    this.statusSelected = dropDownListStatus;
    this.getStockRequests(this.getStockRequestModel());
  }

  displaydropDownListToLocation(toLocationDropdownList) {
    this.toLocationSelected = toLocationDropdownList;
    this.getStockRequests(this.getStockRequestModel());
  }

  displaydropDownListFromLocation(fromLocationDropdownList) {
    this.fromLocationSelected = fromLocationDropdownList;
    this.getStockRequests(this.getStockRequestModel());
  }

  private getAllStatusStockRequest () {
    this.statusDropdownList = [
      { id: StockRequestStatusEnum.Opened, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Opened)},
      { id: StockRequestStatusEnum.Submitted, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Submitted)},
      { id: StockRequestStatusEnum.Approved, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Approved)},
      { id: StockRequestStatusEnum.Closed, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Closed) },
      { id: StockRequestStatusEnum.Canceled, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Canceled)},
      { id: StockRequestStatusEnum.Rejected, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Rejected) },
      { id: StockRequestStatusEnum.PartialAllocated, itemName: this.getStockRequestStatus(StockRequestStatusEnum.PartialAllocated)},
      { id: StockRequestStatusEnum.Allocated, itemName: this.getStockRequestStatus(StockRequestStatusEnum.Allocated) }
    ];
  }

  private getLocations() {
    this.locationService.getByType(wareHouseType).subscribe(wareHouses => {
      const locations = [];
      wareHouses.map(wareHouse => {
        locations.push({
          id: wareHouse.id, itemName: wareHouse.name
        });
      });
      this.fromLocationDropdownList = locations;
    });
    this.locationService.getByType(storeType).subscribe(stores => {
      const locations = [];
      stores.map(store => {
        locations.push({
          id: store.id, itemName: store.name
        });
      });
      this.toLocationDropdownList = locations;
    });
  }

  getStockRequestModel () {
    const fromLocationIdList = [];
    this.fromLocationSelected.map( item => {
      fromLocationIdList.push(item.id);
    });

    const toLocationIdList = [];
    this.toLocationSelected.map( item => {
      toLocationIdList.push(item.id);
    });

    const statusIdList = [];
    this.statusSelected.map( item => {
      statusIdList.push(item.itemName);
    });
    const goodsInwardRequestModel: FilterRequestModel = {
      fromLocationIds: fromLocationIdList,
      toLocationIds: toLocationIdList,
      statusIds: statusIdList,
      queryString: this.queryText === undefined ? '' : this.queryText
    };
    return goodsInwardRequestModel;
  }

  getStockRequestStatus(status: any) {
    return Object.values(EnumStockRequestStatus).includes(+status)
        ? Object.keys(EnumStockRequestStatus).find(function (item, key) { return key === (+status); })
        : status;
  }
}
