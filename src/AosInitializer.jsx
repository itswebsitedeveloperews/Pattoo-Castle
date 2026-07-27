"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AosInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });

    window.addEventListener("load", AOS.refreshHard);

    return () => {
      window.removeEventListener("load", AOS.refreshHard);
    };
  }, []);

  return null;
}
