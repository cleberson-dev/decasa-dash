import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';

@Component({
  selector: 'ngx-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.scss']
})
export class EnderecosComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Dados Cadastrais', link: '/clientes'},
    { title: 'Cupons', link: '/clientes/cupons' },
    { title: 'Compras', link: '/clientes/compras' },
    { title: 'Devoluções', link: '/clientes/devolucoes' },
    { title: 'Endereços', link: '/clientes/enderecos', active: true },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
