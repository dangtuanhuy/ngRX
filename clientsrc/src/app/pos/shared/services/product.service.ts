import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VariantRepository } from '../data/variant-repository';
import { ProductRepository } from '../data/product-repository';
import { Product } from '../models/product';
import { StockPricePagingModel } from '../view-models/stock-price-page-response.model';
import { ProductPagingModel } from '../view-models/product-paging.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(
        private productRepository: ProductRepository
    ) { }

    getByCategories(categoryIds: string[]): Observable<Product[]> {
        return Observable.create(observable => {
            const products = this.productRepository.getByCategories(categoryIds);

            observable.next(products);
            observable.complete();
        });
    }

    getIncludeVariantsPaging(textSearch: string, size = 10, pageIndex = 0): Observable<Product[]> {
        return Observable.create(observable => {
            const products = this.productRepository.getIncludeVariantsPaging(textSearch, size, pageIndex);

            observable.next(products);
            observable.complete();
        });
    }

    getProductsPaging(pageIndex: number, pageSize: number): Observable<ProductPagingModel> {
        return Observable.create(observer => {
            const response = this.productRepository.getProductsPaging(pageIndex, pageSize);

            observer.next(response);
            observer.complete();
        });
    }

    searchProductsPaging(pageIndex: number, pageSize: number, queryText: string): Observable<ProductPagingModel> {
        return Observable.create(observer => {
            const response = this.productRepository.searchProductsPaging(pageIndex, pageSize, queryText);
            observer.next(response);
            observer.complete();
        });
    }

    searchProductsPagingDelay(dataSearch: Observable<any>): Observable<ProductPagingModel> {
        return dataSearch.debounceTime(500).distinctUntilChanged().switchMap(term =>
            this.searchProductsPaging(term.pageIndex, term.pageSize, term.textSearch)
        );
    }
}
