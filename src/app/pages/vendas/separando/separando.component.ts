import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-separando',
  templateUrl: './separando.component.html',
  styleUrls: ['./separando.component.scss']
})
export class SeparandoComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Venda de Balcão', link: '/vendas', active: false },
    { title: 'eCommerce', link: '/vendas/ecommerce', active: false },
    { title: 'Separando', link: '/vendas/separando', active: true },
    { title: 'Em rota', link: '/vendas/em-rota', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  rows = [
    { data: '17/05/2021', pedido: '964', descricao: 'TAXAS E MULTAS', valor: 999.99, opened: false },
    { data: '17/05/2021', pedido: '964', descricao: 'TAXAS E MULTAS', valor: 999.99, opened: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
