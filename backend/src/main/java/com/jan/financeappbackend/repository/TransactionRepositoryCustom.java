package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionRepositoryCustom {
  Page<Transaction> findAllWithFilters(TransactionFilter filter, Pageable pageable);
}
