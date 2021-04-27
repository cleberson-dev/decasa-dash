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
    MeusProdutosComponent
  ]
})
export class PagesModule {
}
