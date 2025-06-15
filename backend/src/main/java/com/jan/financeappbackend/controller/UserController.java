package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.dto.UserDto;
import com.jan.financeappbackend.request.AuthenticateRequest;
import com.jan.financeappbackend.request.RegisterRequest;
import com.jan.financeappbackend.dto.AuthenticationResponse;
import com.jan.financeappbackend.request.UserRequest;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
  private final AuthenticationService authenticationService;
  private final SecurityUtils securityUtils;
  private final ModelMapper modelMapper;

  @PostMapping
  public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest command) {
    return new ResponseEntity<>(authenticationService.create(command), HttpStatus.CREATED);
  }

  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticateRequest command) {
    return ResponseEntity.ok(authenticationService.authenticate(command));
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to delete this user");
    }

    if (securityUtils.isAdmin() && securityUtils.getCurrentUserId().equals(userId)) {
      throw new IllegalArgumentException(
          "Admin users cannot delete their own account while logged in");
    }

    authenticationService.deleteUser(userId);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{userId}")
  public ResponseEntity<UserDto> updateUser(
      @PathVariable Long userId, @RequestBody UserRequest request) {
    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to update this user");
    }

    var response =
        modelMapper.map(authenticationService.updateUser(userId, request), UserDto.class);

    return ResponseEntity.ok(response);
  }
}
