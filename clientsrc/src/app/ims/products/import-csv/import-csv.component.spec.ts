import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCSVComponent } from './import-csv.component';

describe('ImportCsvComponent', () => {
  let component: ImportCSVComponent;
  let fixture: ComponentFixture<ImportCSVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCSVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
