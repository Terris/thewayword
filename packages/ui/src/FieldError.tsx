import { Text } from "./Text";

export function FieldError({
  touched,
  error,
}: {
  touched: boolean;
  error?: string;
}) {
  return touched && error ? (
    <Text className="text-destructive" size="sm">
      {error}
    </Text>
  ) : null;
}
