import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { concatMap, filter, flatMap, map } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
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
  ocOptions: string[];
  filteredOcOptions$: Observable<string[]>;

  @ViewChild('autoInput') input;

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa' },
    { title: 'Ordem de compra', link: '/pedidos/ordem-compra', active: true },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento' },
  ];

  data: Row[] = [
    new Row({ codigo: '00001', produto: 'Produto #1', quantidade: 4, unidade: 'cm', precoUnitario: 1.99 }),
    new Row({ codigo: '00002', produto: 'Produto #2', quantidade: 2, unidade: 'cm', precoUnitario: 1.99 })
  ];

  compra: CompraMaterial;

  matriz: Lojista;
  filiais: Lojista[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router, 
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter(params => !Number.isNaN(params.get('compraId'))),
        // concatMap(params => this.apiService.getCompra(Number(params.get('compraId')))),
        concatMap(params => this.apiService.getCompra(Number(params.get('compraId'))))
      )
      .subscribe(
        compra => {
          this.compra = compra;
        },
        ({ error, status }) => {
          if (status === 500) this.toastrService.danger(error.titulo, 'Impossível obter compra');
          console.error(error);
        }
      );

    this.matriz = this.authService.isMatriz ? 
      this.authService.lojista : 
      this.authService.lojista.lojista;

    this.apiService.getFiliais(this.matriz.id)
      .subscribe(data => {
        this.filiais = data.content;
      });
  }

  get precoTotal(): number {
    return this.data.reduce((prev, cur) => prev + cur.subTotal, 0);
  }

  getSubTotal(precoUnitario: number, quantidade: number) {
    return precoUnitario * quantidade;
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
