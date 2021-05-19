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
}

@Component({
  selector: 'ngx-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

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
      ]
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
      ]
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
      ]
    }
  ];

  somaFornecedores: (number | undefined)[] = new Array(this.data[0].precos.length).fill(0);
  menorSomaIdx: number;

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos/cotacao' },
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
    const context = {
      codigo: row.produto.codigo,
      nome: row.produto.nome,
      quantidade: row.produto.quantidade,
      unidade: row.produto.unidade,
      precos: row.precos.map((preco, idx) => ({ fornecedor: this.fornecedores[idx], valor: preco })),
      menorPrecoIdx: row.menorPrecoIdx
    };
    
    this.dialogService.open(dialog, { context });
  }
}
