package com.jan.financeappbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferDto {
  private Long id;
  private Long sourceAccountId;
  private String sourceAccountName;
  private Long targetAccountId;
  private String targetAccountName;
  private Double amount;
  private String description;
  private LocalDateTime transferDate;
  private String currencyCode;
  private LocalDateTime createdAt;
}
