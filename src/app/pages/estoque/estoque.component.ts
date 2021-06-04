import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { Tab } from '../../components/tabber/tabber.component';

type RowProps = {
  codigo: string;
  nome: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
}

class Row {
  props: RowProps;

  constructor(props: RowProps) {
    this.props = props;
  }

  get subTotal(): number {
    const { precoUnitario, quantidade } = this.props;
    return precoUnitario * quantidade;
  }
}

@Component({
  selector: 'ngx-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {

  tabs: Tab[] = [
    { title: 'Entrada', link: '/estoque', active: true },
    { title: 'Saída/Baixa', link: '/estoque/saida', active: false },
    { title: 'Alerta de Compra', link: '/estoque/alerta-compra', active: false },
    { title: 'Tombamento', link: '/estoque/tombamento', active: false },
  ];

  data: Row[] = [
    new Row({ codigo: '00001', nome: 'Produto #1', unidade: 'cm', quantidade: 5, precoUnitario: 1.99 }),
    new Row({ codigo: '00002', nome: 'Produto #2', unidade: 'kg', quantidade: 2, precoUnitario: 1.99 }),
    new Row({ codigo: '00003', nome: 'Produto #3', unidade: 'pacote', quantidade: 5, precoUnitario: 1.99 }),
    new Row({ codigo: '00004', nome: 'Produto #4', unidade: 'litro', quantidade: 3, precoUnitario: 1.99 }),
    new Row({ codigo: '00005', nome: 'Produto #5', unidade: 'caixa', quantidade: 5, precoUnitario: 1.99 }),
  ];

  form = this.fb.group({
    notaFiscal: ['']
  });

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onConfirmBtnClick(dialog: TemplateRef<any>) {
    console.log('btn clicked');
    if (this.form.controls['notaFiscal'].value === '') {
      const context = {
        type: 'confirm-nfe'
      };
      this.dialogService.open(dialog, { context });
      return;
    }

    alert('Confirmado');
  }
}
