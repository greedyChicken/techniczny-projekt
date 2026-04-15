package com.jan.financeappbackend.exception;

public class TransferNotFound extends RuntimeException {
  public TransferNotFound() {
    super("Transfer not found");
  }
}
