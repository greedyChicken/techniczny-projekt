package com.jan.financeappbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
import com.jan.financeappbackend.request.TransactionRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TransactionControllerTest {

    private final MockMvc postman;
    private final ObjectMapper objectMapper;
    private final DatabaseCleaner databaseCleaner;

    @Autowired
    public TransactionControllerTest(MockMvc postman, ObjectMapper objectMapper, DatabaseCleaner databaseCleaner) {
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
    void shouldGetAllTransactions() throws Exception {
        postman.perform(get("/api/transactions"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.content[0].amount").value(-125.50))
                .andExpect(jsonPath("$.content[0].description").value("Weekly grocery shopping"))
                .andExpect(jsonPath("$.content[1].amount").value(3500.0))
                .andExpect(jsonPath("$.content[1].description").value("Monthly salary deposit"))
                .andExpect(jsonPath("$.pageable").exists())
                .andExpect(jsonPath("$.totalElements").value(greaterThanOrEqualTo(2)));
    }

    @Test
    @WithMockJwtUser
    void shouldGetTransactionById() throws Exception {
        long transactionId = 1;

        postman.perform(get("/api/transactions/" + transactionId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(transactionId))
                .andExpect(jsonPath("$.amount").value(-125.50))
                .andExpect(jsonPath("$.description").value("Weekly grocery shopping"))
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Salary"));
    }

    @Test
    @WithMockJwtUser
    void shouldCreateTransaction() throws Exception {
        TransactionRequest request = TransactionRequest.builder()
                .amount(250.50)
                .description("New Grocery Shopping")
                .date(LocalDateTime.now())
                .accountId(1L)
                .categoryId(6L)
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(6L))
                .andExpect(jsonPath("$.amount").value(-250.50))
                .andExpect(jsonPath("$.description").value("New Grocery Shopping"))
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Food & Dining"));

        postman.perform(get("/api/transactions/6"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(6L))
                .andExpect(jsonPath("$.amount").value(-250.50))
                .andExpect(jsonPath("$.description").value("New Grocery Shopping"))
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Food & Dining"));
    }

    @Test
    @WithMockJwtUser
    void shouldUpdateTransaction() throws Exception {
        var transactionId = 2;

        postman.perform(get("/api/transactions/" +  transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(transactionId))
                .andExpect(jsonPath("$.amount").value(3500.0))
                .andExpect(jsonPath("$.description").value("Monthly salary deposit"));

        TransactionRequest updateRequest = TransactionRequest.builder()
                .amount(4000.0)
                .description("Updated monthly salary deposit")
                .date(LocalDateTime.now())
                .accountId(1L)
                .categoryId(3L)
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/transactions/" + transactionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isOk());

        postman.perform(get("/api/transactions/" + transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(transactionId))
                .andExpect(jsonPath("$.amount").value(4000.0))
                .andExpect(jsonPath("$.description").value("Updated monthly salary deposit"))
                .andExpect(jsonPath("$.accountId").value(1))
                .andExpect(jsonPath("$.categoryName").value("Gift"));
    }

    @Test
    @WithMockJwtUser
    void shouldDeleteTransaction() throws Exception {
        var transactionId = 2;

        postman.perform(get("/api/transactions/" + transactionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(transactionId));

        postman.perform(delete("/api/transactions/" + transactionId))
                .andDo(print())
                .andExpect(status().isNoContent());

        postman.perform(get("/api/transactions/" + transactionId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockJwtUser
    void shouldNotDeleteOtherUsersTransaction() throws Exception {
        postman.perform(delete("/api/transactions/3"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldGetTransactionsWithFilters() throws Exception {
        LocalDateTime startDate = LocalDateTime.parse("2024-01-01 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime endDate = LocalDateTime.parse("2024-01-31 23:59:59", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        postman.perform(get("/api/transactions")
                        .param("userId", "1")
                        .param("accountId", "1")
                        .param("startDate", startDate.toString())
                        .param("endDate", endDate.toString())
                        .param("minAmount", "100")
                        .param("maxAmount", "5000"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[?(@.amount >= 100 && @.amount <= 5000)]").exists());
    }

    @Test
    @WithMockJwtUser
    void shouldNotAccessOtherUsersTransactions() throws Exception {
        postman.perform(get("/api/transactions")
                        .param("userId", "2"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
}