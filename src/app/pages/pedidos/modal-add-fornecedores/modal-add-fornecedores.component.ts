import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Fornecedor } from '../../../types';



@Component({
  selector: 'ngx-modal-add-fornecedores',
  templateUrl: './modal-add-fornecedores.component.html',
  styleUrls: ['./modal-add-fornecedores.component.scss']
})
export class ModalAddFornecedoresComponent implements OnInit {
  @Output() btnClick = new EventEmitter();
  @Output() exit = new EventEmitter();

  fornecedores: Fornecedor[] = [
    { 
      id: 1,
      nome: 'Fornecedor #1',
      logradouro: 'Logradouro #1',
      bairro: 'Bairro #1',
      numero: 123,
      cep: '12345-789',
      pontoReferencia: 'Ponto de Referência',
      email: 'fornecedor@decasa.com',
      cnpj: '123.123.123-99',
      celular: '(XX) 9XXXX-XXXX',
      telefone: '(XX) XXXX-XXXX'
    },
    { 
      id: 2,
      nome: 'Fornecedor #2',
      logradouro: 'Logradouro #2',
      bairro: 'Bairro #2',
      numero: 123,
      cep: '12345-789',
      pontoReferencia: 'Ponto de Referência',
      email: 'fornecedor@decasa.com',
      cnpj: '123.123.123-99',
      celular: '(XX) 9XXXX-XXXX',
      telefone: '(XX) XXXX-XXXX'
    },
    { 
      id: 3,
      nome: 'Fornecedor #3',
      logradouro: 'Logradouro #3',
      bairro: 'Bairro #3',
      numero: 123,
      cep: '12345-789',
      pontoReferencia: 'Ponto de Referência',
      email: 'fornecedor@decasa.com',
      cnpj: '123.123.123-99',
      celular: '(XX) 9XXXX-XXXX',
      telefone: '(XX) XXXX-XXXX'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
