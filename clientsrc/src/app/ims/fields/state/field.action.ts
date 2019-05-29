
import { Action } from '@ngrx/store';
import { FieldModel, EntityRefModel } from '../field.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';


export enum FieldActionTypes {
    GetFields = '[Field] Get Fields',
    GetFieldsSuccess = '[Field] Get Fields Success',
    GetFieldsFail = '[Field] Get Fields Fail',

    GetField = '[Field] Get Field',
    GetFieldSuccess = '[Field] Get Field Success',
    GetFieldFail = '[Field] Get Field Fail',

    AddField = '[Field] Add Field',
    AddFieldSuccess = '[Field] Add Field Success',
    AddFieldFail = '[Field] Add Field Fail',

    UpdateField = '[Field] Update Category',
    UpdateFieldSuccess = '[Field] Update Field Success',
    UpdateFieldFail = '[Field] Update Field Fail',

    DeleteField = '[Field] Delete Field',
    DeleteFieldSuccess = '[Field] Delete Field Success',
    DeleteFieldFail = '[Field] Delete Field Fail',

    GetEntityRefList = '[Field] Get Entity Reference List',
    GetEntityRefListSuccess = '[Field] Get Entity Reference List Success',
    GetEntityRefListFail = '[Field] Get Entity Reference List Fail',
}

export class GetFields implements Action {
    readonly type = FieldActionTypes.GetFields;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetFieldsSuccess implements Action {
    readonly type = FieldActionTypes.GetFieldsSuccess;
    constructor(public payload: PagedResult<FieldModel>) { }
}

export class GetFieldsFail implements Action {
    readonly type = FieldActionTypes.GetFieldsFail;
    constructor(public payload: null) { }
}

export class GetField implements Action {
    readonly type = FieldActionTypes.GetField;
    constructor(public payload: string) { }
}

export class GetFieldSuccess implements Action {
    readonly type = FieldActionTypes.GetFieldSuccess;
    constructor(public payload: FieldModel) { }
}

export class GetFieldFail implements Action {
    readonly type = FieldActionTypes.GetFieldFail;
    constructor(public payload: null) { }
}

export class GetEntityRefList implements Action {
    readonly type = FieldActionTypes.GetEntityRefList;
    constructor() { }
}

export class GetEntityRefListSuccess implements Action {
    readonly type = FieldActionTypes.GetEntityRefListSuccess;
    constructor(public payload: EntityRefModel[]) { }
}

export class GetEntityRefListFail implements Action {
    readonly type = FieldActionTypes.GetEntityRefListFail;
    constructor(public payload: null) { }
}

export class AddField implements Action {
    readonly type = FieldActionTypes.AddField;
    constructor(public payload: FieldModel) { }
}

export class AddFieldSuccess implements Action {
    readonly type = FieldActionTypes.AddFieldSuccess;
    constructor(public payload: FieldModel) { }
}

export class AddFieldFail implements Action {
    readonly type = FieldActionTypes.AddFieldFail;
    constructor(public payload: string) { }
}

export class UpdateField implements Action {
    readonly type = FieldActionTypes.UpdateField;
    constructor(public payload: FieldModel) { }
}

export class UpdateFieldSuccess implements Action {
    readonly type = FieldActionTypes.UpdateFieldSuccess;
    constructor(public payload: FieldModel) { }
}

export class UpdateFieldFail implements Action {
    readonly type = FieldActionTypes.UpdateFieldFail;
    constructor(public payload: string) { }
}

export class DeleteField implements Action {
    readonly type = FieldActionTypes.DeleteField;
    constructor(public payload: string) { }
}

export class DeleteFieldSuccess implements Action {
    readonly type = FieldActionTypes.DeleteFieldSuccess;
    constructor(public payload: string) { }
}

export class DeleteFieldFail implements Action {
    readonly type = FieldActionTypes.DeleteFieldFail;
    constructor(public payload: string) { }
}

export type FieldActions =
    | GetFields
    | GetFieldsSuccess
    | GetFieldsFail
    | GetField
    | GetFieldSuccess
    | GetFieldFail
    | AddField
    | AddFieldSuccess
    | AddFieldFail
    | UpdateField
    | UpdateFieldSuccess
    | UpdateFieldFail
    | DeleteField
    | DeleteFieldSuccess
    | DeleteFieldFail
    | GetEntityRefList
    | GetEntityRefListSuccess
    | GetEntityRefListFail;
