import { Component, OnInit } from '@angular/core';
import { Tab } from '../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: true },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Estoque mínimo', link: '/estoque/minimo', active: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
