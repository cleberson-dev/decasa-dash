import { Component, OnInit, Input } from '@angular/core';

type Option = {
  title: string;
};

@Component({
  selector: 'ngx-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {
  @Input() produto: Produto;
  @Input() options: Option[] = [];
  @Input() valor?: number;
  @Input() estoque?: number;

  defaultImage = "https://www.eppendorf.com/fileadmin/General/MyEppendorf/Productregistration/Update_January_2021/Shop_ICON_Final.jpg";
  
  constructor() { }

  ngOnInit(): void {
  }
}
