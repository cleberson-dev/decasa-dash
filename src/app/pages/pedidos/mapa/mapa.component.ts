import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { concatMap } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';

type MapRow = {
  produto: {
    codigo: string;
    nome: string;
    unidade: string;
    quantidade: number;
  };
  precos: (number | undefined)[];
  menorPrecoIdx?: number;
  precoUltimasCompras: number;
  selecionado?: number;
}

enum PriceStatus {
  Increased = "aumentado",
  Decreased = "diminuido", 
  Neutral = "neutro"
}


type CustomPedido = {
  id?: number;
  lojista?: {
    id: number;
  };
  detalhesPedidos?: {
    id?: number;
    produto: Partial<Produto>;
    quantidade: number;
    precoUltimasCompras?: number;
    precos?: {
      fornecedorId: number;
      valor: number;
    }[];
    menorPrecoIdx?: number;
    selecionado?: number;
  }[];
  fornecedores?: Fornecedor[];
}

@Component({
  selector: 'ngx-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  easyButtonsValue = '';

  pedido: CustomPedido;

  somaFornecedores: (number | undefined)[];
  
  menorSomaIdx: number;

  hoveredFornecedorIdx?: number;

  isEditingPrices: boolean = false;

  cotacoes: Cotacao[] = [];
  precos: { [k: string]: number };

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa', active: true  },
    { title: 'Ordem de compra' },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento' },
  ];

  cotacoesForm = new FormGroup({});

  selectedSuppliers: { [k: number]: number };

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
  ) { }

  get controle(): string {
    return !!this.pedido ? `${String(this.pedido.id).padStart(6, '0')}` : '...';
  }

  defineProductCheapestPrice() {
    for (let i = 0; i < this.pedido.detalhesPedidos.length; i += 1) {
      const { precos } = this.pedido.detalhesPedidos[i];

      for (let j = 0; j < precos.length; j += 1) {
        this.somaFornecedores[j] += this.pedido.detalhesPedidos[i].precos[j].valor || 0;

        if (precos[j] === undefined) continue;
        if (this.pedido.detalhesPedidos[i].menorPrecoIdx === undefined) {
          this.pedido.detalhesPedidos[i].menorPrecoIdx = j;
          continue;
        }

        if (precos[j] < precos[this.pedido.detalhesPedidos[i].menorPrecoIdx]) {
          this.pedido.detalhesPedidos[i].menorPrecoIdx = j;
        }
      }
    }
  }

  defineCheapestSupplier() {
    this.menorSomaIdx = this.somaFornecedores.reduce((prevIdx, curVal, curIdx) => {
      if (
        (prevIdx === undefined && !Number.isNaN(curVal) && curVal !== 0)
        || 
        (prevIdx !== undefined && curVal < this.somaFornecedores[prevIdx]  && curVal !== 0)
      ) return curIdx;
      if (curVal === undefined) return prevIdx;
      return prevIdx;
    }, 
    undefined);
  }

  transformCotacoes(cotacoes: Cotacao[]) {
    console.log(cotacoes);
    for (const cotacao of cotacoes) {
      const fornecedorIdx = this.pedido.fornecedores.findIndex(f => f.id === cotacao.fornecedor.id);
      if (fornecedorIdx === -1) {
        this.pedido.fornecedores.push(cotacao.fornecedor);
      }
      
      const detalhePedidoIdx = this.pedido.detalhesPedidos.findIndex(detalhe => detalhe.produto.id === cotacao.detalhePedido.produto.id);
      if (detalhePedidoIdx === -1) {
        this.pedido.detalhesPedidos.push({ 
          produto: cotacao.detalhePedido.produto,
          quantidade: cotacao.detalhePedido.quantidade,
          precos: []
        });
      }

      this.pedido.detalhesPedidos[detalhePedidoIdx].precos.push({ 
        fornecedorId: cotacao.fornecedor.id as number, 
        valor: cotacao.preco 
      });
    }
    console.log(this.pedido);
    this.defineProductCheapestPrice();
    this.defineCheapestSupplier();
  }

  ngOnInit(): void {
    this.somaFornecedores = this.pedido && this.pedido.detalhesPedidos.length > 0 ? 
      new Array(this.pedido.detalhesPedidos[0]?.precos.length).fill(0) 
      : [];

    const pedidoId$ = this.route.paramMap;
    pedidoId$.pipe(
      concatMap(params => {

        const pedidoId = Number(params.get('pedidoId'));
        return this.apiService.getSolicitacoesPreco(pedidoId);
      })  
    )
    .subscribe(
      data => {
        console.log(data);
        this.pedido = {
          ...this.pedido,
          fornecedores: data.content.map(solicitacao => solicitacao.fornecedor)
        };
      }
    )
    pedidoId$.pipe(
      concatMap(params => {

        const pedidoId = Number(params.get('pedidoId'));
        // return this.apiService.getCotacoesPorPedido(pedidoId);
        return this.apiService.getPedido(pedidoId);
      })
    )
    .subscribe(
      pedido => {
        console.log(pedido);
        this.pedido = {
          ...this.pedido,
          id: pedido.id,
          lojista: {
            id: pedido.lojista.id as number
          },
          detalhesPedidos: pedido.detalhesPedidos.map(detalhe => ({
            id: detalhe.id as number,
            produto: detalhe.produto,
            quantidade: detalhe.quantidade,
            precos: [],
          })),
        };

        this.selectedSuppliers = Object.fromEntries(
          pedido.detalhesPedidos.map(detalhe => [detalhe.produto.id, undefined])
        );
        console.log(this.pedido);
      },
      ({ error, status }) => {
        if (status === 500) this.toastrService.danger(error.titulo || 'Sem o que dizer...', 'Algo deu errado =(');
      }
    );

    pedidoId$
      .pipe(
        concatMap(params => {
          const pedidoId = Number(params.get('pedidoId'));

          return this.apiService.getCotacoesPorPedido(pedidoId);
        })
      )
      .subscribe(cotacoes => {
        this.cotacoes = cotacoes;
        this.precos = Object.fromEntries(
          cotacoes.map(cotacao => [
            `cotacao-p${cotacao.detalhePedido.produto.id}-f${cotacao.fornecedor.id}`,
            cotacao.preco
          ])
        );
      });
  }

  openRowDetails(dialog: TemplateRef<any>, row: MapRow) {
    const produto = {
      codigo: row.produto.codigo,
      nome: row.produto.nome,
      quantidade: row.produto.quantidade,
      unidade: row.produto.unidade,
      // precos: row.precos.map((preco, idx) => ({ fornecedor: this.fornecedores[idx], valor: preco })),
      menorPrecoIdx: row.menorPrecoIdx
    };
    
    this.dialogService.open(dialog, { 
      context: { 
        type: 'row-details',
        produto
      } 
    });
  }

  getPriceStatus(menorPrecoFornecedor: number, precoUltimasCompras: number): PriceStatus {
    if (precoUltimasCompras > menorPrecoFornecedor) return PriceStatus.Decreased; 
    if (precoUltimasCompras < menorPrecoFornecedor) return PriceStatus.Increased;
    return PriceStatus.Neutral;
  }

  openAddFornecedores(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { 
      context: {
        type: 'add-fornecedores'
      }
    })
  }

  selectProductSupplier(rowIdx: number, fornecedorIdx: number) {
    this.easyButtonsValue = '';
    
    if (this.pedido.detalhesPedidos[rowIdx].selecionado === fornecedorIdx) {
      this.pedido.detalhesPedidos[rowIdx].selecionado = undefined;
      return;
    }
    
    this.pedido.detalhesPedidos[rowIdx].selecionado = fornecedorIdx;
  }

  onEasyButtonsChange(type: string) {
    this.easyButtonsValue = type;

    if (type === 'unitario') {
      for (let i = 0; i < this.pedido.detalhesPedidos.length; i += 1) {
        this.pedido.detalhesPedidos[i].selecionado = this.pedido.detalhesPedidos[i].menorPrecoIdx;
      }
    } else if (type === 'global') {
      for (let i = 0; i < this.pedido.detalhesPedidos.length; i += 1) {
        this.pedido.detalhesPedidos[i].selecionado = this.menorSomaIdx;
      }
    }
  }

  openDetalhesFornecedor(dialog: TemplateRef<any>, fornecedor: Fornecedor) {    
    const context = {
      type: 'detalhes-fornecedor',
      fornecedor
    };

    this.dialogService.open(dialog, { context });
  }

  isGloballySelected(i: number) {
    return this.easyButtonsValue === 'global' && this.pedido.detalhesPedidos[0].selecionado === i;
  }

  isProductSelected(i: number): boolean {
    return this.pedido.detalhesPedidos[i].selecionado !== undefined;
  }

  get supplierSelected(): number | undefined {
    if (!this.pedido.detalhesPedidos[0].selecionado) return undefined;

    const idx = this.pedido.detalhesPedidos[0].selecionado;
    return this.pedido.detalhesPedidos.every(row => row.selecionado === idx) ? idx : undefined; 
  }

  selectSupplier(idx: number) {
    if (this.supplierSelected !== undefined && this.supplierSelected === idx) {
      for (let i = 0; i < this.pedido.detalhesPedidos.length; i += 1) {
        this.pedido.detalhesPedidos[i].selecionado = undefined;
      }
      return;
    }
    
    for (let i = 0; i < this.pedido.detalhesPedidos.length; i += 1) {
      this.pedido.detalhesPedidos[i].selecionado = idx;
    }

    this.easyButtonsValue = '';
  }

  openCloseMap(dialog: TemplateRef<any>) {
    const context = {
      type: 'close'
    };

    this.dialogService.open(dialog, { context });
  }

  getPreco(produtoId: number, fornecedorId: number) {
    return this.precos[`cotacao-p${produtoId}-f${fornecedorId}`];
  }

  getSomaFornecedor(fornecedorId: number) {
    const regexp = new RegExp(`cotacao-p\\d+-f${fornecedorId}`);
    return Object.entries(this.precos)
      .filter(([name]) => regexp.test(name))
      .reduce((acc, [_, valor]) => acc + (valor || 0), 0);
  }

  getFornecedorMenorPreco(produtoId: number) {
    if (this.precos.length === 0) return undefined;
    
    const regexp = new RegExp(`cotacao-p${produtoId}`);
    const entries = Object.entries(this.precos)
    .filter(([name, value]) => regexp.test(name) && !!value);
    
    if (entries.length === 0) return undefined;
    
    return Object.entries(this.precos)
      .filter(([name, value]) => regexp.test(name) && !!value)
      .sort((a, b) => a[1] - b[1])[0][0];
  }

  isFornecedorMenorPreco(produtoId: number, fornecedorId: number) {
    return this.getFornecedorMenorPreco(produtoId) === `cotacao-p${produtoId}-f${fornecedorId}`;
  }

  onEditHandler() {
    if (!this.isEditingPrices) {
      const controlInfos = this.pedido.fornecedores
        .map(fornecedor => this.pedido.detalhesPedidos.map(detalhe => ({
          name: `cotacao-p${detalhe.produto.id}-f${fornecedor.id}`,
          value: this.getPreco(detalhe.produto.id, fornecedor.id)
        })))
        .reduce((acc, info) => acc.concat(info), []);
    
      this.cotacoesForm = new FormGroup(
        Object.fromEntries(
          controlInfos.map(info => [info.name, new FormControl(info.value, [Validators.min(0)])])
        )
      );
    } else {
      this.precos = Object.fromEntries(
        Object.entries(this.cotacoesForm.controls)
        .map(([name, control]) => [name, control.value || undefined])
      );
      console.log(this.precos);
    }

    this.isEditingPrices = !this.isEditingPrices;
  }

  selectPrice(produtoId: number, fornecedorId: number) {
    this.selectedSuppliers[produtoId] = fornecedorId;
  }

  isSupplierSelected(produtoId: number, fornecedorId: number) {
    return this.selectedSuppliers[produtoId] === fornecedorId;
  }
}
