import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithKeyboardComponent } from './search-with-keyboard.component';

describe('SearchWithKeyboardComponent', () => {
  let component: SearchWithKeyboardComponent;
  let fixture: ComponentFixture<SearchWithKeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchWithKeyboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWithKeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
