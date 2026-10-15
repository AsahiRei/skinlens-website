import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — SkinLens",
  description: "Internal admin.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#131e19] font-body">
      {children}
    </div>
  );
}
