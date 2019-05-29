import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as fromVendor from '../vendors/state/vendor.reducer';
import * as vendorActions from '../vendors/state/vendor.action';
import * as vendorSelector from '../vendors/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { VendorModel, VendorViewModel, PaymentTermModel, VendorFilterRequestModel } from './vendor.model';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { UpdateVendorComponent } from './update-vendor/update-vendor.component';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { CurrencyModel, TaxTypeModel } from '../purchase-orders/purchase-order.model';

interface DropDownItemModel {
  id: string;
  itemName: string;
}

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})



export class VendorComponent extends ComponentBase {

  constructor(
    private store: Store<fromVendor.VendorState>,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'Vendor is added.';
  public updateSuccessMessage = 'Vendor is updated.';
  public deleteSuccessMessage = 'Vendor is deleted.';

  public componentActive = true;
  public datasource: Array<VendorModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = false;
  searchQuery: string;


  public paymentTermsPlaceholder = 'Select Payment Term';
  public currenciesPlaceholder = 'Select Currency';
  public taxTypesPlaceholder = 'Select Tax Type';

  public selectedPaymentTerms: DropDownItemModel[] = [];
  public selectedCurrencies: DropDownItemModel[] = [];
  public selectedTaxTypes: DropDownItemModel[] = [];


  public dropDownListPaymentTerm: DropDownItemModel[] = [];
  public dropDownListCurency: DropDownItemModel[] = [];
  public dropDownListTaxType: DropDownItemModel[] = [];


  filterRequest = new VendorFilterRequestModel();


  onInit() {
    this.title = 'Vendor Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(`${id}_UserDefinedColumnsVendor`, 'name,description',
            environment.app.purchaseOrder.apiUrl);
          this.getVendors();
          this.getFilterFields();
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(vendorSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
  }

  getVendors() {
    this.store.dispatch(new vendorActions.GetVendors(new PagingFilterCriteria(1, this.pageSize), this.filterRequest));
    this.store.pipe(select(vendorSelector.getVendors),
      takeWhile(() => this.componentActive))
      .subscribe(
        (vendors: Array<VendorViewModel>) => {
          this.datasource = vendors.map(item => {
            const vendor = new VendorViewModel(item);
            return vendor;
          });
        }
      );
  }

  getFilterFields() {
    this.getPaymentTerms();
    this.getCurrencies();
    this.getTaxTypes();
  }


  getPaymentTerms() {
    this.store.dispatch(new vendorActions.GetPaymentTerms());
    this.handleSubscription(
      this.store.pipe(select(vendorSelector.getPaymentTerms))
        .subscribe(
          (paymentTerms: Array<PaymentTermModel>) => {
            this.dropDownListPaymentTerm = paymentTerms.map(x => {
              return { id: x.id, 'itemName': x.name };
            });
          }
        )
    );
  }

  getCurrencies() {
    this.store.dispatch(new vendorActions.GetCurrencies());
    this.handleSubscription(
      this.store.pipe(select(vendorSelector.getCurrencies))
        .subscribe(
          (currencies: Array<CurrencyModel>) => {
            this.dropDownListCurency = currencies.map(x => {
              return { 'id': x.id, 'itemName': x.name };
            });
          }
        )
    );
  }

  getTaxTypes() {
    this.store.dispatch(new vendorActions.GetTaxTypes());
    this.handleSubscription(
      this.store.pipe(select(vendorSelector.getTaxTypes))
        .subscribe(
          (taxTypes: Array<TaxTypeModel>) => {
            this.dropDownListTaxType = taxTypes.map(x => {
              return { 'id': x.id, 'itemName': x.name };
            });
          }
        )
    );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new vendorActions.GetVendors(new PagingFilterCriteria(page + 1, this.pageSize), this.filterRequest));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddVendorComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateVendorComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteVendorComponent,
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
      if (btn.title === 'Edit' || btn.title === 'Delete') {
        btn.disable = isDisabled;
      }
    });
  }


  handleSelectedDropDownListPaymentTerms(listItem: DropDownItemModel[]) {
    this.selectedPaymentTerms = listItem;
    this.filterRequest.paymentTermIds = listItem.map(item => {
      return item.id;
    });
    this.getVendors();
  }

  handleSelectedDropDownListCurrencies(listItem: DropDownItemModel[]) {
    this.selectedCurrencies = listItem;
    this.filterRequest.currencyIds = listItem.map(item => {
      return item.id;
    });
    this.getVendors();
  }

  handleSelectedDropDownListTaxTypes(listItem: DropDownItemModel[]) {
    this.selectedTaxTypes = listItem;
    this.filterRequest.taxTypeIds = listItem.map(item => {
      return item.id;
    });
    this.getVendors();
  }

  handleSearchQuery(query: string) {
    this.searchQuery = query;
    this.filterRequest.queryString = query;
    this.getVendors();
  }
}
