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

  const duplicated = [...brands, ...brands];

  return (
    <section className="border-y py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("ourBrands")}
          </p>
        </AnimateOnScroll>
      </div>

      <div className="relative mt-10 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24"
          aria-hidden="true"
        />

        <div className="animate-marquee flex w-max gap-12 md:gap-16">
          {duplicated.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={{ pathname: "/products", query: { brand: brand.slug } }}
              className="group flex shrink-0 flex-col items-center gap-3"
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
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <AnimateOnScroll delay={200}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {t("ourBrandsDesc")}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
