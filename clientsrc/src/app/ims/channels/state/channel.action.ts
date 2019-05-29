import { Action } from '@ngrx/store';
import { ChannelModel } from '../channel.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

export enum ChannelActionTypes {
  GetChannels = '[Channel] Get Channels',
  GetChannel = '[Channel] Get Channel',
  GetChannelsSuccess = '[Channel] Get Channels Success',
  GetChannelSuccess = '[Channel] Get Channel Success',
  GetChannelsFail = '[Channel] Get Channels Fail',
  AddChannel = '[Channel] Add Channel',
  AddChannelSuccess = '[Channel] Add Channel Success',
  AddChannelFail = '[Channel] Add Channel Fail',
  UpdateChannel = '[Channel] Update Channel',
  UpdateChannelSuccess = '[Channel] Update Channel Success',
  UpdateChannelFail = '[Channel] Update Channel Fail',
  DeleteChannel = '[Channel] Delete Channel',
  DeleteChannelSuccess = '[Channel] Delete Channel Success',
  DeleteChannelFail = '[Channel] Delete Channel Fail',
}


export class GetChannels implements Action {
  readonly type = ChannelActionTypes.GetChannels;
  constructor(public payload: PagingFilterCriteria) { }
}

export class GetChannel implements Action {
  readonly type = ChannelActionTypes.GetChannel;
  constructor(public payload: string) { }
}

export class GetChannelsSuccess implements Action {
  readonly type = ChannelActionTypes.GetChannelsSuccess;
  constructor(public payload: PagedResult<ChannelModel>) { }
}

export class GetChannelSuccess implements Action {
  readonly type = ChannelActionTypes.GetChannelSuccess;
  constructor(public payload: ChannelModel) { }
}

export class GetChannelsFail implements Action {
  readonly type = ChannelActionTypes.GetChannelsFail;
  constructor(public payload: null) { }
}

export class AddChannel implements Action {
  readonly type = ChannelActionTypes.AddChannel;
  constructor(public payload: ChannelModel) { }
}

export class AddChannelSuccess implements Action {
  readonly type = ChannelActionTypes.AddChannelSuccess;
  constructor(public payload: ChannelModel) { }
}

export class AddChannelFail implements Action {
  readonly type = ChannelActionTypes.AddChannelFail;
  constructor(public payload: string) { }
}

export class UpdateChannel implements Action {
  readonly type = ChannelActionTypes.UpdateChannel;
  constructor(public payload: ChannelModel) { }
}

export class UpdateChannelSuccess implements Action {
  readonly type = ChannelActionTypes.UpdateChannelSuccess;
  constructor(public payload: ChannelModel) { }
}

export class UpdateChannelFail implements Action {
  readonly type = ChannelActionTypes.UpdateChannelFail;
  constructor(public payload: string) { }
}

export class DeleteChannel implements Action {
  readonly type = ChannelActionTypes.DeleteChannel;
  constructor(public payload: string) { }
}

export class DeleteChannelSuccess implements Action {
  readonly type = ChannelActionTypes.DeleteChannelSuccess;
  constructor(public payload: string) { }
}

export class DeleteChannelFail implements Action {
  readonly type = ChannelActionTypes.DeleteChannelFail;
  constructor(public payload: string) { }
}

export type ChannelActions =
  GetChannels
  | GetChannel
  | GetChannelsSuccess
  | GetChannelSuccess
  | GetChannelsFail
  | AddChannel
  | AddChannelSuccess
  | AddChannelFail
  | UpdateChannel
  | UpdateChannelSuccess
  | UpdateChannelFail
  | DeleteChannel
  | DeleteChannelSuccess
  | DeleteChannelFail;
