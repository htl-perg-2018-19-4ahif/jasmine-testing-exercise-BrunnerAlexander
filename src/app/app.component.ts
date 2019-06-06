import { Component } from '@angular/core';
import { InvoiceLine, InvoiceCalculatorService, Invoice } from './invoice-calculator.service';
import { VatCategory } from './vat-categories.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoiceLines: InvoiceLine[] = [];
  invoice: Invoice = {
    invoiceLines: [],
    totalPriceExclusiveVat: 0,
    totalPriceInclusiveVat: 0,
    totalVat: null
  };

  product = '';
  priceInclusiveVat = 0;
  vatCategoryString = 'Food';

  vatCategories = VatCategory;

  constructor(private invoiceCalculator: InvoiceCalculatorService) { }

  addInvoice() {
    const newLine: InvoiceLine = {
      product: this.product,
      priceInclusiveVat: this.priceInclusiveVat,
      vatCategory: null
    };

    if (this.vatCategoryString === 'Food') {
      newLine.vatCategory = VatCategory.Food;
    } else if (this.vatCategoryString === 'Drinks') {
      newLine.vatCategory = VatCategory.Drinks;
    }

    this.invoiceLines.push(newLine);
    this.invoice = this.invoiceCalculator.CalculateInvoice(this.invoiceLines);
  }
}
