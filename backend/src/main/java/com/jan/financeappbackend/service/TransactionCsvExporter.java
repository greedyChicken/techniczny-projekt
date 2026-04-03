package com.jan.financeappbackend.service;

import com.jan.financeappbackend.model.Transaction;

import java.nio.charset.StandardCharsets;
import java.util.List;

final class TransactionCsvExporter {

  private static final byte[] UTF8_BOM = new byte[] {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};

  private TransactionCsvExporter() {}

  static byte[] toCsvBytes(List<Transaction> transactions) {
    StringBuilder sb = new StringBuilder();
    sb.append("id,date,amount,description,type,categoryId,categoryName,accountId,accountName\r\n");
    for (Transaction t : transactions) {
      sb.append(t.getId() != null ? t.getId().toString() : "");
      sb.append(',');
      sb.append(csvCell(t.getDate() != null ? t.getDate().toString() : ""));
      sb.append(',');
      sb.append(t.getAmount() != null ? Double.toString(t.getAmount()) : "");
      sb.append(',');
      sb.append(csvCell(t.getDescription()));
      sb.append(',');
      sb.append(
          t.getCategory() != null && t.getCategory().getTransactionType() != null
              ? t.getCategory().getTransactionType().name()
              : "");
      sb.append(',');
      sb.append(
          t.getCategory() != null && t.getCategory().getId() != null
              ? t.getCategory().getId().toString()
              : "");
      sb.append(',');
      sb.append(csvCell(t.getCategory() != null ? t.getCategory().getName() : null));
      sb.append(',');
      sb.append(
          t.getAccount() != null && t.getAccount().getId() != null
              ? t.getAccount().getId().toString()
              : "");
      sb.append(',');
      sb.append(csvCell(t.getAccount() != null ? t.getAccount().getName() : null));
      sb.append("\r\n");
    }
    byte[] payload = sb.toString().getBytes(StandardCharsets.UTF_8);
    byte[] out = new byte[UTF8_BOM.length + payload.length];
    System.arraycopy(UTF8_BOM, 0, out, 0, UTF8_BOM.length);
    System.arraycopy(payload, 0, out, UTF8_BOM.length, payload.length);
    return out;
  }

  private static String csvCell(String value) {
    if (value == null || value.isEmpty()) {
      return "";
    }
    boolean needQuotes =
        value.indexOf(',') >= 0
            || value.indexOf('"') >= 0
            || value.indexOf('\n') >= 0
            || value.indexOf('\r') >= 0;
    String escaped = value.replace("\"", "\"\"");
    if (needQuotes) {
      return "\"" + escaped + "\"";
    }
    return escaped;
  }
}
