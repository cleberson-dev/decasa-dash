import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  @Input() produto: Produto;
  @Input() options: NbMenuItem[] = [
    { title: 'Bloquear', icon: 'close-outline' }
  ];
  @Input() valor?: number;
  @Input() estoque?: number;

  @Output() block = new EventEmitter<Produto>();

  defaultImage = "https://www.eppendorf.com/fileadmin/General/MyEppendorf/Productregistration/Update_January_2021/Shop_ICON_Final.jpg";
  
  constructor(
    private menuService: NbMenuService,
  ) { }

  ngOnInit(): void {
    this.menuService.onItemClick()
        .pipe(filter(({ tag }) => tag === 'product-menu'))
        .subscribe(({ item }) => {
          if (item.title !== 'Bloquear') return;
          this.block.emit(this.produto);
        });
  }
}
