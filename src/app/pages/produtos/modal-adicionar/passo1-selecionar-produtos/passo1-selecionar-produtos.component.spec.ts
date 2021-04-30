import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdicionarPasso1Component } from './passo1-selecionar-produtos.component';

describe('ModalAdicionarPasso1Component', () => {
  let component: ModalAdicionarPasso1Component;
  let fixture: ComponentFixture<ModalAdicionarPasso1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAdicionarPasso1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdicionarPasso1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
