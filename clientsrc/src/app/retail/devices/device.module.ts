import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { DeviceComponent } from './device.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import {
    reducer as listViewManagementReducer,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import {
    reducer as deviceReducer,
    DeviceState
} from './state/device.reducer';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { DeviceEffects } from './state/device.effect';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthorizeDeviceComponent } from './authorize-device/authorize-device.component';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';

const routes: Routes = [
    { path: '', component: DeviceComponent },
    { path: 'authorize-device', component: AuthorizeDeviceComponent}];

export interface IDeviceState {
    devices_reducer: DeviceState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IDeviceState> = {
    devices_reducer: deviceReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature(`devices`, reducers),
        EffectsModule.forFeature([DeviceEffects]),
        ReactiveFormsModule,
        NgSelectModule
    ],
    declarations: [
        DeviceComponent,
        AddDeviceComponent,
        AuthorizeDeviceComponent,
        DeleteDeviceComponent
    ],
    entryComponents: [
        AddDeviceComponent,
        DeleteDeviceComponent
    ]
})
export class DeviceModule { }
