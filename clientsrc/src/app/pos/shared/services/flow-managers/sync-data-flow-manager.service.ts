import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SyncDataFlowManagerModel } from './flow-manager-model/sync-data-flow-manager.model';

@Injectable({ providedIn: 'root' })
export class SyncDataFlowManagerService {
    syncDataFlagSubject = new Subject<SyncDataFlowManagerModel>();

    constructor() {

    }

    triggerSyncDataFlag(syncDataFlagModel: SyncDataFlowManagerModel) {
        if (syncDataFlagModel) {
            this.syncDataFlagSubject.next(syncDataFlagModel);
        }
    }
}


