package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

  @Query(
      """
        SELECT t FROM Transaction t
        JOIN t.category c
        WHERE t.account.id = :accountId
        AND t.amount < 0
        """)
  List<Transaction> findExpenseTransactionsByAccountId(@Param("accountId") Long accountId);

  @Query(
      """
          SELECT t FROM Transaction t
          JOIN t.category c
          JOIN t.account a
          WHERE a.user.id = :userId
          AND t.amount < 0
          AND t.date >= :startDate
          AND t.date <= :endDate
          """)
  List<Transaction> findExpensesByUserAndDateRange(
      @Param("userId") Long userId,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate);
}
