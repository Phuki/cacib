import { DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-exchange-rate',
  imports: [DecimalPipe],
  templateUrl: './exchange-rate.html',
  styleUrl: './exchange-rate.scss',
})
export class ExchangeRate {
  realRate = signal(1.1);

  ngOnInit() {
    interval(3000).subscribe(() => {
      const delta = Math.random() * 0.1 - 0.05;
      this.realRate.update(rate => rate + delta)
    })
  }
}
