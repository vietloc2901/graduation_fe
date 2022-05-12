import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMyOrdersComponent } from './action-my-orders.component';

describe('ActionMyOrdersComponent', () => {
  let component: ActionMyOrdersComponent;
  let fixture: ComponentFixture<ActionMyOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionMyOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMyOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
