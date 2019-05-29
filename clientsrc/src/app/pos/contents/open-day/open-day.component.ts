import { Component, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromOpenDayState from './state/open-day.reducer';
import * as openDayActions from './state/open-day.action';
import * as openDaySelector from './state/index';
import { PageConstants, CommonConstants } from '../../shared/constants/common.constant';
import { Router } from '@angular/router';
import { calculateDenominationsTotal } from '../../shared/models/denomination-view.model';
import { FakeService } from '../../shared/services/fake.service';
import { CashingUpService } from '../../shared/services/cashing-up.service';
import { CashingUp } from '../../shared/models/cashing-up';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AppContextManager } from '../../shared/app-context-manager';
import { User } from '../../shared/models/user';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CashingUpType } from '../../shared/enums/cashing-up-type.enum';
import { TenderService } from '../../shared/services/tender.service';
import { Tender } from '../../shared/models/tender';
import { TenderType } from '../../shared/enums/tender-type.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConFirmDialogResult } from '../../shared/enums/dialog-type.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-open-day',
  templateUrl: './open-day.component.html',
  styleUrls: ['./open-day.component.scss']
})
export class OpenDayComponent extends ComponentBase {
  public title = 'Open';
  public defaultPage = '';
  public denominations = [];
  public total = 0;
  public decimalTotal = '0.00';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public currentOpendayCashingUp: CashingUp;
  public currentTenderIn: Tender;

  private currentUser: User;

  constructor(
    private store: Store<fromOpenDayState.OpenDayState>,
    private router: Router,
    private fakeService: FakeService,
    private cashingUpService: CashingUpService,
    private tenderService: TenderService,
    private appContextManager: AppContextManager,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.initData();
    this.loadData();
    this.loadDenominations();
  }
  onDestroy() {

  }

  public onChangeDenomination(values) {
    this.store.dispatch(new openDayActions.ChangeDenomination(values));
  }

  public onClickTender() {
    if (!this.currentUser) {
      this.notificationService.error('Something went wrong!');
      return;
    }

    const dialogRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;
    instance.title = 'Confirm';
    instance.message = 'Are you sure want to tender in?';

    dialogRef.result.then((result) => {
      if (result === ConFirmDialogResult.Yes) {

        this.addTenderIn().subscribe(newTender => {
          this.fakeService.registerMoney = this.total;
          this.notificationService.success('Added tender in!');
          this.appContextManager.setCurrentTenderIn(newTender);
          this.router.navigate([PageConstants.quickSelect]);
        });
      }
    }, (reason) => {

    });
  }

  public onOpenDay() {
    if (!this.currentUser) {
      this.notificationService.error('Something went wrong!');
      return;
    }

    const dialogRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;
    instance.title = 'Confirm';
    instance.message = 'Are you sure want to open day?';

    dialogRef.result.then((result) => {
      if (result === ConFirmDialogResult.Yes) {
        const cashingUp = new CashingUp();
        cashingUp.id = Guid.newGuid();
        cashingUp.amount = this.total;
        cashingUp.userId = this.currentUser.id;
        cashingUp.cashingUpType = CashingUpType.openDay;
        cashingUp.createdDate = new Date();

        this.cashingUpService.add(cashingUp).subscribe(openDayCashingUp => {
          if (!openDayCashingUp) {
            this.notificationService.error('Something went wrong!');
            return;
          }
          this.notificationService.success('Added open day!');
          this.appContextManager.setCurrentOpendayCashingUp(openDayCashingUp);

          this.addTenderIn().subscribe(newTender => {
            if (!newTender) {
              this.notificationService.error('Something went wrong!');
              return;
            }

            this.notificationService.success('Added tender in!');
            this.appContextManager.setCurrentTenderIn(newTender);
            this.fakeService.registerMoney = this.total;
            this.router.navigate([PageConstants.quickSelect]);
          });
        });
      }
    }, (reason) => {

    });
  }

  private loadDenominations() {
    this.handleSubscription(
      this.store.pipe(select(openDaySelector.getDenominations)).subscribe(denominations => {
        this.denominations = denominations;
        this.total = calculateDenominationsTotal(this.denominations);
        this.decimalTotal = parseFloat(String(this.total)).toFixed(2);
      })
    );

    this.store.dispatch(new openDayActions.LoadDenominations());
  }

  private initData() {
    this.defaultPage = `/${PageConstants.defaultPage}`;
  }

  private loadData() {
    this.currentUser = this.appContextManager.currentUser;
    this.handleSubscription(
      this.appContextManager.currentUserSubject.subscribe((user: User) => {
        this.currentUser = user;
      })
    );

    this.currentOpendayCashingUp = this.appContextManager.currentOpendayCashingUp;
    this.handleSubscription(
      this.appContextManager.currentOpendayCashingUpSubject.subscribe((currentOpendayCashingUp: CashingUp) => {
        this.currentOpendayCashingUp = currentOpendayCashingUp;
      })
    );

    this.currentTenderIn = this.appContextManager.currentTenderIn;
    this.handleSubscription(
      this.appContextManager.currentTenderInSubject.subscribe((tender: Tender) => {
        this.currentTenderIn = tender;
      })
    );
  }

  private addTenderIn(): Observable<any> {
    return Observable.create((observer) => {
      const tender = new Tender();
      tender.id = Guid.newGuid();
      tender.amount = this.total;
      tender.userId = this.currentUser.id;
      tender.tenderType = TenderType.in;
      tender.createdDate = new Date();
      this.tenderService.add(tender).subscribe(newTender => {
        observer.next(newTender);
        observer.complete();
      });
    });
  }

}
