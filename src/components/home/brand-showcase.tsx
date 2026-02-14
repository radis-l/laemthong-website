import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";
import type { Brand } from "@/data/types";

type Props = {
  brands: Brand[];
};

export function BrandShowcase({ brands }: Props) {
  const t = useTranslations("home");

  return (
    <section className="border-y py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("ourBrands")}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative flex h-16 w-24 items-center justify-center grayscale-hover md:h-20 md:w-32">
                  {brand.logo?.startsWith("http") ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="128px"
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                      {brand.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {t("ourBrandsDesc")}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
