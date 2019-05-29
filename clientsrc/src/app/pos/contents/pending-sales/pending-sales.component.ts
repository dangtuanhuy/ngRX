import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { PageConstants, CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { Store, select } from '@ngrx/store';
import * as fromPendingSaleState from './state/pending-sales.reducer';
import * as fromPendingSaleActions from './state/pending-sales.action';
import * as pendingSaleSelector from './state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Router } from '@angular/router';
import * as fromRootSaleState from '../../sales/state/sales.reducer';
import * as fromRootSaleActions from '../../sales/state/sales.action';
import { PendingSaleModel } from '../../shared/models/pending-sale';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConFirmDialogResult } from '../../shared/enums/dialog-type.enum';

@Component({
  selector: 'app-pending-sales',
  templateUrl: './pending-sales.component.html',
  styleUrls: ['./pending-sales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PendingSalesComponent extends ComponentBase {
  public title = 'Pending sales';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public pendingSales: PendingSaleModel[] = [];
  public searchSaleId = '';
  public saleSearch = '';

  public pageIndex = 0;
  public pageSize = 10;
  public totalItem = 0;

  constructor(
    private rootSaleStore: Store<fromRootSaleState.SalesState>,
    private pendingSaleStore: Store<fromPendingSaleState.PendingSalesState>,
    private router: Router,
    private modalService: NgbModal,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchSaleId = PageInputId.pendingSales.inputIds.saleSearch;

    this.initGetSelectors();
  }

  onDestroy() {
  }

  public onSearch(value) {
    this.saleSearch = value;
    this.getPendingSales();
  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  public onClickRelease(item: any) {
    if (item) {
      this.rootSaleStore.dispatch(new fromRootSaleActions.ReleasePendingSale(item));
      this.pendingSaleStore.dispatch(new fromPendingSaleActions.DeletePendingSale(item.id));
      this.router.navigate([`${PageConstants.quickSelect}`]);
    }
  }

  public onClickDetail(item: any) {
    if (item) {
      this.router.navigate([`${PageConstants.pendingSales}/detail/${item.id}`]);
    }
  }

  public onClickDelete(item: any) {
    if (item) {
      const dialogRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', centered: true, backdrop: 'static' });
      const instance = dialogRef.componentInstance;
      instance.title = 'Confirm';
      instance.message = 'Are you sure want to delete this item?';

      dialogRef.result.then((result) => {
        if (result === ConFirmDialogResult.Yes) {
          this.pendingSaleStore.dispatch(new fromPendingSaleActions.DeletePendingSale(item.id));
        }
      }, (reason) => {

      });
    }
  }

  public formarDate(date: Date) {
    return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/')
      + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  }

  setPage(pageInfo: { offset: number; }) {
    this.pageIndex = pageInfo.offset;
    this.getPendingSales();
  }

  private initGetSelectors() {
    this.handleSubscription(
      this.pendingSaleStore.pipe(select(pendingSaleSelector.getPageIndex)).subscribe(pageIndex => {
        this.pageIndex = pageIndex;
      })
    );

    this.handleSubscription(
      this.pendingSaleStore.pipe(select(pendingSaleSelector.getPageSize)).subscribe(pageSize => {
        this.pageSize = pageSize;
      })
    );

    this.handleSubscription(
      this.pendingSaleStore.pipe(select(pendingSaleSelector.getTotalItem)).subscribe(totalItem => {
        this.totalItem = totalItem;
      })
    );

    this.handleSubscription(
      this.pendingSaleStore.pipe(select(pendingSaleSelector.getPendingSales)).subscribe(sales => {
        this.pendingSales = sales;
      })
    );

    this.pendingSaleStore.dispatch(new fromPendingSaleActions.GetPendingSales({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }));
  }

  getPendingSales() {
    if (this.saleSearch) {
      this.pendingSaleStore.dispatch(new fromPendingSaleActions.SearchPendingSales({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        textSearch: this.saleSearch
      }));
    } else {
      this.pendingSaleStore.dispatch(new fromPendingSaleActions.GetPendingSales({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }));
    }
  }
}
