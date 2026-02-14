import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
        {/* Label */}
        <p className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-8 bg-primary" />
          Since 1965
        </p>

        {/* Heading */}
        <div className="relative max-w-4xl">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          {/* Red accent line */}
          <div className="mt-6 h-0.5 w-16 bg-primary" />
        </div>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/products">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2 text-primary hover:text-primary">
            <Link href="/contact">
              <Phone className="h-4 w-4" />
              {t("ctaSecondary")}
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mt-20 flex flex-wrap items-center gap-8 border-t pt-8 md:gap-12 lg:gap-16">
          <StatItem value="60+" label="Years" />
          <StatItem value="3+" label="Global Brands" />
          <StatItem value="1,000+" label="Products" />
          <StatItem value="500+" label="Clients" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
