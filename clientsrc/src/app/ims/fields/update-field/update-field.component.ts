import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromField from '../state/field.reducer';
import * as fieldActions from '../state/field.action';
import * as fieldSelector from '../state/index';
import { Subscription } from 'rxjs';
import { FieldModel, EntityRefModel, PredefineModel } from '../field.model';
import { takeWhile } from 'rxjs/operators';
import { FieldType, FieldTypes } from '../field-base/field-type';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-update-field',
  templateUrl: './update-field.component.html',
  styleUrls: ['./update-field.component.css']
})
export class UpdateFieldComponent extends ComponentBase {

  updateValueForm: FormGroup = new FormGroup({});
  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromField.FieldState>,
    public injector: Injector) {
    super(injector);
  }
  public updateItemIdSubscription = new Subscription();
  public field: FieldModel;
  public componentActive = true;
  public itemId = null;
  isShowEntityRefList = false;
  isShowPredefinedList = false;
  predefinedList;
  entityRefList = [];
  selectedEntityRef;
  typeId = '';
  defaultValue;

  onInit() {
    this.store.dispatch(new fieldActions.GetEntityRefList());
    this.store.pipe(select(fieldSelector.getEntityRefList),
      takeWhile(() => this.componentActive))
      .subscribe(
        (entityRefList: Array<EntityRefModel>) => {
          this.entityRefList = entityRefList;
        }
      );

    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: [''],
      identifiedId: [''],
      defaultValue: [''],
      entityList: [''],
      predefinedList: ['']
    });

    this.handleSubscription(
      this.store.pipe(select(fieldSelector.getSelectedItem),
        takeWhile(() => this.componentActive))
        .subscribe(
          (id: string) => {
            if (id == null) {
              return;
            }
            this.itemId = id;
            this.store.dispatch(new fieldActions.GetField(id));
          }
        ));

    this.handleSubscription(this.store.pipe(
      select(fieldSelector.getField), takeWhile(() => this.componentActive))
      .subscribe(
        (field: FieldModel) => {
          if (field == null) {
            return;
          }
          this.field = field;
          this.typeId = field.type;
          if (field.type == FieldType.EntityReference.toString()) {
            this.isShowEntityRefList = true;
            this.selectedEntityRef = this.buildSelectedEntityRef(field.type, field.defaultValue);
          } else if (field.type == FieldType.PredefinedList.toString()) {
            this.isShowPredefinedList = true;
          }
          this.updateValueForm.patchValue({
            name: this.field.name,
            description: this.field.description,
            defaultValue: this.field.defaultValue,
            type: FieldType[this.field.type] ? FieldType[this.field.type] : this.field.type,
            identifiedId: this.field.identifiedId,
            predefinedList: this.buildPredefineList(this.field.type, this.field.defaultValue)
          });
        }));
  }

  onDestroy() {

  }

  buildPredefineList(type: string, value: string) {
    if (type != FieldType.PredefinedList.toString() || !value) {
      return [];
    }
    const values = value.split(',');
    const result = [];
    values.forEach((item: any) => {
      result.push(new PredefineModel({ display: item, value: item }));
    });
    return result;
  }

  buildSelectedEntityRef(type: string, value: string) {
    if (type != FieldType.EntityReference.toString()) {
      return value;
    }
    if (checkJsonString(value)) {
      const object = new EntityRefModel(JSON.parse(value));
      return object.id;
    }
  }

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
    this.setDefaultValue();
    const field: FieldModel = {
      id: this.itemId,
      name: name,
      description: description,
      defaultValue: this.defaultValue,
      type: this.typeId,
      identifiedId: identifiedId
    };
    this.store.dispatch(new fieldActions.UpdateField(field));
  }

  setDefaultValue() {
    if (this.typeId == FieldTypes['Entity Reference'].toString()) {
      const selectedValue = this.entityRefList.find(x => x.id === this.selectedEntityRef);
      if (selectedValue) {
        this.defaultValue = '';
        Object.keys(selectedValue).map((key, value) => {
          this.defaultValue += `"${key}": "${selectedValue[key]}",`;
        });
        this.defaultValue = this.defaultValue.substring(0, this.defaultValue.length - 1);
        this.defaultValue = `{ ${this.defaultValue} }`;
      }
    } else if (this.typeId == FieldTypes['Predefined List'].toString() && this.predefinedList !== undefined) {
      this.defaultValue = '';
      this.predefinedList.forEach(item => {
        this.defaultValue += `${item.value},`;
      });
      this.defaultValue = this.defaultValue.substring(0, this.defaultValue.length - 1);
    } else {
      this.defaultValue = undefined;
    }
    return this.defaultValue;
  }
}
