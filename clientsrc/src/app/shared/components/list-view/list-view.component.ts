import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { AppSettingService } from '../../services/appsetting.service';
import { AppSettingModel } from '../../base-model/appsetting.model';
import { NotificationService } from '../../services/notification.service';
import { UserDefinedColumnSetting } from '../../base-model/user-defined-column-setting.model';
import { fromEvent } from 'rxjs';
import * as moment from 'moment';
import * as fromApps from '../../state/app.state';
import * as listViewManagementSelector from '../list-view-management/state';
import { Store, select } from '@ngrx/store';
import * as appSelector from '../../state/index';
import { User } from '../../base-model/user.model';
import { Guid } from '../../utils/guid.util';
import { Button } from 'src/app/shared/base-model/button.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


interface ItemModel {
  value: string;
  label: string;
}

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnChanges {
  constructor(
    private appSettingService: AppSettingService,
    private notificationService: NotificationService,
    private store: Store<fromApps.State>,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  @Input() title;
  @Input() columns;
  @Input() datasource;

  @Input() totalItems = 0;
  @Input() pageNumber = 0;
  @Input() pageSize = 10;
  @Input() userDefinedColumnSetting: UserDefinedColumnSetting;
  @Input() isHiddenSearchBox;
  @Input() isMultiSelect;
  @Input() listButton;
  countColumns = 0;
  preSelect: any;
  selected = [];
  public selectedColumns = [];
  private datasourceLabel = 'datasource';
  private userDefinedColumnSettingLabel = 'userDefinedColumnSetting';
  private keyUserConfigurationId: string;
  public searchText = '';
  @Output() sendSelectedPage = new EventEmitter<any>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() searchQuery = new EventEmitter<any>();
  @Output() clickButton = new EventEmitter<any>();
  @Output() resultDialog = new EventEmitter<any>();
  @ViewChild('myTable') table: any;
  @ViewChild('searchInput')
  searchInput!: ElementRef;
  users: User[];
  items: Array<ItemModel> = [];
  ngOnInit() {
    this.setColumns();
    this.addKeyUpEventToSearchText();

    this.store.pipe(
      select(appSelector.getUsers))
      .subscribe(result => {
        this.users = result;
      }
      );

    this.store.pipe(select(listViewManagementSelector.changeFilter))
      .subscribe(
        (filter: any) => {
          if (filter === null || filter === undefined || filter === '') {
            this.searchQuery.emit('');
            this.searchText = '';
          }
        });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === this.datasourceLabel) {
        const change = changes[propName];
        if (change.currentValue && change.previousValue) {
          const curVal = change.currentValue.length;
          const prevVal = change.previousValue.length;
          if (curVal !== prevVal) {
            this.setColumns();
          }
        }
      } else if (propName === this.userDefinedColumnSettingLabel) {
        const change = changes[propName];
        const curVal = change.currentValue;
        const prevVal = change.previousValue;
        if (curVal !== prevVal) {
          this.getUserConfiguration();
        }
      }
    }
    this.selected = [];
  }


  onChange() {
    const arrayData: Array<string> = [];
    const appsetting: AppSettingModel = {
      id: this.keyUserConfigurationId,
      key: this.userDefinedColumnSetting.key,
      value: arrayData.concat(this.selectedColumns).toString()
    };
    if (this.keyUserConfigurationId) {
      if (this.selectedColumns.length !== 0) {
        this.appSettingService.update(appsetting, this.userDefinedColumnSetting.apiUrl).subscribe(() => {
          this.notificationService.success('selected columns is updated.');
        });
      }
    } else {
      this.appSettingService.add(appsetting, this.userDefinedColumnSetting.apiUrl).subscribe(() => {
        this.notificationService.success('selected columns is updated.');
      });
    }

  }

  onRemove(e: any) {
    if (this.selectedColumns.length === 0) {
      this.selectedColumns = [e.value];
    }
  }

  setPage(pageInfo: { offset: number; }) {
    this.sendSelectedPage.emit(pageInfo.offset);
  }

  onSelect({ selected }) {
    this.selectedRow.emit(selected);
  }

  setColumns() {
    if (this.datasource && this.datasource.length > 0) {
      this.columns = Object.keys(this.datasource[0]);
      this.setItems(this.columns);
      if (!this.selectedColumns) {
        this.selectedColumns = this.columns;
      }
    } else {
      this.setItems(this.selectedColumns);
    }
  }

  // format header of items in columns dropdown
  setItems(columns: any) {
    this.items = [];
    for (const col of columns) {
      this.items.push({
        label: this.formatHeader(col),
        value: col
      });
    }
  }

  getUserConfiguration() {
    if (this.userDefinedColumnSetting) {
      this.appSettingService.getBy(this.userDefinedColumnSetting.key, this.userDefinedColumnSetting.apiUrl).subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            this.keyUserConfigurationId = data[0].id;
            const value = data[0].value.split(',');
            this.selectedColumns = value;
          } else {
            this.selectedColumns = this.userDefinedColumnSetting.defaultValue.split(',').map(item => item.trim());
          }
          this.setColumns();
        });
    }
  }

  addKeyUpEventToSearchText() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .subscribe(() => {
        this.searchQuery.emit(this.searchText);
      });
  }

  formatDateValue(source: any) {
    if (source) {
      source = source.forEach((item: any) => {
        if (item.createdDate && !moment.utc(item.createdDate, 'DD/MM/YYYY HH:mm A', true).local().isValid()) {
          item.createdDate = moment.utc(item.createdDate).local().format('DD/MM/YYYY HH:mm A');
        }
        if (item.updatedDate && !moment.utc(item.updatedDate, 'DD/MM/YYYY HH:mm A', true).local().isValid()) {
          item.updatedDate = moment.utc(item.updatedDate).local().format('DD/MM/YYYY HH:mm A');
        }
      });
    }
  }

  format(datasource: any) {
    if (datasource) {
      const result = Object.create(datasource);
      this.formatDateValue(result);
      this.bindingUserData(result);
      return result;
    } else {
      return [];
    }
  }

  bindingUserData(source: any) {
    if (this.users && this.users.length > 0) {
      if (source) {
        if (source.length > 0) {
          source.forEach((item: any) => {
            if (item.createdBy && item.createdBy !== Guid.empty()) {
              const user = this.users.find(x => x.id === item.createdBy);
              item.createdBy = user ? `${user.firstName} ${user.lastName}` : item.createdBy;
            }
            if (item.updatedBy && item.updatedBy !== Guid.empty()) {
              const user = this.users.find(x => x.id === item.updatedBy);
              item.updatedBy = user ? `${user.firstName} ${user.lastName}` : item.updatedBy;
            }
          });
        }
      }
    }
  }

  onClickBtn(item: Button) {
    if (item === undefined) {
      return;
    }

    switch (item.action) {
      case ActionType.onScreen:
        if (item.redirectUrl) {
          this.router.navigate([item.redirectUrl], { relativeTo: this.route, queryParams: (item.param !== undefined ? item.param : null) });
        } else {
          this.clickButton.emit(item);
        }
        break;

      case ActionType.dialog:
      default:
        const dialogRef = this.modalService.open(item.component, item.configDialog);
        this.resultDialog.emit(dialogRef);
        break;
    }
  }


  formatHeader(text: string) {
    if (text) {
      let result = '';
      result = result + text.charAt(0).toUpperCase();
      for (let i = 1; i < text.length; i++) {
        if (text[i] === text[i].toUpperCase()) {
          result = result + ' ' + text[i];
        } else {
          result = result + text[i];
        }
      }
      return result;
    }
  }
}
