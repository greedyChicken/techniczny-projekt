package com.jan.financeappbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.financeappbackend.DatabaseCleaner;
import com.jan.financeappbackend.FinanceAppBackendApplication;
import com.jan.financeappbackend.dto.AccountDto;
import com.jan.financeappbackend.dto.TransferDto;
import com.jan.financeappbackend.jwt.WithMockJwtUser;
import com.jan.financeappbackend.model.AccountType;
import com.jan.financeappbackend.model.Role;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.request.AccountRequest;
import com.jan.financeappbackend.request.TransferRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Slf4j
@SpringBootTest(classes = FinanceAppBackendApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TransferControllerTest {

    private final MockMvc postman;
    private final ObjectMapper objectMapper;
    private final DatabaseCleaner databaseCleaner;

    @Autowired
    public TransferControllerTest(MockMvc postman, ObjectMapper objectMapper, DatabaseCleaner databaseCleaner) {
        this.postman = postman;
        this.objectMapper = objectMapper;
        this.databaseCleaner = databaseCleaner;
    }

    @AfterEach
    void tearDown() throws Exception {
        databaseCleaner.cleanUp();
    }

    private static RequestPostProcessor adminAuthentication() {
        User admin = new User();
        admin.setId(3L);
        admin.setEmail("admin@financeapp.com");
        admin.setRole(Role.ADMIN);
        return authentication(
                new UsernamePasswordAuthenticationToken(admin, null, admin.getAuthorities()));
    }

    @Test
    @WithMockJwtUser
    void shouldCreateTransfer() throws Exception {
        MvcResult sourceResult = postman.perform(get("/api/accounts/1"))
                .andExpect(status().isOk())
                .andReturn();
        AccountDto sourceAccount = objectMapper.readValue(sourceResult.getResponse().getContentAsString(), AccountDto.class);
        double initialSourceBalance = sourceAccount.getBalance();

        MvcResult targetResult = postman.perform(get("/api/accounts/2"))
                .andExpect(status().isOk())
                .andReturn();
        AccountDto targetAccount = objectMapper.readValue(targetResult.getResponse().getContentAsString(), AccountDto.class);
        double initialTargetBalance = targetAccount.getBalance();

        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(500.0)
                .date(LocalDateTime.now())
                .description("Monthly savings transfer")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sourceAccountId").value(1))
                .andExpect(jsonPath("$.targetAccountId").value(2))
                .andExpect(jsonPath("$.amount").value(500.0))
                .andExpect(jsonPath("$.description").value("Monthly savings transfer"))
                .andExpect(jsonPath("$.sourceAccountName").value("Main Checking"))
                .andExpect(jsonPath("$.targetAccountName").value("Emergency Savings"))
                .andExpect(jsonPath("$.currencyCode").value("USD"));

        postman.perform(get("/api/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(initialSourceBalance - 500.0));

        postman.perform(get("/api/accounts/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(initialTargetBalance + 500.0));
    }

    @Test
    @WithMockJwtUser
    void shouldNotCreateTransferBetweenDifferentUsers() throws Exception {
        AccountRequest otherUserAccountRequest = AccountRequest.builder()
                .name("Other User Account")
                .balance(3000.0)
                .accountType(AccountType.CHECKING)
                .userId(2L)
                .currencyCode("USD")
                .build();

        String otherAccountJson = objectMapper.writeValueAsString(otherUserAccountRequest);

        MvcResult result = postman.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(otherAccountJson)
                        .with(adminAuthentication()))
                .andExpect(status().isCreated())
                .andReturn();

        AccountDto otherUserAccount = objectMapper.readValue(result.getResponse().getContentAsString(), AccountDto.class);

        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(otherUserAccount.getId())
                .amount(100.0)
                .date(LocalDateTime.now())
                .description("Invalid transfer")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldGetTransfersByAccount() throws Exception {
        postman.perform(get("/api/transfers/account/1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(4)))
                .andExpect(jsonPath("$.totalElements").value(4));
    }

    @Test
    @WithMockJwtUser
    void shouldGetTransfersByUser() throws Exception {
        postman.perform(get("/api/transfers")
                        .param("userId", "1"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(4)))
                .andExpect(jsonPath("$.totalElements").value(4));
    }

    @Test
    @WithMockJwtUser
    void shouldNotGetTransfersForUnauthorizedAccount() throws Exception {
        AccountRequest otherUserAccountRequest = AccountRequest.builder()
                .name("Other User Account")
                .balance(2000.0)
                .accountType(AccountType.SAVINGS)
                .userId(2L)
                .currencyCode("USD")
                .build();

        String otherAccountJson = objectMapper.writeValueAsString(otherUserAccountRequest);

        MvcResult result = postman.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(otherAccountJson)
                        .with(adminAuthentication()))
                .andExpect(status().isCreated())
                .andReturn();

        AccountDto otherUserAccount = objectMapper.readValue(result.getResponse().getContentAsString(), AccountDto.class);

        postman.perform(get("/api/transfers/account/" + otherUserAccount.getId()))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser
    void shouldNotGetTransfersForUnauthorizedUser() throws Exception {
        postman.perform(get("/api/transfers")
                        .param("userId", "999"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockJwtUser(username = "admin@financeapp.com", role = "ADMIN", userId = 3L)
    void shouldGetTransfersForAnyUserAsAdmin() throws Exception {
        postman.perform(get("/api/transfers")
                        .param("userId", "2"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @WithMockJwtUser
    void shouldValidateTransferAmount() throws Exception {
        TransferRequest negativeAmountRequest = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(-100.0)
                .date(LocalDateTime.now())
                .description("Invalid negative transfer")
                .build();

        String negativeJson = objectMapper.writeValueAsString(negativeAmountRequest);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(negativeJson))
                .andDo(print())
                .andExpect(status().isBadRequest());

        TransferRequest zeroAmountRequest = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(0.0)
                .date(LocalDateTime.now())
                .description("Invalid zero transfer")
                .build();

        String zeroJson = objectMapper.writeValueAsString(zeroAmountRequest);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(zeroJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockJwtUser
    void shouldValidateRequiredFields() throws Exception {
        TransferRequest noSourceRequest = TransferRequest.builder()
                .targetAccountId(2L)
                .amount(100.0)
                .date(LocalDateTime.now())
                .description("No source account")
                .build();

        String noSourceJson = objectMapper.writeValueAsString(noSourceRequest);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(noSourceJson))
                .andDo(print())
                .andExpect(status().isBadRequest());

        TransferRequest noTargetRequest = TransferRequest.builder()
                .sourceAccountId(1L)
                .amount(100.0)
                .date(LocalDateTime.now())
                .description("No target account")
                .build();

        String noTargetJson = objectMapper.writeValueAsString(noTargetRequest);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(noTargetJson))
                .andDo(print())
                .andExpect(status().isBadRequest());

        TransferRequest noAmountRequest = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .date(LocalDateTime.now())
                .description("No amount")
                .build();

        String noAmountJson = objectMapper.writeValueAsString(noAmountRequest);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(noAmountJson))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockJwtUser
    void shouldGetTransfersWithPagination() throws Exception {
        for (int i = 0; i < 20; i++) {
            TransferRequest request = TransferRequest.builder()
                    .sourceAccountId(i % 2 == 0 ? 1L : 2L)
                    .targetAccountId(i % 2 == 0 ? 2L : 1L)
                    .amount(100.0 + i)
                    .date(LocalDateTime.now().minusDays(i))
                    .description("Transfer " + i)
                    .build();

            postman.perform(post("/api/transfers")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        postman.perform(get("/api/transfers")
                        .param("userId", "1")
                        .param("page", "0")
                        .param("size", "10"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements").value(24))
                .andExpect(jsonPath("$.totalPages").value(3));

        postman.perform(get("/api/transfers")
                        .param("userId", "1")
                        .param("page", "1")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)));

        postman.perform(get("/api/transfers")
                        .param("userId", "1")
                        .param("page", "2")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(4)));

        MvcResult result = postman.perform(get("/api/transfers")
                        .param("userId", "1")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sort", "transferDate,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(5)))
                .andReturn();

        String content = result.getResponse().getContentAsString();
        log.info("Pagination result: {}", content);
    }

    @Test
    @WithMockJwtUser
    void shouldNotCreateTransferToSameAccount() throws Exception {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(1L)
                .amount(100.0)
                .date(LocalDateTime.now())
                .description("Transfer to same account")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockJwtUser
    void shouldNotCreateTransferWithInsufficientBalance() throws Exception {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(999999.0)
                .date(LocalDateTime.now())
                .description("Insufficient balance transfer")
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockJwtUser
    void shouldCreateTransferWithDefaultDescription() throws Exception {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(100.0)
                .date(LocalDateTime.now())
                .build();

        String json = objectMapper.writeValueAsString(request);

        postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Transfer from Main Checking to Emergency Savings"));
    }

    @Test
    @WithMockJwtUser
    void shouldCreateTransferWithDefaultDate() throws Exception {
        TransferRequest request = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(100.0)
                .description("Test transfer")
                .build();

        String json = objectMapper.writeValueAsString(request);

        MvcResult result = postman.perform(post("/api/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.transferDate").exists())
                .andReturn();

        TransferDto transfer = objectMapper.readValue(result.getResponse().getContentAsString(), TransferDto.class);
        LocalDateTime transferDate = transfer.getTransferDate();
        assert transferDate.isAfter(LocalDateTime.now().minusMinutes(1));
    }

    @Test
    @WithMockJwtUser
    void shouldUpdateTransfer() throws Exception {
        TransferRequest create =
                TransferRequest.builder()
                        .sourceAccountId(1L)
                        .targetAccountId(2L)
                        .amount(15.0)
                        .date(LocalDateTime.now())
                        .description("before update")
                        .build();

        MvcResult created =
                postman.perform(post("/api/transfers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(create)))
                        .andExpect(status().isCreated())
                        .andReturn();

        TransferDto createdDto =
                objectMapper.readValue(
                        created.getResponse().getContentAsString(), TransferDto.class);

        TransferRequest update =
                TransferRequest.builder()
                        .sourceAccountId(1L)
                        .targetAccountId(2L)
                        .amount(42.0)
                        .date(LocalDateTime.now())
                        .description("after update")
                        .build();

        postman.perform(
                        put("/api/transfers/" + createdDto.getId())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(update)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdDto.getId().intValue()))
                .andExpect(jsonPath("$.amount").value(42.0))
                .andExpect(jsonPath("$.description").value("after update"));
    }

    @Test
    @WithMockJwtUser
    void shouldDeleteTransfer() throws Exception {
        TransferRequest create =
                TransferRequest.builder()
                        .sourceAccountId(1L)
                        .targetAccountId(2L)
                        .amount(7.0)
                        .date(LocalDateTime.now())
                        .description("to delete")
                        .build();

        MvcResult created =
                postman.perform(post("/api/transfers")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(create)))
                        .andExpect(status().isCreated())
                        .andReturn();

        TransferDto createdDto =
                objectMapper.readValue(
                        created.getResponse().getContentAsString(), TransferDto.class);

        postman.perform(delete("/api/transfers/" + createdDto.getId()))
                .andExpect(status().isNoContent());
    }
}