import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromVendor from '../../vendors/state/vendor.reducer';
import { VendorModel, PaymentTermModel } from '../vendor.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import * as vendorActions from '../state/vendor.action';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { CurrencyModel, TaxTypeModel } from '../../purchase-orders/purchase-order.model';
import * as vendorSelector from '../state/index';
import { blankSpaceValidator, GeneralValidation } from 'src/app/shared/utils/validation.util';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddVendorComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  public paymentTerms: Array<PaymentTermModel> = [];
  public currencies: Array<CurrencyModel> = [];
  public selectedPaymentTerm: string;
  public selectedCurrency: string;
  public selectedTaxType: string;
  public taxTypes: Array<TaxTypeModel> = [];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromVendor.VendorState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
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
      taxType: ['', Validators.required],
      phone: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]],
      paymentTerm: ['', Validators.required],
      currency: ['', Validators.required],
      zipCode: [''],
      fax: [''],
      attention: ['']
    });
    this.getPaymentTerms();
    this.getCurrencies();
    this.getTaxTypes();
  }

  onDestroy() {}

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

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const vendorCode = this.addValueForm.get('vendorCode').value;
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const address1 = this.addValueForm.get('address1').value;
    const address2 = this.addValueForm.get('address2').value;
    const email = this.addValueForm.get('email').value;
    const vendorUrl = this.addValueForm.get('vendorUrl').value;
    const barCode = this.addValueForm.get('barCode').value;
    const country = this.addValueForm.get('country').value;
    const phone = this.addValueForm.get('phone').value;
    const paymentTermId = this.addValueForm.get('paymentTerm').value;
    const currencyId = this.addValueForm.get('currency').value;
    const zipCode = this.addValueForm.get('zipCode').value;
    const fax = this.addValueForm.get('fax').value;
    const attention = this.addValueForm.get('attention').value;
    const cityCode = this.addValueForm.get('cityCode').value;
    const cityName = this.addValueForm.get('cityName').value;
    const taxTypeId = this.addValueForm.get('taxType').value;
    const vendor: VendorModel = {
      id: Guid.empty(),
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
      currencyId: currencyId,
      zipCode: zipCode,
      fax: fax,
      paymentTermName: this.paymentTerms.find(x => x.id === paymentTermId).name,
      taxTypeName: this.taxTypes.find(x => x.id === taxTypeId).name,
      currencyName: this.currencies.find(x => x.id === currencyId).name,
      cityCode: cityCode,
      cityName: cityName,
      taxTypeId: taxTypeId,
      attention: attention,
      active: true,
    };
    this.store.dispatch(new vendorActions.AddVendor(vendor));
  }
}
