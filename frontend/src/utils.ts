import { ApiError } from "@/client";

function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | undefined)?.detail;

    if (Array.isArray(detail) && detail.length > 0) {
      const firstError = detail[0] as { msg?: string };
      if (firstError?.msg) {
        return firstError.msg;
      }
    }

    if (typeof detail === "string" && detail.length > 0) {
      return detail;
    }

    if (typeof err.message === "string" && err.message.length > 0) {
      return err.message;
    }
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Something went wrong.";
}

export const handleError = function (this: (msg: string) => void, err: unknown) {
  this(extractErrorMessage(err));
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
