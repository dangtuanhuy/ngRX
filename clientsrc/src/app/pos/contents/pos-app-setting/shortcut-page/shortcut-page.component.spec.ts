import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutPageComponent } from './shortcut-page.component';

describe('ShortcutPageComponent', () => {
  let component: ShortcutPageComponent;
  let fixture: ComponentFixture<ShortcutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
