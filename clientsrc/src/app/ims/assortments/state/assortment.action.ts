import { Action } from '@ngrx/store';
import { AssortmentModel } from '../assortment.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

export enum AssortmentActionTypes {
  GetAssortments = '[Assortment] Get Assortments',
  GetAssortment = '[Assortment] Get Assortment',
  GetAssortmentsSuccess = '[Assortment] Get Assortments Success',
  GetAssortmentSuccess = '[Assortment] Get Assortment Success',
  GetAssortmentsFail = '[Assortment] Get Assortments Fail',
  AddAssortment = '[Assortment] Add Assortment',
  AddAssortmentSuccess = '[Assortment] Add Assortment Success',
  AddAssortmentFail = '[Assortment] Add Assortment Fail',
  UpdateAssortment = '[Assortment] Update Assortment',
  UpdateAssortmentSuccess = '[Assortment] Update Assortment Success',
  UpdateAssortmentFail = '[Assortment] Update Assortment Fail',
  DeleteAssortment = '[Assortment] Delete Assortment',
  DeleteAssortmentSuccess = '[Assortment] Delete Assortment Success',
  DeleteAssortmentFail = '[Assortment] Delete Assortment Fail',
}


export class GetAssortments implements Action {
  readonly type = AssortmentActionTypes.GetAssortments;
  constructor(public payload: PagingFilterCriteria) { }
}

export class GetAssortment implements Action {
  readonly type = AssortmentActionTypes.GetAssortment;
  constructor(public payload: string) { }
}

export class GetAssortmentsSuccess implements Action {
  readonly type = AssortmentActionTypes.GetAssortmentsSuccess;
  constructor(public payload: PagedResult<AssortmentModel>) { }
}

export class GetAssortmentSuccess implements Action {
  readonly type = AssortmentActionTypes.GetAssortmentSuccess;
  constructor(public payload: AssortmentModel) { }
}

export class GetAssortmentsFail implements Action {
  readonly type = AssortmentActionTypes.GetAssortmentsFail;
  constructor(public payload: null) { }
}

export class AddAssortment implements Action {
  readonly type = AssortmentActionTypes.AddAssortment;
  constructor(public payload: AssortmentModel) { }
}

export class AddAssortmentSuccess implements Action {
  readonly type = AssortmentActionTypes.AddAssortmentSuccess;
  constructor(public payload: AssortmentModel) { }
}

export class AddAssortmentFail implements Action {
  readonly type = AssortmentActionTypes.AddAssortmentFail;
  constructor(public payload: string) { }
}

export class UpdateAssortment implements Action {
  readonly type = AssortmentActionTypes.UpdateAssortment;
  constructor(public payload: AssortmentModel) { }
}

export class UpdateAssortmentSuccess implements Action {
  readonly type = AssortmentActionTypes.UpdateAssortmentSuccess;
  constructor(public payload: AssortmentModel) { }
}

export class UpdateAssortmentFail implements Action {
  readonly type = AssortmentActionTypes.UpdateAssortmentFail;
  constructor(public payload: string) { }
}

export class DeleteAssortment implements Action {
  readonly type = AssortmentActionTypes.DeleteAssortment;
  constructor(public payload: string) { }
}

export class DeleteAssortmentSuccess implements Action {
  readonly type = AssortmentActionTypes.DeleteAssortmentSuccess;
  constructor(public payload: string) { }
}

export class DeleteAssortmentFail implements Action {
  readonly type = AssortmentActionTypes.DeleteAssortmentFail;
  constructor(public payload: string) { }
}

export type AssortmentActions =
  GetAssortments
  | GetAssortment
  | GetAssortmentsSuccess
  | GetAssortmentSuccess
  | GetAssortmentsFail
  | AddAssortment
  | AddAssortmentSuccess
  | AddAssortmentFail
  | UpdateAssortment
  | UpdateAssortmentSuccess
  | UpdateAssortmentFail
  | DeleteAssortment
  | DeleteAssortmentSuccess
  | DeleteAssortmentFail;
