package com.jan.financeappbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
import com.jan.financeappbackend.request.BudgetRequest;
import com.jan.financeappbackend.service.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Slf4j
@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BudgetControllerTest {

    private final MockMvc postman;
    private final ObjectMapper objectMapper;
    private final DatabaseCleaner databaseCleaner;
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    public BudgetControllerTest(MockMvc postman, ObjectMapper objectMapper, DatabaseCleaner databaseCleaner) {
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
    void shouldGetBudgetsByUserId() throws Exception {
        postman.perform(get("/api/budgets")
                        .param("userId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.pageable").exists())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].name").value("Monthly Food Budget"))
                .andExpect(jsonPath("$.content[0].amount").value(600.00))
                .andExpect(jsonPath("$.content[0].spentAmount").value(245.75))
                .andExpect(jsonPath("$.content[1].name").value("Shopping Budget"))
                .andExpect(jsonPath("$.content[1].amount").value(800.00))
                .andExpect(jsonPath("$.content[1].spentAmount").value(320.25));
    }

    @Test
    @WithMockJwtUser
    void shouldNotGetBudgetsForUnauthorizedUser() throws Exception {
        postman.perform(get("/api/budgets")
                        .param("userId", "999"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldGetBudgetById() throws Exception {
        postman.perform(get("/api/budgets/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Monthly Food Budget"))
                .andExpect(jsonPath("$.amount").value(600.00))
                .andExpect(jsonPath("$.spentAmount").value(245.75))
                .andExpect(jsonPath("$.remainingAmount").value(354.25)) // 600.00 - 245.75
                .andExpect(jsonPath("$.exceeded").value(false))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockJwtUser
    void shouldCreateBudget() throws Exception {
        List<Long> categoryIds = Arrays.asList(1L, 2L, 3L);

        BudgetRequest request = BudgetRequest.builder()
                .name("Monthly Grocery Budget")
                .amount(500.0)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .userId(1L)
                .categoryIds(categoryIds)
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Monthly Grocery Budget"))
                .andExpect(jsonPath("$.amount").value(500.0))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.spentAmount").value(0.0))
                .andExpect(jsonPath("$.categoryIds", hasSize(3)));
    }

    @Test
    @WithMockJwtUser
    void shouldCreateBudgetForAllCategories() throws Exception {
        BudgetRequest request = BudgetRequest.builder()
                .name("Total Monthly Budget")
                .amount(2000.0)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .userId(1L)
                .categoryIds(List.of())
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Total Monthly Budget"))
                .andExpect(jsonPath("$.amount").value(2000.0))
                .andExpect(jsonPath("$.allCategories").value(true));
    }

    @Test
    @WithMockJwtUser
    void shouldUpdateBudget() throws Exception {
        // Use existing budget with ID 1 (Monthly Food Budget)
        Long budgetId = 1L;

        // Update the budget
        BudgetRequest updateRequest = BudgetRequest.builder()
                .name("Updated Food Budget Name")
                .amount(800.0)  // Updated from 600.0
                .startDate(LocalDateTime.of(2024, 9, 1, 0, 0, 0))
                .endDate(LocalDateTime.of(2024, 9, 30, 23, 59, 59))
                .userId(1L)
                .categoryIds(Arrays.asList(1L, 2L, 3L))
                .build();

        String updateJson = objectMapper.writeValueAsString(updateRequest);

        postman.perform(put("/api/budgets/" + budgetId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(budgetId))
                .andExpect(jsonPath("$.name").value("Updated Food Budget Name"))
                .andExpect(jsonPath("$.amount").value(800.0))
                .andExpect(jsonPath("$.categoryIds", hasSize(3)));

        // Verify the update
        postman.perform(get("/api/budgets/" + budgetId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Food Budget Name"))
                .andExpect(jsonPath("$.amount").value(800.0));
    }

    @Test
    @WithMockJwtUser
    void shouldDeleteBudget() throws Exception {
        Long budgetId = 4L;

        postman.perform(get("/api/budgets/" + budgetId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(budgetId))
                .andExpect(jsonPath("$.name").value("Shopping Budget"));

        postman.perform(delete("/api/budgets/" + budgetId))
                .andDo(print())
                .andExpect(status().isNoContent());

        log.info("Budget deleted successfully");

        postman.perform(get("/api/budgets/" + budgetId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockJwtUser
    void shouldNotCreateBudgetForOtherUser() throws Exception {
        BudgetRequest request = BudgetRequest.builder()
                .name("Unauthorized Budget")
                .amount(1000.0)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(1))
                .userId(999L) // Different user ID
                .categoryIds(List.of())
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/budgets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldGetBudgetsWithPagination() throws Exception {
        // Create additional budgets only for testing pagination since we only have 5 total in test data
        // and need more to properly test pagination
        for (int i = 0; i < 20; i++) {
            BudgetRequest request = BudgetRequest.builder()
                    .name("Pagination Test Budget " + i)
                    .amount(100.0 * (i + 1))
                    .startDate(LocalDateTime.now())
                    .endDate(LocalDateTime.now().plusMonths(1))
                    .userId(1L)
                    .categoryIds(List.of())
                    .build();

            postman.perform(post("/api/budgets")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        postman.perform(get("/api/budgets")
                        .param("userId", "1")
                        .param("page", "0")
                        .param("size", "10"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements").value(22))
                .andExpect(jsonPath("$.totalPages").value(3));

        // Get second page
        postman.perform(get("/api/budgets")
                        .param("userId", "1")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)));
    }

    @Test
    @WithMockJwtUser
    void shouldCalculateBudgetUsageCorrectly() throws Exception {
        // Use existing budget with ID 1 (Monthly Food Budget)
        // This budget has: amount=600.00, spentAmount=245.75
        Long budgetId = 1L;

        postman.perform(get("/api/budgets/" + budgetId))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(budgetId))
                .andExpect(jsonPath("$.amount").value(600.0))
                .andExpect(jsonPath("$.spentAmount").value(245.75))
                .andExpect(jsonPath("$.remainingAmount").value(354.25)) // 600.0 - 245.75
                .andExpect(jsonPath("$.usagePercentage").value(closeTo(40.96, 0.1))) // (245.75/600.0)*100
                .andExpect(jsonPath("$.exceeded").value(false))
                .andExpect(jsonPath("$.active").value(true));
    }
}