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

  return fallback;
};
