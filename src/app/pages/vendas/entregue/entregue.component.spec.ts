import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregueComponent } from './entregue.component';

describe('EntregueComponent', () => {
  let component: EntregueComponent;
  let fixture: ComponentFixture<EntregueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
