package com.jan.financeappbackend.service;

import com.jan.financeappbackend.dto.FinancialSummaryDto;
import com.jan.financeappbackend.exception.AccountNotFound;
import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.Budget;
import com.jan.financeappbackend.model.Transaction;
import com.jan.financeappbackend.repository.AccountRepository;
import com.jan.financeappbackend.repository.BudgetRepository;
import com.jan.financeappbackend.repository.TransactionRepository;
import com.jan.financeappbackend.request.AccountRequest;
import lombok.RequiredArgsConstructor;
import lombok.val;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
  private final AccountRepository accountRepository;
  private final AuthenticationService authenticationService;
  private final TransactionRepository transactionRepository;
  private final BudgetRepository budgetRepository;

  public List<Account> findByUserId(Long userId) {
    return accountRepository.findByUser(userId);
  }

  public Account findById(Long accountId) {
    return accountRepository.findByIdWithTransactions(accountId).orElseThrow(AccountNotFound::new);
  }

  @Transactional
  public Account updateAccountBalance(Long accountId, Double accountBalance) {
    Account accountBalanceEntity = findById(accountId);
    accountBalanceEntity.setBalance(accountBalance);
    return accountRepository.save(accountBalanceEntity);
  }

  public Account create(AccountRequest request) {
    val account =
        Account.builder()
            .name(request.getName())
            .balance(request.getBalance())
            .accountType(request.getAccountType())
            .user(authenticationService.findUserById(request.getUserId()))
            .currencyCode(request.getCurrencyCode())
            .institutionName(request.getInstitutionName())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    return accountRepository.save(account);
  }

  @Transactional
  public void deleteAccount(Long accountId) {
    var account = findById(accountId);
    var userId = account.getUser().getId();

    List<Transaction> expenseTransactions =
        transactionRepository.findExpenseTransactionsByAccountId(accountId);

    if (!expenseTransactions.isEmpty()) {
      Map<Long, Double> budgetAdjustments = new HashMap<>();
      Set<Long> affectedBudgetIds = new HashSet<>();

      for (Transaction transaction : expenseTransactions) {
        Long categoryId = transaction.getCategory().getId();
        LocalDateTime transactionDate = transaction.getDate();

        List<Budget> applicableBudgets =
            budgetRepository.findActiveByUserAndCategoryAndDateRange(
                userId, categoryId, transactionDate);

        for (Budget budget : applicableBudgets) {
          affectedBudgetIds.add(budget.getId());
          budgetAdjustments.merge(budget.getId(), -Math.abs(transaction.getAmount()), Double::sum);
        }
      }

      if (!affectedBudgetIds.isEmpty()) {
        List<Budget> budgetsToUpdate =
            budgetRepository.findByIdsWithCategories(new ArrayList<>(affectedBudgetIds));

        for (Budget budget : budgetsToUpdate) {
          Double adjustment = budgetAdjustments.get(budget.getId());
          if (adjustment != null) {
            budget.setSpentAmount(budget.getSpentAmount() + adjustment);
            budget.setUpdatedAt(LocalDateTime.now());
          }
        }

        budgetRepository.saveAll(budgetsToUpdate);

        log.info(
            "Reversed budget spending for {} expense transactions across {} budgets for account {}",
            expenseTransactions.size(),
            budgetsToUpdate.size(),
            accountId);
      }
    }

    accountRepository.delete(account);
  }

  @Transactional(readOnly = true)
  public FinancialSummaryDto getFinancialSummary(Long userId) {
    Double totalBalance = accountRepository.getTotalBalanceByUserId(userId);

    List<Account> activeAccounts = accountRepository.findActiveAccountsWithTransactions(userId);

    YearMonth currentMonth = YearMonth.now();
    LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
    LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);

    double monthlyIncome = 0.0;
    double monthlyExpenses = 0.0;

    for (Account account : activeAccounts) {
      for (Transaction transaction : account.getTransactions()) {
        if (transaction.getDate().isAfter(startOfMonth)
            && transaction.getDate().isBefore(endOfMonth)) {
          if (transaction.getAmount() > 0) {
            monthlyIncome += transaction.getAmount();
          } else {
            monthlyExpenses += Math.abs(transaction.getAmount());
          }
        }
      }
    }

    double netCashFlow = monthlyIncome - monthlyExpenses;

    return FinancialSummaryDto.builder()
        .totalAccountsBalance(totalBalance)
        .monthlyIncome(monthlyIncome)
        .monthlyExpenses(monthlyExpenses)
        .netCashFlow(netCashFlow)
        .build();
  }

  @Transactional
  public Account update(Long accountId, AccountRequest request) {
    return accountRepository
        .findById(accountId)
        .map(
            accountToEdit -> {
              accountToEdit.setName(request.getName());
              accountToEdit.setBalance(request.getBalance());
              accountToEdit.setAccountType(request.getAccountType());
              accountToEdit.setCurrencyCode(request.getCurrencyCode());
              accountToEdit.setInstitutionName(request.getInstitutionName());
              accountToEdit.setUpdatedAt(LocalDateTime.now());
              return accountRepository.save(accountToEdit);
            })
        .orElseThrow(AccountNotFound::new);
  }
}
