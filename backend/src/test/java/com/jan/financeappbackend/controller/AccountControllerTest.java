package com.jan.financeappbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
import com.jan.financeappbackend.model.AccountType;
import com.jan.financeappbackend.request.AccountRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Slf4j
@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccountControllerTest {

    private final MockMvc postman;
    private final ObjectMapper objectMapper;
    private final DatabaseCleaner databaseCleaner;

    @Autowired
    public AccountControllerTest(MockMvc postman, ObjectMapper objectMapper, DatabaseCleaner databaseCleaner) {
        this.postman = postman;
        this.objectMapper = objectMapper;
        this.databaseCleaner = databaseCleaner;
    }

    @AfterEach
    void tearDown() throws Exception {
        databaseCleaner.cleanUp();
    }

    @Test
    @WithMockJwtUser
    void shouldGetAccountsByUserId() throws Exception {
        postman.perform(get("/api/accounts")
                        .param("userId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Main Checking"))
                .andExpect(jsonPath("$[0].balance").value(2850.50))
                .andExpect(jsonPath("$[0].accountType").value("CHECKING"))
                .andExpect(jsonPath("$[1].name").value("Emergency Savings"))
                .andExpect(jsonPath("$[1].balance").value(15000.00))
                .andExpect(jsonPath("$[1].accountType").value("SAVINGS"));
    }

    @Test
    @WithMockJwtUser
    void shouldNotGetAccountsForUnauthorizedUser() throws Exception {
        postman.perform(get("/api/accounts")
                        .param("userId", "999"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldGetAccountById() throws Exception {
        postman.perform(get("/api/accounts/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Main Checking"))
                .andExpect(jsonPath("$.balance").value(2850.50))
                .andExpect(jsonPath("$.accountType").value("CHECKING"))
                .andExpect(jsonPath("$.currencyCode").value("USD"))
                .andExpect(jsonPath("$.institutionName").value("Chase Bank"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockJwtUser
    void shouldGetFinancialSummary() throws Exception {
        // Using pre-loaded data for user 1 (Main Checking + Emergency Savings)
        // Total balance should be 2850.50 + 15000.00 = 17850.50
        postman.perform(get("/api/accounts/summary")
                        .param("userId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAccountsBalance").value(17850.50))
                .andExpect(jsonPath("$.monthlyIncome").exists())
                .andExpect(jsonPath("$.monthlyExpenses").exists())
                .andExpect(jsonPath("$.netCashFlow").exists());
    }

    @Test
    @WithMockJwtUser
    void shouldCreateAccount() throws Exception {
        AccountRequest request = AccountRequest.builder()
                .name("New Checking Account")
                .balance(5000.0)
                .accountType(AccountType.CHECKING)
                .userId(1L)
                .currencyCode("EUR")
                .institutionName("European Bank")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Checking Account"))
                .andExpect(jsonPath("$.balance").value(5000.0))
                .andExpect(jsonPath("$.accountType").value("CHECKING"))
                .andExpect(jsonPath("$.currencyCode").value("EUR"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockJwtUser
    void shouldUpdateAccountBalance() throws Exception {
        // Use existing account with ID 2 (Emergency Savings) instead of creating one
        Long accountId = 2L;
        Double newBalance = 20000.0; // Update from 15000.00

        // Verify initial state
        postman.perform(get("/api/accounts/" + accountId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(15000.00));

        // Update the balance
        postman.perform(patch("/api/accounts/" + accountId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newBalance.toString()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(accountId))
                .andExpect(jsonPath("$.balance").value(newBalance));

        // Verify the balance was updated
        postman.perform(get("/api/accounts/" + accountId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(newBalance));
    }

    @Test
    @WithMockJwtUser
    void shouldUpdateAccount() throws Exception {
        // Use existing account with ID 1 (Main Checking) instead of creating one
        Long accountId = 1L;

        // Verify initial state
        postman.perform(get("/api/accounts/" + accountId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Main Checking"))
                .andExpect(jsonPath("$.balance").value(2850.50));

        // Update the account
        AccountRequest updateRequest = AccountRequest.builder()
                .name("Updated Main Checking")
                .balance(5000.0)
                .accountType(AccountType.INVESTMENT)
                .userId(1L)
                .currencyCode("EUR")
                .institutionName("Updated Chase Bank")
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/accounts/" + accountId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(accountId))
                .andExpect(jsonPath("$.name").value("Updated Main Checking"))
                .andExpect(jsonPath("$.balance").value(5000.0))
                .andExpect(jsonPath("$.accountType").value("INVESTMENT"))
                .andExpect(jsonPath("$.currencyCode").value("EUR"))
                .andExpect(jsonPath("$.institutionName").value("Updated Chase Bank"));
    }

    @Test
    @WithMockJwtUser
    void shouldDeleteAccount() throws Exception {
        // Use existing account with ID 2 (Emergency Savings) instead of creating one
        Long accountId = 2L;

        // Verify account exists
        postman.perform(get("/api/accounts/" + accountId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(accountId))
                .andExpect(jsonPath("$.name").value("Emergency Savings"));

        // Delete the account
        postman.perform(delete("/api/accounts/" + accountId))
                .andDo(print())
                .andExpect(status().isNoContent());

        // Verify account is deleted
        postman.perform(get("/api/accounts/" + accountId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockJwtUser
    void shouldNotCreateAccountForOtherUser() throws Exception {
        AccountRequest request = AccountRequest.builder()
                .name("Unauthorized Account")
                .balance(1000.0)
                .accountType(AccountType.SAVINGS)
                .userId(999L)
                .currencyCode("USD")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
}