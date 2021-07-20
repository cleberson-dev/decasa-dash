import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { concatMap, filter, map } from 'rxjs/operators';
import { Tab } from '../../components/tabber/tabber.component';
import { PedidosService } from '../../services/pedidos.service';

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

  quantityForm = this.fb.group({});

  notaArquivo = null;

  compras: CompraMaterial[] = [];
  compraSelecionada: number;
  buscandoCompra: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pedidosService: PedidosService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.pedidosService.compras()
      .subscribe(data => {
        this.compras = data.content;
      });

    this.route.queryParams
      .pipe(
        filter(params => !!params.compra && !Number.isNaN(params.compra)),
        map(params => Number(params.compra)),
        concatMap(compraID => {
          this.compraSelecionada = compraID;
          return this.pedidosService.compra(compraID);
        })
      )
      .subscribe(
        ({ detalhesCompras }) => {
          this.data = detalhesCompras.map(detalhe => new Row({
            codigo: detalhe.produto.cnp,
            nome: detalhe.produto.descricao,
            unidade: detalhe.produto.unidadeMedidaProduto.sigla,
            precoUnitario: detalhe.valor,
            quantidade: detalhe.quantidade,
          }));
          this.quantityForm = this.fb.group(
            Object.fromEntries(
              detalhesCompras.map(detalhe => [`produto-${detalhe.produto.cnp}`, [1, [Validators.required, Validators.min(1), Validators.max(detalhe.quantidade)]]]))
            );
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível obter itens de estoque por compra');
        }
      );
  }

  onConfirmBtnClick(dialog: TemplateRef<any>) {
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
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: { compra: this.compraSelecionada },
      }
    );
  }

  getControlValue(formGroup: FormGroup, controlName: string) {
    return formGroup.controls[controlName].value;
  }
}
