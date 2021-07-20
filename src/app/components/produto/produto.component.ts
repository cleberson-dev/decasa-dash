import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  @Input() produto: Produto;
  @Input() options: NbMenuItem[] = [
    { title: 'Detalhes', icon: 'info' },
    { title: 'Bloquear', icon: 'close-outline' },
  ];
  @Input() valor?: number;
  @Input() estoque?: number;

  @Output() block = new EventEmitter<Produto>();

  defaultImage = "https://www.eppendorf.com/fileadmin/General/MyEppendorf/Productregistration/Update_January_2021/Shop_ICON_Final.jpg";
  
  @ViewChild('dialog') dialog: TemplateRef<any>;

  constructor(
    private menuService: NbMenuService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.menuService.onItemClick()
        .pipe(filter(({ tag }) => tag === `product-${this.produto.id}-menu`))
        .subscribe(({ item }) => {
          if (item.title === 'Bloquear') {
            this.block.emit(this.produto);
            return;
          }

          if (item.title === 'Detalhes') {
            this.dialogService.open(this.dialog);
            return;
          }
        });
  }

  onDetalhesClose(ref: NbDialogRef<any>) {
    ref.close();
  }
}
