package com.jan.financeappbackend.request;

import com.jan.financeappbackend.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequest {
  private String name;
  private TransactionType transactionType;
  private Long userId;
  private String colorCode;
  private boolean isDefault;
}
