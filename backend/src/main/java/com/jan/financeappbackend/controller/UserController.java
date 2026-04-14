package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.dto.UserProfileUpdateResponse;
import com.jan.financeappbackend.request.AuthenticateRequest;
import com.jan.financeappbackend.request.RegisterRequest;
import com.jan.financeappbackend.dto.AuthenticationResponse;
import com.jan.financeappbackend.request.UserRequest;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
  private final AuthenticationService authenticationService;
  private final SecurityUtils securityUtils;

  @PostMapping
  public ResponseEntity<AuthenticationResponse> register(
      @Valid @RequestBody RegisterRequest command) {
    return new ResponseEntity<>(authenticationService.create(command), HttpStatus.CREATED);
  }

  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticateRequest command) {
    return ResponseEntity.ok(authenticationService.authenticate(command));
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
    securityUtils.requireAuthorizedOrAdmin(
        userId, "You are not authorized to delete this user");

    if (securityUtils.isAdmin() && securityUtils.getCurrentUserId().equals(userId)) {
      throw new IllegalArgumentException(
          "Admin users cannot delete their own account while logged in");
    }

    authenticationService.deleteUser(userId);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{userId}")
  public ResponseEntity<UserProfileUpdateResponse> updateUser(
      @PathVariable Long userId, @RequestBody UserRequest request) {
    securityUtils.requireAuthorizedOrAdmin(
        userId, "You are not authorized to update this user");

    return ResponseEntity.ok(authenticationService.updateUser(userId, request));
  }
}
