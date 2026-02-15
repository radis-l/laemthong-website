import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({ label, title, description, className, children }: Props) {
  return (
    <section className={cn("border-b py-16 md:py-20", className)}>
      <div className="mx-auto max-w-7xl px-6">
        {children}
        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {label}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
