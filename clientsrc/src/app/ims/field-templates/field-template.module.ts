import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FieldSharedModule } from '../fields/field.module.shared';
import { FieldTemplateComponent } from './field-template.component';
import { FieldTemplateEffects } from './state/field-template.effect';
import { AddFieldTemplateComponent } from './add-field-template/add-field-template.component';
import { UpdateFieldTemplateComponent } from './update-field-template/update-field-template.component';
import { DeleteFieldTemplateComponent } from './delete-field-template/delete-field-template.component';
import {
  reducer as fieldTemplateReducer,
  key as fieldTemplateKey,
  FieldTemplateState
} from './state/field-template.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const homeRoutes: Routes = [
  { path: '', component: FieldTemplateComponent },
  { path: 'field-templates', component: FieldTemplateComponent }
];

export interface IFieldTemplateState {
  fieldtemplates_reducer: FieldTemplateState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IFieldTemplateState> = {
  fieldtemplates_reducer: fieldTemplateReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FieldSharedModule,
    RouterModule.forChild(homeRoutes),
    StoreModule.forFeature(`fieldtemplates`, reducers),
    EffectsModule.forFeature([FieldTemplateEffects]),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [
    FieldTemplateComponent,
    AddFieldTemplateComponent,
    UpdateFieldTemplateComponent,
    DeleteFieldTemplateComponent
  ],
  entryComponents: [
    AddFieldTemplateComponent,
    UpdateFieldTemplateComponent,
    DeleteFieldTemplateComponent
  ]
})
export class FieldTemplateModule {}
