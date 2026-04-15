package com.jan.financeappbackend.service;

import com.jan.financeappbackend.exception.AccountNotFound;
import com.jan.financeappbackend.exception.TransactionNotFound;
import com.jan.financeappbackend.model.*;
import com.jan.financeappbackend.repository.*;
import com.jan.financeappbackend.request.TransactionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionRepositoryImpl transactionRepositoryImpl;

    @Mock
    private CategoryService categoryService;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Transaction testTransaction;
    private TransactionRequest transactionRequest;
    private Account testAccount;
    private Category testCategory;
    private Budget testBudget;

    @BeforeEach
    void setUp() {
        User testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        testAccount = Account.builder()
                .id(1L)
                .name("Test Account")
                .balance(1000.0)
                .user(testUser)
                .build();

        testCategory = Category.builder()
                .id(1L)
                .name("Food")
                .transactionType(TransactionType.EXPENSE)
                .build();

        testTransaction = Transaction.builder()
                .id(1L)
                .amount(-50.0)
                .description("Grocery shopping")
                .date(LocalDateTime.now())
                .category(testCategory)
                .account(testAccount)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        transactionRequest = TransactionRequest.builder()
                .amount(50.0)
                .description("Grocery shopping")
                .date(LocalDateTime.now())
                .accountId(1L)
                .categoryId(1L)
                .build();

        testBudget = Budget.builder()
                .id(1L)
                .name("Monthly Food Budget")
                .amount(500.0)
                .spentAmount(100.0)
                .user(testUser)
                .categories(new HashSet<>(Set.of(testCategory)))
                .active(true)
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(20))
                .build();
    }

    @Test
    void getAllTransactions_Success() {
        TransactionFilter filter = TransactionFilter.builder()
                .userId(1L)
                .build();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transaction> expectedPage = new PageImpl<>(List.of(testTransaction));

        when(transactionRepositoryImpl.findAllWithFilters(filter, pageable)).thenReturn(expectedPage);

        Page<Transaction> result = transactionService.getAllTransactions(filter, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(transactionRepositoryImpl, times(1)).findAllWithFilters(filter, pageable);
    }

    @Test
    void findById_Success() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));

        Transaction result = transactionService.findById(1L);

        assertNotNull(result);
        assertEquals(testTransaction.getId(), result.getId());
        verify(transactionRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        TransactionNotFound exception = assertThrows(TransactionNotFound.class,
                () -> transactionService.findById(1L));
        assertEquals("Transaction not found", exception.getMessage());
    }

    @Test
    void create_ExpenseTransaction_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(categoryService.findById(1L)).thenReturn(testCategory);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction t = invocation.getArgument(0);
            t.setId(2L);
            return t;
        });
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));

        Transaction result = transactionService.create(transactionRequest);

        assertNotNull(result);
        assertEquals(-50.0, result.getAmount());
        assertEquals(950.0, testAccount.getBalance());
        assertNotNull(testAccount.getUpdatedAt());
        assertEquals(150.0, testBudget.getSpentAmount());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(budgetRepository, times(1)).save(testBudget);
    }

    @Test
    void create_IncomeTransaction_Success() {
        Category incomeCategory = Category.builder()
                .id(2L)
                .name("Salary")
                .transactionType(TransactionType.INCOME)
                .build();

        var newTransactionRequest = TransactionRequest.builder()
                .amount(1000.0)
                .description("Grocery shopping")
                .date(LocalDateTime.now())
                .accountId(1L)
                .categoryId(2L)
                .build();

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(categoryService.findById(2L)).thenReturn(incomeCategory);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction t = invocation.getArgument(0);
            t.setId(2L);
            return t;
        });

        Transaction result = transactionService.create(newTransactionRequest);

        assertNotNull(result);
        assertEquals(1000.0, result.getAmount());
        assertEquals(2000.0, testAccount.getBalance());
        verify(budgetRepository, never()).save(any());
    }

    @Test
    void create_InsufficientBalance_ThrowsException() {
        testAccount.setBalance(30.0);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(categoryService.findById(1L)).thenReturn(testCategory);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transactionService.create(transactionRequest));
        assertEquals("Insufficient balance for transaction", exception.getMessage());
    }

    @Test
    void create_AccountNotFound_ThrowsException() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(AccountNotFound.class, () -> transactionService.create(transactionRequest));
    }

    @Test
    void delete_ExpenseTransaction_UpdatesBudget() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));

        transactionService.delete(1L);

        assertEquals(50.0, testBudget.getSpentAmount());
        verify(transactionRepository, times(1)).deleteById(1L);
        verify(budgetRepository, times(1)).save(testBudget);
    }

    @Test
    void edit_ChangeAmount_UpdatesBudget() {
        TransactionRequest editRequest = TransactionRequest.builder()
                .amount(75.0)
                .description("Updated grocery shopping")
                .date(LocalDateTime.now())
                .categoryId(1L)
                .build();

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));
        when(categoryService.findById(1L)).thenReturn(testCategory);
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));

        Transaction result = transactionService.edit(1L, editRequest);

        assertNotNull(result);
        assertEquals(-75.0, result.getAmount());
        assertEquals(125.0, testBudget.getSpentAmount());
        verify(budgetRepository, times(1)).save(testBudget);
    }

    @Test
    void edit_ExpenseToIncome_ReversesBudget() {
        Category incomeCategory =
                Category.builder()
                        .id(2L)
                        .name("Salary")
                        .transactionType(TransactionType.INCOME)
                        .build();

        TransactionRequest editRequest =
                TransactionRequest.builder()
                        .amount(50.0)
                        .description("Refund reclassified as income")
                        .date(LocalDateTime.now())
                        .categoryId(2L)
                        .build();

        when(categoryService.findById(2L)).thenReturn(incomeCategory);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(
                        eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));

        Transaction result = transactionService.edit(1L, editRequest);

        assertNotNull(result);
        assertEquals(50.0, result.getAmount());
        assertEquals(incomeCategory, result.getCategory());
        assertEquals(50.0, testBudget.getSpentAmount());
        verify(budgetRepository, times(1)).save(testBudget);
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void edit_IncomeToExpense_AppliesBudget() {
        Category incomeCategory =
                Category.builder()
                        .id(2L)
                        .name("Salary")
                        .transactionType(TransactionType.INCOME)
                        .build();

        Transaction incomeTransaction =
                Transaction.builder()
                        .id(5L)
                        .amount(500.0)
                        .description("Salary")
                        .date(LocalDateTime.now())
                        .category(incomeCategory)
                        .account(testAccount)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

        TransactionRequest editRequest =
                TransactionRequest.builder()
                        .amount(100.0)
                        .description("Reclassified purchase")
                        .date(LocalDateTime.now())
                        .categoryId(1L)
                        .build();

        when(categoryService.findById(1L)).thenReturn(testCategory);
        when(transactionRepository.findById(5L)).thenReturn(Optional.of(incomeTransaction));
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(
                        eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));

        Transaction result = transactionService.edit(5L, editRequest);

        assertNotNull(result);
        assertEquals(-100.0, result.getAmount());
        assertEquals(200.0, testBudget.getSpentAmount());
        verify(budgetRepository, times(1)).save(testBudget);
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void edit_ChangeCategory_UpdatesBothBudgets() {
        Category newCategory = Category.builder()
                .id(2L)
                .name("Entertainment")
                .transactionType(TransactionType.EXPENSE)
                .build();

        Budget newBudget = Budget.builder()
                .id(2L)
                .name("Entertainment Budget")
                .amount(300.0)
                .spentAmount(50.0)
                .build();

        TransactionRequest editRequest = TransactionRequest.builder()
                .amount(50.0)
                .description("Updated description")
                .date(LocalDateTime.now())
                .categoryId(2L)
                .build();

        when(categoryService.findById(2L)).thenReturn(newCategory);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(testTransaction));
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(1L), eq(1L), any(LocalDateTime.class)))
                .thenReturn(List.of(testBudget));
        when(budgetRepository.findActiveByUserAndCategoryAndDateRange(eq(1L), eq(newCategory.getId()), any(LocalDateTime.class)))
                .thenReturn(List.of(newBudget));

        Transaction result = transactionService.edit(1L, editRequest);

        assertNotNull(result);
        assertEquals(newCategory, result.getCategory());
        assertEquals(50.0, testBudget.getSpentAmount());
        assertEquals(100.0, newBudget.getSpentAmount());
        verify(budgetRepository, times(2)).save(any(Budget.class));
    }

    @Test
    void edit_TransactionNotFound_ThrowsException() {
        when(categoryService.findById(transactionRequest.getCategoryId())).thenReturn(testCategory);
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> transactionService.edit(1L, transactionRequest));
        assertTrue(exception.getMessage().contains("Transaction with id 1 not found"));
    }

    @Test
    void getExpensesByCategory_Success() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();
        
        Transaction expense1 = Transaction.builder()
                .amount(-100.0)
                .category(testCategory)
                .build();
        
        Category category2 = Category.builder()
                .name("Transport")
                .build();
        
        Transaction expense2 = Transaction.builder()
                .amount(-50.0)
                .category(category2)
                .build();
        
        Transaction expense3 = Transaction.builder()
                .amount(-25.0)
                .category(testCategory)
                .build();

        when(transactionRepository.findExpensesByUserAndDateRange(1L, startDate, endDate))
                .thenReturn(List.of(expense1, expense2, expense3));

        Map<String, Double> result = transactionService.getExpensesByCategory(1L, startDate, endDate);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(125.0, result.get("Food"));
        assertEquals(50.0, result.get("Transport"));
    }

    @Test
    void getExpensesByCategory_NoExpenses_ReturnsEmptyMap() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        LocalDateTime endDate = LocalDateTime.now();

        when(transactionRepository.findExpensesByUserAndDateRange(1L, startDate, endDate))
                .thenReturn(Collections.emptyList());

        Map<String, Double> result = transactionService.getExpensesByCategory(1L, startDate, endDate);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void exportTransactionsToCsv_DelegatesToRepository() {
        TransactionFilter filter = TransactionFilter.builder().userId(1L).build();
        when(transactionRepositoryImpl.findAllWithFiltersUnpaged(filter))
                .thenReturn(List.of(testTransaction));

        byte[] csv = transactionService.exportTransactionsToCsv(filter);

        assertNotNull(csv);
        assertTrue(csv.length > 10);
        verify(transactionRepositoryImpl, times(1)).findAllWithFiltersUnpaged(filter);
    }
}
