package com.jan.financeappbackend.controller;

import com.jan.financeappbackend.dto.TransferDto;
import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.Transfer;
import com.jan.financeappbackend.request.TransferRequest;
import com.jan.financeappbackend.security.SecurityUtils;
import com.jan.financeappbackend.service.AccountService;
import com.jan.financeappbackend.service.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {
  private final TransferService transferService;
  private final AccountService accountService;
  private final ModelMapper modelMapper;
  private final SecurityUtils securityUtils;

  @PostMapping
  public ResponseEntity<TransferDto> createTransfer(@Valid @RequestBody TransferRequest request) {
    Account sourceAccount = accountService.findById(request.getSourceAccountId());
    Account targetAccount = accountService.findById(request.getTargetAccountId());

    Long sourceUserId = sourceAccount.getUser().getId();
    Long targetUserId = targetAccount.getUser().getId();

    if (!sourceUserId.equals(targetUserId)) {
      throw new AccessDeniedException("Cannot transfer between accounts of different users");
    }

    if (!securityUtils.isAuthorizedOrAdmin(sourceUserId)) {
      throw new AccessDeniedException("You are not authorized to transfer between these accounts");
    }

    Transfer transfer = transferService.createTransfer(request);
    return new ResponseEntity<>(modelMapper.map(transfer, TransferDto.class), HttpStatus.CREATED);
  }

  @GetMapping("/account/{accountId}")
  public ResponseEntity<Page<TransferDto>> getTransfersByAccount(
      @PathVariable Long accountId,
      @PageableDefault(size = 20, sort = "transferDate,desc") Pageable pageable) {

    Account account = accountService.findById(accountId);
    if (!securityUtils.isAuthorizedOrAdmin(account.getUser().getId())) {
      throw new AccessDeniedException("You are not authorized to view transfers for this account");
    }

    Page<TransferDto> transfers =
        transferService
            .findByAccountId(accountId, pageable)
            .map(transfer -> modelMapper.map(transfer, TransferDto.class));
    return ResponseEntity.ok(transfers);
  }

  @GetMapping
  public ResponseEntity<Page<TransferDto>> getTransfersByUser(
      @RequestParam Long userId,
      @PageableDefault(size = 20, sort = "transferDate,desc") Pageable pageable) {

    if (!securityUtils.isAuthorizedOrAdmin(userId)) {
      throw new AccessDeniedException("You are not authorized to view transfers for this user");
    }

    Page<TransferDto> transfers =
        transferService
            .findByUserId(userId, pageable)
            .map(transfer -> modelMapper.map(transfer, TransferDto.class));
    return ResponseEntity.ok(transfers);
  }
}
