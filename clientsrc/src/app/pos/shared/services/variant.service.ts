import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VariantRepository } from '../data/variant-repository';
import { ProductRepository } from '../data/product-repository';
import {
    VariantByStockTypeAndVariantIdAndPriceRequest,
    VariantByStockTypeAndVariantIdAndPriceResponse
} from '../requests/realms/variant.request';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { VariantPagingModel } from '../view-models/variant-paging.model';
import { AppSettingRepository } from '../data/appSetting-repository';
import { SystemAppSettingKeys } from '../constants/appSetting-key.constant';
import { Variant } from '../models/variant';

@Injectable({ providedIn: 'root' })
export class VariantService {

    constructor(
        private variantRepository: VariantRepository,
        private productRepository: ProductRepository,
        private appSettingRepository: AppSettingRepository
    ) { }

    searchVariants(queryText: Observable<string>) {
        const storeIdAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.storeId);
        let storeId = '';
        if (storeIdAppSetting) {
            storeId = storeIdAppSetting.value;
        }

        return queryText.debounceTime(500).distinctUntilChanged().switchMap(term =>
            Observable.create(observer => {
                let result = null;
                if (term) {
                    result = this.variantRepository.search(term, storeId);
                }

                observer.next(result);
                observer.complete();
            })
        );
    }

    getByProductPaging(productIds: string[], pageIndex: number, pageSize: number): Observable<VariantPagingModel> {
        return Observable.create(observable => {
            const variants = this.variantRepository.getByProductPaging(productIds, pageIndex, pageSize);

            observable.next(variants);
            observable.complete();
        });
    }

    getByCategories(categoryIds: string[], locationId: string = ''): Observable<any> {
        return Observable.create(observable => {
            const productIds = this.productRepository.getProductIdsByCategories(categoryIds);
            const variants = this.variantRepository.getByProducts(productIds, locationId);

            observable.next(variants);
            observable.complete();
        });
    }

    getByCategoriesPaging(categoryIds: string[], locationId: string = '', pageIndex: number, pageSize: number)
        : Observable<VariantPagingModel> {
        return Observable.create(observable => {
            const productIds = this.productRepository.getProductIdsByCategories(categoryIds);
            const variants = this.variantRepository.getByProductIdsAndLocationIdPaging(productIds, locationId, pageIndex, pageSize);

            observable.next(variants);
            observable.complete();
        });
    }

    getVariantsByStockTypeAndVariantAndPrice(request: VariantByStockTypeAndVariantIdAndPriceRequest)
        : Observable<VariantByStockTypeAndVariantIdAndPriceResponse> {
        return Observable.create(observable => {
            const result = this.variantRepository.getVariantsByStockTypeAndVariantAndPrice(request);

            observable.next(result);
            observable.complete();
        });
    }

    getVariantsByProductId(productId: string): Observable<Variant[]> {
        return Observable.create(observable => {
            const result = this.variantRepository.getVariantsByProductId(productId);

            observable.next(result);
            observable.complete();
        });
    }
}
