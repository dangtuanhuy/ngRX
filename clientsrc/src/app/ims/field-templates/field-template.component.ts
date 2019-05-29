import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { FieldTemplateModel, FieldTemplateType, FieldTemplateTypes, FieldTemplateResponse } from './field-template.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import * as fromFieldTemplate from '../field-templates/state/field-template.reducer';
import * as fieldTemplateActions from '../field-templates/state/field-template.action';
import * as fieldTemplateSelector from '../field-templates/state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { AddFieldTemplateComponent } from './add-field-template/add-field-template.component';
import { UpdateFieldTemplateComponent } from './update-field-template/update-field-template.component';
import { DeleteFieldTemplateComponent } from './delete-field-template/delete-field-template.component';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import * as fromAuths from '../../shared/components/auth/state/index';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-field-template',
  templateUrl: './field-template.component.html',
  styleUrls: ['./field-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FieldTemplateComponent extends ComponentBase {

  public addSuccessMessage = 'Field Template is added.';
  public updateSuccessMessage = 'Field Template is updated.';
  public deleteSuccessMessage = 'Field Template is deleted.';
  public datasource: Array<FieldTemplateResponse> = [];
  public listButton = Array<Button>();
  public title;
  public pageSize = 10;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public queryText = '';
  componentActive = true;
  userDefinedColumnSetting: UserDefinedColumnSetting;
  isHiddenSearchBox = false;
  constructor(private store: Store<fromFieldTemplate.FieldTemplateState>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.title = 'Field Template Management';

    this.handleSubscription(this.store.pipe(
      select(fromAuths.getUserId), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsFieldTemplate`,
            'name,description,type',
            environment.app.ims.apiUrl
            );
          this.getFieldTemplate(this.queryText);
          this.setButtonsConfiguration();
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(fieldTemplateSelector.getSelectedItem), takeWhile(() => this.componentActive))
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


  getFieldTemplate(searchText: string) {
    this.store.dispatch(new fieldTemplateActions.GetFieldTemplates(new PagingFilterCriteria(1, this.pageSize), searchText));
    this.handleSubscription(
      this.store.pipe(select(fieldTemplateSelector.getFieldTemplates),
        takeWhile(() => this.componentActive))
        .subscribe(
          (fieldTemplates: Array<FieldTemplateResponse>) => {
            this.datasource = fieldTemplates.map(item => {
              item.type = this.getFieldTemplateType(item.type);
              const fieldTemplate = new FieldTemplateResponse(item);
              return fieldTemplate;
            });
          }
        ));
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new fieldTemplateActions.GetFieldTemplates(new PagingFilterCriteria(page + 1, this.pageSize), this.queryText));
  }


  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 1,
        title: 'Add',
        component: AddFieldTemplateComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      }),
      new Button({
        id: 2,
        title: 'Edit',
        component: UpdateFieldTemplateComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteFieldTemplateComponent,
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

  getFieldTemplateType(type: any) {
    return Object.values(FieldTemplateTypes).includes(+type)
    ? Object.keys(FieldTemplateTypes).find(function(item, key) { return key === (+type - 1); })
    : type;
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getFieldTemplate(this.queryText);
  }
}
