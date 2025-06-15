package com.jan.financeappbackend.dto;

public interface FinancialSummaryProjection {
  Double getTotalBalance();

  Double getMonthlyIncome();

  Double getMonthlyExpenses();
}
