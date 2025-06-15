package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.request.CategoryRequest;
import com.jan.financeappbackend.dto.CategoryDto;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;
  private final ModelMapper modelMapper;
  private final SecurityUtils securityUtils;

  @GetMapping
  public ResponseEntity<List<CategoryDto>> getCategoriesForUser(@RequestParam Long userId) {
    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to access categories for this user");
    }

    return ResponseEntity.ok(
        categoryService.getCategoriesForUser(userId).stream()
            .map(category -> modelMapper.map(category, CategoryDto.class))
            .toList());
  }
}
