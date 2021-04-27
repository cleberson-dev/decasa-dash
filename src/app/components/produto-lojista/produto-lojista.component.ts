import { Component, OnInit, Input } from '@angular/core';

export interface IProdutoLojista {
  foto: string;
  nome: string;
  marca: string;
  modelo: string;
  preco: number;
  unidade?: string;
}



@Component({
  selector: 'ngx-produto-lojista',
  templateUrl: './produto-lojista.component.html',
  styleUrls: ['./produto-lojista.component.scss']
})
export class ProdutoLojistaComponent implements OnInit {
  @Input() produto: IProdutoLojista;

  items = [
    { title: 'Arroz' },
    { title: 'Feijão' },
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
