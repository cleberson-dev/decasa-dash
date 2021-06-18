import { Component, OnInit } from '@angular/core';
import { Tab } from '../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Venda de Balcão', link: '/vendas', active: true },
    { title: 'eCommerce', link: '/vendas/ecommerce', active: false },
    { title: 'Separando', link: '/vendas/separando', active: false },
    { title: 'Em rota', link: '/vendas/em-rota', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  data = [
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false }
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
