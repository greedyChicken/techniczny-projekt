package com.jan.financeappbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private Double balance;

  @Builder.Default private boolean active = true;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AccountType accountType;

  @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
  @Builder.Default
  private List<Transaction> transactions = new ArrayList<>();

  @OneToMany(mappedBy = "sourceAccount")
  @Builder.Default
  private List<Transfer> outgoingTransfers = new ArrayList<>();

  @OneToMany(mappedBy = "targetAccount")
  @Builder.Default
  private List<Transfer> incomingTransfers = new ArrayList<>();

  @Column(nullable = false)
  private String currencyCode;

  private String institutionName;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;
}
