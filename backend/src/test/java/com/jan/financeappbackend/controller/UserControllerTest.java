package com.jan.financeappbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.dto.AuthenticationResponse;
import com.jan.financeappbackend.request.AuthenticateRequest;
import com.jan.financeappbackend.request.RegisterRequest;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
import com.jan.financeappbackend.request.UserRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    private final MockMvc postman;
    private final ObjectMapper objectMapper;
    private final DatabaseCleaner databaseCleaner;

    @Autowired
    public UserControllerTest(MockMvc postman, ObjectMapper objectMapper, DatabaseCleaner databaseCleaner) {
        this.postman = postman;
        this.objectMapper = objectMapper;
        this.databaseCleaner = databaseCleaner;
    }

    @AfterEach
    void tearDown() throws Exception {
        databaseCleaner.cleanUp();
    }

    @Test
    void shouldRegisterNewUser() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@test.com")
                .password("SecurePassword123!")
                .role("USER")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("newuser@test.com"));
    }

    @Test
    void shouldNotRegisterUserWithExistingEmail() throws Exception {
        RegisterRequest firstUser = RegisterRequest.builder()
                .email("duplicate@test.com")
                .password("Password123!")
                .role("USER")
                .build();

        String firstJson = objectMapper.writeValueAsString(firstUser);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(firstJson))
                .andExpect(status().isCreated());

        RegisterRequest secondUser = RegisterRequest.builder()
                .email("duplicate@test.com")
                .password("DifferentPassword123!")
                .role("USER")
                .build();

        String secondJson = objectMapper.writeValueAsString(secondUser);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(secondJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldAuthenticateUser() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("auth@test.com")
                .password("AuthPassword123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated());

        AuthenticateRequest authRequest = AuthenticateRequest.builder()
                .email("auth@test.com")
                .password("AuthPassword123!")
                .build();

        String authJson = objectMapper.writeValueAsString(authRequest);

        postman.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.email").value("auth@test.com"));
    }

    @Test
    void shouldNotAuthenticateWithWrongPassword() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("wrongpass@test.com")
                .password("CorrectPassword123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated());

        AuthenticateRequest authRequest = AuthenticateRequest.builder()
                .email("wrongpass@test.com")
                .password("WrongPassword123!")
                .build();

        String authJson = objectMapper.writeValueAsString(authRequest);

        postman.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authJson))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldNotAuthenticateNonExistentUser() throws Exception {
        AuthenticateRequest authRequest = AuthenticateRequest.builder()
                .email("nonexistent@test.com")
                .password("Password123!")
                .build();

        String authJson = objectMapper.writeValueAsString(authRequest);

        postman.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(authJson))
                .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldDeleteOwnAccount() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("deleteuser@test.com")
                .password("DeletePassword123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        String response = postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthenticationResponse authResponse = objectMapper.readValue(response, AuthenticationResponse.class);
        Long userId = authResponse.getUser().id();

        postman.perform(delete("/api/users/" + userId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authResponse.getToken()))
                .andDo(print())
                .andExpect(status().isNoContent());

        AuthenticateRequest authRequest = AuthenticateRequest.builder()
                .email("deleteuser@test.com")
                .password("DeletePassword123!")
                .build();

        postman.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockJwtUser
    void shouldNotDeleteOtherUser() throws Exception {
        postman.perform(delete("/api/users/999"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser(username = "admin@financeapp.com", role = "ADMIN", userId = 3L)
    void shouldDeleteAnyUserAsAdmin() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("tobedeleted@test.com")
                .password("Password123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        String response = postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthenticationResponse authResponse = objectMapper.readValue(response, AuthenticationResponse.class);
        Long userId = authResponse.getUser().id();

        postman.perform(delete("/api/users/" + userId))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockJwtUser(username = "admin@financeapp.com", role = "ADMIN", userId = 3L)
    void shouldNotAllowAdminToDeleteOwnAccount() throws Exception {
        Long adminUserId = 3L;

        postman.perform(delete("/api/users/" + adminUserId))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateOwnAccount() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("updateuser@test.com")
                .password("OldPassword123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        String response = postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthenticationResponse authResponse = objectMapper.readValue(response, AuthenticationResponse.class);
        Long userId = authResponse.getUser().id();

        UserRequest updateRequest = UserRequest.builder()
                .email("newemail@test.com")
                .password("NewPassword123!")
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/users/" + userId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authResponse.getToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("newemail@test.com"));

        AuthenticateRequest authRequest = AuthenticateRequest.builder()
                .email("newemail@test.com")
                .password("NewPassword123!")
                .build();

        postman.perform(post("/api/users/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockJwtUser
    void shouldNotUpdateOtherUser() throws Exception {
        UserRequest updateRequest = UserRequest.builder()
                .email("hacker@test.com")
                .password("HackedPassword123!")
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser(username = "admin@financeapp.com", role = "ADMIN", userId = 3L)
    void shouldUpdateAnyUserAsAdmin() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("tobeupdated@test.com")
                .password("OldPass123!")
                .role("USER")
                .build();

        String registerJson = objectMapper.writeValueAsString(registerRequest);

        String response = postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthenticationResponse authResponse = objectMapper.readValue(response, AuthenticationResponse.class);
        Long userId = authResponse.getUser().id();

        UserRequest updateRequest = UserRequest.builder()
                .email("adminupdated@test.com")
                .password("AdminSetPassword123!")
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/users/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("adminupdated@test.com"));
    }

    @Test
    void shouldRegisterAdminUser() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin2@test.com")
                .password("AdminPassword123!")
                .role("ADMIN")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("admin2@test.com"));
    }

    @Test
    void shouldValidateEmailFormat() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("invalid-email")
                .password("Password123!")
                .role("USER")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldValidatePasswordStrength() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("weak@test.com")
                .password("weak")
                .role("USER")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}