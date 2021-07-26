import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { concatMap } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { LojistasService } from '../../../services/lojistas.service';
import { PedidosService } from '../../../services/pedidos.service';

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
  detalhesPedidos?: CustomDetalhePedido[];
  fornecedores?: Fornecedor[];
}

type CustomDetalhePedido = {
  id?: number;
  produto: Partial<Produto>;
  quantidade: number;
  precoUltimasCompras: number[];
  precos?: {
    fornecedorId: number;
    valor: number;
  }[];
  menorPrecoIdx?: number;
  selecionado?: number;
}

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

  selectedSuppliers: Record<number, number>;

  matriz: Lojista;
  filiais: Lojista[] = [];

  compras: CompraMaterial[] = [];
  compraSelecionada: number = 0;

  constructor(
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private authService: AuthService,
    private router: Router,
    private lojistasService: LojistasService,
    private pedidosService: PedidosService,
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

  // transformCotacoes(cotacoes: Cotacao[]) {
  //   for (const cotacao of cotacoes) {
  //     const fornecedorIdx = this.pedido.fornecedores.findIndex(f => f.id === cotacao.fornecedor.id);
  //     if (fornecedorIdx === -1) {
  //       this.pedido.fornecedores.push(cotacao.fornecedor);
  //     }
      
  //     const detalhePedidoIdx = this.pedido.detalhesPedidos.findIndex(detalhe => detalhe.produto.id === cotacao.detalhePedido.produto.id);
  //     if (detalhePedidoIdx === -1) {
  //       this.pedido.detalhesPedidos.push({ 
  //         produto: cotacao.detalhePedido.produto,
  //         quantidade: cotacao.detalhePedido.quantidade,
  //         precos: [],
  //         precoUltimasCompras: cotacao.detalhePedido.
  //       });
  //     }

  //     this.pedido.detalhesPedidos[detalhePedidoIdx].precos.push({ 
  //       fornecedorId: cotacao.fornecedor.id as number, 
  //       valor: cotacao.preco 
  //     });
  //   }
  //   this.defineProductCheapestPrice();
  //   this.defineCheapestSupplier();
  // }

  ngOnInit(): void {
    this.somaFornecedores = this.pedido && this.pedido.detalhesPedidos.length > 0 ? 
      new Array(this.pedido.detalhesPedidos[0]?.precos.length).fill(0) 
      : [];

    const pedidoId$ = this.route.paramMap;
    pedidoId$.pipe(
      concatMap(params => {

        const pedidoId = Number(params.get('pedidoId'));
        return this.pedidosService.solicitacoesPrecoPorPedido(pedidoId);
      })  
    )
    .subscribe(
      data => {
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
        return this.pedidosService.obter(pedidoId);
      })
    )
    .subscribe(
      pedido => {
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
            precoUltimasCompras: detalhe.ultimosPrecos
          })),
        };

        this.selectedSuppliers = Object.fromEntries(
          pedido.detalhesPedidos.map(detalhe => [detalhe.produto.id, undefined])
        );
      },
      ({ error, status }) => {
        if (status === 500) this.toastrService.danger(error.titulo || 'Sem o que dizer...', 'Algo deu errado =(');
      }
    );

    pedidoId$
      .pipe(
        concatMap(params => {
          const pedidoId = Number(params.get('pedidoId'));

          return this.pedidosService.cotacoesPorPedido(pedidoId);
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

    this.matriz = this.authService.isMatriz ? 
      this.authService.lojista : 
      this.authService.lojista.lojista as Lojista;

    this.lojistasService.filiais
      .subscribe(data => {
        this.filiais = data.content;
      });
  }

  openRowDetails(dialog: TemplateRef<any>, detalhe: CustomDetalhePedido) {
    this.dialogService.open(dialog, { 
      context: { 
        type: 'row-details',
        detalhe
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
      this.pedido.detalhesPedidos
        .forEach(detalhe => {
          const productPrices = Object.entries(this.precos)
            .filter(([key, value]) =>!!value && key.includes(`cotacao-p${detalhe.produto.id}`));
          
          if (productPrices.length === 0) return;

          this.selectedSuppliers[detalhe.produto.id] = productPrices
            .map(([key, value]) => ({ 
              fornecedor: Number(key.slice(key.indexOf('f') + 1)), 
              valor: value 
            }))
            .sort((a, b) => a.valor - b.valor)[0].fornecedor;
        });
    } else if (type === 'global') {
      Object.entries(this.selectedSuppliers)
        .forEach(([produtoId]) => {
          const fornecedorId = this.fornecedorMaisBarato;
          this.selectedSuppliers[produtoId] = this.precos[`cotacao-p${produtoId}-f${fornecedorId}`] && fornecedorId;
        });
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

  selectSupplier(fornecedorId: number) {
    Object.entries(this.selectedSuppliers)
      .forEach(([produtoId]) => {
        this.selectedSuppliers[produtoId] = this.precos[`cotacao-p${produtoId}-f${fornecedorId}`] ? fornecedorId : undefined;
      })
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

  getProdutoMenorPreco(produtoId: number) {
    if (this.precos.length === 0) return undefined;
    
    const regexp = new RegExp(`cotacao-p${produtoId}`);
    const entries = Object.entries(this.precos)
    .filter(([name, value]) => regexp.test(name) && !!value);
    
    if (entries.length === 0) return undefined;
    
    return Object.entries(this.precos)
      .filter(([name, value]) => regexp.test(name) && !!value)
      .sort((a, b) => a[1] - b[1])[0][0];
  }

  isProdutoMenorPreco(produtoId: number, fornecedorId: number) {
    return this.getProdutoMenorPreco(produtoId) === `cotacao-p${produtoId}-f${fornecedorId}`;
  }

  get fornecedorMaisBarato() {
    const validPrices = Object.entries(this.precos).filter(([_, preco]) => !!preco);
    if (this.pedido?.fornecedores?.length === 0 || validPrices.length === 0) return undefined;


    return this.pedido.fornecedores
      .map(fornecedor => ({ id: fornecedor.id, valor: this.getSomaFornecedor(fornecedor.id) }))
      .sort((a, b) => a.valor - b.valor)[0].id;
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
      this.isEditingPrices = !this.isEditingPrices;
      return;
    }

    const entries = Object.entries(this.cotacoesForm.controls)
      .map(([name, control]) => [name, control.value || undefined]);

    const cotacoes = entries
      .filter(([_, preco]) => !!preco)
      .map(([name, preco]) => {
        const produtoId = Number(/p\d+/.exec(name)[0].slice(1));
        const fornecedorId = Number(/f\d+/.exec(name)[0].slice(1));

        return {
          detalhePedido: {
            id: this.pedido.detalhesPedidos.find(detalhe => detalhe.produto.id === produtoId).id,
          },
          fornecedor: { id: fornecedorId },
          preco,
        };
      });

    this.pedidosService.atualizarCotacoes(this.pedido.id, cotacoes)
      .subscribe(
        data => {
          this.precos = Object.fromEntries(entries);
          this.isEditingPrices = !this.isEditingPrices;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message || "Sem mensagem disponível", "Erro ao salvar cotações");
        }
      );
  }

  selectPrice(produtoId: number, fornecedorId: number) {
    this.selectedSuppliers[produtoId] = !this.isSupplierSelected(produtoId, fornecedorId) ? fornecedorId : undefined;
  }

  isSupplierSelected(produtoId: number, fornecedorId: number) {
    return this.selectedSuppliers[produtoId] === fornecedorId;
  }

  handlePriceInput(e: any) {
    if (e.code !== 'Enter') return;
    this.onEditHandler();
  }

  get isThereAnyPrice() {
    return Object.entries(this.precos).some(([_, preco]) => !!preco);
  }

  get isAnySupplierSelected() {
    return !!this.selectedSuppliers && Object.entries(this.selectedSuppliers)
      .some(([_, preco]) => !!preco);
  }

  openConfirmationDialog(dialog: TemplateRef<any>) {
    const purchases: Record<number, { produto: number; preco: number; }[]> = {};
    
    Object.entries(this.selectedSuppliers)
      .forEach(([produtoId, fornecedorId]) => {
        const produto = Number(produtoId);
        purchases[fornecedorId] = [
          ...(purchases[fornecedorId] ? purchases[fornecedorId] : []), 
          { produto, preco: this.getPreco(produto, fornecedorId) }
        ];
      });

    this.compras = Object.entries(purchases).map(([fornecedorId, produtoIds]) => {
      const detalhes = this.pedido.detalhesPedidos
        .filter(detalhe => produtoIds.some(({ produto }) => produto === detalhe.produto.id))
        .map(detalhe => ({
          produto: detalhe.produto as Produto,
          quantidade: detalhe.quantidade,
          valor: this.precos[`cotacao-p${detalhe.produto.id}-f${fornecedorId}`]
        }));
      
      return {
        fornecedor: this.pedido.fornecedores.find(fornecedor => fornecedor.id === Number(fornecedorId)),
        detalhesCompras: detalhes,
        lojista: this.pedido.lojista,
        valor: detalhes.reduce((acc, cur) => acc + cur.quantidade * cur.valor, 0)
      };
    });

    this.compraSelecionada = 0;
    const context = {
      type: 'purchase-confirmation'
    };
    this.dialogService.open(dialog, { context });
  }

  getCompraTableData(idx: number): Row[] {
    return this.compras[idx].detalhesCompras.map(detalhe => new Row({
      codigo: detalhe.produto.cnp,
      produto: detalhe.produto.descricao,
      unidade: detalhe.produto.unidadeMedidaProduto.sigla,
      quantidade: detalhe.quantidade,
      precoUnitario: detalhe.valor,
    }));
  }

  onPurchaseConfirmation(ref: NbDialogRef<any>) {
    const compras = this.compras.map(compra => ({
      lojista: { id: compra.lojista.id },
      fornecedor: { id: compra.fornecedor.id },
      valor: compra.valor,
      detalhesCompras: compra.detalhesCompras.map(detalhe => ({
        produto: { id: detalhe.produto.id },
        valor: detalhe.valor,
        quantidade: detalhe.quantidade,
      }))
    }));
    this.pedidosService.gerarCompras(compras)
      .subscribe(
        data => {
          ref.close();
          this.router.navigate(['/pedidos/acompanhamento']);
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message || "Sem mensagem disponível", "Impossível gerar ordens de compra");
        }
      );
  }

  get isMapReady(): boolean {
    return !!this.pedido && this.cotacoes.length > 0 && !!this.precos && Object.keys(this.precos).length > 0 && this.selectedSuppliers && Object.keys(this.selectedSuppliers).length > 0;
  }

  getAverage(nums: number[]) {
    if (nums.length === 0) return 0;
    return nums.reduce((sum, num) => sum + num, 0) / nums.length;
  }
}
