import { cn } from "@/lib/utils";

type Props = {
  title: string;
  label?: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  label,
  description,
  className,
  align = "left",
}: Props) {
  return (
    <div
      className={cn("mb-12", align === "center" ? "text-center" : "text-left", className)}
    >
      {label && (
        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {label}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
