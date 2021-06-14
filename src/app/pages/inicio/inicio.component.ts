import { Component, OnInit } from '@angular/core';


type Loja = {
  nome: string;
  cnpj: string;
  inscricaoEstadual: string;
  codigo: string;
  endereco: string;
  telefone: string;
  gerente: string;
}

@Component({
  selector: 'ngx-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  lojas: (Loja & { collapsed?: boolean; })[] = [
    { 
      nome: 'Loja 01', 
      cnpj: '99.999.999/9999-99',
      codigo: 'Codigo 01',
      endereco: 'Endereço 01',
      gerente: 'Gerente 01',
      inscricaoEstadual: '9999999',
      telefone: '(99) 99999-9999',
    },
    { 
      nome: 'Loja 02', 
      cnpj: '88.888.888/8888-88',
      codigo: 'Codigo 02',
      endereco: 'Endereço 02',
      gerente: 'Gerente 02',
      inscricaoEstadual: '8888888',
      telefone: '(88) 88888-8888',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
