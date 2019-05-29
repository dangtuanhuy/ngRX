import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApproval from './state/approval.reducer';
import * as fromAuths from '../../shared/components/auth/state/index';
import * as approvalActions from './state/approval.action';
import * as approvalSelector from './state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { takeWhile } from 'rxjs/operators';
import { GetApprovalRequestModel, ApprovalModel, ApprovalStatus } from './approval.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { Button } from 'src/app/shared/base-model/button.model';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { environment } from 'src/environments/environment';
import { ApprovePurchaseOrderComponent } from './approve/approve.component';
import { RejectPurchaseOrderComponent } from './reject/reject.component';
import { ConfirmPurchaseOrderComponent } from './confirm/confirm.component';
import { DetailPurchaseOrderComponent } from './detail/detail.component';


@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ApprovalComponent extends ComponentBase {

  private userId: string;

  public componentActive = true;
  public pageSize = 10;
  public title = '';
  public datasource: Array<ApprovalModel> = [];
  public actionType = ActionType.dialog;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public listButton;
  public queryText = '';

  public isHiddenSearchBox = false;
  constructor(private store: Store<fromApproval.ApprovalState>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
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
          this.userId = id;
          // tslint:disable-next-line:max-line-length
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(`${id}_UserDefinedColumnsApproval`, 'purchaseOrderName,status,createdDate,poNumber',
            environment.app.purchaseOrder.apiUrl);
          this.getApproval(this.queryText);
          this.setButtonsConfiguration();
        })
    );

    this.handleSubscription(
      this.store
        .pipe(
          select(approvalSelector.getSelectedItem),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string | null) => {
          if (id) {
            this.changeListButton(false);
            this.disableButtonByApprovalStatus(id);
          } else {
            this.changeListButton(true);
          }
        })
    );

  }
  onDestroy() {
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: 0,
        title: 'Approve',
        component: ApprovePurchaseOrderComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Reject',
        component: RejectPurchaseOrderComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 3,
        title: 'Confirm',
        component: ConfirmPurchaseOrderComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 4,
        title: 'Detail',
        component: DetailPurchaseOrderComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      })
    ];
  }

  getApproval(searchText) {
    this.store.dispatch(
      new approvalActions.GetApprovals(
        new GetApprovalRequestModel(
          this.userId,
          new PagingFilterCriteria(1, this.pageSize)
        ), searchText
      )
    );
    this.store.pipe(select(approvalSelector.getApprovals),
      takeWhile(() => this.componentActive))
      .subscribe(
        (approvals: Array<ApprovalModel>) => {
          this.datasource = approvals.map(item => {
            const approval = new ApprovalModel(item);
            approval.status = item.status !== 0 ? this.getApprovalStatus(item.status) : '';
            return approval;
          });
        }
      );
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(new approvalActions.GetApprovals(new GetApprovalRequestModel(
      this.userId,
      new PagingFilterCriteria(page + 1, this.pageSize)
    ), this.queryText));
  }

  getApprovalStatus(type: any) {
    return Object.values(ApprovalStatus).includes(+type)
      ? Object.keys(ApprovalStatus).find(function (item, key) { return key === (+type - 1); })
      : type;
  }

  disableButtonByApprovalStatus(selectedID: string) {
    if (!this.listButton) {
      return;
    }
    const approval = this.datasource.find(x => x.id === selectedID);
    const appropvalStatus: string = this.getApprovalStatus(approval.status);
    this.listButton.forEach(btn => {
      if (appropvalStatus.includes(btn.title)) {
        btn.disable = true;
      } else {
        btn.disable = false;
      }
    });
  }

  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Approve' || btn.title === 'Reject' || btn.title === 'Confirm' || btn.title === 'Detail') {
        btn.disable = isDisabled;
      }
    });
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getApproval(this.queryText);
  }
}
