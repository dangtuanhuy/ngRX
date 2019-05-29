import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDataSearchComponent } from './sales-data-search.component';

describe('SalesDataSearchComponent', () => {
  let component: SalesDataSearchComponent;
  let fixture: ComponentFixture<SalesDataSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDataSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDataSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
