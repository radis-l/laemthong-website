"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  setupPasswordAction,
  type AuthFormState,
} from "@/app/admin/actions/auth";
import { Loader2 } from "lucide-react";

export function SetupPasswordForm() {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(setupPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="new-password"
          required
        />
        {state.errors?.password && (
          <p className="text-xs text-destructive">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          required
        />
        {state.errors?.confirmPassword && (
          <p className="text-xs text-destructive">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="accent"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting password...
          </>
        ) : (
          "Set Password"
        )}
      </Button>
    </form>
  );
}
