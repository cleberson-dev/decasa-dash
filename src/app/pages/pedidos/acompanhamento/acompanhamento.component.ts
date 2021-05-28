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

  constructor() { }

  ngOnInit(): void {
  }

}
