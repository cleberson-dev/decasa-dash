import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'modal-produto-detalhes',
  templateUrl: './produto-detalhes.component.html',
  styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit {
  @Input() produto: Produto;
  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
