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

  ngOnInit() {
    setInterval(() => {
      this.rate.set(Number(((Math.random() * (0.05 - -0.05) + 0.05) + this.dollarBaseRate).toFixed(2)));
    }, 3000);

    this.currencyForm.get('initialValue')?.valueChanges.subscribe(value => {
      if (value) {
        this.currencyForm.get('basedRate')?.setValue(this.euroToDollarBase(value));
        this.currencyForm.get('actualRate')?.setValue(this.euroToDollarRate(value));
      }
    })
  }

  euroToDollarBase(euroValue: number) {
    return euroValue * this.dollarBaseRate;
  }

  euroToDollarRate(euroValue: number) {
    return euroValue * this.rate();
  }

  dollarToEuroBase(dollarValue: number) {
    return dollarValue / this.dollarBaseRate;
  }

  dollarToEuroRate(dollarValue: number) {
    return dollarValue / this.rate();
  }

  changeCurrency() {
    console.log('change currency');
  }
}
