import { Component, OnInit, Input } from '@angular/core';

type Option = {
  title: string;
};

@Component({
  selector: 'ngx-produto-lojista',
  templateUrl: './produto-lojista.component.html',
  styleUrls: ['./produto-lojista.component.scss']
})
export class ProdutoLojistaComponent implements OnInit {
  @Input() produto: ResumidoProdutoLojista;
  @Input() options: Option[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  get formattedPrice(): string {
    const exp = /\d+\.\d{2}/;
    return 'R$' + `${this.produto.preco.toFixed(2)}`.match(exp)[0].replace('.', ',');
  }

}
