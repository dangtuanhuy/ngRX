import { Component, Injector } from '@angular/core';
import { PageConstants, CommonConstants } from 'src/app/pos/shared/constants/common.constant';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromPendingSaleState from '../state/pending-sales.reducer';
import * as fromPendingSaleActions from '../state/pending-sales.action';
import * as pendingSaleSelector from '../state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PendingSaleModel } from 'src/app/pos/shared/models/pending-sale';

@Component({
  selector: 'app-pending-sale-detail',
  templateUrl: './pending-sale-detail.component.html',
  styleUrls: ['./pending-sale-detail.component.scss']
})
export class PendingSaleDetailComponent extends ComponentBase {
  public title = 'Pending sales';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;
  public sale = new PendingSaleModel();

  private saleId = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private pendingSaleStore: Store<fromPendingSaleState.PendingSalesState>,
    public injector: Injector
  ) {
    super(injector);
    this.saleId = this._activatedRoute.snapshot.paramMap.get('saleId');
  }

  onInit() {
    this.initGetSelectors();
  }
  onDestroy() {

  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  public formarDate(date: Date) {
    return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/')
      + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  }

  private initGetSelectors() {
    this.handleSubscription(
      this.pendingSaleStore.pipe(select(pendingSaleSelector.getPendingSale)).subscribe(sale => {
        if (sale) {
          this.sale = sale;
        }
      })
    );

    this.pendingSaleStore.dispatch(new fromPendingSaleActions.GetPendingSale(this.saleId));
  }
}
