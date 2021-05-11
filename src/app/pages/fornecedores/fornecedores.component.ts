import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
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

  fornecedores: Fornecedor[] = [
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
    },
    { 
      id: 4,
      nome: 'Fornecedor #4',
      ...defaultData
    },
  ]

  constructor(
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }
}
