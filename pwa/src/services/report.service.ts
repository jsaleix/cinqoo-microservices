import { API_ENDPOINT } from "../constants/endpoints";
import {
    Report,
    ReportReason,
    ReportReasonEnum,
    ReportReasonFormData,
    ReportReasonType,
} from "../interfaces/report";
import authHeader from "./auth.header";

interface GetOneReportReason extends ReportReason {
    reports: Report[];
}

class ReportService {
    async getServiceReasons() {
        const res = await fetch(`${API_ENDPOINT}report/reason/service`, {
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
            throw new Error("Failed to fetch report reasons");
        }

        return await res.json();
    }

    async getUserReasons() {
        const res = await fetch(`${API_ENDPOINT}report/reason/user`, {
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
            throw new Error("Failed to fetch report reasons");
        }

        return await res.json();
    }

    async reportEntity(
        target: string,
        reportReason: string,
        description: string
    ) {
        const res = await fetch(`${API_ENDPOINT}report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ target, reportReason, description }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed report entity");
        }
        return await res.json();
    }

    async reportUser(
        target: string,
        reportReason: string,
        description: string
    ) {
        const res = await fetch(`${API_ENDPOINT}report/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ target, reportReason, description }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed report user");
        }
        return await res.json();
    }

    async reportPrestation(
        target: string,
        reportReason: string,
        description: string
    ) {
        const res = await fetch(`${API_ENDPOINT}report/service`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ target, reportReason, description }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed report user");
        }
        return await res.json();
    }

    async getReportsForPrestation(prestationId: string) {
        const res = await fetch(
            `${API_ENDPOINT}report/service/${prestationId}`,
            {
                method: "GET",
                headers: {
                    ...authHeader(),
                },
            }
        );
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to fetch reports");
        }

        return await res.json();
    }

    async getReportReason(id: string): Promise<GetOneReportReason> {
        const res = await fetch(`${API_ENDPOINT}report/reason/${id}`, {
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
            throw new Error("Failed to fetch report reason");
        }

        return await res.json();
    }

    async getReportsForUser(userId: string) {
        const res = await fetch(`${API_ENDPOINT}report/user/${userId}`, {
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
            throw new Error("Failed to fetch reports");
        }

        return await res.json();
    }

    async createReportReason(
        type: ReportReasonType,
        data: ReportReasonFormData
    ) {
        const url =
            type === ReportReasonEnum.USER ? "reasonUser" : "reasonService";

        const res = await fetch(`${API_ENDPOINT}report/${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            throw new Error(JSON.stringify(jsonRes.message));
        }

        return await res.json();
    }
}

export default new ReportService();
