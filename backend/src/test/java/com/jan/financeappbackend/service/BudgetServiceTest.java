package com.jan.financeappbackend.service;

import com.jan.financeappbackend.exception.BudgetNotFound;
import com.jan.financeappbackend.model.Budget;
import com.jan.financeappbackend.model.Category;
import com.jan.financeappbackend.model.TransactionType;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.repository.BudgetRepository;
import com.jan.financeappbackend.repository.TransactionRepository;
import com.jan.financeappbackend.request.BudgetRequest;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private BudgetService budgetService;

    private Budget testBudget;
    private BudgetRequest budgetRequest;
    private User testUser;
    private Category testCategory1;
    private Category testCategory2;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        testCategory1 = Category.builder()
                .id(1L)
                .name("Food")
                .transactionType(TransactionType.EXPENSE)
                .build();

        testCategory2 = Category.builder()
                .id(2L)
                .name("Transport")
                .transactionType(TransactionType.EXPENSE)
                .build();

        testBudget = Budget.builder()
                .id(1L)
                .name("Monthly Budget")
                .amount(1000.0)
                .user(testUser)
                .startDate(LocalDateTime.now().minusDays(10))
                .endDate(LocalDateTime.now().plusDays(20))
                .categories(new HashSet<>(Set.of(testCategory1)))
                .active(true)
                .spentAmount(100.0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        budgetRequest = BudgetRequest.builder()
                .name("New Budget")
                .amount(500.0)
                .userId(1L)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(30))
                .categoryIds(List.of(1L, 2L))
                .build();

        lenient()
                .when(transactionRepository.sumExpenseAmountsForUserInDateRange(anyLong(), any(), any()))
                .thenReturn(0.0);
        lenient()
                .when(
                        transactionRepository.sumExpenseAmountsForUserInDateRangeAndCategoryIds(
                                anyLong(), any(), any(), anyList()))
                .thenReturn(0.0);
    }

    @Test
    void findAllByUserId_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Budget> expectedPage = new PageImpl<>(List.of(testBudget));

        when(budgetRepository.findAllByUserId(1L, pageable)).thenReturn(expectedPage);

        Page<Budget> result = budgetService.findAllByUserId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testBudget, result.getContent().get(0));
        verify(budgetRepository, times(1)).findAllByUserId(1L, pageable);
    }

    @Test
    void create_WithCategories_Success() {
        when(authenticationService.findUserById(1L)).thenReturn(testUser);
        when(categoryService.findById(1L)).thenReturn(testCategory1);
        when(categoryService.findById(2L)).thenReturn(testCategory2);
        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> {
            Budget budget = invocation.getArgument(0);
            budget.setId(2L);
            return budget;
        });

        Budget result = budgetService.create(budgetRequest);

        assertNotNull(result);
        assertEquals("New Budget", result.getName());
        assertEquals(500.0, result.getAmount());
        assertEquals(2, result.getCategories().size());
        assertTrue(result.getCategories().contains(testCategory1));
        assertTrue(result.getCategories().contains(testCategory2));
        verify(authenticationService, times(1)).findUserById(1L);
        verify(categoryService, times(1)).findById(1L);
        verify(categoryService, times(1)).findById(2L);
        verify(budgetRepository, times(1)).save(any(Budget.class));
        verify(transactionRepository, times(1))
                .sumExpenseAmountsForUserInDateRangeAndCategoryIds(
                        eq(1L), any(), any(), anyList());
        verify(transactionRepository, never())
                .sumExpenseAmountsForUserInDateRange(anyLong(), any(), any());
    }

    @Test
    void create_WithoutCategories_Success() {
        BudgetRequest requestWithoutCategories = BudgetRequest.builder()
                .name("All Categories Budget")
                .amount(2000.0)
                .userId(1L)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(30))
                .categoryIds(null)
                .build();

        when(authenticationService.findUserById(1L)).thenReturn(testUser);
        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> {
            Budget budget = invocation.getArgument(0);
            budget.setId(3L);
            return budget;
        });

        Budget result = budgetService.create(requestWithoutCategories);

        assertNotNull(result);
        assertEquals("All Categories Budget", result.getName());
        assertTrue(result.getCategories().isEmpty());
        verify(categoryService, never()).findById(anyLong());
        verify(budgetRepository, times(1)).save(any(Budget.class));
        verify(transactionRepository, times(1))
                .sumExpenseAmountsForUserInDateRange(eq(1L), any(), any());
        verify(transactionRepository, never())
                .sumExpenseAmountsForUserInDateRangeAndCategoryIds(
                        anyLong(), any(), any(), anyList());
    }

    @Test
    void create_AllCategories_BackfillsSpentFromExistingExpenses() {
        BudgetRequest requestWithoutCategories =
                BudgetRequest.builder()
                        .name("All Categories Budget")
                        .amount(2000.0)
                        .userId(1L)
                        .startDate(LocalDateTime.of(2026, 4, 1, 0, 0))
                        .endDate(LocalDateTime.of(2026, 4, 30, 23, 59, 59))
                        .categoryIds(null)
                        .build();

        when(authenticationService.findUserById(1L)).thenReturn(testUser);
        when(transactionRepository.sumExpenseAmountsForUserInDateRange(eq(1L), any(), any()))
                .thenReturn(350.25);
        when(budgetRepository.save(any(Budget.class)))
                .thenAnswer(
                        invocation -> {
                            Budget budget = invocation.getArgument(0);
                            budget.setId(99L);
                            return budget;
                        });

        Budget result = budgetService.create(requestWithoutCategories);

        assertEquals(350.25, result.getSpentAmount(), 0.001);
    }

    @Test
    void create_EmptyCategoryList_Success() {
        var budgetRequestWithEmptyCategories = BudgetRequest.builder()
                .name("New Budget")
                .amount(500.0)
                .userId(1L)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(30))
                .categoryIds(Collections.emptyList())
                .build();

        when(authenticationService.findUserById(1L)).thenReturn(testUser);
        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Budget result = budgetService.create(budgetRequestWithEmptyCategories);

        assertNotNull(result);
        assertTrue(result.getCategories().isEmpty());
        verify(categoryService, never()).findById(anyLong());
        verify(transactionRepository, times(1))
                .sumExpenseAmountsForUserInDateRange(eq(1L), any(), any());
    }

    @Test
    void update_Success() {
        BudgetRequest updateRequest = BudgetRequest.builder()
                .name("Updated Budget")
                .amount(1500.0)
                .startDate(LocalDateTime.now().minusDays(5))
                .endDate(LocalDateTime.now().plusDays(25))
                .categoryIds(List.of(2L))
                .build();

        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(categoryService.findById(2L)).thenReturn(testCategory2);
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);

        Budget result = budgetService.update(1L, updateRequest);

        assertNotNull(result);
        assertEquals("Updated Budget", result.getName());
        assertEquals(1500.0, result.getAmount());
        assertEquals(1, result.getCategories().size());
        assertTrue(result.getCategories().contains(testCategory2));
        assertFalse(result.getCategories().contains(testCategory1));
        verify(budgetRepository, times(1)).save(testBudget);
        verify(transactionRepository, times(1))
                .sumExpenseAmountsForUserInDateRangeAndCategoryIds(
                        eq(1L), any(), any(), anyList());
    }

    @Test
    void update_BudgetNotFound_ThrowsException() {
        when(budgetRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(BudgetNotFound.class, () -> budgetService.update(999L, budgetRequest));
        verify(budgetRepository, never()).save(any());
    }

    @Test
    void update_ClearCategories_Success() {
        BudgetRequest updateRequest = BudgetRequest.builder()
                .name("Updated Budget")
                .amount(1500.0)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(30))
                .categoryIds(null)
                .build();

        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));
        when(budgetRepository.save(any(Budget.class))).thenReturn(testBudget);

        Budget result = budgetService.update(1L, updateRequest);

        assertNotNull(result);
        assertTrue(result.getCategories().isEmpty());
        verify(categoryService, never()).findById(anyLong());
        verify(transactionRepository, times(1))
                .sumExpenseAmountsForUserInDateRange(eq(1L), any(), any());
    }

    @Test
    void delete_Success() {
        when(budgetRepository.existsById(1L)).thenReturn(true);

        budgetService.delete(1L);

        verify(budgetRepository, times(1)).existsById(1L);
        verify(budgetRepository, times(1)).deleteById(1L);
    }

    @Test
    void delete_BudgetNotFound_ThrowsException() {
        when(budgetRepository.existsById(999L)).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> budgetService.delete(999L));
        assertEquals("Budget with id 999 not found", exception.getMessage());
        verify(budgetRepository, never()).deleteById(anyLong());
    }

    @Test
    void findById_Success() {
        when(budgetRepository.findById(1L)).thenReturn(Optional.of(testBudget));

        Budget result = budgetService.findById(1L);

        assertNotNull(result);
        assertEquals(testBudget.getId(), result.getId());
        assertEquals(testBudget.getName(), result.getName());
        verify(budgetRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(budgetRepository.findById(999L)).thenReturn(Optional.empty());

        var exception = assertThrows(BudgetNotFound.class,
                () -> budgetService.findById(999L));
        assertEquals("Budget not found", exception.getMessage());
    }

    @Test
    void testBudgetMethods() {
        // Test getRemainingAmount
        assertEquals(900.0, testBudget.getRemainingAmount()); // 1000 - 100

        // Test isExceeded - not exceeded
        assertFalse(testBudget.isExceeded());

        // Test isExceeded - exceeded
        testBudget.setSpentAmount(1100.0);
        assertTrue(testBudget.isExceeded());

        // Test isAllCategories
        assertFalse(testBudget.isAllCategories());
        testBudget.setCategories(new HashSet<>());
        assertTrue(testBudget.isAllCategories());

        // Test hasCategory
        testBudget.setCategories(new HashSet<>(Set.of(testCategory1)));
        assertTrue(testBudget.hasCategory(1L));
        assertFalse(testBudget.hasCategory(2L));
    }
}