import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFileCatalogComponent } from './import-file-catalog.component';

describe('ImportFileCatalogComponent', () => {
  let component: ImportFileCatalogComponent;
  let fixture: ComponentFixture<ImportFileCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportFileCatalogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFileCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
