"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  changePasswordAction,
  type AuthFormState,
} from "@/app/admin/actions/auth";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Increment key on close to reset useActionState on next open
  const [formKey, setFormKey] = useState(0);

  function handleOpenChange(next: boolean) {
    if (!next) setFormKey((k) => k + 1);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <ChangePasswordForm
          key={formKey}
          onClose={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(changePasswordAction, {});

  const formRef = useRef<HTMLFormElement>(null);

  // Auto-close on success
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  if (state.success) {
    return (
      <>
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground">
            <CheckCircle2 className="h-5 w-5 text-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {state.message}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <DialogTitle>Change Password</DialogTitle>
        </div>
        <DialogDescription>
          Enter your current password and choose a new one.
        </DialogDescription>
      </DialogHeader>

      <form ref={formRef} action={formAction} className="space-y-4">
        {state.message && !state.success && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            autoComplete="current-password"
            required
          />
          {state.errors?.currentPassword && (
            <p className="text-xs text-destructive">
              {state.errors.currentPassword[0]}
            </p>
          )}
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />
          {state.errors?.newPassword && (
            <p className="text-xs text-destructive">
              {state.errors.newPassword[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
          {state.errors?.confirmPassword && (
            <p className="text-xs text-destructive">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
