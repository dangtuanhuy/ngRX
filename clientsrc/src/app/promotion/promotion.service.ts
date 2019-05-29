import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceBase } from '../shared/services/service-base';
import { LocationModel, TypeModel, PromotionModel, PromotionStatus, CouponCodeModel } from './promotion.model';
import { PagingFilterCriteria } from '../shared/base-model/paging-filter-criteria';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';

@Injectable({ providedIn: 'root' })
export class PromotionService extends ServiceBase {

  getAllLocationWithoutPaging(): Observable<Array<LocationModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/locations/all`);
  }

  getLocationById(id: string): Observable<LocationModel> {
    return this.get(`${environment.app.promotion.apiUrl}/api/locations/${id}`);
  }

  getAllPromotionTypes(): Observable<Array<TypeModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/promotions/promotionTypes`);
  }

  getAllDiscountTypes(): Observable<Array<TypeModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/promotions/discountTypes`);
  }

  getPromotions(page: number = 1, numberItemsPerPage: number = 10) {
    return this.page(`${environment.app.promotion.apiUrl}/api/promotions`, new PagingFilterCriteria(page, numberItemsPerPage));
  }

  getBy(id: string): Observable<PromotionModel> {
    return this.get(`${environment.app.promotion.apiUrl}/api/promotions/${id}`);
}

  getAllConditionTypes(): Observable<Array<TypeModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/promotions/conditionTypes`);
  }

  getAllOperatorTypes(): Observable<Array<TypeModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/promotions/operatorTypes`);
  }

  add(promotion: PromotionModel): Observable<any> {
    return this.post(`${environment.app.promotion.apiUrl}/api/promotions`, promotion);
  }

  update(promotion: PromotionModel): Observable<any> {
    return this.put(`${environment.app.promotion.apiUrl}/api/promotions/${promotion.id}`, promotion);
  }

  updateStatus(id: string, value: PromotionStatus) {
    return this.put(`${environment.app.promotion.apiUrl}/api/promotions/${id}/status/update/${value}`);
  }

  getAllCouponCodes(): Observable<Array<CouponCodeModel>> {
    return this.list(`${environment.app.promotion.apiUrl}/api/promotions/coupon-codes`);
  }
}
