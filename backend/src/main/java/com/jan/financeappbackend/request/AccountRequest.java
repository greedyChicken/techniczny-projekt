package com.jan.financeappbackend.request;

import com.jan.financeappbackend.model.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountRequest {
  private String name;
  private Double balance;
  private AccountType accountType;
  private Long userId;
  private String currencyCode;
  private String institutionName;
}
