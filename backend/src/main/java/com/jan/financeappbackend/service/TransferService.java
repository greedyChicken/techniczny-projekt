package com.jan.financeappbackend.service;

import com.jan.financeappbackend.exception.TransferNotFound;
import com.jan.financeappbackend.model.*;
import com.jan.financeappbackend.repository.AccountRepository;
import com.jan.financeappbackend.repository.TransferRepository;
import com.jan.financeappbackend.request.TransferRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferService {
  private final TransferRepository transferRepository;
  private final AccountService accountService;
  private final AccountRepository accountRepository;

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

    accountRepository.save(sourceAccount);
    accountRepository.save(targetAccount);
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

  public Transfer findById(Long id) {
    return transferRepository.findById(id).orElseThrow(TransferNotFound::new);
  }

  @Transactional
  public Transfer updateTransfer(Long id, TransferRequest request) {
    Transfer transfer = findById(id);
    Account oldSource = transfer.getSourceAccount();
    Account oldTarget = transfer.getTargetAccount();
    double oldAmount = transfer.getAmount();

    oldSource.setBalance(oldSource.getBalance() + oldAmount);
    oldTarget.setBalance(oldTarget.getBalance() - oldAmount);
    oldSource.setUpdatedAt(LocalDateTime.now());
    oldTarget.setUpdatedAt(LocalDateTime.now());

    Account newSource = accountService.findById(request.getSourceAccountId());
    Account newTarget = accountService.findById(request.getTargetAccountId());
    validateTransfer(newSource, newTarget, request.getAmount());

    newSource.setBalance(newSource.getBalance() - request.getAmount());
    newTarget.setBalance(newTarget.getBalance() + request.getAmount());
    newSource.setUpdatedAt(LocalDateTime.now());
    newTarget.setUpdatedAt(LocalDateTime.now());

    String description =
        request.getDescription() != null
            ? request.getDescription()
            : String.format(
                "Transfer from %s to %s", newSource.getName(), newTarget.getName());

    transfer.setSourceAccount(newSource);
    transfer.setTargetAccount(newTarget);
    transfer.setAmount(request.getAmount());
    transfer.setDescription(description);
    transfer.setTransferDate(
        request.getDate() != null ? request.getDate() : transfer.getTransferDate());
    transfer.setCurrencyCode(newSource.getCurrencyCode());
    transfer.setUpdatedAt(LocalDateTime.now());

    Set<Long> savedAccountIds = new HashSet<>();
    persistAccountIfNeeded(oldSource, savedAccountIds);
    persistAccountIfNeeded(oldTarget, savedAccountIds);
    persistAccountIfNeeded(newSource, savedAccountIds);
    persistAccountIfNeeded(newTarget, savedAccountIds);

    return transferRepository.save(transfer);
  }

  private void persistAccountIfNeeded(Account account, Set<Long> savedAccountIds) {
    if (savedAccountIds.add(account.getId())) {
      accountRepository.save(account);
    }
  }

  @Transactional
  public void deleteTransfer(Long id) {
    Transfer transfer = findById(id);
    Account source = transfer.getSourceAccount();
    Account target = transfer.getTargetAccount();
    double amount = transfer.getAmount();

    source.setBalance(source.getBalance() + amount);
    target.setBalance(target.getBalance() - amount);
    source.setUpdatedAt(LocalDateTime.now());
    target.setUpdatedAt(LocalDateTime.now());

    accountRepository.save(source);
    accountRepository.save(target);
    transferRepository.delete(transfer);
  }
}
