import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryRepository } from '../data/category-repository';
import { CategoryPagingModel } from '../view-models/category-paging.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {

    constructor(
        private categoryRepository: CategoryRepository
    ) { }
    get(): Observable<any> {
        return Observable.create(observer => {
            const categories = this.categoryRepository.get();

            observer.next(categories);
            observer.complete();
        });
    }

    getPaging(pageIndex: number, pageSize: number): Observable<CategoryPagingModel> {
        return Observable.create(observer => {
            const result = this.categoryRepository.getPaging(pageIndex, pageSize);

            observer.next(result);
            observer.complete();
        });
    }
}
