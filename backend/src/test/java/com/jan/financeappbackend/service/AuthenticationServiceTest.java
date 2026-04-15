package com.jan.financeappbackend.service;

import com.jan.financeappbackend.dto.AuthenticationResponse;
import com.jan.financeappbackend.exception.UserNotFound;
import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.AccountType;
import com.jan.financeappbackend.model.Role;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.repository.UserRepository;
import com.jan.financeappbackend.request.AuthenticateRequest;
import com.jan.financeappbackend.request.RegisterRequest;
import com.jan.financeappbackend.request.UserRequest;
import com.jan.financeappbackend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    private User testUser;
    private RegisterRequest registerRequest;
    private AuthenticateRequest authenticateRequest;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        registerRequest = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("password123")
                .role("USER")
                .build();

        authenticateRequest = AuthenticateRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();
    }

    @Test
    void findUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User result = authenticationService.findUserById(1L);

        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getEmail(), result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void findUserById_NotFound_ThrowsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        var exception = assertThrows(UserNotFound.class,
                () -> authenticationService.findUserById(999L));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void create_Success() {
        String token = "jwt.token.here";
        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword123");
        when(jwtService.generateToken(any(User.class))).thenReturn(token);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(2L);
            return user;
        });

        AuthenticationResponse result = authenticationService.create(registerRequest);

        assertNotNull(result);
        assertEquals(token, result.getToken());
        assertNotNull(result.getUser());
        assertEquals("newuser@example.com", result.getUser().email());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertEquals("newuser@example.com", savedUser.getEmail());
        assertEquals("encodedPassword123", savedUser.getPassword());
        assertEquals(Role.USER, savedUser.getRole());
        assertEquals(1, savedUser.getAccounts().size());

        Account defaultAccount = savedUser.getAccounts().iterator().next();
        assertEquals("Main Account", defaultAccount.getName());
        assertEquals(0.0, defaultAccount.getBalance());
        assertEquals(AccountType.CHECKING, defaultAccount.getAccountType());
        assertEquals("PLN", defaultAccount.getCurrencyCode());
    }

    @Test
    void create_UserAlreadyExists_ThrowsException() {
        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.of(testUser));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authenticationService.create(registerRequest));
        assertEquals("User with email newuser@example.com exists.", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void authenticate_Success() {
        String token = "jwt.token.here";
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(testUser)).thenReturn(token);

        AuthenticationResponse result = authenticationService.authenticate(authenticateRequest);

        assertNotNull(result);
        assertEquals(token, result.getToken());
        assertEquals(testUser.getId(), result.getUser().id());
        assertEquals(testUser.getEmail(), result.getUser().email());

        verify(authenticationManager, times(1)).authenticate(
                any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void authenticate_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFound.class,
                () -> authenticationService.authenticate(authenticateRequest));
    }

    @Test
    void updateUser_UpdateEmail_Success() {
        UserRequest updateRequest = UserRequest.builder()
                .email("newemail@example.com")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.findByEmail("newemail@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("new.jwt.token");

        var result = authenticationService.updateUser(1L, updateRequest);

        assertNotNull(result);
        assertEquals("newemail@example.com", testUser.getEmail());
        assertNotNull(testUser.getUpdatedAt());
        assertEquals("new.jwt.token", result.getToken());
        assertEquals("newemail@example.com", result.getUser().email());
        verify(userRepository, times(1)).save(testUser);
        verify(jwtService, times(1)).generateToken(any(User.class));
    }

    @Test
    void updateUser_UpdatePassword_Success() {
        UserRequest updateRequest = UserRequest.builder()
                .password("newPassword123")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("pwd.jwt.token");

        var result = authenticationService.updateUser(1L, updateRequest);

        assertNotNull(result);
        assertEquals("encodedNewPassword", testUser.getPassword());
        assertEquals("pwd.jwt.token", result.getToken());
        verify(passwordEncoder, times(1)).encode("newPassword123");
        verify(userRepository, times(1)).save(testUser);
        verify(jwtService, times(1)).generateToken(any(User.class));
    }

    @Test
    void updateUser_UpdateBoth_Success() {
        UserRequest updateRequest = UserRequest.builder()
                .email("newemail@example.com")
                .password("newPassword123")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.findByEmail("newemail@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("newPassword123")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("both.jwt.token");

        var result = authenticationService.updateUser(1L, updateRequest);

        assertNotNull(result);
        assertEquals("newemail@example.com", testUser.getEmail());
        assertEquals("encodedNewPassword", testUser.getPassword());
        assertEquals("both.jwt.token", result.getToken());
        verify(userRepository, times(1)).save(testUser);
        verify(jwtService, times(1)).generateToken(any(User.class));
    }

    @Test
    void updateUser_GoogleUserCannotChangeEmail() {
        User googleUser =
                User.builder()
                        .id(1L)
                        .email("g@gmail.com")
                        .password("x")
                        .role(Role.USER)
                        .registeredViaGoogle(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

        UserRequest updateRequest = UserRequest.builder().email("other@gmail.com").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(googleUser));

        var ex =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> authenticationService.updateUser(1L, updateRequest));
        assertTrue(ex.getMessage().contains("Google"));
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_EmailAlreadyTaken_Throws() {
        UserRequest updateRequest = UserRequest.builder().email("taken@example.com").build();
        User other = User.builder().id(2L).email("taken@example.com").build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.findByEmail("taken@example.com")).thenReturn(Optional.of(other));

        assertThrows(
                IllegalArgumentException.class,
                () -> authenticationService.updateUser(1L, updateRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_UserNotFound_ThrowsException() {
        UserRequest updateRequest = UserRequest.builder()
                .email("newemail@example.com")
                .build();

        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        var exception = assertThrows(UserNotFound.class,
                () -> authenticationService.updateUser(999L, updateRequest));
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        authenticationService.deleteUser(1L);

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void deleteUser_UserNotFound_ThrowsException() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        var exception = assertThrows(UserNotFound.class,
                () -> authenticationService.deleteUser(999L));
        assertEquals("User not found", exception.getMessage());
        verify(userRepository, never()).delete(any());
    }
}