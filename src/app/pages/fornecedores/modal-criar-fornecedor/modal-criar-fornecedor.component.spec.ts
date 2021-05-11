import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCriarFornecedorComponent } from './modal-criar-fornecedor.component';

describe('ModalCriarFornecedorComponent', () => {
  let component: ModalCriarFornecedorComponent;
  let fixture: ComponentFixture<ModalCriarFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCriarFornecedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCriarFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
