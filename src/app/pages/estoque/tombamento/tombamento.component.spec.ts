import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TombamentoComponent } from './tombamento.component';

describe('TombamentoComponent', () => {
  let component: TombamentoComponent;
  let fixture: ComponentFixture<TombamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TombamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TombamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
