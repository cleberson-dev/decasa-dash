import { Component, OnInit, Input } from '@angular/core';

export interface IProdutoLojista {
  foto: string;
  nome: string;
  marca: string;
  modelo: string;
  preco?: number;
  unidade?: string;
  categories?: string[];
}


type Option = {
  title: string;
};

@Component({
  selector: 'ngx-produto-lojista',
  templateUrl: './produto-lojista.component.html',
  styleUrls: ['./produto-lojista.component.scss']
})
export class ProdutoLojistaComponent implements OnInit {
  @Input() produto: IProdutoLojista;
  @Input() options: Option[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  get formattedPrice(): string {
    const exp = /\d+\.\d{2}/;
    return 'R$' + `${this.produto.preco}`.match(exp)[0].replace('.', ',');
  }

}
