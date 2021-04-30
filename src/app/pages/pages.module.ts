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
  NbContextMenuModule
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
import { ModalAdicionarPasso1Component } from './produtos/modal-adicionar/passo1-selecionar-produtos/passo1-selecionar-produtos.component';
import { Passo2DefinirPrecosComponent } from './produtos/modal-adicionar/passo2-definir-precos/passo2-definir-precos.component';

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
    NbContextMenuModule
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
    ModalAdicionarPasso1Component,
    Passo2DefinirPrecosComponent
  ]
})
export class PagesModule {
}
