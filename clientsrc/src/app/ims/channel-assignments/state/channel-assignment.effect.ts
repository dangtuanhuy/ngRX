import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AssignmentService } from 'src/app/shared/services/assignment.service';
import * as channelassignmentActions from './channel-assignment.action';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class ChannelAssignmentEffects {
    constructor(
        private action$: Actions,
        private assignmentService: AssignmentService
    ) { }

    @Effect()
    getChannelsByName$ = this.action$
        .pipe(
            ofType(channelassignmentActions.ChannelActionTypes.GetChannelAssignmentByName),
            mergeMap((action: channelassignmentActions.GetChannelAssignmentByName) =>
                this.assignmentService
                    .getChannelAssignmentByName(action.payload)
                    .pipe(map((channels: any) => {
                        return new assignmentActions.SearchAssignmentAction(channels);
                    })
                    )
            )
        );

    @Effect()
    getAllChannels$ = this.action$
        .pipe(
            ofType(channelassignmentActions.ChannelActionTypes.GetAllChannelAssignment),
            mergeMap((action: channelassignmentActions.GetAllChannelAssignment) =>
                this.assignmentService
                    .getAllChannelAssignemt()
                    .pipe(map((channels: any) => {
                        return new assignmentActions.SearchAssignmentAction(channels);
                    })
                    )
            )
        );

    @Effect()
    getChannelsSelected$ = this.action$
        .pipe(
            ofType(channelassignmentActions.ChannelActionTypes.GetChannelAssignmentSelected),
            mergeMap((action: channelassignmentActions.GetChannelAssignmentSelected) =>
                this.assignmentService
                    .getChannelAssignemtSelected(action.payload)
                    .pipe(map((channels: any) => {
                        return new assignmentActions.GetSelectAssignmentSucessAction(channels);
                    })
                    )
            )
        );
}
