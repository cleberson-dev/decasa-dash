import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { concatMap, delay, filter, map } from 'rxjs/operators';

import { Tab } from '../../components/tabber/tabber.component';
import { PedidosService } from '../../services/pedidos.service';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

type RowProps = {
  id: number;
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
    notaArquivo: [''],
    compra: ['']
  });

  quantityForm = this.fb.group({});
  additionalForm = this.fb.group({});

  notaArquivo = null;

  compras: CompraMaterial[] = [];
  compraAtual: CompraMaterial;
  compraSelecionada: number;
  buscandoCompra: boolean = false;

  additionalSelectedProduct = 0;
  suggestedCompras: string[] = [];

  codigoMask = /^\d+$/;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pedidosService: PedidosService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService, 
  ) { }

  ngOnInit(): void {
    this.pedidosService.compras()
      .subscribe(data => {
        this.compras = data.content;
        this.suggestedCompras = this.compras.map(compra => compra.id.toString());
      });

    this.route.queryParams
      .pipe(
        filter(params => !!params.compra && !Number.isNaN(params.compra)),
        map(params => Number(params.compra)),
        concatMap(compraID => {
          this.compraSelecionada = compraID;
          this.spinner.show("compra-spinner");
          return this.pedidosService.compra(compraID);
        }),
      )
      .subscribe(
        (compra) => {
          this.spinner.hide("compra-spinner");
          this.compraAtual = compra;
          this.data = compra.detalhesCompras.map(detalhe => new Row({
            id: detalhe.produto.id,
            codigo: detalhe.produto.cnp,
            nome: detalhe.produto.descricao,
            unidade: detalhe.produto.unidadeMedidaProduto.sigla,
            precoUnitario: detalhe.valor,
            quantidade: detalhe.quantidade,
          }));
          this.quantityForm = this.fb.group(
            Object.fromEntries(
              compra.detalhesCompras.map(detalhe => [`produto-${detalhe.produto.cnp}`, [0, [Validators.required, Validators.min(0), Validators.max(detalhe.quantidade)]]]))
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
    const compraSelecionada = this.form.controls['compra'].value;
    
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: { compra: compraSelecionada },
      }
    );
  }

  getControlValue(formGroup: FormGroup, controlName: string) {
    return formGroup.controls[controlName].value;
  }

  getProductFormArray(nome: string) {
    return <FormArray> this.additionalForm.get(nome);
  }

  onNew(nome: string) {
    if (!this.canAdd(nome)) return;

    const formArray = this.getProductFormArray(nome);
    const last = formArray.length > 0 ? 
      formArray.value[formArray.length - 1]
      : undefined;

    formArray.push(
      this.fb.group({
        serie: this.fb.control(last?.serie || ''),
        lote: this.fb.control(last?.lote || ''),
        quantidade: this.fb.control(1),
      })
    );

    of(null).pipe(delay(100))
      .subscribe(() => {
        const selector = `div[ng-reflect-name="${nome}"] ~ div input[formcontrolname="serie"]`;
        const input = this.document.querySelector<HTMLInputElement>(selector);
        input.focus();
      });
  }

  onAdditionalInfoOpen(context: any) {
    this.additionalForm = this.fb.group(Object.fromEntries(
      this.filteredData.map(row => [
        `produto-${row.props.codigo}`, 
        this.fb.array([])
      ])
    ));

    this.additionalSelectedProduct = 0;
    context.type = 'additional-info';
  }

  canAdd(nome: string) {
    const maximum = this.getControlValue(this.quantityForm, nome);
    
    const groupSum = (this.getProductFormArray(nome).value as any[]).reduce((prev, cur) => prev + cur.quantidade, 0);
    
    return groupSum < maximum;
  }

  sum(codigo: string) {
    return (this.getProductFormArray("produto-"+codigo).value as any[]).reduce((prev, cur) => prev + cur.quantidade, 0);
  }

  otherSum(nome: string, index: number) {
    return (this.getProductFormArray(nome).value as any[])
      .filter((_, idx) => idx !== index)
      .reduce((prev, cur) => prev + cur.quantidade, 0);
  }

  getMaximaQuantidade(nome: string, index: number) {
    const max = this.getControlValue(this.quantityForm, nome);
    return max - this.otherSum(nome, index);
  }

  remove(codigo: string, index: number) {
    this.getProductFormArray('produto-'+codigo).removeAt(index);
  }

  onQuantityKeyDown(e: any, codigo: string, index: number) {
    const formArrayName = 'produto-' + codigo;
    const formArray = this.getProductFormArray(formArrayName);

    if (e.key === 'Enter' && !e.repeat && index === formArray.length - 1) {
      return this.onNew(formArrayName);
    }
  }

  get filteredData() {
    return this.data.filter(row => {
      return this.getControlValue(this.quantityForm, 'produto-' + row.props.codigo) > 0;
    });
  }

  get quantitySum() {
    return Object.entries(this.quantityForm.value)
      .reduce((prev, [_, cur]) => prev + (cur as number), 0);
  }

  onDarEntrada() {
    const arrays = this.additionalForm.controls as { [key: string]: FormArray }; 
    const itens = Object.entries(arrays)
      .map(([formArrayName, formArray]) => {
        const produto = this.filteredData.find(row => formArrayName.includes(row.props.codigo));

        const productItems = formArray.value
          .map(info => new Array(info.quantidade).fill({}).map(() => ({ produto: { id: produto.props.id }, serie: info.serie, lote: info.lote })))
          .reduce((prev, cur) => [...prev, ...cur] , []);
        return productItems.concat(new Array(this.quantityForm.controls['produto-'+produto.props.codigo].value - productItems.length).fill({}).map(() => ({ produto: { id: produto.props.id }, serie: null, lote: null })))
      })
      .reduce((prev, cur) => [...prev, ...cur] , []);

    const now = new Date();
    const correct = (num: number) => num.toString().padStart(2, '0');
    const recebimentoMaterial = {
      compraMaterial: { id: this.compraAtual.id },
      dataRecebimento: `${[now.getDate(), now.getMonth()].map(correct).join('/')}/${now.getFullYear()}`,
      itensEstoque: itens,
      numeroNf: null,
      dataNf: null,
      arquivoNf: null,
    };
    console.log('Recebimento Material')
    console.log(recebimentoMaterial);
  }

  get selectedRow() {
    return this.filteredData[this.additionalSelectedProduct];
  }

  onCompraSelectedChange(text: string) {
    this.suggestedCompras = this.compras.filter(compra => `${compra.id}`.toLowerCase().includes(text.toLowerCase())).map(compra => compra.id.toString());
  }

  onCompraInputChange() {
    const text = this.form.controls['compra'].value;

    this.suggestedCompras = this.compras.filter(compra => `${compra.id}`.toLowerCase().includes(text.toLowerCase())).map(compra => compra.id.toString());
  }

  get isSearchDisabled() {
    const entered = this.form.controls['compra'].value;
    return this.suggestedCompras.length === 0 || this.suggestedCompras.every(compra => compra !== entered);
  }
}
