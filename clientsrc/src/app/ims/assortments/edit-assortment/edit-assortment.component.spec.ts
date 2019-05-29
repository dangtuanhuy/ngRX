import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssortmentComponent } from './edit-assortment.component';

describe('EditAssortmentComponent', () => {
  let component: EditAssortmentComponent;
  let fixture: ComponentFixture<EditAssortmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssortmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssortmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
