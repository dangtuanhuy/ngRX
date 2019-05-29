import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromFieldTemplate from '../state/field-template.reducer';
import * as fieldTemplateActions from '../state/field-template.action';
import * as fieldTemplateSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import {
  Section,
  FieldTemplateModel,
  FieldTemplateTypes,
  FieldFieldTemplateModel,
  FieldFieldTemplateActions,
  FieldTemplateType
} from '../field-template.model';
import { FieldModel, EntityRefModel } from 'src/app/ims/fields/field.model';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FieldType, FieldTypes } from '../../fields/field-base/field-type';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';

const textSectionName = 'Section';
@Component({
  selector: 'app-add-field-template',
  templateUrl: './add-field-template.component.html',
  styleUrls: ['./add-field-template.component.scss']
})
export class AddFieldTemplateComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromFieldTemplate.FieldTemplateState>,
    public injector: Injector
  ) {
    super(injector);
  }
  section: Section[] = [];
  sectionsRequest: Section[] = [];
  isVariant: boolean;
  defaultSection: Section = new Section({
    name: 'Variant',
    isVariantField: true,
    orderSection: -1,
    fields: Array<FieldModel>()
  });
  componentActive = true;
  listField: FieldModel[] = [];
  isSelected = true;
  selectedSection: Section;
  fieldTemplateTypes: Array<string> = [];
  FieldTemplateTypes = FieldTemplateTypes;
  FieldFieldTemplateActions = FieldFieldTemplateActions;
  isVariantField = false;
  supportWithVariant = false;
  selectedField: any;
  orderSection = 0;
  predefinedList: FieldModel[] = [];

  onInit() {
    this.getFields();
    this.getFieldTemplateTypes();
    this.section.unshift(this.defaultSection);

    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      identifiedId: ['', Validators.required],
      type: [''],
      field: [''],
      sectionName: [''],
      listField: ['']
    });
  }

  onDestroy() {
    this.componentActive = false;
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onChangeType(e: any) { }

  // onChangeType(e: any) {
  //   if (e.target.checked) {
  //     this.section.unshift(this.defaultSection);
  //   } else {
  //     if (this.section) {
  //       this.section = this.section.filter((item) => {
  //         return item.orderSection !== -1;
  //       });
  //     }
  //   }
  // }

  onClickAddSection(e: any) {
    this.orderSection = Math.max.apply(Math, this.section.map(function (o) { return o.orderSection; })) + 1;
    const count = this.section.length;
    const tempSection = new Section({
      name: `${textSectionName}_${count + 1}`,
      isVariantField: false,
      orderSection: this.orderSection,
      fields: Array<FieldFieldTemplateModel>()
    });
    this.section.push(tempSection);
  }

  onClickAddField(orderSection: number) {
    this.isSelected = false;
    this.selectedSection = this.section.filter((value) => {
      return value.orderSection === orderSection;
    }).pop();
    this.selectedField = [];
  }

  onEditSectionName(event, orderSection: number) {
    const sectionName = event.target.value;
    this.section.find(x => x.orderSection === orderSection).name = sectionName;
  }

  onSelectdField(e: FieldModel) {
    if (e && this.selectedSection) {
      const newFieldFieldTemplate = new FieldFieldTemplateModel({
        field: e
      });
      this.selectedSection.fields.push(newFieldFieldTemplate);
      if (e.type.toString() === FieldType.PredefinedList.toString()) {
        this.predefinedList = this.predefinedList.filter(item => {
          return item.id !== e.id;
        });
      }
    }
    this.isSelected = true;
    this.selectedSection = null;
    this.resetListField(e);
    this.isVariantField = this.checkVariantField();
  }

  resetListField(e: FieldModel) {
    this.listField = this.listField.filter(item => {
      return item.id !== e.id;
    });
  }

  getFields() {
    this.store.dispatch(new fieldTemplateActions.GetFields());
    this.store
      .pipe(
        select(fieldTemplateSelector.getFields),
        takeWhile(() => this.componentActive)
      )
      .subscribe((fields: any) => {
        this.listField = fields;
        this.predefinedList = [];
        this.listField.forEach(x => {
          if (x.type.toString() === FieldType.PredefinedList.toString()) {
            const tempField = new FieldModel(x);
            this.predefinedList.push(tempField);
          }
        });
        this.predefinedList = Array.from(this.predefinedList);
      });
  }

  getFieldTemplateTypes() {
    this.store
      .pipe(
        select(fieldTemplateSelector.getFieldTemplateTypes),
        takeWhile(() => this.componentActive)
      )
      .subscribe((fieldTemplateTypes: Array<string>) => {
        this.fieldTemplateTypes = fieldTemplateTypes;
      });
  }

  onDeleteSection(e: Section) {
    if (this.section && this.section.length > 0) {
      this.section = this.section.filter(item => {
        return item !== e;
      });
      e.fields.forEach(item => {
        this.listField.push(new FieldModel(item.field));
        if (item.field.type.toString() === FieldType.PredefinedList.toString()) {
          this.predefinedList.push(new FieldModel(item.field));
        }
      });
      this.listField = Array.from(this.listField);
      this.predefinedList = Array.from(this.predefinedList);
      this.selectedSection = this.section.filter((value) => {
        return value.orderSection === e.orderSection;
      }).pop();
    }
  }

  onDeleteField(section: Section, field: FieldModel) {
    if (field && section) {
      section.fields = section.fields.filter(item => {
        return item.field.id !== field.id;
      });
      this.listField.push(field);
      this.listField = Array.from(this.listField);
      if (field.type.toString() === FieldType.PredefinedList.toString()) {
        this.predefinedList.push(new FieldModel(field));
      }
      this.predefinedList = Array.from(this.predefinedList);
      this.selectedSection = this.section.filter((value) => {
        return value.orderSection === section.orderSection;
      }).pop();
    }
    this.isVariantField = this.checkVariantField();
    this.selectedField = [];
  }
  mergeSectionSameName() {
    this.sectionsRequest = [];
    this.section.forEach((item) => {
      if (item.isVariantField) {
        this.sectionsRequest.push(item);
        return;
      }

      if (this.sectionsRequest.find(x => x.name === item.name)) {
        return;
      }

      const sectionsDuplicateName = this.section.filter((value) => value.name === item.name);
      if (sectionsDuplicateName.length === 1) {
        this.sectionsRequest.push(item);
        return;
      }

      const newSection = new Section({
        name: item.name,
        isVariantField: false,
        orderSection: item.orderSection,
        fields: Array<FieldModel>()
      });

      sectionsDuplicateName.forEach(section => {
        section.fields.forEach(field => {
          newSection.fields.push(field);
        });
      });
      this.sectionsRequest.push(newSection);
    });
  }

  onSave() {
    this.mergeSectionSameName();
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const identifiedId = this.addValueForm.get('identifiedId').value;
    const fieldTemplate: FieldTemplateModel = {
      id: undefined,
      name: name,
      description: description,
      identifiedId: identifiedId,
      sections: this.sectionsRequest,
      type:
        this.sectionsRequest && this.sectionsRequest.includes(this.defaultSection)
          ? FieldTemplateType.WithVariant.toString()
          : FieldTemplateType.WithoutVariant.toString()
    };
    this.store.dispatch(
      new fieldTemplateActions.AddFieldTemplate(fieldTemplate)
    );
  }
  checkVariantField() {
    const existVariant = this.section.find(x => x.isVariantField === true);
    if (existVariant.fields.length > 0) {
      return true;
    }
    return false;
  }

  getFieldType(type: any) {
    return Object.values(FieldTypes).includes(+type)
      ? Object.keys(FieldTypes).find(function (item, key) { return key === (+type - 1); })
      : type;
  }

  buildDefaultValue(value: any, type: string) {
    if (type.toString() === FieldType.EntityReference.toString()) {
      if (checkJsonString(value)) {
        const object = new EntityRefModel(JSON.parse(value));
        return object.name;
      }
    }
    return value;
  }

  getItems(orderSection: number) {
    if (orderSection === -1) {
      return this.predefinedList;
    } else {
      return this.listField;
    }
  }
}
