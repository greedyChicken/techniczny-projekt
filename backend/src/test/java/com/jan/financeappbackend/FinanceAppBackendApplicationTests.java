package com.jan.financeappbackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = FinanceAppBackendApplication.class)
@ActiveProfiles("test")
class FinanceAppBackendApplicationTests {

  @Test
  void contextLoads() {}
}
