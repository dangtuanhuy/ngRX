import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldTemplateComponent } from './add-field-template.component';

describe('AddFieldTemplateComponent', () => {
  let component: AddFieldTemplateComponent;
  let fixture: ComponentFixture<AddFieldTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFieldTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
