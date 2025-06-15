package com.jan.financeappbackend.service;

import com.jan.financeappbackend.dto.UserDto;
import com.jan.financeappbackend.exception.UserNotFound;
import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.AccountType;
import com.jan.financeappbackend.request.AuthenticateRequest;
import com.jan.financeappbackend.request.RegisterRequest;
import com.jan.financeappbackend.dto.AuthenticationResponse;
import com.jan.financeappbackend.model.Role;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.repository.UserRepository;
import com.jan.financeappbackend.request.UserRequest;
import com.jan.financeappbackend.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public User findUserById(Long userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(
            () -> new IllegalArgumentException(String.format("User with id %s not found", userId)));
  }

  public AuthenticationResponse create(RegisterRequest command) {
    if (userRepository.findByEmail(command.getEmail()).isPresent()) {
      throw new IllegalArgumentException(
          String.format("User with email %s exists.", command.getEmail()));
    }

    var user =
        User.builder()
            .email(command.getEmail())
            .password(passwordEncoder.encode(command.getPassword()))
            .role(Role.valueOf(command.getRole()))
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    var account =
        Account.builder()
            .accountType(AccountType.CHECKING)
            .name("Main Account")
            .balance(0.0)
            .currencyCode("PLN")
            .user(user)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    user.addAccount(account);
    userRepository.save(user);

    var token = jwtService.generateToken(user);
    var userDto = UserDto.builder().id(user.getId()).email(user.getEmail()).build();

    return AuthenticationResponse.builder().token(token).user(userDto).build();
  }

  public AuthenticationResponse authenticate(AuthenticateRequest command) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(command.getEmail(), command.getPassword()));

    var user = userRepository.findByEmail(command.getEmail()).orElseThrow(UserNotFound::new);

    var token = jwtService.generateToken(user);
    var userDto = UserDto.builder().id(user.getId()).email(user.getEmail()).build();

    return AuthenticationResponse.builder().token(token).user(userDto).build();
  }

  public User updateUser(Long userId, UserRequest request) {
    User user = findUserById(userId);

    if (request.getEmail() != null) {
      user.setEmail(request.getEmail());
    }

    if (request.getPassword() != null) {
      user.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    user.setUpdatedAt(LocalDateTime.now());

    return userRepository.save(user);
  }

  public void deleteUser(Long userId) {
    User user = findUserById(userId);
    userRepository.delete(user);
  }
}
