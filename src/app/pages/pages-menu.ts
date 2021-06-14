import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Início',
    icon: 'home-outline',
    link: '/inicio',
    home: true,
  },
  {
    title: 'Pedidos',
    icon: 'activity-outline',
    link: '/pedidos',
  },
  {
    title: 'Vendas',
    icon: 'cube-outline',
    link: '/vendas',
  },
  {
    title: 'Estoque',
    icon: 'email-outline',
    link: '/estoque',
  },
  {
    title: 'Financeiro',
    icon: 'shopping-cart-outline',
    link: '/financeiro',
  },
  {
    title: 'Colaboradores',
    icon: 'people-outline',
    link: '/colaboradores',
  },
  {
    title: 'Produtos',
    icon: 'edit-outline',
    link: '/produtos',
  },
  {
    title: 'Fornecedores',
    icon: 'car-outline',
    link: '/fornecedores',
  },
  {
    title: 'Clientes',
    icon: 'people-outline',
    link: '/clientes'
  },
  {
    title: 'Configurações',
    icon: 'settings-outline',
    link: '/configuracoes',
  }
];
