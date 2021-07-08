import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { concatMap, filter } from 'rxjs/operators';
import { Tab } from '../../components/tabber/tabber.component';
import { ApiService } from '../../services/api.service';

type RowProps = {
  codigo: string;
  nome: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
}

class Row {
  props: RowProps;

  constructor(props: RowProps) {
    this.props = props;
  }

  get subTotal(): number {
    const { precoUnitario, quantidade } = this.props;
    return precoUnitario * quantidade;
  }
}

@Component({
  selector: 'ngx-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: true },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Tombamento', link: '/estoque/tombamento', active: false },
  ];

  data: Row[] = [];

  form = this.fb.group({
    notaFiscal: [''],
    notaArquivo: ['']
  });

  notaArquivo = null;

  compras: CompraMaterial[] = [];
  compraSelecionada: number;
  buscandoCompra: boolean = false;

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.apiService.getComprasPorLojista(2)
      .subscribe(data => {
        this.compras = data.content;
      });

    this.route.queryParams
      .pipe(
        filter(params => !!params.compra && !Number.isNaN(params.compra)),
        concatMap(params => {
          const { compra } = params;
          if (Number.isNaN(compra)) throw Error('Não existe compra');
          this.compraSelecionada = Number(compra);
          return this.apiService.getDetalhesCompra(Number(compra))
        })
      )
      .subscribe(
        data => {
          this.data = data.content.map(detalhe => new Row({
            codigo: detalhe.produto.cnp,
            nome: detalhe.produto.descricao,
            unidade: detalhe.produto.unidadeMedidaProduto.sigla,
            precoUnitario: detalhe.valor,
            quantidade: detalhe.quantidade,
          }));
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter itens de estoque por compra');
        }
      );
  }

  onConfirmBtnClick(dialog: TemplateRef<any>) {
    console.log('btn clicked');
    if (this.form.controls['notaFiscal'].value === '') {
      const context = {
        type: 'confirm-nfe'
      };
      this.dialogService.open(dialog, { context });
      return;
    }

    alert('Confirmado');
  }


  openFileDialog(dialog: TemplateRef<any>) {
    const context = {
      type: 'file'
    };

    this.dialogService.open(dialog, { context });
  }

  onNotaArquivoChange(e: any) {
    const arquivo: File = e.target.files[0];

    if (!arquivo.type.startsWith('image')) {
      return alert('Somente imagens são suportadas');
    }

    this.notaArquivo = arquivo;
  }

  onSearchSale() {
    this.buscandoCompra = true;
    this.apiService
      .getDetalhesCompra(Number(this.compraSelecionada))
      .subscribe(
        data => {
          this.data = data.content.map(detalhe => new Row({
            codigo: detalhe.produto.cnp,
            nome: detalhe.produto.descricao,
            unidade: detalhe.produto.unidadeMedidaProduto.descricao,
            precoUnitario: detalhe.valor,
            quantidade: detalhe.quantidade,
          }));

          const queryParams = { compra: this.compraSelecionada };
          this.router.navigate(
            [],
            {
              relativeTo: this.route,
              queryParamsHandling: 'merge',
              queryParams,
            }
          );
          this.buscandoCompra = false;
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter detalhes de compra');
          this.buscandoCompra = false;
          this.route.queryParams
            .subscribe(params => {
              this.compraSelecionada = Number(params.compra);
            });
        }
      );
  }
}
