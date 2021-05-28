import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Venda de Balcão', link: '/vendas' },
    { title: 'eCommerce', link: '/vendas/ecommerce', active: true }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
