import { Action } from '@ngrx/store';
import { LocationModel } from 'src/app/ims/locations/location.model';
import { DeviceModel } from '../device.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

export enum DeviceActionTypes {
    GetDevices = '[Device] Get Devices',
    GetDevicesSuccess = '[Device] Get Devices Success',
    GetDevicesFail = '[Device] Get Devices Fail',

    GetDevice = '[Device] Get Device',
    GetDeviceSuccess = '[Device] Get Device Success',
    GetDeviceFail = '[Device] Get Device Fail',

    GetStores = '[Device] Get Stores.',
    GetStoresSuccess = '[Device] Get Stores Success.',

    AddDevice = '[Device] Add Device',
    AddDeviceSuccess = '[Device] Add Device Success',
    AddDeviceFail = '[Device] Add Device Fail',

    DeleteDevice = '[Device] Delete Device',
    DeleteDeviceSuccess = '[Device] Delete Device Success',
    DeleteDeviceFail = '[Device] Delete Device Fail',
}

export class GetDevices implements Action {
    readonly type = DeviceActionTypes.GetDevices;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetDevicesSuccess implements Action {
    readonly type = DeviceActionTypes.GetDevicesSuccess;
    constructor(public payload: PagedResult<DeviceModel>) { }
}

export class GetDevicesFail implements Action {
    readonly type = DeviceActionTypes.GetDevicesFail;
    constructor(public payload: null) { }
}

export class GetDevice implements Action {
    readonly type = DeviceActionTypes.GetDevice;
    constructor(public payload: string) { }
}

export class GetDeviceSuccess implements Action {
    readonly type = DeviceActionTypes.GetDeviceSuccess;
    constructor(public payload: DeviceModel) { }
}

export class GetDeviceFail implements Action {
    readonly type = DeviceActionTypes.GetDeviceFail;
    constructor(public payload: null) { }
}

export class GetStores implements Action {
    readonly type = DeviceActionTypes.GetStores;
    constructor() { }
}

export class GetStoresSuccess implements Action {
    readonly type = DeviceActionTypes.GetStoresSuccess;
    constructor(public payload: LocationModel[]) { }
}

export class AddDevice implements Action {
    readonly type = DeviceActionTypes.AddDevice;
    constructor(public payload: DeviceModel) { }
}

export class AddDeviceSuccess implements Action {
    readonly type = DeviceActionTypes.AddDeviceSuccess;
    constructor(public payload: DeviceModel) { }
}

export class AddDeviceFail implements Action {
    readonly type = DeviceActionTypes.AddDeviceFail;
    constructor(public payload: string) { }
}

export class DeleteDevice implements Action {
    readonly type = DeviceActionTypes.DeleteDevice;
    constructor(public payload: string) { }
}

export class DeleteDeviceSuccess implements Action {
    readonly type = DeviceActionTypes.DeleteDeviceSuccess;
    constructor(public payload: string) { }
}

export class DeleteDeviceFail implements Action {
    readonly type = DeviceActionTypes.DeleteDeviceFail;
    constructor(public payload: string) { }
}

export type DeviceActions = GetStores
    | GetStoresSuccess
    | AddDevice
    | AddDeviceSuccess
    | AddDeviceFail
    | GetDevices
    | GetDevicesSuccess
    | GetDevicesFail
    | GetDevice
    | GetDeviceFail
    | GetDeviceSuccess
    | DeleteDevice
    | DeleteDeviceSuccess
    | DeleteDeviceFail;
