import { Action } from '@ngrx/store';
import { ChannelModel } from '../../channels/channel.model';

export enum ChannelStoreAssignmentActionTypes {
    SearchStores = '[ChannelStoreAssignment] Search Stores',
    GetChannelStoreAssignments = '[ChannelStoreAssignment] Get Channel Store Assignments.',
    GetChannelSuccess = '[ChannelStoreAssignment] Get Channel Success.',
    ResetChannelStoreAssignments = '[ChannelStoreAssignment] Reset Channel Store Assignments.'
}

export class SearchStores implements Action {
    readonly type = ChannelStoreAssignmentActionTypes.SearchStores;
    constructor(public payload: string) { }
}

export class GetChannelStoreAssignments implements Action {
    readonly type = ChannelStoreAssignmentActionTypes.GetChannelStoreAssignments;
    constructor(public payload: string) { }
}

export class GetChannelSuccess implements Action {
    readonly type = ChannelStoreAssignmentActionTypes.GetChannelSuccess;
    constructor(public payload: ChannelModel) { }
}

export class ResetChannelStoreAssignments implements Action {
    readonly type = ChannelStoreAssignmentActionTypes.ResetChannelStoreAssignments;
    constructor() { }
}

export type ChannelStoreAssignmentActions =
    SearchStores
    | GetChannelStoreAssignments
    | GetChannelSuccess
    | ResetChannelStoreAssignments;
