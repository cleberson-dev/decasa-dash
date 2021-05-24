import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../services/api.service';
import { Fornecedor } from '../../types';
import * as CustomValidators from '../../validators';

const defaultData = {
  bairro: 'Bairro #1',
  celular: '(99) 99999-9999',
  cep: '65284-000',
  cnpj: '123.123.123.123',
  email: 'email@decasa.com',
  logradouro: 'Rua 1º de Abril',
  numero: 123,
  pontoReferencia: 'Próximo a casa do lado',
  telefone: '(99) 99999-9999',
  cpfRepresentante: '123.123.123-12'
}

@Component({
  selector: 'ngx-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.scss']
})
export class FornecedoresComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  
  formTitle = '';
  formSubmitText = '';
  formType = '';
  formFornecedor = this.fb.group({
    id: [''],
    nome: ['', [Validators.required]],
    cnpj: ['', [Validators.required, CustomValidators.cnpj]],
    logradouro: ['', [Validators.required]],
    numero: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    cep: ['', [Validators.required, CustomValidators.cep]],
    pontoReferencia: [''],
    celular: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    // RG Representante, CPF Representante, Data RG
  });

  constructor(
    private dialogService: NbDialogService,
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.spinner.show();
    this.api.getFornecedores()
    .subscribe(fornecedores => {
      this.fornecedores = fornecedores;
      // this.spinner.hide();
    });
  }

  openCreate(dialog: TemplateRef<any>) {
    this.formTitle = 'Criar novo fornecedor';
    this.formSubmitText = 'Criar';
    this.formType = 'criar';
    this.formFornecedor.reset();
    this.dialogService.open(dialog, { context: { type: 'form' }});
  }

  openDetails(dialog: TemplateRef<any>, fornecedor: Fornecedor) {
    this.dialogService.open(dialog, { 
      context: { 
        type: 'detalhes',
        fornecedor
      }
    });
  }

  handleFormSubmit(ref: NbDialogRef<any>) {
    const fornecedor: Fornecedor = {
      id: this.formFornecedor.controls['id'].value || undefined,
      nome: this.formFornecedor.controls['nome'].value,
      cnpj: this.formFornecedor.controls['cnpj'].value,
      bairro: this.formFornecedor.controls['bairro'].value,
      celular: this.formFornecedor.controls['celular'].value,
      cep: this.formFornecedor.controls['cep'].value,
      email: this.formFornecedor.controls['email'].value,
      logradouro: this.formFornecedor.controls['logradouro'].value,
      numero: this.formFornecedor.controls['numero'].value,
      pontoReferencia: this.formFornecedor.controls['pontoReferencia'].value,
      telefone: this.formFornecedor.controls['telefone'].value
    };

    if (this.formType === 'editar') {
      this.api.editFornecedor(fornecedor)
        .subscribe(() => {
          const editedFornecedorIdx = this.fornecedores.findIndex(f => f.id === fornecedor.id);
          this.fornecedores[editedFornecedorIdx] = fornecedor;
        });
    } else if (this.formType === 'criar') {
      this.api.criarFornecedor({ id: undefined, ...fornecedor })
        .subscribe(() => {
          this.fornecedores.push(fornecedor);
        });
    }

    ref.close();
  }

  onEdit(context: any) {
    this.formTitle = 'Editar fornecedor';
    this.formSubmitText = 'Editar';
    this.formType = 'editar';
    this.formFornecedor.patchValue({
      id: context.fornecedor.id,
      nome: context.fornecedor.nome,
      cnpj: context.fornecedor.cnpj,
      logradouro: context.fornecedor.logradouro,
      numero: context.fornecedor.numero,
      bairro: context.fornecedor.bairro,
      cep: context.fornecedor.cep,
      pontoReferencia: context.fornecedor.pontoReferencia,
      celular: context.fornecedor.celular,
      telefone: context.fornecedor.telefone,
      email: context.fornecedor.email
    });
    context.type = 'form';
  }

  isControlInvalid(controlName: string) {
    return (
      this.formFornecedor.controls[controlName].invalid 
      && (
        this.formFornecedor.controls[controlName].touched 
        || this.formFornecedor.controls[controlName].dirty
      )
    );
  }

  getErrorMessage(controlName: string) {
    const [firstType] = Object
      .entries(this.formFornecedor.controls[controlName].errors)
      .filter(([_, val]) => !!val)
      .map(([key]) => key);

    const messages = {
      required: 'Campo Obrigatório -_-',
      cnpj: 'CNPJ Inválido',
      cpf: 'CPF Inválido'
    }

    const defaultMessage = 'Campo inválido *-*';

    return messages[firstType] || defaultMessage;
  }

  onBlock(fornecedorId: number, ref: NbDialogRef<any>) {
    this.api.removerFornecedor(fornecedorId)
      .subscribe(() => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedorId);
      });
    ref.close();
  }
}
