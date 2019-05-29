import { Injectable } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { AppSettingRepository } from '../data/appSetting-repository';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UnitOfWork } from '../data/unit-of-work';
import { SynchronizationItem } from '../models/synchronization-Item';
import { LoggingService } from 'src/app/shared/services/logging.service';
import { LogEntry, LogLevel, Application } from 'src/app/shared/base-model/logging.model';
import { SynchEntity } from '../enums/synch-entity';
import { CategoryRepository } from '../data/category-repository';
import { SynchAction } from '../enums/synch-action';
import { EntityBase } from '../models/entity-base';
import { AppSettingService } from './appSetting.service';
import { SystemAppSettingKeys } from '../constants/appSetting-key.constant';
import { AppContextManager } from '../app-context-manager';
import { DeviceService } from 'src/app/shared/services/device.service';
import { OrderRepository } from '../data/order-repository';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable({ providedIn: 'root' })
export class SyncToServerService {
    subcriptionSyncOrderInfo = new Subscription();

    constructor(
        private loggingService: LoggingService,
        private appSettingService: AppSettingService,
        private appContextManager: AppContextManager,
        private deviceService: DeviceService,
        private orderRepository: OrderRepository,
        private http: HttpClient
    ) { }

    public resetSyncIntervalTime() {
        if (this.subcriptionSyncOrderInfo) {
            this.subcriptionSyncOrderInfo.unsubscribe();
        }
        this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(appSettingDeviceCode => {
            if (appSettingDeviceCode) {
                this.appSettingService.getByKey(SystemAppSettingKeys.syncIntervalTime).subscribe(appSettingSyncInterTime => {
                    let timeSyncMinute = 0.5;
                    if (appSettingSyncInterTime) {
                        timeSyncMinute = Number(appSettingSyncInterTime.value);
                    }

                    this.SyncOrderInfo(appSettingDeviceCode.value, 3000, timeSyncMinute * 60 * 1000);
                });
            }
        });
    }

    public SyncOrderInfo(deviceCode: string, dueTime: number = 3000, periodeOrScheduler: number = 10000) {
        const sync = timer(dueTime, periodeOrScheduler);
        this.subcriptionSyncOrderInfo = sync.subscribe(x => {
            console.log('sync started!');
            if (!this.appContextManager.isNetworkAvailable()) {
                return;
            }

            this.appContextManager.detectServerAvailable().subscribe((serverAvailabel: any) => {
                if (serverAvailabel) {
                    this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(deviceCodeAppSetting => {
                        if (!deviceCodeAppSetting) {
                            return;
                        }

                        this.deviceService.getDeviceByDeviceCode(deviceCodeAppSetting.value).subscribe(device => {
                            if (!device) {
                                return;
                            }

                            const listOrders: any[] = this.orderRepository.getOrdersInformation([], true);
                            listOrders.forEach(order => {
                                order.storeId = device.storeId;
                            });

                            let listOrdersNotSync = listOrders.filter(order => !order.synced);
                            if (listOrdersNotSync && listOrdersNotSync.length > 0) {
                                const options = {
                                    headers: new HttpHeaders({
                                        'x-device-code': deviceCode
                                    })
                                };

                                const orderIds = listOrders.map(order => order.id);
                                this.http.post(
                                    `${environment.app.retail.apiUrl}/api/catalog/orders/list/checkSyncStatus`,
                                    orderIds,
                                    options
                                ).subscribe((syncdOrderIds: string[]) => {
                                    this.orderRepository.updateSyncedOrders(syncdOrderIds);

                                    listOrdersNotSync = listOrdersNotSync.filter(order => !syncdOrderIds.includes(order.id));
                                    this.http.post(
                                        `${environment.app.retail.apiUrl}/api/syncs/sales`,
                                        listOrdersNotSync,
                                        options
                                    ).subscribe(result => {
                                    }, err => {
                                        if (this.appContextManager.isNetworkAvailable()) {
                                            this.loggingService.add(new LogEntry({
                                                logLevel: LogLevel.Error,
                                                message: err,
                                                application: Application.Pos
                                            }));
                                        }
                                    });
                                }, err => {
                                    if (this.appContextManager.isNetworkAvailable()) {
                                        this.loggingService.add(new LogEntry({
                                            logLevel: LogLevel.Error,
                                            message: err,
                                            application: Application.Pos
                                        }));
                                    }
                                });
                            }
                        });
                    });
                }
            }, (error) => {
                // this.appContextManager.notification(NotificationType.warning,
                //     'The device you are using is in offline mode or the server is not available');
            });
        });
        return true;
    }
}
