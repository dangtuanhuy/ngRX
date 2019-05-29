import { Injectable } from '@angular/core';
import { MigrationRepository } from '../data/migration-repository';
import { AppContextManager } from '../app-context-manager';
import { Migration } from '../models/migration';
import { AppSettingService } from './appSetting.service';
import { DenominationKeys, SystemAppSettingKeys } from '../constants/appSetting-key.constant';
import { CashingUpSchema } from '../pos-schema/cashing-up.schema';
import { TenderSchema } from '../pos-schema/tender.schema';
import { PromotionSchema } from '../pos-schema/promotion.schema';
import { OrderPromotionSchema } from '../pos-schema/order-promotion.schema';
import { OrderItemPromotionSchema } from '../pos-schema/order-item-promotion.schema';
import { BarCodeSchema } from '../pos-schema/barcode.schema';
import { ServiceBase } from 'src/app/shared/services/service-base';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { SalesAchievedSchema } from '../pos-schema/sales-achieved.schema';
import { SaleTargetSchema } from '../pos-schema/sale-target.schema';
import { OrderPaymentSchema } from '../pos-schema/order-payment.schema';
import { MigrationSchema } from '../pos-schema/migration.schema';
import { AppSettingSchema } from '../pos-schema/appSetting.schema';
import { CategorySchema } from '../pos-schema/category.schema';
import { ProductSchema } from '../pos-schema/product.schema';
import { VariantSchema } from '../pos-schema/variant.schema';
import { CustomerSchema } from '../pos-schema/customer.schema';
import { OrderSchema } from '../pos-schema/order.schema';
import { OrderItemSchema } from '../pos-schema/order-item.schema';
import { PendingSaleSchema } from '../pos-schema/pending-sale.schema';
import { PendingSaleItemSchema } from '../pos-schema/pending-sale-item.schema';
import { UserSchema } from '../pos-schema/user.schema';
import { Migration1 } from '../pos-schema/migration-1/migration-1.schema';
import { SyncService } from './sync.service';
import { DefaultPaymentMethodService } from './default-payment-method.service';
import { DefaultPaymentMethodPageType } from '../models/default-payment-method';
import { Migration2, migration2InitData } from '../pos-schema/migration-2/migration-2.schema';
import { Migration3 } from '../pos-schema/migration-3/migration-3.schema';
import { Migration4 } from '../pos-schema/migration-4/migration-4.schema';
import { Migration5 } from '../pos-schema/migration-5/migration-5.schema';
import { Migration6 } from '../pos-schema/migration-6/migration-6.schema';

@Injectable({ providedIn: 'root' })
export class MigrationService extends ServiceBase {
  didSeedData = true;
  migrations = [];
  constructor(
    private migrationRepository: MigrationRepository,
    private appContextManager: AppContextManager,
    private appSettingService: AppSettingService,
    private syncService: SyncService,
    private defaultPaymentMethodService: DefaultPaymentMethodService,
    http: HttpClient,
    notificationService: NotificationService,
  ) {
    super(http, notificationService);

    this.migrations = [
      {
        id: 'init db model',
        schema: [
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
          OrderPaymentSchema
        ],
        schemaVersion: 1,
        migration: function (oldRealm, newRealm) { }
      },
      {
        id: '[PaymentMethods] add payment methods model',
        schema: Migration1,
        schemaVersion: 2,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 2) {
            return;
          }
        }
      },
      {
        id: 'Migration 2 - order - add bill no field',
        schema: Migration2,
        schemaVersion: 3,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 3) {
            return;
          }
        }
      },
      {
        id: 'Migration 3 - order - add change money',
        schema: Migration3,
        schemaVersion: 4,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 4) {
            return;
          }
        }
      },
      {
        id: 'Migration 4 - product - add date field',
        schema: Migration4,
        schemaVersion: 5,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 5) {
            return;
          }
        }
      },
      {
        id: 'Migration 5 - init stores',
        schema: Migration5,
        schemaVersion: 6,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 6) {
            return;
          }
        }
      },
      {
        id: 'Migration 6 - orders, orderItems add fields',
        schema: Migration6,
        schemaVersion: 7,
        migration: function (oldRealm, newRealm) {
          if (oldRealm.schemaVersion <= 7) {
            return;
          }
        }
      }
    ];
  }

  migrate(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          let lastVersion = '';
          let nextSchemaIndex = this.appContextManager.getDbVersion();
          if (nextSchemaIndex === -1) {
            nextSchemaIndex = 0;
            this.didSeedData = false;
          }
          while (nextSchemaIndex < this.migrations.length) {
            const migration = this.migrations[nextSchemaIndex++];
            const migratedRealm = this.appContextManager.getDbContexṭ̣̣(
              migration
            );
            migratedRealm.close();
            const allMigrations = this.migrationRepository.get();
            if (
              !allMigrations.filter(item => item.id === migration.id).length
            ) {
              const migrationToInsert: Migration = {
                id: migration.id
              };
              this.migrationRepository.add(migrationToInsert);
            }
            lastVersion = migration.id;
            this.dataSeeder(migration.schemaVersion);
          }

          resolve(lastVersion);
        } catch (ex) {
          reject(new Error(ex));
        }
      }, 1000);
    });
  }

  private dataSeeder(schemaVersion: number) {
    if (schemaVersion === 1) {
      if (!this.didSeedData) {
        this.initAppSetting();
        this.initDenomitaions();

        this.didSeedData = true;
      }
    }

    if (schemaVersion === 2) {
      this.initDefaultPaymentMethod();
      this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(deviceCodeAppSetting => {
        if (deviceCodeAppSetting) {
          this.syncService.syncPaymentMethods(deviceCodeAppSetting.value).subscribe();
        }
      });
    }

    if (schemaVersion === 3) {
      migration2InitData(this.appSettingService);
    }
  }

  private initAppSetting() {
    this.appSettingService.add(SystemAppSettingKeys.syncIntervalTime, '0.5').subscribe();
    this.appSettingService.add(SystemAppSettingKeys.deviceHubName, 'HP H300').subscribe();
    this.appSettingService.add(SystemAppSettingKeys.printerShareName, '\\\\desktop-6g05lnd\\receipt').subscribe();
    this.appSettingService.add(SystemAppSettingKeys.GST, '7').subscribe();
    this.appSettingService.add(SystemAppSettingKeys.GSTInclusive, 'true').subscribe();

    this.appSettingService.add(SystemAppSettingKeys.synced, 'false').subscribe();
    this.appSettingService.add(SystemAppSettingKeys.lastSync, (new Date(1000, 1, 1)).toString()).subscribe();
    this.appSettingService.add(SystemAppSettingKeys.customerLastSync, (new Date(1000, 1, 1)).toString()).subscribe();
  }

  private initDenomitaions() {
    this.appSettingService.add(DenominationKeys.hundred, '100');
    this.appSettingService.add(DenominationKeys.fifty, '50');
    this.appSettingService.add(DenominationKeys.twenty, '20');
    this.appSettingService.add(DenominationKeys.ten, '10');
    this.appSettingService.add(DenominationKeys.five, '5');
    this.appSettingService.add(DenominationKeys.one, '1');
    this.appSettingService.add(DenominationKeys.noughtPointFive, '0.5');
    this.appSettingService.add(DenominationKeys.noughtPointOne, '0.1');
    this.appSettingService.add(DenominationKeys.noughtPointOhFive, '0.05');
    this.appSettingService.add(DenominationKeys.noughtPointOhOne, '0.01');
  }

  private initDefaultPaymentMethod() {
    this.defaultPaymentMethodService.add(0, 'CASH', DefaultPaymentMethodPageType.payment).subscribe();
    this.defaultPaymentMethodService.add(1, 'NETS', DefaultPaymentMethodPageType.payment).subscribe();
    this.defaultPaymentMethodService.add(2, 'VISA', DefaultPaymentMethodPageType.payment).subscribe();
    this.defaultPaymentMethodService.add(3, 'MASTER', DefaultPaymentMethodPageType.payment).subscribe();
  }
}
