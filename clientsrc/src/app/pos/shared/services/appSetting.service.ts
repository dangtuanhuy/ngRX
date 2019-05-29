import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingRepository } from '../data/appSetting-repository';
import { AppSetting } from '../models/appSetting';

@Injectable({ providedIn: 'root' })
export class AppSettingService {

    constructor(
        private appSettingRepository: AppSettingRepository
    ) { }
    get(): Observable<any> {
        return Observable.create(observer => {
            const categories = this.appSettingRepository.get();

            observer.next(categories);
            observer.complete();
        });
    }

    add(key: string, value: string): Observable<any> {
        return Observable.create(observer => {
            const appSetting = this.appSettingRepository.addAppSetting(key, value);

            observer.next(appSetting);
            observer.complete();
        });
    }

    update(entity: AppSetting): Observable<any> {
        return Observable.create(observer => {
            const appSetting = this.appSettingRepository.updateAppSetting(entity);

            observer.next(appSetting);
            observer.complete();
        });
    }

    getByKey(key: string): Observable<any> {
        return Observable.create(observer => {
            const appSetting = this.appSettingRepository.getByKey(key);

            observer.next(appSetting);
            observer.complete();
        });
    }

    getByKeys(keys: string[]): Observable<AppSetting[]> {
        return Observable.create(observer => {
            const appSettings = this.appSettingRepository.getByKeys(keys);

            observer.next(appSettings);
            observer.complete();
        });
    }
}
