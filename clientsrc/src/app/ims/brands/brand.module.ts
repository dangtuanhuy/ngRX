import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandComponent } from './brand.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { reducer as assortmentReducer, key as assortmentKey, BrandState } from './state/brand.reducer';
import { reducer as listViewManagementReducer,
         key as listViewManagementKey, ListViewManagementState
       } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { BrandsEffects } from './state/brand.effect';
import { UpdateBrandComponent } from './update-brand/update-brand.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { DeleteBrandComponent } from './delete-brand/delete-brand.component';
import { ImportBrandComponent } from './import-brand/import-brand.component';

const brandRoutes: Routes = [
  { path: '', component: BrandComponent },
];

export interface IBrandState {
  brands_reducer: BrandState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IBrandState> = {
  brands_reducer: assortmentReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(brandRoutes),
    StoreModule.forFeature(`brands`, reducers),
    EffectsModule.forFeature([BrandsEffects]),
    ReactiveFormsModule
  ],
  declarations: [
    BrandComponent,
    UpdateBrandComponent,
    AddBrandComponent,
    DeleteBrandComponent,
    ImportBrandComponent
  ],
  entryComponents: [
    UpdateBrandComponent,
    AddBrandComponent,
    DeleteBrandComponent,
    ImportBrandComponent
  ]
})
export class BrandModule { }
