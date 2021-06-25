import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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

  compra: CompraMaterial = { 
    lojista: { id: 2 },
    fornecedor: { id: 19 },
    valor: 199,
    detalhesCompras: [
      { produto: { id: 23 }, valor: 199, quantidade: 1 }
    ]
  }

  fornecedor: Fornecedor;
  produtos: Produto[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.ocOptions = ['123456/2021', '333333/2021'];
    this.filteredOcOptions$ = of(this.ocOptions);
    this.apiService.getFornecedor(this.compra.fornecedor.id)
      .subscribe(fornecedor => {
        this.fornecedor = fornecedor;    
      });

    for (const detalheCompra of this.compra.detalhesCompras) {
      this.apiService.getProduto(detalheCompra.produto.id)
        .subscribe(produto => {
          this.produtos.push(produto);    
        });
    } 
  }

  get precoTotal(): number {
    return this.data.reduce((prev, cur) => prev + cur.subTotal, 0);
  }

  getSubTotal(precoUnitario: number, quantidade: number) {
    return precoUnitario * quantidade;
  }

  getProduto(id: number) {
    return this.produtos.find(p => p.id === id);
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
