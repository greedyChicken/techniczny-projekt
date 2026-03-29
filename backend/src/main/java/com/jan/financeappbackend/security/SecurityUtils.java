package com.jan.financeappbackend.security;

import com.jan.financeappbackend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

  private final JwtService jwtService;

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

  public Long getCurrentUserId() {
    String token = extractTokenFromRequest();
    if (token != null) {
      try {
        return jwtService.extractUserId(token);
      } catch (Exception e) {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
      }
    }

    User currentUser = getCurrentUser();
    return currentUser != null ? currentUser.getId() : null;
  }

  public String getCurrentUserRole() {
    String token = extractTokenFromRequest();
    if (token != null) {
      try {
        return jwtService.extractRole(token);
      } catch (Exception e) {
        User currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getRole().name() : null;
      }
    }

    User currentUser = getCurrentUser();
    return currentUser != null ? currentUser.getRole().name() : null;
  }

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

  public boolean isAdmin() {
    String role = getCurrentUserRole();
    return "ADMIN".equals(role);
  }

  public boolean isAuthorizedOrAdmin(Long requestedUserId) {
    return isAdmin() || isAuthorizedForUser(requestedUserId);
  }

  public void requireAuthorizedOrAdmin(Long requestedUserId, String message) {
    if (!isAuthorizedOrAdmin(requestedUserId)) {
      throw new AccessDeniedException(message);
    }
  }

  public void requireAuthorizedOrAdminIfPresent(Long requestedUserId, String message) {
    if (requestedUserId != null) {
      requireAuthorizedOrAdmin(requestedUserId, message);
    }
  }

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
