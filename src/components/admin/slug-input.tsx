"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface SlugInputProps {
  isCustomSlug: boolean;
  onToggleCustom: (checked: boolean) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  isEditing?: boolean;
  tooltipText?: string;
  editWarning?: string;
  error?: string;
  disabled?: boolean;
  /** Compact mode for dialogs (no tooltip, simplified layout). */
  compact?: boolean;
}

export function SlugInput({
  isCustomSlug,
  onToggleCustom,
  slug,
  onSlugChange,
  isEditing = false,
  tooltipText = "The URL-friendly version of the name. Auto-generated unless customized.",
  editWarning = "Changing the slug will migrate images to the new URL path",
  error,
  disabled = false,
  compact = false,
}: SlugInputProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Slug</Label>
          <div className="flex items-center space-x-2">
            <Switch checked={isCustomSlug} onCheckedChange={onToggleCustom} />
            <Label className="text-sm text-muted-foreground cursor-pointer">
              Custom
            </Label>
          </div>
        </div>
        <Input
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={!isCustomSlug || disabled}
          className={!isCustomSlug ? "bg-muted cursor-not-allowed" : ""}
          placeholder="auto-generated-from-name"
        />
        {!isCustomSlug && (
          <p className="text-xs text-muted-foreground">
            Auto-generated from English name
          </p>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="slug-display" className="flex items-center gap-2">
          Slug
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>

        <div className="flex items-center space-x-2">
          <Switch
            id="custom-slug"
            checked={isCustomSlug}
            onCheckedChange={onToggleCustom}
          />
          <Label
            htmlFor="custom-slug"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Use custom slug
          </Label>
        </div>
      </div>

      <Input
        id="slug-display"
        value={slug}
        onChange={(e) => onSlugChange(e.target.value)}
        disabled={!isCustomSlug || disabled}
        className={!isCustomSlug ? "bg-muted cursor-not-allowed" : ""}
        placeholder="auto-generated-from-name"
      />

      {isEditing && isCustomSlug && (
        <p className="text-xs text-amber-600">{editWarning}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
