import { ComponentBase } from 'src/app/shared/components/component-base';
import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Button } from 'src/app/shared/base-model/button.model';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import * as storeActions from '../stores/state/store.action';
import * as storeSelector from '../stores/state/index';
import * as fromStore from '../stores/state/store.reducer';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as fromAuths from '../../shared/components/auth/state/index';
import { StoreService } from 'src/app/shared/services/stores.service';
import { UpdateStoreComponent } from './update-store/update-store.component';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ExportCsvComponent } from './export-csv/export-csv.component';
import { StoreSettingGenerationComponent } from './store-setting-generation/store-setting-generation.component';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoresComponent extends ComponentBase {

  constructor(
    public injector: Injector, public storeService: StoreService, private store: Store<fromStore.StoreState>) {
    super(injector);
  }

  public pageSize = 10;
  public addSuccessMessage = 'Store is added.';
  public updateSuccessMessage = 'Store is updated.';
  public deleteSuccessMessage = 'Store is deleted.';

  public datasource: Array<StoreModel> = [];
  public listButton;
  public componentActive = true;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = false;
  public selectedStore: StoreModel;

  onInit() {
    this.title = 'Store Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsLocation`,
            'id,name,address',
            environment.app.ims.apiUrl
          );
          this.getStores();
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(storeSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string | null) => {
          if (id) {
            this.selectedStore = this.datasource.find(x => x.id === id);
            this.changeListButton(false);
          } else {
            this.changeListButton(true);
          }
        }
      ));
  }

  onDestroy() {

  }

  getStores() {
    this.store.dispatch(new storeActions.GetStores(new PagingFilterCriteria(1, this.pageSize)));
    this.store.pipe(select(storeSelector.getStores),
      takeWhile(() => this.componentActive))
      .subscribe(
        (data: Array<StoreModel>) => {
          this.datasource = data;
        }
      );
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Export',
        component: ExportCsvComponent,
        action: ActionType.dialog,
        disable: true
      }),
      new Button({
        id: 1,
        title: 'Update',
        component: UpdateStoreComponent,
        action: ActionType.dialog,
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Generate Store Setting',
        component: StoreSettingGenerationComponent,
        redirectUrl: './generate-store-settings',
        action: ActionType.onScreen,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      }),
    ];
  }


  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      btn.disable = isDisabled;
    });
  }
}

export class SaleTransactionModel {
  LocationId: string;
  MachineId: string;
  ReportType: string;
  ToDate: string;
}

export class StoreModel {
  id: string;
  name: string;
  address: string;
  devideCode: string;
  devideName: string;
  mall: string;
  machineId: string;
  accountId: string;
  password: string;
  serverIP: string;
  port: number;
  folderPath: string;
  storeName: string;
}



