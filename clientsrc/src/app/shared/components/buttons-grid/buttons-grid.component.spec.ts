import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonsGridComponent } from './buttons-grid.component';


describe('GridButtonComponent', () => {
  let component: ButtonsGridComponent;
  let fixture: ComponentFixture<ButtonsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
