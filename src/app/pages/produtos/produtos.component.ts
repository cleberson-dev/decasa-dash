import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'decasa-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosPageComponent implements OnInit {
  produtosLojista: ProdutoLojista[] = [];

  tabs = {
    meusProdutos: true,
    solicitar: false
  };

  ngOnInit() {
    this.apiService.getProdutosLojista()
      .subscribe(data => {
        this.produtosLojista = data.content;
      });
  }
  
  constructor(
    private apiService: ApiService
  ) {}

  changeTab(name: string) {
    this.tabs = {
      meusProdutos: name === 'meusProdutos',
      solicitar: name === 'solicitar'
    }
  }
}