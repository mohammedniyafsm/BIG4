"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function PageLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
      },
    });

    tl.to(".page-loader", {
      y: "-100%",
      duration: 0.8,
      ease: "power4.inOut",
      delay: 0.4,
    });
  }, []);

  if (!show) return null;

  return (
    <div className="page-loader fixed inset-0 z-[9999] bg-[#111111]" />
  );
}