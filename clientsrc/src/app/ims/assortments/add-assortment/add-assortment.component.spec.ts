import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssortmentComponent } from './add-assortment.component';

describe('AddAssortmentComponent', () => {
  let component: AddAssortmentComponent;
  let fixture: ComponentFixture<AddAssortmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssortmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssortmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
