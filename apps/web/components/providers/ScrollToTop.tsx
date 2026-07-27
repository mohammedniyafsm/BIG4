"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser automatic scroll restoration
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force instant scroll to top on route/pathname change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    // Refresh GSAP ScrollTrigger if active
    if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
      setTimeout(() => {
        (window as any).ScrollTrigger.refresh();
      }, 50);
    }
  }, [pathname]);

  return null;
}
