import { Component, Injector } from '@angular/core';
import { DeviceModel } from './device.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Button } from 'src/app/shared/base-model/button.model';
import { AddDeviceComponent } from './add-device/add-device.component';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import * as deviceActions from '../devices/state/device.action';
import * as deviceSelector from '../devices/state/index';
import * as fromDevice from '../devices/state/device.reducer';
import { Store, select } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as fromAuths from '../../shared/components/auth/state/index';
import { AuthorizeDeviceComponent } from './authorize-device/authorize-device.component';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent extends ComponentBase {
  public pageSize = 10;
  public addSuccessMessage = 'Device is added.';
  public updateSuccessMessage = 'Device is updated.';
  public deleteSuccessMessage = 'Device is deleted.';

  public componentActive = true;
  public datasource: Array<DeviceModel> = [];
  public listButton;
  public title;
  public selectedId = null;
  public actionType = ActionType.dialog;
  public userCode = '';
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public queryText = '';
  isHiddenSearchBox = true;

  constructor(
    private store: Store<fromDevice.DeviceState>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.title = 'Device Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsDevice`,
            'name',
            environment.app.retail.apiUrl
          );
          this.getDevices(this.queryText);
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(
      this.store.pipe(select(deviceSelector.getSelectedItem),
        takeWhile(() => this.componentActive))
        .subscribe(
          (id: string | null) => {
            if (id) {
              this.store.dispatch(new deviceActions.GetDevice(id));
              this.changeListButtonWhenSelectItem(false);
            } else {
              this.changeListButtonWhenSelectItem(true);
            }
          }
        ));

    this.handleSubscription(this.store.pipe(select(deviceSelector.getDevice),
      takeWhile(() => this.componentActive))
      .subscribe(
        (device: DeviceModel) => {
          if (device && !device.trusted) {
            this.userCode = device.userCode;
            this.changeListButton(false);
          } else {
            this.changeListButton(true);
          }
        }
      ));
  }

  onDestroy() {
  }

  public getDevices(searchText: string) {
    this.store.dispatch(new deviceActions.GetDevices(new PagingFilterCriteria(1, this.pageSize), searchText));
    this.store.pipe(select(deviceSelector.getDevices),
      takeWhile(() => this.componentActive))
      .subscribe(
        (devices: Array<DeviceModel>) => {
          this.datasource = devices;
        }
      );
  }

  private setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddDeviceComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Authorize Device',
        component: AuthorizeDeviceComponent,
        redirectUrl: './authorize-device',
        action: ActionType.onScreen,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true,
        param: { 'user_code': this.userCode }
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteDeviceComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
  }

  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach((btn: Button) => {
      if (btn.title === 'Authorize Device') {
        btn.disable = isDisabled;
        btn.param = { 'user_code': this.userCode };
      }
    });
  }

  changeListButtonWhenSelectItem(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach((btn: Button) => {
      if (btn.title === 'Delete') {
        btn.disable = isDisabled;
      }
    });
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new deviceActions.GetDevices(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getDevices(this.queryText);
  }
}
