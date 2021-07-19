import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { concatMap, filter, map } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { AuthService } from '../../../services/auth.service';
import { LojistasService } from '../../../services/lojistas.service';
import { PedidosService } from '../../../services/pedidos.service';

type RowProps = {
  codigo: string;
  produto: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
}

class Row {
  props: RowProps;

  constructor(props: RowProps) {
    this.props = props;
  }

  get subTotal(): number {
    return this.props.precoUnitario * this.props.quantidade;
  }
}

@Component({
  selector: 'ngx-ordem-compra',
  templateUrl: './ordem-compra.component.html',
  styleUrls: ['./ordem-compra.component.scss']
})
export class OrdemCompraComponent implements OnInit {
  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa' },
    { title: 'Ordem de compra', link: '/pedidos/ordem-compra', active: true },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento' },
  ];

  compra: CompraMaterial;

  matriz: Lojista;
  filiais: Lojista[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router, 
    private authService: AuthService,
    private lojistasService: LojistasService,
    private pedidosService: PedidosService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter(params => !!params.get('compraId') && !Number.isNaN(params.get('compraId'))),
        map(params => Number(params.get('compraId'))),
        concatMap(compraId => this.pedidosService.compra(compraId))
      )
      .subscribe(
        (compra) => {
          this.compra = compra;
        },
        ({ error, status }) => {
          if (status === 500) this.toastrService.danger(error.titulo, 'Impossível obter compra');
          console.error(error);
        }
      );

    this.matriz = this.authService.isMatriz ? 
      this.authService.lojista : 
      this.authService.lojista.lojista as Lojista;

    this.lojistasService.filiais
      .subscribe(data => {
        this.filiais = data.content;
      });
  }

  onConfirmBtnClick() {
    this.router.navigate(['/estoque']);
  }

  get tableData(): Row[] {
    return this.compra.detalhesCompras.map(detalhe => new Row({
      codigo: detalhe.produto.cnp,
      produto: detalhe.produto.descricao,
      unidade: detalhe.produto.unidadeMedidaProduto.sigla,
      quantidade: detalhe.quantidade,
      precoUnitario: detalhe.valor,
    }));
  }
}
