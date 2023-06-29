import { API_ENDPOINT } from "../constants/endpoints";
import { OrderStatusEnum } from "../interfaces/order";
import authHeader from "./auth.header";

class OrderService {
    async getOrders() {
        const res = await fetch(`${API_ENDPOINT}order/self`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch orders");
        }

        return await res.json();
    }

    async getOrder(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/${id}`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch order");
        }

        return await res.json();
    }

    async getOrdersByPrestation(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/prestation/${id}`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch orders");
        }

        return await res.json();
    }

    async getOrdersByUser(id: string) {
        const res = await fetch(`${API_ENDPOINT}order/user/${id}`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch orders");
        }

        return await res.json();
    }

    async updateOrderStatus(id: string, status: OrderStatusEnum) {
        console.log("updateOrderStatus", id, status);
    }

    async refundOrder(id: string) {
        console.log("refundOrder", id);
    }
}

export default new OrderService();
