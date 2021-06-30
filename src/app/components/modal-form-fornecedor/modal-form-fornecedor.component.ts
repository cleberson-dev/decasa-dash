import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CustomValidators from '../../validators';

@Component({
  selector: 'ngx-modal-form-fornecedor',
  templateUrl: './modal-form-fornecedor.component.html',
  styleUrls: ['./modal-form-fornecedor.component.scss']
})
export class ModalFormFornecedorComponent implements OnInit {
  @Input() initialForm: Fornecedor = {
    nomeFantasia: '', razaoSocial: '', cnpj: '', logradouro: '', numero: 0, bairro: '',
    cep: '', pontoReferencia: '', celular: '', telefone: '',
    email: '', inscricaoEstadual: '', categoriasFornecidas: [], departamentosFornecidos: []
  };
  @Input() title: string = 'Cadastro de Fornecedor';
  @Input() submitText: string = 'Enviar';
  @Output() backBtnClick = new EventEmitter();
  @Output() submitBtnClick = new EventEmitter<FormGroup>();

  form = this.fb.group({
    nomeFantasia: [this.initialForm.nomeFantasia, Validators.required],
    razaoSocial: [this.initialForm.razaoSocial, Validators.required],
    cnpj: [this.initialForm.cnpj, Validators.required, CustomValidators.cnpj],
    logradouro: [this.initialForm.logradouro, Validators.required],
    numero: [this.initialForm.numero, Validators.required],
    bairro: [this.initialForm.bairro, Validators.required],
    cep: [this.initialForm.cep, Validators.required, CustomValidators.cpf],
    pontoReferencia: [this.initialForm.pontoReferencia, Validators.required],
    celular: [this.initialForm.celular, Validators.required],
    telefone: [this.initialForm.telefone, Validators.required],
    email: [this.initialForm.email, Validators.required, Validators.email],
    // RG Representante, CPF Representante, Data RG
  })

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}
