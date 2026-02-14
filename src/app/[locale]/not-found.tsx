import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24">
      {/* 404 number */}
      <div className="text-[8rem] font-bold leading-none tracking-tighter text-foreground sm:text-[10rem]">
        404
      </div>
      <div className="mt-2 h-0.5 w-16 bg-primary" />

      {/* Label */}
      <p className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        {t("title")}
      </p>

      {/* Description */}
      <p className="mt-3 max-w-md text-center text-muted-foreground">
        {t("description")}
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            {t("backHome")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/products">
            {t("browseProducts")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
