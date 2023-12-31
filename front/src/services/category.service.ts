import { API_ENDPOINT } from "../constants/endpoints";
import { CategoryFormData } from "../interfaces/category";
import authHeader from "./auth.header";

class CategoryService {
    async getCategories() {
        const res = await fetch(`${API_ENDPOINT}category/all`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch categories");
        }

        return await res.json();
    }

    async getCategory(id: string) {
        const res = await fetch(`${API_ENDPOINT}category/${id}`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch category");
        }

        return await res.json();
    }

    async getPrestationsByCategory(id: string) {
        const res = await fetch(`${API_ENDPOINT}category/${id}/prestations`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch prestations");
        }

        return await res.json();
    }

    async createCategory(data: CategoryFormData) {
        const res = await fetch(`${API_ENDPOINT}category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });

        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create category");
        }

        return await res.json();
    }
}

export default new CategoryService();
