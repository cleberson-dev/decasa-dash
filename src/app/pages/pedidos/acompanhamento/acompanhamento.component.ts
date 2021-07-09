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

type Compra = {
  id: number;
  codigo: string;
  data: string;
  preco: number;
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

  ordensDeCompra: Compra[] = [];

  comprasFinalizadas: Compra[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.apiService.getPedidosPorLojista(this.authService.lojista.id)
      .subscribe(data => {
        this.mapas = data.content.map(pedido => ({
          id: pedido.id,
          codigo: `${pedido.id}`.padStart(6, '0'),
          data: pedido.dataCadastro,
        }));
      });

    this.apiService.getComprasPorLojista(this.authService.lojista.id)
      .subscribe(data => {
        this.ordensDeCompra = data.content.map(compra => ({
          id: compra.id,
          codigo: `${compra.id}`.padStart(6, '0'),
          data: compra.dataCompra,
          preco: compra.valor,
        }));
      });
  }

}
