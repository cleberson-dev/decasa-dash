import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tab } from '../../../components/tabber/tabber.component';
import { AuthService } from '../../../services/auth.service';
import { LojistasService } from '../../../services/lojistas.service';
import { PedidosService } from '../../../services/pedidos.service';

type Mapa = { 
  id: number;
  codigo: string; 
  data: string;
  solicitante?: string; 
  loja: number; 
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

  comprasAbertas: Compra[] = [];
  comprasFinalizadas: Compra[] = [];

  matriz: Lojista;
  filiais: Lojista[] = [];

  constructor(
    private authService: AuthService,
    private toastrService: NbToastrService,
    private lojistasService: LojistasService,
    private pedidosService: PedidosService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.spinner.show("mapas-spinner");
    this.spinner.show("compras-abertas-spinner");
    this.spinner.show("compras-finalizadas-spinner");

    this.pedidosService.filtrarPorLojista(this.authService.lojista.id)
      .subscribe(data => {
        this.mapas = data.content.map(pedido => ({
          id: pedido.id,
          codigo: `${pedido.id}`.padStart(6, '0'),
          data: pedido.dataCadastro,
          loja: pedido.lojista.id
        }));
        this.spinner.hide("mapas-spinner");
      });

    this.pedidosService.compras()
      .subscribe(data => {
        this.comprasAbertas = data.content.map(compra => ({
          id: compra.id,
          codigo: `${compra.id}`.padStart(6, '0'),
          data: compra.dataCompra,
          preco: compra.valor,
          loja: this.getLojistaById(compra.lojista.id).nome,
        }));
        this.spinner.hide("compras-abertas-spinner");
      });

    this.pedidosService.compras(false)
      .subscribe(data => {
        this.comprasFinalizadas = data.content.map(compra => ({
          id: compra.id,
          codigo: `${compra.id}`.padStart(6, '0'),
          data: compra.dataCompra,
          preco: compra.valor,
          loja: this.getLojistaById(compra.lojista.id).nome,
        }));
        this.spinner.hide("compras-finalizadas-spinner");
      });

    this.matriz = this.authService.isMatriz ?
      this.authService.lojista
      : this.authService.lojista.lojista as Lojista;
    
    this.lojistasService.filiais
      .subscribe(data => {
        this.filiais = data.content;
      });
  }


  get lojista() {
    return this.authService.lojista;
  }

  getLojistaById(id: number) {
    if (id === this.matriz.id) return this.matriz;
    return this.filiais.find(filial => filial.id === id); 
  }

  onLojistaChange(lojistaId: number) {
    this.mapas = [];
    this.spinner.show("mapas-spinner");

    this.pedidosService.filtrarPorLojista(lojistaId)
      .subscribe(
        data => {
          this.mapas = data.content.map(pedido => ({
            id: pedido.id,
            codigo: `${pedido.id}`.padStart(6, '0'),
            data: pedido.dataCadastro,
            loja: pedido.lojista.id
          }));
          this.spinner.hide("mapas-spinner");
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message || 'Sem mensagem disponível', 'Impossível obter mapas pelo lojista');
          this.spinner.hide("mapas-spinner");
        }
      )
  }
}
