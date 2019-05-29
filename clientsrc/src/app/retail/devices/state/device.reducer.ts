import * as fromRoot from 'src/app/shared/state/app.state';
import { DeviceModel } from '../device.model';
import { DeviceActions, DeviceActionTypes } from './device.action';
import { LocationModel } from 'src/app/ims/locations/location.model';

export interface State extends fromRoot.State {
    devices: DeviceState;
}

export interface DeviceState {
    devices: DeviceModel[];
    device: DeviceModel;
    stores: LocationModel[];
}

const initialState: DeviceState = {
    devices: [],
    device: null,
    stores: []
};

export const key = 'devices_reducer';

export function reducer(state = initialState, action: DeviceActions): DeviceState {
    switch (action.type) {
        case DeviceActionTypes.GetDevicesSuccess:
            return {
                ...state,
                devices: action.payload.data
            };
        case DeviceActionTypes.GetDeviceSuccess:
            return {
                ...state,
                device: action.payload
            };
        case DeviceActionTypes.AddDeviceSuccess:
            return {
                ...state,
                devices: [...state.devices, action.payload]
            };
        case DeviceActionTypes.GetStoresSuccess:
            return {
                ...state,
                stores: action.payload
            };
        case DeviceActionTypes.DeleteDeviceSuccess:
            return {
                ...state,
                devices: state.devices.filter(
                    device => device.id !== action.payload
                )
            };
        case DeviceActionTypes.DeleteDeviceFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
