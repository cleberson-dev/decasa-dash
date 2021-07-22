import { NgModule } from '@angular/core';
import { 
  NbCardModule, 
  NbInputModule,
  NbButtonModule, 
  NbMenuModule, 
  NbDatepickerModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbListModule,
  NbIconModule,
  NbContextMenuModule,
  NbStepperModule,
  NbAutocompleteModule,
  NbButtonGroupModule,
  NbRadioModule,
  NbCheckboxModule
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ProdutosPageComponent } from './produtos/produtos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProdutoComponent } from '../components/produto/produto.component';
import { TreeComponent } from '../components/tree/tree.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { MeusProdutosComponent } from './produtos/meus-produtos/meus-produtos.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { AdicionarProdutoModalComponent } from '../modals/adicionar-produto/adicionar-produto.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { SpringSpinnerModule } from 'angular-epic-spinners';
import { PedidosComponent } from './pedidos/pedidos.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CriarPedidosComponent } from './pedidos/criar-pedidos/criar-pedidos.component';
import { TableComponent } from '../components/table/table.component';
import { ModalAddFornecedoresComponent } from './pedidos/modal-add-fornecedores/modal-add-fornecedores.component';
import { ModalFormFornecedorComponent } from '../components/modal-form-fornecedor/modal-form-fornecedor.component';
import { TabberComponent } from '../components/tabber/tabber.component';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MapaComponent } from './pedidos/mapa/mapa.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { ContaCorrenteComponent } from './financeiro/conta-corrente/conta-corrente.component';
import { RelatoriosComponent } from './financeiro/relatorios/relatorios.component';
import { EstoqueComponent } from './estoque/estoque.component';
import { VendasComponent } from './vendas/vendas.component';
import { SaidaComponent } from './estoque/saida/saida.component';
import { AlertaCompraComponent } from './estoque/alerta-compra/alerta-compra.component';
import { TombamentoComponent } from './estoque/tombamento/tombamento.component';
import { OrdemCompraComponent } from './pedidos/ordem-compra/ordem-compra.component';
import { AcompanhamentoComponent } from './pedidos/acompanhamento/acompanhamento.component';
import { EcommerceComponent } from './vendas/ecommerce/ecommerce.component';
import { SeparandoComponent } from './vendas/separando/separando.component';
import { EmRotaComponent } from './vendas/em-rota/em-rota.component';
import { EntregueComponent } from './vendas/entregue/entregue.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { InicioComponent } from './inicio/inicio.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CuponsComponent } from './clientes/cupons/cupons.component';
import { ComprasComponent } from './clientes/compras/compras.component';
import { DevolucoesComponent } from './clientes/devolucoes/devolucoes.component';
import { EnderecosComponent } from './clientes/enderecos/enderecos.component';
import { SolicitarComponent } from './produtos/solicitar/solicitar.component';
import { IMaskModule } from 'angular-imask';
import { ReaisPipe } from '../pipes/reais.pipe';
import { ProdutoDetalhesComponent } from '../modals/produto-detalhes/produto-detalhes.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    ReactiveFormsModule,
    NbDatepickerModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbIconModule,
    NbListModule,
    NbContextMenuModule,
    NbStepperModule,
    SpringSpinnerModule,
    Ng2SmartTableModule,
    NbAutocompleteModule,
    NgxSpinnerModule,
    NbButtonGroupModule,
    NbRadioModule,
    NbCheckboxModule,
    IMaskModule,
  ],
  declarations: [
    PagesComponent,
    ProdutosPageComponent,
    ProdutoComponent,
    TreeComponent,
    NotFoundComponent,
    MeusProdutosComponent,
    PaginationComponent,
    ColaboradoresComponent,
    AdicionarProdutoModalComponent,
    CheckboxComponent,
    PedidosComponent,
    CriarPedidosComponent,
    TableComponent,
    ModalAddFornecedoresComponent,
    ModalFormFornecedorComponent,
    TabberComponent,
    FornecedoresComponent,
    MapaComponent,
    FinanceiroComponent,
    ContaCorrenteComponent,
    RelatoriosComponent,
    EstoqueComponent,
    VendasComponent,
    SaidaComponent,
    AlertaCompraComponent,
    TombamentoComponent,
    OrdemCompraComponent,
    AcompanhamentoComponent,
    EcommerceComponent,
    SeparandoComponent,
    EmRotaComponent,
    EntregueComponent,
    ConfiguracoesComponent,
    InicioComponent,
    ClientesComponent,
    CuponsComponent,
    ComprasComponent,
    DevolucoesComponent,
    EnderecosComponent,
    SolicitarComponent,
    ReaisPipe,
    ProdutoDetalhesComponent,
    LoadingSpinnerComponent,
  ]
})
export class PagesModule {
}
