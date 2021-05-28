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
    // { title: 'Separando', link: '/vendas/separando', active: false },
    // { title: 'Entregando', link: '/vendas/entregando', active: false },
    // { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
