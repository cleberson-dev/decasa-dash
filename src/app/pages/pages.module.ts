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
  NbRadioModule
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ProdutosPageComponent } from './produtos/produtos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { ProdutoLojistaComponent } from '../components/produto-lojista/produto-lojista.component';
import { TreeComponent } from '../components/tree/tree.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { MeusProdutosComponent } from './produtos/meus-produtos/meus-produtos.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { ModalAdicionarComponent } from './produtos/modal-adicionar/modal-adicionar.component';
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
    IMaskModule,
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
    NbRadioModule
  ],
  declarations: [
    PagesComponent,
    ProdutosPageComponent,
    ProdutoLojistaComponent,
    TreeComponent,
    NotFoundComponent,
    MeusProdutosComponent,
    PaginationComponent,
    ColaboradoresComponent,
    ModalAdicionarComponent,
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
    VendasComponent
  ]
})
export class PagesModule {
}
