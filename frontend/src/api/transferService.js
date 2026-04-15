import apiClient from "./apiClient";

export const transferService = {
    getTransfers: async (userId, page = 0, size = 20, sort = "transferDate") => {
        const response = await apiClient.get("/transfers", {
            params: {
                userId,
                page,
                size,
                sort,
            }
        });
        return response.data;
    },

    create: async (transferRequest) => {
        const response = await apiClient.post(`/transfers`, transferRequest);
        return response.data;
    },

    update: async (id, transferRequest) => {
        const response = await apiClient.put(`/transfers/${id}`, transferRequest);
        return response.data;
    },

    deleteTransfer: async (id) => {
        await apiClient.delete(`/transfers/${id}`);
    },
};
