import { API_ENDPOINT } from "../constants/endpoints";
import { QuestionAdmin } from "../interfaces/quiz";
import authHeader from "./auth.header";

class QuizService {
    async getAllQuiz() {
        const res = await fetch(`${API_ENDPOINT}quiz`, {
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
            throw new Error("Failed to fetch quizzes");
        }

        return await res.json();
    }

    async getQuiz(id: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/${id}`, {
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
            throw new Error("Failed to fetch quiz");
        }

        return await res.json();
    }

    async getFullQuiz(id: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/${id}/full`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to fetch quiz");
        }

        return await res.json();
    }

    async create(name: string, duration: number, description?: string) {
        const res = await fetch(`${API_ENDPOINT}quiz`, {
            method: "POST",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                duration,
                description,
            }),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create quiz");
        }
        return await res.json();
    }

    async update(
        id: string,
        newData: { name: string; duration: number; description?: string }
    ) {
        const res = await fetch(`${API_ENDPOINT}quiz/${id}`, {
            method: "PUT",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to update quiz");
        }
        return await res.json();
    }

    async deleteQuiz(id: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
        });
        const status = res.status;

        if (status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to delete quiz");
        }
        return true;
    }

    // QUESTIONS

    async createQuestion(quizId: string, question: QuestionAdmin) {
        const res = await fetch(`${API_ENDPOINT}quiz/${quizId}/question`, {
            method: "POST",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        if (res.status !== 201) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to create question");
        }
        return await res.json();
    }

    async updateQuestion(id: string, question: QuestionAdmin) {
        const res = await fetch(`${API_ENDPOINT}quiz/questions/${id}`, {
            method: "PUT",
            headers: {
                ...authHeader(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(question),
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(JSON.stringify(jsonRes.message));
            }
            throw new Error("Failed to update question");
        }
        return await res.json();
    }

    async deleteQuestion(id: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/questions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
        });
        const status = res.status;

        if (status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to delete question");
        }
        return true;
    }

    // RESULTS

    async getSelfSuccesses() {
        const res = await fetch(`${API_ENDPOINT}quiz/results/success/self`, {
            method: "GET",
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to fetch results");
        }

        return await res.json();
    }

    async getUserSuccesses(userId: string) {
        const res = await fetch(
            `${API_ENDPOINT}quiz/results/success/${userId}`,
            {
                method: "GET",
            }
        );
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to fetch results");
        }

        return await res.json();
    }

    async getSelfResults() {
        const res = await fetch(`${API_ENDPOINT}quiz/results`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to fetch results");
        }

        return await res.json();
    }

    async getSelfResultsOnQuiz(quizId: string) {
        const res = await fetch(`${API_ENDPOINT}quiz/results/quiz/${quizId}`, {
            method: "GET",
            headers: {
                ...authHeader(),
            },
        });
        if (res.status !== 200) {
            const jsonRes = await res.json();
            if (jsonRes.message) {
                throw new Error(jsonRes.message);
            }
            throw new Error("Failed to fetch results");
        }

        return await res.json();
    }
}

export default new QuizService();
