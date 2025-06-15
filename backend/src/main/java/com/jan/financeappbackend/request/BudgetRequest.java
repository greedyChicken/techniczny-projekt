package com.jan.financeappbackend.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BudgetRequest {
  private String name;
  private Double amount;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private Long userId;
  private List<Long> categoryIds;
}
