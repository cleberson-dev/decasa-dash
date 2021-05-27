import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../components/tabber/tabber.component';
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
    { title: 'Acompanhamento', link: '' },
  ];

  data: Row[] = [
    new Row({ codigo: '00001', produto: 'Produto #1', quantidade: 4, unidade: 'cm', precoUnitario: 1.99 }),
    new Row({ codigo: '00002', produto: 'Produto #2', quantidade: 2, unidade: 'cm', precoUnitario: 1.99 })
  ];

  constructor() { }

  ngOnInit(): void {
  }

  get precoTotal(): number {
    return this.data.reduce((prev, cur) => prev + cur.subTotal, 0);
  }
}
