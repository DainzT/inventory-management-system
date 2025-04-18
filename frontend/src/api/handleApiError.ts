import { AxiosError } from "axios";

interface ApiErrorResponse {
    error?: string;
    message?: string;
}

export const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
        // Client Side Error or Server Side Error
        // HTTP STATUS 400-499 (4xx: Client error),  HTTP STATUS 500-599 (5xx: Server error)
        
        const errorMessage =
            axiosError.response.data?.message ||
            axiosError.response.data?.error ||
            `Request failed with status ${axiosError.response.status}`;
        console.error("API Error:", errorMessage);
        throw new Error(errorMessage);

    } else if (axiosError.request) {
        // Server Side Error
        // Request sent but server did not respond.
        console.error("No response received from server");
        throw new Error("No response received from server");

    } else {
        // The request was never sent due to incorrect setup (e.g., invalid URL, request aborted)
        console.error("Request setup error:", axiosError.message);
        throw new Error(`Request setup error: ${axiosError.message}`);
    }
}