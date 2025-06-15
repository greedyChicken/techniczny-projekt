package com.jan.financeappbackend.dto;

import com.jan.financeappbackend.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
  private Long id;
  private String name;
  private TransactionType transactionType;
  private boolean isDefault;
}
