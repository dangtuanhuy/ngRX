import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonComponent } from './reason.component';

describe('ReasonsComponent', () => {
  let component: ReasonComponent;
  let fixture: ComponentFixture<ReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
