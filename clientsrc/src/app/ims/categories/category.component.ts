import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import * as fromCategory from '../categories/state/category.reducer';
import * as categoryActions from '../categories/state/category.action';
import * as categorySelector from '../categories/state/index';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import { AddCategoryComponent } from './add-category/add-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { CategoryModel } from './category.model';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent extends ComponentBase {

  constructor(private store: Store<fromCategory.CategoryState>,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'Category is added.';
  public updateSuccessMessage = 'Category is updated.';
  public deleteSuccessMessage = 'Category is deleted.';

  public componentActive = true;
  public datasource: Array<CategoryModel> = [];
  public listButton;
  public title;
  public totalItems;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = false;
  public queryText = '';
  onInit() {
    this.title = 'Category Management';
    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsCategory`,
            'name,description',
            environment.app.ims.apiUrl
            );
          this.getCategories(this.queryText);
          this.setButtonsConfiguration();
        }
      ));
    this.handleSubscription(this.store.pipe(
      select(categorySelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  onDestroy() { }

  getCategories(searchText: string) {
    this.store.dispatch(new categoryActions.GetCategories(new PagingFilterCriteria(1, this.pageSize), searchText));
      this.store.pipe(select(categorySelector.getCategories),
        takeWhile(() => this.componentActive))
        .subscribe(
          (categories: Array<CategoryModel>) => {
            this.datasource = categories;
          }
        );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new categoryActions.GetCategories(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddCategoryComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' }
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateCategoryComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteCategoryComponent,
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
    this.getCategories(this.queryText);
  }
}
