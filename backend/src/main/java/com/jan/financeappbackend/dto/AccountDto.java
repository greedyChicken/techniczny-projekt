package com.jan.financeappbackend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDto {
  private Long id;
  private String name;
  private Double balance;
  private boolean active;
  private String accountType;
  private Long userId;
  private String currencyCode;
  private List<Long> transactionsIds;
}
