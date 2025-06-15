package com.jan.financeappbackend.service;

import com.jan.financeappbackend.exception.AccountNotFound;
import com.jan.financeappbackend.model.TransactionType;
import com.jan.financeappbackend.repository.*;
import com.jan.financeappbackend.request.TransactionRequest;
import com.jan.financeappbackend.model.Transaction;
import com.jan.financeappbackend.model.Budget;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class TransactionService {
  private final TransactionRepository transactionRepository;
  private final TransactionRepositoryImpl transactionRepositoryImpl;
  private final CategoryService categoryService;
  private final AccountRepository accountRepository;
  private final BudgetRepository budgetRepository;

  public Page<Transaction> getAllTransactions(TransactionFilter filter, Pageable pageable) {
    return transactionRepositoryImpl.findAllWithFilters(filter, pageable);
  }

  public Transaction findById(Long id) {
    return transactionRepository
        .findById(id)
        .orElseThrow(() -> new IllegalArgumentException("no such transaction"));
  }

  @Transactional
  public Transaction create(TransactionRequest request) {
    val account =
        accountRepository.findById(request.getAccountId()).orElseThrow(AccountNotFound::new);
    val category = categoryService.findById(request.getCategoryId());
    val isExpense = category.getTransactionType() == TransactionType.EXPENSE;

    double amount = isExpense ? -request.getAmount() : request.getAmount();

    double newBalance = calculateNewBalance(account.getBalance(), amount);

    val transaction =
        Transaction.builder()
            .amount(amount)
            .description(request.getDescription())
            .date(request.getDate())
            .category(category)
            .account(account)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    account.setBalance(newBalance);
    val savedTransaction = transactionRepository.save(transaction);

    if (isExpense) {
      updateBudgetsForExpense(savedTransaction, account.getUser().getId());
    }

    return savedTransaction;
  }

  @Transactional
  public void delete(Long id) {
    Transaction transaction = findById(id);

    if (transaction.getAmount() < 0) {
      Long userId = transaction.getAccount().getUser().getId();
      updateBudgetsForCategory(
          userId,
          transaction.getCategory().getId(),
          -Math.abs(transaction.getAmount()),
          transaction.getDate());
    }

    transactionRepository.deleteById(id);
  }

  @Transactional
  public Transaction edit(Long id, TransactionRequest request) {
    val category = categoryService.findById(request.getCategoryId());
    val isExpense = category.getTransactionType() == TransactionType.EXPENSE;
    return transactionRepository
        .findById(id)
        .map(
            transactionToEdit -> {
              double oldAmount = transactionToEdit.getAmount();
              Long oldCategoryId = transactionToEdit.getCategory().getId();

              transactionToEdit.setId(id);
              transactionToEdit.setAmount(request.getAmount());
              transactionToEdit.setDate(request.getDate());
              transactionToEdit.setCategory(categoryService.findById(request.getCategoryId()));
              transactionToEdit.setDescription(request.getDescription());

              if (isExpense) {
                Long userId = transactionToEdit.getAccount().getUser().getId();

                if (!oldCategoryId.equals(request.getCategoryId())) {
                  updateBudgetsForCategory(
                      userId, oldCategoryId, -Math.abs(oldAmount), transactionToEdit.getDate());
                  updateBudgetsForCategory(
                      userId,
                      request.getCategoryId(),
                      Math.abs(request.getAmount()),
                      transactionToEdit.getDate());
                } else if (oldAmount != request.getAmount()) {
                  // Only amount changed, adjust the difference
                  double difference = Math.abs(request.getAmount()) - Math.abs(oldAmount);
                  updateBudgetsForCategory(
                      userId, request.getCategoryId(), difference, transactionToEdit.getDate());
                }
              }

              return transactionToEdit;
            })
        .orElseThrow(
            () ->
                new NoSuchElementException(String.format("Transaction with id %s not found", id)));
  }

  private Double calculateNewBalance(Double currentBalance, Double transactionAmount) {
    var newBalance = currentBalance + transactionAmount;
    if (newBalance < 0) {
      throw new IllegalArgumentException("Insufficient balance for transaction");
    }
    return newBalance;
  }

  private void updateBudgetsForExpense(Transaction transaction, Long userId) {
    updateBudgetsForCategory(
        userId,
        transaction.getCategory().getId(),
        Math.abs(transaction.getAmount()),
        transaction.getDate());
  }

  private void updateBudgetsForCategory(
      Long userId, Long categoryId, Double amount, LocalDateTime transactionDate) {
    List<Budget> applicableBudgets =
        budgetRepository.findActiveByUserAndCategoryAndDateRange(
            userId, categoryId, transactionDate);

    for (Budget budget : applicableBudgets) {
      budget.setSpentAmount(budget.getSpentAmount() + amount);
      budget.setUpdatedAt(LocalDateTime.now());
      budgetRepository.save(budget);
    }
  }

  public Map<String, Double> getExpensesByCategory(
      Long userId, LocalDateTime startDate, LocalDateTime endDate) {
    List<Transaction> expenseTransactions =
        transactionRepository.findExpensesByUserAndDateRange(userId, startDate, endDate);

    Map<String, Double> expensesByCategory = new HashMap<>();

    for (Transaction transaction : expenseTransactions) {
      String categoryName = transaction.getCategory().getName();
      Double amount = Math.abs(transaction.getAmount()); // Convert negative to positive

      expensesByCategory.merge(categoryName, amount, Double::sum);
    }

    expensesByCategory.replaceAll((k, v) -> Math.round(v * 100.0) / 100.0);

    return expensesByCategory;
  }
}
