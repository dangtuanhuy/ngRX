import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithKeyboardComponent } from './input-with-keyboard.component';

describe('InputWithKeyboardComponent', () => {
  let component: InputWithKeyboardComponent;
  let fixture: ComponentFixture<InputWithKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputWithKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
