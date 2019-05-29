import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromVendor from '../state/vendor.reducer';
import * as vendorActions from '../state/vendor.action';
import * as vendorSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { VendorModel, PaymentTermModel } from '../vendor.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { CurrencyModel, TaxTypeModel } from '../../purchase-orders/purchase-order.model';
import { blankSpaceValidator, GeneralValidation } from 'src/app/shared/utils/validation.util';

@Component({
  selector: 'app-update-vendor',
  templateUrl: './update-vendor.component.html',
  styleUrls: ['./update-vendor.component.scss']
})
export class UpdateVendorComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromVendor.VendorState>,
    public injector: Injector
  ) {
    super(injector);
  }

  public paymentTerms: Array<PaymentTermModel> = [];
  public currencies: Array<CurrencyModel> = [];
  public taxTypes: Array<TaxTypeModel> = [];
  public vendor: VendorModel;
  public componentActive = true;
  public selectedPaymentTerm: string;
  public selectedCurrency: string;
  public selectedTaxType: string;

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      vendorCode: ['', Validators.required],
      description: [''],
      address1: [''],
      address2: [''],
      email: ['', Validators.email],
      vendorUrl: [''],
      barCode: [''],
      country: [''],
      cityName: [''],
      cityCode: [''],
      phone: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]],
      paymentTerm: ['',  Validators.required],
      taxType: ['',  Validators.required],
      currency: ['',  Validators.required],
      zipCode: [''],
      fax: [''],
      attention: [''],
      active: true
    });

    this.handleSubscription(this.store.pipe(
      select(vendorSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new vendorActions.GetVendor(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(vendorSelector.getVendor), takeWhile(() => this.componentActive))
      .subscribe(
        (vendor: VendorModel) => {
          if (vendor == null) {
            return;
          }
          this.vendor = vendor;
          this.updateValueForm.patchValue({
            name: this.vendor.name,
            description: this.vendor.description,
            vendorCode: this.vendor.vendorCode,
            address1: this.vendor.address1,
            address2: this.vendor.address2,
            email: this.vendor.email,
            vendorUrl: this.vendor.vendorUrl,
            barCode: this.vendor.barCode,
            country: this.vendor.country,
            phone: this.vendor.phone,
            paymentTerm: this.vendor.paymentTermId,
            currency: this.vendor.currencyId,
            cityCode: this.vendor.cityCode,
            cityName: this.vendor.cityName,
            taxType: this.vendor.taxTypeId,
            zipCode: this.vendor.zipCode,
            fax: this.vendor.fax,
            attention: this.vendor.attention,
            active: this.vendor.active,
          });
          this.getCurrencies();
          this.getPaymentTerms();
          this.getTaxTypes();
        }));
    }
    getPaymentTerms() {
      this.store.dispatch(new vendorActions.GetPaymentTerms());
          this.handleSubscription(
              this.store.pipe(select(vendorSelector.getPaymentTerms))
                  .subscribe(
                      (paymentTerms: Array<PaymentTermModel>) => {
                          this.paymentTerms = paymentTerms;
                      }
                  )
          );
    }

    getCurrencies() {
      this.store.dispatch(new vendorActions.GetCurrencies());
          this.handleSubscription(
              this.store.pipe(select(vendorSelector.getCurrencies))
                  .subscribe(
                      (currencies: Array<CurrencyModel>) => {
                          this.currencies = currencies;
                      }
                  )
          );
    }

    getTaxTypes() {
      this.store.dispatch(new vendorActions.GetTaxTypes());
          this.handleSubscription(
              this.store.pipe(select(vendorSelector.getTaxTypes))
                  .subscribe(
                      (taxTypes: Array<TaxTypeModel>) => {
                          this.taxTypes = taxTypes;
                      }
                  )
          );
    }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const vendorCode = this.updateValueForm.get('vendorCode').value;
    const name = this.updateValueForm.get('name').value;
    const description = this.updateValueForm.get('description').value;
    const address1 = this.updateValueForm.get('address1').value;
    const address2 = this.updateValueForm.get('address2').value;
    const email = this.updateValueForm.get('email').value;
    const vendorUrl = this.updateValueForm.get('vendorUrl').value;
    const barCode = this.updateValueForm.get('barCode').value;
    const country = this.updateValueForm.get('country').value;
    const phone = this.updateValueForm.get('phone').value;
    const paymentTermId = this.updateValueForm.get('paymentTerm').value;
    const currencyId = this.updateValueForm.get('currency').value;
    const zipCode = this.updateValueForm.get('zipCode').value;
    const fax = this.updateValueForm.get('fax').value;
    const attention = this.updateValueForm.get('attention').value;
    const active = this.updateValueForm.get('active').value;
    const cityCode = this.updateValueForm.get('cityCode').value;
    const cityName = this.updateValueForm.get('cityName').value;
    const taxTypeId = this.updateValueForm.get('taxType').value;
    const vendor: VendorModel = {
      id: this.vendor.id,
      vendorCode: vendorCode,
      name: name,
      description: description,
      address1: address1,
      address2: address2,
      email: email,
      vendorUrl: vendorUrl,
      barCode: barCode,
      country: country,
      phone: phone,
      paymentTermId: paymentTermId,
      paymentTermName: this.paymentTerms.find(x => x.id === paymentTermId).name,
      taxTypeName: this.taxTypes.find(x => x.id === taxTypeId).name,
      currencyName: this.currencies.find(x => x.id === currencyId).name,
      currencyId: currencyId,
      zipCode: zipCode,
      cityCode: cityCode,
      cityName: cityName,
      taxTypeId: taxTypeId,
      fax: fax,
      attention: attention,
      active: active,
    };
    this.store.dispatch(new vendorActions.UpdateVendor(vendor));
  }
}
