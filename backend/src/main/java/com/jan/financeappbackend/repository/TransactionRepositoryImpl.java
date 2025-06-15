package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.QTransaction;
import com.jan.financeappbackend.model.Transaction;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.jan.financeappbackend.model.QAccount.account;
import static com.jan.financeappbackend.model.QBudget.budget;
import static com.jan.financeappbackend.model.QCategory.category;

@Repository
@RequiredArgsConstructor
public class TransactionRepositoryImpl implements TransactionRepositoryCustom {
  private final JPAQueryFactory queryFactory;

  @Override
  public Page<Transaction> findAllWithFilters(TransactionFilter filter, Pageable pageable) {
    QTransaction transaction = QTransaction.transaction;

    JPAQuery<Transaction> query = queryFactory.selectFrom(transaction);

    BooleanBuilder predicate = buildWhereClause(filter, transaction);

    query.where(predicate);

    applySorting(filter, query);

    long total = query.fetchCount();

    List<Transaction> transactions =
        query.offset(pageable.getOffset()).limit(pageable.getPageSize()).fetch();

    return new PageImpl<>(transactions, pageable, total);
  }

  private BooleanBuilder buildWhereClause(TransactionFilter filter, QTransaction transaction) {
    BooleanBuilder predicate = new BooleanBuilder();

    if (filter == null) {
      return predicate;
    }

    if (filter.getId() != null) {
      predicate.and(transaction.id.eq(filter.getId()));
    }

    if (filter.getUserId() != null) {
      predicate.and(account.user.id.eq(filter.getUserId()));
    }

    if (filter.getMinAmount() != null) {
      predicate.and(transaction.amount.goe(filter.getMinAmount()));
    }

    if (filter.getMaxAmount() != null) {
      predicate.and(transaction.amount.loe(filter.getMaxAmount()));
    }

    if (filter.getDescription() != null && !filter.getDescription().isEmpty()) {
      predicate.and(transaction.description.containsIgnoreCase(filter.getDescription()));
    }

    if (filter.getDateFrom() != null) {
      predicate.and(transaction.date.goe(filter.getDateFrom()));
    }

    if (filter.getDateTo() != null) {
      predicate.and(transaction.date.loe(filter.getDateTo()));
    }

    if (filter.getCategoryId() != null) {
      predicate.and(category.id.eq(filter.getCategoryId()));
    }

    if (filter.getAccountId() != null) {
      predicate.and(account.id.eq(filter.getAccountId()));
    }

    if (filter.getBudgetId() != null) {
      predicate.and(budget.id.eq(filter.getBudgetId()));
    }

    if (filter.getType() != null) {
      predicate.and(category.transactionType.eq(filter.getType()));
    }

    if (filter.getCreatedAtFrom() != null) {
      predicate.and(transaction.createdAt.goe(filter.getCreatedAtFrom()));
    }

    if (filter.getCreatedAtTo() != null) {
      predicate.and(transaction.createdAt.loe(filter.getCreatedAtTo()));
    }

    if (filter.getUpdatedAtFrom() != null) {
      predicate.and(transaction.updatedAt.goe(filter.getUpdatedAtFrom()));
    }

    if (filter.getUpdatedAtTo() != null) {
      predicate.and(transaction.updatedAt.loe(filter.getUpdatedAtTo()));
    }

    return predicate;
  }

  private void applySorting(TransactionFilter filter, JPAQuery<Transaction> query) {
    if (filter != null && filter.getSortBy() != null && filter.getSortDirection() != null) {
      Order order = filter.getSortDirection().equalsIgnoreCase("ASC") ? Order.ASC : Order.DESC;
      PathBuilder<Transaction> entityPath = new PathBuilder<>(Transaction.class, "transaction");
      query.orderBy(new OrderSpecifier(order, entityPath.get(filter.getSortBy())));
    } else {
      // Default sort by creation date if not specified
      QTransaction transaction = QTransaction.transaction;
      query.orderBy(transaction.createdAt.desc());
    }
  }
}
