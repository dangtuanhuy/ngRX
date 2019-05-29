import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { FieldTemplateModel } from '../field-template.model';
import { FieldModel } from '../../fields/field.model';
import { AppSettingModel } from 'src/app/shared/base-model/appsetting.model';

export enum FieldTemplateActionTypes {
    GetFieldTemplates = '[fieldTemplate] Get Field Template',
    GetFieldTemplatesSuccess = '[fieldTemplate] Get Field Template Success',
    ChangeSelectedPage = '[fieldTemplate] Change Selected Page',
    ChangeSelectedItem = '[fieldTemplate] Change Selected Item',
    GetSelectedColumns = '[fieldTemplate] Get Selected Columns',
    GetSelectedColumnsSuccess = '[FieldTemplate] Get Selected Columns Success',
    GetFields = '[FieldTemplate] get Fields',
    GetFieldsSuccess = '[FieldTemplate] get Fields Success',
    GetFieldsFail = '[FieldTemplate] get Fields Fail',
    AddFieldTemplate = '[FieldTemplate] Add Field Template',
    AddFieldTemplateSuccess = '[FieldTemplate] Add Field Template Success',
    AddFieldTemplateFail = '[FieldTemplate] Add Field Template Fail',
    GetFieldTemplateTypes = '[FieldTemplate] Get Field Template Types',
    GetFieldTemplateTypesSuccess = '[FieldTemplate] Get Field Template Types Success',
    GetFieldTemplateTypesFail = '[FieldTemplate] Get Field Template Types Fail',
    UpdateFieldTemplate = '[FieldTemplate] Update Field Template',
    UpdateFieldTemplateSuccess = '[FieldTemplate] Update Field Template Success',
    UpdateFieldTemplateFail = '[FieldTemplate] Update Field Template Fail',
    UpdateStateAction = '[FieldTemplate] Update Action State',
    DeleteFieldTemplate = '[FieldTemplate] Delete Field Template',
    DeleteFieldTemplateSuccess = '[FieldTemplate] Delete Field Template Success',
    DeleteFieldTemplateFail = '[FieldTemplate] Delete Field Template Fail'
}

export class GetFieldTemplates implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldTemplates;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetFieldTemplatesSuccess implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldTemplatesSuccess;
    constructor(public payload: PagedResult<FieldTemplateModel>) { }
}

export class AddFieldTemplateFail implements Action {
    readonly type = FieldTemplateActionTypes.AddFieldTemplateFail;
    constructor(public payload: string) { }
  }

export class ChangeSelectedPage implements Action {
    readonly type = FieldTemplateActionTypes.ChangeSelectedPage;
    constructor(public payload: number) { }
}

export class ChangeSelectedItem implements Action {
    readonly type = FieldTemplateActionTypes.ChangeSelectedItem;
    constructor(public payload: string) { }
}

export class GetAllSelectedColumns implements Action {
    readonly type = FieldTemplateActionTypes.GetSelectedColumns;
    constructor(public payload: string) { }
}

export class GetSelectedColumnsSuccess implements Action {
    readonly type = FieldTemplateActionTypes.GetSelectedColumnsSuccess;
    constructor(public payload: AppSettingModel) { }
}

export class GetFields implements Action {
    readonly type = FieldTemplateActionTypes.GetFields;
    constructor() { }
}


export class GetFieldsSuccess implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldsSuccess;
    constructor(public payload: FieldModel[]) { }
}

export class GetFieldsFail implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldsFail;
    constructor(public payload: null) { }
}

export class AddFieldTemplate implements Action {
    readonly type = FieldTemplateActionTypes.AddFieldTemplate;
    constructor(public payload: FieldTemplateModel) { }
}

export class AddFieldTemplateSuccess implements Action {
    readonly type = FieldTemplateActionTypes.AddFieldTemplateSuccess;
    constructor(public payload: FieldTemplateModel) { }
}

export class GetFieldTemplateTypes implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldTemplateTypes;
    constructor() { }
}

export class GetFieldTemplateTypesSuccess implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldTemplateTypesSuccess;
    constructor(public payload: Array<string>) { }
}

export class GetFieldTemplateTypesFail implements Action {
    readonly type = FieldTemplateActionTypes.GetFieldTemplateTypesFail;
    constructor(public payload: null) { }
}

export class UpdateFieldTemplate implements Action {
    readonly type = FieldTemplateActionTypes.UpdateFieldTemplate;
    constructor(public payload: FieldTemplateModel) { }
}

export class UpdateFieldTemplateSuccess implements Action {
    readonly type = FieldTemplateActionTypes.UpdateFieldTemplateSuccess;
    constructor(public payload: FieldTemplateModel) { }
}

export class UpdateFieldTemplateFail implements Action {
    readonly type = FieldTemplateActionTypes.UpdateFieldTemplateFail;
    constructor(public payload: string) { }
}

export class UpdateStateAction implements Action {
    readonly type = FieldTemplateActionTypes.UpdateStateAction;
    constructor(public payload: any) { }
}

export class DeleteFieldTemplate implements Action {
    readonly type = FieldTemplateActionTypes.DeleteFieldTemplate;
    constructor(public payload: string) { }
}

export class DeleteFieldTemplateSuccess implements Action {
    readonly type = FieldTemplateActionTypes.DeleteFieldTemplateSuccess;
    constructor(public payload: string) { }
}

export class DeleteFieldTemplateFail implements Action {
    readonly type = FieldTemplateActionTypes.DeleteFieldTemplateFail;
    constructor(public payload: string) { }
}
export type FieldTemplateActions =
| GetFieldTemplates
| GetFieldTemplatesSuccess
| ChangeSelectedPage
| ChangeSelectedItem
| GetAllSelectedColumns
| GetSelectedColumnsSuccess
| GetFields
| GetFieldsSuccess
| GetFieldsFail
| AddFieldTemplate
| AddFieldTemplateSuccess
| AddFieldTemplateFail
| GetFieldTemplateTypes
| GetFieldTemplateTypesSuccess
| GetFieldTemplateTypesFail
| UpdateFieldTemplate
| UpdateFieldTemplateSuccess
| UpdateFieldTemplateFail
| UpdateStateAction
| DeleteFieldTemplate
| DeleteFieldTemplateSuccess
| DeleteFieldTemplateFail;
