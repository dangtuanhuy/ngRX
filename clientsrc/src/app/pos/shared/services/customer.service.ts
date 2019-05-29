import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerRepository } from '../data/customer-repository';
import { Customer } from '../models/customer';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { CustomerPagingModel } from '../view-models/customer-paging.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {

    constructor(
        private customerRepository: CustomerRepository
    ) { }

    getById(id: string): Observable<Customer> {
        return Observable.create(observer => {
            const customer = this.customerRepository.getById(id);
            observer.next(customer);
            observer.complete();
        });
    }

    getCustomers(): Observable<Customer[]> {
        return Observable.create(observer => {
            const customers = this.customerRepository.get();
            observer.next(customers);
            observer.complete();
        });
    }

    searchCustomers(queryText: Observable<string>) {
        return queryText.debounceTime(500).distinctUntilChanged().switchMap(term =>
            Observable.create(observer => {
                let result = [];
                if (term) {
                    result = this.customerRepository.search(term);
                }

                observer.next(result);
                observer.complete();
            })
        );
    }

    searchCustomersPagingDelay(pageIndex: number, pageSize: number, queryText: Observable<string>, allowSearchWhenEmpty: boolean = true)
        : Observable<CustomerPagingModel> {
        return queryText.debounceTime(500).distinctUntilChanged().switchMap(term =>
            this.searchCustomersPaging(pageIndex, pageSize, term, allowSearchWhenEmpty)
        );
    }

    getCustomersPaging(pageIndex: number, pageSize: number): Observable<CustomerPagingModel> {
        return Observable.create(observer => {
            const response = this.customerRepository.getCustomersPaging(pageIndex, pageSize);
            observer.next(response);
            observer.complete();
        });
    }

    searchCustomersPaging(pageIndex: number, pageSize: number, queryText: string, allowSearchWhenEmpty: boolean = true)
        : Observable<CustomerPagingModel> {
        return Observable.create(observer => {
            const response = this.customerRepository.searchCustomersPaging(pageIndex, pageSize, queryText, allowSearchWhenEmpty);
            observer.next(response);
            observer.complete();
        });
    }
}
