import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() columns: string[];
  @Input() data: any[][];

  constructor() { }

  ngOnInit(): void {
  }
}
