package com.jan.financeappbackend.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionRequest {
  private Double amount;
  private String description;
  private LocalDateTime date;
  private Long accountId;
  private Long categoryId;
}
