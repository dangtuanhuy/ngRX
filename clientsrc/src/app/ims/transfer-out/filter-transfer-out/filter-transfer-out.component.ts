import { Component, ViewEncapsulation, Injector, Output, EventEmitter } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as transferOutActions from '../../transfer-out/state/transfer-out.action';
import * as transferOutSelector from '../../transfer-out/state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import {
  AllocationTransactionStatus,
  AllocationTransactionViewModel
} from '../../allocation-transaction/allocation-transaction.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocationModel, LocationType } from '../../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { TransferOutRequestModel, AllocationTransactionByListIdModel } from '../transfer-out.model';
import * as moment from 'moment';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';

@Component({
  selector: 'app-filter-transfer-out',
  templateUrl: './filter-transfer-out.component.html',
  styleUrls: ['./filter-transfer-out.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterTransferOutComponent extends ComponentBase {
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
  public datasource: Array<AllocationTransactionViewModel> = [];
  public selectItems: Array<string> = [];
  public listButton: Button[] = [];
  public title = '';
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public isHiddenSearchBox = true;
  public isMultiSelect = true;
  public isShowTransferOut = false;
  public isAddTransferOut = false;

  public wareHouses: Array<LocationModel> = [];
  public outlets: Array<LocationModel> = [];
  public isLocationsLoading = true;
  public isShowNextButton = false;
  public isDisableNextbutton = true;
  public selectedWareHouse = null;
  public selectedOutlet = null;
  public fromLocationId = null;
  public toLocationId = null;
  public filteredFromDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
  public filteredToDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};

  onInit() {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());

    this.searchByLocationForm = this.formBuilder.group({
      wareHouse: ['', Validators.required],
      outlet: ['', Validators.required],
    });

    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsFilterAllocationTransactionTransferOut`,
            'name,description',
            environment.app.ims.apiUrl
          );
          this.datasource = [];
          this.getLocations();
        }
      ));
      this.handleSubscription(this.store.pipe(
        select(transferOutSelector.getSelectedItems), takeWhile(() => this.componentActive))
        .subscribe( selectedItems => {
          this.selectItems = selectedItems;
          this.isDisableNextbutton = !(this.selectItems.length > 0);
        }));
  }

  onDestroy() {
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
  }

  public onClickFilter() {
    this.selectItems = [];
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
    this.datasource = [];
    const page = 1;
    this.getAllocationTransactions(page);
  }

  changeSelectedPage(page: number) {
    this.datasource = [];
    const nextPage = page + 1;
    this.getAllocationTransactions(nextPage);
  }

  getTransferOutRequestModel () {
    const filteredFromDate = this.filteredFromDate !== null && this.filteredFromDate !== undefined
                             ? this.filteredFromDate.year + '-' + this.filteredFromDate.month + '-' + this.filteredFromDate.day
                             : Date.now();
    const filteredToDate = this.filteredToDate !== null && this.filteredToDate !== undefined
                           ? this.filteredToDate.year + '-' + this.filteredToDate.month + '-' + this.filteredToDate.day
                           : Date.now();
    const transferOutRequestModel: TransferOutRequestModel = {
      fromLocationId: this.searchByLocationForm.get('wareHouse').value,
      toLocationId: this.searchByLocationForm.get('outlet').value,
      fromDate: moment.utc(filteredFromDate).format('YYYY-MM-DD'),
      toDate: moment.utc(filteredToDate).format('YYYY-MM-DD')
    };
    return transferOutRequestModel;
  }

  getAllocationTransactions (page: number) {
    const transferOutRequestModel = this.getTransferOutRequestModel();
    this.store.dispatch(new transferOutActions.GetAllocationTransactions(new PagingFilterCriteria(page, this.pageSize),
                                                                         transferOutRequestModel));
    this.store.pipe(select(transferOutSelector.getAllocationTransactions), takeWhile(() => this.componentActive))
      .subscribe((allocationTransactions: Array<AllocationTransactionViewModel>) => {
        this.datasource = allocationTransactions.map(item => {
          item.status = this.getAllocationTransactionStatus(item.status);
          item.fromLocation = this.getWareHouseName(item.fromLocationId);
          item.toLocation = this.getOutletName(item.toLocationId);
          item.deliveryDate = moment.utc(item.deliveryDate).format('YYYY-MM-DD');
          const allocationTransaction = new AllocationTransactionViewModel(item);
          return allocationTransaction;
        });
      });
  }

  getWareHouseName (fromLocationId: string ) {
    const wareHouse = this.wareHouses.find(x => x.id === fromLocationId);
    if (wareHouse !== null && wareHouse !== undefined) {
      return wareHouse.name;
    } else {
      return null;
    }
  }
  getOutletName (toLocationId: string ) {
    const outLet = this.outlets.find(x => x.id === toLocationId);
    if (outLet !== null && outLet !== undefined) {
      return outLet.name;
    } else {
      return null;
    }
  }

  onclickSubtmitButton (event) {
    this.isShowTransferOut = event;
    this.datasource = null;
    this.selectedOutlet = null;
    this.selectedWareHouse = null;
    this.filteredFromDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
    this.filteredToDate = {year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate()};
    this.isAddTransferOut =  false;
    this.checkAddTransferOut();
    this.store.dispatch(new listViewManagementActions.InitEmptyPage());
  }

  onclickBackButton (event) {
    this.isShowTransferOut = event;
    this.isAddTransferOut =  false;
    this.checkAddTransferOut();
  }

  onClickNextButton () {
    const allocationTransactionByListIdModel: AllocationTransactionByListIdModel = {
      allocationTransactionListId: this.selectItems,
      allocationTransactions: []
    };
    this.store.dispatch(new transferOutActions.GetAllocationTransactionByListIds(allocationTransactionByListIdModel));
    this.isShowTransferOut = true;
    this.fromLocationId = this.searchByLocationForm.get('wareHouse').value;
    this.toLocationId = this.searchByLocationForm.get('outlet').value;
    this.isAddTransferOut =  true;
    this.checkAddTransferOut();
  }

  public onClickBackToListingButton () {
    this.onclickBackToListingButton.emit(false);
  }

  checkAddTransferOut() {
    const wareHouse = this.searchByLocationForm.get('wareHouse');
    const outlet = this.searchByLocationForm.get('outlet');
    if (this.isAddTransferOut) {
      wareHouse.disable();
      outlet.disable();
    } else {
      wareHouse.enable();
      outlet.enable();
    }
  }

  private getLocations() {
    this.isLocationsLoading = true;
    this.locationService.getByType(LocationType.wareHouse).subscribe(res => {
      this.wareHouses = res;
      this.isLocationsLoading = false;
    });
    this.locationService.getByType(LocationType.store).subscribe(res => {
      this.outlets = res;
      this.isLocationsLoading = false;
    });
  }

  getAllocationTransactionStatus(status: any) {
    return Object.values(AllocationTransactionStatus).includes(+status)
      ? Object.keys(AllocationTransactionStatus).find(function (item, key) { return key === (+status - 1); })
      : status;
  }
}
