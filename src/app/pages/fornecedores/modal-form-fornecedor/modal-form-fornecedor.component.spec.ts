import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormFornecedorComponent } from './modal-form-fornecedor.component';

describe('ModalFormFornecedorComponent', () => {
  let component: ModalFormFornecedorComponent;
  let fixture: ComponentFixture<ModalFormFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormFornecedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
