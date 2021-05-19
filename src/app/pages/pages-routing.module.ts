import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { ProdutosPageComponent } from './produtos/produtos.component';
import { ColaboradoresComponent } from './colaboradores/colaboradores.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CriarPedidosComponent } from './pedidos/criar-pedidos/criar-pedidos.component';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { MapaComponent } from './pedidos/mapa/mapa.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { ContaCorrenteComponent } from './financeiro/conta-corrente/conta-corrente.component';
import { RelatoriosComponent } from './financeiro/relatorios/relatorios.component';
import { EstoqueComponent } from './estoque/estoque.component';

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
      path: 'pedidos/criar',
      component: CriarPedidosComponent
    },
    {
      path: 'pedidos/mapa',
      component: MapaComponent
    },
    {
      path: 'fornecedores',
      component: FornecedoresComponent
    },
    {
      path: 'financeiro',
      component: FinanceiroComponent
    },
    {
      path: 'financeiro/conta-corrente',
      component: ContaCorrenteComponent
    },
    {
      path: 'financeiro/relatorios',
      component: RelatoriosComponent
    },
    {
      path: 'estoque',
      component: EstoqueComponent
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
