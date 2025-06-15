package com.jan.financeappbackend.exception;

public class TransactionNotFound extends RuntimeException {
  public TransactionNotFound() {
    super("Transaction not found");
  }
}
