import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Zap } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-muted via-background to-background">
      {/* Decorative background pattern */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-bg-pattern"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0L20 20M-5 15L15 -5M5 25L25 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-muted-foreground/[0.04]"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-bg-pattern)" />
      </svg>

      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text column */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              60+ Years of Excellence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="gap-2 px-8 shadow-md">
                <Link href="/products">
                  {t("cta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/contact">
                  <Phone className="h-4 w-4" />
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image column */}
          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-2xl border shadow-xl">
              <PlaceholderImage
                variant="hero"
                icon={Zap}
                aspect="aspect-[4/3]"
              />
            </div>
            {/* Decorative accent bars */}
            <div className="absolute -bottom-3 -left-3 h-24 w-1.5 rounded-full bg-primary" />
            <div className="absolute -bottom-3 -left-3 h-1.5 w-24 rounded-full bg-primary" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          <StatCard value="60+" label="Years" />
          <StatCard value="3+" label="Global Brands" />
          <StatCard value="1000+" label="Products" />
          <StatCard value="500+" label="Clients" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-l-4 border-l-primary bg-card p-8 text-center shadow-sm">
      <div className="text-3xl font-extrabold text-primary md:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
