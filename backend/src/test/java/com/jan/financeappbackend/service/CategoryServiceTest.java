package com.jan.financeappbackend.service;

import com.jan.financeappbackend.model.Category;
import com.jan.financeappbackend.model.TransactionType;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category defaultCategory;
    private Category userCategory;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        defaultCategory = Category.builder()
                .id(1L)
                .name("Food")
                .transactionType(TransactionType.EXPENSE)
                .isDefault(true)
                .user(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userCategory = Category.builder()
                .id(2L)
                .name("Custom Category")
                .transactionType(TransactionType.INCOME)
                .isDefault(false)
                .user(testUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getCategoriesForUser_Success() {
        List<Category> categories = List.of(defaultCategory, userCategory);
        when(categoryRepository.findDefaultAndUserCategories(1L)).thenReturn(categories);

        List<Category> result = categoryService.getCategoriesForUser(1L);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.contains(defaultCategory));
        assertTrue(result.contains(userCategory));
        verify(categoryRepository, times(1)).findDefaultAndUserCategories(1L);
    }

    @Test
    void getCategoriesForUser_EmptyList() {
        when(categoryRepository.findDefaultAndUserCategories(1L)).thenReturn(List.of());

        List<Category> result = categoryService.getCategoriesForUser(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(categoryRepository, times(1)).findDefaultAndUserCategories(1L);
    }

    @Test
    void getCategoriesForUser_OnlyDefaultCategories() {
        List<Category> categories = List.of(defaultCategory);
        when(categoryRepository.findDefaultAndUserCategories(1L)).thenReturn(categories);

        List<Category> result = categoryService.getCategoriesForUser(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(defaultCategory, result.get(0));
        assertTrue(result.get(0).isDefault());
        assertNull(result.get(0).getUser());
    }

    @Test
    void getCategoriesForUser_OnlyUserCategories() {
        List<Category> categories = List.of(userCategory);
        when(categoryRepository.findDefaultAndUserCategories(1L)).thenReturn(categories);

        List<Category> result = categoryService.getCategoriesForUser(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(userCategory, result.get(0));
        assertFalse(result.get(0).isDefault());
        assertEquals(testUser, result.get(0).getUser());
    }

    @Test
    void findById_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(defaultCategory));

        Category result = categoryService.findById(1L);

        assertNotNull(result);
        assertEquals(defaultCategory.getId(), result.getId());
        assertEquals(defaultCategory.getName(), result.getName());
        assertEquals(defaultCategory.getTransactionType(), result.getTransactionType());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void findById_NotFound_ThrowsException() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> categoryService.findById(999L));
        assertEquals("no such category", exception.getMessage());
        verify(categoryRepository, times(1)).findById(999L);
    }

    @Test
    void findById_UserCategory_Success() {
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(userCategory));

        Category result = categoryService.findById(2L);

        assertNotNull(result);
        assertEquals(userCategory.getId(), result.getId());
        assertEquals(userCategory.getName(), result.getName());
        assertEquals(userCategory.getUser(), result.getUser());
        assertFalse(result.isDefault());
        verify(categoryRepository, times(1)).findById(2L);
    }

    @Test
    void testMultipleCategoriesForUser() {
        Category category1 = Category.builder()
                .id(3L)
                .name("Transport")
                .transactionType(TransactionType.EXPENSE)
                .isDefault(true)
                .user(null)
                .build();

        Category category2 = Category.builder()
                .id(4L)
                .name("Entertainment")
                .transactionType(TransactionType.EXPENSE)
                .isDefault(true)
                .user(null)
                .build();

        Category category3 = Category.builder()
                .id(5L)
                .name("Freelance")
                .transactionType(TransactionType.INCOME)
                .isDefault(false)
                .user(testUser)
                .build();

        List<Category> categories = List.of(defaultCategory, category1, category2, userCategory, category3);
        when(categoryRepository.findDefaultAndUserCategories(1L)).thenReturn(categories);

        List<Category> result = categoryService.getCategoriesForUser(1L);

        assertNotNull(result);
        assertEquals(5, result.size());

        long defaultCount = result.stream().filter(Category::isDefault).count();
        long userCount = result.stream().filter(c -> !c.isDefault()).count();
        
        assertEquals(3, defaultCount);
        assertEquals(2, userCount);
    }
}