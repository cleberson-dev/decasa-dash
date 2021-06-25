import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';
import { CompraMaterial, Fornecedor, Produto } from '../../../types';
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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        flatMap(params => this.apiService.getCompra(Number(params.get('compraId'))))
      )
      .subscribe(compra => {
        this.compra = compra;
      });
  }

  get precoTotal(): number {
    return this.data.reduce((prev, cur) => prev + cur.subTotal, 0);
  }

  getSubTotal(precoUnitario: number, quantidade: number) {
    return precoUnitario * quantidade;
  }
}
