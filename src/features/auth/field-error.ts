/** Normalize TanStack Form / Standard Schema field errors to a display string. */
export function getFieldError(errors: unknown[]): string | undefined {
  const first = errors[0];
  if (first == null) {
    return undefined;
  }
  if (typeof first === "string") {
    return first;
  }
  if (
    typeof first === "object" &&
    "message" in first &&
    typeof first.message === "string"
  ) {
    return first.message;
  }
  return undefined;
}
