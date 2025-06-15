package com.jan.financeappbackend.security;

import com.jan.financeappbackend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

  private final JwtService jwtService;

  /** Get the currently authenticated user */
  public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return null;
    }

    Object principal = authentication.getPrincipal();
    if (principal instanceof User) {
      return (User) principal;
    }

    return null;
  }

  /**
   * Get the ID of the currently authenticated user from JWT token This is more efficient than
   * loading the full user object
   */
  public Long getCurrentUserId() {
    String token = extractTokenFromRequest();
    if (token != null) {
      try {
        return jwtService.extractUserId(token);
      } catch (Exception e) {
        // Fall back to getting from authentication
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
      }
    }

    User currentUser = getCurrentUser();
    return currentUser != null ? currentUser.getId() : null;
  }

  /** Get the role of the currently authenticated user from JWT token */
  public String getCurrentUserRole() {
    String token = extractTokenFromRequest();
    if (token != null) {
      try {
        return jwtService.extractRole(token);
      } catch (Exception e) {
        // Fall back to getting from authentication
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getRole().name() : null;
      }
    }

    User currentUser = getCurrentUser();
    return currentUser != null ? currentUser.getRole().name() : null;
  }

  /** Check if the current user is authorized to access data for the given userId */
  public boolean isAuthorizedForUser(Long requestedUserId) {
    if (requestedUserId == null) {
      return false;
    }

    Long currentUserId = getCurrentUserId();
    if (currentUserId == null) {
      return false;
    }

    return currentUserId.equals(requestedUserId);
  }

  /** Check if the current user has admin role */
  public boolean isAdmin() {
    String role = getCurrentUserRole();
    return "ADMIN".equals(role);
  }

  /** Check if the current user is authorized for the requested user or is an admin */
  public boolean isAuthorizedOrAdmin(Long requestedUserId) {
    return isAdmin() || isAuthorizedForUser(requestedUserId);
  }

  /** Extract JWT token from the current request */
  private String extractTokenFromRequest() {
    ServletRequestAttributes attributes =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (attributes != null) {
      HttpServletRequest request = attributes.getRequest();
      String authHeader = request.getHeader("Authorization");

      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
      }
    }

    return null;
  }
}
