package com.jan.financeappbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDto {
  private Long id;
  private Double amount;
  private String description;
  private String type;
  private LocalDateTime date;
  private String categoryName;
  private Long accountId;
}
