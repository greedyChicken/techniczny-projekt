package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.dto.AccountDto;
import com.jan.financeappbackend.dto.FinancialSummaryDto;
import com.jan.financeappbackend.request.AccountRequest;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
  private final AccountService accountService;
  private final ModelMapper modelMapper;
  private final SecurityUtils securityUtils;

  @GetMapping
  public ResponseEntity<List<AccountDto>> getAccountsByUserId(@RequestParam Long userId) {
    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to access accounts for this user");
    }

    var accounts =
        accountService.findByUserId(userId).stream()
            .map(account -> modelMapper.map(account, AccountDto.class))
            .toList();
    return ResponseEntity.ok(accounts);
  }

  @GetMapping("/{accountId}")
  public ResponseEntity<AccountDto> getAccount(@PathVariable Long accountId) {
    val account = accountService.findById(accountId);

    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to access this account");
    }

    return ResponseEntity.ok(modelMapper.map(account, AccountDto.class));
  }

  @PatchMapping("/{accountId}")
  public ResponseEntity<AccountDto> updateAccountBalance(
      @PathVariable Long accountId, @RequestBody Double accountBalance) {
    val account = accountService.findById(accountId);

    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to update this account");
    }

    return ResponseEntity.ok(
        modelMapper.map(
            accountService.updateAccountBalance(accountId, accountBalance), AccountDto.class));
  }

  @PostMapping
  public ResponseEntity<AccountDto> createAccount(@RequestBody AccountRequest request) {
    if (!securityUtils.isAuthorizedOrAdmin(request.getUserId())) {
      throw new AccessDeniedException("You are not authorized to create accounts for other users");
    }

    val account = modelMapper.map(accountService.create(request), AccountDto.class);
    return new ResponseEntity<>(account, HttpStatus.CREATED);
  }

  @DeleteMapping("/{accountId}")
  public ResponseEntity<Void> deleteAccount(@PathVariable Long accountId) {
    val account = accountService.findById(accountId);

    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to delete this account");
    }

    accountService.deleteAccount(accountId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/summary")
  public ResponseEntity<FinancialSummaryDto> getFinancialSummary(@RequestParam Long userId) {
    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException(
          "You are not authorized to access financial summary for this user");
    }

    return ResponseEntity.ok(accountService.getFinancialSummary(userId));
  }

  @PutMapping("/{accountId}")
  public ResponseEntity<AccountDto> updateAccount(
      @PathVariable Long accountId, @RequestBody AccountRequest request) {
    val account = accountService.findById(accountId);

    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to update this account");
    }

    val updatedAccount =
        modelMapper.map(accountService.update(accountId, request), AccountDto.class);
    return ResponseEntity.ok(updatedAccount);
  }
}
