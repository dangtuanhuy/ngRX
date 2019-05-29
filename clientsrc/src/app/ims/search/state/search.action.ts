import { Action } from '@ngrx/store';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { IndexModel } from '../search.model';
import { IndexType } from '../index.constant';

export enum SearchActionTypes {
    GetIndexes = '[Search] Get Indexes',
    GetIndexesSuccess = '[Search] Get Indexes Success',
    GetIndexesFail = '[Search] Get Indexes Fail',
    RebuildIndex = '',
    RebuildIndexSuccess = '',
    RebuildIndexFail = ''
}

export class GetIndexes implements Action {
    readonly type = SearchActionTypes.GetIndexes;
    constructor(public payload: {}) { }
}

export class GetIndexesSuccess implements Action {
    readonly type = SearchActionTypes.GetIndexesSuccess;
    constructor(public payload: PagedResult<IndexModel>) { }
}

export class GetIndexesFail implements Action {
    readonly type = SearchActionTypes.GetIndexesFail;
    constructor(public payload: null) { }
}

export class RebuildIndex implements Action {
    readonly type = SearchActionTypes.RebuildIndex;
    constructor(public payload: IndexType) { }
}

export class RebuildIndexSuccess implements Action {
    readonly type = SearchActionTypes.RebuildIndexSuccess;
    constructor(public payload: IndexModel) { }
}

export class RebuildIndexFail implements Action {
    readonly type = SearchActionTypes.RebuildIndexFail;
    constructor(public payload: string) { }
}


export type SearchActions = GetIndexes | GetIndexesSuccess | GetIndexesFail | RebuildIndex | RebuildIndexSuccess | RebuildIndexFail;
