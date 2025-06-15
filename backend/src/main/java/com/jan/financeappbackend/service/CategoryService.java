package com.jan.financeappbackend.service;

import com.jan.financeappbackend.model.Category;
import com.jan.financeappbackend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
  public final CategoryRepository categoryRepository;

  public List<Category> getCategoriesForUser(Long userId) {
    return categoryRepository.findDefaultAndUserCategories(userId);
  }

  public Category findById(Long categoryId) {
    return categoryRepository
        .findById(categoryId)
        .orElseThrow(() -> new IllegalArgumentException("no such category"));
  }
}
