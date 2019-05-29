import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSaleDetailComponent } from './recent-sale-detail.component';

describe('RecentSaleDetailComponent', () => {
  let component: RecentSaleDetailComponent;
  let fixture: ComponentFixture<RecentSaleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentSaleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
