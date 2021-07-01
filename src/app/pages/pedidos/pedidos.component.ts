import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { map, throttle } from 'rxjs/operators';
import { Tab } from '../../components/tabber/tabber.component';
import * as fake from '../../fake-data';
import { ApiService } from '../../services/api.service';

type Pedido = {
  data: string;
  codigo: string;
}

type PedidoProduto = {
  produto: Produto;
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
    { title: 'Cotação', link: '/pedidos', active: true },
    { title: 'Mapa' },
    { title: 'Ordem de compra' },
    { title: 'Acompanhamento', link: '/pedidos/acompanhamento' },
  ];

  rows: PedidoProduto[] = []

  novoPedidoForm = this.fb.group({
    codigo: ['', [Validators.required]],
    nome: ['', [Validators.required]],
    unidade: ['', [Validators.required]],
    quantidade: [1, [Validators.required, Validators.min(1)]],
  });

  fornecedores: Fornecedor[] = [];

  produtos: ProdutoLojista[] = [];
  
  codigoMask = /^\d+$/;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
    this.api.getProdutosLojistaMaisVendidos(2)
      .subscribe(data => {
        this.produtos = data.content;
        this.autoOptions = this.produtos.map(({ produto }) => produto.descricao);
        this.suggestedOptions$ = of(this.autoOptions);
      });
  }

  onSelectionChange($event: string) {
    this.suggestedOptions$ = of($event).pipe(
      map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    );
    const { produto: selectedProduct } = this.produtos.find(({ produto }) => produto.descricao.toLowerCase().includes($event.toLowerCase()));
    if (!selectedProduct) return;

    this.novoPedidoForm.controls['codigo'].setValue(selectedProduct.cnp);
    this.novoPedidoForm.controls['unidade'].setValue(selectedProduct.unidadeMedidaProduto?.descricao || 'unidade');
  }

  onInputChange() {
    const { value } = this.input.nativeElement;
    
    // this.suggestedOptions$ = of(value).pipe(
    //   map(filterString => this.autoOptions.filter(option => option.toLowerCase().includes(filterString.toLowerCase())))
    // );
    this.suggestedOptions$ = this.api.buscarProdutoLojista(value, 2, { page: 1, size: 5 })
      .pipe(
        map(data => {
          this.produtos = data.content;
          return data.content.map(({ produto }) => produto.descricao);
        })
      );
  }

  onPedidoAdd() {
    const row = {
      produto: this.produtos.find(({ produto }) => produto.cnp === this.novoPedidoForm.controls['codigo'].value).produto,
      quantidade: this.novoPedidoForm.controls['quantidade'].value
    };

    if (this.rows.some(p => p.produto.cnp === row.produto.cnp)) {
      this.novoPedidoForm.reset();
      this.input.nativeElement.value = "";
      return;
    }
    
    this.rows.unshift(row);
    this.resetForm();
  }

  openAddFornecedores(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: { type: 'addSupplier' } });
  }

  onAddSupplier(fornecedores: Fornecedor[], ref: NbDialogRef<any>) {
    this.fornecedores = fornecedores;
    ref.close();
  }

  onCreateSupplier(form: FormGroup, ref: NbDialogRef<any>) {
    this.fornecedores.push({
      nomeFantasia: form.controls['nome'].value,
      razaoSocial: form.controls['nome'].value,
      cnpj: form.controls['cnpj'].value,
      bairro: form.controls['bairro'].value,
      celular: form.controls['celular'].value,
      cep: form.controls['cep'].value,
      email: form.controls['email'].value,
      logradouro: form.controls['logradouro'].value,
      numero: form.controls['numero'].value,
      pontoReferencia: form.controls['pontoReferencia'].value,
      telefone: form.controls['telefone'].value,
      inscricaoEstadual: form.controls['inscricaoEstadual'].value,
      categoriasFornecidas: [], departamentosFornecidos: []
    });
    ref.close();
  }

  isInvalidControl(controlName: string) {
    const control = this.novoPedidoForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  onCodigoBlur() {
    const codigo = this.novoPedidoForm.controls['codigo'].value;
    this.api.findProdutoByCnp(codigo)
      .subscribe((produto) => {
        if (!produto) return this.resetForm();

        this.novoPedidoForm.controls['codigo'].setValue(produto.cnp);
        this.novoPedidoForm.controls['nome'].setValue(produto.descricao);
        this.novoPedidoForm.controls['unidade'].setValue(produto.unidadeMedidaProduto.descricao || 'unidade');
      });
  }

  onCodigoChange() {
    const codigo = this.novoPedidoForm.controls['codigo'].value;
  }

  onNomeBlur() {
    const name = this.novoPedidoForm.controls['nome'].value;
    const product = this.produtos.find(({ produto }) => produto.descricao === name);
    if (!product) {
      this.novoPedidoForm.controls['nome'].setErrors({ noProduct: true });
    } else {
      this.novoPedidoForm.controls['nome'].setErrors(null);
    }
  }

  onConfirmBtnClick() {
    const body = {
      lojista: { id: 2 },
      detalhesPedidos: this.rows.map(row => ({
        produto: { id: row.produto.id },
        quantidade: row.quantidade
      })),
      fornecedores: this.fornecedores.map(f => ({ id: f.id }))
    }

    console.log('Pedido', body);
  }

  get isPedidoInvalid() {
    return this.rows.length === 0 || this.fornecedores.length === 0;
  }

  removeProduct(codigo: string) {
    this.rows = this.rows.filter(row => row.produto.cnp !== codigo);
  }

  resetForm() {
    this.novoPedidoForm.reset();
    this.input.nativeElement.value = "";
    this.novoPedidoForm.controls['quantidade'].setValue(1);
    this.suggestedOptions$ = of(this.autoOptions);
  }

  removeFornecedor(fornecedorId: number) {
    this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedorId);
  }
}
