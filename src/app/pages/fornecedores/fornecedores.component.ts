import { Component, OnInit, TemplateRef } from '@angular/core';
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
  fornecedores: Fornecedor[] = []

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
    this.dialogService.open(dialog, { context: { type: 'criar' }});
  }

  openDetails(dialog: TemplateRef<any>, fornecedor: Fornecedor) {
    this.dialogService.open(dialog, { 
      context: { 
        type: 'detalhes',
        fornecedor
      }
    });
  }
}
