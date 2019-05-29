import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromChannel from '../channels/state/channel.reducer';
import { ChannelModel } from './channel.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { takeWhile } from 'rxjs/operators';
import * as channelActions from '../channels/state/channel.action';
import * as channelSelector from '../channels/state/index';
import { Button } from 'src/app/shared/base-model/button.model';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { DeleteChannelComponent } from './delete-channel/delete-channel.component';
import * as fromAuths from '../../shared/components/auth/state/index';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ChannelAssignmentComponent } from '../channel-assignments/channel-assignment.component';
import { ProvisionChannelComponent } from './provision-channel/provision-channel.component';
import { ChannelCatalogComponent } from './catalog/channel-catalog.component';
import { environment } from 'src/environments/environment';
import { ChannelStoreAssignmentComponent } from '../channel-store-assignment/channel-store-assignment.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChannelComponent extends ComponentBase  {

  constructor(
    private store: Store<fromChannel.ChannelState>,
    public injector: Injector
  ) {super(injector); }

  public pageSize = 10;
  public addSuccessMessage = 'Channel is added.';
  public updateSuccessMessage = 'Channel is updated.';
  public deleteSuccessMessage = 'Channel is deleted.';

  public componentActive = true;
  public isDisableProvisionBtn = true;
  public datasource: Array<ChannelModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = true;

  onInit() {
    this.title = 'Channel Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsChannel`,
            'name, description, serverInformation',
            environment.app.ims.apiUrl
            );
          this.getChannels();
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(channelSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  getChannels() {
    this.store.dispatch(new channelActions.GetChannels(new PagingFilterCriteria(1, this.pageSize)));
    this.store.pipe(select(channelSelector.getChannels),
      takeWhile(() => this.componentActive))
      .subscribe(
        (channels: Array<ChannelModel>) => {
          this.datasource = channels;
        }
      );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new channelActions.GetChannels(new PagingFilterCriteria(page + 1, this.pageSize)));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddChannelComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: EditChannelComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteChannelComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 3,
        title: 'SetUp',
        component: ChannelAssignmentComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 4,
        title: 'Provision',
        component: ProvisionChannelComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: this.isDisableProvisionBtn
      }),
      new Button({
        id: 5,
        title: 'Catalog',
        component: ChannelCatalogComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 6,
        title: 'Add Store',
        component: ChannelStoreAssignmentComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
  }

  getChannel(selectRow: any) {
    this.changeProvisionButton(selectRow[0].isProvision);
  }


  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Edit' || btn.title === 'Delete' || btn.title === 'SetUp' || btn.title === 'Catalog' || btn.title === 'Add Store') {
        btn.disable = isDisabled;
      }
    });
  }

  changeProvisionButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton[4].disable = isDisabled;
  }
}
