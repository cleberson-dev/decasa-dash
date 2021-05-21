import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Tab } from '../../../components/tabber/tabber.component';

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

@Component({
  selector: 'ngx-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  easyButtonsValue = '';

  fornecedores = ['F1', 'F2', 'F3', 'F4'];

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

  somaFornecedores: (number | undefined)[] = new Array(this.data[0].precos.length).fill(0);
  menorSomaIdx: number;

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos' },
    { title: 'Mapa', link: '/pedidos/mapa', active: true  },
    { title: 'Ordem de compra', link: '' },
    { title: 'Acompanhamento', link: '' },
  ];

  constructor(
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < this.data.length; i += 1) {
      const { precos } = this.data[i];

      for (let j = 0; j < precos.length; j += 1) {
        this.somaFornecedores[j] += this.data[i].precos[j] || 0;

        if (precos[j] === undefined) continue;
        if (this.data[i].menorPrecoIdx === undefined) {
          this.data[i].menorPrecoIdx = j;
          continue;
        }

        if (precos[j] < precos[this.data[i].menorPrecoIdx]) {
          this.data[i].menorPrecoIdx = j;
        }
      }
    }

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
    console.log(this.somaFornecedores, this.menorSomaIdx);
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
    
    if (this.data[rowIdx].selecionado === fornecedorIdx) {
      this.data[rowIdx].selecionado = undefined;
      return;
    }
    
    this.data[rowIdx].selecionado = fornecedorIdx;
  }

  onEasyButtonsChange(type: string) {
    this.easyButtonsValue = type;

    if (type === 'unitario') {
      for (let i = 0; i < this.data.length; i += 1) {
        this.data[i].selecionado = this.data[i].menorPrecoIdx;
      }
    } else if (type === 'global') {
      for (let i = 0; i < this.data.length; i += 1) {
        this.data[i].selecionado = this.menorSomaIdx;
      }
    }
  }
}
