import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../services/api.service';
import { Fornecedor } from '../../types';

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
  formFornecedor: Fornecedor = {
    nome: '', cnpj: '', logradouro: '', numero: 0, bairro: '',
    cep: '', pontoReferencia: '', celular: '', telefone: '',
    email: ''
  };

  constructor(
    private dialogService: NbDialogService,
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.api.getAllProducts()
      .subscribe(console.log);
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
      this.fornecedores = [
        { 
          id: 1,
          nome: 'Fornecedor #1',
          ...defaultData
        },
        { 
          id: 2,
          nome: 'Fornecedor #2',
          ...defaultData
        },
        { 
          id: 3,
          nome: 'Fornecedor #3',
          ...defaultData
        },{
          id: 4,
          nome: 'Fornecedor #4',
          ...defaultData
        } 
      ];
    }, 2000);
  }

  openCreate(dialog: TemplateRef<any>) {
    this.formTitle = 'Criar novo fornecedor';
    this.formSubmitText = 'Criar';
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

  onFormSubmit(e: FormGroup) {
    console.log(e);
  }

  onEdit(context: any) {
    this.formTitle = 'Editar fornecedor';
    this.formSubmitText = 'Editar';
    this.formFornecedor = {
      ...context.fornecedor
    }
    console.log(this.formFornecedor);
    context.type = 'form';
  }
}
