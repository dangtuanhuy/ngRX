import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateReasonComponent } from './update-reason.component';

describe('UpdateReasonComponent', () => {
  let component: UpdateReasonComponent;
  let fixture: ComponentFixture<UpdateReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
