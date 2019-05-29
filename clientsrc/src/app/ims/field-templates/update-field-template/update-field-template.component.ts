import { Component, OnInit, Injector } from '@angular/core';
import {
  Section, FieldTemplateTypes, FieldFieldTemplateActions,
  FieldFieldTemplateModel, FieldTemplateModel, FieldFieldTemplateAction, FieldTemplateType
} from '../field-template.model';
import { FieldModel, EntityRefModel } from 'src/app/ims/fields/field.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromFieldTemplate from '../state/field-template.reducer';
import * as fieldTemplateActions from '../state/field-template.action';
import * as fieldTemplateSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { FieldTemplateService } from 'src/app/shared/services/field-template.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FieldType, FieldTypes } from '../../fields/field-base/field-type';
import { checkJsonString } from 'src/app/shared/utils/JSON.util';

const textSectionName = 'Section';
const variantSectionName = 'Variant';

@Component({
  selector: 'app-update-field-template',
  templateUrl: './update-field-template.component.html',
  styleUrls: ['./update-field-template.component.css']
})
export class UpdateFieldTemplateComponent extends ComponentBase {

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromFieldTemplate.FieldTemplateState>,
    private fieldTemplateService: FieldTemplateService,
    public injector: Injector) {
    super(injector);
  }

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
  updateValueForm: FormGroup = new FormGroup({});
  public itemId = null;
  deletedSections = [];
  public fieldTemplate: FieldTemplateModel = new FieldTemplateModel({});
  public listSections = [];
  public orderSectionList = [];
  type: boolean;
  isVariantField = true;
  supportWithVariant = false;
  orderSection = 0;
  selectedField: any;
  countDeleteSections = 0;
  sectionsRequest: Section[] = [];
  isDeactive: boolean;

  onInit() {
    this.getFieldTemplateTypes();
    this.getSelectedItem();

    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      identifiedId: ['', Validators.required],
      type: [''],
      field: [''],
      sectionName: [''],
      listField: ['']
    });

    this.handleSubscription(this.fieldTemplateService.getBy(this.itemId).subscribe(result => {
      this.fieldTemplate = new FieldTemplateModel(result);
      this.fieldTemplate.sections.sort(
        function (a, b) { return (a.orderSection > b.orderSection) ? 1 : ((b.orderSection > a.orderSection) ? -1 : 0); }
      );
      result.sections.forEach(x => {
        const section = {
          name: x.name,
          orderSection: x.orderSection
        };
        this.listSections.push(section);
      });
      if (result && result.sections) {
        this.getFields(result);
      }
      this.updateValueForm.patchValue({
        name: this.fieldTemplate.name,
        description: this.fieldTemplate.description,
        identifiedId: this.fieldTemplate.identifiedId
      });
    }));
  }

  filterListField(element: Section) {
    element.fields.forEach(field => {
      if (this.listField && this.listField.length > 0) {
        this.listField = this.listField.filter(x => {
          return x.id !== field.field.id;
        });
      }
    });
  }

  onDestroy() {
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onChangeType(e: any) {
    if (e.target.checked) {
      this.fieldTemplate.sections.unshift(this.defaultSection);
    } else {
      if (this.fieldTemplate && this.fieldTemplate.sections) {
        this.fieldTemplate.sections = this.fieldTemplate.sections.filter((item) => {
          return item.orderSection !== -1;
        });
      }
    }
  }

  getFields(fieldTemplate: FieldTemplateModel) {
    this.store.dispatch(new fieldTemplateActions.GetFields());
    this.store.pipe(select(fieldTemplateSelector.getFields),
      takeWhile(() => this.componentActive))
      .subscribe(
        (fields: any) => {
          this.listField = fields;
          this.fieldTemplate.sections.forEach(element => {
            this.filterListField(element);
          });
        }
      );
  }

  getFieldTemplateTypes() {
    this.store.pipe(select(fieldTemplateSelector.getFieldTemplateTypes),
      takeWhile(() => this.componentActive))
      .subscribe(
        (fieldTemplateTypes: Array<string>) => {
          this.fieldTemplateTypes = fieldTemplateTypes;
        }
      );
  }

  onClickAddSection(e: any) {
    this.orderSection = Math.max.apply(Math, this.fieldTemplate.sections.map(function (o) { return o.orderSection; })) + 1;
    const count = this.fieldTemplate.sections.length;
    const tempSection = new Section({
      name: `${textSectionName}_${count + 1}`,
      isVariantField: false,
      orderSection: this.orderSection,
      fields: Array<FieldFieldTemplateModel>()
    });
    this.fieldTemplate.sections.push(tempSection);
  }

  onClickAddField(orderSection: number) {
    this.isSelected = false;
    this.selectedSection = this.fieldTemplate.sections.find(x => x.orderSection === orderSection);
    this.selectedField = [];
  }

  onSelectdField(e: FieldModel) {
    if (e && this.selectedSection) {
      this.fieldTemplate.sections.forEach(element => {
        if (element.orderSection === this.selectedSection.orderSection) {
          const newField = new FieldFieldTemplateModel({
            field: e,
            action: FieldFieldTemplateAction.Add
          });
          if (element.fields.find(x => x.field.id === e.id)) {
            element.fields.forEach(x => {
              if (x.field.id === e.id) {
                x.action = FieldFieldTemplateAction.Add.toString();
              }
            });
          } else {
            element.fields.push(newField);
          }
        }
      });
    }
    this.isSelected = true;
    this.selectedSection = null;
    this.resetListField(e);
    this.isVariantField = this.checkVariantField();
  }

  resetListField(e: FieldModel) {
    this.listField = this.listField.filter((item) => {
      return item.id !== e.id;
    });
  }


  onDeleteSection(e: Section) {
    this.deletedSections.push(e.orderSection);
    this.fieldTemplate.sections.forEach((section) => {
      if (section.orderSection === e.orderSection) {
        section.fields.forEach((fieldFieldTemplate) => {
          fieldFieldTemplate.action = FieldFieldTemplateAction.Delete.toString();
        });
      }
    });
    e.fields.forEach((item) => {
      this.listField.push(item.field);
    });
    this.listField = Array.from(this.listField);
  }

  onDeleteField(section: Section, field: FieldModel) {
    if (field && section) {
      this.fieldTemplate.sections.forEach((item) => {
        if (item.orderSection === section.orderSection) {
          item.fields.forEach((fieldFieldTemplate) => {
            if (fieldFieldTemplate.field.id == field.id) {
              fieldFieldTemplate.action = FieldFieldTemplateAction.Delete.toString();
            }
          });
        }
      });
      this.listField.push(field);
      this.listField = Array.from(this.listField);
    }
    this.isVariantField = this.checkVariantField();
    this.selectedField = [''];
  }

  onSave() {
    const name = this.updateValueForm.get('name').value;
    const description = this.updateValueForm.get('description').value;
    const identifiedId = this.updateValueForm.get('identifiedId').value;
    const fieldTemplate: FieldTemplateModel = {
      id: this.fieldTemplate ? this.fieldTemplate.id : null,
      name: name,
      description: description,
      identifiedId: identifiedId,
      sections: this.getSectionRequest(),
      type: this.sectionsRequest && this.sectionsRequest.some(function(element, i) {
        return element.name === variantSectionName && element.isVariantField ? true : false; })
        ? FieldTemplateType.WithVariant.toString()
        : FieldTemplateType.WithoutVariant.toString()
    };
    this.store.dispatch(new fieldTemplateActions.UpdateFieldTemplate(fieldTemplate));
    this.activeModal.close('closed');
  }

  getSelectedItem() {
    this.handleSubscription(this.store.pipe(select(fieldTemplateSelector.getSelectedItem),
      takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          this.itemId = id;
        }
      ));
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

  checkVariantField() {
    const existVariant = this.fieldTemplate.sections.find(x => x.isVariantField === true);
    if (existVariant.fields.length > 0) {
      return true;
    }
    return false;
  }

  isEditSectionName(x: number) {
    return !this.orderSectionList.includes(x);
  }

  getSectionRequest() {
    this.fieldTemplate.sections = this.fieldTemplate.sections.map(x => {
      x.fields = x.fields.filter(y => {
        return (!((y.id === null || y.id === undefined) && y.action === FieldFieldTemplateAction.Delete.toString()));
      });
      return x;
    });
    this.listSections.forEach(x => {
      const temp = this.fieldTemplate.sections.find(y => y.orderSection === x.orderSection);
      if (temp && temp.name !== x.name) {
        const deletedSection = new Section({
          name: x.name,
          isVariantField: false,
          orderSection: x.orderSection,
          fields: temp.fields.filter(y => y.id !== undefined)
        });
        deletedSection.fields = deletedSection.fields.map(y => {
          const newField = new FieldFieldTemplateModel(y);
          newField.id = y.id;
          newField.action = FieldFieldTemplateAction.Delete.toString();
          return newField;
        });
        this.fieldTemplate.sections.push(deletedSection);
        this.countDeleteSections += 1;
        temp.fields = temp.fields.filter(y => y.action !== FieldFieldTemplateAction.Delete.toString());
        temp.fields.forEach(y => y.id = undefined);
      }
    });
    this.mergeSectionSameName();
    return this.sectionsRequest;
  }

  checkDisplaySection(section: Section) {
    return this.deletedSections.includes(section.orderSection);
  }

  onEditSectionName(event, orderSection: number) {
    const sectionName = event.target.value;
    this.fieldTemplate.sections.find(x => x.orderSection === orderSection).name = sectionName;
  }

  mergeSectionSameName() {
    this.sectionsRequest = [];
    const sections = this.fieldTemplate.sections.slice(0, this.fieldTemplate.sections.length - this.countDeleteSections);
    sections.forEach((item) => {
      if (item.isVariantField) {
        this.sectionsRequest.push(item);
        return;
      }

      if (this.sectionsRequest.find(x => x.name === item.name)) {
        return;
      }

      const sectionsDuplicateName = sections.filter((value) => value.name === item.name);
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
        newSection.fields = newSection.fields.concat(section.fields);
      });
      this.sectionsRequest.push(newSection);
    });

    const deletedSections = this.fieldTemplate.sections.slice(
      this.fieldTemplate.sections.length - this.countDeleteSections, this.fieldTemplate.sections.length
    );
    this.sectionsRequest = this.sectionsRequest.concat(deletedSections);
  }
}
