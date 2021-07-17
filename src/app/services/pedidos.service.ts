import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { AuthService } from './auth.service';

type CriarPedidoParams = {
  lojista: {
    id: number;
  };
  detalhesPedidos: {
    produto: { id: number; };
    quantidade: number;
  }[];
  fornecedores: {
    id: number;
  }[];
}

type CriarCompraParams = 
  Pick<CompraMaterial, "valor">
  & { 
    lojista: Pick<Lojista, "id">; 
    fornecedor: Pick<Fornecedor, "id">;
    detalhesCompras: (Pick<DetalheCompra, "quantidade" | "valor"> & { produto: Pick<Produto, "id"> })[] 
  };

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  obter(pedidoID: number) {
    const url = `${env.API_URL}/pedidos/${pedidoID}`;

    return this.http.get<Pedido>(url);
  }

  filtrarPorLojista(lojistaID: number) {
    const url = `${env.API_URL}/pedidos/lojista/${lojistaID}`;

    return this.http.get<PaginatedResource<{
      id: number;
      lojista: { id: number };
      dataCadastro: string;
    }>>(url);
  }

  criar(params: CriarPedidoParams) {
    const url = `${env.API_URL}/pedidos`;

    return this.http.post<{ id: number; dataCadastro: number; lojista: Lojista; }>(url, params);
  }

  cotacoesPorPedido(pedidoId: number) {
    const url = `${env.API_URL}/cotacoes/pedido/${pedidoId}`
    ;
    return this.http.get<Cotacao[]>(url);
  }

  atualizarCotacoes(pedidoID: number, cotacoes: { 
    detalhePedido: { id: number; }; 
    fornecedor: { id: number; }
    preco: number;
  }[]) {
    const url = `${env.API_URL}/cotacoes/$${pedidoID}`;

    return this.http.patch<PaginatedResource<Cotacao>>(url, cotacoes);
  }

  solicitacoesPrecoPorPedido(pedidoID: number) {
    const url = `${env.API_URL}/solicitacoesPrecos/pedido/${pedidoID}`;
    
    return this.http.get<PaginatedResource<SolicitacaoPreco>>(url);
  }

  compras(emAberto: boolean = true) {
    const url = `${env.API_URL}/comprasMateriais/lojista/${this.authService.lojista.id}?emAberto=${emAberto}`;

    return this.http.get<PaginatedResource<CompraMaterial>>(url);
  }

  compra(compraID: number) {
    const url = `${env.API_URL}/comprasMateriais/${compraID}`;

    return this.http.get<CompraMaterial>(url);
  }

  detalhesCompra(compraId: number) {
    const url = `${env.API_URL}/detalhesCompras/compraMaterial/${compraId}`;
    
    return this.http.get<PaginatedResource<DetalheCompra>>(url);
  }

  gerarCompras(compras: CriarCompraParams[]) {
    const url = `${env.API_URL}/comprasMateriais`;

    return this.http.post(url, compras);
  }
}
