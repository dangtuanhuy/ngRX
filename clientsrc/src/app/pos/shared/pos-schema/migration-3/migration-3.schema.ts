import { MigrationSchema } from '../migration.schema';
import { AppSettingSchema } from '../appSetting.schema';
import { CategorySchema } from '../category.schema';
import { ProductSchema } from '../product.schema';
import { VariantSchema } from '../variant.schema';
import { OrderSchema } from '../order.schema';
import { OrderItemSchema } from '../order-item.schema';
import { PendingSaleItemSchema } from '../pending-sale-item.schema';
import { CashingUpSchema } from '../cashing-up.schema';
import { UserSchema } from '../user.schema';
import { PendingSaleSchema } from '../pending-sale.schema';
import { CustomerSchema } from '../customer.schema';
import { TenderSchema } from '../tender.schema';
import { PromotionSchema } from '../promotion.schema';
import { OrderPromotionSchema } from '../order-promotion.schema';
import { OrderItemPromotionSchema } from '../order-item-promotion.schema';
import { BarCodeSchema } from '../barcode.schema';
import { SaleTargetSchema } from '../sale-target.schema';
import { SalesAchievedSchema } from '../sales-achieved.schema';
import { OrderPaymentSchema } from '../order-payment.schema';
import { PaymentMethodSchema } from '../migration-1/payment-method.schema';
import { DefaultPaymentMethodSchema } from '../migration-1/default-payment-method.schema';
import { Order3Schema } from './order-3.schema';

export const Migration3 = [
    MigrationSchema,
    AppSettingSchema,
    CategorySchema,
    ProductSchema,
    VariantSchema,
    CustomerSchema,
    OrderItemSchema,
    PendingSaleSchema,
    PendingSaleItemSchema,
    UserSchema,
    CashingUpSchema,
    TenderSchema,
    PromotionSchema,
    OrderPromotionSchema,
    OrderItemPromotionSchema,
    BarCodeSchema,
    SaleTargetSchema,
    SalesAchievedSchema,
    OrderPaymentSchema,
    PaymentMethodSchema,
    DefaultPaymentMethodSchema,
    Order3Schema
];
