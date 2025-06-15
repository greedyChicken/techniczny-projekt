package com.jan.financeappbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private Double amount;

  @Column(nullable = false)
  private LocalDateTime startDate;

  @Column(nullable = false)
  private LocalDateTime endDate;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToMany
  @JoinTable(
      name = "budget_categories",
      joinColumns = @JoinColumn(name = "budget_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id"))
  @Builder.Default
  private Set<Category> categories = new HashSet<>();

  @Builder.Default private boolean active = true;

  @Builder.Default private Double spentAmount = 0.0;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  public Double getRemainingAmount() {
    return amount - (spentAmount != null ? spentAmount : 0.0);
  }

  public boolean isExceeded() {
    return getRemainingAmount() < 0;
  }

  public boolean isAllCategories() {
    return categories.isEmpty();
  }

  public boolean hasCategory(Long categoryId) {
    return categories.stream().anyMatch(cat -> cat.getId().equals(categoryId));
  }
}
