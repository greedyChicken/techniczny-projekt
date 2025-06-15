package com.jan.financeappbackend.dto;

import lombok.*;

@Builder
public record FinancialSummaryDto(
    Double totalAccountsBalance,
    Double monthlyIncome,
    Double monthlyExpenses,
    Double netCashFlow) {}
