import { Component, OnInit, Input } from '@angular/core';

type Option = {
  title: string;
};

@Component({
  selector: 'ngx-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  @Input() produto: Produto;
  @Input() options: Option[] = [];
  @Input() valor: number | undefined = undefined;
  @Input() estoque: number | undefined = undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

  get formattedPrice(): string {
    const exp = /\d+\.\d{2}/;
    return 'R$' + `${this.valor.toFixed(2)}`.match(exp)[0].replace('.', ',');
  }

}
