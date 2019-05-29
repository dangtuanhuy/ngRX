import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAssortmentComponent } from './delete-assortment.component';

describe('DeleteAssortmentComponent', () => {
  let component: DeleteAssortmentComponent;
  let fixture: ComponentFixture<DeleteAssortmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAssortmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAssortmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
