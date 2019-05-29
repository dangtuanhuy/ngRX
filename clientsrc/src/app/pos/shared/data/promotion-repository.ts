import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { Promotion } from '../models/promotion';
import { DiscountType } from '../enums/discount-type.enum';
import { PromotionType } from '../enums/promotion-type.enum';
import { SchemaNames } from '../constants/schema-name.constant';
import { AppContextManager } from '../app-context-manager';
import { PromotionStatus } from '../enums/promotion-status.enum';

@Injectable({ providedIn: 'root' })
export class PromotionRepository extends RepositoryBase<Promotion> {
    Map(obj: any) {
        const result: Promotion = {
            id: obj.id,
            promotionDetailId: obj.promotionDetailId,
            name: obj.name,
            description: obj.description,
            promotionTypeId: obj.promotionTypeId ? obj.promotionTypeId : PromotionType.Default,
            value: obj.value,
            promotionStatus: obj.promotionStatus ? obj.promotionStatus : PromotionStatus.Default,
            discountTypeId: obj.discountTypeId ? obj.discountTypeId : DiscountType.Default,
            isUseCouponCodes: obj.isUseCouponCodes ? obj.isUseCouponCodes : false,
            isUseConditions: obj.isUseConditions ? obj.isUseConditions : false,
            fromDate: obj.fromDate,
            toDate: obj.toDate
        };
        return result;
    }

    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.promotion);
    }

    getPromotionByPromotionType(promotionType: PromotionType): Promotion {
        const context = this.appContextManager.GetLatestDbContext();
        let result = null;
        const promotions = context.objects(this.tableName).filtered(`promotionTypeId = "${promotionType}"`);

        if (!promotions.length) {
            context.close();
            return result;
        }

        result = this.Map(promotions[0]);
        context.close();
        return result;
    }
}
