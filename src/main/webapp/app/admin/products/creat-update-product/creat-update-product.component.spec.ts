import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatUpdateProductComponent } from './creat-update-product.component';

describe('CreatUpdateProductComponent', () => {
  let component: CreatUpdateProductComponent;
  let fixture: ComponentFixture<CreatUpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatUpdateProductComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
