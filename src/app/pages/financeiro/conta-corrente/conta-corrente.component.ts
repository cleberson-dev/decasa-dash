import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-conta-corrente',
  templateUrl: './conta-corrente.component.html',
  styleUrls: ['./conta-corrente.component.scss']
})
export class ContaCorrenteComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Lançamentos', link: '/financeiro', active: false },
    { title: 'Relatórios', link: '/financeiro/relatorios', active: false },
    { title: 'Conta Corrente', link: '/financeiro/conta-corrente', active: true },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
