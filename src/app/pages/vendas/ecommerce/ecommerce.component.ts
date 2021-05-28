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
    { title: 'Entregando', link: '/vendas/entregando', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
