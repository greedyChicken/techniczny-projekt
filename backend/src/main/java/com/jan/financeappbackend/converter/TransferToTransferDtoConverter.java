package com.jan.financeappbackend.converter;

import com.jan.financeappbackend.dto.TransferDto;
import com.jan.financeappbackend.model.Transfer;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class TransferToTransferDtoConverter implements Converter<Transfer, TransferDto> {

  @Override
  public TransferDto convert(MappingContext<Transfer, TransferDto> context) {
    Transfer transfer = context.getSource();

    return TransferDto.builder()
        .id(transfer.getId())
        .sourceAccountId(transfer.getSourceAccount().getId())
        .sourceAccountName(transfer.getSourceAccount().getName())
        .targetAccountId(transfer.getTargetAccount().getId())
        .targetAccountName(transfer.getTargetAccount().getName())
        .amount(transfer.getAmount())
        .description(transfer.getDescription())
        .transferDate(transfer.getTransferDate())
        .currencyCode(transfer.getCurrencyCode())
        .createdAt(transfer.getCreatedAt())
        .build();
  }
}
