import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFieldComponent } from './delete-field.component';

describe('DeleteFieldComponent', () => {
  let component: DeleteFieldComponent;
  let fixture: ComponentFixture<DeleteFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
