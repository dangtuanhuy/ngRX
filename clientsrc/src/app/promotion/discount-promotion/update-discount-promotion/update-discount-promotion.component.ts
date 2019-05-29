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
import { takeWhile } from 'rxjs/operators';

const stringGenerateCouponCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const lengthCode = 5;

@Component({
    selector: 'app-update-discount-promotion',
    templateUrl: './update-discount-promotion.component.html',
    styleUrls: ['./update-discount-promotion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UpdateDiscountPromotionComponent extends ComponentBase {
    updateValueForm: FormGroup = new FormGroup({});
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
    listExistsCouponCodes: string[] = [];
    listCounponCode: string[] = [];
    listCouponCodeDisplay = '';
    listUpdateCouponCode: string[] = [];
    listUpdateCouponCodeDisplay = '';
    fromDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    toDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    isUseCouponCodes = false;
    isDiscountType = false;
    isAddNewCouponCodes = false;
    selectedPromotionType: any;
    selectedLocation = [];
    selectedDiscountType: any;
    selectedCondition: any;
    selectedOperator: any;
    promotionTypes = PromotionTypes;
    discountTypes = DiscountTypes;
    promotionSelection = PromotionSelection;
    filteredFromDate: any;
    filteredToDate: any;
    numberOfCodes = 0;
    isUseConditions = false;
    itemId = null;
    selectedPromotion = new PromotionModel({});

    onInit() {
        this.getLocations();
        this.getPromotionTypes();
        this.getDiscountTypes();
        this.getConditionTypes();
        this.getOperatorTypes();
        this.getSelectedItem();
        this.getCouponCodes();

        this.updateValueForm = this.formBuilder.group({
            name: ['', [Validators.required, blankSpaceValidator]],
            description: [''],
            promotionType: ['', Validators.required],
            discountType: [''],
            discountValueAmount: [''],
            discountValuePercent: [''],
            location: [''],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            couponCodes: [''],
            numberOfCodes: [''],
            promotionSelection: new FormControl(this.promotionSelection.code),
            conditions: [''],
            operators: [''],
            valueOfCondition: [''],
            isAddNewCouponCodes: [''],
            updateCouponCodes: ['']
        }, {
                validator: [this.validationService
                    .validateRequiredDependPromotionType('promotionType', 'discountType', 'discountValueAmount', 'discountValuePercent'),
                this.validationService.validateRequiredPromotionWithUpdateCouponCodes('isAddNewCouponCodes', 'updateCouponCodes'),
                this.validationService
                    .validateRequiredPromotionWithUseCondidtions('promotionType',
                    'promotionSelection', 'conditions', 'operators', 'valueOfCondition')]
            });

            this.handleSubscription(this.promotionService.getBy(this.itemId).subscribe(result => {
                this.selectedPromotion = new PromotionModel(result);
                this.selectedPromotionType = this.selectedPromotion.promotionTypeId;
                this.selectedDiscountType = this.selectedPromotion.promotionDetail.discountTypeId;
                this.selectedLocation = [];
                if (this.selectedPromotion.locations) {
                    this.selectedPromotion.locations.forEach(x => {
                        this.selectedLocation.push(x.id);
                    });
                }
                this.isUseConditions =
                    this.selectedPromotion.promotionDetail ? this.selectedPromotion.promotionDetail.isUseConditions : false;
                this.isUseCouponCodes =
                    this.selectedPromotion.promotionDetail ? this.selectedPromotion.promotionDetail.isUseCouponCodes : false;
                if (this.selectedPromotion.promotionDetail) {
                    if (this.selectedPromotion.promotionDetail.couponCodes) {
                        this.selectedPromotion.promotionDetail.couponCodes.forEach(x => {
                            if (x.isActive) {
                                this.listCounponCode.push(x.code);
                            }
                        });
                    }
                    if (this.isUseConditions && this.selectedPromotion.promotionDetail.condition) {
                        this.selectedCondition = this.selectedPromotion.promotionDetail.condition.conditionTypeId;
                    }
                }
                this.listCouponCodeDisplay = this.listCounponCode.join(',\n');
                this.updateValueForm.patchValue({
                    name: this.selectedPromotion.name,
                    description: this.selectedPromotion.description,
                    promotionType: this.selectedPromotion.promotionTypeId,
                    discountValueAmount: this.selectedPromotion.promotionDetail ? this.selectedPromotion.promotionDetail.value : '',
                    discountValuePercent: this.selectedPromotion.promotionDetail ? this.selectedPromotion.promotionDetail.value : '',
                    fromDate: this.selectedPromotion.fromDate ? { year: new Date(this.selectedPromotion.fromDate).getFullYear(),
                        month: new Date(this.selectedPromotion.fromDate).getMonth() + 1,
                        day: new Date(this.selectedPromotion.fromDate).getDate() } : null,
                    toDate: this.selectedPromotion.toDate ? { year: new Date(this.selectedPromotion.toDate).getFullYear(),
                        month: new Date(this.selectedPromotion.toDate).getMonth() + 1,
                        day: new Date(this.selectedPromotion.toDate).getDate() } : null,
                    operators:
                        this.isUseConditions && this.selectedPromotion.promotionDetail && this.selectedPromotion.promotionDetail.condition
                        ? this.selectedPromotion.promotionDetail.condition.operatorTypeId : '',
                    valueOfCondition:
                    this.isUseConditions && this.selectedPromotion.promotionDetail.condition
                    ? this.selectedPromotion.promotionDetail.condition.value : '',
                    promotionSelection: this.isUseConditions ? this.promotionSelection.condition : this.promotionSelection.code
                });
              }));
    }

    getSelectedItem() {
        this.handleSubscription(this.store.pipe(select(promotionSelector.getSelectedItem),
          takeWhile(() => this.componentActive))
          .subscribe(
            (id: string) => {
              this.itemId = id;
            }
          ));
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
        this.listUpdateCouponCode = [];
        let code = '';
        while (this.listUpdateCouponCode.length < this.numberOfCodes) {
            code = '';
            for (let i = 0; i < lengthCode; i++) {
                code += stringGenerateCouponCode.charAt(Math.floor(Math.random() * stringGenerateCouponCode.length));
            }
            if (!this.listUpdateCouponCode.includes(code) && !this.listExistsCouponCodes.includes(code)) {
                this.listUpdateCouponCode.push(code);
            }
        }
        if (this.listUpdateCouponCode.length > 0) {
            this.listUpdateCouponCodeDisplay = this.listUpdateCouponCode.join(',\n');
        }
    }

    onSave() {
        if (!this.filterData()) {
            return;
        }

        const name = this.updateValueForm.get('name') ? this.updateValueForm.get('name').value : '';
        const description = this.updateValueForm.get('description') ? this.updateValueForm.get('description').value : '';
        const promotionType = this.updateValueForm.get('promotionType') ? this.updateValueForm.get('promotionType').value : null;
        const locationIds = this.updateValueForm.get('location') ? this.updateValueForm.get('location').value : null;
        const fromDate = this.updateValueForm.get('fromDate') ? this.updateValueForm.get('fromDate').value : null;
        const toDate = this.updateValueForm.get('toDate') ? this.updateValueForm.get('toDate').value : null;

        const discountType = this.updateValueForm.get('discountType') ? this.updateValueForm.get('discountType').value : null;
        const discountValueAmount = this.updateValueForm.get('discountValueAmount')
            ? this.updateValueForm.get('discountValueAmount').value : 0;
        const discountValuePercent = this.updateValueForm.get('discountValuePercent')
            ? this.updateValueForm.get('discountValuePercent').value : 0;
        const isUseCouponCodes = this.updateValueForm.get('promotionSelection')
            ? this.updateValueForm.get('promotionSelection').value === this.promotionSelection.code : false;
        const updateCouponCodes = this.updateValueForm.get('updateCouponCodes')
            ? this.updateValueForm.get('updateCouponCodes').value : '';
        const isUseConditions = this.updateValueForm.get('promotionSelection')
            ? this.updateValueForm.get('promotionSelection').value === this.promotionSelection.condition : false;
        const conditions = this.updateValueForm.get('conditions')
            ? this.updateValueForm.get('conditions').value : null;
        const operators = this.updateValueForm.get('operators')
            ? this.updateValueForm.get('operators').value : null;
        const valueOfCondition = this.updateValueForm.get('valueOfCondition')
            ? this.updateValueForm.get('valueOfCondition').value : 0;

        let locationModels: LocationModel[] = [];
        if (Array.isArray(locationIds) && locationIds.length > 0) {
            locationModels = locationIds.map(locationId => {
                const locationModel = new LocationModel({
                    id: locationId,
                    name: this.listLocation.find(x => x.id === locationId).name
                });

                return locationModel;
            });
        }

        const promotion: PromotionModel = {
            id: this.selectedPromotion.id,
            promotionDetailId: this.selectedPromotion.promotionDetailId,
            name: name,
            description: description,
            promotionTypeId: promotionType,
            locations: locationModels,
            status: this.selectedPromotion.status,
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
                condition.id = this.selectedPromotion.promotionDetail.condition
                    ? this.selectedPromotion.promotionDetail.condition.id
                    : Guid.empty();
                condition.operatorTypeId = operators;
                condition.value = valueOfCondition;
                condition.conditionTypeId = conditions;
                promotionDetail.condition = condition;
            }

            if (isUseCouponCodes && updateCouponCodes !== '') {
                const couponCodeList = updateCouponCodes.replace(/(\r\n|\n|\r)/gm, '').split(',');
                if (Array.isArray(couponCodeList) && couponCodeList.length > 0) {
                    promotionDetail.couponCodes = [];
                    if (this.selectedPromotion.promotionDetail && this.selectedPromotion.promotionDetail.couponCodes) {
                        promotionDetail.couponCodes.concat(this.selectedPromotion.promotionDetail.couponCodes);
                    }
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
        this.store.dispatch(new promotionActions.UpdatePromotion(promotion));
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
        const promotionType = this.updateValueForm.get('promotionType').value;

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
