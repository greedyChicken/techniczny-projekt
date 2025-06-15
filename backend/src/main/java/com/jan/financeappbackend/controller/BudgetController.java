package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.dto.BudgetDto;
import com.jan.financeappbackend.request.BudgetRequest;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {
  private final BudgetService budgetService;
  private final ModelMapper modelMapper;
  private final SecurityUtils securityUtils;

  @GetMapping
  public ResponseEntity<Page<BudgetDto>> findAllByUserId(
      @RequestParam Long userId, @PageableDefault(size = 20, sort = "id") Pageable pageable) {

    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to access budgets for this user");
    }

    val page =
        budgetService
            .findAllByUserId(userId, pageable)
            .map(budget -> modelMapper.map(budget, BudgetDto.class));
    return ResponseEntity.ok(page);
  }

  @GetMapping("/{budgetId}")
  public ResponseEntity<BudgetDto> getBudget(@PathVariable Long budgetId) {
    val budget = budgetService.findById(budgetId);

    if (!securityUtils.isAuthorizedOrAdmin(budget.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to access this budget");
    }

    return ResponseEntity.ok(modelMapper.map(budget, BudgetDto.class));
  }

  @PostMapping
  public ResponseEntity<BudgetDto> create(@RequestBody BudgetRequest payload) {
    if (!securityUtils.isAuthorizedOrAdmin(payload.getUserId())) {
      throw new AccessDeniedException("You are not authorized to create budgets for other users");
    }

    val budget = budgetService.create(payload);

    return new ResponseEntity<>(modelMapper.map(budget, BudgetDto.class), HttpStatus.CREATED);
  }

  @PutMapping("/{budgetId}")
  public ResponseEntity<BudgetDto> update(
      @PathVariable Long budgetId, @RequestBody BudgetRequest payload) {
    val existingBudget = budgetService.findById(budgetId);

    if (!securityUtils.isAuthorizedOrAdmin(existingBudget.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to update this budget");
    }

    if (!existingBudget.getUser().getId().equals(payload.getUserId()) && !securityUtils.isAdmin()) {
      throw new AccessDeniedException("Cannot change the owner of a budget");
    }

    val budget = budgetService.update(budgetId, payload);

    return ResponseEntity.ok(modelMapper.map(budget, BudgetDto.class));
  }

  @DeleteMapping("/{budgetId}")
  public ResponseEntity<Void> delete(@PathVariable Long budgetId) {
    val budget = budgetService.findById(budgetId);

    if (!securityUtils.isAuthorizedOrAdmin(budget.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to delete this budget");
    }

    budgetService.delete(budgetId);
    return ResponseEntity.noContent().build();
  }
}
