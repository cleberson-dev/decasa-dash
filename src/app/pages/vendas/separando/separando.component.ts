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
    { title: 'Entregando', link: '/vendas/entregando', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
