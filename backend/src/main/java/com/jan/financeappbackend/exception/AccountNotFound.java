package com.jan.financeappbackend.exception;

public class AccountNotFound extends RuntimeException {
  public AccountNotFound() {
    super("Account not found");
  }
}
