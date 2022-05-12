import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOrdersComponent } from './action-orders.component';

describe('ActionOrdersComponent', () => {
  let component: ActionOrdersComponent;
  let fixture: ComponentFixture<ActionOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
