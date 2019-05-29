import { Component, OnInit, Injector, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as fromTransferIn from '../../transfer-in/state/transfer-in.reducer';
import * as transferInActions from '../../transfer-in/state/transfer-in.action';
import * as transferInSelector from '../../transfer-in/state/index';
import { Store, select } from '@ngrx/store';
import { LocationService } from 'src/app/shared/services/location.service';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { LocationModel, LocationType } from '../../locations/location.model';
import { InventoryTransactionTransferInViewModel, TransferInRequestModel } from '../transfer-in.model';
import { takeWhile } from 'rxjs/operators';
import * as fromAuths from '../../../shared/components/auth/state/index';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';

@Component({
  selector: 'app-filter-transfer-in',
  templateUrl: './filter-transfer-in.component.html',
  styleUrls: ['./filter-transfer-in.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterTransferInComponent extends ComponentBase {
  searchByLocationForm: FormGroup = new FormGroup({});
  @Output() onclickBackToListingButton: EventEmitter<any> = new EventEmitter();
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
  public selectItems: Array<string> = [];
  public listButton;
  public title = '';
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public isHiddenSearchBox = true;
  public isMultiSelect = true;
  public isShowTransferIn = false;
  public isAddTransferIn = false;
  public isDisableNextbutton = true;
  public locations: Array<LocationModel> = [];
  public isLocationsLoading = true;
  public selectedLocation = null;
  public fromLocationId = null;
  public toLocationId = null;
  public filteredFromDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
  public filteredToDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};

  onInit() {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
    this.searchByLocationForm = this.formBuilder.group({
      location: ['', Validators.required],
    });
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsAllocationTransactionTransferIn`,
            'fromLocation,toLocation,createdDate',
            environment.app.ims.apiUrl
            );
          this.datasource = [];
          this.getLocations();
          this.setButtonsConfiguration();
        }
      ));
      this.handleSubscription(this.store.pipe(
        select(transferInSelector.getSelectedItems), takeWhile(() => this.componentActive))
        .subscribe( selectedItems => {
          this.selectItems = selectedItems;
          this.isDisableNextbutton = !(this.selectItems.length > 0);
        }));
  }
  onDestroy() {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
  }

  public onClickFilter () {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
    this.datasource = [];
    const page = 1;
    this.getInventoryTransactionTransferIns(page);
  }

  changeSelectedPage(page: number) {
    this.datasource = [];
    const nextPage = page + 1;
    this.getInventoryTransactionTransferIns(nextPage);
  }

  getTransferInRequestModel () {
    const filteredFromDate = this.filteredFromDate !== null && this.filteredFromDate !== undefined ?
                             this.filteredFromDate.year + '-' + this.filteredFromDate.month + '-' + this.filteredFromDate.day
                             : Date.now();
    const filteredToDate = this.filteredToDate !== null && this.filteredToDate !== undefined ?
                           this.filteredToDate.year + '-' + this.filteredToDate.month + '-' + this.filteredToDate.day
                           : Date.now();
    const transferInRequestModel: TransferInRequestModel = {
      fromLocationId: null,
      toLocationId: this.searchByLocationForm.get('location').value,
      fromDate: moment.utc(filteredFromDate).format('YYYY-MM-DD'),
      toDate: moment.utc(filteredToDate).format('YYYY-MM-DD')
    };
    return transferInRequestModel;
  }

  getInventoryTransactionTransferIns (page: number) {
    const transferInRequestModel = this.getTransferInRequestModel();
    this.store.dispatch(new transferInActions.GetInventoryTransactionTransferInsByLocation(new PagingFilterCriteria(page, this.pageSize),
                                                                         transferInRequestModel));
    this.store.pipe(select(transferInSelector.getInventoryTransactionTransferIns), takeWhile(() => this.componentActive))
    .subscribe((inventoryTransactionTransferIns: Array<InventoryTransactionTransferInViewModel>) => {
        this.datasource =  inventoryTransactionTransferIns.map(item => {
          item.createdDate = moment.utc(item.createdDate).format('YYYY-MM-DD');
          const inventoryTransactionTransferIn = new InventoryTransactionTransferInViewModel(item);
          return inventoryTransactionTransferIn;
        });
      });
  }

  showTransferInManagement (event) {
    this.isShowTransferIn = event;
    this.selectedLocation = null;
    this.filteredFromDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
    this.filteredToDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
  }
  showAddTransferIn () {
    this.datasource = [];
    this.selectItems = [];
    this.isShowTransferIn = true;
  }

  onclickSubtmitButton (event) {
    this.isShowTransferIn = event;
    this.datasource = null;
    this.selectedLocation = null;
    this.filteredFromDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
    this.filteredToDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
    this.isAddTransferIn =  false;
    this.checkAddTransferOut();
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
  }

  onclickBackButton (event) {
    this.isShowTransferIn = event;
    this.isAddTransferIn =  false;
    this.checkAddTransferOut();
  }

  onClickNextButton () {
    this.isShowTransferIn = true;
    this.isAddTransferIn =  true;
    this.checkAddTransferOut();
  }

  checkAddTransferOut() {
    const outlet = this.searchByLocationForm.get('location');
    if (this.isAddTransferIn) {
      outlet.disable();
    } else {
      outlet.enable();
    }
  }

  setButtonsConfiguration() {
    this.listButton = [];
  }
  public onClickBackToListingButton () {
    this.onclickBackToListingButton.emit(false);
  }

  private getLocations() {
    this.isLocationsLoading = true;
    this.locationService.getAllWithoutPaging().subscribe(res => {
      this.locations = res;
      this.isLocationsLoading = false;
    });
  }
}
