import { Injectable } from '@angular/core';
import { ServiceBase } from 'src/app/shared/services/service-base';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppSettingRepository } from '../../data/appSetting-repository';
import { AppSettingService } from '../appSetting.service';

@Injectable({ providedIn: 'root' })
export class PosProductServerService {
    constructor(
        private http: HttpClient,
        private appSettingRepository: AppSettingRepository,
        private appSettingService: AppSettingService
    ) {
    }

    getStockByVariants(deviceCode: string, variantIds: string[]) {
        return this.http.post(
            `${environment.app.retail.apiUrl}/api/stocks/all`,
            variantIds,
            {
                headers: new HttpHeaders({
                    'x-device-code': deviceCode
                })
            }

        );
    }
}
