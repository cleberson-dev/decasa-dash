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
  NbIconModule
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { MinhaPaginaComponent } from './minha-pagina/minha-pagina.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { ProdutoLojistaComponent } from '../components/produto-lojista/produto-lojista.component';
import { TreeComponent } from '../components/tree/tree.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    MiscellaneousModule,
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
    NbListModule
  ],
  declarations: [
    PagesComponent,
    MinhaPaginaComponent,
    ProdutoLojistaComponent,
    TreeComponent
  ]
})
export class PagesModule {
}
