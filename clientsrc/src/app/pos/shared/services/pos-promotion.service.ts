import { Injectable } from '@angular/core';
import { PromotionRepository } from '../data/promotion-repository';
import { Observable } from 'rxjs';
import { PromotionType } from '../enums/promotion-type.enum';

@Injectable({ providedIn: 'root' })
export class PosPromotionService {

    constructor(
        private promotionRepository: PromotionRepository
    ) { }

    getPromotionByPromotionType(promotionType: PromotionType): Observable<any> {
        return Observable.create(observer => {
            const promotion = this.promotionRepository.getPromotionByPromotionType(promotionType);

            observer.next(promotion);
            observer.complete();
        });
    }
}
