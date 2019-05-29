import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PromotionModel, PromotionStatus, PromotionModelToDisplay, PromotionType } from '../promotion.model';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import * as fromPromotion from './state/promotion.reducer';
import * as promotionActions from './state/promotion.action';
import * as promotionSelector from './state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import * as fromAuths from '../../shared/components/auth/state/index';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { environment } from 'src/environments/environment';
import { AddDiscountPromotionComponent } from './add-discount-promotion/add-discount-promotion.component';
import { UpdatePromotionStatusComponent } from './update-promotion-status/update-promotion-status.component';
import { UpdateDiscountPromotionComponent } from './update-discount-promotion/update-discount-promotion.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-discount-promotion',
    templateUrl: './discount-promotion.component.html',
    styleUrls: ['./discount-promotion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DiscountPromotionComponent extends ComponentBase {

    public addSuccessMessage = 'Promotion is added.';
    public updateSuccessMessage = 'Promotion is updated.';
    public deleteSuccessMessage = 'Promotion is deleted.';
    public datasource: Array<any> = [];
    public listButton = Array<Button>();
    public title;
    public pageSize = 10;
    public actionType = ActionType.dialog;
    public selectedId = null;
    componentActive = true;
    userDefinedColumnSetting: UserDefinedColumnSetting;
    isHiddenSearchBox = true;

    constructor(private store: Store<fromPromotion.PromotionState>,
        public injector: Injector,
        public datePipe: DatePipe) {
        super(injector);
    }

    onInit() {
        this.title = 'Promotions';

        this.handleSubscription(this.store.pipe(
            select(fromAuths.getUserId), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.userDefinedColumnSetting = new UserDefinedColumnSetting(
                        `${id}_UserDefinedColumnsPromotion`,
                        'name,description',
                        environment.app.promotion.apiUrl
                    );
                    this.setButtonsConfiguration();
                }
            ));

        this.handleSubscription(this.store.pipe(
            select(promotionSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string | null) => {
                    if (id) {
                        this.changeListButton(false);
                    } else {
                        this.changeListButton(true);
                    }
                }
            ));

        this.getPromotions();
    }

    onDestroy() {
        this.componentActive = false;
    }

    changeSelectedPage(page: number) {
        this.store.dispatch(new promotionActions.GetPromotions(new PagingFilterCriteria(page + 1, this.pageSize)));
    }


    setButtonsConfiguration() {
        this.listButton = [
            new Button({
                id: 1,
                title: 'Add',
                component: AddDiscountPromotionComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: false
            }),
            new Button({
                id: 2,
                title: 'Update status',
                component: UpdatePromotionStatusComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            }),
            new Button({
                id: 2,
                title: 'Edit',
                component: UpdateDiscountPromotionComponent,
                configDialog: { size: 'lg', centered: true, backdrop: 'static' },
                disable: true
            })
            // new Button({
            //     id: 2,
            //     title: 'Delete',
            //     component: DeleteFieldTemplateComponent,
            //     configDialog: { size: 'lg', centered: true, backdrop: 'static' },
            //     disable: true
            // })
        ];
    }

    changeListButton(isDisabled: boolean) {
        if (!this.listButton) {
            return;
        }
        this.listButton.forEach(btn => {
            if (btn.title === 'Update status' || btn.title === 'Delete' || btn.title === 'Edit') {
                btn.disable = isDisabled;
            }
        });
    }

    getPromotions() {
        this.store.dispatch(new promotionActions.GetPromotions(new PagingFilterCriteria(1, this.pageSize)));
        this.store.pipe(select(promotionSelector.getPromotions),
            takeWhile(() => this.componentActive))
            .subscribe(
                (result: Array<PromotionModel>) => {
                    const promotions = new Array<PromotionModel>();
                    if (result) {
                        result.forEach(x => {
                            const promotion = new PromotionModel(x);
                            promotions.push(promotion);
                        });
                    }

                    this.datasource = promotions.map(promotion => {
                        this.FilterDataToDisplay(promotion);
                        return this.FilterDataToDisplay(promotion);
                    });
                }
            );
    }

    FilterDataToDisplay(data: PromotionModel): PromotionModelToDisplay  {
        const result = new PromotionModelToDisplay({});
        result.name = data.name;
        result.id = data.id;
        result.description = data.description;
        result.fromDate = this.datePipe.transform(new Date(data.fromDate), 'dd/MM/yyyy');
        result.toDate = this.datePipe.transform(new Date(data.toDate), 'dd/MM/yyyy');
        result.locations  = '';
        data.locations.forEach(x => {
            result.locations += `${x.name},`;
        });
        if (data.locations.length > 0) {
            result.locations = result.locations.substr(0, result.locations.length - 1);
        }
        result.status = PromotionStatus[data.status].toString();
        result.promotionType = PromotionType[data.promotionTypeId].toString();
        result.createdBy = data.createdBy;
        result.createdDate = data.createdDate;
        result.updatedBy = data.updatedBy;
        result.updatedDate = data.updatedDate;
        return result;
    }
}






