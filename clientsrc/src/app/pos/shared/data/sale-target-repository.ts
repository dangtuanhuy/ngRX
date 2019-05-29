import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { SaleTarget } from '../models/sale-target';
import { UnitOfWork } from './unit-of-work';

@Injectable({ providedIn: 'root' })
export class SaleTargetRepository extends RepositoryBase<SaleTarget> {
    Map(obj: any): SaleTarget {
        const result: SaleTarget = {
            id: obj.id,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            target: obj.target,
            isDelete: obj.isDelete ? obj.isDelete : false
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.saleTarget);
    }

    getCurrentSaleTarget(): SaleTarget {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName)
            .filtered('isDelete = false AND fromDate < $0 AND toDate > $0', new Date())
            .sorted('fromDate');

        let result = null;
        if (!data.length) {
            context.close();
            return result;
        }
        result = this.Map(data[0]);

        context.close();
        return result;
    }

    public addSaleTargetsToUnitOfWork(unitOfWork: UnitOfWork, saleTargets: any[]) {
        saleTargets.forEach(saleTarget => {
            const realmTarget = new SaleTarget();
            realmTarget.id = saleTarget.id;
            realmTarget.target = saleTarget.target;
            realmTarget.fromDate = saleTarget.fromDate;
            realmTarget.toDate = saleTarget.toDate;
            realmTarget.isDelete = saleTarget.isDelete;

            unitOfWork.add(SchemaNames.saleTarget, realmTarget);
        });
    }
}
