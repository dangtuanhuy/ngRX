import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as channelActions from '../state/channel.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ChannelService } from '../../../shared/services/channel.service';
import { ChannelModel } from '../channel.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class ChannelEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private channelService: ChannelService
  ) { }

  @Effect()
  getchannels$: Observable<Action> = this.action$
    .pipe(
      ofType(channelActions.ChannelActionTypes.GetChannels),
      mergeMap((action: channelActions.GetChannels) =>
        this.channelService
          .getAll(action.payload.page, action.payload.numberItemsPerPage)
          .pipe(map((channels: PagedResult<ChannelModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(channels));
            return new channelActions.GetChannelsSuccess(channels);
          })
          )
      )
    );

  @Effect()
  getchannel$: Observable<Action> = this.action$
    .pipe(
      ofType(channelActions.ChannelActionTypes.GetChannel),
      mergeMap((action: channelActions.GetChannel) =>
        this.channelService
          .getBy(action.payload)
          .pipe(map((channel: ChannelModel) => {
            return new channelActions.GetChannelSuccess(channel);
          })
          )
      )
    );

  @Effect()
  addchannel$: Observable<Action> = this.action$.pipe(
    ofType(channelActions.ChannelActionTypes.AddChannel),
    map((action: channelActions.AddChannel) => action.payload),
    mergeMap((channel: ChannelModel) =>
      this.channelService.add(channel).pipe(
        map(newchannel => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          this.store.dispatch(new channelActions.GetChannels(new PagingFilterCriteria(1, pageSize)));
          return new channelActions.AddChannelSuccess(newchannel);
        }),
        catchError(error => of(new channelActions.AddChannelFail(error)))
      )
    )
  );

  @Effect()
  updatechannel$: Observable<Action> = this.action$.pipe(
    ofType(channelActions.ChannelActionTypes.UpdateChannel),
    map((action: channelActions.UpdateChannel) => action.payload),
    mergeMap((channel: ChannelModel) =>
      this.channelService.update(channel).pipe(
        map(updatedchannel => {
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
          this.store.dispatch(new channelActions.GetChannels(new PagingFilterCriteria(1, pageSize)));
          return new channelActions.UpdateChannelSuccess(updatedchannel);
        }),
        catchError(error =>
          of(new channelActions.UpdateChannelFail(error))
        )
      )
    )
  );

  @Effect()
  deletechannel$: Observable<Action> = this.action$.pipe(
    ofType(channelActions.ChannelActionTypes.DeleteChannel),
    map((action: channelActions.DeleteChannel) => action.payload),
    mergeMap((id: string) =>
      this.channelService.remove(id).pipe(
        map(() => {
          this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
          this.store.dispatch(new channelActions.GetChannels(new PagingFilterCriteria(1, pageSize)));
          return new channelActions.DeleteChannelSuccess(id);
        }),
        catchError(error =>
          of(new channelActions.DeleteChannelFail(error))
        )
      )
    )
  );
}
