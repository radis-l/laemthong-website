import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "default" | "light";
  imageUrl?: string | null;
};

export function Logo({ className, variant = "default", imageUrl }: Props) {
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const subTextColor = variant === "light" ? "text-white/60" : "text-muted-foreground";

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Laemthong Syndicate"
          width={40}
          height={40}
          className="h-10 w-10 rounded-md object-contain"
          sizes="40px"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-primary-foreground"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      )}
      <div className="flex flex-col">
        <span className={cn("text-base font-bold leading-tight tracking-tight", textColor)}>
          LAEMTHONG
        </span>
        <span className={cn("text-xs font-medium uppercase tracking-widest", subTextColor)}>
          Syndicate
        </span>
      </div>
    </Link>
  );
}
