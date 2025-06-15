package com.jan.financeappbackend.converter;

import com.jan.financeappbackend.dto.AccountDto;
import com.jan.financeappbackend.model.Account;
import com.jan.financeappbackend.model.Transaction;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Component;

@Component
public class AccountToAccountDtoConverter implements Converter<Account, AccountDto> {
  @Override
  public AccountDto convert(MappingContext<Account, AccountDto> mappingContext) {
    Account account = mappingContext.getSource();
    return AccountDto.builder()
        .id(account.getId())
        .name(account.getName())
        .balance(account.getBalance())
        .active(account.isActive())
        .accountType(account.getAccountType().name())
        .userId(account.getUser().getId())
        .currencyCode(account.getCurrencyCode())
        .transactionsIds(account.getTransactions().stream().map(Transaction::getId).toList())
        .build();
  }
}
