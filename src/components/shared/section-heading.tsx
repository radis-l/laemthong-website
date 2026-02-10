type Props = {
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  description,
  className,
  align = "center",
}: Props) {
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"} ${className ?? ""}`}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
