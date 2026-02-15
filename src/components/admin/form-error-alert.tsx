import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function FormErrorAlert({ message, errors }: Props) {
  if (!message && (!errors || Object.keys(errors).length === 0)) return null;

  return (
    <>
      {message && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {errors && Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the highlighted errors and try again.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
