import { Component, OnInit, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Tab } from '../../components/tabber/tabber.component';

type Pedido = {
  data: string;
  codigo: string;
}

@Component({
  selector: 'ngx-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  expanded: boolean = false;

  tabs: Tab[] = [
    { title: 'Cotação', link: '', active: true },
    { title: 'Mapa', link: '' },
    { title: 'Emitir compra', link: '' },
    { title: 'Acompanhamento', link: '' },
  ]

  tableSource = new LocalDataSource();
  tableSettings = {
    columns: {
      data: {
        title: 'Data',
        type: 'string',
      },
      codigo: {
        title: 'Código',
        type: 'string',
      }
    }
  }

  pedidos: Pedido[] = [
    { data: '11/01/1999 às 11:23', codigo: '0123433121' },
    { data: '11/01/1999 às 11:23', codigo: '0123433121' },
    { data: '11/01/1999 às 11:23', codigo: '0123433121' },
    { data: '11/01/1999 às 11:23', codigo: '0123433121' },
    { data: '11/01/1999 às 11:23', codigo: '0123433121' }
  ]

  constructor(
    private dialogService: NbDialogService,
  ) {
    this.tableSource.load(this.pedidos);
  }

  ngOnInit(): void {
    
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }
}
