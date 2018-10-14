import { NgModule } from '@angular/core';

import { TermSearchPipe } from './term-search'
import { CapitalizePipe } from './capitalize.pipe';
import { OrderByPipe } from './orderby.pipe';
import { ShortenStringPipe } from './shorten.pipe';
import { TemperaturePipe } from './temperature.pipe';

export const pipes = [
	TermSearchPipe,
  CapitalizePipe,
  OrderByPipe,
  ShortenStringPipe,
  TemperaturePipe,
];

@NgModule({
  declarations:[pipes],
  exports: [pipes]
})

export class PipesModule { }
