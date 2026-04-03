import apiClient from "./apiClient";

function parseFilenameFromContentDisposition(header) {
  if (!header || typeof header !== "string") return null;
  const utf8Match = /filename\*=UTF-8''([^;\n]+)/i.exec(header);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1].trim());
    } catch {
      return utf8Match[1].replace(/"/g, "").trim();
    }
  }
  const asciiMatch = /filename="([^"]+)"/i.exec(header);
  if (asciiMatch) return asciiMatch[1].trim();
  const looseMatch = /filename=([^;\n]+)/i.exec(header);
  return looseMatch ? looseMatch[1].replace(/"/g, "").trim() : null;
}

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await apiClient.get("/transactions", { params });
    return response.data;
  },

  exportTransactionsCsv: async (filterParams = {}) => {
    const params = { ...filterParams };
    delete params.page;
    delete params.size;
    delete params.sort;

    const response = await apiClient.get("/transactions/export", {
      params,
      responseType: "blob",
    });

    const contentType = response.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      const text = await response.data.text();
      let message = "Export failed.";
      try {
        const body = JSON.parse(text);
        message = body.message || body.error || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const filename =
      parseFilenameFromContentDisposition(
        response.headers["content-disposition"]
      ) || "transactions.csv";

    return { blob: response.data, filename };
  },

  createTransaction: async (transactionData) => {
    const response = await apiClient.post("/transactions", transactionData);
    return response.data;
  },

  updateTransaction: async (transactionId, transactionData) => {
    const response = await apiClient.put(
      `/transactions/${transactionId}`,
      transactionData
    );
    return response.data;
  },

  deleteTransaction: async (transactionId) => {
    await apiClient.delete(`/transactions/${transactionId}`);
    return true;
  },
};
