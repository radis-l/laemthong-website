import { Link } from "@/i18n/navigation";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
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
      <div className="flex flex-col">
        <span className="text-base font-bold leading-tight tracking-tight text-foreground">
          LAEMTHONG
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Syndicate
        </span>
      </div>
    </Link>
  );
}
