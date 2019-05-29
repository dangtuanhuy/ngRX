import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FieldTemplateState, key } from './field-template.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

const getFieldTemplateFeatureState = createFeatureSelector<FieldTemplateState>(`fieldtemplates`);

export const getFieldTemplates = createSelector(
    getFieldTemplateFeatureState,
    state => state[key].fieldTemplates
);

export const getSelectedItem = createSelector(
    getFieldTemplateFeatureState,
    state => state[listViewManagementKey].selectedItem
);

export const getFields = createSelector(
    getFieldTemplateFeatureState,
    state => state[key].fields
);

export const getFieldTemplateTypes = createSelector(
    getFieldTemplateFeatureState,
    state => state[key].fieldTemplateTypes
);
