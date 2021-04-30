import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;

  pageNumbers: number[] = [];

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get hasPrev(): boolean {
    return this.currentPage > 1;
  }

  get hasNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  constructor() {
  }

  ngOnInit() {
    for (let i = 1; i <= this.totalPages; i += 1) {
      this.pageNumbers.push(i);
    }
  }
}