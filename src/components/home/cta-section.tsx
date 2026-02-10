import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const t = useTranslations("home");

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-12 text-center md:px-16 md:py-16">
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
              {t("ctaDesc")}
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8 gap-2"
            >
              <Link href="/contact">
                {t("ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
