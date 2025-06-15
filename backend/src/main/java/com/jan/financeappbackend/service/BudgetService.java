package com.jan.financeappbackend.service;

import com.jan.financeappbackend.exception.BudgetNotFound;
import com.jan.financeappbackend.model.Budget;
import com.jan.financeappbackend.model.Category;
import com.jan.financeappbackend.repository.BudgetRepository;
import com.jan.financeappbackend.request.BudgetRequest;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BudgetService {
  private final BudgetRepository budgetRepository;
  private final AuthenticationService authenticationService;
  private final CategoryService categoryService;

  public Page<Budget> findAllByUserId(Long userId, Pageable pageable) {
    return budgetRepository.findAllByUserId(userId, pageable);
  }

  @Transactional
  public Budget create(BudgetRequest request) {
    val budget =
        Budget.builder()
            .name(request.getName())
            .amount(request.getAmount())
            .user(authenticationService.findUserById(request.getUserId()))
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
      Set<Category> categories = new HashSet<>();
      for (Long categoryId : request.getCategoryIds()) {
        categories.add(categoryService.findById(categoryId));
      }
      budget.setCategories(categories);
    }

    return budgetRepository.save(budget);
  }

  @Transactional
  public Budget update(Long budgetId, BudgetRequest request) {
    Budget budget = budgetRepository.findById(budgetId).orElseThrow(BudgetNotFound::new);

    budget.setName(request.getName());
    budget.setAmount(request.getAmount());
    budget.setStartDate(request.getStartDate());
    budget.setEndDate(request.getEndDate());
    budget.setUpdatedAt(LocalDateTime.now());

    budget.getCategories().clear();
    if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
      for (Long categoryId : request.getCategoryIds()) {
        budget.getCategories().add(categoryService.findById(categoryId));
      }
    }

    return budgetRepository.save(budget);
  }

  public void delete(Long budgetId) {
    if (!budgetRepository.existsById(budgetId)) {
      throw new IllegalArgumentException(String.format("Budget with id %s not found", budgetId));
    }
    budgetRepository.deleteById(budgetId);
  }

  public Budget findById(Long budgetId) {
    return budgetRepository
        .findById(budgetId)
        .orElseThrow(
            () ->
                new IllegalArgumentException(
                    String.format("Budget with id %s not found", budgetId)));
  }
}
