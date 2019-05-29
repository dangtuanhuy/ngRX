import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsCollectionComponent } from './variants-collection.component';

describe('VariantsCollectionComponent', () => {
  let component: VariantsCollectionComponent;
  let fixture: ComponentFixture<VariantsCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantsCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
