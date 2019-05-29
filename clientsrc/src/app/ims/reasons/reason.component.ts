import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as fromReason from '../reasons/state/reason.reducer';
import * as reasonActions from '../reasons/state/reason.action';
import * as reasonSelector from '../reasons/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ReasonModel } from './reason.model';
import { AddReasonComponent } from './add-reason/add-reason.component';
import { UpdateReasonComponent } from './update-reason/update-reason.component';
import { DeleteReasonComponent } from './delete-reason/delete-reason.component';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReasonComponent extends ComponentBase {

  constructor(
    private store: Store<fromReason.ReasonState>,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'Reason is added.';
  public updateSuccessMessage = 'Reason is updated.';
  public deleteSuccessMessage = 'Reason is deleted.';

  public componentActive = true;
  public datasource: Array<ReasonModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public queryText = '';
  isHiddenSearchBox = false;

  onInit() {
    this.title = 'Reason Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsReason`,
            'name,description',
            environment.app.ims.apiUrl
            );
          this.getReasons(this.queryText);
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(reasonSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  getReasons(searchText: string) {
    this.store.dispatch(new reasonActions.GetReasons(new PagingFilterCriteria(1, this.pageSize), searchText));
    this.store.pipe(select(reasonSelector.getReasons),
      takeWhile(() => this.componentActive))
      .subscribe(
        (reasons: Array<ReasonModel>) => {
          this.datasource = reasons;
        }
      );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new reasonActions.GetReasons(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddReasonComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateReasonComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteReasonComponent,
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
    this.getReasons(this.queryText);
  }
}
