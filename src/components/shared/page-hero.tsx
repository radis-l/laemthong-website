import { cn } from "@/lib/utils";
import { HeroBackground } from "@/components/shared/hero-background";

type Props = {
  label: string;
  title: string;
  description?: string;
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({ label, title, description, backgroundImage, className, children }: Props) {
  const hasImage = !!backgroundImage;

  return (
    <section
      className={cn(
        "relative border-b py-16 md:py-20",
        hasImage ? "bg-foreground border-white/10" : "",
        className
      )}
    >
      <HeroBackground backgroundImage={backgroundImage} variant="page" />
      <div className="relative mx-auto max-w-7xl px-6">
        {children}
        <p
          className={cn(
            "mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]",
            hasImage ? "text-white/60" : "text-muted-foreground"
          )}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {label}
        </p>
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight md:text-5xl",
            hasImage ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-lg",
              hasImage ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
