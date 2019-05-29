import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSelectComponent } from './quick-select.component';

describe('QuickSelectComponent', () => {
  let component: QuickSelectComponent;
  let fixture: ComponentFixture<QuickSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
