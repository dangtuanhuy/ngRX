import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ListViewManagementState, key } from './list-view-management.reducer';
import { environment } from 'src/environments/environment';

let featureName = '';
switch (window.location.pathname) {
  case '/products':
    featureName = 'products';
    break;
  case '/assortments':
    featureName = 'assortments';
    break;
  case '/categories':
    featureName = 'categories';
    break;
  case '/fields':
    featureName = 'fields';
    break;
  case '/field-templates':
    featureName = 'fieldtemplates';
    break;
  case '/locations':
    featureName = 'locations';
    break;
  case '/brands':
    featureName = 'brands';
    break;
  case '/channels':
    featureName = 'channels';
    break;
  case '/activities':
    featureName = 'activities';
    break;
  case '/goods-inward':
    featureName = 'goods-inward';
    break;
  case '/reasons':
    featureName = 'reasons';
    break;
  case '/transfer-outs':
    featureName = 'transfer-outs';
    break;
  case '/transfer-ins':
    featureName = 'transfer-ins';
    break;
  case '/stock-allocation':
    featureName = 'stock-allocation';
    break;
  case '/vendors':
    featureName = 'vendors';
    break;
  case '/stock-request':
    featureName = 'stockrequests';
    break;
  case '/purchase-orders':
    featureName = 'purchase-orders';
    break;
  case '/return-orders':
    featureName = 'purchase-orders';
    break;
  case '/approvals':
    featureName = 'approvals';
    break;
  case '/devices':
    featureName = 'devices';
    break;
  case '/stock-initial':
    featureName = 'stock-initial';
    break;
  case '/promotions':
    featureName = 'promotions';
    break;
  case '/goods-return':
    featureName = 'goods-return';
    break;
  case '/retail':
    featureName = 'stores';
    break;
  case '/dashboard':
    featureName = 'dashboard';
    break;
  case '/sale-target':
    featureName = 'sale-target';
    break;
  case '/report':
    featureName = 'sale-target';
    break;
  default:
    if (window.location.origin === environment.app.ims.url) {
      featureName = 'products';
    } else if (window.location.origin === environment.app.retail.url) {
      featureName = 'stores';
    } else if (window.location.origin === environment.app.promotion.url) {
      featureName = 'promotions';
    } else if (window.location.origin === environment.app.purchaseOrder.url) {
      featureName = 'vendors';
    } else {
      featureName = 'vendors';
    }
    break;
}

const getListViewManagementFeature = createFeatureSelector<
  ListViewManagementState
>(`${featureName}`);

export const getFormState = createSelector(
  getListViewManagementFeature,
  state => state[key].formState
);

export const getTotalItems = createSelector(
  getListViewManagementFeature,
  state => state[key].totalItems
);

export const getSelectedPage = createSelector(
  getListViewManagementFeature,
  state => state[key].selectedPage
);

export const changeFilter = createSelector(
  getListViewManagementFeature,
  state => state[key].filter
);
