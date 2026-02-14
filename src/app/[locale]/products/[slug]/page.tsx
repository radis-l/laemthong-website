import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProductBySlug, getProductsByCategory, getCategoryBySlug, getBrandBySlug } from "@/lib/db";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ArrowRight, ChevronRight, FileText } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCategoryIcon } from "@/lib/category-icons";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getPageUrl,
  getAlternateLanguages,
  getOgLocale,
  getOgAlternateLocale,
  buildProductSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo";
import type { Locale } from "@/data/types";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  const title = product.name[loc];
  const description = product.shortDescription[loc];
  const pageUrl = getPageUrl(loc, `/products/${slug}`);
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: getAlternateLanguages(`/products/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      locale: getOgLocale(loc),
      alternateLocale: getOgAlternateLocale(loc),
      type: "website",
      images: product.image?.startsWith("http") ? [{ url: product.image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image?.startsWith("http") ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "products" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, brand, allCategoryProducts] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getBrandBySlug(product.brandSlug),
    getProductsByCategory(product.categorySlug),
  ]);
  const relatedProducts = allCategoryProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildProductSchema(
          product,
          locale as Locale,
          brand ?? undefined,
          category ?? undefined,
        )}
      />
      <JsonLd
        data={buildBreadcrumbSchema(locale as Locale, [
          { name: tCommon("home"), href: "" },
          { name: t("title"), href: "/products" },
          ...(category
            ? [
                {
                  name: category.name[locale as Locale],
                  href: `/categories/${category.slug}`,
                },
              ]
            : []),
          { name: product.name[locale as Locale], href: `/products/${product.slug}` },
        ])}
      />
      {/* Breadcrumb */}
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
                  <Link href="/products">{t("title")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/categories/${category.slug}`}>
                        {category.name[locale as Locale]}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name[locale as Locale]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Product detail */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Image */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                {product.image?.startsWith("http") ? (
                  <Image
                    src={product.image}
                    alt={product.name[locale as Locale]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <PlaceholderImage
                    icon={getCategoryIcon(product.categorySlug)}
                    variant="product"
                    aspect="aspect-[4/3]"
                    className="h-full"
                  />
                )}
              </div>
              {product.gallery.filter((u) => u.startsWith("http")).length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.gallery.filter((u) => u.startsWith("http")).map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <Image
                        src={url}
                        alt={`${product.name[locale as Locale]} - ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2">
                {brand && (
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{brand.name}</p>
                )}
                {category && (
                  <Badge variant="outline">
                    {category.name[locale as Locale]}
                  </Badge>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
                {product.name[locale as Locale]}
              </h1>

              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {product.description[locale as Locale]}
              </p>

              {/* Features */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground">
                  {t("features")}
                </h3>
                <ul className="mt-3 space-y-2">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature[locale as Locale]}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href={`/contact?product=${product.slug}`}>
                    {tCommon("requestQuote")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">
                {t("specifications")}
              </h2>
              <div className="mt-4 overflow-hidden rounded-lg border">
                <Table>
                  <TableBody>
                    {product.specifications.map((spec, i) => (
                      <TableRow key={i}>
                        <TableCell className="w-1/3 font-medium text-foreground">
                          {spec.label[locale as Locale]}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {spec.value[locale as Locale]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Documents */}
          {product.documents && product.documents.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground">
                {t("documents")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading title={t("relatedProducts")} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  locale={locale as Locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
