import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { TagInputModule } from 'ngx-chips';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxEditorModule } from 'ngx-editor';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { FieldEffects } from './state/field.effect';
import { AddFieldComponent } from './add-field/add-field.component';
import { UpdateFieldComponent } from './update-field/update-field.component';
import { DeleteFieldComponent } from './delete-field/delete-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FieldSharedModule } from './field.module.shared';
import {
  reducer as fieldReducer,
  key as fieldKey,
  FieldState
} from './state/field.reducer';
// tslint:disable-next-line:max-line-length
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const fieldRoutes: Routes = [{ path: '', component: FieldComponent }];

export interface IFieldState {
  fields_reducer: FieldState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IFieldState> = {
  fields_reducer: fieldReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    NgxEditorModule,
    NgxDatatableModule,
    RouterModule.forChild(fieldRoutes),
    EffectsModule.forFeature([FieldEffects]),
    StoreModule.forFeature(`fields`, reducers),
    NgMultiSelectDropDownModule.forRoot(),
    CommonModule,
    SharedModule,
    NgSelectModule,
    FieldSharedModule
  ],
  declarations: [
    FieldComponent,
    AddFieldComponent,
    UpdateFieldComponent,
    DeleteFieldComponent
  ],
  entryComponents: [
    AddFieldComponent,
    UpdateFieldComponent,
    DeleteFieldComponent
  ]
})
export class FieldModule {}
