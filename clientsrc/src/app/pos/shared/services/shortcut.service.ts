import { Injectable } from '@angular/core';
import { ShortcutModel } from '../models/shortcut.model';
import { FakeService } from './fake.service';
import { AppSettingModel } from 'src/app/shared/base-model/appsetting.model';
import { PageConstants } from '../constants/common.constant';
import { Subject } from 'rxjs';
import { FunctionConstants, ShortKeyConstants, FeatureConstants } from '../../contents/quick-select/quick-select.constants';

@Injectable()
export class ShortcutService {
    private shortcuts: ShortcutModel[] = [];
    private quickSelectShortcuts: ShortcutModel[] = [];

    public shortcutsSubject = new Subject<any>();
    public quickSelectShortcutsSubject = new Subject<any>();

    constructor(
        private fakeService: FakeService
    ) { }

    public GetAllShortcut() {
        this.fakeService.getAppsettingShortcuts().subscribe((appSettings: AppSettingModel[]) => {
            this.shortcuts = [
                new ShortcutModel({
                    id: '0', key: ShortKeyConstants.NewSale,
                    name: 'New sale', page: PageConstants.quickSelect, shortcut: 'F1'
                }),
                new ShortcutModel({
                    id: '1', key: ShortKeyConstants.SaveSale,
                    name: 'Save sale', page: PageConstants.quickSelect, shortcut: 'F2'
                }),
                new ShortcutModel({
                    id: '8', key: ShortKeyConstants.Promotion,
                    name: 'Promotion', page: PageConstants.quickSelect, shortcut: 'F4'
                }),

                new ShortcutModel({
                    id: '2', key: FunctionConstants.Payment,
                    name: 'Payment', page: PageConstants.quickSelect, shortcut: 'F3'
                }),

                new ShortcutModel({
                    id: '3', key: FeatureConstants.RecentSales,
                    name: 'Recent sale', page: PageConstants.quickSelect, shortcut: 'F10'
                }),
                new ShortcutModel({
                    id: '4', key: FeatureConstants.PendingSales,
                    name: 'Pending sale', page: PageConstants.quickSelect, shortcut: 'F5'
                }),
                new ShortcutModel({
                    id: '5', key: FeatureConstants.PickupOrders,
                    name: 'Pick orders', page: PageConstants.quickSelect, shortcut: 'F6'
                }),
                new ShortcutModel({
                    id: '6', key: FeatureConstants.OpenDay,
                    name: 'Open day', page: PageConstants.quickSelect, shortcut: 'F7'
                }),
                new ShortcutModel({
                    id: '7', key: FeatureConstants.ManageShortcut,
                    name: 'App settings', page: PageConstants.quickSelect, shortcut: 'F8'
                }),
                new ShortcutModel({
                    id: '8', key: FeatureConstants.StockAndPriceLookup,
                    name: 'Stock-price', page: PageConstants.quickSelect, shortcut: 'F9'
                }),
                new ShortcutModel({
                    id: '8', key: FeatureConstants.CustomerManagement,
                    name: 'Customers', page: PageConstants.quickSelect, shortcut: 'F11'
                })
            ];
            this.shortcutsSubject.next(this.shortcuts);

            this.quickSelectShortcuts = this.shortcuts.filter(x => x.page === PageConstants.quickSelect);
            this.quickSelectShortcutsSubject.next(this.quickSelectShortcuts);
        });
    }

    public updateShortcut(shortcuts: ShortcutModel[]) {
        this.shortcuts = shortcuts;
    }

    public loadShortcuts() {
        this.shortcutsSubject.next(this.shortcuts);
    }

    public loadShortcutsByPage(pageName: string) {
        if (pageName === PageConstants.quickSelect) {
            this.quickSelectShortcutsSubject.next(this.quickSelectShortcuts);
        }
    }
}
