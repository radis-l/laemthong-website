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
  return (
    <section className={cn("relative border-b py-16 md:py-20", className)}>
      <HeroBackground backgroundImage={backgroundImage} variant="page" />
      <div className="relative mx-auto max-w-7xl px-6">
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
