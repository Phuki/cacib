import { DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { interval, startWith } from 'rxjs';

type Currency = 'EUR' | 'USD';

@Component({
  selector: 'app-exchange-rate',
  imports: [DecimalPipe, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './exchange-rate.html',
  styleUrl: './exchange-rate.scss',
})
export class ExchangeRate {
  private destroyRef = inject(DestroyRef);

  realRate = signal(1.1);

  inputCurrency = signal<Currency>('EUR');
  outputCurrency = computed<Currency>(() =>
    this.inputCurrency() === 'EUR' ? 'USD' : 'EUR'
  );

  amountForm = new FormControl<number>(1, { nonNullable: true });
  amount = toSignal(
    this.amountForm.valueChanges.pipe(
      startWith(this.amountForm.value)
    ),
    { initialValue: this.amountForm.value });

  convertedAmount = computed(() => {
    return this.inputCurrency() === 'EUR' ? this.realRate() * this.amount() : this.amount() / this.realRate();
  });

  ngOnInit() {
    interval(3000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const delta = Math.random() * 0.1 - 0.05;
        this.realRate.update(rate => rate + delta)
      });
  }

  onCurrencyChange(currency: Currency) {
    this.amountForm.setValue(this.convertedAmount());
    this.inputCurrency.set(currency);
  }
}
