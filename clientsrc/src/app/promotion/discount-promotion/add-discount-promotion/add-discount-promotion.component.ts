import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { ComponentBase } from 'src/app/shared/components/component-base';
import * as fromPromotion from '../state/promotion.reducer';
import * as promotionActions from '../state/promotion.action';
import * as promotionSelector from '../state/index';
import {
    LocationModel, TypeModel, PromotionTypes, DiscountTypes, PromotionModel,
    PromotionDetailModel, ConditionModel, CouponCodeModel, PromotionStatus, PromotionType, DiscountType, PromotionSelection
} from '../../promotion.model';
import { blankSpaceValidator } from 'src/app/shared/utils/validation.util';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import { PromotionService } from '../../promotion.service';

const stringGenerateCouponCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const lengthCode = 5;

@Component({
    selector: 'app-add-discount-promotion',
    templateUrl: './add-discount-promotion.component.html',
    styleUrls: ['./add-discount-promotion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddDiscountPromotionComponent extends ComponentBase {
    addValueForm: FormGroup = new FormGroup({});
    constructor(
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private store: Store<fromPromotion.PromotionState>,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private promotionService: PromotionService,
        public injector: Injector
    ) {
        super(injector);
    }

    componentActive = true;
    listLocation: LocationModel[] = [];
    listPromotionTypes: TypeModel[] = [];
    listDiscountTypes: TypeModel[] = [];
    listConditionTypes: TypeModel[] = [];
    listOperatorTypes: TypeModel[] = [];
    listCounpon: string[] = [];
    listExistsCouponCodes: string[] = [];
    listCouponCodeDisplay = '';
    fromDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    toDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    selectedPromotionType: any;
    selectedLocation: any;
    selectedDiscountType: any;
    selectedCondition: any;
    selectedOperator: any;
    promotionTypes = PromotionTypes;
    discountTypes = DiscountTypes;
    promotionSelection = PromotionSelection;
    filteredFromDate: any;
    filteredToDate: any;
    numberOfCodes = 0;
    onInit() {
        this.getLocations();
        this.getPromotionTypes();
        this.getDiscountTypes();
        this.getConditionTypes();
        this.getOperatorTypes();
        this.getCouponCodes();

        this.addValueForm = this.formBuilder.group({
            name: ['', [Validators.required, blankSpaceValidator]],
            description: [''],
            promotionType: ['', Validators.required],
            discountType: [''],
            discountValueAmount: [''],
            discountValuePercent: [''],
            location: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            couponCodes: [''],
            numberOfCodes: [''],
            promotionSelection: new FormControl(this.promotionSelection.code),
            conditions: [''],
            operators: [''],
            valueOfCondition: ['']
        }, {
                validator: [this.validationService
                    .validateRequiredDependPromotionType('promotionType', 'discountType', 'discountValueAmount', 'discountValuePercent'),
                this.validationService.validateRequiredPromotionWithUseCouponCodes('promotionType', 'promotionSelection', 'couponCodes'),
                this.validationService
                    .validateRequiredPromotionWithUseCondidtions('promotionType',
                    'promotionSelection', 'conditions', 'operators', 'valueOfCondition')]
            });
    }

    onDestroy() {
        this.componentActive = false;
    }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    onChangeType(e: any) { }

    getLocations() {
        this.store.dispatch(new promotionActions.GetLocations());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getLocations))
            .subscribe((locations: LocationModel[]) => {
                this.listLocation = locations;
            }));
    }

    getPromotionTypes() {
        this.store.dispatch(new promotionActions.GetPromotionTypes());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getPromotionTypes))
            .subscribe((promotionTypes: TypeModel[]) => {
                // TODO: Thao: remove when implement bundle type.
                if (promotionTypes) {
                    promotionTypes = promotionTypes.filter(x => x.id !== this.promotionTypes.Bundle);
                }
                this.listPromotionTypes = promotionTypes;
            }));
    }

    getConditionTypes() {
        this.store.dispatch(new promotionActions.GetConditionTypes());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getConditionTypes))
            .subscribe((conditionTypes: TypeModel[]) => {
                this.listConditionTypes = conditionTypes;
            }));
    }

    getOperatorTypes() {
        this.store.dispatch(new promotionActions.GetOperatorTypes());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getOperatorTypes))
            .subscribe((operatorTypes: TypeModel[]) => {
                this.listOperatorTypes = operatorTypes;
            }));
    }

    getDiscountTypes() {
        this.store.dispatch(new promotionActions.GetDiscountTypes());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getDiscountTypes))
            .subscribe((discountTypes: TypeModel[]) => {
                this.listDiscountTypes = discountTypes;
            }));
    }

    getCouponCodes() {
        this.store.dispatch(new promotionActions.GetCouponCodes());
        this.handleSubscription(this.store.pipe(select(promotionSelector.getCouponCodes))
        .subscribe((couponCodes: CouponCodeModel[]) => {
            if (couponCodes) {
                couponCodes.forEach(x => {
                    this.listExistsCouponCodes.push(x.code);
                });
            }
        }));
    }

    generatePromotionCode(e: any) {
        this.listCounpon = [];
        let code = '';
        while (this.listCounpon.length < this.numberOfCodes) {
            code = '';
            for (let i = 0; i < lengthCode; i++) {
                code += stringGenerateCouponCode.charAt(Math.floor(Math.random() * stringGenerateCouponCode.length));
            }
            if (!this.listCounpon.includes(code) && !this.listExistsCouponCodes.includes(code)) {
                this.listCounpon.push(code);
            }
        }
        if (this.listCounpon.length > 0) {
            this.listCouponCodeDisplay = this.listCounpon.join(', \n');
        }
    }

    onSave() {
        if (!this.filterData()) {
            return;
        }

        const name = this.addValueForm.get('name').value;
        const description = this.addValueForm.get('description').value;
        const promotionType = this.addValueForm.get('promotionType').value;
        const locationIds = this.addValueForm.get('location').value;
        const fromDate = this.addValueForm.get('fromDate').value;
        const toDate = this.addValueForm.get('toDate').value;

        const discountType = this.addValueForm.get('discountType').value;
        const discountValueAmount = this.addValueForm.get('discountValueAmount').value;
        const discountValuePercent = this.addValueForm.get('discountValuePercent').value;
        const isUseCouponCodes = this.addValueForm.get('promotionSelection')
            ? this.addValueForm.get('promotionSelection').value === this.promotionSelection.code : false;
        const couponCodes = this.addValueForm.get('couponCodes').value;
        const numberOfCodes = this.addValueForm.get('numberOfCodes').value;

        const isUseConditions = this.addValueForm.get('promotionSelection')
            ? this.addValueForm.get('promotionSelection').value === this.promotionSelection.condition : false;
        const conditions = this.addValueForm.get('conditions').value;
        const operators = this.addValueForm.get('operators').value;
        const valueOfCondition = this.addValueForm.get('valueOfCondition').value;

        let locationModels: LocationModel[] = [];
        if (Array.isArray(locationIds) && locationIds.length > 0) {
            locationModels = locationIds.map(locationId => {
                const locationModel = new LocationModel({
                    id: locationId
                });

                return locationModel;
            });
        }

        const promotion: PromotionModel = {
            id: Guid.empty(),
            promotionDetailId: Guid.empty(),
            name: name,
            description: description,
            promotionTypeId: promotionType,
            locations: locationModels,
            status: PromotionStatus.Active,
            fromDate: new Date(Date.UTC(fromDate.year, Number(fromDate.month) - 1, fromDate.day)),
            toDate: new Date(Date.UTC(toDate.year, Number(toDate.month) - 1, toDate.day)),
            promotionDetail: null
        };

        const promotionDetail = new PromotionDetailModel();
        promotionDetail.value = 0;
        if (promotionType === PromotionType.DiscountManual) {
            promotionDetail.discountTypeId = DiscountType.Default;
        } else {
            promotionDetail.discountTypeId = discountType;
            if (discountType === DiscountTypes.Amount) {
                promotionDetail.value = discountValueAmount;
            }
            if (discountType === DiscountTypes.Percent) {
                promotionDetail.value = discountValuePercent;
            }
        }

        if (promotionType === PromotionType.Discount) {
            promotionDetail.isUseConditions = isUseConditions;
            promotionDetail.isUseCouponCodes = isUseCouponCodes;

            if (isUseConditions) {
                const condition = new ConditionModel();
                condition.operatorTypeId = operators;
                condition.value = valueOfCondition;
                condition.conditionTypeId = conditions;

                promotionDetail.condition = condition;
            }

            if (isUseCouponCodes) {
                const couponCodeList = couponCodes.replace(/(\r\n|\n|\r)/gm, '').split(',');
                if (Array.isArray(couponCodeList) && couponCodeList.length > 0) {
                    promotionDetail.couponCodes = [];

                    couponCodeList.forEach(couponCode => {
                        const couponCodeModel = new CouponCodeModel();
                        couponCodeModel.code = couponCode;
                        couponCodeModel.isUsed = false;
                        promotionDetail.couponCodes.push(couponCodeModel);
                    });
                }
            }
        }

        promotion.promotionDetail = promotionDetail;
        this.store.dispatch(new promotionActions.AddPromotion(promotion));
    }

    onSelectedFromDateChange(e: any) {
        if (this.fromDate) {
            this.filteredFromDate = this.createFilterDate(this.fromDate);
        }
    }

    onSelectedToDateChange(e: any) {
        if (this.toDate) {
            this.filteredToDate = this.createFilterDate(this.toDate);
        }
    }

    private filterData() {
        const promotionType = this.addValueForm.get('promotionType').value;

        if (promotionType === PromotionType.DiscountManual) {
            return true;
        }

        if (this.filteredFromDate > this.filteredToDate) {
            this.notificationService.error('The from date cannot be greater than the to date!');
            return false;
        }

        return true;
    }

    private createFilterDate(filterDate: any) {
        return new Date(filterDate.year, filterDate.month - 1, filterDate.day, 23, 59, 59).toISOString();
    }
}
