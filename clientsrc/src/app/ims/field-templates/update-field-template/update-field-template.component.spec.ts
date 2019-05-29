import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFieldTemplateComponent } from './update-field-template.component';

describe('UpdateFieldTemplateComponent', () => {
  let component: UpdateFieldTemplateComponent;
  let fixture: ComponentFixture<UpdateFieldTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFieldTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFieldTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
