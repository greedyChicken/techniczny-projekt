package com.jan.financeappbackend.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferRequest {
  @NotNull(message = "Source account ID is required")
  private Long sourceAccountId;

  @NotNull(message = "Target account ID is required")
  private Long targetAccountId;

  @NotNull(message = "Amount is required")
  @Positive(message = "Amount must be positive")
  private Double amount;

  private LocalDateTime date;

  private String description;
}
