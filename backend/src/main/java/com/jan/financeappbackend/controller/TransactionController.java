package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.repository.TransactionFilter;
import com.jan.financeappbackend.request.TransactionRequest;
import com.jan.financeappbackend.dto.TransactionDto;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.AccountService;
import com.jan.financeappbackend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
  private final TransactionService transactionService;
  private final ModelMapper modelMapper;
  private final SecurityUtils securityUtils;
  private final AccountService accountService;

  @GetMapping
  public ResponseEntity<Page<TransactionDto>> getAllTransactions(
      @RequestParam(required = false) Long userId,
      @ModelAttribute TransactionFilter transactionFilter,
      @PageableDefault(size = 20, sort = "id") Pageable pageable) {

    if (userId != null && !securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException(
          "You are not authorized to access transactions for this user");
    }

    if (userId == null) {
      userId = securityUtils.getCurrentUserId();
      if (userId == null) {
        throw new AccessDeniedException("User not authenticated");
      }
    }

    transactionFilter.setUserId(userId);

    val transactionPage =
        transactionService
            .getAllTransactions(transactionFilter, pageable)
            .map(transaction -> modelMapper.map(transaction, TransactionDto.class));
    return ResponseEntity.ok(transactionPage);
  }

  @GetMapping("/{transactionId}")
  public ResponseEntity<TransactionDto> getTransaction(@PathVariable Long transactionId) {
    val transaction = transactionService.findById(transactionId);

    Long transactionUserId = transaction.getAccount().getUser().getId();
    if (!securityUtils.isAuthorizedOrAdmin(transactionUserId)) {
      throw new AccessDeniedException("You are not authorized to access this transaction");
    }

    return ResponseEntity.ok(modelMapper.map(transaction, TransactionDto.class));
  }

  @PostMapping
  public ResponseEntity<TransactionDto> addTransaction(@RequestBody TransactionRequest request) {
    val account = accountService.findById(request.getAccountId());
    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException(
          "You are not authorized to create transactions for this account");
    }

    val transaction = modelMapper.map(transactionService.create(request), TransactionDto.class);
    return new ResponseEntity<>(transaction, HttpStatus.CREATED);
  }

  @DeleteMapping("/{transactionId}")
  public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId) {
    val transaction = transactionService.findById(transactionId);

    Long transactionUserId = transaction.getAccount().getUser().getId();
    if (!securityUtils.isAuthorizedOrAdmin(transactionUserId)) {
      throw new AccessDeniedException("You are not authorized to delete this transaction");
    }

    transactionService.delete(transactionId);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{transactionId}")
  public ResponseEntity<TransactionDto> updateTransaction(
      @PathVariable Long transactionId, @RequestBody TransactionRequest command) {
    val existingTransaction = transactionService.findById(transactionId);

    Long transactionUserId = existingTransaction.getAccount().getUser().getId();
    if (!securityUtils.isAuthorizedOrAdmin(transactionUserId)) {
      throw new AccessDeniedException("You are not authorized to update this transaction");
    }

    val transaction =
        modelMapper.map(transactionService.edit(transactionId, command), TransactionDto.class);
    return ResponseEntity.ok(transaction);
  }

  @GetMapping("/expenses-by-category")
  public ResponseEntity<Map<String, Double>> getExpensesByCategory(
      @RequestParam Long userId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to access expenses for this user");
    }

    Map<String, Double> expensesByCategory =
        transactionService.getExpensesByCategory(userId, startDate, endDate);
    return ResponseEntity.ok(expensesByCategory);
  }
}
