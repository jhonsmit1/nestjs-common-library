import { AppError } from "../base/app.error";
import { InternalServerError } from "../http/http.errors";

export function handleRepositoryError(
  error: unknown,
  message: string
): never {
  if (error instanceof AppError) {
    throw error;
  }

  throw new InternalServerError(message, {
    originalError: error instanceof Error ? error.message : String(error),
  });
}
