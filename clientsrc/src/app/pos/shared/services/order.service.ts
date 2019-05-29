import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from '../models/order';
import { UnitOfWork } from '../data/unit-of-work';
import { SchemaNames } from '../constants/schema-name.constant';
import { Guid } from 'src/app/shared/utils/guid.util';
import { OrderRepository } from '../data/order-repository';
import { OrderItemModel } from '../models/order-item';
import { VariantRepository } from '../data/variant-repository';
import { OrderItemRepository } from '../data/order-item-repository';
import { OrderPromotionRepository } from '../data/order-promotion-repository';
import { OrderPayment } from '../models/order-payment';
import { RecentOrderPagingModel } from '../view-models/recent-order-paging.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
    constructor(
        private unitOfWork: UnitOfWork,
        private orderRepository: OrderRepository,
        private orderItemRepository: OrderItemRepository,
        private orderPromotionRepository: OrderPromotionRepository,
        private variantRepository: VariantRepository
    ) { }

    getRecentOrders(): Observable<OrderModel[]> {
        return Observable.create(observer => {
            const orderModels = this.orderRepository.getRecentOrders();

            observer.next(orderModels);
            observer.complete();
        });
    }

    getRecentOrdersPaging(pageIndex: number, pageSize: number): Observable<RecentOrderPagingModel> {
        return Observable.create(observer => {
            const recentOrderPagingModel = this.orderRepository.getRecentOrdersPaging(pageIndex, pageSize);

            observer.next(recentOrderPagingModel);
            observer.complete();
        });
    }

    searchRecentOrdersPaging(textSearch: string, pageIndex: number, pageSize: number): Observable<RecentOrderPagingModel> {
        return Observable.create(observer => {
            const recentOrderPagingModel = this.orderRepository.searchRecentOrdersPaging(textSearch, pageIndex, pageSize);

            observer.next(recentOrderPagingModel);
            observer.complete();
        });
    }

    getOrdersIncludeOrderItems(): Observable<OrderModel[]> {
        return Observable.create(observer => {
            const orderModels = this.orderRepository.getOrdersInformation();

            observer.next(orderModels);
            observer.complete();
        });
    }

    getOrderIncludeOrderItems(id: string): Observable<OrderModel> {
        return Observable.create(observer => {
            let result = null;
            const orderModels = this.orderRepository.getOrdersInformation([id]);
            if (orderModels.length > 0) {
                result = orderModels[0];
            }
            observer.next(result);
            observer.complete();
        });
    }

    addOrder(order: OrderModel): Observable<any> {
        return Observable.create(observer => {
            const result = {
                orderModel: null,
                errorMessage: ''
            };

            let error = '';
            try {
                const orderItems = order.orderItems;

                this.unitOfWork.beginTransaction();
                order.id = Guid.newGuid();
                order.createdDate = new Date();
                this.unitOfWork.add(SchemaNames.order, order);

                orderItems.forEach(orderItem => {
                    const updateVariantMessage = this.calculateVariantQuantity(orderItem);
                    if (updateVariantMessage !== 'success') {
                        error += ` ${updateVariantMessage} `;
                    }

                    orderItem.id = Guid.newGuid();
                    orderItem.orderId = order.id;
                    const orderItemEntity = this.orderItemRepository.Map(orderItem);

                    this.unitOfWork.add(SchemaNames.orderItem, orderItemEntity);

                    const orderItemPromotions = orderItem.orderItemPromotions;
                    if (Array.isArray(orderItemPromotions)) {
                        orderItemPromotions.forEach(orderItemPromotion => {
                            orderItemPromotion.orderItemId = orderItem.id;
                            this.unitOfWork.add(SchemaNames.orderItemPromotion, orderItemPromotion);
                        });
                    }
                });

                order.orderPromotions.forEach(orderPromotion => {
                    orderPromotion.id = Guid.newGuid();
                    orderPromotion.orderId = order.id;
                    const orderPromotionEntity = this.orderPromotionRepository.Map(orderPromotion);

                    this.unitOfWork.add(SchemaNames.orderPromotion, orderPromotionEntity);
                });

                this.addOrderPaymentsToUnitOfWork(this.unitOfWork, order.id, order.orderPayments);

                if (!error) {
                    this.unitOfWork.saveChanges();
                    order.orderItems = orderItems;
                    result.orderModel = order;
                } else {
                    result.orderModel = null;
                    result.errorMessage = error;
                }

            } catch (e) {
                result.orderModel = null;
                result.errorMessage = e;
            }

            observer.next(result);
            observer.complete();
        });
    }

    calculateTotalOrdersPrice(fromDate: Date, toDate: Date): Observable<number> {
        return Observable.create(observer => {
            const result = this.orderRepository.calculateTotalOrdersPrice(fromDate, toDate);

            observer.next(result);
            observer.complete();
        });
    }

    getOrders(fromDate: Date, toDate: Date): Observable<OrderModel[]> {
        return Observable.create(observer => {
            const result = this.orderRepository.getOrders(fromDate, toDate);

            observer.next(result);
            observer.complete();
        });
    }

    private addOrderPaymentsToUnitOfWork(unitOfWork: UnitOfWork, orderId: string, orderPayments: OrderPayment[]) {
        orderPayments.forEach(orderPayment => {
            orderPayment.id = Guid.newGuid();
            orderPayment.orderId = orderId;

            unitOfWork.add(SchemaNames.orderPayment, orderPayment);
        });
    }

    private calculateVariantQuantity(orderItem: OrderItemModel): string {
        const variants = this.variantRepository.getByVariantId(orderItem.variantId);
        if (!variants.length) {
            return 'Variant is not existed';
        }

        let variantTotalQuantity = 0;
        variants.forEach(variant => {
            variantTotalQuantity += variant.quantity;
        });

        if (variantTotalQuantity >= orderItem.quantity) {
            let remainingOrderQuantity = orderItem.quantity;
            for (let i = 0; i < variants.length && remainingOrderQuantity > 0; i++) {
                const correspondingVariant = variants[i];
                if (correspondingVariant.quantity <= remainingOrderQuantity) {
                    remainingOrderQuantity = remainingOrderQuantity - correspondingVariant.quantity;
                    correspondingVariant.quantity = 0;
                    this.unitOfWork.update(SchemaNames.variant, correspondingVariant);
                } else {
                    correspondingVariant.quantity = correspondingVariant.quantity - remainingOrderQuantity;
                    remainingOrderQuantity = 0;
                    this.unitOfWork.update(SchemaNames.variant, correspondingVariant);
                }
            }

            return 'success';
        }

        const variantDescription = variants[0].description;
        return `${variantDescription} quantity is not enough.`;
    }
}
