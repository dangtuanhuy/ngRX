import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailListViewComponent } from './master-detail-list-view.component';

describe('MasterDetailListViewComponent', () => {
  let component: MasterDetailListViewComponent;
  let fixture: ComponentFixture<MasterDetailListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDetailListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDetailListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
