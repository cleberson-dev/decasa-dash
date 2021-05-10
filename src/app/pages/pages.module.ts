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
  NbStepperModule
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
import { ModalCriarFornecedorComponent } from './pedidos/modal-criar-fornecedor/modal-criar-fornecedor.component';
import { TabberComponent } from '../components/tabber/tabber.component';

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
    Ng2SmartTableModule
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
    ModalCriarFornecedorComponent,
    TabberComponent
  ]
})
export class PagesModule {
}
