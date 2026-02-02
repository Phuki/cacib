import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { interval, startWith } from 'rxjs';

@Component({
  selector: 'app-exchange-rate',
  imports: [DecimalPipe, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './exchange-rate.html',
  styleUrl: './exchange-rate.scss',
})
export class ExchangeRate {
  realRate = signal(1.1);

  amountForm = new FormControl<number>(1, { nonNullable: true });
  amount = toSignal(
    this.amountForm.valueChanges.pipe(startWith(this.amountForm.value)),
    { initialValue: this.amountForm.value });
  convertedAmount = computed(() => {
    return this.realRate() * this.amount()
  });


  ngOnInit() {
    interval(3000).subscribe(() => {
      const delta = Math.random() * 0.1 - 0.05;
      this.realRate.update(rate => rate + delta)
    })
  }
}
