import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceState, key } from './device.reducer';
import { key as listViewManagementKey } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import * as fromRoot from '../../../shared/state/app.state';
import * as fromDevice from './device.reducer';

export interface State extends fromRoot.State {
  products: fromDevice.DeviceState;
}

const getDeviceFeatureState = createFeatureSelector<DeviceState>(`devices`);

export const getDevices = createSelector(
  getDeviceFeatureState,
  state => state[key].devices
);

export const getDevice = createSelector(
  getDeviceFeatureState,
  state => state[key].device
);

export const getSelectedItem = createSelector(
  getDeviceFeatureState,
  state => state[listViewManagementKey].selectedItem
);

export const getStores = createSelector(
  getDeviceFeatureState,
  state => state[fromDevice.key].stores
);

