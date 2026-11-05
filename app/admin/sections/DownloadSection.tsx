"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Panel } from "../ui";

export function DownloadSection({
  url,
  onSave,
}: {
  url: string;
  onSave: (url: string) => Promise<boolean>;
}) {
  const [value, setValue] = useState(url);
  const [saving, setSaving] = useState(false);
  const dirty = value.trim() !== url;

  async function save(next: string) {
    setSaving(true);
    const ok = await onSave(next);
    setSaving(false);
    if (ok) setValue(next.trim());
  }

  return (
    <Panel>
      <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
        Download link
      </h2>
      <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
        Where the landing page&apos;s &ldquo;Download for Android&rdquo; button
        goes (Google Play or a direct APK link). Leave empty to show the
        &ldquo;Coming soon&rdquo; popup instead.
      </p>

      <form
        className="mt-4 flex flex-col sm:flex-row gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (dirty && !saving) save(value);
        }}
      >
        <input
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://play.google.com/store/apps/details?id=…"
          className="h-12 rounded-[14px] bg-white border border-[#E5EDE8] px-4 text-[14px] text-[#10241A] placeholder:text-[#9CA3AF] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/15 w-full min-w-0"
        />
        <button
          type="submit"
          disabled={!dirty || saving}
          className="px-6 py-3 rounded-full custom-pill-cta text-white text-[14px] font-medium shadow-md flex items-center justify-center min-h-[48px] active:scale-[0.98] disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : "Save"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px]">
        <span className="text-[#6B7280]">
          Live now:{" "}
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#15803D] font-medium underline underline-offset-4 break-all inline-flex items-center gap-1"
            >
              {url}
              <ExternalLink size={13} className="shrink-0" />
            </a>
          ) : (
            <span className="font-medium text-[#10241A]">
              not set (&ldquo;Coming soon&rdquo; popup)
            </span>
          )}
        </span>
        {url ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => save("")}
            className="px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium hover:bg-[#EAF6EE] disabled:opacity-50"
          >
            Clear link
          </button>
        ) : null}
      </div>
    </Panel>
  );
}
