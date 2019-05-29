import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../../../shared/state/app.state';
import * as fromFields from './field-base.reducer';

export interface State extends fromRoot.State {
    fields: fromFields.FieldListState;
}

const getFieldFeatureState = createFeatureSelector<fromFields.FieldListState>('field');


export const getFields = createSelector(
    getFieldFeatureState,
    state => state.fields
);
