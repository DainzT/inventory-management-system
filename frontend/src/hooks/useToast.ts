import { toast } from "react-toastify";

export const useToast = () => {
    const showLoadingToast = (toastId: string, message: string) => {
        toast.loading(message, {
            position: "bottom-right",
            toastId,
        });
    };

    
    const showSuccessToast = (toastId: string, message: string) => {
        toast.update(toastId, {
            render: message,
            type: "success",
            isLoading: false,
            autoClose: 1500,
            hideProgressBar: false,
        });
    };

    const showErrorToast = (toastId: string, message: string) => {
        toast.update(toastId, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
            hideProgressBar: false,
        });
    };

    return { showLoadingToast, showSuccessToast, showErrorToast };
}