import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFieldTemplateComponent } from './delete-field-template.component';

describe('DeleteFieldTemplateComponent', () => {
  let component: DeleteFieldTemplateComponent;
  let fixture: ComponentFixture<DeleteFieldTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFieldTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFieldTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
