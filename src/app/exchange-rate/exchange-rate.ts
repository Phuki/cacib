import { DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { interval, startWith } from 'rxjs';

type Currency = 'EUR' | 'USD';

interface ExchangeHistory {
  realRate: number;
  forcedRate: number;
  amount: number;
  inputCurrency: Currency;
  outputCurrency: Currency;
  convertedAmount: number;
}

@Component({
  selector: 'app-exchange-rate',
  imports: [DecimalPipe, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonToggleModule, MatTableModule, MatCardModule, MatDividerModule],
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
    let usedRate = this.realRate();
    const diffPercentage = Math.abs(this.forcedRate() - this.realRate()) / this.realRate();
    if (this.forcedRate() && diffPercentage <= 0.02) {
      usedRate = this.forcedRate();
    }
    return this.inputCurrency() === 'EUR' ? usedRate * this.amount() : this.amount() / usedRate;
  });

  forcedRateForm = new FormControl<number>(1, { nonNullable: true });
  forcedRate = toSignal(
    this.forcedRateForm.valueChanges.pipe(
      startWith(this.forcedRateForm.value)
    ),
    { initialValue: this.forcedRateForm.value }
  )

  history = signal<ExchangeHistory[]>([]);
  displayedColumns: string[] = [
    'realRate',
    'forcedRate',
    'amount',
    'inputCurrency',
    'convertedAmount',
    'outputCurrency'];

  constructor() {
    effect(() => {
      const row: ExchangeHistory = {
        realRate: this.realRate(),
        forcedRate: this.forcedRateForm.value,
        amount: this.amount(),
        inputCurrency: this.inputCurrency(),
        outputCurrency: this.outputCurrency(),
        convertedAmount: this.convertedAmount()
      };

      this.history.update(prev => [row, ...prev].slice(0, 5));
    });
  }

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
