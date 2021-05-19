import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Lançamentos', link: '/financeiro', active: false },
    { title: 'Relatórios', link: '/financeiro/relatorios', active: true },
    { title: 'Conta Corrente', link: '/financeiro/conta-corrente', active: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
