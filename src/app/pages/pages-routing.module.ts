import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { ProdutosPageComponent } from './produtos/produtos.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { PedidosComponent } from './pedidos/pedidos.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'produtos',
      component: ProdutosPageComponent
    },
    {
      path: 'colaboradores',
      component: ColaboradoresComponent
    },
    {
      path: 'pedidos',
      component: PedidosComponent
    },
    {
      path: '',
      redirectTo: 'produtos',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
