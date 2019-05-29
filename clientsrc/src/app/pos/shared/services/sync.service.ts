import { ServiceBase } from 'src/app/shared/services/service-base';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { environment } from 'src/environments/environment';
import { CategoryRepository } from '../data/category-repository';
import { ProductRepository } from '../data/product-repository';
import { Product } from '../models/product';
import { VariantRepository } from '../data/variant-repository';
import { Variant, VariantStockBalanceModel } from '../models/variant';
import { Customer } from '../models/customer';
import { CustomerRepository } from '../data/customer-repository';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { UnitOfWork } from '../data/unit-of-work';
import { SchemaNames } from '../constants/schema-name.constant';
import { timer, Subscription, Subject, Observable } from 'rxjs';
import { SynchronizationItem } from '../models/synchronization-Item';
import { SynchEntity } from '../enums/synch-entity';
import { EntityBase } from '../models/entity-base';
import { SynchAction } from '../enums/synch-action';
import { AppSettingRepository } from '../data/appSetting-repository';
import { LoggingService } from 'src/app/shared/services/logging.service';
import { LogEntry, LogLevel, Application } from 'src/app/shared/base-model/logging.model';
import { AppContextManager } from '../app-context-manager';
import { AppSettingService } from './appSetting.service';
import { SystemAppSettingKeys } from '../constants/appSetting-key.constant';
import { Guid } from 'src/app/shared/utils/guid.util';
import { OrderRepository } from '../data/order-repository';
import { User } from '../models/user';
import { SyncedDataFlag } from '../enums/sync-data.enum';
import { Promotion } from '../models/promotion';
import { PromotionRepository } from '../data/promotion-repository';
import { DeviceService } from 'src/app/shared/services/device.service';
import { BarCode } from '../models/barcode';
import { BarCodeRepository } from '../data/barcode-repository';
import { UserRepository } from '../data/user-repository';
import { StoreModel } from '../view-models/store.model';
import { AppSetting } from '../models/appSetting';
import { SaleTarget } from '../models/sale-target';
import { SaleTargetRepository } from '../data/sale-target-repository';
import { SyncDataFlowManagerService } from './flow-managers/sync-data-flow-manager.service';
import { SyncDataFlowManagerModel, SyncDataFlowManagerStatus } from './flow-managers/flow-manager-model/sync-data-flow-manager.model';
import { PaymentMethod } from '../models/payment-mode.model';
import { PaymentMethodRepository } from '../data/payment-method-repository';
import { PaymentMethodService } from './payment-method.service';
import { SyncToServerService } from './sync-to-server.service';
import { NotificationType } from '../enums/notification-type.enum';
import { DateExtension } from '../helpers/date.extension';
import { LocationEntity } from '../models/location';
import { LocationRepository } from '../data/location-repository';

@Injectable({ providedIn: 'root' })
export class SyncService extends ServiceBase {
  constructor(
    private syncDataFlowManagerService: SyncDataFlowManagerService,
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
    private variantRepository: VariantRepository,
    private orderRepository: OrderRepository,
    private promotionRepository: PromotionRepository,
    http: HttpClient,
    notificationService: NotificationService,
    private loaderService: LoaderService,
    private unitOfWork: UnitOfWork,
    private appSettingRepository: AppSettingRepository,
    private loggingService: LoggingService,
    private appContextManager: AppContextManager,
    private barCodeRepository: BarCodeRepository,
    private appSettingService: AppSettingService,
    private customerRepository: CustomerRepository,
    private userRepository: UserRepository,
    private saleTargetRepository: SaleTargetRepository,
    private paymentMethodRepository: PaymentMethodRepository,
    private paymentMethodService: PaymentMethodService,
    private deviceService: DeviceService,
    private syncToServerService: SyncToServerService,
    private locationRepository: LocationRepository
  ) {
    super(http, notificationService);
  }

  subcriptionSyncIntervalTime = new Subscription();
  public syncEvent = new Subject<any>();
  subcriptionSyncOrderInfo = new Subscription();
  private syncedCatalogFlag = SyncedDataFlag.None;
  private syncCatalogError = '';
  private isRunning = false;

  FetchCatalog(deviceCode: string, storeId: string): Observable<any> {
    return Observable.create(observer => {
      // this.loaderService.deactivateItem();
      this.syncedCatalogFlag = SyncedDataFlag.None;
      this.syncCatalogError = '';
      this.isRunning = true;

      this.syncUsers(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.User;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncCategories(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Category;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncLocations(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Location;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncBarCodes(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.BarCode;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncProducts(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Product;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncPromotions(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Promotion;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncStore(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Store;
        this.callBackAfterSyncedCatelog(observer);

        this.syncVariants(deviceCode).subscribe((variantError) => {
          this.syncCatalogError += variantError;
          // tslint:disable-next-line:no-bitwise
          this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Variant;
          this.callBackAfterSyncedCatelog(observer);

          if (!variantError) {
            this.syncVariantsStock(deviceCode).subscribe((variantsStockError) => {
              this.syncCatalogError += variantsStockError;
              // tslint:disable-next-line:no-bitwise
              this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.VariantStockBalance;
              this.callBackAfterSyncedCatelog(observer);
            });
          }

        });
      });

      this.syncSaleTarget(deviceCode, storeId).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.SaleTarget;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncPaymentMethods(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.PaymentMethod;
        this.callBackAfterSyncedCatelog(observer);
      });

      this.syncCustomers(deviceCode).subscribe((error) => {
        this.syncCatalogError += error;
        // tslint:disable-next-line:no-bitwise
        this.syncedCatalogFlag = this.syncedCatalogFlag | SyncedDataFlag.Customer;
        this.callBackAfterSyncedCatelog(observer);
      });

      // this.loaderService.activateItem();
    });
  }

  public Run(deviceCode: string, dueTime: number = 3000, periodeOrScheduler: number = 10000): boolean {
    this.isRunning = false;
    const sync = timer(dueTime, periodeOrScheduler);
    this.subcriptionSyncIntervalTime = sync.subscribe(x => {
      this.syncEvent.next(true);
      console.log('sync started!');
      if (!this.appContextManager.isNetworkAvailable()) {
        this.isRunning = false;
        this.syncEvent.next(false);
        return;
      }

      this.appContextManager.detectServerAvailable().subscribe((result: any) => {
        if (result) {
          if (this.isRunning) {
            console.log('sync is running...');
            return;
          }

          this.appSettingService.getByKey(SystemAppSettingKeys.storeId)
            .subscribe((storeIdAppSetting: AppSetting) => {
              console.log(storeIdAppSetting);
              if (storeIdAppSetting) {
                this.FetchCatalog(deviceCode, storeIdAppSetting.value).subscribe(error => {

                });
              }
            }, error => {
              console.log(error);
            });
        } else {
          this.isRunning = false;
        }
      }, (error) => {
        console.log('error server');
        // this.appContextManager.notification(NotificationType.warning,
        //     'The device you are using is in offline mode or the server is not available');
      });
    });
    return true;
  }

  public resetSyncIntervalTime() {
    if (this.subcriptionSyncIntervalTime) {
      this.subcriptionSyncIntervalTime.unsubscribe();
    }
    if (this.subcriptionSyncOrderInfo) {
      this.subcriptionSyncOrderInfo.unsubscribe();
    }
    this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(appSettingDeviceCode => {
      if (appSettingDeviceCode) {
        this.appSettingService.getByKey(SystemAppSettingKeys.syncIntervalTime).subscribe(appSettingSyncInterTime => {
          if (appSettingSyncInterTime) {
            this.Run(appSettingDeviceCode.value, 6000, Number(appSettingSyncInterTime.value) * 60 * 1000);
          }
        });
      }
    });
  }

  private syncCustomers(deviceCode: string): Observable<string> {
    const customerLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.customerLastSync);
    const customerLastsync = customerLastsyncAppSetting ? customerLastsyncAppSetting.value : null;
    let customerLastSyncParam = '1000-01-01 0:1:0';
    let isTheFirstSync = true;
    if (customerLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(customerLastsync);
      customerLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate() + 1}`;
      customerLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Customer,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing customers...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/customers?lastSync=${customerLastSyncParam}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((customers: any[]) => {
        try {
          this.unitOfWork.beginTransaction();
          if (isTheFirstSync) {
            this.unitOfWork.deleteAll(SchemaNames.customer);
            this.addCustomersToUnitOfWork(this.unitOfWork, customers);
          } else {
            this.addOrUpdateCustomersToUnitOfWork(this.unitOfWork, customers);
          }

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (customerLastsyncAppSetting) {
            customerLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(customerLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.customerLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Customer,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private addCustomersToUnitOfWork(unitOfWork: UnitOfWork, customers: any[]) {
    customers.forEach(customer => {
      this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
        key: SyncedDataFlag.Customer,
        status: SyncDataFlowManagerStatus.Inprogress
      }));

      const realmCustomer = new Customer();
      realmCustomer.id = customer.id;
      realmCustomer.name = customer.firstName ? customer.firstName : '';
      realmCustomer.name += ` ${customer.lastName ? customer.lastName : ''}`;
      realmCustomer.phoneNumber = customer.phoneNumber ? customer.phoneNumber : '';
      realmCustomer.loyaltyPoint = customer.loyaltyPoint;
      realmCustomer.walletPoint = customer.walletPoint;
      realmCustomer.customerCode = customer.customerCode;
      realmCustomer.reward = 0;
      realmCustomer.store = 0;
      realmCustomer.visit = 0;
      realmCustomer.isDelete = customer.isActive === true ? false : true;

      this.unitOfWork.add(SchemaNames.customer, realmCustomer);
    });
  }

  private addOrUpdateCustomersToUnitOfWork(unitOfWork: UnitOfWork, customers: any[]) {
    customers.forEach(customer => {
      this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
        key: SyncedDataFlag.Customer,
        status: SyncDataFlowManagerStatus.Inprogress
      }));

      const realmCustomer = new Customer();
      realmCustomer.id = customer.id;
      realmCustomer.name = customer.firstName ? customer.firstName : '';
      realmCustomer.name += ` ${customer.lastName ? customer.lastName : ''}`;
      realmCustomer.phoneNumber = customer.phoneNumber ? customer.phoneNumber : '';
      realmCustomer.loyaltyPoint = customer.loyaltyPoint;
      realmCustomer.walletPoint = customer.walletPoint;
      realmCustomer.customerCode = customer.customerCode;
      realmCustomer.reward = 0;
      realmCustomer.store = 0;
      realmCustomer.visit = 0;
      realmCustomer.isDelete = customer.isActive === true ? false : true;

      const existedCustomer = this.customerRepository.getById(customer.id);
      if (existedCustomer) {
        this.unitOfWork.update(SchemaNames.customer, realmCustomer);
      } else {
        this.unitOfWork.add(SchemaNames.customer, realmCustomer);
      }
    });
  }

  private syncUsers(deviceCode: string): Observable<string> {
    const userLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.userLastSync);
    const userLastsync = userLastsyncAppSetting ? userLastsyncAppSetting.value : null;
    let userLastSyncParam = '1000-01-01 0:1:0';
    let isTheFirstSync = true;
    if (userLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(userLastsync);
      userLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      userLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.User,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing users...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/staffs?lastSync=${userLastSyncParam}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((users: any[]) => {
        if (users.length === 0) {
          observer.next('');
          observer.complete();
          return;
        }
        try {
          this.unitOfWork.beginTransaction();

          if (isTheFirstSync) {
            this.unitOfWork.deleteAll(SchemaNames.user);
            this.userRepository.addUsersToUnitOfWork(this.unitOfWork, users);
          } else {
            this.userRepository.addOrUpdateUsersToUnitOfWork(this.unitOfWork, users);
          }

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (userLastsyncAppSetting) {
            userLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(userLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.userLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.User,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncCategories(deviceCode: string): Observable<string> {
    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Category,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing categories...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/catalog/categories`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((categories: Category[]) => {
        if (categories.length === 0) {
          observer.next('');
          observer.complete();
          return;
        }
        try {
          this.unitOfWork.beginTransaction();
          const newCategoryIds = categories.map(x => x.id);
          const deletedCategoryIds = this.categoryRepository.get()
            .map(x => x.id)
            .filter(x => !newCategoryIds.includes(x));

          deletedCategoryIds.forEach(deletedCategoryId => {
            this.unitOfWork.delete(SchemaNames.category, deletedCategoryId);
          });

          categories.forEach(category => {
            category.isDelete = false;
            const existedCategory = this.categoryRepository.getById(category.id);
            if (existedCategory) {
              this.unitOfWork.update(SchemaNames.category, category);
            } else {
              this.unitOfWork.add(SchemaNames.category, category);
            }
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Category,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncLocations(deviceCode: string): Observable<string> {
    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Location,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing locations...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/locations`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((locations: LocationEntity[]) => {
        if (locations.length === 0) {
          observer.next('');
          observer.complete();
          return;
        }
        try {
          this.unitOfWork.beginTransaction();
          const newLocationIds = locations.map(x => x.id);
          const deletedLocationIds = this.locationRepository.get()
            .map(x => x.id)
            .filter(x => !newLocationIds.includes(x));

          deletedLocationIds.forEach(deletedLocationId => {
            this.unitOfWork.delete(SchemaNames.location, deletedLocationId);
          });

          locations.forEach(location => {
            const existedLocation = this.locationRepository.getById(location.id);
            if (existedLocation) {
              this.unitOfWork.update(SchemaNames.location, location);
            } else {
              this.unitOfWork.add(SchemaNames.location, location);
            }
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Location,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncBarCodes(deviceCode: string): Observable<string> {
    const barCodeLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.barCodeLastSync);
    const barCodeLastsync = barCodeLastsyncAppSetting ? barCodeLastsyncAppSetting.value : null;
    let barCodeLastSyncParam = '1000-01-01 0:1:0';
    let isTheFirstSync = true;
    if (barCodeLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(barCodeLastsync);
      barCodeLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      barCodeLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.BarCode,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing barcodes...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/catalog/barcodes?lastSync=${barCodeLastSyncParam}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((barCodes: BarCode[]) => {
        if (barCodes.length === 0) {
          observer.next('');
          observer.complete();
          return;
        }
        try {
          this.unitOfWork.beginTransaction();

          if (isTheFirstSync) {
            this.unitOfWork.deleteAll(SchemaNames.barCode);
            this.barCodeRepository.addBarCodesToUnitOfWork(this.unitOfWork, barCodes);
          } else {
            barCodes.forEach(barCode => {
              barCode.isDelete = false;
              const existedBarcode = this.barCodeRepository.getById(barCode.id);
              if (existedBarcode) {
                this.unitOfWork.update(SchemaNames.barCode, barCode);
              } else {
                this.unitOfWork.add(SchemaNames.barCode, barCode);
              }
            });
          }

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (barCodeLastsyncAppSetting) {
            barCodeLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(barCodeLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.barCodeLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.BarCode,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  public syncPaymentMethods(deviceCode: string): Observable<string> {
    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.PaymentMethod,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing payment methods...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/catalog/paymentMethods`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((catalogPaymentMethods: any[]) => {
        if (catalogPaymentMethods.length === 0) {
          observer.next('');
          observer.complete();
        }
        try {
          this.unitOfWork.beginTransaction();
          const paymentModeIconDefault = this.paymentMethodService.paymentModeIconDefault;
          const paymentModeList = this.paymentMethodService.paymentModeList;

          catalogPaymentMethods.forEach(catalogPaymentMethod => {
            const paymentMethod = new PaymentMethod();
            paymentMethod.id = catalogPaymentMethod.id;
            paymentMethod.code = catalogPaymentMethod.code;
            paymentMethod.paymode = catalogPaymentMethod.name;

            const correspondingPaymentMethod = paymentModeList.find(x => x.code === catalogPaymentMethod.code);
            paymentMethod.icon = correspondingPaymentMethod ? correspondingPaymentMethod.icon : paymentModeIconDefault;
            paymentMethod.isDelete = false;
            paymentMethod.slipno = '';

            const existedPaymentMethod = this.paymentMethodRepository.getById(paymentMethod.id);
            if (existedPaymentMethod) {
              this.unitOfWork.update(SchemaNames.paymentMethod, paymentMethod);
            } else {
              this.unitOfWork.add(SchemaNames.paymentMethod, paymentMethod);
            }
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.PaymentMethod,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncProducts(deviceCode: string): Observable<string> {
    const productLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.productLastSync);
    const productLastsync = productLastsyncAppSetting ? productLastsyncAppSetting.value : null;
    let productLastSyncParam = '0001-01-01 0:1:0';
    let isTheFirstSync = true;
    if (productLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(productLastsync);
      productLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      productLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Product,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing products...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/catalog/products?lastSync=${productLastSyncParam}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((products: Product[]) => {
        try {
          if (products.length === 0) {
            observer.next('');
            observer.complete();
            return;
          }

          this.unitOfWork.beginTransaction();

          if (isTheFirstSync) {
            this.unitOfWork.deleteAll(SchemaNames.product);
            this.productRepository.addProductsToUnitOfWork(this.unitOfWork, products);
          } else {
            products.forEach(product => {
              const existedProduct = this.productRepository.getById(product.id);
              if (existedProduct) {
                this.unitOfWork.update(SchemaNames.product, product);
              } else {
                this.unitOfWork.add(SchemaNames.product, product);
              }
            });
          }

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (productLastsyncAppSetting) {
            productLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(productLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.productLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Product,
            status: SyncDataFlowManagerStatus.Success
          }));

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });

    });
  }

  private syncVariants(deviceCode: string): Observable<string> {
    const variantLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.variantLastSync);
    const variantLastsync = variantLastsyncAppSetting ? variantLastsyncAppSetting.value : null;
    let variantLastSyncParam = '';
    if (variantLastsync) {
      const lastSyncDateUTC = new Date(variantLastsync);
      variantLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      variantLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Variant,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing variants...');

      const storeIdAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.storeId);
      const storeId = storeIdAppSetting ? storeIdAppSetting.value : '';

      let url = `${environment.app.retail.apiUrl}/api/syncs/catalog/variants`;
      url += `?locationId=${storeId}`;
      url += variantLastSyncParam ? `&lastSync=${variantLastSyncParam}` : '';
      this.get(
        url,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((variants: Variant[]) => {
        try {
          const variantIds = variants.map(x => x.id);
          if (!variantIds.length) {
            observer.next('');
            observer.complete();
            return;
          }
          const existedVariants = this.variantRepository.getByVariantIds(variantIds);
          const existedVariantIds = existedVariants.map(x => x.variantId);

          const newVariants = variants.filter(x => !existedVariantIds.includes(x.id));
          const updateVariants = variants.filter(x => existedVariantIds.includes(x.id));

          this.unitOfWork.beginTransaction();

          newVariants.forEach(newVariant => {
            newVariant.id = Guid.newGuid();
            this.unitOfWork.add(SchemaNames.variant, newVariant);
          });

          updateVariants.forEach(updateVariant => {
            const correspondingExistedVariant = existedVariants.find(x => x.variantId === updateVariant.id);
            updateVariant.quantity = correspondingExistedVariant.quantity;
            updateVariant.id = correspondingExistedVariant.id;
            this.unitOfWork.update(SchemaNames.variant, updateVariant);
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Variant,
            status: SyncDataFlowManagerStatus.Success
          }));

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          const updateVariantLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.variantLastSync);
          if (updateVariantLastsyncAppSetting) {
            updateVariantLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(updateVariantLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.variantLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }

      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncPromotions(deviceCode: string): Observable<string> {
    const promotionLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.promotionLastSync);
    const promotionLastsync = promotionLastsyncAppSetting ? promotionLastsyncAppSetting.value : null;
    let promotionLastSyncParam = '1000-01-01 0:1:0';
    let isTheFirstSync = true;
    if (promotionLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(promotionLastsync);
      promotionLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      promotionLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Promotion,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing promotions...');
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/catalog/promotions?lastSync=${promotionLastSyncParam}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((promotions: Promotion[]) => {
        try {
          if (promotions.length === 0) {
            observer.next('');
            observer.complete();
          }
          this.unitOfWork.beginTransaction();

          promotions.forEach(promotion => {

            const existedPromotion = this.promotionRepository.getById(promotion.id);
            if (existedPromotion) {
              this.unitOfWork.update(SchemaNames.promotion, promotion);
            } else {
              this.unitOfWork.add(SchemaNames.promotion, promotion);
            }
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.Promotion,
            status: SyncDataFlowManagerStatus.Success
          }));

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (promotionLastsyncAppSetting) {
            promotionLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(promotionLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.promotionLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }

      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncStore(deviceCode: string): Observable<string> {
    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.Store,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/store/${deviceCode}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((store: StoreModel) => {
        if (store) {
          try {
            this.unitOfWork.beginTransaction();

            const keys = [SystemAppSettingKeys.storeId, SystemAppSettingKeys.storeName, SystemAppSettingKeys.storeAddress];
            const storeAppSettings = this.appSettingRepository.getByKeys(keys);

            let storeIdAppSetting = storeAppSettings.find(x => x.key === SystemAppSettingKeys.storeId);
            if (storeIdAppSetting) {
              storeIdAppSetting.value = store.id;
              this.unitOfWork.update(SchemaNames.appSetting, storeIdAppSetting);
            } else {
              storeIdAppSetting = new AppSetting();
              storeIdAppSetting.id = Guid.newGuid();
              storeIdAppSetting.key = SystemAppSettingKeys.storeId;
              storeIdAppSetting.value = store.id;
              this.unitOfWork.add(SchemaNames.appSetting, storeIdAppSetting);
            }

            let storeNameAppSetting = storeAppSettings.find(x => x.key === SystemAppSettingKeys.storeName);
            if (storeNameAppSetting) {
              storeNameAppSetting.value = store.name;
              this.unitOfWork.update(SchemaNames.appSetting, storeNameAppSetting);
            } else {
              storeNameAppSetting = new AppSetting();
              storeNameAppSetting.id = Guid.newGuid();
              storeNameAppSetting.key = SystemAppSettingKeys.storeName;
              storeNameAppSetting.value = store.name;
              this.unitOfWork.add(SchemaNames.appSetting, storeNameAppSetting);
            }

            let storeAddressAppSetting = storeAppSettings.find(x => x.key === SystemAppSettingKeys.storeAddress);
            if (storeAddressAppSetting) {
              storeAddressAppSetting.value = store.address;
              this.unitOfWork.update(SchemaNames.appSetting, storeAddressAppSetting);
            } else {
              storeAddressAppSetting = new AppSetting();
              storeAddressAppSetting.id = Guid.newGuid();
              storeAddressAppSetting.key = SystemAppSettingKeys.storeAddress;
              storeAddressAppSetting.value = store.address;
              this.unitOfWork.add(SchemaNames.appSetting, storeAddressAppSetting);
            }

            this.unitOfWork.saveChanges();
            this.loaderService.updateDescription('');

            this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
              key: SyncedDataFlag.Store,
              status: SyncDataFlowManagerStatus.Success
            }));

            this.appContextManager.triggerStoreNameAppSetting(storeNameAppSetting);

            observer.next('');
            observer.complete();
          } catch (e) {
            this.loaderService.updateDescription('');
            observer.next(e);
            observer.complete();
          }
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncSaleTarget(deviceCode: string, storeId: string): Observable<string> {
    const saleTargetLastsyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.saleTargetLastSync);
    const saleTargetLastsync = saleTargetLastsyncAppSetting ? saleTargetLastsyncAppSetting.value : null;
    let saleTargetLastSyncParam = '1000-01-01 0:1:0';
    let isTheFirstSync = true;
    if (saleTargetLastsync) {
      isTheFirstSync = false;
      const lastSyncDateUTC = new Date(saleTargetLastsync);
      saleTargetLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      saleTargetLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.SaleTarget,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.get(
        `${environment.app.retail.apiUrl}/api/syncs/saleTargets?lastSync=${saleTargetLastSyncParam}&&storeId=${storeId}`,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((saleTargets: SaleTarget[]) => {
        try {
          if (saleTargets.length === 0) {
            observer.next('');
            observer.complete();
          }
          this.unitOfWork.beginTransaction();

          if (isTheFirstSync) {
            this.unitOfWork.deleteAll(SchemaNames.promotion);
            this.saleTargetRepository.addSaleTargetsToUnitOfWork(this.unitOfWork, saleTargets);
          } else {
            saleTargets.forEach(saleTarget => {
              const existedSaleTarget = this.saleTargetRepository.getById(saleTarget.id);
              if (existedSaleTarget) {
                this.unitOfWork.update(SchemaNames.saleTarget, saleTarget);
              } else {
                this.unitOfWork.add(SchemaNames.saleTarget, saleTarget);
              }
            });
          }

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);
          if (saleTargetLastsyncAppSetting) {
            saleTargetLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(saleTargetLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.saleTargetLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.SaleTarget,
            status: SyncDataFlowManagerStatus.Success
          }));

          this.appContextManager.triggerGetSaleTarget();

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private syncVariantsStock(deviceCode: string): Observable<string> {
    const variantStockBalanceLastSyncAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.variantStockBalanceLastSync);
    const variantStockBalanceLastSync = variantStockBalanceLastSyncAppSetting ? variantStockBalanceLastSyncAppSetting.value : null;
    let variantStockBalanceLastSyncParam = '';
    if (variantStockBalanceLastSync) {
      const lastSyncDateUTC = new Date(variantStockBalanceLastSync);
      variantStockBalanceLastSyncParam = `${lastSyncDateUTC.getFullYear()}-${lastSyncDateUTC.getMonth() + 1}-${lastSyncDateUTC.getDate()}`;
      variantStockBalanceLastSyncParam += ` ${lastSyncDateUTC.getHours()}:${lastSyncDateUTC.getMinutes()}:${lastSyncDateUTC.getSeconds()}`;
    }

    const storeIdAppSetting = this.appSettingRepository.getByKey(SystemAppSettingKeys.storeId);
    const storeId = storeIdAppSetting ? storeIdAppSetting.value : '';

    this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
      key: SyncedDataFlag.VariantStockBalance,
      status: SyncDataFlowManagerStatus.Inprogress
    }));

    return Observable.create(observer => {
      this.loaderService.updateDescription('syncing categories...');
      let url = `${environment.app.retail.apiUrl}/api/syncs/catalog/stockbalance`;
      url += `?locationId=${storeId}`;
      url += variantStockBalanceLastSyncParam ? `&lastSync=${variantStockBalanceLastSyncParam}` : '';
      this.get(
        url,
        new HttpHeaders({
          'x-device-code': deviceCode
        })
      ).subscribe((variantStockBanlance: VariantStockBalanceModel[]) => {
        try {
          const variantIds = variantStockBanlance.map(x => x.variantId);
          if (variantIds.length === 0) {
            observer.next('');
            observer.complete();
            return;
          }

          const variants = this.variantRepository.getByVariantIds(variantIds);
          this.unitOfWork.beginTransaction();

          variants.forEach(variant => {
            const correspondingVariantStock = variantStockBanlance.find(x => x.variantId === variant.variantId);
            if (correspondingVariantStock) {
              variant.quantity = correspondingVariantStock.quantity;
            }

            this.unitOfWork.update(SchemaNames.variant, variant);
          });

          this.unitOfWork.saveChanges();
          this.loaderService.updateDescription('');

          this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
            key: SyncedDataFlag.VariantStockBalance,
            status: SyncDataFlowManagerStatus.Success
          }));

          const d1 = new Date(),
            lastSync = new Date();
          lastSync.setMinutes(d1.getMinutes() - 3);

          const updateVariantStockBalanceLastsyncAppSetting =
            this.appSettingRepository.getByKey(SystemAppSettingKeys.variantStockBalanceLastSync);
          if (updateVariantStockBalanceLastsyncAppSetting) {
            updateVariantStockBalanceLastsyncAppSetting.value = DateExtension.convertLocalDateToUTCDate(lastSync).toString();
            this.appSettingService.update(updateVariantStockBalanceLastsyncAppSetting).subscribe();
          } else {
            this.appSettingService.add(SystemAppSettingKeys.variantStockBalanceLastSync,
              DateExtension.convertLocalDateToUTCDate(lastSync).toString()).subscribe();
          }

          observer.next('');
          observer.complete();
        } catch (e) {
          this.loaderService.updateDescription('');
          observer.next(e);
          observer.complete();
        }
      }, (error) => {
        this.loaderService.updateDescription('');
        observer.next(error);
        observer.complete();
      });
    });
  }

  private callBackAfterSyncedCatelog(observer: any) {
    if (this.syncedCatalogFlag === SyncedDataFlag.All) {
      this.isRunning = false;
      observer.next(this.syncCatalogError);
      observer.complete();
    }
  }

  subcribeSyncDataEvent(): Observable<boolean> {
    return this.syncEvent.asObservable();
  }

  public getStore(deviceCode: string) {
    return this.get(
      `${environment.app.retail.apiUrl}/api/syncs/store/${deviceCode}`,
      new HttpHeaders({
        'x-device-code': deviceCode
      })
    );
  }
}
