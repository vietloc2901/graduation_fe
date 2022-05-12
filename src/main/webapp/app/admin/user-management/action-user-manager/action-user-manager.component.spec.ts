import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionUserManagerComponent } from './action-user-manager.component';

describe('ActionUserManagerComponent', () => {
  let component: ActionUserManagerComponent;
  let fixture: ComponentFixture<ActionUserManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionUserManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionUserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
