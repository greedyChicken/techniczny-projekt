package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.TransactionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionFilter {
  private Long id;
  private Long userId;
  private Double minAmount;
  private Double maxAmount;
  private String description;
  private LocalDateTime dateFrom;
  private LocalDateTime dateTo;
  private Long categoryId;
  private Long accountId;
  private Long budgetId;
  private TransactionType type;
  private LocalDateTime createdAtFrom;
  private LocalDateTime createdAtTo;
  private LocalDateTime updatedAtFrom;
  private LocalDateTime updatedAtTo;
  private String sortBy;
  private String sortDirection;
}
