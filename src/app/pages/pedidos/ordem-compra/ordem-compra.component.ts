import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  fornecedores = [
    { nome: 'Centro Elétrico', vendedor: 'João Renato', telefone: '(99) 99999-9999', email: 'email@decasa.com' },
    { nome: 'Fornecedor #2', vendedor: 'Vendedor', telefone: '(99) 99999-9999', email: 'vendedor@decasa.com' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.ocOptions = ['123456/2021', '333333/2021'];
    this.filteredOcOptions$ = of(this.ocOptions);
  }

  get precoTotal(): number {
    return this.data.reduce((prev, cur) => prev + cur.subTotal, 0);
  }

  onOCInputChange() {

  }

  onOCAutoChange(e: any) {
    
  }

  getFilteredOcOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.ocOptions.filter(optionValue => optionValue.toLowerCase().includes(filterString.toLowerCase())))
    )
  }
}
