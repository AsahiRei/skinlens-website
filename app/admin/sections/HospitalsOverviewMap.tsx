"use client";

import { useEffect, useRef } from "react";
import type { Clinic } from "@/lib/admin-types";
import { isValidCoord } from "./HospitalMap";
import { Panel } from "../ui";

const LEAFLET_CSS =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

/**
 * Single overview map showing ALL hospitals with pins.
 * Rendered BEFORE the hospital cards. Free OSM tiles via Leaflet, no API key.
 */
export function HospitalsOverviewMap({ clinics }: { clinics: Clinic[] }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  const pinned = clinics.filter((c) =>
    isValidCoord(c.latitude, c.longitude)
  );

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    async function init() {
      if (!divRef.current || mapRef.current) return;
      const L = await import("leaflet");

      if (cancelled || !divRef.current) return;

      const fallback: [number, number] = [14.5995, 120.9842]; // Manila
      const first =
        pinned.length > 0
          ? [pinned[0].latitude as number, pinned[0].longitude as number] as [number, number]
          : fallback;

      map = L.map(divRef.current).setView(first, 11);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (pinned.length === 0) return;

      const bounds = L.latLngBounds([]);
      for (const c of pinned) {
        const lat = c.latitude as number;
        const lng = c.longitude as number;
        const marker = L.circleMarker([lat, lng], {
          radius: 9,
          color: c.isActive ? "#15803D" : "#9CA3AF",
          weight: 2,
          fillColor: c.isActive ? "#15803D" : "#9CA3AF",
          fillOpacity: 0.85,
        }).addTo(map);
        marker.bindPopup(
          `<strong>${escapeHtml(c.name)}</strong><br/>${escapeHtml(c.address || "No address")}<br/>` +
            `<a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`
        );
        bounds.extend([lat, lng]);
      }

      if (pinned.length === 1) {
        map.setView(bounds.getCenter(), 14);
      } else {
        map.fitBounds(bounds.pad(0.25));
      }
      setTimeout(() => map?.invalidateSize(), 100);
    }

    init();

    return () => {
      cancelled = true;
      // Keep the map instance across re-renders; destroy only on unmount.
      // (Markers rebuild is handled by keying on clinic coords below.)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild markers when the clinic list / coords change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled) return;
      // Remove old overlay layers (keep tile layer).
      map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      if (pinned.length === 0) return;
      const bounds = L.latLngBounds([]);
      for (const c of pinned) {
        const lat = c.latitude as number;
        const lng = c.longitude as number;
        const marker = L.circleMarker([lat, lng], {
          radius: 9,
          color: c.isActive ? "#15803D" : "#9CA3AF",
          weight: 2,
          fillColor: c.isActive ? "#15803D" : "#9CA3AF",
          fillOpacity: 0.85,
        }).addTo(map);
        marker.bindPopup(
          `<strong>${escapeHtml(c.name)}</strong><br/>${escapeHtml(c.address || "No address")}<br/>` +
            `<a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`
        );
        bounds.extend([lat, lng]);
      }
      if (pinned.length === 1) {
        map.setView(bounds.getCenter(), 14);
      } else {
        map.fitBounds(bounds.pad(0.25));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinics.map((c) => `${c.id}:${c.latitude},${c.longitude}:${c.isActive}`).join("|")]);

  // Destroy map on unmount.
  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <Panel className="mb-4 sm:mb-6">
      <link rel="stylesheet" href={LEAFLET_CSS} />
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="font-display text-[15px] font-semibold text-[#10241A]">
          All hospitals map
        </h3>
        <span className="text-[12px] text-[#6B7280]">
          {pinned.length} of {clinics.length} with a map pin
        </span>
      </div>
      {pinned.length > 0 ? (
        <div
          ref={divRef}
          className="w-full overflow-hidden rounded-[14px] border border-[#E5EDE8] bg-[#F4F7F5] z-0"
          style={{ height: 320 }}
          role="application"
          aria-label="Map of all hospitals"
        />
      ) : (
        <p className="text-[13px] text-[#6B7280] bg-[#F4F7F5] border border-dashed border-[#E5EDE8] rounded-[12px] px-4 py-6 text-center">
          No map pins yet — edit a hospital to add latitude and longitude and
          it will show up here.
        </p>
      )}
    </Panel>
  );
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
