import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reais'
})
export class ReaisPipe extends CurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return super.transform(value, 'BRL')
      .replace(',', '.')
      .replace(/.(?=\d{2}$)/, ',')
      .slice(2);
  }

}
