import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { LocationEntity } from '../models/location';

@Injectable({ providedIn: 'root' })
export class LocationRepository extends RepositoryBase<LocationEntity> {
    Map(obj: any): LocationEntity {
        const result: LocationEntity = {
            id: obj.id,
            name: obj.name ? obj.name : '',
            address: obj.address ? obj.address : ''
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.location);
    }
}
