package com.jan.financeappbackend.service;

import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.AccountType;
import com.jan.financeappbackend.model.Transfer;
import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.repository.TransferRepository;
import com.jan.financeappbackend.request.TransferRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private TransferRepository transferRepository;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private TransferService transferService;

    private Transfer testTransfer;
    private TransferRequest transferRequest;
    private Account sourceAccount;
    private Account targetAccount;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

        sourceAccount = Account.builder()
                .id(1L)
                .name("Checking Account")
                .balance(1000.0)
                .accountType(AccountType.CHECKING)
                .user(testUser)
                .currencyCode("USD")
                .active(true)
                .build();

        targetAccount = Account.builder()
                .id(2L)
                .name("Savings Account")
                .balance(500.0)
                .accountType(AccountType.SAVINGS)
                .user(testUser)
                .currencyCode("USD")
                .active(true)
                .build();

        testTransfer = Transfer.builder()
                .id(1L)
                .sourceAccount(sourceAccount)
                .targetAccount(targetAccount)
                .amount(100.0)
                .description("Test transfer")
                .transferDate(LocalDateTime.now())
                .currencyCode("USD")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        transferRequest = TransferRequest.builder()
                .sourceAccountId(1L)
                .targetAccountId(2L)
                .amount(100.0)
                .date(LocalDateTime.now())
                .description("Monthly savings")
                .build();
    }

    @Test
    void createTransfer_Success() {
        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);
        when(transferRepository.save(any(Transfer.class))).thenAnswer(invocation -> {
            Transfer transfer = invocation.getArgument(0);
            transfer.setId(1L);
            return transfer;
        });

        Transfer result = transferService.createTransfer(transferRequest);

        assertNotNull(result);
        assertEquals(100.0, result.getAmount());
        assertEquals(sourceAccount, result.getSourceAccount());
        assertEquals(targetAccount, result.getTargetAccount());
        assertEquals(900.0, sourceAccount.getBalance()); // 1000 - 100
        assertEquals(600.0, targetAccount.getBalance()); // 500 + 100
        verify(transferRepository, times(1)).save(any(Transfer.class));
    }

    @Test
    void createTransfer_WithNullDescription_UsesDefault() {
        transferRequest.setDescription(null);
        
        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);
        when(transferRepository.save(any(Transfer.class))).thenAnswer(invocation -> {
            Transfer transfer = invocation.getArgument(0);
            transfer.setId(1L);
            return transfer;
        });

        Transfer result = transferService.createTransfer(transferRequest);

        assertNotNull(result);
        assertEquals("Transfer from Checking Account to Savings Account", result.getDescription());
    }

    @Test
    void createTransfer_WithNullDate_UsesCurrentTime() {
        transferRequest.setDate(null);
        
        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);
        when(transferRepository.save(any(Transfer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transfer result = transferService.createTransfer(transferRequest);

        assertNotNull(result);
        assertNotNull(result.getTransferDate());
    }

    @Test
    void createTransfer_DifferentUsers_ThrowsException() {
        User differentUser = User.builder()
                .id(2L)
                .email("other@example.com")
                .build();
        targetAccount.setUser(differentUser);

        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Cannot transfer money between accounts of different users", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void createTransfer_SameAccount_ThrowsException() {
        transferRequest.setTargetAccountId(1L); // Same as source

        when(accountService.findById(1L)).thenReturn(sourceAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Cannot transfer money to the same account", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void createTransfer_InsufficientBalance_ThrowsException() {
        transferRequest.setAmount(1500.0); // More than available balance

        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Insufficient balance in source account", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void createTransfer_InactiveSourceAccount_ThrowsException() {
        sourceAccount.setActive(false);

        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Cannot transfer money from/to inactive accounts", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void createTransfer_InactiveTargetAccount_ThrowsException() {
        targetAccount.setActive(false);

        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Cannot transfer money from/to inactive accounts", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void createTransfer_DifferentCurrencies_ThrowsException() {
        targetAccount.setCurrencyCode("EUR");

        when(accountService.findById(1L)).thenReturn(sourceAccount);
        when(accountService.findById(2L)).thenReturn(targetAccount);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> transferService.createTransfer(transferRequest));
        assertEquals("Cannot transfer money between accounts with different currencies", exception.getMessage());
        verify(transferRepository, never()).save(any());
    }

    @Test
    void findByAccountId_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transfer> expectedPage = new PageImpl<>(List.of(testTransfer));

        when(transferRepository.findByAccountId(1L, pageable)).thenReturn(expectedPage);

        Page<Transfer> result = transferService.findByAccountId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTransfer, result.getContent().get(0));
        verify(transferRepository, times(1)).findByAccountId(1L, pageable);
    }

    @Test
    void findByUserId_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transfer> expectedPage = new PageImpl<>(List.of(testTransfer));

        when(transferRepository.findByUserId(1L, pageable)).thenReturn(expectedPage);

        Page<Transfer> result = transferService.findByUserId(1L, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTransfer, result.getContent().get(0));
        verify(transferRepository, times(1)).findByUserId(1L, pageable);
    }
}