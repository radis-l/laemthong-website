import { cn } from "@/lib/utils";

type Props = {
  title: string;
  label?: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
};

export function SectionHeading({
  title,
  label,
  description,
  className,
  align = "left",
  variant = "light",
}: Props) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn("mb-12", align === "center" ? "text-center" : "text-left", className)}
    >
      {label && (
        <p className={cn(
          "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]",
          isDark ? "text-background/50" : "text-muted-foreground",
        )}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {label}
        </p>
      )}
      <h2 className={cn(
        "text-3xl font-bold tracking-tight lg:text-4xl",
        isDark ? "text-background" : "text-foreground",
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          "mt-3 max-w-2xl text-lg leading-relaxed",
          isDark ? "text-background/70" : "text-muted-foreground",
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
