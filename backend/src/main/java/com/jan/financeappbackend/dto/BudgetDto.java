package com.jan.financeappbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BudgetDto {
  private Long id;
  private String name;
  private Double amount;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private List<Long> categoryIds;
  private List<String> categoryNames;
  private boolean active;
  private Double spentAmount;
  private boolean allCategories;

  public Double getRemainingAmount() {
    return amount - (spentAmount != null ? spentAmount : 0.0);
  }

  public Double getUsagePercentage() {
    return amount > 0 ? ((spentAmount != null ? spentAmount : 0.0) / amount) * 100 : 0.0;
  }

  public boolean isExceeded() {
    return getRemainingAmount() < 0;
  }
}
