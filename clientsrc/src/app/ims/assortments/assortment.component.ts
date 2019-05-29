import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromAssortment from '../assortments/state/assortment.reducer';
import { AssortmentModel } from './assortment.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { takeWhile } from 'rxjs/operators';
import * as assortmentActions from '../assortments/state/assortment.action';
import * as assortmentSelector from '../assortments/state/index';
import { Button } from 'src/app/shared/base-model/button.model';
import { AddAssortmentComponent } from './add-assortment/add-assortment.component';
import { EditAssortmentComponent } from './edit-assortment/edit-assortment.component';
import { DeleteAssortmentComponent } from './delete-assortment/delete-assortment.component';
import * as fromAuths from '../../shared/components/auth/state/index';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AssortmentAssignmentComponent } from '../assortment-assignments/assortment-assignment.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assortment',
  templateUrl: './assortment.component.html',
  styleUrls: ['./assortment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssortmentComponent extends ComponentBase {
  constructor(
    private store: Store<fromAssortment.AssortmentState>,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'Assortment is added.';
  public updateSuccessMessage = 'Assortment is updated.';
  public deleteSuccessMessage = 'Assortment is deleted.';

  public componentActive = true;
  public datasource: Array<AssortmentModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = true;

  onInit() {
    this.title = 'Assortment Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsAssortment`,
            'name,description',
            environment.app.ims.apiUrl
            );
          this.getAssortments();
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(assortmentSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  getAssortments() {
    this.store.dispatch(new assortmentActions.GetAssortments(new PagingFilterCriteria(1, this.pageSize)));
    this.store.pipe(select(assortmentSelector.getAssortments),
      takeWhile(() => this.componentActive))
      .subscribe(
        (assortments: Array<AssortmentModel>) => {
          this.datasource = assortments;
        }
      );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new assortmentActions.GetAssortments(new PagingFilterCriteria(page + 1, this.pageSize)));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddAssortmentComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: EditAssortmentComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteAssortmentComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 3,
        title: 'SetUp',
        component: AssortmentAssignmentComponent,
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
      if (btn.title === 'Edit' || btn.title === 'Delete' || btn.title === 'SetUp') {
        btn.disable = isDisabled;
      }
    });
  }
}
