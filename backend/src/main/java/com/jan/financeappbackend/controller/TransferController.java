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
import org.springframework.data.domain.Sort;
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

    securityUtils.requireAuthorizedOrAdmin(
        sourceUserId, "You are not authorized to transfer between these accounts");

    Transfer transfer = transferService.createTransfer(request);
    return new ResponseEntity<>(modelMapper.map(transfer, TransferDto.class), HttpStatus.CREATED);
  }

  @GetMapping("/account/{accountId}")
  public ResponseEntity<Page<TransferDto>> getTransfersByAccount(
      @PathVariable Long accountId,
      @PageableDefault(
          size = 20,
          sort = "transferDate",
          direction = Sort.Direction.DESC)
      Pageable pageable) {

    Account account = accountService.findById(accountId);
    securityUtils.requireAuthorizedOrAdmin(
        account.getUser().getId(), "You are not authorized to view transfers for this account");

    Page<TransferDto> transfers =
        transferService
            .findByAccountId(accountId, pageable)
            .map(transfer -> modelMapper.map(transfer, TransferDto.class));
    return ResponseEntity.ok(transfers);
  }

  @GetMapping
  public ResponseEntity<Page<TransferDto>> getTransfersByUser(
      @RequestParam Long userId,
      @PageableDefault(size = 20, sort = "transferDate") Pageable pageable) {

    securityUtils.requireAuthorizedOrAdmin(
        userId, "You are not authorized to view transfers for this user");

    Page<TransferDto> transfers =
        transferService
            .findByUserId(userId, pageable)
            .map(transfer -> modelMapper.map(transfer, TransferDto.class));
    return ResponseEntity.ok(transfers);
  }

  @PutMapping("/{id}")
  public ResponseEntity<TransferDto> updateTransfer(
      @PathVariable Long id, @Valid @RequestBody TransferRequest request) {
    Transfer existing = transferService.findById(id);
    Long ownerId = existing.getSourceAccount().getUser().getId();
    securityUtils.requireAuthorizedOrAdmin(
        ownerId, "You are not authorized to update this transfer");

    Account newSource = accountService.findById(request.getSourceAccountId());
    Account newTarget = accountService.findById(request.getTargetAccountId());
    if (!newSource.getUser().getId().equals(newTarget.getUser().getId())) {
      throw new AccessDeniedException("Cannot transfer between accounts of different users");
    }
    if (!ownerId.equals(newSource.getUser().getId())) {
      throw new AccessDeniedException(
          "You are not authorized to move this transfer to these accounts");
    }

    Transfer updated = transferService.updateTransfer(id, request);
    return ResponseEntity.ok(modelMapper.map(updated, TransferDto.class));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteTransfer(@PathVariable Long id) {
    Transfer transfer = transferService.findById(id);
    securityUtils.requireAuthorizedOrAdmin(
        transfer.getSourceAccount().getUser().getId(),
        "You are not authorized to delete this transfer");
    transferService.deleteTransfer(id);
    return ResponseEntity.noContent().build();
  }
}
