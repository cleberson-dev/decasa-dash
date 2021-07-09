import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

type Mapa = { 
  id: number;
  codigo: string; 
  data: string;
  solicitante?: string; 
  loja?: string; 
};

@Component({
  selector: 'ngx-acompanhamento',
  templateUrl: './acompanhamento.component.html',
  styleUrls: ['./acompanhamento.component.scss']
})
export class AcompanhamentoComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa' },
    { title: 'Ordem de compra' },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento', active: true },
  ];

  mapas: Mapa[] = [];

  ordensDeCompra = [
    { 
      codigo: '123456/2021',
      data: '01/01/1999', 
      solicitante: 'Lorem Ipsum', 
      loja: 'Loja #1',
      preco: 99.99
    },
    { 
      codigo: '333123/2021',
      data: '02/01/1999', 
      solicitante: 'Lorem Ipsum', 
      loja: 'Loja #1',
      preco: 999.99
    },
  ];

  comprasFinalizadas = [
    {
      codigo: '123456/2077',
      data: '01/01/2077',
      loja: 'Loja #2',
      preco: 999.99
    },
    {
      codigo: '123456/2021',
      data: '01/01/2077',
      loja: 'Loja #5',
      preco: 1999.99
    }
  ]

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.apiService.getPedidosPorLojista(this.authService.lojista.id)
      .subscribe(data => {
        this.mapas = data.content.map(pedido => ({
          id: pedido.id,
          codigo: `${pedido.id}`.padStart(6, '0'),
          data: pedido.dataCadastro,
        }));
      })
  }

}
