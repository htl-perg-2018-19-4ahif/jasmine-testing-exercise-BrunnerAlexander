import { Injectable } from '@angular/core';
import { VatCategory, VatCategoriesService } from './vat-categories.service';

export interface InvoiceLine {
  product: string;
  vatCategory: VatCategory;
  priceInclusiveVat: number;
}

export interface InvoiceLineComplete extends InvoiceLine {
  priceExclusiveVat: number;
}

export interface Invoice {
  invoiceLines: InvoiceLineComplete[];
  totalPriceInclusiveVat: number;
  totalPriceExclusiveVat: number;
  totalVat: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCalculatorService {

  constructor(private vatCategoriesService: VatCategoriesService) { }

  public CalculatePriceExclusiveVat(priceInclusiveVat: number, vatPercentage: number): number {
    return priceInclusiveVat / (100 + vatPercentage) * 100;
  }

  public CalculateInvoice(invoiceLines: InvoiceLine[]): Invoice {
    const invoice: Invoice = {
      invoiceLines: [],
      totalPriceInclusiveVat: null,
      totalPriceExclusiveVat: null,
      totalVat: null
    };

    let vat: number;
    let vatPercentage: number;

    for (const line of invoiceLines) {
      vatPercentage = this.vatCategoriesService.getVat(line.vatCategory);
      vat = line.priceInclusiveVat / (100 + vatPercentage) * vatPercentage;

      invoice.invoiceLines.push({
        product: line.product,
        vatCategory: line.vatCategory,
        priceInclusiveVat: line.priceInclusiveVat,
        priceExclusiveVat: line.priceInclusiveVat - vat
      });

      invoice.totalPriceInclusiveVat += line.priceInclusiveVat;
      invoice.totalVat += vat;
      invoice.totalPriceExclusiveVat += line.priceInclusiveVat - vat;
    }

    return invoice;
  }
}
