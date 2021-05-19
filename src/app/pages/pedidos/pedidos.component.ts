import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tab } from '../../components/tabber/tabber.component';
import { Fornecedor, Produto } from '../../types';
import * as fake from '../../fake-data';

type Pedido = {
  data: string;
  codigo: string;
}

type PedidoProduto = {
  codigo: string;
  nome: string;
  unidade: string;
  quantidade: number;
}

@Component({
  selector: 'ngx-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  @ViewChild('autoInput') input;
  autoOptions: string[];
  suggestedOptions$: Observable<string[]>;

  tabs: Tab[] = [
    { title: 'Cotação', link: '/pedidos/cotacao', active: true },
    { title: 'Mapa', link: '/pedidos/mapa' },
    { title: 'Ordem de compra', link: '' },
    { title: 'Acompanhamento', link: '' },
  ]

  rows: PedidoProduto[] = [
    { codigo: '000001', nome: 'Produto #1', unidade: 'pacote', quantidade: 1 },
    { codigo: '000002', nome: 'Produto #2', unidade: 'caixa', quantidade: 1 },
  ]

  novoPedidoForm = this.fb.group({
    rcm: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    quantidade: [1, [Validators.required, Validators.min(1)]],
  });

  fornecedores: Fornecedor[] = [];


  produtos: Produto[] = [...fake.produtos];

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit(): void {
    this.autoOptions = this.produtos.map(p => p.nome);
    this.suggestedOptions$ = of(this.autoOptions);
  }

  onSelectionChange($event: string) {
    this.suggestedOptions$ = of($event).pipe(
      map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    );
    const selectedProduct = this.produtos.find(p => p.nome.toLowerCase().includes($event.toLowerCase()));
    if (!selectedProduct) return;

    this.novoPedidoForm.controls['rcm'].setValue(selectedProduct.id);
  }

  onInputChange() {
    const { value } = this.input.nativeElement;
    this.suggestedOptions$ = of(value).pipe(
      map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    );
  }

  onPedidoAdd() {
    this.rows.unshift({
      codigo: this.novoPedidoForm.controls['rcm'].value,
      nome: this.novoPedidoForm.controls['nome'].value,
      quantidade: this.novoPedidoForm.controls['quantidade'].value,
      unidade: this.novoPedidoForm.controls['unidade'].value,
    });
    this.novoPedidoForm.reset();
    this.input.nativeElement.value = "";
  }

  openAddFornecedores(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: { type: 'addSupplier' } });
  }

  onAddSupplier(fornecedores: Fornecedor[], ref: NbDialogRef<any>) {
    this.fornecedores.push(...fornecedores);
    ref.close();
  }

  onCreateSupplier(form: FormGroup, ref: NbDialogRef<any>) {
    this.fornecedores.push({
      nome: form.controls['nome'].value,
      cnpj: form.controls['cnpj'].value,
      bairro: form.controls['bairro'].value,
      celular: form.controls['celular'].value,
      cep: form.controls['cep'].value,
      email: form.controls['email'].value,
      logradouro: form.controls['logradouro'].value,
      numero: form.controls['numero'].value,
      pontoReferencia: form.controls['pontoReferencia'].value,
      telefone: form.controls['telefone'].value
    });
    ref.close();
  }

  isInvalidControl(controlName: string) {
    const control = this.novoPedidoForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  onRCMBlur() {
    const rcm = this.novoPedidoForm.controls['rcm'].value;
    const product = this.produtos.find(p => p.id === rcm);
    if (!product) {
      this.novoPedidoForm.controls['rcm'].setErrors({ noProduct: true });
      // this.novoPedidoForm.controls['rcm'].setValue(rcm);
      this.novoPedidoForm.controls['nome'].setValue('');
    } else {
      this.novoPedidoForm.controls['rcm'].setValue(product.id);
    }
  }

  onNomeBlur() {
    const name = this.novoPedidoForm.controls['nome'].value;
    const product = this.produtos.find(p => p.nome === name);
    if (!product) {
      this.novoPedidoForm.controls['nome'].setErrors({ noProduct: true });
    } else {
      this.novoPedidoForm.controls['nome'].setErrors({})
    }
  }
}
