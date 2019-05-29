import { RepositoryBase } from './repository-base';
import { SchemaNames } from '../constants/schema-name.constant';
import { AppContextManager } from '../app-context-manager';
import { SalesAchieved } from '../models/sales-achieved';
import { Injectable } from '@angular/core';
import { Guid } from 'src/app/shared/utils/guid.util';
import { SaleTarget } from '../models/sale-target';

@Injectable({ providedIn: 'root' })
export class SalesAchievedRepository extends RepositoryBase<SalesAchieved> {
    Map(obj: any): SalesAchieved {
        const result: SalesAchieved = {
            id: obj.id,
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            value: obj.value,
            saleTargetId: obj.saleTargetId
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.salesAchieved);
    }

    getOrCreateBySaleTarget(saleTarget: SaleTarget): SalesAchieved {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName).filtered('saleTargetId = $0', saleTarget.id);

        let result = null;
        if (data.length) {
            result = this.Map(data[0]);
        } else {
            const newSalesAchieved = new SalesAchieved();
            newSalesAchieved.id = Guid.newGuid();
            newSalesAchieved.fromDate = saleTarget.fromDate;
            newSalesAchieved.toDate = saleTarget.toDate;
            newSalesAchieved.value = 0;
            newSalesAchieved.saleTargetId = saleTarget.id;

            context.write(() => {
                const salesAchievedRealm = context.create(this.tableName, newSalesAchieved);
                if (salesAchievedRealm) {
                    result = this.Map(salesAchievedRealm);
                }
            });
        }

        context.close();
        return result;
    }

    updateSalesAchieved(entity: SalesAchieved) {
        const context = this.appContextManager.GetLatestDbContext();
        context.write(() => {
            context.create(this.tableName, entity, true);
        });
        context.close();

        return entity;
    }
}
