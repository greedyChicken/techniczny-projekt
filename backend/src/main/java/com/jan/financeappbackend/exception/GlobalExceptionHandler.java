package com.jan.financeappbackend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

  @ExceptionHandler(AccountNotFound.class)
  public ResponseEntity<ErrorMessage> handleAccountNotFound(AccountNotFound ex, HttpServletRequest request) {
    log.error("Account not found: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(BudgetNotFound.class)
  public ResponseEntity<ErrorMessage> handleBudgetNotFound(BudgetNotFound ex, HttpServletRequest request) {
    log.error("Budget not found: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(TransactionNotFound.class)
  public ResponseEntity<ErrorMessage> handleTransactionNotFound(TransactionNotFound ex, HttpServletRequest request) {
    log.error("Transaction not found: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(TransferNotFound.class)
  public ResponseEntity<ErrorMessage> handleTransferNotFound(TransferNotFound ex, HttpServletRequest request) {
    log.error("Transfer not found: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(UserNotFound.class)
  public ResponseEntity<ErrorMessage> handleUserNotFound(UserNotFound ex, HttpServletRequest request) {
    log.error("User not found: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorMessage> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
    log.error("Access denied: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.FORBIDDEN, ex.getMessage(), request);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ErrorMessage> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
    log.error("Authentication failed: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "Authentication failed", request);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorMessage> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
    log.error("Bad credentials: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password", request);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorMessage> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
    log.error("Invalid argument: {}", ex.getMessage());
    return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorMessage> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
    String message = ex.getBindingResult().getAllErrors().stream()
            .map(error -> error.getDefaultMessage())
            .collect(Collectors.joining(", "));

    log.error("Validation failed: {}", message);
    return createErrorResponse(HttpStatus.BAD_REQUEST, message, request);
  }

  private ResponseEntity<ErrorMessage> createErrorResponse(HttpStatus status, String message, HttpServletRequest request) {
    return new ResponseEntity<>(ErrorMessage.builder()
            .timestamp(LocalDateTime.now())
            .code(status.value())
            .status(status.getReasonPhrase())
            .message(message)
            .uri(request.getRequestURI())
            .method(request.getMethod())
            .build(), status);
  }
}
