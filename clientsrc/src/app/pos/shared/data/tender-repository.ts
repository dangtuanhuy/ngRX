import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { Tender } from '../models/tender';
import { TenderType } from '../enums/tender-type.enum';

@Injectable({ providedIn: 'root' })
export class TenderRepository extends RepositoryBase<Tender> {
    Map(obj: any): Tender {
        const result: Tender = {
            id: obj.id,
            amount: obj.amount,
            tenderType: obj.tenderType ? obj.tenderType : TenderType.default,
            createdDate: obj.createdDate,
            userId: obj.userId
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.tender);
    }

    addTender(tender: Tender): Tender {
        const context = this.appContextManager.GetLatestDbContext();
        let result = null;
        context.write(() => {
            const tenderRealm = context.create(this.tableName, tender);
            if (tenderRealm) {
                result = this.Map(tenderRealm);
            }
        });

        context.close();
        return result;
    }

    getTheLastTenderToday(): Tender {
        const context = this.appContextManager.GetLatestDbContext();
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const data = context.objects(this.tableName)
                            .filtered('createdDate >= $0 && createdDate < $1', startDate, now)
                            .sorted('createdDate', true);
        let result = null;
        if (!data.length) {
            context.close();
            return result;
        }

        result = this.Map(data[0]);
        context.close();
        return result;
    }
}
