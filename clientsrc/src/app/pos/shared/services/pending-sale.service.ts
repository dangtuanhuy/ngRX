import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitOfWork } from '../data/unit-of-work';
import { SchemaNames } from '../constants/schema-name.constant';
import { Guid } from 'src/app/shared/utils/guid.util';
import { PendingSaleRepository } from '../data/pending-sale-repository';
import { PendingSaleModel, PendingSale } from '../models/pending-sale';
import { CustomerRepository } from '../data/customer-repository';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { PendingSaleItemRepository } from '../data/pending-sale-item-repository';
import { PendingSaleItemModel, PendingSaleItem } from '../models/pending-sale-item';
import { VariantRepository } from '../data/variant-repository';
import { PendingSalePagingModel } from '../view-models/pending-sale-paging.model';

@Injectable({ providedIn: 'root' })
export class PendingSaleService {
    constructor(
        private unitOfWork: UnitOfWork,
        private pendingSaleRepository: PendingSaleRepository,
        private pendingSaleItemRepository: PendingSaleItemRepository,
        private customerRepository: CustomerRepository,
        private variantRepository: VariantRepository
    ) { }

    getPendingSales(pendingSaleIds: string[] = []): Observable<PendingSaleModel[]> {
        return Observable.create(observer => {
            const pendingSaleModels = this.pendingSaleRepository.getPendingSales(pendingSaleIds);

            observer.next(pendingSaleModels);
            observer.complete();
        });
    }

    getPendingSalesPaging(pageIndex: number, pageSize: number): Observable<PendingSalePagingModel> {
        return Observable.create(observer => {
            const pendingSalePagingModel = this.pendingSaleRepository.getPendingSalesPaging(pageIndex, pageSize);

            observer.next(pendingSalePagingModel);
            observer.complete();
        });
    }

    searchPendingSalesPaging(textSearch: string, pageIndex: number, pageSize: number): Observable<PendingSalePagingModel> {
        return Observable.create(observer => {
            const pendingSalePagingModel = this.pendingSaleRepository.searchPendingSalesPaging(textSearch, pageIndex, pageSize);

            observer.next(pendingSalePagingModel);
            observer.complete();
        });
    }

    getPendingSale(id: string): Observable<PendingSaleModel> {
        return Observable.create(observer => {
            const pendingSaleRealm = this.pendingSaleRepository.getPendingSaleById(id);
            if (!pendingSaleRealm) {
                observer.next(null);
                observer.complete();
                return;
            }

            const pendingSaleModel = new PendingSaleModel();
            Object.assign(pendingSaleModel, pendingSaleRealm);

            if (pendingSaleModel.customerId) {
                const customer = this.customerRepository.getById(pendingSaleModel.customerId);
                if (customer) {
                    const customerModel = new CustomerModel();
                    customerModel.id = customer.id;
                    customerModel.name = customer.name;
                    customerModel.reward = customer.reward;
                    customerModel.store = customer.store;
                    customerModel.visit = customer.visit;

                    pendingSaleModel.customer = customerModel;
                }
            }

            const pendingSaleItems = this.pendingSaleItemRepository.getByPendingSale(id);
            pendingSaleModel.pendingSaleItems = pendingSaleItems.map(item => {
                const pendingSaleItemModel = new PendingSaleItemModel();
                Object.assign(pendingSaleItemModel, item);

                const variant = this.variantRepository.getByVariantAndStockType(item.variantId, item.stockTypeId);
                if (variant) {
                    pendingSaleItemModel.id = variant.id;
                    pendingSaleItemModel.variant = variant.description;
                    pendingSaleItemModel.staffPrice = variant.staffPrice;
                    pendingSaleItemModel.listPrice = variant.listPrice;
                    pendingSaleItemModel.memberPrice = variant.memberPrice;
                }
                return pendingSaleItemModel;
            });

            observer.next(pendingSaleModel);
            observer.complete();
        });
    }

    addPendingSale(data: any): Observable<any> {
        return Observable.create(observer => {
            const result = {
                pendingSaleModel: null,
                errorMessage: ''
            };

            try {
                const pendingSale: PendingSale = data.pendingSale;
                const pendingSaleItems: PendingSaleItem[] = data.pendingSaleItems;

                this.unitOfWork.beginTransaction();
                pendingSale.id = Guid.newGuid();
                this.unitOfWork.add(SchemaNames.pendingSale, pendingSale);

                pendingSaleItems.forEach(pendingSaleItem => {
                    pendingSaleItem.id = Guid.newGuid();
                    pendingSaleItem.pendingSaleId = pendingSale.id;

                    this.unitOfWork.add(SchemaNames.pendingSaleItem, pendingSaleItem);
                });

                this.unitOfWork.saveChanges();
                const pendingSaleModel = new PendingSaleModel();
                Object.assign(pendingSaleModel, pendingSale);
                pendingSaleModel.pendingSaleItems = pendingSaleItems.map(x => {
                    const pendingSaleItemModel = new PendingSaleItemModel();
                    Object.assign(pendingSaleItemModel, x);
                    return pendingSaleItemModel;
                });
                result.pendingSaleModel = pendingSaleModel;
            } catch (e) {
                result.pendingSaleModel = null;
                result.errorMessage = e;
            }

            observer.next(result);
            observer.complete();
        });
    }

    deleteIncludePendingSaleItems(id: string): Observable<boolean> {
        return Observable.create(observer => {
            try {
                this.unitOfWork.beginTransaction();
                const pendingSale = this.pendingSaleRepository.getById(id);
                if (pendingSale) {
                    this.unitOfWork.delete(SchemaNames.pendingSale, pendingSale.id);
                }
                const pendingSaleItems = this.pendingSaleItemRepository.getByPendingSale(id);
                pendingSaleItems.forEach(pendingSaleItem => {
                    this.unitOfWork.delete(SchemaNames.pendingSaleItem, pendingSaleItem.id);
                });
                this.unitOfWork.saveChanges();

                observer.next(true);
                observer.complete();
            } catch (e) {
                observer.next(false);
                observer.complete();
            }
        });
    }
}
