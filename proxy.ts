import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Belt-and-suspenders: tell crawlers never to index the hidden admin page,
// even if the URL leaks. Auth itself is enforced in the page Server Component.
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet"
    );
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
