import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewManagementComponent } from './list-view-management.component';

describe('ListViewManagementComponent', () => {
  let component: ListViewManagementComponent;
  let fixture: ComponentFixture<ListViewManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListViewManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
