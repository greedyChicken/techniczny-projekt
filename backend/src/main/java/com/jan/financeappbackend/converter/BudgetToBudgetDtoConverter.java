package com.jan.financeappbackend.converter;

import com.jan.financeappbackend.dto.BudgetDto;
import com.jan.financeappbackend.model.Budget;
import com.jan.financeappbackend.model.Category;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BudgetToBudgetDtoConverter implements Converter<Budget, BudgetDto> {
  @Override
  public BudgetDto convert(MappingContext<Budget, BudgetDto> context) {
    Budget budget = context.getSource();

    List<Long> categoryIds =
        budget.getCategories().stream().map(Category::getId).collect(Collectors.toList());

    List<String> categoryNames =
        budget.getCategories().stream().map(Category::getName).collect(Collectors.toList());

    return BudgetDto.builder()
        .id(budget.getId())
        .name(budget.getName())
        .amount(budget.getAmount())
        .startDate(budget.getStartDate())
        .endDate(budget.getEndDate())
        .categoryIds(categoryIds)
        .categoryNames(categoryNames)
        .active(budget.isActive())
        .spentAmount(budget.getSpentAmount())
        .allCategories(budget.isAllCategories())
        .build();
  }
}
