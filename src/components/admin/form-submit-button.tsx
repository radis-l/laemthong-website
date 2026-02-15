import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  isPending: boolean;
  isUploading: boolean;
  isEditing: boolean;
  entityName: string;
};

export function FormSubmitButton({ isPending, isUploading, isEditing, entityName }: Props) {
  return (
    <Button type="submit" disabled={isPending || isUploading}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading image...
        </>
      ) : isEditing ? (
        `Update ${entityName}`
      ) : (
        `Create ${entityName}`
      )}
    </Button>
  );
}
