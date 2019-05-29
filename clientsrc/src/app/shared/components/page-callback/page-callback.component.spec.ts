import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCallbackComponent } from './page-callback.component';

describe('PageCallbackComponent', () => {
  let component: PageCallbackComponent;
  let fixture: ComponentFixture<PageCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
