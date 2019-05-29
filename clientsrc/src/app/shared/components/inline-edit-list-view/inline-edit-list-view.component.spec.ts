import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditListViewComponent } from './inline-edit-list-view.component';

describe('InlineEditListViewComponent', () => {
  let component: InlineEditListViewComponent;
  let fixture: ComponentFixture<InlineEditListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
