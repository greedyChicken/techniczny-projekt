package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
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

@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CategoryControllerTest {

    private final MockMvc postman;
    private final DatabaseCleaner databaseCleaner;

    @Autowired
    public CategoryControllerTest(MockMvc postman, DatabaseCleaner databaseCleaner) {
        this.postman = postman;
        this.databaseCleaner = databaseCleaner;
    }

    @AfterEach
    void tearDown() throws Exception {
        databaseCleaner.cleanUp();
    }

    @Test
    @WithMockJwtUser
    void shouldReturnCategories() throws Exception {
        postman.perform(get("/api/categories")
                        .param("userId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(16)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Salary"))
                .andExpect(jsonPath("$[0].transactionType").value("INCOME"))
                .andExpect(jsonPath("$[0].default").value(true))
                .andExpect(jsonPath("$[1].name").value("Investment"))
                .andExpect(jsonPath("$[1].transactionType").value("INCOME"))
                .andExpect(jsonPath("$[1].default").value(true));
    }

    @Test
    @WithMockJwtUser
    void shouldNotGetCategoriesForUnauthorizedUser() throws Exception {
        postman.perform(get("/api/categories")
                        .param("userId", "999"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }
}