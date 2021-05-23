import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaCompraComponent } from './alerta-compra.component';

describe('AlertaCompraComponent', () => {
  let component: AlertaCompraComponent;
  let fixture: ComponentFixture<AlertaCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertaCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
