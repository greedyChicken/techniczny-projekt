package com.jan.financeappbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "transfers")
public class Transfer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "source_account_id", nullable = false)
  private Account sourceAccount;

  @ManyToOne
  @JoinColumn(name = "target_account_id", nullable = false)
  private Account targetAccount;

  @Column(nullable = false)
  private Double amount;

  @Column(nullable = false)
  private String description;

  @Column(nullable = false)
  private LocalDateTime transferDate;

  @Column(nullable = false)
  private String currencyCode;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;
}
