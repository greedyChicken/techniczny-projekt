package com.jan.financeappbackend.exception;

public class BudgetNotFound extends RuntimeException {
  public BudgetNotFound() {
    super("Budget not found");
  }
}
