import { MigrationSchema } from '../migration.schema';
import { AppSettingSchema } from '../appSetting.schema';
import { CategorySchema } from '../category.schema';
import { VariantSchema } from '../variant.schema';
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
import { Product4Schema } from '../migration-4/product-4.schema';
import { Location5Schema } from '../migration-5/location-5.schema';
import { Order6Schema } from './order-6.schema';
import { OrderItem6Schema } from './order-item-6.schema';

export const Migration6 = [
    MigrationSchema,
    AppSettingSchema,
    CategorySchema,
    Product4Schema,
    VariantSchema,
    CustomerSchema,
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
    Location5Schema,
    Order6Schema,
    OrderItem6Schema
];
