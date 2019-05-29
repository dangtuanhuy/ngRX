import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AssignmentService } from 'src/app/shared/services/assignment.service';
import { mergeMap, map } from 'rxjs/operators';
import * as channelStoreAssignmentActions from './channel-store-assignment.action';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import { LocationService } from 'src/app/shared/services/location.service';
import { LocationType, LocationModel } from '../../locations/location.model';
import { AssignmentModel } from 'src/app/shared/base-model/assignment.model';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Injectable()
export class ChannelStoreAssignmentEffects {
    constructor(
        private action$: Actions,
        private channelService: ChannelService,
        private locationService: LocationService
    ) { }

    @Effect()
    searchStores$ = this.action$
        .pipe(
            ofType(channelStoreAssignmentActions.ChannelStoreAssignmentActionTypes.SearchStores),
            mergeMap((action: channelStoreAssignmentActions.SearchStores) =>
                this.locationService
                    .searchLocations(LocationType.store, action.payload)
                    .pipe(map((locations: LocationModel[]) => {
                        const assignments = locations.map(location => new AssignmentModel({
                            id: location.id,
                            name: location.name,
                            type: null
                        }));
                        return new assignmentActions.SearchAssignmentAction(assignments);
                    })
                    )
            )
        );

    @Effect()
    getChannelStoreAssignemts$ = this.action$
        .pipe(
            ofType(channelStoreAssignmentActions.ChannelStoreAssignmentActionTypes.GetChannelStoreAssignments),
            mergeMap((action: channelStoreAssignmentActions.GetChannelStoreAssignments) =>
                this.channelService
                    .getStoresBy(action.payload)
                    .pipe(map((channelStoreAssignments: any) => {
                        return new assignmentActions.GetSelectAssignmentSucessAction(channelStoreAssignments);
                    })
                    )
            )
        );
}
