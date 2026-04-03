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
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      @Lazy AuthenticationManager authenticationManager) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  public User findUserById(Long userId) {
    return userRepository
        .findById(userId)
        .orElseThrow(UserNotFound::new);
  }

  public AuthenticationResponse create(RegisterRequest command) {
    if (userRepository.findByEmail(command.getEmail()).isPresent()) {
      throw new IllegalArgumentException(
          String.format("User with email %s exists.", command.getEmail()));
    }

    User user =
        saveNewUserWithDefaultAccount(
            command.getEmail(),
            passwordEncoder.encode(command.getPassword()),
            Role.valueOf(command.getRole()));

    var token = jwtService.generateToken(user);
    var userDto = UserDto.builder().id(user.getId()).email(user.getEmail()).build();

    return AuthenticationResponse.builder().token(token).user(userDto).build();
  }

  @Transactional
  public User findOrCreateUserFromGoogle(String email) {
    return userRepository
        .findByEmail(email)
        .orElseGet(
            () ->
                saveNewUserWithDefaultAccount(
                    email, passwordEncoder.encode(UUID.randomUUID().toString()), Role.USER));
  }

  private User saveNewUserWithDefaultAccount(
      String email, String encodedPassword, Role role) {
    var user =
        User.builder()
            .email(email)
            .password(encodedPassword)
            .role(role)
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
    return userRepository.save(user);
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
