import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import { FieldModel, EntityRefModel } from './field.model';
import * as fromField from '../fields/state/field.reducer';
import * as fieldActions from '../fields/state/field.action';
import * as fieldSelector from '../fields/state/index';
import { AddFieldComponent } from './add-field/add-field.component';
import { UpdateFieldComponent } from './update-field/update-field.component';
import { DeleteFieldComponent } from './delete-field/delete-field.component';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { FieldType, FieldTypes } from './field-base/field-type';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FieldComponent extends ComponentBase {

  constructor(private store: Store<fromField.FieldState>,
    public injector: Injector) {
    super(injector);
  }

  public datasource: Array<FieldModel> = [];
  public listButton = Array<Button>();
  public title;
  public totalItems;
  public pageNumber = 0;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public queryText = '';
  componentActive = true;
  userDefinedColumnSetting: UserDefinedColumnSetting;

  public pageSize = 10;
  public addSuccessMessage = 'Field is added.';
  public updateSuccessMessage = 'Field is updated.';
  public deleteSuccessMessage = 'Field is deleted.';
  isHiddenSearchBox = false;
  onInit() {
    this.title = 'Field Management';
    this.handleSubscription(
      this.store.pipe(
        select(fromAuths.getUserId)).subscribe(
          id => {
            if (id == null) {
              return;
            }
            this.userDefinedColumnSetting = new UserDefinedColumnSetting(
              `${id}_UserDefinedColumnsField`,
              'name,description,type,defaultValue',
              environment.app.ims.apiUrl
              );
            this.getFields(this.queryText);
            this.setButtonsConfiguration();
          }
        ));


    this.handleSubscription(
      this.store.pipe(select(fieldSelector.getSelectedItem),
        takeWhile(() => this.componentActive))
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

  getUserId() {
    this.handleSubscription(
      this.store.pipe(
        select(fromAuths.getUserId)).subscribe(
          id => {
            if (id == null) {
              return;
            }
            this.userDefinedColumnSetting = new UserDefinedColumnSetting(
              `${id}_UserDefinedColumnsField`,
              'name,description,type,defaultValue',
              environment.app.ims.apiUrl
              );
          }
        ));
  }

  getFields(searchText: string) {
    this.store.dispatch(new fieldActions.GetFields(new PagingFilterCriteria(this.pageNumber + 1, this.pageSize), searchText));
    this.handleSubscription(
      this.store.pipe(select(fieldSelector.getFields),
        takeWhile(() => this.componentActive))
        .subscribe(
          (fields: Array<FieldModel>) => {
            this.datasource = fields.map(result => {
              result.defaultValue = this.buildDefaultValue(result.defaultValue, result.type);
              result.type = this.getType(result.type);
              return result;
            });
          }
        ));
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new fieldActions.GetFields(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Add',
        component: AddFieldComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      }),
      new Button({
        id: 1,
        title: 'Edit',
        component: UpdateFieldComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteFieldComponent,
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

  getType(type: any) {
    return Object.values(FieldTypes).includes(type)
    ? Object.keys(FieldTypes).find(function(item, key) { return key === (type - 1); })
    : type;
  }

  buildDefaultValue(value: any, type: string) {
    if (type.toString() === FieldType.EntityReference.toString()) {
        if (checkJsonString(value)) {
            const object = new EntityRefModel(JSON.parse(value));
            return object.name;
        }
    }
    return value;
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getFields(this.queryText);
  }
}


