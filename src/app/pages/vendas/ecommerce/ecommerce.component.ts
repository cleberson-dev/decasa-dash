import { Component, OnInit } from '@angular/core';
import { truncate } from 'fs-extra';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Venda de Balcão', link: '/vendas', active: false },
    { title: 'eCommerce', link: '/vendas/ecommerce', active: true },
    { title: 'Separando', link: '/vendas/separando', active: false },
    { title: 'Em rota', link: '/vendas/em-rota', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  rows = [
    { data: '17/05/2021', pedido: '964', descricao: 'TAXAS E MULTAS', valor: 999.99 },
    { data: '17/05/2021', pedido: '964', descricao: 'TAXAS E MULTAS', valor: 999.99 },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  openRow() {

  }
}
