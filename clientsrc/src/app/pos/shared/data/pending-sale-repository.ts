import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';
import { PendingSale, PendingSaleModel } from '../models/pending-sale';
import { PendingSaleItemRepository } from './pending-sale-item-repository';
import { PendingSaleItemModel } from '../models/pending-sale-item';
import { CustomerRepository } from './customer-repository';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { VariantRepository } from './variant-repository';
import { PendingSalePagingModel } from '../view-models/pending-sale-paging.model';
import { PagingExtension } from '../helpers/paging.extension';

@Injectable({ providedIn: 'root' })
export class PendingSaleRepository extends RepositoryBase<PendingSale> {
    Map(obj: any) {
        const result: PendingSale = {
            id: obj.id,
            customerId: obj.customerId,
            createdDate: obj.createdDate,
            amount: obj.amount
        };
        return result;
    }
    constructor(
        protected appContextManager: AppContextManager,
        private pendingSaleItemRepository: PendingSaleItemRepository,
        private variantRepository: VariantRepository,
        private customerRepository: CustomerRepository) {
        super(appContextManager, SchemaNames.pendingSale);
    }

    getPendingSales(pendingSaleIds: string[] = []): PendingSaleModel[] {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        let pendingSaleRealms = context.objects(this.tableName);
        if (pendingSaleIds.length > 0) {
            pendingSaleRealms = pendingSaleRealms.filter(x => pendingSaleIds.includes(x.id));
        }

        if (!pendingSaleRealms.length) {
            context.close();
            return result;
        }

        pendingSaleRealms.forEach(pendingSaleRealm => {
            const pendingSale = this.Map(pendingSaleRealm);
            const pendingSaleModel = this.getPendingSaleModelInformationFromRealm(context, pendingSale);
            result.push(pendingSaleModel);
        });

        context.close();
        return result;
    }

    getPendingSalesPaging(pageIndex: number, pageSize: number): PendingSalePagingModel {
        const context = this.appContextManager.GetLatestDbContext();
        const pendingSaleRealms = context.objects(this.tableName).sorted('createdDate', true);
        const result = this.mapPagingData(context, pendingSaleRealms, pageIndex, pageSize);

        context.close();
        return result;
    }

    searchPendingSalesPaging(textSearch: string, pageIndex: number, pageSize: number): PendingSalePagingModel {
        const context = this.appContextManager.GetLatestDbContext();
        const upperCaseTextSearch = textSearch.toUpperCase();
        const correspondingCustomerIds = context.objects(SchemaNames.customer)
            .filter(x => x.name.toUpperCase().includes(upperCaseTextSearch)
                || x.phoneNumber.includes(upperCaseTextSearch)
                || x.customerCode.toUpperCase().includes(upperCaseTextSearch))
            .map(x => x.id);

        const pendingSaleRealms = context.objects(this.tableName)
            .sorted('createdDate', true)
            .filter(x => correspondingCustomerIds.includes(x.customerId));

        const result = this.mapPagingData(context, pendingSaleRealms, pageIndex, pageSize);

        context.close();
        return result;
    }

    getPendingSaleById(id: string): PendingSaleModel {
        const context = this.appContextManager.GetLatestDbContext();
        let result = null;
        const pendingSaleRealms = context.objects(this.tableName).filtered(`id = "${id}"`);
        if (!pendingSaleRealms.length) {
            context.close();
            return result;
        }

        const pendingSaleRealm = pendingSaleRealms[0];
        const pendingSale = this.Map(pendingSaleRealm);
        result = this.getPendingSaleModelInformationFromRealm(context, pendingSale);

        context.close();
        return result;
    }

    private getPendingSaleModelInformationFromRealm(context: any, pendingSale: PendingSale) {
        const pendingSaleModel = new PendingSaleModel();
        Object.assign(pendingSaleModel, pendingSale);

        if (pendingSaleModel.customerId) {
            const customerRealms = context.objects(SchemaNames.customer).filtered(`id = "${pendingSaleModel.customerId}"`);
            if (customerRealms.length > 0) {
                const customerRealm = customerRealms[0];
                const customerModel = new CustomerModel();
                customerModel.id = customerRealm.id;
                customerModel.name = customerRealm.name;
                customerModel.reward = customerRealm.reward;
                customerModel.store = customerRealm.store;
                customerModel.visit = customerRealm.visit;

                pendingSaleModel.customerName = customerRealm.name;
                pendingSaleModel.customer = customerModel;
            }
        }

        const pendingSaleItemRealms = context.objects(SchemaNames.pendingSaleItem).filtered(`pendingSaleId = "${pendingSale.id}"`);
        pendingSaleModel.pendingSaleItems = pendingSaleItemRealms.map(pendingSaleItemRealm => {
            const pendingSaleItem = this.pendingSaleItemRepository.Map(pendingSaleItemRealm);
            const pendingSaleItemModel = new PendingSaleItemModel();
            Object.assign(pendingSaleItemModel, pendingSaleItem);

            const variant = context.objects(SchemaNames.variant)
                .filtered('variantId = $0 && stockTypeId = $1',
                    pendingSaleItemRealm.variantId,
                    pendingSaleItemRealm.stockTypeId);
            if (variant) {
                pendingSaleItemModel.id = variant.id;
                pendingSaleItemModel.variant = variant.description;
                pendingSaleItemModel.staffPrice = variant.staffPrice;
                pendingSaleItemModel.listPrice = variant.listPrice;
                pendingSaleItemModel.memberPrice = variant.memberPrice;
            }
            return pendingSaleItemModel;
        });

        return pendingSaleModel;
    }

    private mapPagingData(context: any, data: any[], pageIndex: number, pageSize: number): PendingSalePagingModel {
        const result = new PendingSalePagingModel();

        result.pageNumber = pageIndex;
        result.pageSize = pageSize;
        result.totalItem = data.length;
        result.pendingSales = [];

        if (!data.length) {
            return result;
        }

        const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);
        pagedData.forEach(pendingSaleRealm => {
            const pendingSale = this.Map(pendingSaleRealm);
            const pendingSaleModel = this.getPendingSaleModelInformationFromRealm(context, pendingSale);
            result.pendingSales.push(pendingSaleModel);
        });

        return result;
    }
}
