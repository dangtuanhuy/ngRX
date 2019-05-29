import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { CategoryComponent } from './category.component';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './state/category.effect';
import { AddCategoryComponent } from './add-category/add-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import {
  reducer as categoryReducer,
  key as categoryKey,
  CategoryState
} from './state/category.reducer';
import { reducer as listViewManagementReducer } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const categoryRoutes: Routes = [{ path: '', component: CategoryComponent }];

export interface ICategoryState {
  categories_reducer: CategoryState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<ICategoryState> = {
  categories_reducer: categoryReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(categoryRoutes),
    StoreModule.forFeature(`categories`, reducers),
    EffectsModule.forFeature([CategoryEffects]),
    ReactiveFormsModule
  ],
  declarations: [
    CategoryComponent,
    AddCategoryComponent,
    UpdateCategoryComponent,
    DeleteCategoryComponent
  ],
  entryComponents: [
    AddCategoryComponent,
    UpdateCategoryComponent,
    DeleteCategoryComponent
  ]
})
export class CategoryModule {}
