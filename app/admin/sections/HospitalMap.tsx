"use client";

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  height?: number;
};

/** Parse + validate coordinate strings. Returns null when out of range. */
export function parseCoord(
  value: string,
  kind: "lat" | "lng"
): number | null {
  const n = parseFloat(value.trim());
  if (!Number.isFinite(n)) return null;
  if (kind === "lat" && (n < -90 || n > 90)) return null;
  if (kind === "lng" && (n < -180 || n > 180)) return null;
  return n;
}

export function isValidCoord(
  lat: number | null | undefined,
  lng: number | null | undefined
): boolean {
  return (
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lng === "number" &&
    Number.isFinite(lng) &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Free map preview via OpenStreetMap embed — no API key needed.
 * Bbox delta ~0.012 gives a street-level zoom.
 */
export function HospitalMap({ latitude, longitude, label, height = 180 }: Props) {
  const delta = 0.012;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik` +
    `&marker=${latitude},${longitude}`;

  return (
    <div
      className="overflow-hidden rounded-[14px] border border-[#E5EDE8] bg-[#F4F7F5]"
      style={{ height }}
    >
      <iframe
        title={label ? `Map of ${label}` : "Hospital location map"}
        src={src}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

export function mapLinks(lat: number, lng: number) {
  const query = `${lat},${lng}`;
  return {
    googleSearch: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
    osm: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
  };
}
