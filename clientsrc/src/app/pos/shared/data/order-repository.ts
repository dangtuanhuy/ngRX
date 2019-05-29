import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { AppContextManager } from '../app-context-manager';
import { Order, OrderModel } from '../models/order';
import { SchemaNames } from '../constants/schema-name.constant';
import { OrderItemModel } from '../models/order-item';
import { OrderItemRepository } from './order-item-repository';
import { PriceExtension } from '../helpers/price.extension';
import { OrderPromotionRepository } from './order-promotion-repository';
import { OrderPromotion } from '../models/order-promotion';
import { DiscountType } from '../enums/discount-type.enum';
import { OrderItemPromotionRepository } from './order-item-promotion-repository';
import { UnitOfWork } from './unit-of-work';
import { OrderPaymentRepository } from './order-payment-repository';
import { RecentOrderPagingModel } from '../view-models/recent-order-paging.model';
import { PagingExtension } from '../helpers/paging.extension';
import { OrderTransactionType } from '../enums/order-transaction-type.enum';
import { UserRepository } from './user-repository';

@Injectable({ providedIn: 'root' })
export class OrderRepository extends RepositoryBase<Order> {
    Map(obj: any) {
        const result: Order = {
            id: obj.id,
            customerId: obj.customerId,
            createdDate: obj.createdDate,
            amount: obj.amount,
            billNo: obj.billNo,
            change: obj.change,
            gst: obj.gst,
            gstInclusive: obj.gstInclusive ? obj.gstInclusive : false,
            isDelete: obj.isDelete ? obj.isDelete : false,
            synced: obj.synced ? obj.synced : false,
            cashierId: obj.cashierId ? obj.cashierId : '',
            orderTransactionType: obj.orderTransactionType ? obj.orderTransactionType : OrderTransactionType.Normal,
            oldOrderId: obj.oldOrderId ? obj.oldOrderId : ''
        };
        return result;
    }
    constructor(
        protected appContextManager: AppContextManager,
        private orderItemRepository: OrderItemRepository,
        private orderItemPromotionRepository: OrderItemPromotionRepository,
        private orderPromotionRepository: OrderPromotionRepository,
        private orderPaymentRepository: OrderPaymentRepository,
        private userRepository: UserRepository,
        private unitOfWork: UnitOfWork
    ) {
        super(appContextManager, SchemaNames.order);
    }

    getRecentOrders(): OrderModel[] {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const orderRealms = context.objects(this.tableName).sorted('createdDate', true);

        if (!orderRealms.length) {
            context.close();
            return result;
        }

        orderRealms.forEach(orderRealm => {
            const order = this.Map(orderRealm);
            const orderModel = new OrderModel();
            Object.assign(orderModel, order);
            const orderPromotions = context.objects(SchemaNames.orderPromotion).filtered(`orderId = "${order.id}"`).map(x => {
                return {
                    discountType: x.discountType,
                    value: x.value
                };
            });
            const discountPrices: number[] = [];
            orderPromotions.forEach(orderPromotion => {
                if (orderPromotion.discountType === DiscountType.Money) {
                    discountPrices.push(orderPromotion.value);
                }

                if (orderPromotion.discountType === DiscountType.Percent) {
                    discountPrices.push(orderPromotion.value * order.amount / 100);
                }
            });

            if (order.customerId) {
                const cutomer = context.objects(SchemaNames.customer).find(x => x.id === order.customerId);
                if (cutomer) {
                    orderModel.customerName = cutomer.name;
                }
            }

            result.push(orderModel);
        });
        context.close();
        return result;
    }

    getRecentOrdersPaging(pageIndex: number, pageSize: number): RecentOrderPagingModel {
        const context = this.appContextManager.GetLatestDbContext();
        const orderRealms = context.objects(this.tableName).sorted('createdDate', true);
        const result = this.mapPagingRecentOrdersData(context, orderRealms, pageIndex, pageSize);

        context.close();
        return result;
    }

    searchRecentOrdersPaging(textSearch: string, pageIndex: number, pageSize: number): RecentOrderPagingModel {
        const context = this.appContextManager.GetLatestDbContext();

        const upperCaseTextSearch = textSearch.toUpperCase();

        const correspondingCustomerIds = context.objects(SchemaNames.customer)
            .filter(x => x.name.toUpperCase().includes(upperCaseTextSearch)
                || x.phoneNumber.includes(upperCaseTextSearch)
                || x.customerCode.toUpperCase().includes(upperCaseTextSearch)
            )
            .map(x => x.id);
        const orderRealms = context.objects(this.tableName)
            .sorted('createdDate', true)
            .filter(x => x.billNo === textSearch
                || correspondingCustomerIds.includes(x.customerId));

        const result = this.mapPagingRecentOrdersData(context, orderRealms, pageIndex, pageSize);

        context.close();
        return result;
    }

    getOrdersInformation(orderIds: string[] = [], filterOrderSyncedIsEqualFalse = false): OrderModel[] {
        const context = this.appContextManager.GetLatestDbContext();

        const result = [];
        let orderRealms = context.objects(this.tableName).filtered('isDelete = false');
        if (filterOrderSyncedIsEqualFalse) {
            orderRealms = orderRealms.filtered('synced = false');
        }

        if (orderIds.length > 0) {
            orderRealms = orderRealms.filter(x => orderIds.includes(x.id));
        }
        if (!orderRealms.length) {
            context.close();
            return result;
        }

        const realmOrderIds = orderRealms.map(x => x.cashierId);

        const cashiers = this.userRepository.getUserByIdsFromContext(context, realmOrderIds);

        orderRealms.forEach(orderRealm => {
            const order = this.Map(orderRealm);
            const orderModel = new OrderModel();
            Object.assign(orderModel, order);

            const cashier = cashiers.find(x => x.id === orderRealm.cashierId);
            if (cashier) {
                let cashierName = cashier.firstName ? cashier.firstName : '';
                cashierName += cashier.lastName
                    ? ' ' + cashier.lastName
                    : '';
                orderModel.cashierName = cashierName;
            } else {
                const currentUser = this.appContextManager.currentUser;
                if (currentUser) {
                    let cashierName = currentUser.firstName ? currentUser.firstName : '';
                    cashierName += currentUser.lastName
                        ? ' ' + currentUser.lastName
                        : '';
                    orderModel.cashierName = cashierName;
                }
            }

            if (order.customerId) {
                const customer = context.objects(SchemaNames.customer).find(x => x.id === order.customerId);
                if (customer) {
                    orderModel.customerName = customer.name;
                    orderModel.customerPhoneNumber = customer.phoneNumber;
                    orderModel.customerCode = customer.customerCode;
                }
            }

            const orderItemRealms = context.objects(SchemaNames.orderItem).filter(x => x.orderId === order.id);
            const orderItems: OrderItemModel[] = [];
            orderItemRealms.forEach(orderItemRealm => {
                const orderItem = this.orderItemRepository.Map(orderItemRealm);
                const orderItemModel = new OrderItemModel();
                Object.assign(orderItemModel, orderItem);

                const variant = context.objects(SchemaNames.variant).find(x => x.variantId === orderItemRealm.variantId);
                if (variant) {
                    orderItemModel.variant = variant.description;
                    orderItemModel.skuCode = variant.skuCode;
                }

                orderItemModel.orderItemPromotions = [];
                const orderItemPromotionRealms = context.objects(SchemaNames.orderItemPromotion)
                    .filtered(`orderItemId = "${orderItemRealm.id}"`);
                if (orderItemPromotionRealms.length > 0) {
                    orderItemPromotionRealms.forEach(orderItemPromotionRealm => {
                        const orderItemPromotion = this.orderItemPromotionRepository.Map(orderItemPromotionRealm);
                        orderItemModel.orderItemPromotions.push(orderItemPromotion);
                    });
                }

                orderItems.push(orderItemModel);
                return orderItemModel;
            });
            orderModel.orderItems = orderItems;

            const orderPromotionRealms = context.objects(SchemaNames.orderPromotion).filter(x => x.orderId === order.id);
            const orderPromotions: OrderPromotion[] = [];
            orderPromotionRealms.forEach(orderPromotionRealm => {
                const orderPromotion = this.orderPromotionRepository.Map(orderPromotionRealm);
                orderPromotions.push(orderPromotion);
            });
            orderModel.orderPromotions = orderPromotions;

            orderModel.orderPayments = this.orderPaymentRepository
                .getOrderPaymentsByOrderIdUseContext(context, order.id);

            const discountPrices: number[] = [];
            orderPromotions.forEach(orderPromotion => {
                if (orderPromotion.discountType === DiscountType.Money) {
                    discountPrices.push(orderPromotion.value);
                }

                if (orderPromotion.discountType === DiscountType.Percent) {
                    discountPrices.push(orderPromotion.value * order.amount / 100);
                }
            });

            result.push(orderModel);
        });
        context.close();
        return result;
    }

    calculateTotalOrdersPrice(fromDate: Date, toDate: Date): number {
        const context = this.appContextManager.GetLatestDbContext();
        const orderRealms = context.objects(this.tableName)
            .filtered('createdDate >= $0 && createdDate < $1 && isDelete = false', fromDate, toDate);

        let result = 0;
        if (orderRealms.length) {
            orderRealms.forEach(x => {
                if (x.gstInclusive) {
                    result = PriceExtension.round(result + Number(x.amount), 2);
                } else {
                    result += Number(x.amount) * PriceExtension.round((100 + x.gst), 2) / 100;
                }
            });
        }

        context.close();
        return result;
    }

    getOrders(fromDate: Date, toDate: Date): OrderModel[] {
        const context = this.appContextManager.GetLatestDbContext();
        const orderRealms = context.objects(this.tableName)
            .filtered('createdDate >= $0 && createdDate < $1 && isDelete = false', fromDate, toDate);

        const result: OrderModel[] = [];
        if (orderRealms.length) {
            orderRealms.forEach(x => {
                const orderModel = new OrderModel();
                Object.assign(orderModel, this.Map(x));
                result.push(orderModel);
            });
        }

        context.close();
        return result;
    }

    updateSyncedOrders(syncedOrderIds: string[]) {
        let context = this.appContextManager.GetLatestDbContext();
        const orderRealms = context.objects(this.tableName)
            .filtered('synced = false')
            .filter(x => syncedOrderIds.includes(x.id));
        const orderEntities = [];
        orderRealms.forEach(element => {
            const order = this.Map(element);
            order.synced = true;
            orderEntities.push(order);
        });

        context.close();

        context = this.appContextManager.GetLatestDbContext();
        context.write(() => {
            orderEntities.forEach(element => {
                context.create(this.tableName, element, true);
            });
        });
        context.close();
    }

    private mapPagingRecentOrdersData(context: any, data: any[], pageIndex: number, pageSize: number): RecentOrderPagingModel {
        const result = new RecentOrderPagingModel();

        result.pageNumber = pageIndex;
        result.pageSize = pageSize;
        result.totalItem = data.length;
        result.recentOrders = [];

        if (!data.length) {
            return result;
        }

        const pagedData = PagingExtension.pagingData(data, pageIndex, pageSize);
        pagedData.forEach(element => {
            const order = this.Map(element);
            const orderModel = new OrderModel();
            Object.assign(orderModel, order);
            const orderPromotions = context.objects(SchemaNames.orderPromotion).filtered(`orderId = "${order.id}"`).map(x => {
                return {
                    discountType: x.discountType,
                    value: x.value
                };
            });
            const discountPrices: number[] = [];
            orderPromotions.forEach(orderPromotion => {
                if (orderPromotion.discountType === DiscountType.Money) {
                    discountPrices.push(orderPromotion.value);
                }

                if (orderPromotion.discountType === DiscountType.Percent) {
                    discountPrices.push(orderPromotion.value * order.amount / 100);
                }
            });

            if (order.customerId) {
                const cutomer = context.objects(SchemaNames.customer).find(x => x.id === order.customerId);
                if (cutomer) {
                    orderModel.customerName = cutomer.name;
                }
            }

            result.recentOrders.push(orderModel);
        });

        return result;
    }
}
