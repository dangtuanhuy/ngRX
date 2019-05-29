import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { CashingUp } from '../models/cashing-up';
import { CashingUpType } from '../enums/cashing-up-type.enum';
import { SchemaNames } from '../constants/schema-name.constant';

@Injectable({ providedIn: 'root' })
export class CashingUpRepository extends RepositoryBase<CashingUp> {
    Map(obj: any): CashingUp {
        const result: CashingUp = {
            id: obj.id,
            amount: obj.amount,
            cashingUpType: obj.cashingUpType ? obj.cashingUpType : CashingUpType.default,
            createdDate: obj.createdDate,
            userId: obj.userId
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.cashingUp);
    }

    addCashingUp(cashingUp: CashingUp): CashingUp {
        const context = this.appContextManager.GetLatestDbContext();
        let result = null;
        context.write(() => {
            const cashingUpRealm = context.create(this.tableName, cashingUp);
            if (cashingUpRealm) {
                result = this.Map(cashingUpRealm);
            }
        });

        context.close();
        return result;
    }

    getTheLastCashingUp(): CashingUp {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName).sorted('createdDate', true);
        let result = null;
        if (!data.length) {
            context.close();
            return result;
        }

        result = this.Map(data[0]);
        context.close();
        return result;
    }

    getTheLastOpenday(): CashingUp {
        const context = this.appContextManager.GetLatestDbContext();
        const data = context.objects(this.tableName)
            .filtered('cashingUpType = $0', CashingUpType[CashingUpType.openDay])
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
