import { Component, ViewEncapsulation, Injector } from '@angular/core';
import * as fromRoot from './state/location.reducer';
import * as locationActions from './state/location.action';
import * as locationSelector from './state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { Store, select } from '@ngrx/store';
import { LocationModel, LocationViewModel } from './location.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { AddLocationComponent } from './add-location/add-location.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { DeleteLocationComponent } from './delete-location/delete-location.component';
import { takeWhile } from 'rxjs/operators';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LocationComponent extends ComponentBase {

  public pageSize = 10;
  public addSuccessMessage = 'Location is added.';
  public updateSuccessMessage = 'Location is updated.';
  public deleteSuccessMessage = 'Location is deleted.';

  public componentActive = true;
  public datasource: Array<LocationModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = false;
  public queryText = '';
  constructor(private store: Store<fromRoot.LocationState>,
    public injector: Injector) {
    super(injector);
  }


  onInit() {
    this.title = 'Location Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsLocation`,
            'name,address,locationType',
            environment.app.ims.apiUrl
            );
          this.getLocations(this.queryText);
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(locationSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  getLocations(searchText) {
    this.store.dispatch(new locationActions.GetLocations(new PagingFilterCriteria(1, this.pageSize), searchText));
    this.store.pipe(select(locationSelector.getLocations),
      takeWhile(() => this.componentActive))
      .subscribe(
        (locations: Array<LocationViewModel>) => {
          const locationView = new Array<LocationViewModel>();
          locations.forEach(x => {
            const location = new LocationViewModel(x);
            locationView.push(location);
          });
          this.datasource = locationView;
        }
      );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new locationActions.GetLocations(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddLocationComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateLocationComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteLocationComponent,
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

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getLocations(this.queryText);
  }
}

