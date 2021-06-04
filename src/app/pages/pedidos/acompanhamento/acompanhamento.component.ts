import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-acompanhamento',
  templateUrl: './acompanhamento.component.html',
  styleUrls: ['./acompanhamento.component.scss']
})
export class AcompanhamentoComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa' },
    { title: 'Ordem de compra', link: '/pedidos/ordem-compra' },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento', active: true },
  ];

  mapas = [
    { codigo: '123456/2021', data: '01/01/1999', solicitante: 'Lorem Ipsum', loja: 'Loja #1' },
    { codigo: '333333/2021', data: '01/01/1999', solicitante: 'Lorem Ipsum', loja: 'Loja #2' },
  ];

  ordensDeCompra = [
    { 
      codigo: '123456/2021',
      data: '01/01/1999', 
      solicitante: 'Lorem Ipsum', 
      loja: 'Loja #1',
      preco: 99.99
    },
    { 
      codigo: '333123/2021',
      data: '02/01/1999', 
      solicitante: 'Lorem Ipsum', 
      loja: 'Loja #1',
      preco: 999.99
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
