import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { BarCode } from '../models/barcode';
import { SchemaNames } from '../constants/schema-name.constant';
import { UnitOfWork } from './unit-of-work';

@Injectable({ providedIn: 'root' })
export class BarCodeRepository extends RepositoryBase<BarCode> {
    Map(obj: any): BarCode {
        const result: BarCode = {
            id: obj.id,
            code: obj.code,
            variantId: obj.variantId,
            createdDate: obj.createdDate,
            updatedDate: obj.updatedDate,
            isDelete: obj.isDelete ? obj.isDelete : false
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.barCode);
    }

    public addBarCodesToUnitOfWork(unitOfWork: UnitOfWork, barCodes: any[]) {
        barCodes.forEach(barCode => {
            const realmBarCode = new BarCode();
            realmBarCode.id = barCode.id;
            realmBarCode.variantId = barCode.variantId;
            realmBarCode.code = barCode.code;
            realmBarCode.createdDate = barCode.createdDate;
            realmBarCode.updatedDate = barCode.updatedDate;
            realmBarCode.isDelete = false;

            unitOfWork.add(SchemaNames.barCode, realmBarCode);
        });
    }
}
