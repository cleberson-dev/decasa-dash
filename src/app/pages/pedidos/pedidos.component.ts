import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Tab } from '../../components/tabber/tabber.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { LojistasService } from '../../services/lojistas.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.service';

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
  suggestedOptions: string[];

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

  matriz: Lojista;
  filiais: Lojista[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private api: ApiService,
    private router: Router,
    private toastrService: NbToastrService,
    private authService: AuthService,
    private produtosService: ProdutosService,
    private lojistasService: LojistasService,
    private pedidosService: PedidosService,
  ) {
  }

  ngOnInit(): void {
    this.atualizarSugestoes();

    this.matriz = this.authService.isMatriz ? 
      this.authService.lojista : 
      this.authService.lojista.lojista as Lojista;

    this.lojistasService.filiais
      .subscribe(data => {
        this.filiais = data.content;
      });
  }

  get lojista() {
    return this.authService.lojista;
  }

  onSelectionChange($event: string) {
    if (this.produtos.length === 0) return;

    const selectedProduct = this.produtos.find(({ produto }) => $event.toLowerCase().includes(produto.descricao.toLowerCase())).produto;
    if (!selectedProduct) return;

    this.novoPedidoForm.controls['codigo'].setValue(selectedProduct.cnp);
    this.novoPedidoForm.controls['unidade'].setValue(selectedProduct.unidadeMedidaProduto?.sigla || 'UN');
  }

  onInputChange() {
    const { value } = this.input.nativeElement;
    
    this.api.buscarProdutoLojista(value, this.authService.lojista.id, { page: 1, size: 5 })
      .subscribe(
        data => {
          const filteredProdutos = data.content.filter(({ produto }) => this.rows.every(row => row.produto.id !== produto.id));
          this.produtos = filteredProdutos;
          this.suggestedOptions = filteredProdutos
            .map(({ produto }) => produto.descricao);
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível buscar produto do lojista');
        }
      );
  }

  atualizarSugestoes() {
    this.api.buscarProdutoLojista('', this.authService.lojista.id, { page: 1, size: 5 })
      .subscribe(
        data => {
          this.produtos = data.content.filter(({ produto }) => this.rows.every(row => row.produto.id !== produto.id));
          this.suggestedOptions = this.produtos
            .map(({ produto }) => produto.descricao);
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, `Impossível buscar produto do lojista, consulta vazia`);
        }
      );
  }

  onPedidoAdd() {
    const produto = this.produtos.find(({ produto }) => produto.cnp === this.novoPedidoForm.controls['codigo'].value);
    const row = {
      produto: produto.produto,
      quantidade: this.novoPedidoForm.controls['quantidade'].value
    };

    if (this.rows.some(p => p.produto.cnp === row.produto.cnp)) {
      this.novoPedidoForm.reset();
      this.input.nativeElement.value = "";
      return;
    }
    
    this.rows.unshift(row);
    this.atualizarSugestoes();
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
    this.produtosService.porCodigo(codigo)
      .subscribe(
        (produto) => {
          if (!produto) return this.resetForm();

          this.novoPedidoForm.controls['codigo'].setValue(produto.cnp);
          this.novoPedidoForm.controls['nome'].setValue(produto.descricao);
          this.novoPedidoForm.controls['unidade'].setValue(produto.unidadeMedidaProduto.descricao || 'unidade');
        }, 
        (err) => {
          console.error(err);
          if (err.status === 500) this.toastrService.danger(err.error.message, 'Impossível encontrar produto por código');
          this.resetForm();
        });
  }

  onCodigoChange() {
    const codigo = String(this.novoPedidoForm.controls['codigo'].value);

    this.produtosService.porCodigo(codigo)
      .subscribe(
        produto => {
          this.novoPedidoForm.controls['codigo'].setValue(produto.cnp);
          this.novoPedidoForm.controls['nome'].setValue(produto.descricao);
          this.novoPedidoForm.controls['unidade'].setValue(produto.unidadeMedidaProduto.descricao || 'unidade');
        },
        err => {
          console.error(err);
          if (err.status === 500) this.toastrService.danger(err.error.message, 'Impossível encontrar produto por código');
        }
      );
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
      lojista: { id: this.authService.lojista.id },
      detalhesPedidos: this.rows.map(row => ({
        produto: { id: row.produto.id },
        quantidade: row.quantidade
      })),
      fornecedores: this.fornecedores.map(f => ({ id: f.id }))
    }

    

    this.pedidosService.criar(body)
      .subscribe(
        data => {
          this.router.navigate(['/pedidos', 'mapa', data.id ]);
        }, 
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Impossível criar pedido');
        }
      );
  }

  get isPedidoInvalid() {
    return this.rows.length === 0 || this.fornecedores.length === 0;
  }

  removeProduct(codigo: string) {
    this.rows = this.rows.filter(row => row.produto.cnp !== codigo);
    this.atualizarSugestoes();
  }

  resetForm() {
    this.novoPedidoForm.reset();
    this.input.nativeElement.value = "";
    this.novoPedidoForm.controls['quantidade'].setValue(1);
    this.suggestedOptions = [...this.autoOptions];
  }

  removeFornecedor(fornecedorId: number) {
    this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedorId);
  }

  changeProductAmount(row: PedidoProduto, type: string) {
    if (type === "decrease" && row.quantidade === 1) return;

    if (type === "increase") return (row.quantidade = row.quantidade + 1);
    if (type === "decrease") return (row.quantidade = row.quantidade - 1)
  }
}
