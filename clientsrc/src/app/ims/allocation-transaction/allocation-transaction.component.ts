import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as fromAllocationTransaction from '../allocation-transaction/state/allocation-transaction.reducer';
import * as allocationTransactionActions from '../allocation-transaction/state/allocation-transaction.action';
import * as allocationTransactionSelector from '../allocation-transaction/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { AllocationTransactionModel, AllocationTransactionStatus, AllocationTransactionViewModel } from './allocation-transaction.model';
import { AddAllocationTransactionComponent } from './add-allocation-transaction/add-allocation-transaction.component';
import { UpdateAllocationTransactionComponent } from './update-allocation-transaction/update-allocation-transaction.component';
import { DeleteAllocationTransactionComponent } from './delete-allocation-transaction/delete-allocation-transaction.component';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { LocationModel, LocationType } from '../locations/location.model';
import { LocationService } from 'src/app/shared/services/location.service';
import * as moment from 'moment';
import { SubmitAllocationTransactionComponent } from './submit-allocation-transaction/submit-allocation-transaction.component';
import { AllocationTransactionStatusEnum } from 'src/app/shared/constant/allocation-transaction.constant';
import { FilterRequestModel } from '../goods-inwards/goods-inward.model';

@Component({
  selector: 'app-allocation-transaction',
  templateUrl: './allocation-transaction.component.html',
  styleUrls: ['./allocation-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllocationTransactionComponent extends ComponentBase {

  constructor(
    private store: Store<fromAllocationTransaction.AllocationTransactionState>,
    private locationService: LocationService,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'AllocationTransaction is added.';
  public updateSuccessMessage = 'AllocationTransaction is updated.';
  public deleteSuccessMessage = 'AllocationTransaction is deleted.';

  public componentActive = true;
  public datasource: Array<AllocationTransactionViewModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public wareHouses: Array<LocationModel> = [];
  public outlets: Array<LocationModel> = [];
  public queryText: '';
  public isHiddenSearchBox = false;
  public statusPlaceholder = 'Select Status';
  public fromLocationPlaceholder = 'Select From Location';
  public toLocationPlaceholder = 'Select To Location';
  public fromLocationDropdownList = [];
  public toLocationDropdownList = [];
  public statusDropdownList = [];
  public fromLocationSelected = [];
  public toLocationSelected = [];
  public statusSelected = [];

  onInit() {
    this.title = '';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsAllocationTransaction`,
            'name,description',
            environment.app.ims.apiUrl
          );
          this.getLocations();
          this.subscribeAllocationTransactions();
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(allocationTransactionSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (id) {
            this.changeListButton(false);
            this.changeSubmitButton(id);
          } else {
            this.changeListButton(true);
          }
        }
      ));
  }

  onDestroy() {
  }

  getAllocationTransactions(filterRequestModel: FilterRequestModel) {
    this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(new PagingFilterCriteria(1, this.pageSize)
                                                                                    , filterRequestModel));
  }

  subscribeAllocationTransactions() {
    this.store.pipe(select(allocationTransactionSelector.getAllocationTransactions),
      takeWhile(() => this.componentActive))
      .subscribe(
        (allocationTransactions: Array<AllocationTransactionViewModel>) => {
          this.datasource = allocationTransactions.map(item => {
            item.deliveryDate = moment.utc(item.deliveryDate).format('YYYY-MM-DD');
            item.status = this.getAllocationTransactionStatus(item.status);
            item.fromLocation = this.getWareHouseName(item.fromLocationId);
            item.toLocation = this.getOutletName(item.toLocationId);
            const allocationTransaction = new AllocationTransactionViewModel(item);
            return allocationTransaction;
          });
        }
      );
      this.getAllStatusStockAllocation();
  }

  getWareHouseName(fromLocationId: string) {
    const wareHouse = this.wareHouses.find(x => x.id === fromLocationId);
    if (wareHouse !== null && wareHouse !== undefined) {
      return wareHouse.name;
    }
    return null;
  }

  getOutletName(toLocationId: string) {
    const outLet = this.outlets.find(x => x.id === toLocationId);
    if (outLet !== null && outLet !== undefined) {
      return outLet.name;
    }
    return null;
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new allocationTransactionActions.GetAllocationTransactions(
            new PagingFilterCriteria(page + 1, this.pageSize), this.getStockAllocationRequestModel()));
  }

  private getLocations() {
    this.locationService.getByType(LocationType.wareHouse).subscribe(res => {
      this.wareHouses = res;
      const locations = [];
      this.wareHouses.map(wareHouse => {
          locations.push({
            id: wareHouse.id, itemName: wareHouse.name
          });
        });
      this.fromLocationDropdownList = locations;
      this.getAllocationTransactions(this.getStockAllocationRequestModel());
    });
    this.locationService.getByType(LocationType.store).subscribe(res => {
      this.outlets = res;
      const locations = [];
      this.outlets.map(outlet => {
          locations.push({
            id: outlet.id, itemName: outlet.name
          });
        });
      this.toLocationDropdownList = locations;
      this.getAllocationTransactions(this.getStockAllocationRequestModel());
    });
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddAllocationTransactionComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateAllocationTransactionComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteAllocationTransactionComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 3,
        title: 'Submit',
        component: SubmitAllocationTransactionComponent,
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
      if (btn.title === 'Edit' || btn.title === 'Delete' || btn.title === 'Submit') {
        btn.disable = isDisabled;
      }
    });
  }

  changeSubmitButton(id: string) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Submit' || btn.title === 'Delete') {
        const allocationTransaction = this.datasource.find(x => x.id === id);
        if (allocationTransaction !== null) {
          if ( allocationTransaction.status === this.getAllocationTransactionStatus(AllocationTransactionStatusEnum.Draft)) {
            btn.disable = false;
          } else {
            btn.disable = true;
          }
        }
      }
      if (btn.title === 'Edit' || btn.title === 'Detail') {
        const allocationTransaction = this.datasource.find(x => x.id === id);
        if (allocationTransaction !== null) {
          if ( allocationTransaction.status === this.getAllocationTransactionStatus(AllocationTransactionStatusEnum.Complete)
            || allocationTransaction.status === this.getAllocationTransactionStatus(AllocationTransactionStatusEnum.PartialTransfer)) {
              btn.title = 'Detail';
          } else {
              btn.title = 'Edit';
          }
        }
      }
    });
  }

  getAllocationTransactionStatus(status: any) {
    return Object.values(AllocationTransactionStatus).includes(+status)
      ? Object.keys(AllocationTransactionStatus).find(function (item, key) { return key === (+status - 1); })
      : status;
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getAllocationTransactions(this.getStockAllocationRequestModel());
  }

  private getAllStatusStockAllocation () {
    this.statusDropdownList = [
      { id: AllocationTransactionStatus.Complete,
        itemName: this.getAllocationTransactionStatus(AllocationTransactionStatus.Complete)},
      { id: AllocationTransactionStatus.Draft,
        itemName: this.getAllocationTransactionStatus(AllocationTransactionStatus.Draft)},
      { id: AllocationTransactionStatus.PartialTransfer,
        itemName: this.getAllocationTransactionStatus(AllocationTransactionStatus.PartialTransfer)},
      { id: AllocationTransactionStatus.Submitted,
          itemName: this.getAllocationTransactionStatus(AllocationTransactionStatus.Submitted)}
    ];
  }

  displaydropDownListStatus(dropDownListStatus) {
    this.statusSelected = dropDownListStatus;
    this.getAllocationTransactions(this.getStockAllocationRequestModel());
  }

  displaydropDownListToLocation(toLocationDropdownList) {
    this.toLocationSelected = toLocationDropdownList;
    this.getAllocationTransactions(this.getStockAllocationRequestModel());
  }

  displaydropDownListFromLocation(fromLocationDropdownList) {
    this.fromLocationSelected = fromLocationDropdownList;
    this.getAllocationTransactions(this.getStockAllocationRequestModel());
  }

  getStockAllocationRequestModel () {
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
    const stockAllocationRequestModel: FilterRequestModel = {
      fromLocationIds: fromLocationIdList,
      toLocationIds: toLocationIdList,
      statusIds: statusIdList,
      queryString: this.queryText === undefined ? '' : this.queryText
    };

    return stockAllocationRequestModel;
  }
}
