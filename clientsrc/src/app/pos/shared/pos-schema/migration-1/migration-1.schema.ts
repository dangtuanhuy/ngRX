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
import { PaymentMethodSchema } from './payment-method.schema';
import { DefaultPaymentMethodSchema } from './default-payment-method.schema';

export const Migration1 = [
    MigrationSchema,
    AppSettingSchema,
    CategorySchema,
    ProductSchema,
    VariantSchema,
    CustomerSchema,
    OrderSchema,
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
    DefaultPaymentMethodSchema
];
