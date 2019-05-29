import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { PendingSaleItem } from '../models/pending-sale-item';

@Injectable({ providedIn: 'root' })
export class PendingSaleItemRepository extends RepositoryBase<PendingSaleItem> {
    Map(obj: any) {
        const result: PendingSaleItem = {
            id: obj.id,
            pendingSaleId: obj.pendingSaleId,
            variantId: obj.variantId,
            priceId: obj.priceId,
            stockTypeId: obj.stockTypeId,
            quantity: Number(obj.quantity),
            amount: obj.amount
        };
        return result;
    }

    constructor(
        protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.pendingSaleItem);
    }

    getByPendingSale(pendingSaleId: string): PendingSaleItem[] {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const data = context.objects(this.tableName).filter(x => x.pendingSaleId === pendingSaleId);
        if (!data.length) {
            context.close();
            return result;
        }
        data.forEach(element => {
            result.push(this.Map(element));
        });
        context.close();
        return result;
    }
}
