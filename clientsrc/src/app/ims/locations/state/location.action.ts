import { Action } from '@ngrx/store';
import { LocationModel } from '../location.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

export enum LocationActionTypes {
  GetLocations = '[Location] Get Locations',
  GetLocation = '[Location] Get Location',
  GetLocationsSuccess = '[Location] Get Locations Success',
  GetLocationSuccess = '[Location] Get Location Success',
  GetLocationsFail = '[Location] Get Locations Fail',
  AddLocation = '[Location] Add Location',
  AddLocationSuccess = '[Location] Add Location Success',
  AddLocationFail = '[Location] Add Location Fail',
  UpdateLocation = '[Location] Update Location',
  UpdateLocationSuccess = '[Location] Update Location Success',
  UpdateLocationFail = '[Location] Update Location Fail',
  DeleteLocation = '[Location] Delete Location',
  DeleteLocationSuccess = '[Location] Delete Location Success',
  DeleteLocationFail = '[Location] Delete Location Fail',
}

export class GetLocations implements Action {
  readonly type = LocationActionTypes.GetLocations;
  constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetLocation implements Action {
  readonly type = LocationActionTypes.GetLocation;
  constructor(public payload: string) { }
}

export class GetLocationsSuccess implements Action {
  readonly type = LocationActionTypes.GetLocationsSuccess;
  constructor(public payload: PagedResult<LocationModel>) { }
}

export class GetLocationSuccess implements Action {
  readonly type = LocationActionTypes.GetLocationSuccess;
  constructor(public payload: LocationModel) { }
}

export class GetLocationsFail implements Action {
  readonly type = LocationActionTypes.GetLocationsFail;
  constructor(public payload: null) { }
}

export class AddLocation implements Action {
  readonly type = LocationActionTypes.AddLocation;
  constructor(public payload: LocationModel) { }
}

export class AddLocationSuccess implements Action {
  readonly type = LocationActionTypes.AddLocationSuccess;
  constructor(public payload: LocationModel) { }
}

export class AddLocationFail implements Action {
  readonly type = LocationActionTypes.AddLocationFail;
  constructor(public payload: string) { }
}

export class UpdateLocation implements Action {
  readonly type = LocationActionTypes.UpdateLocation;
  constructor(public payload: LocationModel) { }
}

export class UpdateLocationSuccess implements Action {
  readonly type = LocationActionTypes.UpdateLocationSuccess;
  constructor(public payload: LocationModel) { }
}

export class UpdateLocationFail implements Action {
  readonly type = LocationActionTypes.UpdateLocationFail;
  constructor(public payload: string) { }
}

export class DeleteLocation implements Action {
  readonly type = LocationActionTypes.DeleteLocation;
  constructor(public payload: string) { }
}

export class DeleteLocationSuccess implements Action {
  readonly type = LocationActionTypes.DeleteLocationSuccess;
  constructor(public payload: string) { }
}

export class DeleteLocationFail implements Action {
  readonly type = LocationActionTypes.DeleteLocationFail;
  constructor(public payload: string) { }
}

export type LocationActions =
  GetLocations
  | GetLocation
  | GetLocationsSuccess
  | GetLocationSuccess
  | GetLocationsFail
  | AddLocation
  | AddLocationSuccess
  | AddLocationFail
  | UpdateLocation
  | UpdateLocationSuccess
  | UpdateLocationFail
  | DeleteLocation
  | DeleteLocationSuccess
  | DeleteLocationFail;
