import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRate } from './exchange-rate';

describe('ExchangeRate', () => {
  let component: ExchangeRate;
  let fixture: ComponentFixture<ExchangeRate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeRate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
