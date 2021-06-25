import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { flatMap } from 'rxjs/operators';
import { Tab } from '../../../components/tabber/tabber.component';
import { ApiService } from '../../../services/api.service';
import { Cotacao, Fornecedor, Produto } from '../../../types';

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
  id: number;
  lojista: {
    id: number;
  };
  detalhesPedidos: {
    id?: number;
    produto: Produto;
    quantidade: number;
    precoUltimasCompras?: number;
    precos?: {
      fornecedorId: number;
      valor: number;
    }[];
    menorPrecoIdx?: number;
    selecionado?: number;
  }[];
  fornecedores: Fornecedor[];
}

@Component({
  selector: 'ngx-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  easyButtonsValue = '';

  fornecedores: Fornecedor[] = [];
  produtos: Produto[] = [];

  pedido: CustomPedido = {
    id: 1,
    lojista: { id: 3 },
    detalhesPedidos: [],
    fornecedores: []
  };

  data: MapRow[] = [
    { 
      produto: {
        codigo: "1234",
        nome: "Produto #1",
        quantidade: 2,
        unidade: 'cm'
      },
      precos: [
        1.49,
        undefined,
        1.99,
        0.99
      ],
      precoUltimasCompras: 9.99,
    },
    { 
      produto: {
        codigo: "3333",
        nome: "Produto #2",
        quantidade: 1,
        unidade: 'cm'
      },
      precos: [
        2.98,
        undefined,
        1.12,
        3.45
      ],
      precoUltimasCompras: 9.99,
    },
    { 
      produto: {
        codigo: "3355",
        nome: "Produto #3",
        quantidade: 5,
        unidade: 'cm'
      },
      precos: [
        2.1,
        undefined,
        2.2,
        4.1
      ],
      precoUltimasCompras: 9.99,
    }
  ];

  somaFornecedores: (number | undefined)[] = 
    this.pedido.detalhesPedidos.length > 0 ? 
      new Array(this.pedido.detalhesPedidos[0]?.precos.length).fill(0) 
      : [];
  
  menorSomaIdx: number;

  hoveredFornecedorIdx?: number;

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa', active: true  },
    { title: 'Ordem de compra', link: '/pedidos/ordem-compra' },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento' },
  ];

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  get controle(): string {
    return `${String(this.pedido.id).padStart(6, '0')}/2021`;
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
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        flatMap(params => this.apiService.getCotacoesPorPedido(Number(params.get('pedidoId'))))
      )
    .subscribe(this.transformCotacoes);



    this.defineProductCheapestPrice();
    this.defineCheapestSupplier();


    
    for (let detalhe of this.pedido.detalhesPedidos) {
      this.apiService.getProduto(detalhe.produto.id)
        .subscribe(produto => {
          this.produtos.push(produto);
        });
    }

    for (let fornecedor of this.pedido.fornecedores) {
      this.apiService.getFornecedor(fornecedor.id)
        .subscribe(fornecedor => {
          this.fornecedores.push(fornecedor);
        });
    }
  }

  openRowDetails(dialog: TemplateRef<any>, row: MapRow) {
    const produto = {
      codigo: row.produto.codigo,
      nome: row.produto.nome,
      quantidade: row.produto.quantidade,
      unidade: row.produto.unidade,
      precos: row.precos.map((preco, idx) => ({ fornecedor: this.fornecedores[idx], valor: preco })),
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

  openDetalhesFornecedor(dialog: TemplateRef<any>) {
    const fakeFornecedor: Fornecedor = {
      id: 1,
      nomeFantasia: 'Fornecedor #1',
      razaoSocial: 'Fornecedor #1',
      email: 'fornecedor@decasa.com',
      bairro: 'Bairro #1',
      logradouro: 'Logradouro #1',
      cep: '99999-999',
      cnpj: '999.999.999-99',
      numero: 123,
      pontoReferencia: 'Próximo aquele lugar lá',
      celular: '(99) 99999-9999',
      telefone: '(99) 99999-9999',
      inscricaoEstadual: '999999',
      categoriasFornecidas: [], departamentosFornecidos: []
    };
    
    const context = {
      type: 'detalhes-fornecedor',
      fornecedor: fakeFornecedor
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

  getProduto(produtoId: number) {
    return this.produtos.find(p => p.id === produtoId);
  }
}
