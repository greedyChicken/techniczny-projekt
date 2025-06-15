package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
  @EntityGraph(attributePaths = {"transactions"})
  @Query("SELECT a FROM Account a WHERE a.id = :id")
  Optional<Account> findByIdWithTransactions(@Param("id") Long id);

  @Query("SELECT a FROM Account a WHERE a.user.id = :userId")
  List<Account> findByUser(@Param("userId") Long userId);

  @EntityGraph(attributePaths = {"transactions", "transactions.category"})
  @Query("SELECT a FROM Account a WHERE a.user.id = :userId AND a.active = true")
  List<Account> findActiveAccountsWithTransactions(@Param("userId") Long userId);

  @Query(
      "SELECT COALESCE(SUM(a.balance), 0.0) FROM Account a WHERE a.user.id = :userId AND a.active = true")
  Double getTotalBalanceByUserId(@Param("userId") Long userId);
}
