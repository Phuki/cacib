import {Component, OnInit, signal} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-exchange-rate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgFor
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss']
})
export class ExchangeRateComponent implements OnInit {

  dollarBaseRate = 1.1;
  rate = signal(1.1);
  currencyForm = new FormGroup<{
    initialValue: FormControl<number | null>,
    basedRate: FormControl<number | null>,
    actualRate: FormControl<number | null>
  }>({
    initialValue: new FormControl(null),
    basedRate: new FormControl(null),
    actualRate: new FormControl(null)
  });
  rateForm = new FormGroup<{
    rate: FormControl<number | null>
  }>({
    rate: new FormControl(null)
  })
  isEuro = true;
  isNewRate = false;

  ngOnInit() {
    setInterval(() => {
      this.rate.set(Number(((Math.random() * (0.05 - -0.05) + 0.05) + this.dollarBaseRate).toFixed(2)));
      this.isEuro ? this.currencyForm.get('actualRate')?.setValue(this.euroToDollarRate(this.currencyForm.value.initialValue!!))
      : this.currencyForm.get('actualRate')?.setValue(this.dollarToEuroRate(this.currencyForm.value.initialValue!!));
    }, 3000);

    this.currencyForm.get('initialValue')?.valueChanges.subscribe(value => {
      if (value) {
        if (this.isEuro) {
          this.currencyForm.get('basedRate')?.setValue(this.euroToDollarBase(value));
          this.currencyForm.get('actualRate')?.setValue(this.euroToDollarRate(value));
        } else {
          this.currencyForm.get('basedRate')?.setValue(this.dollarToEuroBase(value));
          this.currencyForm.get('actualRate')?.setValue(this.dollarToEuroRate(value));
        }
      }
    })

    this.rateForm.get('rate')?.valueChanges.subscribe(rate => {
      if (rate) {
        if (rate > (this.rate() + this.rate() * 0.02) || rate < (this.rate() - this.rate() * 0.02)) {
          this.isNewRate = false;
        } else {
          this.isNewRate = true;
        }
      }
    });
  }

  euroToDollarBase(euroValue: number) {
    return Number((euroValue * this.dollarBaseRate).toFixed(2));
  }

  euroToDollarRate(euroValue: number) {
    return Number((euroValue * this.rate()).toFixed(2));
  }

  dollarToEuroBase(dollarValue: number) {
    return Number((dollarValue / this.dollarBaseRate).toFixed(2));
  }

  dollarToEuroRate(dollarValue: number) {
    return Number((dollarValue / this.rate()).toFixed(2));
  }

  changeCurrency() {
    this.isEuro = !this.isEuro;
    this.currencyForm.get('initialValue')?.setValue(this.currencyForm.value.basedRate!!);
  }
}
