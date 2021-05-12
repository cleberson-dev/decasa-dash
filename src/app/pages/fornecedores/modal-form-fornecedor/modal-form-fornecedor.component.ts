import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as CustomValidators from '../../../validators';

@Component({
  selector: 'ngx-modal-form-fornecedor',
  templateUrl: './modal-form-fornecedor.component.html',
  styleUrls: ['./modal-form-fornecedor.component.scss']
})
export class ModalFormFornecedorComponent implements OnInit {
  @Output() backBtnClick = new EventEmitter();

  form = this.fb.group({
    nome: ['', Validators.required],
    cnpj: ['', Validators.required, CustomValidators.cnpj],
    logradouro: ['', Validators.required],
    numero: ['', Validators.required],
    bairro: ['', Validators.required],
    cep: ['', Validators.required, CustomValidators.cpf],
    pontoReferencia: ['', Validators.required],
    celular: ['', Validators.required],
    telefone: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    // RG Representante, CPF Representante, Data RG
  })

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}
