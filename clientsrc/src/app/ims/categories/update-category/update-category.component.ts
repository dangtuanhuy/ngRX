import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/shared/services/category.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from '../category.model';
import { Store, select } from '@ngrx/store';
import * as fromCategory from '../state/category.reducer';
import * as categoryActions from '../state/category.action';
import * as categorySelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  constructor(private activeModal: NgbActiveModal,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private store: Store<fromCategory.CategoryState>,
    public injector: Injector
  ) {
    super(injector);
  }
  public category: CategoryModel;
  public componentActive = true;
  isDeactive: boolean;

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      identifiedId: ['', Validators.required],
      code: ['', Validators.required],
    });

    this.handleSubscription(this.store.pipe(
      select(categorySelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new categoryActions.GetCategory(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(categorySelector.getCategory), takeWhile(() => this.componentActive))
      .subscribe(
        (category: CategoryModel) => {
          if (category == null) {
            return;
          }
          this.category = category;
          this.updateValueForm.patchValue({
            name: this.category.name,
            description: this.category.description,
            identifiedId: this.category.identifiedId,
            code: this.category.code
          });
        }));
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.updateValueForm.get('name').value;
    const description = this.updateValueForm.get('description').value;
    const identifiedId = this.updateValueForm.get('identifiedId').value;
    const code = this.updateValueForm.get('code').value;
    const category: CategoryModel = {
      id: this.category.id,
      name: name,
      description: description,
      identifiedId: identifiedId,
      code: code
    };
    this.store.dispatch(new categoryActions.UpdateCategory(category));
  }
}

