import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import * as fromSaleTarget from '../state/sale-target.reducer';
import * as saleTargetActions from '../state/sale-target.action';
import * as saleTargetSelector from '../state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import { takeWhile } from 'rxjs/operators';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { environment } from 'src/environments/environment';
import { ChannelModel } from '../sale-target.model';
import * as moment from 'moment';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

@Component({
    selector: 'app-report-target',
    templateUrl: './report-sale-target.component.html',
    styleUrls: ['./report-sale-target.component.scss'],
})

export class ReportSaleTargetComponent extends ComponentBase {

    public pageSize = 10;
    public title = 'Report Sale Target';
    public datasource: any;
    public componentActive = true;
    public userDefinedColumnSetting: UserDefinedColumnSetting;
    public channels: Array<ChannelModel>;
    public channelSelect: any;
    public today = new Date();
    public dateFillter = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth() + 1, day: new Date().getUTCDate() };

    constructor(public injector: Injector,
        private channelService: ChannelService,
        private store: Store<fromSaleTarget.SaleTargetState>) {
        super(injector);
    }
    onInit() {
        this.channelService.getRetailChannel().subscribe(channels => this.channels = channels);
        this.handleSubscription(this.store.pipe(
            select(fromAuths.getUserId), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.userDefinedColumnSetting = new UserDefinedColumnSetting(
                        `${id}_UserDefinedColumnsReport`,
                        'store,saleTarget,currentSale,shortFall,fromDate,toDate',
                        environment.app.ims.apiUrl
                    );
                }
            ));
    }
    onDestroy() {
    }

    getReportSaleTarget() {
        const dateFillter = this.dateFillter !== null && this.dateFillter !== undefined ?
                                    this.dateFillter.year + '-' + this.dateFillter.month + '-' + this.dateFillter.day
                                    : Date.now();
        const date = moment.utc(dateFillter).format('YYYY-MM-DD');
        this.store.dispatch(new saleTargetActions.GetReportSaleTarget(
            new PagingFilterCriteria(1, this.pageSize), this.channelSelect, date));
        this.store.pipe(select(saleTargetSelector.getReports),
            takeWhile(() => this.componentActive))
            .subscribe(
                (data: any) => {
                    this.datasource = this.setListView(data);
                }
            );
    }

    setListView(data: any): any {
        data.forEach(item => {
            item.toDate = new Date(item.toDate).toDateString();
            item.fromDate = new Date(item.fromDate).toDateString();
            item.saleTarget = this.round(item.saleTarget, 2).toFixed(2);
            item.currentSale = this.round(item.currentSale, 2).toFixed(2);
            item.shortFall = this.round(item.shortFall, 2).toFixed(2);
        });

        return data;
    }

    round(number, decimals) {
        decimals = decimals || 0;
        return (Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
    }
}
