import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReasonComponent } from './delete-reason.component';

describe('DeleteReasonComponent', () => {
  let component: DeleteReasonComponent;
  let fixture: ComponentFixture<DeleteReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
