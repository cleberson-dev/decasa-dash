import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() defaultValue: boolean = false;
  @Output() change = new EventEmitter();
  checked: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checked = this.defaultValue;
  }

  handleClick() {
    this.checked = !this.checked;
    this.change.emit(this.checked);
  }
}
