import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-devolucoes',
  templateUrl: './devolucoes.component.html',
  styleUrls: ['./devolucoes.component.scss']
})
export class DevolucoesComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Dados Cadastrais', link: '/clientes' },
    { title: 'Cupons', link: '/clientes/cupons' },
    { title: 'Compras', link: '/clientes/compras' },
    { title: 'Devoluções', link: '/clientes/devolucoes', active: true },
    { title: 'Endereços', link: '/clientes/enderecos' },
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
