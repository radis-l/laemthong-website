type Props = {
  mapUrl?: string;
  coordinates?: { lat: number; lng: number };
  title?: string;
};

export function GoogleMap({ mapUrl, coordinates, title }: Props) {
  const embedUrl =
    mapUrl ||
    (coordinates
      ? `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`
      : null);

  if (!embedUrl) return null;

  return (
    <div className="overflow-hidden rounded-lg border bg-muted">
      <iframe
        src={embedUrl}
        title={title ?? "Location"}
        className="h-64 w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
