import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStatusIndicatorComponent } from './api-status-indicator.component';

describe('ApiStatusIndicatorComponent', () => {
  let component: ApiStatusIndicatorComponent;
  let fixture: ComponentFixture<ApiStatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiStatusIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiStatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
