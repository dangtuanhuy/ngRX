import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { VendorComponent } from './vendor.component';
import {
  reducer as vendorReducer,
  key as vendorKey,
  VendorState
} from './state/vendor.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { EffectsModule } from '@ngrx/effects';
import { VendorEffects } from './state/vendor.effect';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { DeleteVendorComponent } from './delete-vendor/delete-vendor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UpdateVendorComponent } from './update-vendor/update-vendor.component';
import { NgSelectModule } from '@ng-select/ng-select';


const vendorRoutes: Routes = [{ path: '', component: VendorComponent }];

export interface IVendorState {
  vendors_reducer: VendorState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IVendorState> = {
  vendors_reducer: vendorReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(vendorRoutes),
    StoreModule.forFeature(`vendors`, reducers),
    EffectsModule.forFeature([VendorEffects]),
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  declarations: [
    VendorComponent,
    AddVendorComponent,
    DeleteVendorComponent,
    UpdateVendorComponent
  ],
  entryComponents: [
    AddVendorComponent,
    DeleteVendorComponent,
    UpdateVendorComponent
  ]
})
export class VendorModule {}
