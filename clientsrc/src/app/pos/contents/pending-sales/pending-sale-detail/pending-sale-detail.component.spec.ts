import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSaleDetailComponent } from './pending-sale-detail.component';

describe('PendingSaleDetailComponent', () => {
  let component: PendingSaleDetailComponent;
  let fixture: ComponentFixture<PendingSaleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingSaleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSaleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
