import { Component, OnInit } from '@angular/core';
import { Tab } from '../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Dados Cadastrais', link: '/clientes', active: true },
    { title: 'Cupons', link: '/clientes/cupons' },
    { title: 'Compras', link: '/clientes/compras' },
    { title: 'Devoluções', link: '/clientes/devolucoes' },
    { title: 'Endereços', link: '/clientes/enderecos' },
  ];

  clientes = [
    { nome: 'José Roberto da Silva Maria', cpf: '999.999.999-99', cnpj: '99.999.999/9999-99' },
    { nome: 'Mateus Araujo Lopes', cpf: '999.999.999-99', cnpj: '99.999.999/9999-99' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
