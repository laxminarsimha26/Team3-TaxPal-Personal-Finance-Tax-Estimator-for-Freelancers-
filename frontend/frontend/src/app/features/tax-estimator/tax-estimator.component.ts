import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxService, USCalculationResult, SimpleCalculationResult } from '../../core/services/tax.service';
import { Quarter } from '../../core/models/tax-estimate.model';

type Tab = 'calculator' | 'calendar';

@Component({
  selector: 'app-tax-estimator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tax-estimator.component.html',
  styleUrl: './tax-estimator.component.css',
})
export class TaxEstimatorComponent {
  activeTab: Tab = 'calculator';
  private readonly currentYear = new Date().getFullYear();
  year = this.currentYear;

  country = 'United States';
  state = '';
  filingStatus = 'Single';
  quarter: Quarter = 'Q2';

  grossIncome: number | null = null;
  businessExpenses: number | null = null;
  retirementContributions: number | null = null;
  healthInsurancePremiums: number | null = null;
  homeOfficeDeduction: number | null = null;

  usResult: USCalculationResult | null = null;
  simpleResult: SimpleCalculationResult | null = null;

  constructor(public taxService: TaxService) {
    this.state = this.taxService.statesFor(this.country)[0] ?? '';
  }

  onCountryChange(): void {
    this.state = this.taxService.statesFor(this.country)[0] ?? '';
  }

  get availableStates(): string[] {
    return this.taxService.statesFor(this.country);
  }

  get calendarGroups() {
    return this.taxService.getCalendarEvents(this.year);
  }

  onCalculate(): void {
    this.usResult = null;
    this.simpleResult = null;

    const inputs = {
      grossIncome: this.grossIncome ?? 0,
      businessExpenses: this.businessExpenses ?? 0,
      retirementContributions: this.retirementContributions ?? 0,
      healthInsurancePremiums: this.healthInsurancePremiums ?? 0,
      homeOfficeDeduction: this.homeOfficeDeduction ?? 0,
    };

    let quarterlyTaxDue: number;

    if (this.taxService.usesDetailedMethod(this.country)) {
      this.usResult = this.taxService.calculateUS({ ...inputs, filingStatus: this.filingStatus });
      quarterlyTaxDue = this.usResult.quarterlyTaxDue;
    } else {
      this.simpleResult = this.taxService.calculateSimplified({ ...inputs, country: this.country });
      quarterlyTaxDue = this.simpleResult.quarterlyTax;
    }

    this.taxService.saveEstimate(this.quarter, this.year, this.country, quarterlyTaxDue);
  }
}