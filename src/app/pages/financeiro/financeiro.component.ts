import { Component, OnInit } from '@angular/core';
import { Tab } from '../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Lançamentos', link: '/financeiro', active: true },
    { title: 'Relatórios', link: '/financeiro/relatorios', active: false },
    { title: 'Conta Corrente', link: '/financeiro/conta-corrente', active: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onPrintClick() {
    window.print();
  }
}
