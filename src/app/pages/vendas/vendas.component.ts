import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Tab } from '../../components/tabber/tabber.component';
import { ApiService } from '../../services/api.service';

type TableRow = {
  data: string;
  valor: number;
  descricao?: string;
  notaFiscal?: string;
  opened?: boolean;
};

@Component({
  selector: 'ngx-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Venda de Balcão', link: '/vendas', active: true },
    { title: 'eCommerce', link: '/vendas/ecommerce', active: false },
    { title: 'Separando', link: '/vendas/separando', active: false },
    { title: 'Em rota', link: '/vendas/em-rota', active: false },
    { title: 'Entregue', link: '/vendas/entregue', active: false }
  ];

  data: TableRow[] = [
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false },
    { data: '17/05/2021', notaFiscal: '964', descricao: 'TAXAS E MULTAS', valor: 40, opened: false }
  ];
  
  constructor(
    private apiService: ApiService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.apiService
      .getVendasMaterialPorLojista(2)
      .subscribe(
        data => {
          this.data = data.content.map((venda): TableRow => ({
            data: venda.dataVenda,
            valor: venda.valor,
            opened: false
          }));
        },
        err => {
          console.error(err);
          this.toastrService.danger(err.error.message, 'Não foi possível obter vendas');
        }
      );
  }

}
