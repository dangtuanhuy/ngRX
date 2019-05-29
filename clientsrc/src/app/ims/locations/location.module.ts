import { NgModule } from '@angular/core';
import { LocationService } from 'src/app/shared/services/location.service';
import { LocationComponent } from './location.component';
import { Routes, RouterModule } from '@angular/router';
import { LocationEffects } from './state/location.effect';
import { EffectsModule } from '@ngrx/effects';
import {
  reducer as locationReducer,
  key as locationKey,
  LocationState
} from './state/location.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddLocationComponent } from './add-location/add-location.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { DeleteLocationComponent } from './delete-location/delete-location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const locationRoutes: Routes = [{ path: '', component: LocationComponent }];

export interface ILocationState {
  locations_reducer: LocationState;
  listviewmanagement_reducer: ListViewManagementState;
}
export const reducers: ActionReducerMap<ILocationState> = {
  locations_reducer: locationReducer,
  listviewmanagement_reducer: listViewManagementReducer
};
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(locationRoutes),
    StoreModule.forFeature(`locations`, reducers),
    EffectsModule.forFeature([LocationEffects]),
    ReactiveFormsModule
  ],
  declarations: [
    LocationComponent,
    AddLocationComponent,
    UpdateLocationComponent,
    DeleteLocationComponent
  ],
  providers: [LocationService, LocationEffects],
  entryComponents: [
    AddLocationComponent,
    UpdateLocationComponent,
    DeleteLocationComponent
  ]
})
export class LocationModule {}
