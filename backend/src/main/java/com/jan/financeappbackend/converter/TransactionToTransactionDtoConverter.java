package com.jan.financeappbackend.converter;

import com.jan.financeappbackend.model.Transaction;
import com.jan.financeappbackend.dto.TransactionDto;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class TransactionToTransactionDtoConverter
    implements Converter<Transaction, TransactionDto> {
  @Override
  public TransactionDto convert(MappingContext<Transaction, TransactionDto> mappingContext) {
    Transaction transaction = mappingContext.getSource();
    return TransactionDto.builder()
        .id(transaction.getId())
        .amount(transaction.getAmount())
        .description(transaction.getDescription())
        .date(transaction.getDate())
        .type(transaction.getCategory().getTransactionType().name())
        .categoryName(transaction.getCategory().getName())
        .accountId(transaction.getAccount().getId())
        .build();
  }
}
