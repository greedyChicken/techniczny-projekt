package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Transfer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

  @Query(
      "SELECT t FROM Transfer t WHERE t.sourceAccount.id = :accountId OR t.targetAccount.id = :accountId")
  Page<Transfer> findByAccountId(@Param("accountId") Long accountId, Pageable pageable);

  @Query(
      "SELECT t FROM Transfer t WHERE t.sourceAccount.user.id = :userId OR t.targetAccount.user.id = :userId")
  Page<Transfer> findByUserId(@Param("userId") Long userId, Pageable pageable);
}
