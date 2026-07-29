export type ApiErrorData = Record<string, unknown> & {
  errors?: {
    field?: string;
    message?: string;
  }[];
};

export const getErrorText = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === "string");
  }

  return typeof value === "string" ? value : undefined;
};

export const getApiErrorData = (error: unknown): ApiErrorData => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return {};
  }

  const data = (error as { data?: unknown }).data;

  if (data && typeof data === "object") {
    return data as ApiErrorData;
  }

  return typeof data === "string" ? { message: data } : {};
};

/**
 * Distinguishes a transport failure from a rejected request.
 *
 * RTK Query reports "the server never answered" and "the server said no" the
 * same way to a caller that only reads `data` — and a transport failure has no
 * `data` at all, so it lands on the generic fallback. That is how prototype V1
 * showed "Sign-up failed. Try again." for what was actually a dropped request:
 * indistinguishable from a real validation error, and undebuggable from a bug
 * report. These messages name the failure instead.
 */
const transportMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;

  if (status === "FETCH_ERROR") {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (status === "PARSING_ERROR") {
    return "The server sent an unreadable response. Please try again.";
  }
  if (status === "TIMEOUT_ERROR") {
    return "The server took too long to respond. Please try again.";
  }
  if (typeof status === "number" && status >= 500) {
    return "Something went wrong on our side. Please try again in a moment.";
  }

  return undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
  preferredFields: string[] = [],
): string => {
  const errorData = getApiErrorData(error);
  const fields = [
    ...preferredFields,
    "email",
    "non_field_errors",
    "detail",
    "error",
    "message",
    "name",
    "password",
    "password_confirm",
    "first_name",
    "last_name",
  ];

  for (const field of [...new Set(fields)]) {
    const message = getErrorText(errorData[field]);

    if (message) {
      return message;
    }
  }

  const structuredMessage = errorData.errors?.find(
    (item) => typeof item.message === "string",
  )?.message;

  if (structuredMessage) {
    return structuredMessage;
  }

  for (const value of Object.values(errorData)) {
    const message = getErrorText(value);

    if (message) {
      return message;
    }
  }

  // Checked last, so a server-supplied message always wins — this only fires
  // when the response carried nothing usable.
  return transportMessage(error) ?? fallback;
};
