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
import { Order2Schema } from './order-2.schema';
import { OrderPaymentSchema } from '../order-payment.schema';
import { PaymentMethodSchema } from '../migration-1/payment-method.schema';
import { DefaultPaymentMethodSchema } from '../migration-1/default-payment-method.schema';
import { SystemAppSettingKeys } from '../../constants/appSetting-key.constant';
import { AppSettingService } from '../../services/appSetting.service';

export const Migration2 = [
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
    Order2Schema
];

export function migration2InitData(appSettingService: AppSettingService) {
    appSettingService.add(SystemAppSettingKeys.billNoStoreNamePrefix, 'TOG').subscribe();
    appSettingService.add(SystemAppSettingKeys.billNoDeviceNo, '1').subscribe();
}
