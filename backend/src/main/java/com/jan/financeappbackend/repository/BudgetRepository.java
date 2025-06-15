package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Budget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
  Page<Budget> findAllByUserId(Long userId, Pageable pageable);

  @Query(
      """
      SELECT DISTINCT b FROM Budget b
      LEFT JOIN b.categories c
      WHERE b.user.id = :userId
      AND b.active = true
      AND :transactionDate BETWEEN b.startDate AND b.endDate
      AND (
        SIZE(b.categories) = 0
        OR c.id = :categoryId
      )
      """)
  List<Budget> findActiveByUserAndCategoryAndDateRange(
      @Param("userId") Long userId,
      @Param("categoryId") Long categoryId,
      @Param("transactionDate") LocalDateTime transactionDate);

  @Query(
      """
      SELECT DISTINCT b FROM Budget b
      LEFT JOIN FETCH b.categories
      WHERE b.id IN :ids
      """)
  List<Budget> findByIdsWithCategories(@Param("ids") List<Long> ids);
}
