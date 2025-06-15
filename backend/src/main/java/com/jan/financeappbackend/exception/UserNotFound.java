package com.jan.financeappbackend.exception;

public class UserNotFound extends RuntimeException {
  public UserNotFound() {
    super("User not found");
  }
}
