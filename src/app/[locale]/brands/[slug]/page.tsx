import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getBrandBySlug, getAllBrandSlugs, getProductsByBrand } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildBreadcrumbSchema,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found" };
  const t = await getTranslations({ locale, namespace: "brands" });
  const title = `${brand.name} - ${t("productsFrom")} ${brand.name}`;
  const description = brand.description[loc];
  const pageUrl = getPageUrl(loc, `/brands/${slug}`);
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages(`/brands/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: getOgLocale(loc),
      alternateLocale: getOgAlternateLocale(loc),
      type: "website",
      images: brand.logo ? [{ url: brand.logo, alt: brand.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBrandSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BrandDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "brands" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const products = await getProductsByBrand(slug);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema(locale as Locale, [
          { name: tCommon("home"), href: "" },
          { name: t("title"), href: "/brands" },
          { name: brand.name, href: `/brands/${brand.slug}` },
        ])}
      />
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{tCommon("home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/brands">{t("title")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{brand.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {brand.logo && (
            <div className="mb-4">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={60}
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {brand.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{brand.country}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {brand.description[locale as Locale]}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            {t("productsFrom")} {brand.name} ({products.length})
          </h2>
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  locale={locale as Locale}
                />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No products found.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
