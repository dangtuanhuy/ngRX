import { Action } from '@ngrx/store';
import { FormState } from 'src/app/shared/base-model/form.state';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

export enum ListViewManagementActionTypes {
    UpdateFormStateAction = '[List View Management] Update Form Action State',
    AddSuccess = '[List View Management] Add Success',
    UpdateSuccess = '[List View Management] Update Success',
    DeleteSuccess = '[List View Management] Delete Success',
    GetPageSuccess = '[List View Management] Get Page Success',
    ChangeSelectedPage = '[List View Management] Change Selected Page',
    ChangeSelectedItem = '[List View Management] Change Selected Item',
    ChangeSelectedItems = '[List View Management] Change Selected Items',
    ResetState = '[List View Management] Reset State',
    InitEmptyPage = '[List View Management] Init Empty Page',
    ChangeFilter = '[List View Management] Change Filter'
}

export class UpdateFormStateAction implements Action {
    readonly type = ListViewManagementActionTypes.UpdateFormStateAction;
    constructor(public payload: FormState) { }
}

export class AddSucessAction implements Action {
    readonly type = ListViewManagementActionTypes.AddSuccess;
    constructor() { }
}

export class UpdateSucessAction implements Action {
    readonly type = ListViewManagementActionTypes.UpdateSuccess;
    constructor() { }
}

export class DeleteSucessAction implements Action {
    readonly type = ListViewManagementActionTypes.DeleteSuccess;
    constructor() { }
}

export class GetPageSuccessAction implements Action {
    readonly type = ListViewManagementActionTypes.GetPageSuccess;
    constructor(public payload: PagedResult<any>) { }
}

export class ChangeSelectedPageAction implements Action {
    readonly type = ListViewManagementActionTypes.ChangeSelectedPage;
    constructor(public payload: number) { }
}

export class ChangeSelectedItemAction implements Action {
    readonly type = ListViewManagementActionTypes.ChangeSelectedItem;
    constructor(public payload: string) { }
}

export class ChangeSelectedItemsAction implements Action {
    readonly type = ListViewManagementActionTypes.ChangeSelectedItems;
    constructor(public payload: string[]) { }
}

export class ResetState implements Action {
    readonly type = ListViewManagementActionTypes.ResetState;
    constructor() { }
}

export class InitEmptyPage implements Action {
    readonly type = ListViewManagementActionTypes.InitEmptyPage;
    constructor() { }
}

export class ChangeFilter implements Action {
    readonly type = ListViewManagementActionTypes.ChangeFilter;
    constructor(public payload: any) { }
}



export type ListViewManagementActions =
    UpdateFormStateAction
    | AddSucessAction
    | GetPageSuccessAction
    | ChangeSelectedPageAction
    | ChangeSelectedItemAction
    | UpdateSucessAction
    | DeleteSucessAction
    | ResetState
    | InitEmptyPage
    | ChangeSelectedItemsAction
    | ChangeFilter;
