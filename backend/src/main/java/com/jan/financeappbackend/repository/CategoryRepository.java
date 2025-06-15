package com.jan.financeappbackend.repository;

import com.jan.financeappbackend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  Optional<Category> findByName(String name);

  @Query(
      "SELECT c FROM Category c WHERE (c.user IS NULL AND c.isDefault = true) OR (c.user.id = :userId)")
  List<Category> findDefaultAndUserCategories(@Param("userId") Long userId);
}
