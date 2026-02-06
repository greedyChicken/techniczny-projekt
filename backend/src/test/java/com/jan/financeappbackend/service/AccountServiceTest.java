package com.jan.financeappbackend.service;

import com.jan.financeappbackend.dto.FinancialSummaryDto;
import com.jan.financeappbackend.exception.AccountNotFound;
import com.jan.financeappbackend.model.*;
import com.jan.financeappbackend.repository.AccountRepository;
import com.jan.financeappbackend.repository.BudgetRepository;
import com.jan.financeappbackend.repository.TransactionRepository;
import com.jan.financeappbackend.request.AccountRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;
    private User testUser;
    private AccountRequest accountRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("password")
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        testAccount = Account.builder()
                .id(1L)
                .name("Test Account")
                .balance(1000.0)
                .accountType(AccountType.CHECKING)
                .user(testUser)
                .currencyCode("USD")
                .active(true)
                .transactions(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        accountRequest = AccountRequest.builder()
                .name("New Account")
                .balance(500.0)
                .accountType(AccountType.SAVINGS)
                .userId(1L)
                .currencyCode("USD")
                .institutionName("Test Bank")
                .build();
    }

    @Test
    void findByUserId_Success() {
        List<Account> accounts = List.of(testAccount, testAccount);
        when(accountRepository.findByUser(1L)).thenReturn(accounts);

        List<Account> result = accountService.findByUserId(1L);

        assertEquals(2, result.size());
        verify(accountRepository, times(1)).findByUser(1L);
    }

    @Test
    void findById_Success() {
        when(accountRepository.findByIdWithTransactions(1L)).thenReturn(Optional.of(testAccount));

        Account result = accountService.findById(1L);

        assertNotNull(result);
        assertEquals(testAccount.getId(), result.getId());
        verify(accountRepository, times(1)).findByIdWithTransactions(1L);
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(accountRepository.findByIdWithTransactions(1L)).thenReturn(Optional.empty());

        assertThrows(AccountNotFound.class, () -> accountService.findById(1L));
        verify(accountRepository, times(1)).findByIdWithTransactions(1L);
    }

    @Test
    void updateAccountBalance_Success() {
        Double newBalance = 2000.0;
        when(accountRepository.findByIdWithTransactions(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.updateAccountBalance(1L, newBalance);

        assertEquals(newBalance, testAccount.getBalance());
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void create_Success() {
        when(authenticationService.findUserById(1L)).thenReturn(testUser);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account account = invocation.getArgument(0);
            account.setId(2L);
            return account;
        });

        Account result = accountService.create(accountRequest);

        assertNotNull(result);
        assertEquals("New Account", result.getName());
        assertEquals(500.0, result.getBalance());
        assertEquals(AccountType.SAVINGS, result.getAccountType());
        verify(authenticationService, times(1)).findUserById(1L);
        verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    void deleteAccount_WithExpenseTransactions_UpdatesBudgets() {
        // Setup
        Long accountId = 1L;
        Long userId = 1L;
        testAccount.getUser().setId(userId);

        Category category = Category.builder()
                .id(1L)
                .name("Food")
                .transactionType(TransactionType.EXPENSE)
                .build();

        Transaction expenseTransaction = Transaction.builder()
                .id(1L)
                .amount(-100.0)
                .category(category)
                .date(LocalDateTime.now())
                .build();

        List<Transaction> expenseTransactions = List.of(expenseTransaction);

        Budget budget = Budget.builder()
                .id(1L)
                .name("Monthly Budget")
                .amount(1000.0)
                .spentAmount(100.0)
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build();

        when(accountRepository.findByIdWithTransactions(accountId)).thenReturn(Optional.of(testAccount));
        when(transactionRepository.findExpenseTransactionsByAccountId(accountId)).thenReturn(expenseTransactions);
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(userId), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(budget));
        when(budgetRepository.findByIdsWithCategories(anyList())).thenReturn(List.of(budget));

        // Execute
        accountService.deleteAccount(accountId);

        // Verify
        assertEquals(0.0, budget.getSpentAmount()); // 100 - 100 = 0
        verify(accountRepository, times(1)).save(testAccount);
        verify(budgetRepository, times(1)).saveAll(anyList());
    }

    @Test
    void deleteAccount_NoExpenseTransactions() {
        when(accountRepository.findByIdWithTransactions(1L)).thenReturn(Optional.of(testAccount));
        when(transactionRepository.findExpenseTransactionsByAccountId(1L)).thenReturn(Collections.emptyList());

        accountService.deleteAccount(1L);

        verify(accountRepository, times(1)).save(testAccount);
        verify(budgetRepository, never()).saveAll(anyList());
    }

    @Test
    void getFinancialSummary_Success() {
        Long userId = 1L;
        Double totalBalance = 5000.0;

        Transaction incomeTransaction = Transaction.builder()
                .amount(1000.0)
                .date(LocalDateTime.now())
                .build();

        Transaction expenseTransaction = Transaction.builder()
                .amount(-500.0)
                .date(LocalDateTime.now())
                .build();

        testAccount.setTransactions(List.of(incomeTransaction, expenseTransaction));

        when(accountRepository.getTotalBalanceByUserId(userId)).thenReturn(totalBalance);
        when(accountRepository.findActiveAccountsWithTransactions(userId)).thenReturn(List.of(testAccount));

        FinancialSummaryDto result = accountService.getFinancialSummary(userId);

        assertNotNull(result);
        assertEquals(totalBalance, result.totalAccountsBalance());
        assertEquals(1000.0, result.monthlyIncome());
        assertEquals(500.0, result.monthlyExpenses());
        assertEquals(500.0, result.netCashFlow());
    }

    @Test
    void update_Success() {
        AccountRequest updateRequest = AccountRequest.builder()
                .name("Updated Account")
                .balance(1500.0)
                .accountType(AccountType.INVESTMENT)
                .currencyCode("EUR")
                .institutionName("New Bank")
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);

        Account result = accountService.update(1L, updateRequest);

        assertNotNull(result);
        assertEquals("Updated Account", testAccount.getName());
        assertEquals(1500.0, testAccount.getBalance());
        assertEquals(AccountType.INVESTMENT, testAccount.getAccountType());
        assertEquals("EUR", testAccount.getCurrencyCode());
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void update_AccountNotFound_ThrowsException() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(AccountNotFound.class, () -> accountService.update(1L, accountRequest));
        verify(accountRepository, never()).save(any());
    }
}