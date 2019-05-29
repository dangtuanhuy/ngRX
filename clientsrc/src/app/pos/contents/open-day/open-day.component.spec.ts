import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDayComponent } from './open-day.component';

describe('OpenDayComponent', () => {
  let component: OpenDayComponent;
  let fixture: ComponentFixture<OpenDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
