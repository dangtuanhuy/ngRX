import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationsTableComponent } from './denominations-table.component';

describe('DenominationsTableComponent', () => {
  let component: DenominationsTableComponent;
  let fixture: ComponentFixture<DenominationsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenominationsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
