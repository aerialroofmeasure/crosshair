"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force scroll to top whenever the route changes.
 * Next.js App Router *should* do this by default, but some interactions
 * (sticky elements, animated transforms, footer-located links) can leave
 * the page mid-scroll on navigation. Belt and suspenders.
 *
 * Uses `instant` behavior so the user doesn't see a smooth-scroll animation
 * during the transition — they just land at the top of the new page.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
