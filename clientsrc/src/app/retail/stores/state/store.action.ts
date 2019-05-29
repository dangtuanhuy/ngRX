import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { StoreModel } from '../stores.component';

export enum StoreActionTypes {
    GetStores = '[Store] Get Stores',
    GetStoresSuccess = '[Store] Get Stores Success',
    GetStoresFail = '[Store] Get Stores Fail',
    GetStore = '[Store] Get Store',
    GetStoreSuccess = '[Store] Get Store Success',
    UpdateStore = '[Store] Update Store',
    UpdateStoreSuccess = '[Store] Update Store Success',
}

export class GetStore implements Action {
    readonly type = StoreActionTypes.GetStore;
    constructor(public payload: string) { }
}

export class GetStoreSuccess implements Action {
    readonly type = StoreActionTypes.GetStoreSuccess;
    constructor(public payload: StoreModel) { }
}

export class GetStores implements Action {
    readonly type = StoreActionTypes.GetStores;
    constructor(public payload: PagingFilterCriteria) { }
}

export class GetStoresSuccess implements Action {
    readonly type = StoreActionTypes.GetStoresSuccess;
    constructor(public payload: PagedResult<StoreModel>) { }
}

export class GetStoresFail implements Action {
    readonly type = StoreActionTypes.GetStoresFail;
    constructor(public payload: null) { }
}

export class UpdateStore implements Action {
    readonly type = StoreActionTypes.UpdateStore;
    constructor(public payload: StoreModel) { }
}

export class UpdateStoreSuccess implements Action {
    readonly type = StoreActionTypes.UpdateStoreSuccess;
    constructor(public payload: StoreModel) { }
}



export type StoreActions =
    GetStore
    | GetStoreSuccess
    | GetStores
    | GetStoresSuccess
    | GetStoresFail
    | UpdateStore
    | UpdateStoreSuccess;
