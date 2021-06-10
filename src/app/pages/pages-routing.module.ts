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

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
    },
    {
      path: 'inicio',
      component: InicioComponent,
    },
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
      path: 'pedidos/ordem-compra',
      component: OrdemCompraComponent
    },
    {
      path: 'pedidos/acompanhamento',
      component: AcompanhamentoComponent
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
      path: 'estoque/saida',
      component: SaidaComponent
    },
    {
      path: 'estoque/alerta-compra',
      component: AlertaCompraComponent
    },
    {
      path: 'estoque/tombamento',
      component: TombamentoComponent
    },
    {
      path: 'vendas',
      component: VendasComponent
    },
    {
      path: 'vendas/ecommerce',
      component: EcommerceComponent
    },
    {
      path: 'vendas/separando',
      component: SeparandoComponent
    },
    {
      path: 'vendas/em-rota',
      component: EmRotaComponent
    },
    {
      path: 'vendas/entregue',
      component: EntregueComponent
    },
    {
      path: 'configuracoes',
      component: ConfiguracoesComponent
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
