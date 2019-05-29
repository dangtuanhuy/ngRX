import { Action } from '@ngrx/store';
import { LocationModel } from '../../locations/location.model';

export enum StockInitialActionTypes {
    GetLocations = '[StockInitial] Get Locations',
    GetLocationsSuccess = '[StockInitial] Get Locations Success',
    GetLocationsFail = '[StockInitial]  Get Locations Fail'
}

export class GetLocations implements Action {
    readonly type = StockInitialActionTypes.GetLocations;
    constructor() { }
}

export class GetLocationsSuccess implements Action {
    readonly type = StockInitialActionTypes.GetLocationsSuccess;
    constructor(public payload: LocationModel[]) { }
}

export class GetLocationsFail implements Action {
    readonly type = StockInitialActionTypes.GetLocationsFail;
    constructor(public payload: null) { }
}

export type StockInitialActions = GetLocations
    | GetLocationsSuccess
    | GetLocationsFail;
