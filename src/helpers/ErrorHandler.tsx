import axios from "axios";
import { toast } from "react-toastify";

interface APIError {
  errors?: string[] | Record<string, string[]>;
  message?: string;
  status?: number;
}

export const handleError = (error: unknown): never => {
  let errorMessage = "An unexpected error occurred";

  if (axios.isAxiosError(error)) {
    const err = error.response?.data as APIError;

    if (error.response?.status === 401) {
      errorMessage = "Unauthorized";
      toast.error(errorMessage);
      window.history.pushState({}, "LoginPage", "/login");
    }

    if (err) {
      if (Array.isArray(err.errors)) {
        err.errors.forEach((msg) => toast.error(msg));
        errorMessage = err.errors.join(", ");
      } else if (typeof err.errors === "object") {
        const messages = Object.values(err.errors).flat();
        messages.forEach((msg) => toast.error(msg));
        errorMessage = messages.join(", ");
      } else if (err.message) {
        toast.error(err.message);
        errorMessage = err.message;
      }
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
    errorMessage = error.message;
  }

  throw new Error(errorMessage);
};
