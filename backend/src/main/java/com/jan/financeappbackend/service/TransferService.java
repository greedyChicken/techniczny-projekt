package com.jan.financeappbackend.service;

import com.jan.financeappbackend.model.*;
import com.jan.financeappbackend.repository.TransferRepository;
import com.jan.financeappbackend.request.TransferRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {
  private final TransferRepository transferRepository;
  private final AccountService accountService;

  @Transactional
  public Transfer createTransfer(TransferRequest request) {
    Account sourceAccount = accountService.findById(request.getSourceAccountId());
    Account targetAccount = accountService.findById(request.getTargetAccountId());

    validateTransfer(sourceAccount, targetAccount, request.getAmount());

    sourceAccount.setBalance(sourceAccount.getBalance() - request.getAmount());
    targetAccount.setBalance(targetAccount.getBalance() + request.getAmount());
    sourceAccount.setUpdatedAt(LocalDateTime.now());
    targetAccount.setUpdatedAt(LocalDateTime.now());

    Transfer transfer =
        Transfer.builder()
            .sourceAccount(sourceAccount)
            .targetAccount(targetAccount)
            .amount(request.getAmount())
            .description(
                request.getDescription() != null
                    ? request.getDescription()
                    : String.format(
                        "Transfer from %s to %s", sourceAccount.getName(), targetAccount.getName()))
            .transferDate(request.getDate() != null ? request.getDate() : LocalDateTime.now())
            .currencyCode(sourceAccount.getCurrencyCode())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    return transferRepository.save(transfer);
  }

  private void validateTransfer(Account sourceAccount, Account targetAccount, Double amount) {
    if (!sourceAccount.getUser().getId().equals(targetAccount.getUser().getId())) {
      throw new IllegalArgumentException(
          "Cannot transfer money between accounts of different users");
    }

    if (sourceAccount.getId().equals(targetAccount.getId())) {
      throw new IllegalArgumentException("Cannot transfer money to the same account");
    }

    if (sourceAccount.getBalance() < amount) {
      throw new IllegalArgumentException("Insufficient balance in source account");
    }

    if (!sourceAccount.isActive() || !targetAccount.isActive()) {
      throw new IllegalArgumentException("Cannot transfer money from/to inactive accounts");
    }

    if (!sourceAccount.getCurrencyCode().equals(targetAccount.getCurrencyCode())) {
      throw new IllegalArgumentException(
          "Cannot transfer money between accounts with different currencies");
    }
  }

  public Page<Transfer> findByAccountId(Long accountId, Pageable pageable) {
    return transferRepository.findByAccountId(accountId, pageable);
  }

  public Page<Transfer> findByUserId(Long userId, Pageable pageable) {
    return transferRepository.findByUserId(userId, pageable);
  }
}
