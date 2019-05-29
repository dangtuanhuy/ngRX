import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LocationService } from 'src/app/shared/services/location.service';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as deviceActions from '../state/device.action';
import { LocationModel, LocationType } from 'src/app/ims/locations/location.model';
import { DeviceModel } from '../device.model';
import { DeviceService } from 'src/app/shared/services/device.service';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';


const pageSize = 10;
@Injectable()
export class DeviceEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private locationService: LocationService,
        private deviceService: DeviceService
    ) { }

    @Effect()
    getDevices$: Observable<Action> = this.action$
        .pipe(
            ofType(deviceActions.DeviceActionTypes.GetDevices),
            mergeMap((action: deviceActions.GetDevices) =>
                this.deviceService
                    .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
                    .pipe(map((devices: PagedResult<DeviceModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(devices));
                        return new deviceActions.GetDevicesSuccess(devices);
                    })
                    )
            )
        );

    @Effect()
    getDevice$: Observable<Action> = this.action$.pipe(
        ofType(deviceActions.DeviceActionTypes.GetDevice),
        mergeMap((action: deviceActions.GetDevice) =>
            this.deviceService
                .getBy(action.payload)
                .pipe(
                    map(
                        (field: DeviceModel) => {
                            return new deviceActions.GetDeviceSuccess(field);
                        }
                    )
                )
        )
    );

    @Effect()
    getStores$: Observable<Action> = this.action$.pipe(
        ofType(deviceActions.DeviceActionTypes.GetStores),
        mergeMap((action: deviceActions.GetStores) =>
            this.locationService
                .retailSearchStores('')
                .pipe(
                    map(
                        (stores: LocationModel[]) =>
                            new deviceActions.GetStoresSuccess(stores)
                    )
                )
        )
    );

    @Effect()
    addDevice$: Observable<Action> = this.action$.pipe(
        ofType(deviceActions.DeviceActionTypes.AddDevice),
        map((action: deviceActions.AddDevice) => action.payload),
        mergeMap((device: DeviceModel) =>
            this.deviceService.add(device).pipe(
                map(newDevice => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new deviceActions.GetDevices(new PagingFilterCriteria(1, pageSize), ''));
                    return new deviceActions.AddDeviceSuccess(newDevice);
                }),
                catchError(error => of(new deviceActions.AddDeviceFail(error)))
            )
        )
    );

    @Effect()
    deleteDevice$: Observable<Action> = this.action$.pipe(
        ofType(deviceActions.DeviceActionTypes.DeleteDevice),
        map((action: deviceActions.DeleteDevice) => action.payload),
        mergeMap((id: string) =>
            this.deviceService.remove(id).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new deviceActions.GetDevices(new PagingFilterCriteria(1, pageSize), ''));
                    return new deviceActions.DeleteDeviceSuccess(id);
                }),
                catchError(error =>
                    of(new deviceActions.DeleteDeviceFail(error))
                )
            )
        )
    );
}
