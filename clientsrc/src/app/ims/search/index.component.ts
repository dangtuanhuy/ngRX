import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSearch from '../search/state/search.reducer';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { takeWhile } from 'rxjs/operators';
import * as searchActions from '../search/state/search.action';
import * as searchSelector from '../search/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { User } from 'src/app/shared/base-model/user.model';
import { IndexModel } from './search.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import { SearchService } from 'src/app/shared/services/search.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';
import { IndexType } from './index.constant';
import { VendorService } from 'src/app/shared/services/vendor.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IndexComponent extends ComponentBase {
    constructor(private store: Store<fromSearch.SearchState>,
        private searchService: SearchService,
        private vendorService: VendorService,
        private notificationService: NotificationService,
        public injector: Injector
    ) {
        super(injector);
    }
    public pageSize = 10;
    public addSuccessMessage = 'Index is added.';
    public updateSuccessMessage = 'Index is updated.';
    public deleteSuccessMessage = 'Index is deleted.';

    public componentActive = true;
    public datasource: Array<IndexModel> = [];
    public listButton;
    public title;
    public actionType = ActionType.dialog;
    public selectedId = null;
    public userDefinedColumnSetting: UserDefinedColumnSetting;
    public users: User[] = [];
    public selectedUser: any;

    onInit() {
        this.title = 'Indexes';
        this.handleSubscription(
            this.store
                .pipe(
                    select(fromAuths.getUserId),
                    takeWhile(() => this.componentActive)
                )
                .subscribe((id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.userDefinedColumnSetting = new UserDefinedColumnSetting(
                        `${id}_UserDefinedColumnsIndex`,
                        'userName,iPAddress,context,message,date',
                        environment.app.ims.apiUrl
                    );
                    this.setButtonsConfiguration();
                })
        );

        this.getIndexes();
    }

    onDestroy() { }

    getIndexes() {
        this.store
            .pipe(
                select(searchSelector.getIndexes),
                takeWhile(() => this.componentActive)
            )
            .subscribe((activities: Array<IndexModel>) => {
                this.datasource = activities;
            });
    }

    changeSelectedPage(page: number) {
    }

    setButtonsConfiguration() {
        this.listButton = [];
    }

    onRebuildIndex(index: number) {
        let indexType;
        switch (index) {
            case 0:
                indexType = IndexType.Product;
                break;
            case 1:
                indexType = IndexType.StockLevel;
                break;
        }
        this.searchService.rebuildIndex(indexType).subscribe(res => {
            if (res) {
                this.notificationService.success('Rebuild index success');
            } else {
                this.notificationService.error('Rebuild index fail');
            }
        });
    }

    onRebuildVendors() {
        this.vendorService.rebuildVendors().subscribe(res => {
            if (res) {
                this.notificationService.success('Rebuild vendors success');
            } else {
                this.notificationService.error('Rebuild vendors fail');
            }
        });
    }
}
