import { SyncedDataFlag } from '../../../enums/sync-data.enum';

export class SyncDataFlowManagerModel {
    key: SyncedDataFlag;
    status: SyncDataFlowManagerStatus;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

export enum SyncDataFlowManagerStatus {
    Default = 0,
    Inprogress = 1,
    Success = 2
}
