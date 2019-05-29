import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Button } from 'src/app/shared/base-model/button.model';
import * as fromProduct from '../products/state/product.reducer';
import * as productActions from '../products/state/product.actions';
import * as productSelector from '../products/state/index';
import * as fromAuths from '../../shared/components/auth/state/index';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListViewModel } from './product';
import { environment } from 'src/environments/environment';
import { ProductDuplicateComponent } from './product-duplicate/product-duplicate.component';
import { ImportCSVComponent } from './import-csv/import-csv.component';
import { DeleteProductComponent } from './product-delete/product-delete.component';
import { ProductFormatFileComponent } from './product-format-file/product-format-file.component';

const AddFormIndex = 1;
const ImportCSV = 2;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent extends ComponentBase {
  constructor(private store: Store<fromProduct.ProductState>,
    public injector: Injector) {
    super(injector);
  }
  public addSuccessMessage = 'Product is added.';
  public updateSuccessMessage = 'Product is updated.';
  public deleteSuccessMessage = 'Product is deleted.';
  public datasource: Array<ProductListViewModel> = [];
  public listButton = Array<Button>();
  public title;
  public pageSize = 10;
  public actionType = ActionType.dialog;
  componentActive = true;
  isHiddenSearchBox = false;
  userDefinedColumnSetting: UserDefinedColumnSetting;
  public queryText = '';
  onInit() {
    this.title = 'Product Management';
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
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsProduct`,
            'name,description',
            environment.app.ims.apiUrl
          );
          this.getProducts(this.queryText);
          this.setButtonsConfiguration();
        })
    );

    this.handleSubscription(
      this.store
        .pipe(
          select(productSelector.getSelectedItem),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string | null) => {
          if (id) {
            this.changeListButton(false);
          } else {
            this.changeListButton(true);
          }
        })
    );
  }

  onDestroy() { }

  getProducts(searchText: string) {
    this.store.dispatch(new productActions.GetProducts(new PagingFilterCriteria(1, this.pageSize), searchText));
    this.store.pipe(select(productSelector.getProducts),
      takeWhile(() => this.componentActive))
      .subscribe((products: Array<ProductListViewModel>) => {
        this.datasource = products.map(x => {
          return {
            id: x.id,
            name: x.name,
            description: x.description,
            categoryId: x.categoryId,
            categoryName: x.categoryName,
            createdBy: x.createdBy,
            createdDate: x.createdDate,
            updatedBy: x.updatedBy,
            updatedDate: x.updatedDate,
            isDelete: x.isDelete,
          };
        });
      });
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(
      new productActions.GetProducts(
        new PagingFilterCriteria(page + 1, this.pageSize), this.queryText
      )
    );
  }

  setButtonsConfiguration() {
    this.listButton = [
      new Button({
        id: AddFormIndex,
        title: 'Add',
        component: ProductAddComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      }),
      new Button({
        id: AddFormIndex,
        title: 'Edit',
        component: ProductEditComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: 2,
        title: 'Delete',
        component: DeleteProductComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: AddFormIndex,
        title: 'Duplicate',
        component: ProductDuplicateComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: true
      }),
      new Button({
        id: ImportCSV,
        title: 'Import CSV',
        component: ImportCSVComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      }),
      new Button({
        id: 5,
        title: 'Format CSV',
        component: ProductFormatFileComponent,
        configDialog: { size: 'lg', centered: true, backdrop: 'static' },
        disable: false
      })
    ];
  }

  changeListButton(isDisabled: boolean) {
    if (!this.listButton) {
      return;
    }
    this.listButton.forEach(btn => {
      if (btn.title === 'Edit' || btn.title === 'Delete' || btn.title === 'Duplicate' || btn.title === 'View BarCodes') {
        btn.disable = isDisabled;
      }
    });
  }

  eventSearchQuery(event: any) {
    this.queryText = event;
    this.getProducts(this.queryText);
  }
}
