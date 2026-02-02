import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExchangeRate } from "./exchange-rate/exchange-rate";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ExchangeRate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cacib');
}
