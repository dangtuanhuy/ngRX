import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../../shared/state/app.state';
import * as fromProduct from './product.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';

export interface State extends fromRoot.State {
  products: fromProduct.ProductState;
}

const getProductFeatureState = createFeatureSelector<fromProduct.ProductState>(
  `products`
);

export const getProducts = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].products
);

export const getProduct = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].product
);

export const getSelectedItem = createSelector(
  getProductFeatureState,
  state => state[listViewManagementKey].selectedItem
);

export const getFieldTemplates = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].fieldTemplates
);

export const getVariants = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].variants
);

export const getFieldTemplatesModeEdit = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].fieldTemplate
);

export const getCategories = createSelector(
  getProductFeatureState,
  state => state[fromProduct.key].categories
);
